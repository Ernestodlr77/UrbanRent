import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';

const router = Router();
const authController = new AuthController();
router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticateJWT, authController.profile);
router.put('/me', authenticateJWT, authController.updateProfile);
export default router;
