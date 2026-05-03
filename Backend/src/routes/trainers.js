import express from 'express';
import { getTrainerProfile } from '../controllers/trainersController.js';

const router = express.Router();

router.get('/:id', getTrainerProfile);

export default router;
