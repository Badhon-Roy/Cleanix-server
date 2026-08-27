import { CMS } from './cms.model';
import {
  IHomeCMSContent,
  IAboutCMSContent,
  IServicesCMSContent,
  IProjectsCMSContent,
  IPricingCMSContent,
  ICoverageCMSContent,
  IContactCMSContent,
} from './cms.interface';

const defaultHomeCMSContent: IHomeCMSContent = {
  heroBadge: "BANGLADESH'S #1 HYBRID CLEANING PLATFORM",
  heroTitleLine1: 'RELIABLE CLEANING,',
  heroTitleLine2: 'HOMES & OFFICES',
  heroDescription:
    'আবাসিক বাসা এবং কর্পোরেট অফিসের জন্য প্রিমিয়াম ডিপ ক্লিনিং সার্ভিস। দক্ষ টিম, অ্যান্টি-ব্যাকটেরিয়াল স্যানিটাইজেশন ও সহজ বুকিং।',
  heroImage: '/hero-cleaner.png',
  heroBtn1Text: 'Our Services',
  heroBtn1Href: '/services',
  heroBtn2Text: 'Get Free Quote',
  heroBtn2Href: '/contact',

  impactBadge: 'OUR IMPACT & NUMBERS',
  impactTitleLine1: 'REAL NUMBERS BEHIND OUR',
  impactTitleHighlight: 'CLEANING EXCELLENCE',
  impactSubtitle:
    'বাংলাদেশের প্রতিটি বাসা ও কর্পোরেট অফিস স্পেসকে শতভাগ জীবাণুমুক্ত ও ঝকঝকে রাখার নির্ভরযোগ্য ডিজিটাল সমাধান।',
  impactLeftImage:
    'https://framerusercontent.com/images/7kuxPVTjMLe1PbETJGXV0BIBB6s.png?scale-down-to=512&width=901&height=826',
  impactRightImage:
    'https://framerusercontent.com/images/RakXiRCu0eigdFvdHDqHa9us9PQ.png?width=855&height=858',

  impactStat1Value: '2,500+',
  impactStat1Label: 'ক্লিন করা বাসা ও অফিস',
  impactStat2Value: '150+',
  impactStat2Label: 'ভেরিফাইড প্রফেশনাল ক্লিনার',
  impactStat3Value: '99.2%',
  impactStat3Label: 'সন্তোষজনক কাস্টমার রেটিং',

  whyUsBadge: 'WHY CHOOSE US',
  whyUsTitleLine1: 'WHY CHOOSE OUR CLEANIX',
  whyUsTitleHighlight: 'CLEANING',
  whyUsTitleLine2: 'SERVICES',
  whyUsCleanerImage: '/why-choose-cleaner.png',

  whyUsCard1Title: 'Verified Professional Cleaners',
  whyUsCard1Checks: [
    'NID ও পুলিশ ব্যাকগ্রাউন্ড ভেরিফাইড',
    'আন্তর্জাতিক স্ট্যান্ডার্ড ট্রেনিংপ্রাপ্ত',
  ],

  whyUsCard2Title: 'Safe & Eco-Friendly Solutions',
  whyUsCard2Checks: [
    'শিশু ও পোষা প্রাণীর জন্য শতভাগ নিরাপদ',
    'অ্যান্টি-ব্যাকটেরিয়াল কেমিক্যাল স্যানিটাইজ',
  ],

  whyUsCard3Title: 'Flexible Subscriptions & Slots',
  whyUsCard3Checks: [
    'মাসিক প্যাকেজ ও ইনস্ট্যান্ট এককালীন বুকিং',
    'আপনার সময় অনুযায়ী স্লট সিলেক্টর',
  ],

  whyUsCard4Title: '24/7 Dedicated Support',
  whyUsCard4Checks: [
    'হটলাইন, হোয়াটসঅ্যাপ ও চ্যাট সাপোর্ট',
    '১০০% সার্ভিস স্যাটিস্ফেকশন গ্যারান্টি',
  ],

  servicesBadge: 'OUR CORE SERVICES',
  servicesTitleLine1: 'PROFESSIONAL',
  servicesTitleHighlight: 'CLEANING',
  servicesTitleLine2: 'SERVICES FOR EVERY SPACE',
  servicesSubtitle:
    'দক্ষ টিম, আন্তর্জাতিক মানের সেফ কেমিক্যালস, রিয়েল-টাইম জিপিএস ট্র্যাকিং এবং ডিজিটাল ইনভয়েসসহ প্রিমিয়াম সার্ভিস।',

  ctaBadge: 'GET IN TOUCH TODAY',
  ctaTitle: 'READY FOR A SPOTLESS & HEALTHY SPACE?',
  ctaSubtitle:
    'আজই আপনার বাসা বা অফিসের জন্য বিশ্বমানের ক্লিনিং টিম বুক করুন অথবা কয়েক সেকেন্ডে ইনস্ট্যান্ট ফ্রি এস্টিমেট নিন।',
  ctaBtnText: 'Book Service Now',
  ctaBtnHref: '/contact',

  faqBadge: 'FAQ & HELP',
  faqTitle: 'FREQUENTLY ASKED QUESTIONS',
  faqImage:
    'https://framerusercontent.com/images/UaZYgh11hZSeJVH37MEKUXPqJb0.png?width=708&height=450',
  faqItems: [
    {
      id: 1,
      question: 'ক্লিনিং সার্ভিস সম্পন্ন করতে কত সময় লাগে?',
      answer:
        'সম্পত্তির স্কয়ার ফিট (SqFt) ও রুমের ওপর ভিত্তি করে সাধারণত ৩ থেকে ৬ ঘণ্টা সময় লাগে। ক্লিনার টিম পৌঁছানোর আগেই আপনাকে নিখুঁত টাইমলাইন জানিয়ে দেওয়া হবে।',
    },
    {
      id: 2,
      question: 'আমাকে কি পরিষ্কারের কোনো সরঞ্জাম বা কেমিক্যাল দিতে হবে?',
      answer:
        'একদমই না! আমাদের পেশাদার টিম আন্তর্জাতিক মানের সেফ কেমিক্যালস, ভ্যাকুয়াম অ্যান্ড ড্রাইয়ার এবং স্যানিটাইজিং ইক্যুইপমেন্ট নিজেদের সাথে নিয়ে আসে।',
    },
    {
      id: 3,
      question: 'ঢাকার কোন কোন এলাকায় আপনাদের সার্ভিস চালু আছে?',
      answer:
        'বর্তমানে গুলশান, বনানী, উত্তরা, ধানমন্ডি, মিরপুর, মতিঝিল, বসুন্ধরা আবাসিক এলাকা এবং ঢাকা মেট্রোপলিটনের সমস্ত প্রধান বাণিজ্যিক ও আবাসিক এলাকায় সার্ভিস এভেইলএবল।',
    },
    {
      id: 4,
      question: 'আমি কি মাসিক সাবস্ক্রিপশন বা নিয়মিত সার্ভিস নিতে পারব?',
      answer:
        'হ্যাঁ! আপনি আমাদের Basic (৳6,000/মাস), Standard (৳14,000/মাস) বা Premium (৳30,000/মাস) প্ল্যান বেছে নিয়ে রেগুলার সাপ্তাহিক/পাক্ষিক অটোমেটেড সার্ভিস নিতে পারেন।',
    },
  ],
};

