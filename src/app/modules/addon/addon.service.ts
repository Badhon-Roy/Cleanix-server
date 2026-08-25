import { Addon } from './addon.model';
import { IAddon } from './addon.interface';
import AppError from '../../errors/AppError';
import { emitAddonUpdated } from '../../socket/socket';

const getActiveAddons = async () => {
  const addons = await Addon.find({ active: true, isDeleted: false }).sort({ createdAt: 1 });
  return addons;
};

const getAllAddonsAdmin = async () => {
  const addons = await Addon.find({ isDeleted: false }).sort({ createdAt: 1 });
  return addons;
};

const createAddon = async (payload: Partial<IAddon>) => {
  if (!payload.name || !payload.price) {
    throw new AppError(400, 'Addon name and price are required!');
  }

  const slug = payload.slug || payload.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
  const existing = await Addon.findOne({ slug, isDeleted: false });

  if (existing) {
    throw new AppError(400, 'An add-on service with this slug already exists!');
  }

  const newAddon = await Addon.create({
    slug,
    name: payload.name,
    subLabel: payload.subLabel || 'সার্ভিস সাব-লেবেল',
    price: payload.price,
    tag: payload.tag || 'SPECIALIST',
    iconImage: payload.iconImage,
    active: payload.active !== undefined ? payload.active : true,
  });

  emitAddonUpdated({ action: 'create', addon: newAddon });

  return newAddon;
};

const updateAddon = async (addonId: string, payload: Partial<IAddon>) => {
  const addon = await Addon.findOne({ _id: addonId, isDeleted: false });
  if (!addon) {
    throw new AppError(404, 'Addon service not found!');
  }

  const updatedAddon = await Addon.findOneAndUpdate(
    { _id: addonId, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true },
  );

  emitAddonUpdated({ action: 'update', addon: updatedAddon });

  return updatedAddon;
};

const deleteAddon = async (addonId: string) => {
  const addon = await Addon.findOne({ _id: addonId, isDeleted: false });
  if (!addon) {
    throw new AppError(404, 'Addon service not found!');
  }

  await Addon.findOneAndUpdate({ _id: addonId }, { isDeleted: true });

  emitAddonUpdated({ action: 'delete', addonId });

  return null;
};

export const AddonService = {
  getActiveAddons,
  getAllAddonsAdmin,
  createAddon,
  updateAddon,
  deleteAddon,
};
