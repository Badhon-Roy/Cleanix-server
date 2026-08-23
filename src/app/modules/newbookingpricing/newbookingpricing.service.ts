import { NewBookingPricing } from './newbookingpricing.model';
import { INewBookingPricing } from './newbookingpricing.interface';
import { emitPricingUpdated } from '../../socket/socket';
import { ServiceCategory } from '../servicecategory/servicecategory.model';
import { Addon } from '../addon/addon.model';

const seedPricingIfEmpty = async (): Promise<INewBookingPricing> => {
  let config = await NewBookingPricing.findOne();
  if (!config) {
    config = await NewBookingPricing.create({
      baseFee: 1500,
      sqftRate: 2.5,
      bedroomRate: 500,
      bathroomRate: 400,
    });
  }
  return config;
};

const getPricingConfig = async (): Promise<INewBookingPricing> => {
  const config = await seedPricingIfEmpty();
  return config;
};

const updatePricingConfig = async (
  payload: Partial<INewBookingPricing>,
): Promise<INewBookingPricing> => {
  let config = await NewBookingPricing.findOne();
  if (!config) {
    config = await NewBookingPricing.create({
      baseFee: payload.baseFee ?? 1500,
      sqftRate: payload.sqftRate ?? 2.5,
      bedroomRate: payload.bedroomRate ?? 500,
      bathroomRate: payload.bathroomRate ?? 400,
    });
  } else {
    if (payload.baseFee !== undefined) config.baseFee = Number(payload.baseFee);
    if (payload.sqftRate !== undefined) config.sqftRate = Number(payload.sqftRate);
    if (payload.bedroomRate !== undefined) config.bedroomRate = Number(payload.bedroomRate);
    if (payload.bathroomRate !== undefined) config.bathroomRate = Number(payload.bathroomRate);
    await config.save();
  }

  emitPricingUpdated(config);

  return config;
};

const calculateBookingPrice = async (payload: {
  serviceSlug?: string;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  selectedAddons?: string[];
}) => {
  const config = await seedPricingIfEmpty();

  const sqft = Number(payload.sqft) || 0;
  const bedrooms = Number(payload.bedrooms) || 0;
  const bathrooms = Number(payload.bathrooms) || 0;
  const addonSlugs: string[] = Array.isArray(payload.selectedAddons) ? payload.selectedAddons : [];

  // Base Fee: from selected service category price field
  let baseFee = config.baseFee;
  let categoryName = 'Base Service Fee';

  if (payload.serviceSlug) {
    const serviceDoc = await ServiceCategory.findOne({
      $or: [{ slug: payload.serviceSlug }, { category: payload.serviceSlug }],
      status: 'ACTIVE',
    });
    if (serviceDoc) {
      categoryName = serviceDoc.title.split('(')[0].trim();
      const rawPrice = String(serviceDoc.price || '').replace(/[^0-9.]/g, '');
      const parsed = parseFloat(rawPrice);
      if (!isNaN(parsed) && parsed > 0) baseFee = parsed;
    }
  }

  // Room & Area Charges
  const sqftCost = sqft * config.sqftRate;
  const bedroomCost = bedrooms * config.bedroomRate;
  const bathroomCost = bathrooms * config.bathroomRate;

  // Addons
  const addonDocs = addonSlugs.length
    ? await Addon.find({ slug: { $in: addonSlugs }, active: true, isDeleted: false })
    : [];

  const addonsBreakdown = addonDocs.map((a) => ({
    slug: a.slug,
    name: a.name,
    price: a.price,
  }));

  const addonsTotal = addonsBreakdown.reduce((sum, a) => sum + (a.price || 0), 0);
  const totalAmount = baseFee + sqftCost + bedroomCost + bathroomCost + addonsTotal;

  return {
    categoryName,
    baseFee,
    sqft,
    sqftRate: config.sqftRate,
    sqftCost,
    bedrooms,
    bedroomRate: config.bedroomRate,
    bedroomCost,
    bathrooms,
    bathroomRate: config.bathroomRate,
    bathroomCost,
    addons: addonsBreakdown,
    addonsTotal,
    totalAmount,
  };
};

export const NewBookingPricingService = {
  getPricingConfig,
  updatePricingConfig,
  calculateBookingPrice,
};