const defaultAboutCMSContent: IAboutCMSContent = {
  heroBadge: 'ABOUT CLEANIX',
  heroTitleLine1: 'REDEFINING CLEANLINESS WITH',
  heroTitleHighlight: 'TECHNOLOGY',
  heroSubtitle:
    'বাংলাদেশের প্রথম SaaS-চালিত অন-ডিমান্ড স্মার্ট ফিল্ড সার্ভিস প্ল্যাটফর্ম—যেখানে প্রতিটি সেবা শতভাগ স্বচ্ছ, নিখুঁত এবং নিরাপদ।',
  heroImage: '/hero-cleaner.png',

  overviewBadge: 'COMPANY OVERVIEW',
  overviewTitle1: 'PROFESSIONAL CLEANING',
  overviewTitleHighlight: 'SERVICE NETWORK',
  overviewDesc:
    'ঢাকার যেকোনো রেসিডেন্সিয়াল হোম, করপোরেট অফিস, শোরুম ও স্থানান্তরিত স্পেসের জন্য এনআইডি ভেরিফাইড টিম, সার্টিফাইড কেমিক্যালস এবং অটোমেটেড অ্যাপ সাবস্ক্রিপশন সুবিধা।',
  overviewLeftImage: '/RESIDENTIAL-DEEP-CLEANING.png',
  overviewRightImage: '/COMMERCIAL-OFFICE-CLEANING.png',

  stat1Count: '16K+',
  stat1Label: 'Cleanings Completed',
  stat2Count: '1,200+',
  stat2Label: 'Satisfied Clients',
  stat3Count: '4.9 / 5',
  stat3Label: 'Average Client Rating',

  whoWeAreBadge: 'ABOUT OUR COMPANY',
  whoWeAreTitle:
    'DELIVERING RELIABLE CLEANING SOLUTIONS WITH PROFESSIONAL CARE & LASTING',
  whoWeAreHighlight: 'QUALITY',
  whoWeAreFeatureImage: '/about-cleaner.png',
  whoWeAreExpYears: '10+',
  whoWeAreExpLabel: 'Years of Cleaning Experience',
  whoWeAreClientsCount: '1,250+ Happy Clients',
  whoWeAreRatingScore: '4.8/5.0',
  whoWeAreSubheading: 'আমরা কারা? (Who We Are)',
  whoWeArePara1:
    'Cleanix হলো বাংলাদেশের প্রথম SaaS-চালিত হাইব্রিড স্মার্ট ক্লিনিং প্ল্যাটফর্ম। আমরা আবাসিক বাসা এবং গুলশান, বনানী, মতিঝিল ও উত্তরায় যেকোনো আকারের কর্পোরেট অফিসের জন্য বিশ্বমানের জীবাণুমুক্তকরণ ও প্রিমিয়াম ডিপ ক্লিনিং সেবা প্রদান করি।\n\nআমাদের রয়েছে ব্যাকগ্রাউন্ড-ভেরিফাইড দক্ষ টিম, আন্তর্জাতিক মানের ইকো-ফ্রেন্ডলি সেফ কেমিক্যালস এবং লাইভ জিপিএস ট্র্যাকিং সিস্টেম—যা নিশ্চিত করে শতভাগ হাইজিন ও সময়নিষ্ঠতা।',
  whoWeArePara2: '',
  whoWeAreCheck1: '98% ON-TIME ARRIVAL IN DHAKA',
  whoWeAreCheck2: '1,250+ SATISFIED CLIENTS',
  whoWeAreCheck3: '100% VERIFIED CLEANER TEAMS',
  whoWeAreCheck4: '24/7 DEDICATED SUPPORT',

  teamMembers: [
    {
      id: 'TM-101',
      name: 'Tariqul Islam',
      role: 'Head of Operations & Quality Audit',
      image:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      nidVerified: true,
      bio: '১০ বছরের ফিল্ড সার্ভিস অভিজ্ঞতা সহ প্রতিটি ডিপ ক্লিনিং প্রজেক্ট ইনসপেকশনের দায়িত্বপ্রাপ্ত কর্মকর্তা।',
    },
    {
      id: 'TM-102',
      name: 'Nusrat Jahan',
      role: 'Customer Success & Concierge Director',
      image:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      nidVerified: true,
      bio: 'ভিআইপি কাস্টমার হ্যান্ডলিং ও অনলাইন বুকিং অ্যাসিস্ট্যান্স পরিচালনা কর্মকর্তা।',
    },
    {
      id: 'TM-103',
      name: 'Rafiq Ahmed',
      role: 'Senior Safety & Chemical Hygiene Specialist',
      image:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      nidVerified: true,
      bio: 'ইকো-ফ্রেন্ডলি সার্টিফাইড অর্গানিক কেমিক্যাল ও স্টিম অ্যাপ্লায়েন্স কেয়ার এক্সপার্ট।',
    },
  ],

  ctaBannerImage:
    'https://framerusercontent.com/images/hykQu8sbeIwxfZ3UXUa3Ce7b47E.png?width=1880&height=750',
  ctaBadgeText: '• CLEANING • DEEP CLEAN • HOME CARE • SANITIZE',
  ctaTitle: "LET'S MOVE YOUR CLEANING WITH PROFESSIONAL",
  ctaCheck1: 'RESIDENTIAL CLEANING SERVICES',
  ctaCheck2: 'COMMERCIAL CLEANING SOLUTIONS',
  ctaCheck3: 'ECO-FRIENDLY CLEANING PRODUCTS',
  ctaChecks: [
    'RESIDENTIAL CLEANING SERVICES',
    'COMMERCIAL CLEANING SOLUTIONS',
    'ECO-FRIENDLY CLEANING PRODUCTS',
  ],
  ctaButtonText: 'Get a Quote',
  ctaButtonLink: '/#quote',

  journeyBadge: 'OUR JOURNEY',
  journeyTitle: 'BUILDING CLEANER SPACES',
  journeyHighlight: 'WITH EVERY SERVICE',
  journeySteps: [
    {
      id: 'JS-101',
      number: '01',
      year: '2025–2026',
      side: 'right',
      title: 'Expanding Smart SaaS Automation Across Dhaka City',
      desc: 'গুলশান, বনানী, উত্তরা, ধানমন্ডি ও মতিঝিলে আমাদের ১,২০০+ সক্রিয় বিটুবি ও বিটুসি গ্রাহকদের জন্য রিয়েল-টাইম জিপিএস ট্র্যাকিং, অনলাইন বিটুবি সাবস্ক্রিপশন ও ডিজিটাল ইনভয়েসিং সিস্টেম চালু।',
    },
    {
      id: 'JS-102',
      number: '02',
      year: '2022–2023',
      side: 'left',
      title: 'Hospital-Grade Chemical & HEPA Scrubbers Setup',
      desc: 'বাংলাদেশি বাসাবাড়ি ও অফিসের জন্য বিশ্বমানের অ্যান্টি-ব্যাকটেরিয়াল ইকো কেমিক্যালস, ইন্ডাস্ট্রিয়াল ফ্লোর বাফার ও ১০০% এনআইডি-ভেরিফাইড প্রফেশনাল ক্লিনার টিম গঠন।',
    },
    {
      id: 'JS-103',
      number: '03',
      year: '2020–2021',
      side: 'right',
      title: 'Company Founded in Dhaka',
      desc: 'ঢাকার ব্যস্ত পরিবার ও করপোরেট প্রতিষ্ঠানকে সাশ্রয়ী খরচে (৳6,000 / ৳14,000 / ৳30,000 প্যাকেজে) নিখুঁত ও নির্ভরযোগ্য ক্লিনিং সেবা দেওয়ার ভিশন নিয়ে ক্লিনিক্সের শুভ সূচনা।',
    },
  ],
};

