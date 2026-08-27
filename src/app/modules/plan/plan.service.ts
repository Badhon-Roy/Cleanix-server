import mongoose from 'mongoose';
import AppError from '../../errors/AppError';
import { IPlan } from './plan.interface';
import { Plan } from './plan.model';
import { emitPlanUpdated } from '../../socket/socket';

const buildPlanQuery = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ _id: id }, { id: id }] };
  }
  return { id: id };
};

const initialDefaultPlans: Partial<IPlan>[] = [
  {
    id: 'BASIC',
    title: 'BASIC',
    price: '৳6,000',
    pricePeriodBn: '/ মাস (Monthly)',
    subtitleBn: 'ছোট বাসা বা ছোট স্টার্টআপ অফিস',
    category: 'SUBSCRIPTION',
    active: true,
    isPopular: false,
    ctaText: 'Select Plan',
    ctaHref: '/contact',
    order: 1,
    features: [
      'মাসে ২ বার রুটিন হোম ক্লিনিং',
      'ফ্লোর মোছা, ভ্যাকুয়াম ও ডাস্টিং',
      'রান্নাঘর ও বাথরুম ডিপ রিফ্রেশ',
      'অনলাইন সাপোর্ট ও ইনভয়েস',
      'রিয়েল-টাইম ট্র্যাকিং অ্যালার্ট',
    ],
  },
  {
    id: 'STANDARD',
    title: 'STANDARD',
    price: '৳14,000',
    pricePeriodBn: '/ মাস (Monthly)',
    subtitleBn: 'মাঝারি পরিবার ও কমার্শিয়াল শোরুমের পছন্দ',
    category: 'SUBSCRIPTION',
    active: true,
    isPopular: true,
    popularLabel: '★ MOST POPULAR',
    ctaText: 'Select Standard Plan',
    ctaHref: '/contact',
    order: 2,
    features: [
      'মাসে ৪ বার (সাপ্তাহিক ১ বার) ডিপ ক্লিন',
      'অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন',
      'সোফা, কার্পেট ও মেট্রেস ড্রায়ার',
      'গ্লাস ও উইন্ডো স্যানিটাইজিং',
      '২৪/৭ ডেডিকেটেড ফোন ও চ্যাট',
    ],
  },
  {
    id: 'PREMIUM',
    title: 'PREMIUM',
    price: '৳30,000',
    pricePeriodBn: '/ মাস (Monthly)',
    subtitleBn: 'বড় কর্পোরেট অফিস ও ডুপ্লেক্স ভিলা',
    category: 'SUBSCRIPTION',
    active: true,
    isPopular: false,
    vipBadge: 'VIP CARE',
    ctaText: 'Select Plan',
    ctaHref: '/contact',
    order: 3,
    features: [
      'মাসে ৮ বার মাস্টার ক্লিনিং',
      'হসপিটাল-গ্রেড স্টিম স্যানিটাইজ',
      'ওভেন, ফ্রিজ ও কিচেন চিমনি কেয়ার',
      'ভিআইপি কনসিয়ার্জ ও লাইভ জিপিএস',
      'সাপ্তাহিক কোয়ালিটি রিপোর্ট',
    ],
  },
];

const createPlanInDB = async (payload: Partial<IPlan>) => {
  const planId = payload.id || `PKG-${Date.now()}`;
  const result = await Plan.create({
    ...payload,
    id: planId,
    title: payload.title || 'CUSTOM PLAN',
    price: payload.price || '৳10,000',
    subtitleBn: payload.subtitleBn || '',
    active: payload.active ?? true,
    isPopular: payload.isPopular ?? false,
    features: payload.features || [],
    isDeleted: false,
  });

  emitPlanUpdated(result);
  return result;
};

const getAllPlansFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.active === 'true') {
    filter.active = true;
  }

  let result = await Plan.find(filter).sort({ order: 1, createdAt: 1 });

  // Auto-seed initial 3 plans if collection is empty
  if (result.length === 0) {
    await Plan.insertMany(initialDefaultPlans);
    result = await Plan.find(filter).sort({ order: 1, createdAt: 1 });
  }

  return result;
};

const getPlanByIdFromDB = async (id: string) => {
  const result = await Plan.findOne(buildPlanQuery(id));
  if (!result || result.isDeleted) {
    throw new AppError(404, 'Pricing plan card not found');
  }
  return result;
};

const updatePlanInDB = async (id: string, payload: Partial<IPlan>) => {
  const query = buildPlanQuery(id);
  const isExists = await Plan.findOne(query);
  if (!isExists || isExists.isDeleted) {
    throw new AppError(404, 'Pricing plan card not found');
  }

  const result = await Plan.findOneAndUpdate(query, payload, {
    new: true,
    runValidators: true,
  });

  emitPlanUpdated(result);
  return result;
};

const deletePlanFromDB = async (id: string) => {
  const query = buildPlanQuery(id);
  const isExists = await Plan.findOne(query);
  if (!isExists) {
    throw new AppError(404, 'Pricing plan card not found');
  }

  const result = await Plan.findOneAndDelete(query);

  emitPlanUpdated({ id, isDeleted: true });
  return result;
};

export const PlanService = {
  createPlanInDB,
  getAllPlansFromDB,
  getPlanByIdFromDB,
  updatePlanInDB,
  deletePlanFromDB,
};
