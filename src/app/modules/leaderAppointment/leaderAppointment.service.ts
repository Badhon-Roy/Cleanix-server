import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { LeaderAppointment } from './leaderAppointment.model';
import { Team } from '../team/team.model';
import { User } from '../user/user.model';
import { Cleaner } from '../cleaner/cleaner.model';

const syncAppointmentOnTeamChange = async (
  teamId: string,
  cleanerUserId: string,
) => {
  if (!teamId || !cleanerUserId) return null;

  // Soft delete any existing pending appointments for this team to keep history clean
  await LeaderAppointment.updateMany(
    { team: teamId, status: 'PENDING', isDeleted: false },
    { isDeleted: true },
  );

  // Create new PENDING appointment record
  const appointment = await LeaderAppointment.create({
    team: new Types.ObjectId(teamId),
    cleaner: new Types.ObjectId(cleanerUserId),
    status: 'PENDING',
  });

  return appointment;
};

const getMyPendingAppointmentFromDB = async (userId: string) => {
  if (!userId) return null;

  // Find user or cleaner profile
  const user = await User.findById(userId);
  const cleanerProfile = await Cleaner.findOne({ user: userId });
  const cleanerUserId = user?._id || cleanerProfile?.user || userId;

  const appointment = await LeaderAppointment.findOne({
    cleaner: cleanerUserId,
    status: 'PENDING',
    isDeleted: false,
  })
    .populate({
      path: 'team',
      select: 'teamCode teamName teamImage zone commissionRate cleanerPoolShare adminShare status leaderRequestStatus',
      populate: {
        path: 'zone',
        select: 'zoneName district areasIncluded',
      },
    })
    .populate('cleaner', 'name email phone role status')
    .sort({ createdAt: -1 });

  return appointment;
};

const respondToAppointmentInDB = async (
  appointmentId: string,
  userId: string,
  action: 'ACCEPT' | 'DECLINE',
) => {
  const appointment = await LeaderAppointment.findById(appointmentId);
  if (!appointment || appointment.isDeleted) {
    throw new AppError(404, 'Leader appointment request not found');
  }

  // Check user ownership
  const cleanerProfile = await Cleaner.findOne({ user: userId });
  const cleanerId = cleanerProfile?.user?.toString() || userId.toString();

  const isMatch =
    appointment.cleaner.toString() === userId.toString() ||
    appointment.cleaner.toString() === cleanerId;

  if (!isMatch) {
    throw new AppError(403, 'You are not authorized to respond to this appointment request');
  }

  const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'DECLINED';
  appointment.status = newStatus;
  await appointment.save();

  // Automatically update team collection status
  await Team.findByIdAndUpdate(appointment.team, {
    leaderRequestStatus: newStatus,
  });

  // If ACCEPTED, promote cleaner's role to TEAM_LEADER
  if (action === 'ACCEPT') {
    await User.findByIdAndUpdate(userId, { role: 'TEAM_LEADER' });
  }

  const updatedAppointment = await LeaderAppointment.findById(appointmentId)
    .populate({
      path: 'team',
      select: 'teamCode teamName teamImage zone commissionRate cleanerPoolShare adminShare status leaderRequestStatus',
      populate: {
        path: 'zone',
        select: 'zoneName district areasIncluded',
      },
    })
    .populate('cleaner', 'name email phone role status');

  return updatedAppointment;
};

const getMyAppointmentHistoryFromDB = async (userId: string) => {
  if (!userId) return [];

  const user = await User.findById(userId);
  const cleanerProfile = await Cleaner.findOne({ user: userId });
  const cleanerUserId = user?._id || cleanerProfile?.user || userId;

  const appointments = await LeaderAppointment.find({
    cleaner: cleanerUserId,
    isDeleted: false,
  })
    .populate({
      path: 'team',
      select: 'teamCode teamName teamImage zone commissionRate cleanerPoolShare adminShare status leaderRequestStatus',
      populate: {
        path: 'zone',
        select: 'zoneName district areasIncluded',
      },
    })
    .populate('cleaner', 'name email phone role status')
    .sort({ createdAt: -1 });

  return appointments;
};

export const LeaderAppointmentService = {
  syncAppointmentOnTeamChange,
  getMyPendingAppointmentFromDB,
  getMyAppointmentHistoryFromDB,
  respondToAppointmentInDB,
};