const getHomeCMSFromDB = async (): Promise<IHomeCMSContent> => {
  const record = await CMS.findOne({ page: 'home' });
  if (!record || !record.content) {
    return defaultHomeCMSContent;
  }
  return { ...defaultHomeCMSContent, ...(record.content as IHomeCMSContent) };
};

const updateHomeCMSInDB = async (
  payload: Partial<IHomeCMSContent>,
): Promise<{ fullContent: IHomeCMSContent; updatedFields: Partial<IHomeCMSContent> }> => {
  const current = await getHomeCMSFromDB();
  const updatedContent = { ...current, ...payload };

  const result = await CMS.findOneAndUpdate(
    { page: 'home' },
    { page: 'home', content: updatedContent },
    { new: true, upsert: true },
  );

  return {
    fullContent: result.content as IHomeCMSContent,
    updatedFields: payload,
  };
};

export const defaultServicesCMSContent: IServicesCMSContent = {
  heroBadge: "WORLD-CLASS CLEANING SOLUTIONS",
  heroTitleLine1: "EXPERT CLEANING SERVICES FOR",
  heroTitleHighlight1: "HOMES",
  heroTitleMiddle: "&",
  heroTitleHighlight2: "BUSINESSES",
  heroSubtitle:
    "আবাসিক বাসা, প্রিমিয়াম অ্যাপার্টমেন্ট, করপোরেট অফিস, স্থানান্তরযোগ্য স্থান ও রেনোভেশন পরবর্তী জায়গা পরিষ্কারের জন্য প্রস্তুত আমাদের ভেরিফাইড প্রফেশনাল টিম। আপনার চাহিদা অনুযায়ী সেরা সেবাটি বেছে নিন।",
  heroImage: "/COMMERCIAL-OFFICE-CLEANING.png",

  overviewBadge: "SERVICES OVERVIEW",
  overviewTitle1: "COMPLETE HOME & BUSINESS",
  overviewTitleHighlight: "CLEANING",
  overviewTitle2: "CARE",
  overviewDesc:
    "ঢাকার যেকোনো রেসিডেন্সিয়াল হোম, অ্যাপার্টমেন্ট, করপোরেট অফিস, শোরুম ও রেনোভেশন পরবর্তী স্পেসের জন্য আধুনিক SaaS প্ল্যাটফর্মের মাধ্যমে নির্ভরযোগ্য স্যানিটাইজেশন ও ডিপ ক্লিনিং সুবিধা।",
  overviewFeatureImage:
    "https://framerusercontent.com/images/c5y1nznyANddYfGro1eQOAip3bc.png?width=588&height=640",

  card1Title: "Residential Cleaning (B2C)",
  card1Checks: [
    "Room-by-Room Deep Clean",
    "Kitchen & Bathroom Reset",
    "Sofa & Carpet Vacuuming",
  ],

  card2Title: "Commercial Cleaning (B2B)",
  card2Checks: [
    "Workstation Sanitization",
    "Off-Hour & Weekend Shifts",
    "Monthly Corporate SLAs",
  ],

  coreBadge: "OUR CORE SERVICES",
  coreTitleLine1: "RELIABLE HOME & COMMERCIAL",
  coreTitleHighlight: "CLEANING",
  coreTitleLine2: "SERVICES",

  howItWorksBadge: "HOW IT WORKS",
  howItWorksTitle: "EASY STEPS TO BOOK YOUR",
  howItWorksHighlight: "CLEANING",
  howItWorksRightDesc:
    "সহজ বুকিং প্রসেস, ক্লিনারদের লাইভ জিপিএস ট্র্যাকিং এবং কোয়ালিটি গ্যারান্টি নিয়ে আপনার সেবা নিশ্চিত করুন ৩টি সহজ ধাপে।",
  howItWorksSteps: [
    {
      id: "HW-1",
      step: "STEP 01",
      title: "INSTANT BOOKING & ESTIMATE",
      description:
        "আপনার স্পেসের সাইজ (SqFt), রুম সংখ্যা এবং সুবিধাজনক সময় বেছে নিয়ে কয়েক সেকেন্ডে ডাইনামিক কোটেশন পেয়ে যান।",
      image:
        "https://framerusercontent.com/images/iP0bB1oMamNlkOzNJQUNBhTRiU.png?width=464&height=320",
    },
    {
      id: "HW-2",
      step: "STEP 02",
      title: "VERIFIED TEAM VISIT",
      description:
        "আমাদের ভেরিফাইড ক্লিনার টিম নির্ধারিত সময়ে পৌঁছে আন্তর্জাতিক মানের সেফ কেমিক্যালস দিয়ে সেবা প্রদান করবে।",
      image:
        "https://framerusercontent.com/images/qQZSYnMAEFCtGMlduHTBAQmANg.png?width=464&height=320",
    },
    {
      id: "HW-3",
      step: "STEP 03",
      title: "QUALITY CHECK & INVOICE",
      description:
        "কাজ শেষে বিফোর/আফটার ফটো ইনসপেকশন, ইনস্ট্যান্ট কাস্টমার রেটিং এবং অ্যাপ থেকে অটোমেটেড ইনভয়েস ডাউনলোড করুন।",
      image:
        "https://framerusercontent.com/images/2Zn55hKsUUZQoQR8DfeD1PUXY78.png?width=464&height=320",
    },
  ],
};

