import { Types } from 'mongoose';
import { Booking } from './booking.model';
import AppError from '../../errors/AppError';
import { Addon } from '../addon/addon.model';
import { ServiceCategory } from '../servicecategory/servicecategory.model';

export const calculateBookingPrice = async (payload: {
  serviceSlug?: string;
  sqft?: number;
  bedrooms?: number;
  bathrooms?: number;
  selectedAddons?: string[];
  customFieldValues?: Record<string, any>;
}) => {
  const sqft = Number(payload.sqft) || 0;
  const bedrooms = Number(payload.bedrooms) || 0;
  const bathrooms = Number(payload.bathrooms) || 0;
  const addonSlugs: string[] = Array.isArray(payload.selectedAddons) ? payload.selectedAddons : [];
  const userCustomValues = payload.customFieldValues || {};

  // Base Fee & Active Fields: from selected service category
  let baseFee = 1500;
  let categoryName = 'Base Service Fee';
  let categoryFields: any[] = [];

  if (payload.serviceSlug) {
    const serviceDoc = await ServiceCategory.findOne({
      $or: [
        { _id: payload.serviceSlug.match(/^[0-9a-fA-F]{24}$/) ? payload.serviceSlug : null },
        { slug: payload.serviceSlug },
        { category: payload.serviceSlug },
      ],
      status: 'ACTIVE',
    });
    if (serviceDoc) {
      categoryName = serviceDoc.title.split('(')[0].trim();
      const rawPrice = String(serviceDoc.price || '').replace(/[^0-9.]/g, '');
      const parsed = parseFloat(rawPrice);
      if (!isNaN(parsed) && parsed > 0) baseFee = parsed;

      if (Array.isArray(serviceDoc.fields)) {
        categoryFields = serviceDoc.fields;
      }
    }
  }

  // Calculate Field Costs dynamically for all enabled fields in categoryFields
  let customFieldsTotal = 0;
  const customFieldsBreakdown: {
    fieldId: string;
    label: string;
    detailLabel: string;
    value: any;
    cost: number;
  }[] = [];

  for (const field of categoryFields) {
    if (field.enabled === false) continue;
    let val = userCustomValues[field.id];
    if (val === undefined || val === null || val === '') {
      if (field.id === 'sqft' && sqft > 0) val = sqft;
      else if (field.id === 'bedrooms' && bedrooms > 0) val = bedrooms;
      else if (field.id === 'bathrooms' && bathrooms > 0) val = bathrooms;
    }
    if (val === undefined || val === null || val === '') continue;

    let fieldCost = 0;
    let detailLabel = field.label.split('(')[0].trim();

    if (field.fieldType === 'COUNTER' || field.fieldType === 'NUMBER') {
      const numVal = Number(val) || 0;
      fieldCost = numVal * (field.unitPrice || 0);
      const unitStr = field.unit ? ` ${field.unit}` : '';
      detailLabel = `${field.label.split('(')[0].trim()} (${numVal.toLocaleString()}${unitStr} × ৳${field.unitPrice || 0})`;
    } else if (field.fieldType === 'SELECT' || field.fieldType === 'RADIO') {
      const opt = field.options?.find((o: any) => o.value === String(val));
      if (opt) {
        fieldCost = opt.price || 0;
        detailLabel = `${field.label.split('(')[0].trim()} (${opt.label})`;
      }
    }

    customFieldsTotal += fieldCost;
    customFieldsBreakdown.push({
      fieldId: field.id,
      label: field.label,
      detailLabel,
      value: val,
      cost: fieldCost,
    });
  }

  // Addons
  const addonDocs = addonSlugs.length
    ? await Addon.find({ slug: { $in: addonSlugs }, active: true, isDeleted: false })
    : [];

  const addonsBreakdown = addonDocs.map((a) => ({
    slug: a.slug,
    name: a.name,
    price: a.price,
  }));

  const addonsTotal = addonsBreakdown.reduce((sum, a) => sum + (a.price || 0), 0);
  const totalAmount = baseFee + customFieldsTotal + addonsTotal;

  return {
    categoryName,
    categoryFields,
    customFieldsBreakdown,
    customFieldsTotal,
    baseFee,
    sqft,
    sqftCost: customFieldsBreakdown.find((f) => f.fieldId === 'sqft')?.cost || 0,
    bedrooms,
    bedroomCost: customFieldsBreakdown.find((f) => f.fieldId === 'bedrooms')?.cost || 0,
    bathrooms,
    bathroomCost: customFieldsBreakdown.find((f) => f.fieldId === 'bathrooms')?.cost || 0,
    addons: addonsBreakdown,
    addonsTotal,
    totalAmount,
  };
};

