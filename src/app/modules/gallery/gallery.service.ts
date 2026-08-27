import { Gallery } from './gallery.model';
import { IGalleryItem } from './gallery.interface';
import AppError from '../../errors/AppError';
import { emitGalleryUpdated } from '../../socket/socket';

// In-Memory Fast Cache for Active Gallery Items
let cachedActiveItems: { items: IGalleryItem[]; hasMore: boolean; total: number } | null = null;

let cachedAdminItems: IGalleryItem[] | null = null;

const invalidateCache = () => {
  cachedActiveItems = null;
  cachedAdminItems = null;
};

const getActiveGallery = async (
  page = 1,
  limit = 100
): Promise<{ items: IGalleryItem[]; hasMore: boolean; total: number }> => {

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));

  // Serve directly from fast RAM cache if requesting page 1 with high limit
  if (cachedActiveItems && pageNum === 1 && limitNum >= cachedActiveItems.items.length) {
    return cachedActiveItems;
  }

  const skip = (pageNum - 1) * limitNum;

  const [total, items] = await Promise.all([
    Gallery.countDocuments({ status: 'ACTIVE', isDeleted: false }),
    Gallery.find({ status: 'ACTIVE', isDeleted: false })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
  ]);

  const result = {
    items: items as IGalleryItem[],
    hasMore: skip + items.length < total,
    total,
  };

  if (pageNum === 1 && limitNum >= total) {
    cachedActiveItems = result;
  }

  return result;
};

const getAllGalleryAdmin = async (): Promise<IGalleryItem[]> => {
  if (cachedAdminItems) {
    return cachedAdminItems;
  }
  const items = await Gallery.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();
  cachedAdminItems = items as IGalleryItem[];
  return cachedAdminItems;
};

const createGalleryItem = async (payload: Partial<IGalleryItem>): Promise<IGalleryItem> => {
  if (!payload.title || !payload.url) {
    throw new AppError(400, 'Title and media URL are required!');
  }

  const newItem = await Gallery.create({
    title: payload.title,
    type: payload.type || 'IMAGE',
    url: payload.url,
    thumbnail: payload.thumbnail || '',
    status: payload.status || 'ACTIVE',
    isDeleted: false,
  });

  invalidateCache();
  emitGalleryUpdated({ action: 'create', item: newItem });
  return newItem;
};

const createBulkGalleryItems = async (payloads: Partial<IGalleryItem>[]): Promise<IGalleryItem[]> => {
  if (!Array.isArray(payloads) || payloads.length === 0) {
    throw new AppError(400, 'No gallery items provided for bulk creation!');
  }

  const docs = payloads.map((p, idx) => ({
    title: p.title || `Showcase Photo #${idx + 1}`,
    type: p.type || 'IMAGE',
    url: p.url || '',
    thumbnail: p.thumbnail || '',
    status: p.status || 'ACTIVE',
    isDeleted: false,
  }));

  const inserted = await Gallery.insertMany(docs);
  invalidateCache();
  emitGalleryUpdated({ action: 'bulk_create', count: inserted.length });
  return inserted as unknown as IGalleryItem[];
};

const updateGalleryItem = async (
  id: string,
  payload: Partial<IGalleryItem>
): Promise<IGalleryItem> => {
  const item = await Gallery.findOne({ _id: id, isDeleted: false });
  if (!item) {
    throw new AppError(404, 'Gallery item not found!');
  }

  const updatedItem = await Gallery.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true, runValidators: true }
  );

  if (!updatedItem) {
    throw new AppError(404, 'Failed to update gallery item');
  }

  invalidateCache();
  emitGalleryUpdated({ action: 'update', item: updatedItem });
  return updatedItem;
};

const deleteGalleryItem = async (id: string): Promise<IGalleryItem | null> => {
  const item = await Gallery.findOne({ _id: id, isDeleted: false });
  if (!item) {
    throw new AppError(404, 'Gallery item not found!');
  }

  await Gallery.findOneAndUpdate({ _id: id }, { isDeleted: true });
  invalidateCache();
  emitGalleryUpdated({ action: 'delete', id });
  return null;
};

const deleteBulkGalleryItems = async (ids: string[]): Promise<number> => {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new AppError(400, 'No gallery item IDs provided for bulk deletion!');
  }

  const result = await Gallery.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } }
  );

  invalidateCache();
  emitGalleryUpdated({ action: 'delete_bulk', count: result.modifiedCount });
  return result.modifiedCount;
};

export const GalleryService = {
  getActiveGallery,
  getAllGalleryAdmin,
  createGalleryItem,
  createBulkGalleryItems,
  updateGalleryItem,
  deleteGalleryItem,
  deleteBulkGalleryItems,
};
