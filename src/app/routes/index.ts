import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { CustomerRoutes } from '../modules/customer/customer.route';
import { LocationRoutes } from '../modules/location/location.route';
import { BookingRoutes } from '../modules/booking/booking.route';
import { AddonRoutes } from '../modules/addon/addon.route';
import { ServiceCategoryRoutes } from '../modules/servicecategory/servicecategory.route';
import { TeamRoutes } from '../modules/team/team.route';
import { CleanerRoutes } from '../modules/cleaner/cleaner.route';
import { CoverageRoutes } from '../modules/coverage/coverage.route';

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
  {
    path: '/locations',
    route: LocationRoutes,
  },
  {
    path: '/bookings',
    route: BookingRoutes,
  },
  {
    path: '/addons',
    route: AddonRoutes,
  },
  {
    path: '/services',
    route: ServiceCategoryRoutes,
  },
  {
    path: '/teams',
    route: TeamRoutes,
  },
  {
    path: '/cleaners',
    route: CleanerRoutes,
  },
  {
    path: '/coverage',
    route: CoverageRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
