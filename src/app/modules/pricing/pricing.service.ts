import { PricingConfig } from './pricing.model';
import { IPricingConfig } from './pricing.interface';
import { emitPricingUpdated } from '../../socket/socket';

const seedPricingIfEmpty = async (): Promise<IPricingConfig> => {
  let config = await PricingConfig.findOne();
  if (!config) {
    config = await PricingConfig.create({
      baseFee: 1500,
      sqftRate: 2.5,
      bedroomRate: 500,
      bathroomRate: 400,
    });
  }
  return config;
};

const getPricingConfig = async (): Promise<IPricingConfig> => {
  const config = await seedPricingIfEmpty();
  return config;
};

const updatePricingConfig = async (payload: Partial<IPricingConfig>): Promise<IPricingConfig> => {
  let config = await PricingConfig.findOne();
  if (!config) {
    config = await PricingConfig.create({
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

export const PricingService = {
  getPricingConfig,
  updatePricingConfig,
};
