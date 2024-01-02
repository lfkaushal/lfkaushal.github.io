import { Router } from 'express';
import { login, signup, refreshToken } from '../controller/auth';

import { validateReqQuery } from '../middleware/validator';
import { loginSchema, signupSchema } from '../schema/auth';

const router = Router();

router.post('/signup', validateReqQuery(signupSchema), signup);

router.post('/login', validateReqQuery(loginSchema), login);

router.get('/refresh', refreshToken);

export default router;
