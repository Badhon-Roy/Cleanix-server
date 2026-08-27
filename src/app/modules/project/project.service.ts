import { Project } from './project.model';
import { IProject } from './project.interface';

export const initialProjectsList: IProject[] = [
  {
    slug: 'residential-deep-cleaning',
    title: 'GULSHAN 2 DUPLEX VILLA FULL RESIDENTIAL DEEP CLEAN',
    category: 'RESIDENTIAL',
    heroImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80',
    benefitImage: 'https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630',
    client: 'Chowdhury Residence (Gulshan 2)',
    categoryFull: 'Residential Turnover / Deep Cleaning',
    startDate: '05 February, 2026',
    endDate: '07 February, 2026',
    projectValue: '৳18,500 BDT',
    introParagraph:
      'গুলশান ২ এর ৪,৫০০ স্কয়ার ফিট ডুপ্লেক্স ভিলার জন্য কাস্টমাইজড ডিপ ক্লিনিং প্রজেক্ট সফলভাবে সম্পন্ন হয়েছে। বাসাটিতে নতুন মেহমান আগমনের পূর্বে কিচেন গ্রিজ ওয়াশ, মার্বেল ফ্লোর বাফিং, বাথরুম টাইলস ডিসইনফেকশন ও উচ্চ মেট্রেস ভ্যাকুয়ামিং সম্পন্ন করা হয়।',
    section2Title: 'COMPLETE FRESH RESET FOR LUXURY HOMES',
    section2Paragraph:
      'ব্যস্ততার কারণে নিয়মিত ঝাড়ু-মোছায় জমে থাকা জেদি ধুলো ও জীবাণু দূর করতে আমাদের ৪ জন এনআইডি ভেরিফাইড ক্লিনার স্টিম শ্যাম্পু ও অর্গানিক কেমিক্যাল ব্যবহার করেন। প্রতিটি কক্ষের জন্য আলাদা ড্রাই-ভ্যাকুয়ামিং কোয়ালিটি ইনসপেকশন করা হয়।',
    benefitsTitle: 'PROJECT BENEFITS (প্রজেক্টের বিশেষ সুবিধাসমূহ)',
    benefitsPoints: [
      'Full Villa Room-by-Room Deep Clean',
      'Kitchen Hood & Chimney Degreasing',
      'Bathroom Anti-Bacterial Sanitizing',
      'Cabinet Interiors & Closet Wipe Down',
      'Marble & Floor Shine Polish Refresh',
      'VIP Concierge Final Walkthrough Support',
    ],
    section4Title: 'READY FOR HIGH-PROFILE GUEST RECEPTION',
    section4Paragraph:
      'প্রজেক্ট শেষে ভিলার প্রতিটি ঘর শতভাগ জীবাণুমুক্ত ও মেহমানদের অভ্যর্থনার জন্য প্রস্তুত হয়ে ওঠে। বাড়িওয়ালা চৌধুরী পরিবার কাজের দ্রুততা ও পরিচ্ছন্নতায় অত্যন্ত সন্তুষ্টি প্রকাশ করেন।',
    status: 'PUBLISHED',
  },
  {
    slug: 'commercial-office-cleaning',
    title: 'BANANI CORPORATE TECH HQ FULL FLOOR SANITIZATION',
    category: 'COMMERCIAL',
    heroImage: 'https://framerusercontent.com/images/2xPMy5ZILkyS0vKBXtkUtkotq4.png?width=536&height=491',
    benefitImage: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=1000&q=80',
    client: 'TechVision Software (Banani)',
    categoryFull: 'Corporate B2B Office / Sanitization',
    startDate: '12 January, 2026',
    endDate: '15 January, 2026',
    projectValue: '৳30,000 BDT / Month',
    introParagraph:
      'বনানীর একটি ১২,০০০ স্কয়ার ফিট করপোরেট আইটি অফিসের জন্য বিটুবি সাবস্ক্রিপশন মডেলে নাইট শিফটে মাস্টার স্যানিটাইজেশন প্রজেক্ট সম্পন্ন। অফিস ডেস্কে কোনো কাজের ব্যাঘাত ছাড়াই মনিটর, কিবোর্ড, কনফারেন্স টেবিল ও রেস্টরুম ডিপ ক্লিন করা হয়।',
    section2Title: 'ZERO DISRUPTION TO DAILY WORKFLOW',
    section2Paragraph:
      'উইকেন্ডের রাতে আমাদের স্পেশাল নাইট-শিফট টিম হসপিটাল-গ্রেড ফগিং ভ্যাকুয়ামিং পরিচালনা করে। অফিস ফাইল ও সার্কিট ইকুইপমেন্টের শতভাগ সিকিউরিটি বজায় রেখে পুরো ফ্লোর ফ্রেশ করা হয়।',
    benefitsTitle: 'PROJECT BENEFITS (প্রজেক্টের বিশেষ সুবিধাসমূহ)',
    benefitsPoints: [
      'HEPA Filtration Carpet Vacuuming',
      'High-Touch Surface Disinfection',
      'Executive Restroom & Pantry Deep Reset',
      'Weekend Night Shift Execution',
      'Certified Safe Eco Disinfectants',
      'Supervisor Hygiene Audit Report',
    ],
    section4Title: 'HYGIENIC & PRODUCTIVE WORKSPACE RESULT',
    section4Paragraph:
      'সোমবার সকালে অফিসে যোগ দিয়ে কোম্পানির টিম ১০০% ফ্রেশ ও সুবাসিত পরিবেশ উপভোগ করে এবং কর্মচারীদের অসুস্থতাজনিত অনুপস্থিতি উল্লেখযোগ্যভাবে হ্রাস পায়।',
    status: 'PUBLISHED',
  },
  {
    slug: 'post-construction-cleaning',
    title: 'DHANMONDI LUXURY APARTMENT COMPLEX POST-RENOVATION CLEANUP',
    category: 'RENOVATION',
    heroImage: 'https://framerusercontent.com/images/rkv30jJZdslMW9PEgMFVtHvybU.png?width=536&height=491',
    benefitImage: 'https://framerusercontent.com/images/P64qFbW7sjXKqLCWX5Fd9KuqA.png?width=600&height=400',
    client: 'Apex Real Estate (Dhanmondi)',
    categoryFull: 'Post-Construction / Renovation',
    startDate: '20 June, 2026',
    endDate: '24 June, 2026',
    projectValue: '৳25,000 BDT',
    introParagraph:
      'ধানমন্ডির ৮,৫০০ স্কয়ার ফিটের নতুন বহুতল আবাসিক ভবনের রেনোভেশন পরবর্তী কেমিক্যাল ও সিমেন্টের ধুলো পরিষ্কার। মেঝের রঙের ফোঁটা, টাইলসের জেদি দাগ ও গ্লাসের স্টিকার স্ক্রাবিং করে ফার্নিচার শিফটিংয়ের উপযোগী করা হয়।',
    section2Title: 'INDUSTRIAL POWER & SCRUBBING CARE',
    section2Paragraph:
      'ইন্ডাস্ট্রিয়াল বাফিং মেশিন ও ডাস্ট এক্সট্র্যাক্টর ব্যবহার করে টাইলসের সিভিল দাগ তোলা হয়। আমাদের কেমিক্যাল ট্রিটমেন্টে মেঝের কালার বা টাইলস সারফেসের কোনো ক্ষতি হয়নি।',
    benefitsTitle: 'PROJECT BENEFITS (প্রজেক্টের বিশেষ সুবিধাসমূহ)',
    benefitsPoints: [
      'Heavy Cement & Dust Extraction',
      'Paint & Grout Residue Scrubbing',
      'Marble Floor Buffer & Polish',
      'Window Frame & Glass Detailing',
      'Civil Debris Disposal Support',
      'Client Handover Inspection Ready',
    ],
    section4Title: 'SPOTLESS HANDOVER READY FOR LANDLORD',
    section4Paragraph:
      'ইন্টেরিয়র ডিজাইনারদের চূড়ান্ত ইনসপেকশনে প্রজেক্টটি শতভাগ নম্বর পেয়ে উৎরে যায় এবং নতুন ফ্ল্যাটমালিকরা স্বাচ্ছন্দ্যে চাবি গ্রহণ করেন।',
    status: 'PUBLISHED',
  },
  {
    slug: 'move-out-cleaning',
    title: 'UTTARA SECTOR 7 TURNOVER CLEANING FOR DEPOSIT GUARANTEE',
    category: 'TURNOVER',
    heroImage: 'https://framerusercontent.com/images/VPbp0YEDNhSD4N9sL93WPqjBM2o.png?width=536&height=491',
    benefitImage: 'https://framerusercontent.com/images/gRwXdPkLkyJS5JXnK04q3ttVLk.png?width=600&height=400',
    client: 'Khan Residence (Uttara Sector 7)',
    categoryFull: 'Move-Out / Tenant Turnover',
    startDate: '01 August, 2026',
    endDate: '02 August, 2026',
    projectValue: '৳12,000 BDT',
    introParagraph:
      'উত্তরার ২,৮০০ স্কয়ার ফিট খালি ফ্ল্যাটের মুভ-আউট টার্নওভার ডিপ ক্লিনিং প্রজেক্ট। বাড়িওয়ালার কাছে সম্পূর্ণ সিকিউরিটি ডিপোজিট ফেরত নিশ্চিত করতে খালি বাসার আলমারির ভেতর, বাথরুম লাইমসকেল ও কিচেন চিমনি ডিপ ক্লিন করা হয়।',
    section2Title: 'TIME-CRITICAL SAME DAY TURNOVER',
    section2Paragraph:
      'মাত্র ৬ ঘণ্টার মধ্যে আমাদের ৪ জনের বিশেষ টিম খালি ফ্ল্যাটটির প্রতিটি কোণা, ভেন্টিলেটর ও দেয়ালের ছোপ দাগ মুছে ফ্রেশ চেহারা প্রদান করে।',
    benefitsTitle: 'PROJECT BENEFITS (প্রজেক্টের বিশেষ সুবিধাসমূহ)',
    benefitsPoints: [
      '100% Security Deposit Return Assurance',
      'Inside Cabinet & Wardrobe Scrub',
      'Full Bathroom Limescale & Sink Removal',
      'Wall Scuff & Mark Cleaning',
      'Same-Day Rapid Turnover Service',
      'Digital Video Walkthrough Report',
    ],
    section4Title: 'FULL SECURITY DEPOSIT REFUNDED',
    section4Paragraph:
      'বাড়িওয়ালা ফ্ল্যাটের পরিচ্ছন্নতায় অভিভূত হয়ে তাৎক্ষণিকভাবে পূর্ণাঙ্গ সিকিউরিটি ডিপোজিট রিফান্ড অনুমোদন করেন।',
    status: 'PUBLISHED',
  },
];

