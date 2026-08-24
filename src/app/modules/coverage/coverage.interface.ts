export interface ICoverageArea {
  _id?: string;
  zoneName: string;
  district: string;
  areasIncluded: string[];
  zipCodes?: string[];
  desc?: string;
  isActive: boolean;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
