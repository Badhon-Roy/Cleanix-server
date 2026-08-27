export interface IGalleryItem {
  _id?: string;
  title: string;
  type: 'IMAGE' | 'VIDEO';
  url: string;
  thumbnail?: string;
  status: 'ACTIVE' | 'INACTIVE';
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