const getAboutCMSFromDB = async (): Promise<IAboutCMSContent> => {
  const record = await CMS.findOne({ page: 'about' });
  if (!record || !record.content) {
    return defaultAboutCMSContent;
  }
  return { ...defaultAboutCMSContent, ...(record.content as IAboutCMSContent) };
};

const updateAboutCMSInDB = async (
  payload: Partial<IAboutCMSContent>,
): Promise<{ fullContent: IAboutCMSContent; updatedFields: Partial<IAboutCMSContent> }> => {
  const current = await getAboutCMSFromDB();
  const updatedContent = { ...current, ...payload };

  const result = await CMS.findOneAndUpdate(
    { page: 'about' },
    { page: 'about', content: updatedContent },
    { new: true, upsert: true },
  );

  return {
    fullContent: result.content as IAboutCMSContent,
    updatedFields: payload,
  };
};

export const defaultProjectsCMSContent: IProjectsCMSContent = {
  heroBadge: "OUR RECENT WORK & PORTFOLIO",
  heroTitleLine1: "EXPLORE OUR",
  heroTitleHighlight: "SUCCESSFUL",
  heroTitleLine2: "CLEANING PROJECTS",
  heroSubtitle:
    "ঢাকার বিভিন্ন অভিজাত অ্যাপার্টমেন্ট, করপোরেট অফিস, শোরুম ও রেনোভেশন পরবর্তী স্থানে সম্পন্নকৃত আমাদের কিছু উল্লেখযোগ্য কাজের বাস্তব পোর্টফোলিও দেখুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  overviewBadge: "1,200+ COMPLETED PROJECTS IN DHAKA",
  overviewTitleLine1: "DELIVERING CLEANER,",
  overviewTitleLine2: "HEALTHIER SPACES WITH",
  overviewTitleHighlight: "PROFESSIONAL",
  overviewTitleLine3: "CARE",
  overviewFeatureImage:
    "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630",
  overviewDesc:
    "<p>গুলশান, বনানী, উত্তরা, ধানমন্ডি ও বসুন্ধরার অভিজাত আবাসন ও কর্পোরেট হেডকোয়ার্টারে ১,২০০+ প্রজেক্ট সফলভাবে সম্পন্ন করার অভিজ্ঞতা নিয়ে Cleanix আপনার যেকোনো স্থানের জন্য নির্ভরযোগ্য স্যানিটাইজেশন নিশ্চিত করে।</p><p>আবাসিক বাড়ি থেকে শুরু করে কমার্শিয়াল শোরুম ও পোস্ট-কনস্ট্রাকশন সাইট—প্রতিটি প্রজেক্টে এনআইডি ট্র্যাকিংকৃত ক্লিনার, আধুনিক ইকো-ফ্রেন্ডলি কেমিক্যালস এবং অনলাইন বিটুবি সাবস্ক্রিপশন সুবিধা প্রদান করা হয়।</p>",
  overviewChecks: [
    "Residential Deep Cleaning",
    "End-to-End Sanitation",
    "Eco-Friendly Safe Chemicals",
    "Real-Time SMS & GPS Tracking",
  ],
};

