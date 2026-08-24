import { Types } from 'mongoose';

export type TTeamStatus = 'ACTIVE' | 'INACTIVE';
export type TLeaderRequestStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface ITeam {
  _id?: string;
  teamCode: string;
  teamName: string;
  teamImage: string;
  leader: Types.ObjectId;
  leaderRequestStatus?: TLeaderRequestStatus;
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
