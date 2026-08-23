export interface IPricingConfig {
  _id?: string;
  baseFee: number;
  sqftRate: number;
  bedroomRate: number;
  bathroomRate: number;
  updatedAt?: Date;
}
