export interface IAddon {
  slug: string;
  name: string;
  subLabel: string;
  price: number;
  tag?: string;
  iconName?: string;
  active: boolean;
  isDeleted?: boolean;
}
