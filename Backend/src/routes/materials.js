import express from 'express';
import multer from 'multer';
import {
  uploadMaterial,
  getMaterials,
  getMaterialById,
  downloadMaterial,
  getMyMaterials,
  updateMaterial,
  deleteMaterial,
  getCategories,
  rateMaterial,
  getMaterialRatings,
  toggleBookmark,
  getBookmarked,
  getBookmarkedIds,
} from '../controllers/materialsController.js';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 1073741824,
  },
});

router.get('/', optionalAuth, getMaterials);
router.get('/categories', getCategories);
router.get('/my/materials', authenticate, authorize('trainer'), getMyMaterials);
router.get('/bookmarked', authenticate, getBookmarked);
router.get('/bookmarked/ids', authenticate, getBookmarkedIds);
router.get('/:id', optionalAuth, getMaterialById);
router.get('/:id/download', optionalAuth, downloadMaterial);
router.get('/:id/ratings', optionalAuth, getMaterialRatings);

router.post('/', authenticate, authorize('trainer', 'super_admin'), upload.single('file'), uploadMaterial);
router.post('/:id/rate', authenticate, rateMaterial);
router.post('/:id/bookmark', authenticate, toggleBookmark);

router.put('/:id', authenticate, authorize('trainer'), updateMaterial);
router.delete('/:id', authenticate, authorize('trainer', 'super_admin'), deleteMaterial);

export default router;
