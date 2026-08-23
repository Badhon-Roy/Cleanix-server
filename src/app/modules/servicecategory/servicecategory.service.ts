import { ServiceCategory } from './servicecategory.model';
import { IServiceCategory } from './servicecategory.interface';
import AppError from '../../errors/AppError';
import { emitServiceUpdated } from '../../socket/socket';

const getActiveServices = async (): Promise<IServiceCategory[]> => {
  const services = await ServiceCategory.find({ status: 'ACTIVE', isDeleted: false }).sort({
    createdAt: 1,
  });
  return services;
};

const getAllServicesAdmin = async (): Promise<IServiceCategory[]> => {
  const services = await ServiceCategory.find({ isDeleted: false }).sort({ createdAt: 1 });
  return services;
};

const getSingleServiceBySlug = async (slug: string): Promise<IServiceCategory> => {
  const service = await ServiceCategory.findOne({ slug, isDeleted: false });
  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }
  return service;
};

const createService = async (payload: Partial<IServiceCategory>): Promise<IServiceCategory> => {
  if (!payload.title || !payload.shortDesc) {
    throw new AppError(400, 'Service title and short description are required!');
  }

  const slug =
    payload.slug ||
    payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const existing = await ServiceCategory.findOne({ slug, isDeleted: false });
  if (existing) {
    throw new AppError(400, 'A service category with this title or slug already exists!');
  }

  const newService = await ServiceCategory.create({
    slug,
    title: payload.title,
    category: (payload.category || 'HOME CARE').toUpperCase(),
    badge: (payload.badge || 'B2C HOME CLEANING').toUpperCase(),
    price: payload.price || '৳3,500',
    slaTime: payload.slaTime || '30 Mins SLA',
    heroImage: payload.heroImage || '/RESIDENTIAL-DEEP-CLEANING.png',
    contentImage:
      payload.contentImage ||
      'https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400',
    shortDesc: payload.shortDesc,
    introParagraph1: payload.introParagraph1 || payload.shortDesc,
    introParagraph2: payload.introParagraph2 || '',
    status: payload.status || 'ACTIVE',
  });

  emitServiceUpdated({ action: 'create', service: newService });

  return newService;
};

const updateService = async (
  serviceId: string,
  payload: Partial<IServiceCategory>,
): Promise<IServiceCategory> => {
  const service = await ServiceCategory.findOne({
    $or: [{ _id: serviceId }, { slug: serviceId }],
    isDeleted: false,
  });

  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }

  const updatedService = await ServiceCategory.findOneAndUpdate(
    { _id: service._id, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedService) {
    throw new AppError(500, 'Failed to update service!');
  }

  emitServiceUpdated({ action: 'update', service: updatedService });

  return updatedService;
};

const deleteService = async (serviceId: string): Promise<null> => {
  const service = await ServiceCategory.findOne({
    $or: [{ _id: serviceId }, { slug: serviceId }],
    isDeleted: false,
  });

  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }

  await ServiceCategory.findOneAndUpdate({ _id: service._id }, { isDeleted: true });

  emitServiceUpdated({ action: 'delete', serviceId: service._id });

  return null;
};

const getCatalogOverview = async () => {
  const allServices = await ServiceCategory.find({ isDeleted: false });
  const activeServicesList = allServices.filter((s) => s.status === 'ACTIVE');

  const totalServices = allServices.length;
  const activeServices = activeServicesList.length;

  let minPrice = 3500;
  if (activeServicesList.length > 0) {
    const prices = activeServicesList
      .map((s) => {
        const num = parseFloat(String(s.price).replace(/[^0-9.]/g, ''));
        return isNaN(num) || num <= 0 ? null : num;
      })
      .filter((p): p is number => p !== null);

    if (prices.length > 0) {
      minPrice = Math.min(...prices);
    }
  }
  const startingRate = `৳${minPrice.toLocaleString()}`;

  let avgSlaResponse = '25-30 Mins';
  const slaNumbers: number[] = [];
  activeServicesList.forEach((s) => {
    if (s.slaTime) {
      const matches = s.slaTime.match(/\d+/g);
      if (matches) {
        matches.forEach((m) => {
          const num = parseInt(m, 10);
          if (!isNaN(num) && num > 0) slaNumbers.push(num);
        });
      }
    }
  });

  if (slaNumbers.length > 0) {
    const minSla = Math.min(...slaNumbers);
    const maxSla = Math.max(...slaNumbers);
    avgSlaResponse = minSla === maxSla ? `${minSla} Mins` : `${minSla}-${maxSla} Mins`;
  }

  return {
    totalServices,
    activeServices,
    startingRate,
    avgSlaResponse,
  };
};

export const ServiceCategoryService = {
  getActiveServices,
  getAllServicesAdmin,
  getSingleServiceBySlug,
  getCatalogOverview,
  createService,
  updateService,
  deleteService,
};
