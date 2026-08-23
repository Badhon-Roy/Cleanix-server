export interface INewBookingPricing {
  _id?: string;
  baseFee: number;
  sqftRate: number;
  bedroomRate: number;
  bathroomRate: number;
  updatedAt?: Date;
}
