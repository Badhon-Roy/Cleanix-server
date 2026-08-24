import { Types } from 'mongoose';

export interface ITeamAssignment {
  _id?: Types.ObjectId;
  booking: Types.ObjectId;
  team: Types.ObjectId;
  assignedBy?: Types.ObjectId;
  assignedCleaners?: Types.ObjectId[];
  dispatchNotes?: string;
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  leaderCommission: number;
  cleanerPoolPayout: number;
  adminSharePayout: number;
  assignedAt: Date;
  completedAt?: Date;
  isDeleted?: boolean;
}
