export interface IPlan {
  _id?: string;
  id: string;
  title: string;
  subtitleBn: string;
  price: string;
  pricePeriodBn?: string;
  category?: string;
  active: boolean;
  isPopular: boolean;
  popularLabel?: string;
  vipBadge?: string;
  isAddonFree?: boolean;
  ctaText?: string;
  ctaHref?: string;
  features: string[];
  order?: number;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
