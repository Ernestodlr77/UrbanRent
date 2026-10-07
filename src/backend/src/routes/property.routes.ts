import { Router } from 'express';
import { PropertyController } from '../controllers/property.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';
import { UserRole } from '../models/User.js';

const router = Router();
const propertyController = new PropertyController();

// Rutas protegidas por autenticación JWT
router.use(authenticateJWT);

// Obtener todas las propiedades y buscar por ID
router.get('/', propertyController.getAll);
router.get('/:id', propertyController.getById);

// Crear, actualizar y eliminar propiedades (Restringido a ADMIN y LANDLORD)
router.post('/', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), propertyController.create);
router.put('/:id', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), propertyController.update);
router.delete('/:id', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), propertyController.delete);

export default router;