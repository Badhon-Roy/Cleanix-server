import { Types } from 'mongoose';

export interface ITeamAssignment {
  _id?: Types.ObjectId;
  booking: Types.ObjectId;
  team: Types.ObjectId;
  assignedBy?: Types.ObjectId;
  assignedCleaners?: Types.ObjectId[];
  dispatchNotes?: string;
  status: 'ASSIGNED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETION_REQUESTED' | 'COMPLETED' | 'CANCELLED';
  leaderCommission: number;
  cleanerPoolPayout: number;
  adminSharePayout: number;
  assignedAt: Date;
  completedAt?: Date;
  isDeleted?: boolean;
}
