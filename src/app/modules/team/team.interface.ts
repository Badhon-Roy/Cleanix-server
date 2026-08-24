import { Types } from 'mongoose';

export type TTeamStatus = 'ACTIVE' | 'INACTIVE';

export interface ITeam {
  _id?: string;
  teamCode: string;
  teamName: string;
  teamImage: string;
  leader: Types.ObjectId;
  members: Types.ObjectId[];
  zone: Types.ObjectId;
  commissionRate: number;
  cleanerPoolShare: number; 
  adminShare: number;
  status: TTeamStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
