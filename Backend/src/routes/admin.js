import express from 'express';
import {
  getPendingTrainers,
  approveTrainer,
  rejectTrainer,
  createTrainer,
  getAllUsers,
  banUser,
  unbanUser,
  getStats,
  getAllMaterials
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate, authorize('super_admin'));

router.get('/trainers/pending', getPendingTrainers);
router.post('/trainers', createTrainer);
router.post('/trainers/:id/approve', approveTrainer);
router.post('/trainers/:id/reject', rejectTrainer);
router.get('/users', getAllUsers);
router.post('/users/:id/ban', banUser);
router.post('/users/:id/unban', unbanUser);
router.get('/stats', getStats);
router.get('/materials', getAllMaterials);

export default router;
