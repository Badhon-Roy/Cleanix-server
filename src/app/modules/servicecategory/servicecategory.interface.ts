export interface IServiceOfferItem {
  iconName: string;
  title: string;
  desc: string;
}

export interface IServiceWhyPoint {
  title: string;
  desc: string;
}

export interface IServiceFaqItem {
  num: string;
  question: string;
  answer: string;
}

export interface IServiceCategory {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  badge: string;
  price: string;
  slaTime?: string;
  heroImage?: string;
  contentImage?: string;
  shortDesc: string;
  introParagraph1?: string;
  introParagraph2?: string;
  offersTitle?: string;
  offersDesc?: string;
  offers?: IServiceOfferItem[];
  whyChooseTitle?: string;
  whyChooseDesc?: string;
  whyChoosePoints?: IServiceWhyPoint[];
  faqs?: IServiceFaqItem[];
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
