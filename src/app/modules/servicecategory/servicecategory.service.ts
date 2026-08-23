import { ServiceCategory } from './servicecategory.model';
import { IServiceCategory } from './servicecategory.interface';
import AppError from '../../errors/AppError';
import { emitServiceUpdated } from '../../socket/socket';

const defaultInitialServices = [
  {
    slug: 'residential-deep-cleaning',
    title: 'RESIDENTIAL DEEP CLEANING (আবাসিক ডিপ ক্লিনিং)',
    category: 'HOME CARE',
    badge: 'B2C HOME CLEANING',
    price: '৳3,500 BDT',
    slaTime: '30 Mins SLA',
    heroImage: '/RESIDENTIAL-DEEP-CLEANING.png',
    contentImage: 'https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400',
    shortDesc:
      'ঢাকার যেকোনো অ্যাপার্টমেন্ট ও আবাসিক বাড়ির জন্য সম্পূর্ণ রুম-বাই-রুম ডিপ রিফ্রেশ ক্লিনিং ও অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন।',
    introParagraph1:
      'Cleanix-এর আবাসিক ডিপ ক্লিনিং সার্ভিস আপনার বাসা বা অ্যাপার্টমেন্টকে করে তোলে সম্পূর্ণ জীবাণুমুক্ত ও ঝকঝকে। আমরা বেডরুম, কিচেন চিমনি, বাথরুম টাইলস, সোফা ভ্যাকুয়ামিং এবং হাই-টাচ সারফেসগুলোর জন্য স্পেশাল ডাস্ট রিপেলেন্ট স্প্রে ও সেফ কেমিক্যালস ব্যবহার করি।',
    introParagraph2:
      'গুলশান, বনানী, উত্তরা, ধানমন্ডি বা বসুন্ধরার যেকোনো অ্যাপার্টমেন্টের জন্য আমাদের এনআইডি ট্র্যাকিংকৃত এক্সপার্ট ক্লিনার টিম স্পেশাল কেয়ার ও রিয়েল-টাইম লাইভ আপডেটের মাধ্যমে সর্বোচ্চ কোয়ালিটি নিশ্চিত করে।',
    status: 'ACTIVE',
  },
  {
    slug: 'commercial-office-cleaning',
    title: 'COMMERCIAL OFFICE CLEANING (কমার্শিয়াল অফিস ক্লিনিং)',
    category: 'OFFICE',
    badge: 'B2B CORPORATE SOLUTIONS',
    price: '৳8,500 BDT',
    slaTime: '25 Mins SLA',
    heroImage: '/COMMERCIAL-OFFICE-CLEANING.png',
    contentImage: 'https://framerusercontent.com/images/71kz5iX4crWQYqbcukrbVWogYA.png?width=600&height=400',
    shortDesc:
      'ঢাকার করপোরেট অফিস, আইটি হাব, ব্যাংক ও শোরুমের জন্য দৈনিক বা সাপ্তাহিক সাবস্ক্রিপশন ভিত্তিক হাইজিন স্যানিটাইজেশন।',
    introParagraph1:
      'একটি পরিচ্ছন্ন অফিস পরিবেশ কর্মচারীদের উৎপাদনশীলতা বাড়ায় এবং ক্লায়েন্টদের মনে ইতিবাচক প্রভাব তৈরি করে। Cleanix B2B সাবস্ক্রিপশন মডেলে ঢাকার করপোরেট প্রতিষ্ঠানগুলোর জন্য হাই-স্পেক কমার্শিয়াল ক্লিনিং সুবিধা প্রদান করে।',
    introParagraph2:
      'অফিস চলাকালীন কাজের যাতে কোনো ব্যাঘাত না ঘটে, সে জন্য আমরা নাইট শিফট এবং উইকেন্ড ব্যাক-টু-ব্যাক ডিপ স্যানিটাইজেশন প্রোগ্রাম পরিচালনা করি।',
    status: 'ACTIVE',
  },
  {
    slug: 'post-construction-cleaning',
    title: 'POST-CONSTRUCTION CLEANING (পোস্ট-কনস্ট্রাকশন ক্লিনিং)',
    category: 'RENOVATION',
    badge: 'CONSTRUCTION & BUILD',
    price: '৳6,000 BDT',
    slaTime: '35 Mins SLA',
    heroImage: '/POST-CONSTRUCTION CLEANING.png',
    contentImage: 'https://framerusercontent.com/images/hykQu8sbeIwxfZ3UXUa3Ce7b47E.png?width=1880&height=750',
    shortDesc:
      'নতুন বিল্ডিং বা রেনোভেশনের পর জমে থাকা সিমেন্টের ধুলোবালি, রঙের দাগ ও সিভিল কেমিক্যাল দ্রুত পরিষ্কারের জন্য হেভি-ডিউটি স্পেস ক্লিনিং।',
    introParagraph1:
      'নতুন বাসা বা অফিসের সংস্কার কাজ শেষ হওয়ার পর চারদিকে রঙের ফোটা, সিমেন্ট ও ভারী ধুলোবালি জমে থাকে। সাধারণ ঝাড়ু বা মোছা দিয়ে এগুলো পরিষ্কার করা সম্ভব নয়। Cleanix-এর হেভি-ডিউটি টিম পোস্ট-কনস্ট্রাকশন স্থানকে করে তোলে শতভাগ হ্যান্ডওভার প্রস্তুত।',
    introParagraph2:
      'রিয়েল এস্টেট ডেভেলপার, ইন্টেরিয়র ডিজাইনার এবং বাসা মালিকদের জন্য আমাদের স্পেশালাইজড ভ্যাকুয়ামিং ও ফ্লোর বাফিং ট্রিটমেন্ট অত্যন্ত জনপ্রিয়।',
    status: 'ACTIVE',
  },
  {
    slug: 'move-out-cleaning',
    title: 'MOVE-IN / MOVE-OUT CLEANING (মুভ-ইন / আউট ক্লিনিং)',
    category: 'TURNOVER',
    badge: 'RELOCATION & TURNOVER',
    price: '৳4,000 BDT',
    slaTime: '25 Mins SLA',
    heroImage: '/MOVE-OUT-CLEANING.png',
    contentImage: 'https://framerusercontent.com/images/gRwXdPkLkyJS5JXnK04q3ttVLk.png?width=600&height=400',
    shortDesc:
      'নতুন বাসায় ওঠার আগে বা পুরোনো বাসা ছাড়ার সময় সম্পূর্ণ সিকিউরিটি ডিপোজিট রিফান্ড ও জীবাণুমুক্ত হ্যান্ডওভার সার্ভিস।',
    introParagraph1:
      'বাসা স্থানান্তর করা অত্যন্ত মানসিক চাপের বিষয়। নতুন বাসায় উঠার আগে পূর্বের বাসিন্দার জমে থাকা ময়লা ও জীবাণু দূর করা জরুরি। আবার বাসা ছাড়ার সময় বাড়িওয়ালার কাছে সিকিউরিটি ডিপোজিট ফেরত পেতে ঝকঝকে হ্যান্ডওভার দিতে হয়।',
    introParagraph2:
      'Cleanix মুভ-ইন/আউট সার্ভিসে খালি বাসার ক্যাবিনেটের ভেতর, ওভেন, কিচেন হুড ও বাথরুম নিখুঁতভাবে রিফ্রেশ করে দেয়।',
    status: 'ACTIVE',
  },
];

