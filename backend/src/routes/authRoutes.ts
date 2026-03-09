import express from 'express';
import { register, login, refreshAccessToken, logout } from '../controllers/authController';
import { validate } from '../validations/validate';
import { registerSchema, loginSchema } from '../validations/authValidation';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);
router.post('/logout', protect, logout);

export default router;
