import { query } from '../config/database.js';
import { sendTrainerApprovedEmail, sendTrainerRejectedEmail } from '../utils/email.js';

// Get pending trainer applications
export const getPendingTrainers = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, full_name, profile_bio, expertise_areas, created_at
       FROM users
       WHERE role = 'trainer' AND status = 'pending'
       ORDER BY created_at DESC`
    );

    res.json({ trainers: result.rows });
  } catch (error) {
    console.error('Get pending trainers error:', error);
    res.status(500).json({ error: 'Failed to get pending trainers' });
  }
};

// Approve trainer
export const approveTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    // Get trainer details
    const trainer Result = await query(
      'SELECT email, full_name FROM users WHERE id = $1 AND role = $'trainer' AND status = $'pending'',
      [id]
    );

    if (trainerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pending trainer not found' });
    }

    const trainer = trainerResult.rows[0];

    // Update status to active
    await query(
      'UPDATE users SET status = $'active', updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    // Send approval email
    await sendTrainerApprovedEmail(trainer.email, trainer.full_name);

    res.json({ message: 'Trainer approved successfully' });
  } catch (error) {
    console.error('Approve trainer error:', error);
    res.status(500).json({ error: 'Failed to approve trainer' });
  }
};

// Reject trainer
export const rejectTrainer = async (req, res) => {
  try {
    const { id } = req.params;

    // Get trainer details
    const trainerResult = await query(
      'SELECT email, full_name FROM users WHERE id = $1 AND role = $'trainer' AND status = $'pending'',
      [id]
    );

    if (trainerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Pending trainer not found' });
    }

    const trainer = trainerResult.rows[0];

    // Delete user (they can re-register later)
    await query('DELETE FROM users WHERE id = $1', [id]);

    // Send rejection email
    await sendTrainerRejectedEmail(trainer.email, trainer.full_name);

    res.json({ message: 'Trainer application rejected' });
  } catch (error) {
    console.error('Reject trainer error:', error);
    res.status(500).json({ error: 'Failed to reject trainer' });
  }
};

// Get all users (with filtering)
export const getAllUsers = async (req, res) => {
  try {
    const { role, status, search } = req.query;

    let queryText = `
      SELECT id, email, full_name, role, status, created_at, last_login
      FROM users
      WHERE 1=1
    `;

    const params = [];
    let paramCount = 1;

    if (role) {
      queryText += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (status) {
      queryText += ` AND status = $${paramCount}`;
      params.push(status);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (full_name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    queryText += ' ORDER BY created_at DESC';

    const result = await query(queryText, params);

    res.json({ users: result.rows });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

// Ban user
export const banUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Cannot ban super admin
    const userCheck = await query('SELECT role FROM users WHERE id = $1', [id]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userCheck.rows[0].role === 'super_admin') {
      return res.status(403).json({ error: 'Cannot ban super admin' });
    }

    await query(
      'UPDATE users SET status = $'banned', updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [id]
    );

    res.json({ message: 'User banned successfully' });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ error: 'Failed to ban user' });
  }
};

// Unban user
export const unbanUser = async (req, res) => {
  try {
    const { id } = req.params;

    await query(
      'UPDATE users SET status = $'active', updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [id]
    );

    res.json({ message: 'User unbanned successfully' });
  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({ error: 'Failed to unban user' });
  }
};

// Get platform statistics
export const getStats = async (req, res) => {
  try {
    // Total users by role
    const usersResult = await query(`
      SELECT 
        COUNT(*) FILTER (WHERE role = 'learner') as learners,
        COUNT(*) FILTER (WHERE role = 'trainer' AND status = 'active') as trainers,
        COUNT(*) FILTER (WHERE role = 'trainer' AND status = 'pending') as pending_trainers,
        COUNT(*) as total_users
      FROM users
    `);

    // Total materials
    const materialsResult = await query(`
      SELECT COUNT(*) as total_materials
      FROM materials
      WHERE status = 'active'
    `);

    // Total downloads
    const downloadsResult = await query(`
      SELECT 
        SUM(download_count) as total_downloads,
        AVG(rating_avg) as average_rating
      FROM materials
      WHERE status = 'active'
    `);

    // This week's stats
    const weekResult = await query(`
      SELECT 
        COUNT(DISTINCT u.id) FILTER (WHERE u.created_at >= NOW() - INTERVAL '7 days') as new_users,
        COUNT(DISTINCT m.id) FILTER (WHERE m.uploaded_at >= NOW() - INTERVAL '7 days') as new_materials,
        COUNT(d.id) FILTER (WHERE d.downloaded_at >= NOW() - INTERVAL '7 days') as week_downloads
      FROM users u
      FULL OUTER JOIN materials m ON 1=1
      FULL OUTER JOIN downloads d ON 1=1
    `);

    res.json({
      stats: {
        users: usersResult.rows[0],
        materials: materialsResult.rows[0].total_materials,
        downloads: downloadsResult.rows[0].total_downloads || 0,
        averageRating: parseFloat(downloadsResult.rows[0].average_rating || 0).toFixed(2),
        thisWeek: weekResult.rows[0]
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

// Get all materials (admin view)
export const getAllMaterials = async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        m.id, m.title, m.file_type, m.download_count, m.rating_avg,
        m.uploaded_at, m.status,
        c.name as category_name,
        u.full_name as trainer_name
      FROM materials m
      JOIN categories c ON m.category_id = c.id
      JOIN users u ON m.trainer_id = u.id
      ORDER BY m.uploaded_at DESC
    `);

    res.json({ materials: result.rows });
  } catch (error) {
    console.error('Get all materials error:', error);
    res.status(500).json({ error: 'Failed to get materials' });
  }
};
