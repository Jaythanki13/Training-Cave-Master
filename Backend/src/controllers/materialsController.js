import { query } from '../config/database.js';
import { uploadToS3, deleteFromS3, getSignedUrl, validateFile } from '../utils/s3.js';
import { sendMaterialUploadedNotification } from '../utils/email.js';

// Upload new training material
export const uploadMaterial = async (req, res) => {
  try {
    const { title, description, categoryId, tags, trainingDate, trainingType } = req.body;
    const file = req.file;

    // Validate required fields
    if (!title || !description || !categoryId || !trainingDate || !trainingType || !file) {
      return res.status(400).json({ 
        error: 'Title, description, category, training date, training type, and file are required' 
      });
    }

    // Validate file
    try {
      validateFile(file);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }

    // Upload to S3
    const s3Result = await uploadToS3(file, 'materials');

    // Get file extension
    const fileExtension = file.originalname.split('.').pop().toLowerCase();

    // Parse tags (comma-separated string to array)
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : [];

    // Admin can upload on behalf of another trainer by passing trainerId
    const uploaderId =
      req.user.role === 'super_admin' && req.body.trainerId
        ? req.body.trainerId
        : req.user.id;

    // Insert material into database
    const result = await query(
      `INSERT INTO materials (
        trainer_id, title, description, category_id, tags,
        file_name, file_url, file_size, file_type, file_mime_type,
        training_date, training_type
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, title, uploaded_at`,
      [
        uploaderId,
        title,
        description,
        categoryId,
        tagsArray,
        file.originalname,
        s3Result.key, // Store S3 key, not full URL
        file.size,
        fileExtension,
        file.mimetype,
        trainingDate,
        trainingType
      ]
    );

    const material = result.rows[0];

    // Send notification to admin
    await sendMaterialUploadedNotification(title, req.user.full_name);

    res.status(201).json({
      message: 'Material uploaded successfully',
      material: {
        id: material.id,
        title: material.title,
        uploadedAt: material.uploaded_at
      }
    });
  } catch (error) {
    console.error('Upload material error:', error);
    res.status(500).json({ error: 'Failed to upload material' });
  }
};

// Get all materials (with filtering and pagination)
export const getMaterials = async (req, res) => {
  try {
    const { 
      category, 
      search, 
      fileType, 
      sortBy = 'newest',
      page = 1,
      limit = 12 
    } = req.query;

    let queryText = `
      SELECT 
        m.id, m.title, m.description, m.file_type, m.file_size,
        m.download_count, m.rating_avg, m.rating_count, m.uploaded_at,
        c.name as category_name,
        u.full_name as trainer_name,
        u.id as trainer_id
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      JOIN users u ON m.trainer_id = u.id
      WHERE m.status = 'active'
    `;

    const params = [];
    let paramCount = 1;

    // Filter by category
    if (category && category !== 'all') {
      queryText += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Filter by file type
    if (fileType && fileType !== 'all') {
      queryText += ` AND m.file_type = $${paramCount}`;
      params.push(fileType);
      paramCount++;
    }

    // Search in title and description
    if (search) {
      queryText += ` AND (
        m.title ILIKE $${paramCount} OR 
        m.description ILIKE $${paramCount} OR
        u.full_name ILIKE $${paramCount}
      )`;
      params.push(`%${search}%`);
      paramCount++;
    }

    // Sorting
    switch (sortBy) {
      case 'oldest':
        queryText += ' ORDER BY m.uploaded_at ASC';
        break;
      case 'popular':
        queryText += ' ORDER BY m.download_count DESC';
        break;
      case 'rating':
        queryText += ' ORDER BY m.rating_avg DESC, m.rating_count DESC';
        break;
      default: // newest
        queryText += ' ORDER BY m.uploaded_at DESC';
    }

    // Pagination
    const offset = (page - 1) * limit;
    queryText += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    // Execute query
    const result = await query(queryText, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      JOIN users u ON m.trainer_id = u.id
      WHERE m.status = 'active'
    `;

    const countParams = params.slice(0, -2); // Remove limit and offset
    if (category && category !== 'all') {
      countQuery += ` AND c.slug = $1`;
    }
    if (fileType && fileType !== 'all') {
      countQuery += ` AND m.file_type = $${countParams.length}`;
    }
    if (search) {
      countQuery += ` AND (
        m.title ILIKE $${countParams.length} OR 
        m.description ILIKE $${countParams.length} OR
        u.full_name ILIKE $${countParams.length}
      )`;
    }

    const countResult = await query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.json({
      materials: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit)
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
        u.full_name as trainer_name, u.profile_bio as trainer_bio,
        u.expertise_areas as trainer_expertise
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

    // Get material
    const result = await query(
      'SELECT file_url, title FROM materials WHERE id = $1 AND status = $2',
      [id, 'active']
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const material = result.rows[0];

    // Generate signed URL
    const downloadUrl = await getSignedUrl(material.file_url);

    // Record download
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

    // Check if material belongs to user
    const checkResult = await query(
      'SELECT id FROM materials WHERE id = $1 AND trainer_id = $2',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(403).json({ error: 'Not authorized to update this material' });
    }

    // Parse tags
    const tagsArray = tags ? tags.split(',').map(t => t.trim()) : null;

    // Update material
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

    res.json({
      message: 'Material updated successfully',
      material: result.rows[0]
    });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ error: 'Failed to update material' });
  }
};

// Delete material
export const deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;

    // Get material details
    const materialResult = await query(
      'SELECT file_url, trainer_id FROM materials WHERE id = $1',
      [id]
    );

    if (materialResult.rows.length === 0) {
      return res.status(404).json({ error: 'Material not found' });
    }

    const material = materialResult.rows[0];

    // Check authorization (trainer or admin)
    if (material.trainer_id !== req.user.id && req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Not authorized to delete this material' });
    }

    // Delete from S3
    await deleteFromS3(material.file_url);

    // Soft delete from database (set status to deleted)
    await query(
      `UPDATE materials SET status = 'deleted' WHERE id = $1`,
      [id]
    );

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
