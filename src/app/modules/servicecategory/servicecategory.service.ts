import { ServiceCategory } from './servicecategory.model';
import { IServiceCategory } from './servicecategory.interface';
import AppError from '../../errors/AppError';
import { emitServiceUpdated } from '../../socket/socket';

const defaultSeedServices: Partial<IServiceCategory>[] = [
  {
    slug: "residential-deep-cleaning",
    title: "RESIDENTIAL DEEP CLEANING (আবাসিক ডিপ ক্লিনিং)",
    category: "HOME CARE",
    badge: "B2C HOME CLEANING",
    price: "৳3,500 BDT",
    slaTime: "30 Mins SLA",
    heroImage: "/RESIDENTIAL-DEEP-CLEANING.png",
    contentImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    shortDesc: "ঢাকার যেকোনো অ্যাপার্টমেন্ট ও আবাসিক বাড়ির জন্য সম্পূর্ণ রুম-বাই-রুম ডিপ রিফ্রেশ ক্লিনিং ও অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন।",
    introParagraph1: "Cleanix-এর আবাসিক ডিপ ক্লিনিং সার্ভিস আপনার বাসা বা অ্যাপার্টমেন্টকে করে তোলে সম্পূর্ণ জীবাণুমুক্ত ও ঝকঝকে।",
    introParagraph2: "গুলশান, বনানী, উত্তরা, ধানমন্ডি বা বসুন্ধরার যেকোনো অ্যাপার্টমেন্টের জন্য আমাদের এনআইডি ট্র্যাকিংকৃত এক্সপার্ট ক্লিনার টিম স্পেশাল কেয়ার ও রিয়েল-টাইম লাইভ আপডেটের মাধ্যমে সর্বোচ্চ কোয়ালিটি নিশ্চিত করে।",
    offersTitle: "WHAT WE OFFER (আমাদের বিশেষ সেবাসমূহ)",
    offersDesc: "ঢাকার ব্যস্ত পরিবারের জন্য নমনীয় সময়সূচী অনুযায়ী ডিপ ক্লিনিং প্যাকেজ। প্রতিটি ভিজিটে নিশ্চিত করা হয় আন্তর্জাতিক মানের হাইজিন ও ডিপ রিসেট।",
    offers: [
      { iconName: "Sparkles", title: "Detailed Room-By-Room Cleaning", desc: "বেডরুম, লিভিং রুম, ডাইনিং টেবিল, ব্যালકની ও উইন্ডো গ্লাস ডিপ ডাস্টিং ও ভ্যাকুয়ামিং।" },
      { iconName: "Utensils", title: "Kitchen & Bathroom Sanitization", desc: "বাথরুম টাইলসের জেদি দাগ দূর করা এবং কিচেন ওভেন, সিঙ্ক ও ফিটিংস অ্যান্টি-ব্যাকটেরিয়াল ওয়াশ।" },
      { iconName: "Clock", title: "Flexible Scheduling & Subscriptions", desc: "৳6,000 বা ৳14,000 মান্থলি প্যাকেজে অথবা ওয়ান-টাইম ইন্সট্যান্ট বুকিংয়ের সুবিধা।" }
    ],
    whyChooseTitle: "WHY CHOOSE OUR RESIDENTIAL DEEP CLEANING",
    whyChooseDesc: "সাধারণ দৈনিক মোছামুছিতে বাসার গভীর ধুলোবালি ও জীবাণু দূর হয় না। Cleanix-এর ডিপ ক্লিনিং আপনার বাসার প্রতিটি কোণ সুরক্ষিত ও মেহমান-প্রস্তুত রাখে।",
    whyChoosePoints: [
      { title: "NID Verified Staff", desc: "১০০% ব্যাকগ্রাউন্ড ভেরিফাইড এবং সুসজ্জিত পোশাক পরিহিত বিশ্বস্ত ক্লিনিং টিম।" },
      { title: "Eco-Friendly Safe Chemicals", desc: "শিশু ও পোষা প্রাণীর জন্য সম্পূর্ণ নিরাপদ, আন্তর্জাতিক সার্টিফাইড ইকো কেমিক্যালস।" },
      { title: "Real-Time Job Tracking", desc: "ক্লিনার আসার সময় ও কাজের অগ্রগতি সম্পর্কে রিয়েল-টাইম এসএমএস নোটিফিকেশন।" },
      { title: "Digital Invoice & Local Payments", desc: "bKash, Nagad, SSLCommerz বা ক্যাশ অন ডেলিভারিতে ঝামেলাহীন পেমেন্ট সুবিধা।" }
    ],
    status: "ACTIVE",
    isDeleted: false
  },
  {
    slug: "commercial-office-cleaning",
    title: "COMMERCIAL OFFICE CLEANING (অফিস ও বাণিজ্যিক ক্লিনিং)",
    category: "COMMERCIAL",
    badge: "B2B CORPORATE SOLUTION",
    price: "৳8,500 BDT",
    slaTime: "25 Mins SLA",
    heroImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    contentImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    shortDesc: "কর্পোরেট অফিস, শোরুম, আইটি ফার্ম ও ব্যাংক ব্রাঞ্চের জন্য প্রফেশনাল নাইট সেফট স্যানিটাইজেশন ও কার্পেট ওয়াশ।",
    introParagraph1: "Cleanix-এর কর্পোরেট ক্লিনিং সলিউশন আপনার অফিসের কাজের পরিবেশকে উন্নত, সতেজ এবং সম্পূর্ণ জীবাণুমুক্ত রাখে।",
    introParagraph2: "আমরা ফ্লেক্সিবল অফ-আওয়ার্স এবং উইকেন্ড শিডিউলে ক্লিনিং সেবা দিই যেন আপনার ব্যবসায়িক কার্যক্রমে কোনো ব্যাঘাত না ঘটে।",
    offersTitle: "WHAT WE OFFER (আমাদের কর্পোরেট সেবাসমূহ)",
    offersDesc: "আইটি ফার্ম, ব্যাংক ব্রাঞ্চ, মাল্টিন্যাশনাল কর্পোরেট ও রিটেইল শোরুমের জন্য মান্থলি কন্ট্রাক্ট ও ডেডিকেটেড হাউসকেপিং।",
    offers: [
      { iconName: "Sparkles", title: "Workstation & Desk Sanitization", desc: "কম্পিউটার মনিটর, কিবোর্ড, ডেস্ক সারফেস ও কনফারেন্স রুম অ্যান্টি-স্ট্যাটিক ওয়াশ।" },
      { iconName: "ShieldCheck", title: "Heavy-Duty Carpet Shampoo", desc: "অফিস কার্পেট ও এক্সিকিউটিভ চেয়ারের জন্য ড্রাই-ফোম ডিপ সাকশন শ্যাম্পু ক্লিনিং।" }
    ],
    whyChooseTitle: "WHY CHOOSE OUR COMMERCIAL CLEANING",
    whyChooseDesc: "স্বাস্থ্যকর অফিস মানেই কর্মীদের বেশি কর্মক্ষমতা ও ভালো ব্র্যান্ড ইমেজ।",
    whyChoosePoints: [
      { title: "Dedicated Account Manager", desc: "কর্পোরেট ক্লায়েন্টদের জন্য একক পয়েন্ট অফ কন্টাক্ট ও মান্থলি রিপোর্টিং।" },
      { title: "Off-Hours Flexibility", desc: "অফিসের কাজের বাইরে নাইট শিফটে বা ছুটির দিনে ক্লিনিং সুবিধা।" }
    ],
    status: "ACTIVE",
    isDeleted: false
  },
  {
    slug: "move-in-move-out-cleaning",
    title: "MOVE-IN & MOVE-OUT CLEANING (বাসা পরিবর্তন ক্লিনিং)",
    category: "RELOCATION",
    badge: "TURNOVER SPECIAL",
    price: "৳5,000 BDT",
    slaTime: "40 Mins SLA",
    heroImage: "/RESIDENTIAL-DEEP-CLEANING.png",
    contentImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    shortDesc: "নতুন বাসায় ওঠার আগে বা পুরোনো বাসা ছাড়ার পর সম্পূর্ণ বাড়ি জঞ্জালমুক্ত, ধুলোমুক্ত ও স্যানিটাইজড করার নির্ভরযোগ্য সেবা।",
    introParagraph1: "নতুন ফ্ল্যাটে শিফট করার আগে পুরো বাসা জীবানুমুক্ত ও ধুলোহীন করা একটি বিশাল চ্যালেঞ্জ। Cleanix আপনার শিফটিংকে করে তোলে ১০০% মানসিক শান্তিময়।",
    introParagraph2: "পূর্ববর্তী ভাড়াটিয়ার ফেলে যাওয়া ময়লা ও জেদি দাগ দূর করে আমরা নতুন ফ্ল্যাটকে মেহমান-প্রস্তুত করে তুলি।",
    offersTitle: "WHAT WE OFFER (বাসা বদল সেবাসমূহ)",
    offersDesc: "সম্পূর্ণ খালি ফ্ল্যাটের গভীর ক্লিনিং ও ওডিস সাবপ্রেশন।",
    offers: [
      { iconName: "Sparkles", title: "Empty Flat Deep Reset", desc: "দেয়াল, সিলিং ফ্যান, ক্যাবিনেট ও লাইটিং ফিটিংসের সমস্ত ধুলোবালি সাফ করা।" },
      { iconName: "Utensils", title: "Full Kitchen & Bath Reset", desc: "কিচেন ড্রয়ার, ক্যাবিনেট ও বাথরুমের সব ড্রেন ও সারফেস স্যানিটাইজেশন।" }
    ],
    whyChooseTitle: "WHY CHOOSE MOVE-IN RESET",
    whyChooseDesc: "বাসা পরিবর্তনের ঝামেলার মাঝে ক্লিনিংয়ের চিন্তাকে দূরে রাখুন। Cleanix-এর স্পেশাল টিম প্রস্তুত আপনার জন্য।",
    whyChoosePoints: [
      { title: "100% Ready-To-Move Condition", desc: "ক্লিনিং শেষ হওয়ার পরেই আপনি আসবাবপত্র গুছানো শুরু করতে পারবেন।" }
    ],
    status: "ACTIVE",
    isDeleted: false
  },
  {
    slug: "post-construction-cleaning",
    title: "POST-CONSTRUCTION CLEANING (নির্মাণ পরবর্তী ক্লিনিং)",
    category: "HEAVY DUTY",
    badge: "PROJECT HANDOVER",
    price: "৳10,000 BDT",
    slaTime: "45 Mins SLA",
    heroImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    contentImage: "https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400",
    shortDesc: "নতুন বাড়ি বা রেনোভেশন শেষে সিমেন্ট, রং, প্লাস্টার ও কাঁচের দাগ দূর করে নিখুঁত হ্যান্ডওভার প্রস্তুত ক্লিনিং।",
    introParagraph1: "রেনোভেশন বা নতুন বিল্ডিং কনস্ট্রাকশন শেষে মেঝের রং, সিমেন্টের অবশিষ্টাংশ এবং সিলিংয়ের বালি সাধারণ ঝাড়ুতে পরিষ্কার করা অসম্ভব।",
    introParagraph2: "Cleanix-এর হেভি-ডিউটি মেশিনারিজ ও কেমিক্যাল স্ক্র্যাপিং টিম আপনার নতুন প্রোপার্টিকে হ্যান্ডওভার করার জন্য একদম প্রস্তুত করে তোলে।",
    offersTitle: "WHAT WE OFFER (নির্মাণ পরবর্তী সেবাসমূহ)",
    offersDesc: "বাণিজ্যিক ও আবাসিক নতুন প্রোপার্টির জন্য অল-ইন-ওয়ান হেভি ক্লিনিং।",
    offers: [
      { iconName: "Sparkles", title: "Paint & Cement Spot Removal", desc: "টাইলস ও গ্লাসে লেগে থাকা শক্ত সিমেন্ট ও পেইন্ট স্পট বিশেষ স্ক্র্যাপার দিয়ে দূর করা।" },
      { iconName: "ShieldCheck", title: "Debris Cleanup & Scrubbing", desc: "ফ্লোর স্কাবার মেশিন দিয়ে মেঝের সমস্ত দাগ ও নির্মাণ ধুলো নিখুঁতভাবে পলিশ করা।" }
    ],
    whyChooseTitle: "WHY CHOOSE POST-CONSTRUCTION RESET",
    whyChooseDesc: "নতুন ঘর বা প্রোপার্টির ক্ষতি না করে নিখুঁত প্রফেশনাল ফিনিশিংয়ের নিশ্চয়তা।",
    whyChoosePoints: [
      { title: "Industrial Grade Equipment", desc: "হাই-প্রেসার ওয়াশার, ভ্যাকুয়াম এবং হেভি ফ্লোর স্কাবার মেশিন ব্যবহার।" }
    ],
    status: "ACTIVE",
    isDeleted: false
  }
];

