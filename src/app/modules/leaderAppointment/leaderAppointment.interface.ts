import { Types } from 'mongoose';

export type TAppointmentStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface ILeaderAppointment {
  _id?: string;
  team: Types.ObjectId;
  cleaner: Types.ObjectId;
  status: TAppointmentStatus;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
