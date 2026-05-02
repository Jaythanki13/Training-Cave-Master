import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { sendEmail } from '../utils/email.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// User Registration
export const register = async (req, res) => {
  try {
    const { email, password, fullName, role, bio, expertise } = req.body;

    // Validate input
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({ 
        error: 'Email, password, full name, and role are required' 
      });
    }

    // Validate role
    if (!['learner', 'trainer'].includes(role)) {
      return res.status(400).json({ 
        error: 'Role must be either "learner" or "trainer"' 
      });
    }

    // Check if user already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Determine user status (trainers need approval)
    const status = role === 'trainer' ? 'pending' : 'active';

    // Insert user
    const result = await query(
      `INSERT INTO users (email, password_hash, full_name, role, status, profile_bio, expertise_areas)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, full_name, role, status, created_at`,
      [email.toLowerCase(), passwordHash, fullName, role, status, bio, expertise]
    );

    const user = result.rows[0];

    // If trainer, send notification to admin
    if (role === 'trainer') {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: '🔔 New Trainer Registration - Approval Required',
        html: `
          <h2>New Trainer Registration</h2>
          <p><strong>Name:</strong> ${fullName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Bio:</strong> ${bio || 'Not provided'}</p>
          <p><strong>Expertise:</strong> ${expertise || 'Not provided'}</p>
          <p><strong>Registered:</strong> ${new Date().toLocaleString()}</p>
          <br>
          <p>Please log in to the admin panel to approve or reject this trainer.</p>
        `
      });

      return res.status(201).json({
        message: 'Registration successful! Your account is pending approval.',
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          status: user.status
        }
      });
    }

    // For learners, return token immediately
    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Registration successful!',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user from database
    const result = await query(
      `SELECT id, email, password_hash, full_name, role, status 
       FROM users 
       WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if account is pending
    if (user.status === 'pending') {
      return res.status(403).json({ 
        error: 'Your account is pending approval',
        message: 'Trainers must be approved by an administrator before logging in.'
      });
    }

    // Check if account is banned
    if (user.status === 'banned') {
      return res.status(403).json({ 
        error: 'Your account has been suspended',
        message: 'Please contact support for more information.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update last login
    await query(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate token
    const token = generateToken(user.id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, email, full_name, role, status, profile_bio, expertise_areas, created_at, last_login
       FROM users 
       WHERE id = $1`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, expertise } = req.body;
    
    const result = await query(
      `UPDATE users 
       SET full_name = COALESCE($1, full_name),
           profile_bio = COALESCE($2, profile_bio),
           expertise_areas = COALESCE($3, expertise_areas),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING id, email, full_name, role, profile_bio, expertise_areas`,
      [fullName, bio, expertise, req.user.id]
    );

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        error: 'Current password and new password are required' 
      });
    }

    // Get current password hash
    const result = await query(
      'SELECT password_hash FROM users WHERE id = $1',
      [req.user.id]
    );

    const user = result.rows[0];

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash);

    if (!isValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [newPasswordHash, req.user.id]
    );

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