const seedInitialServicesIfNeeded = async () => {
  const count = await ServiceCategory.countDocuments({ isDeleted: false });
  if (count === 0) {
    await ServiceCategory.insertMany(defaultSeedServices);
  }
};

const getActiveServices = async (): Promise<IServiceCategory[]> => {
  await seedInitialServicesIfNeeded();
  const services = await ServiceCategory.find({ status: 'ACTIVE', isDeleted: false }).sort({
    createdAt: 1,
  });
  return services;
};

const getAllServicesAdmin = async (): Promise<IServiceCategory[]> => {
  await seedInitialServicesIfNeeded();
  const services = await ServiceCategory.find({ isDeleted: false }).sort({ createdAt: 1 });
  return services;
};

const getSingleServiceBySlug = async (identifier: string): Promise<IServiceCategory> => {
  const isObjectId = identifier ? identifier.match(/^[0-9a-fA-F]{24}$/) : null;
  const service = await ServiceCategory.findOne({
    $or: [
      { slug: identifier },
      ...(isObjectId ? [{ _id: identifier }] : []),
    ],
    isDeleted: false,
  });
  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }
  return service;
};

const createService = async (payload: Partial<IServiceCategory>): Promise<IServiceCategory> => {
  if (!payload.title || !payload.shortDesc) {
    throw new AppError(400, 'Service title and short description are required!');
  }

  const adminShare = payload.adminShare !== undefined ? Number(payload.adminShare) : 50;
  const teamLeaderShare = payload.teamLeaderShare !== undefined ? Number(payload.teamLeaderShare) : 10;
  const cleanerPoolShare = payload.cleanerPoolShare !== undefined ? Number(payload.cleanerPoolShare) : 40;

  const totalSplit = adminShare + teamLeaderShare + cleanerPoolShare;
  if (totalSplit !== 100) {
    throw new AppError(
      400,
      `Commission split percentages must equal 100%! Current sum: ${totalSplit}% (Admin: ${adminShare}%, Leader: ${teamLeaderShare}%, Cleaner: ${cleanerPoolShare}%)`,
    );
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
    price: payload.price || '৳3,500',
    slaTime: payload.slaTime || '30 Mins SLA',
    heroImage: payload.heroImage || '/RESIDENTIAL-DEEP-CLEANING.png',
    contentImage:
      payload.contentImage ||
      'https://framerusercontent.com/images/umUJPorhrTL7f9c5r9HBu8jbmg.png?width=600&height=400',
    shortDesc: payload.shortDesc,
    introParagraph1: payload.introParagraph1 || payload.shortDesc,
    introParagraph2: payload.introParagraph2 || '',
    offersTitle: payload.offersTitle,
    offersDesc: payload.offersDesc,
    offers: payload.offers || [],
    whyChooseTitle: payload.whyChooseTitle,
    whyChooseDesc: payload.whyChooseDesc,
    whyChoosePoints: payload.whyChoosePoints || [],
    faqs: payload.faqs || [],
    fields: payload.fields || [],
    adminShare,
    teamLeaderShare,
    cleanerPoolShare,
    status: payload.status || 'ACTIVE',
  });

  emitServiceUpdated({ action: 'create', service: newService });

  return newService;
};

