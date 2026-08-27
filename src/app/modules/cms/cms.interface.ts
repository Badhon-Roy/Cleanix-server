export interface IFaqItem {
  id: number | string;
  question: string;
  answer: string;
}

export interface IHomeCMSContent {
  // Hero Banner Section
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroDescription: string;
  heroImage: string;
  heroBtn1Text: string;
  heroBtn1Href: string;
  heroBtn2Text: string;
  heroBtn2Href: string;

  // Impact & Numbers Section
  impactBadge: string;
  impactTitleLine1: string;
  impactTitleHighlight: string;
  impactSubtitle: string;
  impactLeftImage: string;
  impactRightImage: string;

  impactStat1Value: string;
  impactStat1Label: string;
  impactStat2Value: string;
  impactStat2Label: string;
  impactStat3Value: string;
  impactStat3Label: string;

  // Why Choose Us Section
  whyUsBadge: string;
  whyUsTitleLine1: string;
  whyUsTitleHighlight: string;
  whyUsTitleLine2: string;
  whyUsCleanerImage: string;

  // Why Choose Us - 4 Dynamic Feature Cards
  whyUsCard1Title: string;
  whyUsCard1Checks: string[];

  whyUsCard2Title: string;
  whyUsCard2Checks: string[];

  whyUsCard3Title: string;
  whyUsCard3Checks: string[];

  whyUsCard4Title: string;
  whyUsCard4Checks: string[];

  // Core Services Section Header
  servicesBadge: string;
  servicesTitleLine1: string;
  servicesTitleHighlight: string;
  servicesTitleLine2: string;
  servicesSubtitle: string;

  // CTA Banner Section
  ctaBadge: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaBtnText: string;
  ctaBtnHref: string;

  // FAQ Section Header, Right Image & Dynamic Items
  faqBadge: string;
  faqTitle: string;
  faqImage: string;
  faqItems: IFaqItem[];
}

export interface ICMS {
  _id?: string;
  page: string; // e.g. 'home', 'about', etc.
  content: IHomeCMSContent | Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
