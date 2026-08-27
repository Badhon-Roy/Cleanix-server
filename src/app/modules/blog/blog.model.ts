import { Schema, model } from 'mongoose';
import { IBlog } from './blog.interface';

const blogSectionSchema = new Schema({
  title: { type: String, required: true },
  paragraphs: [{ type: String, required: true }],
}, { _id: false });

const blogAuthorSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String, default: '' },
}, { _id: false });

const blogSchema = new Schema<IBlog>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    author: { type: blogAuthorSchema, required: true },
    image: { type: String, required: true },
    shortDesc: { type: String, required: true },
    introParagraph: { type: String, required: true },
    sections: [blogSectionSchema],
  },
  {
    timestamps: true,
  },
);

export const Blog = model<IBlog>('Blog', blogSchema);
