export interface IAddon {
  slug: string;
  name: string;
  subLabel: string;
  price: number;
  tag?: string;
  iconImage?: string;
  active: boolean;
  isDeleted?: boolean;
}