const getServicesCMSFromDB = async (): Promise<IServicesCMSContent> => {
  const record = await CMS.findOne({ page: 'services' });
  if (!record || !record.content) {
    return defaultServicesCMSContent;
  }
  return { ...defaultServicesCMSContent, ...(record.content as IServicesCMSContent) };
};

const updateServicesCMSInDB = async (
  payload: Partial<IServicesCMSContent>,
): Promise<{ fullContent: IServicesCMSContent; updatedFields: Partial<IServicesCMSContent> }> => {
  const current = await getServicesCMSFromDB();
  const updatedContent = { ...current, ...payload };

  const result = await CMS.findOneAndUpdate(
    { page: 'services' },
    { page: 'services', content: updatedContent },
    { new: true, upsert: true },
  );

  return {
    fullContent: result.content as IServicesCMSContent,
    updatedFields: payload,
  };
};

const getProjectsCMSFromDB = async (): Promise<IProjectsCMSContent> => {
  const record = await CMS.findOne({ page: 'projects' });
  if (!record || !record.content) {
    return defaultProjectsCMSContent;
  }
  return { ...defaultProjectsCMSContent, ...(record.content as IProjectsCMSContent) };
};

const updateProjectsCMSInDB = async (
  payload: Partial<IProjectsCMSContent>,
): Promise<{ fullContent: IProjectsCMSContent; updatedFields: Partial<IProjectsCMSContent> }> => {
  const current = await getProjectsCMSFromDB();
  const updatedContent = { ...current, ...payload };

  const result = await CMS.findOneAndUpdate(
    { page: 'projects' },
    { page: 'projects', content: updatedContent },
    { new: true, upsert: true },
  );

  return {
    fullContent: result.content as IProjectsCMSContent,
    updatedFields: payload,
  };
};

