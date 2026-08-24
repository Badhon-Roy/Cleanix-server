import { Schema, model } from 'mongoose';
import { ILeaderAppointment } from './leaderAppointment.interface';

const leaderAppointmentSchema = new Schema<ILeaderAppointment>(
  {
    team: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'Team reference is required'],
    },
    cleaner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Cleaner User reference is required'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
      default: 'PENDING',
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

export const LeaderAppointment = model<ILeaderAppointment>(
  'LeaderAppointment',
  leaderAppointmentSchema,
);
