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

export interface ITeamMemberItem {
  id: string;
  name: string;
  role: string;
  image: string;
  nidVerified: boolean;
  bio: string;
}

export interface IJourneyStepItem {
  id: string;
  number: string;
  year: string;
  side: "left" | "right";
  title: string;
  desc: string;
}

export interface IAboutCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroImage: string;

  overviewBadge: string;
  overviewTitle1: string;
  overviewTitleHighlight: string;
  overviewDesc: string;
  overviewLeftImage: string;
  overviewRightImage: string;

  stat1Count: string;
  stat1Label: string;
  stat2Count: string;
  stat2Label: string;
  stat3Count: string;
  stat3Label: string;

  whoWeAreBadge: string;
  whoWeAreTitle: string;
  whoWeAreHighlight: string;
  whoWeAreFeatureImage: string;
  whoWeAreExpYears: string;
  whoWeAreExpLabel: string;
  whoWeAreClientsCount: string;
  whoWeAreRatingScore: string;
  whoWeAreSubheading: string;
  whoWeArePara1: string;
  whoWeArePara2: string;
  whoWeAreCheck1: string;
  whoWeAreCheck2: string;
  whoWeAreCheck3: string;
  whoWeAreCheck4: string;

  teamMembers: ITeamMemberItem[];

  ctaBannerImage: string;
  ctaBadgeText: string;
  ctaTitle: string;
  ctaCheck1: string;
  ctaCheck2: string;
  ctaCheck3: string;
  ctaChecks: string[];
  ctaButtonText: string;
  ctaButtonLink: string;

  journeyBadge: string;
  journeyTitle: string;
  journeyHighlight: string;
  journeySteps: IJourneyStepItem[];
}

export interface IHowItWorksStepItem {
  id: string;
  step: string;
  title: string;
  description: string;
  image: string;
}

export interface IServicesCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight1: string;
  heroTitleMiddle: string;
  heroTitleHighlight2: string;
  heroSubtitle: string;
  heroImage: string;

  overviewBadge: string;
  overviewTitle1: string;
  overviewTitleHighlight: string;
  overviewTitle2: string;
  overviewDesc: string;
  overviewFeatureImage: string;

  card1Title: string;
  card1Checks: string[];

  card2Title: string;
  card2Checks: string[];

  coreBadge: string;
  coreTitleLine1: string;
  coreTitleHighlight: string;
  coreTitleLine2: string;

  howItWorksBadge: string;
  howItWorksTitle: string;
  howItWorksHighlight: string;
  howItWorksRightDesc: string;
  howItWorksSteps: IHowItWorksStepItem[];
}

export interface IProjectsCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroImage: string;

  overviewBadge: string;
  overviewTitleLine1: string;
  overviewTitleLine2: string;
  overviewTitleHighlight: string;
  overviewTitleLine3: string;
  overviewFeatureImage: string;
  overviewDesc: string;
  overviewChecks: string[];
}

export interface IPricingCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroImage: string;

  sectionBadge: string;
  sectionTitle: string;
  sectionAssetImage: string;
}

export interface ICoverageCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroImage: string;

  sectionBadge: string;
  sectionTitleLine1: string;
  sectionTitleHighlight: string;
  sectionTitleLine2: string;
  sectionSubtitle: string;
}

export interface IContactCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  heroImage: string;

  formBadge: string;
  formTitleLine1: string;
  formTitleLine2: string;
  formTitleHighlight: string;
  formTitleLine3: string;
  formCleanerImage: string;

  locationTitle: string;
  locationText: string;
  supportTitle: string;
  supportText: string;
  hoursTitle: string;
  hoursText: string;
}

export interface IBlogCMSContent {
  heroBadge: string;
  heroTitleLine1: string;
  heroTitleHighlight: string;
  heroTitleLine2: string;
  heroSubtitle: string;
  heroImage: string;
}

export interface ICMS {
  _id?: string;
  page: string; // e.g. 'home', 'about', 'services', 'projects', 'pricing', 'coverage', 'contact', 'blog', etc.
  content:
    | IHomeCMSContent
    | IAboutCMSContent
    | IServicesCMSContent
    | IProjectsCMSContent
    | IPricingCMSContent
    | ICoverageCMSContent
    | IContactCMSContent
    | IBlogCMSContent
    | Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
