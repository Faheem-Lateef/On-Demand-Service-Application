import express from 'express';
import { register, login, refreshAccessToken } from '../controllers/authController';

import { validate } from '../validations/validate';
import { registerSchema, loginSchema } from '../validations/authValidation';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);

export default router;
