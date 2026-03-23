import { Router } from 'express';
import authRoutes from '@src/modules/auth/interface/auth.routes';

const v1Router = Router();
v1Router.use('/auth', authRoutes);


export default v1Router;