export const defaultPricingCMSContent: IPricingCMSContent = {
  heroBadge: "TRANSPARENT SAAS PRICING & ESTIMATE",
  heroTitleLine1: "AFFORDABLE & FLEXIBLE",
  heroTitleHighlight: "PRICING",
  heroTitleLine2: "PLANS",
  heroSubtitle:
    "আবাসিক বাসা, কমার্শিয়াল অফিস ও স্থানান্তরিত স্পেসের জন্য স্বচ্ছ সাবস্ক্রিপশন প্যাকেজ অথবা ডাইনামিক লাইভ ক্যালকুলেটর থেকে তাৎক্ষণিক বাজেট বের করুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  sectionBadge: "PRICING",
  sectionTitle: "FLEXIBLE PRICING PLANS CLEANING SERVICES",
  sectionAssetImage: "/cleaning-bucket.png",
};

const getPricingCMSFromDB = async (): Promise<IPricingCMSContent> => {
  const record = await CMS.findOne({ page: 'pricing' });
  if (!record || !record.content) {
    return defaultPricingCMSContent;
  }
  return { ...defaultPricingCMSContent, ...(record.content as IPricingCMSContent) };
};

const updatePricingCMSInDB = async (
  payload: Partial<IPricingCMSContent>,
): Promise<{ fullContent: IPricingCMSContent; updatedFields: Partial<IPricingCMSContent> }> => {
  const current = await getPricingCMSFromDB();
  const updatedContent = { ...current, ...payload };

  const result = await CMS.findOneAndUpdate(
    { page: 'pricing' },
    { page: 'pricing', content: updatedContent },
    { new: true, upsert: true },
  );

  return {
    fullContent: result.content as IPricingCMSContent,
    updatedFields: payload,
  };
};

