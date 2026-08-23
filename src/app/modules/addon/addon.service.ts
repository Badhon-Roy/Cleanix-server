import { Addon } from './addon.model';
import { IAddon } from './addon.interface';
import AppError from '../../errors/AppError';

// Initial default seed dataset if DB is empty
const defaultInitialAddons = [
  {
    slug: 'sofa',
    name: 'Sofa & Carpet Wash',
    subLabel: 'শ্যাম্পু ওয়াশ ও ডিপ মেট্রেস ড্রায়ার',
    price: 2000,
    tag: 'MOST POPULAR',
    iconName: 'sofa',
    active: true,
  },
  {
    slug: 'oven',
    name: 'Kitchen Oven & Chimney',
    subLabel: 'ওভেন ও কিচেন চিমনি গ্রিজ ওয়াশ',
    price: 1200,
    tag: 'KITCHEN CARE',
    iconName: 'oven',
    active: true,
  },
  {
    slug: 'fridge',
    name: 'Refrigerator Deep Clean',
    subLabel: 'ফ্রিজ অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজ',
    price: 1000,
    tag: 'HYGIENE',
    iconName: 'fridge',
    active: true,
  },
  {
    slug: 'window',
    name: 'Glass & Window Polish',
    subLabel: 'ইনটেরিয়র গ্লাস ও উইন্ডো স্যানিটাইজিং',
    price: 800,
    tag: 'SHINE CARE',
    iconName: 'window',
    active: true,
  },
  {
    slug: 'pet',
    name: 'Pet Hygiene & Odor Clean',
    subLabel: 'পেট হেয়ার ও গন্ধ দূরীকরণ ট্রিমেন্ট',
    price: 1500,
    tag: 'PET CARE',
    iconName: 'pet',
    active: true,
  },
];

const seedAddonsIfEmpty = async () => {
  const count = await Addon.countDocuments({ isDeleted: false });
  if (count === 0) {
    await Addon.insertMany(defaultInitialAddons);
  }
};

const getActiveAddons = async () => {
  await seedAddonsIfEmpty();
  const addons = await Addon.find({ active: true, isDeleted: false }).sort({ createdAt: 1 });
  return addons;
};

const getAllAddonsAdmin = async () => {
  await seedAddonsIfEmpty();
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
    iconName: payload.iconName || 'sparkles',
    active: payload.active !== undefined ? payload.active : true,
  });

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

  return updatedAddon;
};

const deleteAddon = async (addonId: string) => {
  const addon = await Addon.findOne({ _id: addonId, isDeleted: false });
  if (!addon) {
    throw new AppError(404, 'Addon service not found!');
  }

  await Addon.findOneAndUpdate({ _id: addonId }, { isDeleted: true });

  return null;
};

export const AddonService = {
  getActiveAddons,
  getAllAddonsAdmin,
  createAddon,
  updateAddon,
  deleteAddon,
};
