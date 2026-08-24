import AppError from '../../errors/AppError';
import { ITeam } from './team.interface';
import { Team } from './team.model';
import { User } from '../user/user.model';

const createTeamInDB = async (payload: ITeam) => {
  const isTeamExists = await Team.findOne({ teamCode: payload.teamCode, isDeleted: false });
  if (isTeamExists) {
    throw new AppError(400, `Team code '${payload.teamCode}' already exists`);
  }

  const team = await Team.create(payload);

  // Automatically promote the assigned leader's role to 'TEAM_LEADER'
  if (payload.leader) {
    await User.findByIdAndUpdate(payload.leader, { role: 'TEAM_LEADER' });
  }

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

  const updatedTeam = await Team.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  })
    .populate('leader', 'name email phone role status')
    .populate('members', 'name email phone role status')
    .populate('zone', 'zoneName district areasIncluded');

  // Automatically promote the assigned leader's role to 'TEAM_LEADER'
  if (payload.leader) {
    await User.findByIdAndUpdate(payload.leader, { role: 'TEAM_LEADER' });
  }

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
  deleteTeamFromDB,
};
