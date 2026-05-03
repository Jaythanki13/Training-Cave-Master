import { query } from '../config/database.js';

// Public trainer profile with their active materials
export const getTrainerProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const trainerResult = await query(
      `SELECT id, full_name, profile_bio, expertise_areas, created_at
       FROM users
       WHERE id = $1 AND role = 'trainer' AND status = 'active'`,
      [id]
    );

    if (trainerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Trainer not found' });
    }

    const trainer = trainerResult.rows[0];

    const materialsResult = await query(
      `SELECT
        m.id, m.title, m.description, m.file_type, m.file_size,
        m.download_count, m.rating_avg, m.rating_count, m.uploaded_at,
        m.training_type, m.tags,
        c.name as category_name
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      WHERE m.trainer_id = $1 AND m.status = 'active'
      ORDER BY m.uploaded_at DESC`,
      [id]
    );

    res.json({ trainer, materials: materialsResult.rows });
  } catch (error) {
    console.error('Get trainer profile error:', error);
    res.status(500).json({ error: 'Failed to get trainer profile' });
  }
};
