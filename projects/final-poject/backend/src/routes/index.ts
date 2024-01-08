import { Router } from 'express';
import userRoutes from './user.routes';
import realtorRoutes from './realtor.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/realtors', realtorRoutes);

export default router;