const updateService = async (
  serviceId: string,
  payload: Partial<IServiceCategory>,
): Promise<IServiceCategory> => {
  const isObjectId = serviceId && serviceId.match(/^[0-9a-fA-F]{24}$/);
  const service = await ServiceCategory.findOne({
    $or: [
      { slug: serviceId },
      ...(isObjectId ? [{ _id: serviceId }] : []),
    ],
    isDeleted: false,
  });

  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }

  // Validate commission split if provided
  const adminShare = payload.adminShare !== undefined ? Number(payload.adminShare) : service.adminShare ?? 50;
  const teamLeaderShare = payload.teamLeaderShare !== undefined ? Number(payload.teamLeaderShare) : service.teamLeaderShare ?? 10;
  const cleanerPoolShare = payload.cleanerPoolShare !== undefined ? Number(payload.cleanerPoolShare) : service.cleanerPoolShare ?? 40;

  if (payload.adminShare !== undefined || payload.teamLeaderShare !== undefined || payload.cleanerPoolShare !== undefined) {
    const totalSplit = adminShare + teamLeaderShare + cleanerPoolShare;
    if (totalSplit !== 100) {
      throw new AppError(
        400,
        `Commission split percentages must equal 100%! Current sum: ${totalSplit}% (Admin: ${adminShare}%, Leader: ${teamLeaderShare}%, Cleaner: ${cleanerPoolShare}%)`,
      );
    }
  }

  const updatedPayload = {
    ...payload,
    adminShare,
    teamLeaderShare,
    cleanerPoolShare,
  };

  const updatedService = await ServiceCategory.findOneAndUpdate(
    { _id: service._id, isDeleted: false },
    { $set: updatedPayload },
    { new: true, runValidators: true },
  );

  if (!updatedService) {
    throw new AppError(500, 'Failed to update service!');
  }

  emitServiceUpdated({ action: 'update', service: updatedService });

  return updatedService;
};