const seedServicesIfEmpty = async () => {
  const count = await ServiceCategory.countDocuments({ isDeleted: false });
  if (count === 0) {
    await ServiceCategory.insertMany(defaultInitialServices);
  }
};

const getActiveServices = async (): Promise<IServiceCategory[]> => {
  await seedServicesIfEmpty();
  const services = await ServiceCategory.find({ status: 'ACTIVE', isDeleted: false }).sort({
    createdAt: 1,
  });
  return services;
};

const getAllServicesAdmin = async (): Promise<IServiceCategory[]> => {
  await seedServicesIfEmpty();
  const services = await ServiceCategory.find({ isDeleted: false }).sort({ createdAt: 1 });
  return services;
};

const getSingleServiceBySlug = async (slug: string): Promise<IServiceCategory> => {
  await seedServicesIfEmpty();
  const service = await ServiceCategory.findOne({ slug, isDeleted: false });
  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }
  return service;
};

const createService = async (payload: Partial<IServiceCategory>): Promise<IServiceCategory> => {
  if (!payload.title || !payload.shortDesc) {
    throw new AppError(400, 'Service title and short description are required!');
  }

  const slug =
    payload.slug ||
    payload.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

  const existing = await ServiceCategory.findOne({ slug, isDeleted: false });
  if (existing) {
    throw new AppError(400, 'A service category with this title or slug already exists!');
  }

  const newService = await ServiceCategory.create({
    slug,
    title: payload.title,
    category: (payload.category || 'HOME CARE').toUpperCase(),
    badge: (payload.badge || 'B2C HOME CLEANING').toUpperCase(),
    price: payload.price || '৳3,500 BDT',
    slaTime: payload.slaTime || '30 Mins SLA',
    heroImage: payload.heroImage || '/RESIDENTIAL-DEEP-CLEANING.png',
    contentImage:
      payload.contentImage ||
      'https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400',
    shortDesc: payload.shortDesc,
    introParagraph1: payload.introParagraph1 || payload.shortDesc,
    introParagraph2: payload.introParagraph2 || '',
    status: payload.status || 'ACTIVE',
  });

  emitServiceUpdated({ action: 'create', service: newService });

  return newService;
};

const updateService = async (
  serviceId: string,
  payload: Partial<IServiceCategory>,
): Promise<IServiceCategory> => {
  const service = await ServiceCategory.findOne({
    $or: [{ _id: serviceId }, { slug: serviceId }],
    isDeleted: false,
  });

  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }

  const updatedService = await ServiceCategory.findOneAndUpdate(
    { _id: service._id, isDeleted: false },
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedService) {
    throw new AppError(500, 'Failed to update service!');
  }

  emitServiceUpdated({ action: 'update', service: updatedService });

  return updatedService;
};

const deleteService = async (serviceId: string): Promise<null> => {
  const service = await ServiceCategory.findOne({
    $or: [{ _id: serviceId }, { slug: serviceId }],
    isDeleted: false,
  });

  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }

  await ServiceCategory.findOneAndUpdate({ _id: service._id }, { isDeleted: true });

  emitServiceUpdated({ action: 'delete', serviceId: service._id });

  return null;
};

export const ServiceCategoryService = {
  getActiveServices,
  getAllServicesAdmin,
  getSingleServiceBySlug,
  createService,
  updateService,
  deleteService,
};