const createBooking = async (userId: string, payload: any) => {
  const sqft = payload.sqft && payload.sqft > 0 ? payload.sqft : 0;
  const bedrooms = payload.bedrooms && payload.bedrooms > 0 ? payload.bedrooms : 0;
  const bathrooms = payload.bathrooms && payload.bathrooms > 0 ? payload.bathrooms : 0;
  const selectedAddons = payload.selectedAddons || [];
  const customFieldValues = payload.customFieldValues || {};

  // Validate serviceType is a valid ObjectId
  if (!payload.serviceType || !Types.ObjectId.isValid(payload.serviceType)) {
    throw new AppError(400, 'Invalid serviceType: must be a valid ServiceCategory ID');
  }

  // Fetch service category by _id
  const serviceCategoryDoc = await ServiceCategory.findOne({
    _id: payload.serviceType,
    isDeleted: false,
  });

  if (!serviceCategoryDoc) {
    throw new AppError(404, 'Selected Service Category not found');
  }

  // Calculate pricing server-side
  const calculatedPricing = await calculateBookingPrice({
    serviceSlug: String(serviceCategoryDoc._id),
    sqft,
    bedrooms,
    bathrooms,
    selectedAddons,
    customFieldValues,
  });

  const baseFee = calculatedPricing.baseFee;
  const sqftCost = calculatedPricing.sqftCost;
  const bedroomCost = calculatedPricing.bedroomCost;
  const bathroomCost = calculatedPricing.bathroomCost;
  const addonsTotal = calculatedPricing.addonsTotal;
  const totalAmount = calculatedPricing.totalAmount;

  // Auto-generate Booking Reference
  const randomRefNum = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `#CLN-2026-${randomRefNum}`;

  const paymentStatus = payload.paymentMethod === 'COD' ? 'PENDING' : 'PAID';

  const newBooking = await Booking.create({
    bookingRef,
    user: userId,
    serviceType: new Types.ObjectId(payload.serviceType),
    sqft,
    bedrooms,
    bathrooms,
    selectedAddons,
    customFieldValues,
    scheduledDate: payload.scheduledDate || '2026-08-25',
    timeSlot: payload.timeSlot || '09:00 AM - 11:00 AM',
    address: payload.address || 'Dhaka',
    locationId: payload.locationId,
    paymentMethod: payload.paymentMethod || 'BKASH',
    paymentStatus,
    status: 'CONFIRMED',
    baseFee,
    sqftCost,
    bedroomCost,
    bathroomCost,
    addonsTotal,
    totalAmount,
    notes: payload.notes,
  });

  // Return populated
  return await Booking.findById(newBooking._id)
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('locationId');
};

const getMyBookings = async (userId: string) => {
  const bookings = await Booking.find({ user: userId, isDeleted: false })
    .populate('serviceType', 'title slug category badge price heroImage')
    .populate('locationId')
    .sort({ createdAt: -1 });

  return bookings;
};

const getSingleBooking = async (userId: string, bookingId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, isDeleted: false })
    .populate('serviceType', 'title slug category badge price heroImage')
    .populate('locationId');

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  return booking;
};

const cancelBooking = async (userId: string, bookingId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, isDeleted: false });

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  if (booking.status === 'COMPLETED') {
    throw new AppError(400, 'Completed booking cannot be cancelled!');
  }

  booking.status = 'CANCELLED';
  await booking.save();

  return booking;
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
};
