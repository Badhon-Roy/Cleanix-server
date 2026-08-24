import AppError from '../../errors/AppError';
import { ITeam } from './team.interface';
import { Team } from './team.model';
import { User } from '../user/user.model';
import { Cleaner } from '../cleaner/cleaner.model';

const createTeamInDB = async (payload: ITeam) => {
  const isTeamCodeExists = await Team.findOne({ teamCode: payload.teamCode, isDeleted: false });
  if (isTeamCodeExists) {
    throw new AppError(400, `Team code '${payload.teamCode}' already exists`);
  }

  // Validation: Team Name must be unique
  if (payload.teamName) {
    const isTeamNameExists = await Team.findOne({
      teamName: { $regex: new RegExp(`^${payload.teamName.trim()}$`, 'i') },
      isDeleted: false,
    });
    if (isTeamNameExists) {
      throw new AppError(400, `Team name '${payload.teamName}' already exists`);
    }
  }

  // Validation: Total commission split must equal 100%
  const totalSplit = (Number(payload.commissionRate) || 0) + (Number(payload.cleanerPoolShare) || 0) + (Number(payload.adminShare) || 0);
  if (totalSplit !== 100) {
    throw new AppError(400, `Commission split must equal 100% (Current: ${totalSplit}%)`);
  }

  // Validation: A cleaner can be the Team Leader of ONLY ONE team squad!
  if (payload.leader) {
    const existingLeaderTeam = await Team.findOne({
      leader: payload.leader,
      isDeleted: false,
    });
    if (existingLeaderTeam) {
      throw new AppError(
        400,
        `Cleaner is already assigned as leader to squad '${existingLeaderTeam.teamCode}'`
      );
    }
  }

  // Validation: A cleaner can be assigned to ONLY ONE active team squad!
  if (payload.members && payload.members.length > 0) {
    for (const memberId of payload.members) {
      const existingMemberTeam = await Team.findOne({
        isDeleted: false,
        $or: [{ members: memberId }, { leader: memberId }],
      });
      if (existingMemberTeam) {
        throw new AppError(
          400,
          `Cleaner is already assigned to squad '${existingMemberTeam.teamCode}'`
        );
      }
    }
  }

  // Ensure Team Leader cannot be included as a squad cleaner member
  if (payload.leader && payload.members) {
    const leaderIdStr = payload.leader.toString();
    const isLeaderInMembers = payload.members.some(
      (m) => m.toString() === leaderIdStr
    );
    if (isLeaderInMembers) {
      throw new AppError(400, 'Team Leader cannot be selected as a squad cleaner');
    }
  }

  payload.leaderRequestStatus = 'PENDING';
  const team = await Team.create(payload);

  return team;
};

const getAllTeamsFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) filter.status = query.status;
  if (query.zone) filter.zone = query.zone;

  const teams = await Team.find(filter)
    .populate('leader', 'name email phone role status')
    .populate('members', 'name email phone role status')
    .populate('zone', 'zoneName district areasIncluded')
    .sort({ createdAt: -1 });

  return teams;
};

const getTeamByIdFromDB = async (id: string) => {
  const team = await Team.findById(id)
    .populate('leader', 'name email phone role status')
    .populate('members', 'name email phone role status')
    .populate('zone', 'zoneName district areasIncluded');

  if (!team || team.isDeleted) {
    throw new AppError(404, 'Team squad not found');
  }
  return team;
};

