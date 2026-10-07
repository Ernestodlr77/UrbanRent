import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router=Router(); const controller=new DashboardController(); router.get('/stats', authenticateJWT, controller.stats); export default router;
