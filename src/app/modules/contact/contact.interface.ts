export type TContactStatus = 'NEW' | 'CONTACTED' | 'RESOLVED' | 'ARCHIVED';

export interface IContact {
  _id?: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  status: TContactStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
