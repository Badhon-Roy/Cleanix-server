import { Types } from 'mongoose';
import AppError from '../../errors/AppError';
import { TeamAssignment } from './teamAssignment.model';
import { Booking } from '../booking/booking.model';
import { Team } from '../team/team.model';
import { Cleaner } from '../cleaner/cleaner.model';
import { User } from '../user/user.model';
import { Review } from '../review/review.model';
import { emitBookingUpdated, emitTeamAssignmentUpdated } from '../../socket/socket';

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

  emitTeamAssignmentUpdated({
    bookingId: booking._id,
    teamId: team._id,
    assignmentId: assignment._id,
    timestamp: Date.now(),
  });

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

  const cleanerProfile = await Cleaner.findOne({ user: jwtUser.id });

  const orConditions: Record<string, any>[] = [];
  if (team) {
    orConditions.push({ team: team._id });
  }
  if (cleanerProfile) {
    orConditions.push({ assignedCleaners: cleanerProfile._id });
  }

  if (orConditions.length === 0) {
    return [];
  }

  // Auto-sync Bookings assigned to this team that don't have a TeamAssignment record yet
  if (team) {
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
  }

  const allAssignments = await TeamAssignment.find({
    $or: orConditions,
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

  // Populate review for each assignment's booking (visible to cleaner & team leader regardless of isApproved/isFeatured)
  const assignmentsWithReview = await Promise.all(
    uniqueAssignments.map(async (item) => {
      const bId = (item.booking as any)?._id;
      const review = bId
        ? await Review.findOne({ booking: bId }).select('rating feedback isApproved isFeatured createdAt')
        : null;
      const itemObj = (item as any).toObject ? (item as any).toObject() : { ...item };
      itemObj.review = review || null;
      if (itemObj.booking) {
        itemObj.booking.review = review || null;
      }
      return itemObj;
    }),
  );

  return assignmentsWithReview;
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
    status?: 'ASSIGNED' | 'EN_ROUTE' | 'IN_PROGRESS' | 'COMPLETION_REQUESTED' | 'COMPLETED' | 'CANCELLED';
    dispatchNotes?: string;
  },
) => {
  let assignment = null;
  if (Types.ObjectId.isValid(assignmentId)) {
    assignment = await TeamAssignment.findById(assignmentId);
    if (!assignment) {
      assignment = await TeamAssignment.findOne({ booking: assignmentId });
    }
  }

  if (!assignment || assignment.isDeleted) {
    throw new AppError(404, 'Team Assignment record not found');
  }

  if (payload.assignedCleaners && Array.isArray(payload.assignedCleaners)) {
    const validCleaners: Types.ObjectId[] = [];
    for (const item of payload.assignedCleaners) {
      if (!item) continue;
      let cleanerDoc = null;

      if (Types.ObjectId.isValid(item)) {
        const itemObjId = new Types.ObjectId(item);
        // 1. First check if it's already a direct Cleaner document ID
        cleanerDoc = await Cleaner.findById(itemObjId);
        if (!cleanerDoc) {
          // 2. Check if it's a User ID that has a Cleaner profile
          cleanerDoc = await Cleaner.findOne({ user: itemObjId });
        }
      }

      // 3. If not found by ID, look up by name, email, or phone
      if (!cleanerDoc) {
        const strVal = String(item).trim();
        cleanerDoc = await Cleaner.findOne({
          $or: [
            { name: { $regex: new RegExp(`^${strVal}$`, 'i') } },
            { email: { $regex: new RegExp(`^${strVal}$`, 'i') } },
            { phone: { $regex: new RegExp(`^${strVal}$`, 'i') } },
          ],
        });
      }

      // 4. If cleaner profile still doesn't exist but User exists, auto-create Cleaner profile
      if (!cleanerDoc && Types.ObjectId.isValid(item)) {
        const userDoc = await User.findById(item);
        if (userDoc) {
          cleanerDoc = await Cleaner.create({
            user: userDoc._id,
            name: userDoc.name || 'Cleaner Staff',
            email: userDoc.email || `${userDoc._id}@cleanix.com`,
            phone: userDoc.phone || '01700000000',
            avatar: (userDoc as any).avatar || null,
            dutyStatus: 'ON_DUTY',
          });
        }
      }

      if (cleanerDoc && cleanerDoc._id) {
        validCleaners.push(new Types.ObjectId(cleanerDoc._id));
      }
    }
    assignment.assignedCleaners = validCleaners;

    if (validCleaners.length > 0 && !payload.status) {
      assignment.status = 'ASSIGNED';
      const booking = await Booking.findById(assignment.booking);
      if (booking) {
        booking.status = 'ASSIGNED';
        await booking.save();
      }
    }
  }

  if (payload.dispatchNotes !== undefined) {
    assignment.dispatchNotes = payload.dispatchNotes;
  }

  if (payload.status) {
    assignment.status = payload.status;

    // Sync booking status
    const booking = await Booking.findById(assignment.booking);
    if (booking) {
      if (payload.status === 'ASSIGNED') {
        booking.status = 'ASSIGNED';
      } else if (payload.status === 'EN_ROUTE') {
        booking.status = 'EN_ROUTE';
      } else if (payload.status === 'IN_PROGRESS') {
        booking.status = 'IN_PROGRESS';
      } else if (payload.status === 'COMPLETION_REQUESTED') {
        booking.status = 'COMPLETION_REQUESTED';
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

  if (updated && updated.booking) {
    const bookingId = (updated.booking as any)._id || (updated.booking as any).id;
    const bookingDoc = await Booking.findById(bookingId)
      .populate('user', 'name email phone avatar')
      .populate('serviceType', 'title slug category badge price heroImage fields')
      .populate('coverageArea', 'zoneName district areasIncluded zipCodes')
      .populate({
        path: 'assignedTeam',
        populate: [
          { path: 'leader', select: 'name email phone rating avatar' },
          { path: 'members', select: 'name email phone role' },
          { path: 'zone', select: 'zoneName district' },
        ],
      })
      .populate('locationId')
      .lean();

    if (bookingDoc) {
      const enrichedBooking = {
        ...bookingDoc,
        assignedCleaners: updated.assignedCleaners || [],
        teamAssignment: updated,
      };
      emitBookingUpdated(enrichedBooking as any);
      emitTeamAssignmentUpdated(enrichedBooking as any);
    }
  }

  emitTeamAssignmentUpdated(updated as any);

  return updated;
};

export const TeamAssignmentService = {
  syncTeamAssignment,
  getMyTeamAssignmentsFromDB,
  getAllAssignmentsFromDB,
  updateAssignmentDetailsInDB,
};