const updateTeamInDB = async (id: string, payload: Partial<ITeam>) => {
  const team = await Team.findById(id);
  if (!team || team.isDeleted) {
    throw new AppError(404, 'Team squad not found');
  }

  // Validation: Team Name must be unique
  if (payload.teamName) {
    const isTeamNameExists = await Team.findOne({
      _id: { $ne: id },
      teamName: { $regex: new RegExp(`^${payload.teamName.trim()}$`, 'i') },
      isDeleted: false,
    });
    if (isTeamNameExists) {
      throw new AppError(400, `Team name '${payload.teamName}' already exists`);
    }
  }

  const targetCommissionRate = payload.commissionRate !== undefined ? payload.commissionRate : team.commissionRate;
  const targetCleanerPool = payload.cleanerPoolShare !== undefined ? payload.cleanerPoolShare : team.cleanerPoolShare;
  const targetAdminShare = payload.adminShare !== undefined ? payload.adminShare : team.adminShare;

  const totalSplit = Number(targetCommissionRate) + Number(targetCleanerPool) + Number(targetAdminShare);
  if (totalSplit !== 100) {
    throw new AppError(400, `Commission split must equal 100% (Current: ${totalSplit}%)`);
  }

  const targetLeader = payload.leader || team.leader;

  // If leader is changing, reset leaderRequestStatus to PENDING
  if (payload.leader && payload.leader.toString() !== team.leader.toString()) {
    payload.leaderRequestStatus = 'PENDING';
  }

  // Validation: A cleaner can be the Team Leader of ONLY ONE team squad!
  if (targetLeader) {
    const existingLeaderTeam = await Team.findOne({
      _id: { $ne: id },
      leader: targetLeader,
      isDeleted: false,
    });
    if (existingLeaderTeam) {
      throw new AppError(
        400,
        `Cleaner is already assigned as leader to squad '${existingLeaderTeam.teamCode}'`
      );
    }
  }

  const targetMembers = payload.members || team.members;

  // Validation: A cleaner can be assigned to ONLY ONE active team squad!
  if (targetMembers && targetMembers.length > 0) {
    for (const memberId of targetMembers) {
      const existingMemberTeam = await Team.findOne({
        _id: { $ne: id },
        isDeleted: false,
        $or: [{ members: memberId }, { leader: memberId }],
      });
      if (existingMemberTeam) {
        throw new AppError(
          400,
          `Cleaner is already assigned to squad '${existingMemberTeam.teamCode}'`
        );
      }
    }
  }

  if (targetLeader && targetMembers) {
    const leaderIdStr = targetLeader.toString();
    const isLeaderInMembers = targetMembers.some(
      (m) => m.toString() === leaderIdStr
    );
    if (isLeaderInMembers) {
      throw new AppError(400, 'Team Leader cannot be selected as a squad cleaner');
    }
  }

  const updatedTeam = await Team.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('leader', 'name email phone role status')
    .populate('members', 'name email phone role status')
    .populate('zone', 'zoneName district areasIncluded');

  return updatedTeam;
};

const respondLeaderRequestInDB = async (
  teamId: string,
  userId: string,
  action: 'ACCEPT' | 'DECLINE'
) => {
  const team = await Team.findById(teamId);
  if (!team || team.isDeleted) {
    throw new AppError(404, 'Team squad not found');
  }

  // Check if current user is the assigned leader
  const cleanerProfile = await Cleaner.findOne({ user: userId });
  const cleanerId = cleanerProfile?._id?.toString();

  const isMatch =
    team.leader.toString() === userId.toString() ||
    (cleanerId && team.leader.toString() === cleanerId);

  if (!isMatch) {
    throw new AppError(403, 'You are not the assigned leader of this team squad');
  }

  if (action === 'ACCEPT') {
    team.leaderRequestStatus = 'ACCEPTED';
    await team.save();

    // Promote User Role to 'TEAM_LEADER'
    await User.findByIdAndUpdate(userId, { role: 'TEAM_LEADER' });
  } else {
    team.leaderRequestStatus = 'DECLINED';
    await team.save();
  }

  const updatedTeam = await Team.findById(teamId)
    .populate('leader', 'name email phone role status')
    .populate('members', 'name email phone role status')
    .populate('zone', 'zoneName district areasIncluded');

  return updatedTeam;
};

const deleteTeamFromDB = async (id: string) => {
  const team = await Team.findById(id);
  if (!team || team.isDeleted) {
    throw new AppError(404, 'Team squad not found');
  }

  const deletedTeam = await Team.findByIdAndUpdate(
    id,
    { isDeleted: true, status: 'INACTIVE' },
    { new: true }
  );

  return deletedTeam;
};

export const TeamService = {
  createTeamInDB,
  getAllTeamsFromDB,
  getTeamByIdFromDB,
  updateTeamInDB,
  respondLeaderRequestInDB,
  deleteTeamFromDB,
};