export const defaultCoverageCMSContent: ICoverageCMSContent = {
  heroBadge: "24/7 ACTIVE GPS FLEET COVERAGE",
  heroTitleLine1: "DHAKA CITY",
  heroTitleHighlight: "COVERAGE AREA",
  heroTitleLine2: "MAP",
  heroSubtitle:
    "ঢাকার ১০টি প্রধান এলাকায় আমাদের এনআইডি-ভেরিফাইড ক্লিনার বহর জরুরি ২৫-৩০ মিনিটের মধ্যে পৌঁছে যায়। আপনার এলাকা নির্বাচন করে সার্ভিস স্পট বুক করুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  sectionBadge: "COVERAGE AREA MAP",
  sectionTitleLine1: "PROUDLY SERVING ALL MAJOR",
  sectionTitleHighlight: "NEIGHBORHOODS",
  sectionTitleLine2: "IN DHAKA",
  sectionSubtitle:
    "আমাদের জিপিএস ট্র্যাকিংকৃত ক্লিনার বহর ঢাকার প্রতিটি প্রধান এলাকায় জরুরি ২৫-৩০ মিনিটের মধ্যে পৌঁছে যায়।",
};

const getCoverageCMSFromDB = async (): Promise<ICoverageCMSContent> => {
  const record = await CMS.findOne({ page: 'coverage' });
  if (!record || !record.content) {
    return defaultCoverageCMSContent;
  }
  return { ...defaultCoverageCMSContent, ...(record.content as ICoverageCMSContent) };
};

