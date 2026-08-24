import { Schema, model } from 'mongoose';
import { ITeam } from './team.interface';

const teamSchema = new Schema<ITeam>(
  {
    teamCode: {
      type: String,
      required: [true, 'Team code is required'],
      unique: true,
      trim: true,
    },
    teamName: {
      type: String,
      required: [true, 'Team name is required'],
      trim: true,
    },
    teamImage: {
      type: String,
      required: [true, 'Team image URL is required'],
      default: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600',
    },
    leader: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Team Leader is required'],
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    zone: {
      type: Schema.Types.ObjectId,
      ref: 'CoverageArea',
      required: [true, 'Coverage zone ID is required'],
    },
    commissionRate: {
      type: Number,
      default: 10,
    },
    cleanerPoolShare: {
      type: Number,
      default: 40,
    },
    adminShare: {
      type: Number,
      default: 50,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'ACTIVE',
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

export const Team = model<ITeam>('Team', teamSchema);
