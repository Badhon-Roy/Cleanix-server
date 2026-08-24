import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { TeamAssignment } from './teamAssignment.model';
import { Booking } from '../booking/booking.model';
import { Team } from '../team/team.model';
import { Cleaner } from '../cleaner/cleaner.model';

const syncTeamAssignment = async (
  bookingId: string | Types.ObjectId,
  teamId: string | Types.ObjectId,
  adminUserId?: string,
  dispatchNotes?: string,
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }

  const team = await Team.findById(teamId);
  if (!team) {
    throw new AppError(404, 'Team not found');
  }

  if (team.leaderRequestStatus !== 'ACCEPTED' || team.status !== 'ACTIVE') {
    team.leaderRequestStatus = 'ACCEPTED';
    team.status = 'ACTIVE';
    await team.save();
  }

  const bookingPrice = Number(booking.totalAmount) || 0;
  const leaderRate = Number(team.commissionRate) || 10;
  const cleanerRate = Number(team.cleanerPoolShare) || 40;
  const adminRate = Number(team.adminShare) || 50;

  const leaderCommission = Math.round((bookingPrice * leaderRate) / 100);
  const cleanerPoolPayout = Math.round((bookingPrice * cleanerRate) / 100);
  const adminSharePayout = Math.round((bookingPrice * adminRate) / 100);

  let assignment = await TeamAssignment.findOne({ booking: booking._id });

  if (assignment) {
    assignment.team = team._id as any;
    if (adminUserId && Types.ObjectId.isValid(adminUserId)) {
      assignment.assignedBy = new Types.ObjectId(adminUserId) as any;
    }
    if (dispatchNotes !== undefined) {
      assignment.dispatchNotes = dispatchNotes;
    }
    assignment.leaderCommission = leaderCommission;
    assignment.cleanerPoolPayout = cleanerPoolPayout;
    assignment.adminSharePayout = adminSharePayout;
    assignment.status = 'ASSIGNED';
    await assignment.save();
  } else {
    assignment = await TeamAssignment.create({
      booking: booking._id,
      team: team._id,
      assignedBy: adminUserId && Types.ObjectId.isValid(adminUserId) ? (new Types.ObjectId(adminUserId) as any) : undefined,
      dispatchNotes: dispatchNotes || booking.notes || '',
      status: 'ASSIGNED',
      leaderCommission,
      cleanerPoolPayout,
      adminSharePayout,
      assignedAt: new Date(),
    });
  }

  return assignment;
};

const getMyTeamAssignmentsFromDB = async (
  jwtUser: { id: string; role: string; email: string },
  teamSlug?: string,
) => {
  let team = null;

  // If teamSlug is provided, try finding team by slug/code/name/id first
  if (teamSlug) {
    let queryObj: Record<string, unknown> = { isDeleted: false };
    if (Types.ObjectId.isValid(teamSlug)) {
      queryObj._id = teamSlug;
      team = await Team.findOne(queryObj);
    } else {
      const formattedName = teamSlug.replace(/-/g, ' ');
      queryObj.$or = [
        { teamCode: { $regex: new RegExp(teamSlug.trim(), 'i') } },
        { teamName: { $regex: new RegExp(formattedName.trim(), 'i') } },
        { teamCode: { $regex: new RegExp(formattedName.trim(), 'i') } },
      ];
      team = await Team.findOne(queryObj);
    }

    if (!team) {
      const allTeams = await Team.find({ isDeleted: false });
      const cleanSlug = teamSlug.toLowerCase().replace(/[^a-z0-9]/g, '');
      team =
        allTeams.find((t) => {
          const cleanName = t.teamName.toLowerCase().replace(/[^a-z0-9]/g, '');
          const cleanCode = t.teamCode.toLowerCase().replace(/[^a-z0-9]/g, '');
          return (
            cleanName.includes(cleanSlug) ||
            cleanSlug.includes(cleanName) ||
            cleanCode.includes(cleanSlug)
          );
        }) || null;
    }
  }

  // Fallback 1: Try finding team where current user is leader
  if (!team && jwtUser) {
    team = await Team.findOne({ leader: jwtUser.id, isDeleted: false });
  }

  // Fallback 2: Try finding via cleaner profile
  if (!team && jwtUser) {
    const cleanerProfile = await Cleaner.findOne({ user: jwtUser.id });
    if (cleanerProfile) {
      team = await Team.findOne({
        isDeleted: false,
        $or: [{ leader: cleanerProfile._id }, { members: cleanerProfile._id }],
      });
    }
  }

  // Fallback 3: check if cleaner user ID is in members
  if (!team && jwtUser) {
    team = await Team.findOne({
      isDeleted: false,
      $or: [{ leader: jwtUser.id }, { members: jwtUser.id }],
    });
  }

  if (!team) {
    return [];
  }

  // Auto-sync Bookings assigned to this team that don't have a TeamAssignment record yet
  const assignedBookings = await Booking.find({
    $or: [
      { assignedTeam: team._id },
      { cleanerTeam: { $regex: new RegExp(team.teamCode, 'i') } },
      { cleanerTeam: { $regex: new RegExp(team.teamName, 'i') } },
    ],
    isDeleted: false,
  });

  for (const b of assignedBookings) {
    const existingAssignment = await TeamAssignment.findOne({ booking: b._id });
    if (!existingAssignment) {
      const bookingPrice = Number(b.totalAmount) || 0;
      const leaderRate = Number(team.commissionRate) || 10;
      const cleanerRate = Number(team.cleanerPoolShare) || 40;
      const adminRate = Number(team.adminShare) || 50;

      await TeamAssignment.create({
        booking: b._id,
        team: team._id,
        dispatchNotes: b.notes || '',
        status: b.status === 'COMPLETED' ? 'COMPLETED' : b.status === 'IN_PROGRESS' ? 'IN_PROGRESS' : 'ASSIGNED',
        leaderCommission: Math.round((bookingPrice * leaderRate) / 100),
        cleanerPoolPayout: Math.round((bookingPrice * cleanerRate) / 100),
        adminSharePayout: Math.round((bookingPrice * adminRate) / 100),
        assignedAt: (b as any).createdAt || new Date(),
      });
    }
  }

  const allAssignments = await TeamAssignment.find({
    team: team._id,
    isDeleted: false,
  })
    .populate({
      path: 'booking',
      populate: [
        { path: 'user', select: 'name email phone avatar' },
        { path: 'serviceType', select: 'title slug category badge price heroImage fields' },
        { path: 'locationId', select: 'address city zipCode' },
      ],
    })
    .populate({
      path: 'team',
      populate: [
        { path: 'leader', select: 'name email phone rating role' },
        { path: 'members', select: 'name email phone role status' },
        { path: 'zone', select: 'zoneName district' },
      ],
    })
    .populate('assignedCleaners', 'name email phone rating status')
    .sort({ createdAt: -1 });

  const seenBookingIds = new Set<string>();
  const uniqueAssignments = [];

  for (const item of allAssignments) {
    if (!item.booking) {
      await TeamAssignment.findByIdAndDelete(item._id);
      continue;
    }
    const bId = (item.booking as any)._id?.toString() || (item.booking as any).id?.toString();
    if (bId) {
      if (seenBookingIds.has(bId)) {
        await TeamAssignment.findByIdAndDelete(item._id);
        continue;
      }
      seenBookingIds.add(bId);
      uniqueAssignments.push(item);
    }
  }

  return uniqueAssignments;
};

const getAllAssignmentsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.team) filter.team = query.team;
  if (query.status) filter.status = query.status;
  if (query.booking) filter.booking = query.booking;

  const assignments = await TeamAssignment.find(filter)
    .populate({
      path: 'booking',
      populate: [
        { path: 'user', select: 'name email phone avatar' },
        { path: 'serviceType', select: 'title slug category badge price heroImage fields' },
        { path: 'locationId', select: 'address city zipCode' },
      ],
    })
    .populate({
      path: 'team',
      populate: [
        { path: 'leader', select: 'name email phone rating role' },
        { path: 'members', select: 'name email phone role status' },
        { path: 'zone', select: 'zoneName district' },
      ],
    })
    .populate('assignedCleaners', 'name email phone rating status')
    .sort({ createdAt: -1 });

  return assignments;
};

const updateAssignmentDetailsInDB = async (
  assignmentId: string,
  payload: {
    assignedCleaners?: string[];
    status?: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    dispatchNotes?: string;
  },
) => {
  const assignment = await TeamAssignment.findById(assignmentId);
  if (!assignment || assignment.isDeleted) {
    throw new AppError(404, 'Team Assignment record not found');
  }

  if (payload.assignedCleaners) {
    assignment.assignedCleaners = payload.assignedCleaners.map(
      (id) => new Types.ObjectId(id),
    );
  }

  if (payload.dispatchNotes !== undefined) {
    assignment.dispatchNotes = payload.dispatchNotes;
  }

  if (payload.status) {
    assignment.status = payload.status;

    // Sync booking status
    const booking = await Booking.findById(assignment.booking);
    if (booking) {
      if (payload.status === 'IN_PROGRESS') {
        booking.status = 'IN_PROGRESS';
      } else if (payload.status === 'COMPLETED') {
        booking.status = 'COMPLETED';
        assignment.completedAt = new Date();

        // Increment team completedJobsCount
        await Team.findByIdAndUpdate(assignment.team, {
          $inc: { completedJobsCount: 1 },
        });
      } else if (payload.status === 'CANCELLED') {
        booking.status = 'CANCELLED';
      }
      await booking.save();
    }
  }

  await assignment.save();

  const updated = await TeamAssignment.findById(assignment._id)
    .populate({
      path: 'booking',
      populate: [
        { path: 'user', select: 'name email phone avatar' },
        { path: 'serviceType', select: 'title slug category badge price heroImage fields' },
        { path: 'locationId', select: 'address city zipCode' },
      ],
    })
    .populate({
      path: 'team',
      populate: [
        { path: 'leader', select: 'name email phone rating role' },
        { path: 'members', select: 'name email phone role status' },
        { path: 'zone', select: 'zoneName district' },
      ],
    })
    .populate('assignedCleaners', 'name email phone rating status');

  return updated;
};

export const TeamAssignmentService = {
  syncTeamAssignment,
  getMyTeamAssignmentsFromDB,
  getAllAssignmentsFromDB,
  updateAssignmentDetailsInDB,
};
