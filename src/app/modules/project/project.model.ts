import { Schema, model } from 'mongoose';
import { IProject } from './project.interface';

const projectSchema = new Schema<IProject>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    heroImage: { type: String, required: true },
    benefitImage: { type: String, default: '' },
    client: { type: String, required: true },
    categoryFull: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    projectValue: { type: String, required: true },
    introParagraph: { type: String, required: true },
    section2Title: { type: String, default: '' },
    section2Paragraph: { type: String, default: '' },
    benefitsTitle: { type: String, default: '' },
    benefitsPoints: [{ type: String }],
    section4Title: { type: String, default: '' },
    section4Paragraph: { type: String, default: '' },
    status: { type: String, enum: ['PUBLISHED', 'DRAFT'], default: 'PUBLISHED' },
  },
  {
    timestamps: true,
  },
);

export const Project = model<IProject>('Project', projectSchema);
