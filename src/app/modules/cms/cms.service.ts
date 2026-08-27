import { CMS } from './cms.model';
import { IHomeCMSContent } from './cms.interface';

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

export const CMSService = {
  getHomeCMSFromDB,
  updateHomeCMSInDB,
};