const updateCoverageCMSInDB = async (
  payload: Partial<ICoverageCMSContent>,
): Promise<{ fullContent: ICoverageCMSContent; updatedFields: Partial<ICoverageCMSContent> }> => {
  const current = await getCoverageCMSFromDB();
  const updatedContent = { ...current, ...payload };

  const result = await CMS.findOneAndUpdate(
    { page: 'coverage' },
    { page: 'coverage', content: updatedContent },
    { new: true, upsert: true },
  );

  return {
    fullContent: result.content as ICoverageCMSContent,
    updatedFields: payload,
  };
};

export const defaultContactCMSContent: IContactCMSContent = {
  heroBadge: "24/7 CUSTOMER SUPPORT & QUOTE REQUEST",
  heroTitleLine1: "GET IN TOUCH WITH",
  heroTitleHighlight: "OUR TEAM",
  heroSubtitle:
    "আপনার বাসা বা কর্পোরেট স্পেস পরিষ্কারের জন্য যেকোনো প্রশ্ন, ফ্রি কোটেশন বা ইনস্ট্যান্ট শিডিউল বুকিংয়ের জন্য আমাদের এক্সপার্ট টিমের সাথে যোগাযোগ করুন।",
  heroImage:
    "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80",

  formBadge: "CONTACT REQUEST",
  formTitleLine1: "READY TO SHIP",
  formTitleLine2: "SMARTER",
  formTitleHighlight: "CONTACT",
  formTitleLine3: "OUR TEAM",
  formCleanerImage:
    "https://framerusercontent.com/images/sooGLoQVstKUc2PnwKtqQNMI.png?width=588&height=630",

  locationTitle: "Location",
  locationText: "House 42, Road 11, Block D, Gulshan 2\nDhaka-1212, Bangladesh",
  supportTitle: "Support Clients",
  supportText: "+880 1774-500815\n+880 1894-654254",
  hoursTitle: "Opening Hours",
  hoursText: "Saturday - Thursday\n09 : 00 AM - 10 : 30 PM",
};

const getContactCMSFromDB = async (): Promise<IContactCMSContent> => {
  const record = await CMS.findOne({ page: 'contact' });
  if (!record || !record.content) {
    return defaultContactCMSContent;
  }
  return { ...defaultContactCMSContent, ...(record.content as IContactCMSContent) };
};

const updateContactCMSInDB = async (
  payload: Partial<IContactCMSContent>,
): Promise<{ fullContent: IContactCMSContent; updatedFields: Partial<IContactCMSContent> }> => {
  const current = await getContactCMSFromDB();
  const updatedContent = { ...current, ...payload };

  const result = await CMS.findOneAndUpdate(
    { page: 'contact' },
    { page: 'contact', content: updatedContent },
    { new: true, upsert: true },
  );

  return {
    fullContent: result.content as IContactCMSContent,
    updatedFields: payload,
  };
};

export const CMSService = {
  getHomeCMSFromDB,
  updateHomeCMSInDB,
  getAboutCMSFromDB,
  updateAboutCMSInDB,
  getServicesCMSFromDB,
  updateServicesCMSInDB,
  getProjectsCMSFromDB,
  updateProjectsCMSInDB,
  getPricingCMSFromDB,
  updatePricingCMSInDB,
  getCoverageCMSFromDB,
  updateCoverageCMSInDB,
  getContactCMSFromDB,
  updateContactCMSInDB,
};
