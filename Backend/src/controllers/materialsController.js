import { query } from '../config/database.js';
import { uploadToS3, deleteFromS3, getSignedUrl, validateFile } from '../utils/s3.js';
import { sendMaterialUploadedNotification } from '../utils/email.js';

// Upload new training material
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, categoryId, tags, trainingDate, trainingType } = req.body;
    const file = req.file;

    if (!title || !description || !categoryId || !trainingDate || !trainingType || !file) {
      return res.status(400).json({
        error: 'Title, description, category, training date, training type, and file are required'
      });
    }

    try {
      validateFile(file);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    const s3Result = await uploadToS3(file, 'materials');
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];

    const uploaderId =
      req.user.role === 'super_admin' && req.body.trainerId
        ? req.body.trainerId
        : req.user.id;

    const result = await query(
      `INSERT INTO materials (
        trainer_id, title, description, category_id, tags,
        file_name, file_url, file_size, file_type, file_mime_type,
        training_date, training_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, title, uploaded_at`,
      [
        uploaderId, title, description, categoryId, tagsArray,
        file.originalname, s3Result.key, file.size, fileExtension,
        file.mimetype, trainingDate, trainingType
      ]
    );

    const material = result.rows[0];
    await sendMaterialUploadedNotification(title, req.user.full_name);

    res.status(201).json({
      message: 'Material uploaded successfully',
      material: { id: material.id, title: material.title, uploadedAt: material.uploaded_at }
    });
  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({ error: 'Failed to upload material' });
  }
};

// Get all materials (with filtering, sorting, and pagination)
export const getMaterials = async (req, res) => {
  try {
    const {
      category, search, fileType, trainingType, minRating,
      sortBy = 'newest', page = 1, limit = 12
    } = req.query;

    const conditions = ["m.status = 'active'"];
    const params = [];
    let p = 1;

    if (category && category !== 'all') {
      conditions.push(`c.slug = $${p++}`);
      params.push(category);
    }
    if (fileType && fileType !== 'all') {
      conditions.push(`m.file_type = $${p++}`);
      params.push(fileType);
    }
    if (trainingType && trainingType !== 'all') {
      conditions.push(`m.training_type = $${p++}`);
      params.push(trainingType);
    }
    if (minRating && parseFloat(minRating) > 0) {
      conditions.push(`m.rating_avg >= $${p++} AND m.rating_count > 0`);
      params.push(parseFloat(minRating));
    }
    if (search) {
      conditions.push(`(m.title ILIKE $${p} OR m.description ILIKE $${p} OR u.full_name ILIKE $${p})`);
      params.push(`%${search}%`);
      p++;
    }

    const whereClause = conditions.join(' AND ');
    const orderMap = {
      oldest: 'm.uploaded_at ASC',
      popular: 'm.download_count DESC',
      rating: 'm.rating_avg DESC, m.rating_count DESC',
      newest: 'm.uploaded_at DESC',
    };
    const orderBy = orderMap[sortBy] || orderMap.newest;

    const baseFrom = `
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      JOIN users u ON m.trainer_id = u.id
      WHERE ${whereClause}
    `;

    const countResult = await query(`SELECT COUNT(*) as total ${baseFrom}`, params);
    const total = parseInt(countResult.rows[0].total);

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataResult = await query(
      `SELECT
        m.id, m.title, m.description, m.file_type, m.file_size,
        m.download_count, m.rating_avg, m.rating_count,
        m.uploaded_at, m.training_type, m.training_date, m.tags,
        c.name as category_name,
        u.full_name as trainer_name,
        u.id as trainer_id
       ${baseFrom}
       ORDER BY ${orderBy}
       LIMIT $${p} OFFSET $${p + 1}`,
      [...params, parseInt(limit), offset]
    );

    res.json({
      materials: dataResult.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ error: 'Failed to get materials' });
  }
};

