export interface IProject {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  heroImage: string;
  benefitImage: string;
  client: string;
  categoryFull: string;
  startDate: string;
  endDate: string;
  projectValue: string;
  introParagraph: string;
  section2Title: string;
  section2Paragraph: string;
  benefitsTitle: string;
  benefitsPoints: string[];
  section4Title: string;
  section4Paragraph: string;
  status: 'PUBLISHED' | 'DRAFT';
  createdAt?: Date;
  updatedAt?: Date;
}
