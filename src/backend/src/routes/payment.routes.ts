import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/role.middleware.js';
import { UserRole } from '../models/User.js';

const router = Router();
const paymentController = new PaymentController();

// Rutas protegidas por autenticación JWT
router.use(authenticateJWT);

// Consultar pagos y detalle por contrato
router.get('/', paymentController.getAll);
router.get('/contract/:contractId', paymentController.getByContract);

// Registrar pago
router.post('/', paymentController.registerPayment);
router.put('/:id', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), paymentController.update);
router.delete('/:id', checkRole([UserRole.ADMIN, UserRole.LANDLORD]), paymentController.delete);

// Resumen financiero ejecutivo (Restringido a ADMIN)
router.get('/summary', checkRole([UserRole.ADMIN]), paymentController.getFinancialSummary);

export default router;