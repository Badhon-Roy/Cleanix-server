import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CustomerRoutes } from '../modules/customer/customer.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/customers',
    route: CustomerRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