const getAllProjectsFromDB = async (): Promise<IProject[]> => {
  const count = await Project.countDocuments();
  if (count === 0) {
    await Project.insertMany(initialProjectsList);
  }
  return await Project.find().sort({ createdAt: -1 });
};

const getProjectBySlugFromDB = async (slug: string): Promise<IProject | null> => {
  let project = await Project.findOne({ slug });
  if (!project) {
    const count = await Project.countDocuments();
    if (count === 0) {
      await Project.insertMany(initialProjectsList);
      project = await Project.findOne({ slug });
    }
  }
  return project;
};

const createProjectInDB = async (payload: IProject): Promise<IProject> => {
  const result = await Project.create(payload);
  return result;
};

const updateProjectInDB = async (slug: string, payload: Partial<IProject>): Promise<IProject | null> => {
  const result = await Project.findOneAndUpdate(
    { slug },
    { $set: payload },
    { new: true, upsert: true },
  );
  return result;
};

const deleteProjectFromDB = async (slug: string): Promise<IProject | null> => {
  const result = await Project.findOneAndDelete({ slug });
  return result;
};

export const ProjectService = {
  getAllProjectsFromDB,
  getProjectBySlugFromDB,
  createProjectInDB,
  updateProjectInDB,
  deleteProjectFromDB,
};
