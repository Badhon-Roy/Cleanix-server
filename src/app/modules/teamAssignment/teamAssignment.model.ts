import { Schema, model } from 'mongoose';
import { ITeamAssignment } from './teamAssignment.interface';

const teamAssignmentSchema = new Schema<ITeamAssignment>(
  {
    booking: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: [true, 'Booking reference is required'],
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team reference is required'],
    },
    assignedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    assignedCleaners: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Cleaner',
      },
    ],
    dispatchNotes: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['ASSIGNED', 'EN_ROUTE', 'IN_PROGRESS', 'COMPLETION_REQUESTED', 'COMPLETED', 'CANCELLED'],
      default: 'ASSIGNED',
    },
    leaderCommission: {
      type: Number,
      default: 0,
    },
    cleanerPoolPayout: {
      type: Number,
      default: 0,
    },
    adminSharePayout: {
      type: Number,
      default: 0,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

teamAssignmentSchema.index({ booking: 1, team: 1 });
teamAssignmentSchema.index({ team: 1, status: 1 });

export const TeamAssignment = model<ITeamAssignment>(
  'TeamAssignment',
  teamAssignmentSchema,
);
