export interface IBlogSection {
  title: string;
  paragraphs: string[];
}

export interface IBlogAuthor {
  name: string;
  avatar: string;
}

export interface IBlog {
  _id?: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: IBlogAuthor;
  image: string;
  shortDesc: string;
  introParagraph: string;
  sections: IBlogSection[];
  createdAt?: Date;
  updatedAt?: Date;
}
