import { Router } from 'express';
import { getLoginSchema, getSignupSchema } from '../schema';

import { validateReqBody } from '../middleware/validator';
import AuthController from '../controller/User.controller';

const router = Router();

router.post(
  '/signup',
  validateReqBody(getSignupSchema, false),
  AuthController.signup,
);

router.post(
  '/login',
  validateReqBody(getLoginSchema, false),
  AuthController.login,
);

router.get('/refresh', AuthController.refreshToken);

export default router;
