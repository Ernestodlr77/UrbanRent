import { Router } from 'express';
import { ContractController } from '../controllers/contract.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';
import { UserRole } from '../models/User.js';

const router = Router();
const contractController = new ContractController();

// Rutas protegidas por autenticación JWT
router.use(authenticateJWT);

// Obtener lista de contratos y detalles
router.get('/', contractController.getAll);
router.get('/:id', contractController.getById);

// Crear nuevo contrato y cambiar estado (Restringido a ADMIN y LANDLORD)
router.post('/', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), contractController.create);
router.patch('/:id/status', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), contractController.updateStatus);
router.put('/:id', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), contractController.update);
router.delete('/:id', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), contractController.delete);

export default router;