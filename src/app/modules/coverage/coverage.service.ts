import AppError from '../../errors/AppError';
import { ICoverageArea } from './coverage.interface';
import { CoverageArea } from './coverage.model';
import { emitCoverageUpdated } from '../../socket/socket';

const createCoverageInDB = async (payload: ICoverageArea) => {
  const isExists = await CoverageArea.findOne({
    zoneName: payload.zoneName,
    isDeleted: false,
  });

  if (isExists) {
    throw new AppError(400, `Coverage zone '${payload.zoneName}' already exists`);
  }

  const result = await CoverageArea.create(payload);
  emitCoverageUpdated(result);
  return result;
};

const getAllCoveragesFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.district) filter.district = query.district;
  if (query.isActive !== undefined) filter.isActive = query.isActive === 'true';

  const result = await CoverageArea.find(filter).sort({ createdAt: -1 });
  return result;
};

const getCoverageByIdFromDB = async (id: string) => {
  const result = await CoverageArea.findById(id);
  if (!result || result.isDeleted) {
    throw new AppError(404, 'Coverage area zone not found');
  }
  return result;
};

const updateCoverageInDB = async (id: string, payload: Partial<ICoverageArea>) => {
  const isExists = await CoverageArea.findById(id);
  if (!isExists || isExists.isDeleted) {
    throw new AppError(404, 'Coverage area zone not found');
  }

  const result = await CoverageArea.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  emitCoverageUpdated(result);
  return result;
};

const deleteCoverageFromDB = async (id: string) => {
  const isExists = await CoverageArea.findById(id);
  if (!isExists || isExists.isDeleted) {
    throw new AppError(404, 'Coverage area zone not found');
  }

  const result = await CoverageArea.findByIdAndUpdate(
    id,
    { isDeleted: true, isActive: false },
    { new: true },
  );

  emitCoverageUpdated({ id, isDeleted: true });
  return result;
};

export const CoverageService = {
  createCoverageInDB,
  getAllCoveragesFromDB,
  getCoverageByIdFromDB,
  updateCoverageInDB,
  deleteCoverageFromDB,
};