// Get single material details
export const getMaterialById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT
        m.*,
        c.name as category_name, c.slug as category_slug,
        u.full_name as trainer_name, u.id as trainer_id,
        u.profile_bio as trainer_bio, u.expertise_areas as trainer_expertise
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      JOIN users u ON m.trainer_id = u.id
      WHERE m.id = $1 AND m.status = 'active'`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    res.json({ material: result.rows[0] });
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ error: 'Failed to get material' });
  }
};

// Download material (generates signed URL)
export const downloadMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'SELECT file_url, title FROM materials WHERE id = $1 AND status = $2',
      [id, 'active']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const material = result.rows[0];
    const downloadUrl = await getSignedUrl(material.file_url);

    if (req.user) {
      await query(
        'INSERT INTO downloads (material_id, user_id) VALUES ($1, $2)',
        [id, req.user.id]
      );
    }

    res.json({ downloadUrl, fileName: material.title });
  } catch (error) {
    console.error('Download material error:', error);
    res.status(500).json({ error: 'Failed to generate download link' });
  }
};

// Get trainer's own materials
export const getMyMaterials = async (req, res) => {
  try {
    const result = await query(
      `SELECT
        m.id, m.title, m.description, m.file_type, m.file_size,
        m.download_count, m.rating_avg, m.rating_count, m.uploaded_at,
        m.training_date, m.training_type, m.status,
        c.name as category_name
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      WHERE m.trainer_id = $1
      ORDER BY m.uploaded_at DESC`,
      [req.user.id]
    );

    res.json({ materials: result.rows });
  } catch (error) {
    console.error('Get my materials error:', error);
    res.status(500).json({ error: 'Failed to get materials' });
  }
};

// Update material
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, categoryId, tags, trainingDate, trainingType } = req.body;

    const checkResult = await query(
      'SELECT id FROM materials WHERE id = $1 AND trainer_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this material' });
    }

    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : null;

    const result = await query(
      `UPDATE materials
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           category_id = COALESCE($3, category_id),
           tags = COALESCE($4, tags),
           training_date = COALESCE($5, training_date),
           training_type = COALESCE($6, training_type),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING id, title, updated_at`,
      [title, description, categoryId, tagsArray, trainingDate, trainingType, id]
    );

    res.json({ message: 'Material updated successfully', material: result.rows[0] });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ error: 'Failed to update material' });
  }
};

// Delete material
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    const materialResult = await query(
      'SELECT file_url, trainer_id FROM materials WHERE id = $1',
      [id]
    );

    if (materialResult.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const material = materialResult.rows[0];

    if (material.trainer_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized to delete this material' });
    }

    await deleteFromS3(material.file_url);
    await query(`UPDATE materials SET status = 'deleted' WHERE id = $1`, [id]);

    res.json({ message: 'Material deleted successfully' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ error: 'Failed to delete material' });
  }
};

// Get categories
export const getCategories = async (req, res) => {
  try {
    const result = await query(
      'SELECT id, name, slug, description FROM categories WHERE is_active = true ORDER BY display_order'
    );
    res.json({ categories: result.rows });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
};

// Rate a material (submit or update rating)
export const rateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, review } = req.body;

    if (!rating || parseInt(rating) < 1 || parseInt(rating) > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const material = await query(
      'SELECT id FROM materials WHERE id = $1 AND status = $2',
      [id, 'active']
    );
    if (material.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    await query(
      `INSERT INTO ratings (material_id, user_id, rating, review)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (material_id, user_id)
       DO UPDATE SET rating = $3, review = $4, updated_at = CURRENT_TIMESTAMP`,
      [id, req.user.id, parseInt(rating), review || null]
    );

    const updated = await query(
      'SELECT rating_avg, rating_count FROM materials WHERE id = $1',
      [id]
    );

    res.json({
      message: 'Rating submitted',
      rating_avg: updated.rows[0].rating_avg,
      rating_count: updated.rows[0].rating_count
    });
  } catch (error) {
    console.error('Rate material error:', error);
    res.status(500).json({ error: 'Failed to submit rating' });
  }
};

// Get ratings for a material
export const getMaterialRatings = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      `SELECT r.rating, r.review, r.created_at, u.full_name
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.material_id = $1
       ORDER BY r.created_at DESC
       LIMIT 20`,
      [id]
    );

    let userRating = null;
    if (req.user) {
      const own = await query(
        'SELECT rating, review FROM ratings WHERE material_id = $1 AND user_id = $2',
        [id, req.user.id]
      );
      if (own.rows.length > 0) userRating = own.rows[0];
    }

    res.json({ ratings: result.rows, userRating });
  } catch (error) {
    console.error('Get ratings error:', error);
    res.status(500).json({ error: 'Failed to get ratings' });
  }
};

// Toggle bookmark on a material
export const toggleBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = await query(
      'SELECT id FROM bookmarks WHERE user_id = $1 AND material_id = $2',
      [userId, id]
    );

    if (existing.rows.length > 0) {
      await query(
        'DELETE FROM bookmarks WHERE user_id = $1 AND material_id = $2',
        [userId, id]
      );
      return res.json({ bookmarked: false });
    }

    await query(
      'INSERT INTO bookmarks (user_id, material_id) VALUES ($1, $2)',
      [userId, id]
    );
    res.json({ bookmarked: true });
  } catch (error) {
    console.error('Toggle bookmark error:', error);
    res.status(500).json({ error: 'Failed to toggle bookmark' });
  }
};

// Get all bookmarked materials for the current user
export const getBookmarked = async (req, res) => {
  try {
    const result = await query(
      `SELECT
        m.id, m.title, m.description, m.file_type, m.file_size,
        m.download_count, m.rating_avg, m.rating_count, m.uploaded_at,
        m.training_type, m.training_date, m.tags,
        c.name as category_name,
        u.full_name as trainer_name,
        u.id as trainer_id,
        b.created_at as bookmarked_at
      FROM bookmarks b
      JOIN materials m ON b.material_id = m.id
      JOIN categories c ON m.category_id = c.id
      JOIN users u ON m.trainer_id = u.id
      WHERE b.user_id = $1 AND m.status = 'active'
      ORDER BY b.created_at DESC`,
      [req.user.id]
    );

    res.json({ materials: result.rows });
  } catch (error) {
    console.error('Get bookmarked error:', error);
    res.status(500).json({ error: 'Failed to get bookmarked materials' });
  }
};

// Get IDs of all materials bookmarked by the current user
export const getBookmarkedIds = async (req, res) => {
  try {
    const result = await query(
      'SELECT material_id FROM bookmarks WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ ids: result.rows.map(r => r.material_id) });
  } catch (error) {
    console.error('Get bookmarked IDs error:', error);
    res.status(500).json({ error: 'Failed to get bookmarks' });
  }
};