const deleteService = async (serviceId: string): Promise<null> => {
  const isObjectId = serviceId && serviceId.match(/^[0-9a-fA-F]{24}$/);
  const service = await ServiceCategory.findOne({
    $or: [
      { slug: serviceId },
      ...(isObjectId ? [{ _id: serviceId }] : []),
    ],
    isDeleted: false,
  });

  if (!service) {
    throw new AppError(404, 'Service category not found!');
  }

  await ServiceCategory.findOneAndUpdate({ _id: service._id }, { isDeleted: true });

  emitServiceUpdated({ action: 'delete', serviceId: service._id });

  return null;
};

const getCatalogOverview = async () => {
  const allServices = await ServiceCategory.find({ isDeleted: false });
  const activeServicesList = allServices.filter((s) => s.status === 'ACTIVE');

  const totalServices = allServices.length;
  const activeServices = activeServicesList.length;

  let minPrice = 3500;
  if (activeServicesList.length > 0) {
    const prices = activeServicesList
      .map((s) => {
        const num = parseFloat(String(s.price).replace(/[^0-9.]/g, ''));
        return isNaN(num) || num <= 0 ? null : num;
      })
      .filter((p): p is number => p !== null);

    if (prices.length > 0) {
      minPrice = Math.min(...prices);
    }
  }
  const startingRate = `৳${minPrice.toLocaleString()}`;

  let avgSlaResponse = '25-30 Mins';
  const slaNumbers: number[] = [];
  activeServicesList.forEach((s) => {
    if (s.slaTime) {
      const matches = s.slaTime.match(/\d+/g);
      if (matches) {
        matches.forEach((m) => {
          const num = parseInt(m, 10);
          if (!isNaN(num) && num > 0) slaNumbers.push(num);
        });
      }
    }
  });

  if (slaNumbers.length > 0) {
    const minSla = Math.min(...slaNumbers);
    const maxSla = Math.max(...slaNumbers);
    avgSlaResponse = minSla === maxSla ? `${minSla} Mins` : `${minSla}-${maxSla} Mins`;
  }

  return {
    totalServices,
    activeServices,
    startingRate,
    avgSlaResponse,
  };
};

export const ServiceCategoryService = {
  getActiveServices,
  getAllServicesAdmin,
  getSingleServiceBySlug,
  getCatalogOverview,
  createService,
  updateService,
  deleteService,
};
