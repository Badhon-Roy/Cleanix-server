import { Types } from 'mongoose';

export type TTeamStatus = 'ACTIVE' | 'INACTIVE';

export interface ITeam {
  _id?: string;
  teamCode: string;
  teamName: string;
  teamImage: string;
  leader: Types.ObjectId;
  members: Types.ObjectId[];
  zone: string;
  commissionRate: number; // default 10 (10% Team Leader Cut)
  cleanerPoolShare: number; // default 40 (40% Cleaners Pool Share)
  adminShare: number; // default 50 (50% Admin Net)
  status: TTeamStatus;
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
