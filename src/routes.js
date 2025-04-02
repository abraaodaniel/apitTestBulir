import { Router } from 'express';
import UserController from './controllers/UserController.js';
import ServiceController from './controllers/ServiceController.js';
import BookingController from './controllers/BookingController.js';
import auth from './middlewares/auth.js';

const router = Router();

// Public routes
router.post('/users', UserController.register);
router.get('/users', UserController.find);
router.post('/login', UserController.login);
router.delete('/users', UserController.remove);

// Protected routes
router.use(auth);

// Services
router.post('/services', ServiceController.create);
router.get('/services', ServiceController.list);

// Bookings
router.post('/bookings', BookingController.create);
router.get('/bookings', BookingController.list);
router.put('/bookings/:id/cancel', BookingController.cancel);

export default router;