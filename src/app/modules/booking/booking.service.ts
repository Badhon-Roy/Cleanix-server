import { Types } from 'mongoose';
import { Booking } from './booking.model';
import AppError from '../../errors/AppError';
import { Addon } from '../addon/addon.model';
import { ServiceCategory } from '../servicecategory/servicecategory.model';
import { CoverageArea } from '../coverage/coverage.model';
import { Team } from '../team/team.model';
import { Cleaner } from '../cleaner/cleaner.model';
import { emitBookingCreated, emitBookingUpdated } from '../../socket/socket';
import { TeamAssignmentService } from '../teamAssignment/teamAssignment.service';

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

  // Validate coverageArea is a valid ObjectId and exists
  if (!payload.coverageArea || !Types.ObjectId.isValid(payload.coverageArea)) {
    throw new AppError(400, 'Coverage Area / Service Zone selection is required!');
  }

  const coverageAreaDoc = await CoverageArea.findOne({
    _id: payload.coverageArea,
    isActive: true,
    isDeleted: false,
  });

  if (!coverageAreaDoc) {
    throw new AppError(404, 'Selected Coverage Area is invalid or inactive!');
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

  const addonsTotal = calculatedPricing.addonsTotal;
  const totalAmount = calculatedPricing.totalAmount;

  // Construct dynamic services array (base fee + fields breakdown + addons)
  const servicesList: { name: string; value: number; addOn: boolean }[] = [
    {
      name: `বেসিক সার্ভিস ফি (${serviceCategoryDoc.title.split('(')[0].trim()})`,
      value: calculatedPricing.baseFee,
      addOn: false,
    },
    ...calculatedPricing.customFieldsBreakdown.map((f) => ({
      name: f.detailLabel,
      value: f.cost,
      addOn: false,
    })),
    ...calculatedPricing.addons.map((a) => ({
      name: `+ ${a.name}`,
      value: a.price,
      addOn: true,
    })),
  ];

  // Auto-generate Booking Reference
  const randomRefNum = Math.floor(1000 + Math.random() * 9000);
  const bookingRef = `#CLN-2026-${randomRefNum}`;

  const paymentStatus = payload.paymentMethod === 'COD' ? 'PENDING' : 'PAID';

  const newBooking = await Booking.create({
    bookingRef,
    user: userId,
    serviceType: new Types.ObjectId(payload.serviceType),
    coverageArea: new Types.ObjectId(payload.coverageArea),
    selectedAddons,
    customFieldValues,
    scheduledDate: payload.scheduledDate || '2026-08-25',
    timeSlot: payload.timeSlot || '09:00 AM - 11:00 AM',
    address: payload.address || 'Dhaka',
    locationId: payload.locationId,
    paymentMethod: payload.paymentMethod || 'BKASH',
    paymentStatus,
    status: 'CONFIRMED',
    services: servicesList,
    addonsTotal,
    totalAmount,
    notes: payload.notes,
  });

  // Return populated
  const populatedDoc = await Booking.findById(newBooking._id)
    .populate('user', 'name email phone avatar')
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('coverageArea', 'zoneName district areasIncluded zipCodes')
    .populate('locationId');

  emitBookingCreated(populatedDoc);

  return populatedDoc;
};

const getMyBookings = async (userId: string) => {
  const bookings = await Booking.find({ user: userId, isDeleted: false })
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('coverageArea', 'zoneName district areasIncluded zipCodes')
    .populate('locationId')
    .sort({ createdAt: -1 });

  return bookings;
};

const getSingleBooking = async (userId: string, bookingId: string) => {
  const booking = await Booking.findOne({ _id: bookingId, user: userId, isDeleted: false })
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('coverageArea', 'zoneName district areasIncluded zipCodes')
    .populate('locationId');

  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  return booking;
};

const getAllBookingsAdmin = async () => {
  const bookings = await Booking.find({ isDeleted: false })
    .populate('user', 'name email phone avatar')
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('coverageArea', 'zoneName district areasIncluded zipCodes')
    .populate({
      path: 'assignedTeam',
      populate: [
        { path: 'leader', select: 'name email phone rating' },
        { path: 'members', select: 'name email phone role' },
        { path: 'zone', select: 'zoneName district' },
      ],
    })
    .populate({
      path: 'teamRequests.team',
      select: 'teamName teamCode leader status zone',
      populate: { path: 'leader', select: 'name email phone rating' },
    })
    .populate({
      path: 'teamRequests.requestedBy',
      select: 'name email phone',
    })
    .populate('locationId')
    .sort({ createdAt: -1 });

  return bookings;
};

const updateBookingStatusAdmin = async (
  bookingId: string,
  payload: { status?: string; cleanerTeam?: string; teamId?: string },
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  if (payload.status) {
    booking.status = payload.status as any;
  }

  if (payload.teamId && Types.ObjectId.isValid(payload.teamId)) {
    const targetTeam = await Team.findById(payload.teamId);
    if (targetTeam) {
      if (targetTeam.leaderRequestStatus !== 'ACCEPTED' || targetTeam.status !== 'ACTIVE') {
        targetTeam.leaderRequestStatus = 'ACCEPTED';
        targetTeam.status = 'ACTIVE';
        await targetTeam.save();
      }
      booking.assignedTeam = targetTeam._id as any;
      booking.cleanerTeam = `${targetTeam.teamName} (${targetTeam.teamCode})`;
      booking.status = 'ASSIGNED';

      if (booking.teamRequests && booking.teamRequests.length > 0) {
        booking.teamRequests.forEach((req) => {
          const reqTeamId = (req.team as any)?._id || req.team;
          if (String(reqTeamId) === String(targetTeam._id)) {
            req.status = 'APPROVED';
          } else {
            req.status = 'REJECTED';
          }
        });
      }

      await TeamAssignmentService.syncTeamAssignment(
        booking._id.toString(),
        targetTeam._id.toString(),
      );
    }
  } else if (payload.cleanerTeam !== undefined) {
    booking.cleanerTeam = payload.cleanerTeam;
    // Check if cleanerTeam string matches a teamId or teamCode
    const foundTeam = await Team.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(payload.cleanerTeam) ? payload.cleanerTeam : null },
        { teamCode: payload.cleanerTeam },
      ],
    });
    if (foundTeam) {
      if (foundTeam.leaderRequestStatus !== 'ACCEPTED' || foundTeam.status !== 'ACTIVE') {
        foundTeam.leaderRequestStatus = 'ACCEPTED';
        foundTeam.status = 'ACTIVE';
        await foundTeam.save();
      }
      booking.assignedTeam = foundTeam._id as any;
      booking.cleanerTeam = `${foundTeam.teamName} (${foundTeam.teamCode})`;
      booking.status = 'ASSIGNED';

      if (booking.teamRequests && booking.teamRequests.length > 0) {
        booking.teamRequests.forEach((req) => {
          const reqTeamId = (req.team as any)?._id || req.team;
          if (String(reqTeamId) === String(foundTeam._id)) {
            req.status = 'APPROVED';
          } else {
            req.status = 'REJECTED';
          }
        });
      }

      await TeamAssignmentService.syncTeamAssignment(
        booking._id.toString(),
        foundTeam._id.toString(),
      );
    }
  }

  await booking.save();

  const updatedDoc = await Booking.findById(booking._id)
    .populate('user', 'name email phone avatar')
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate({
      path: 'assignedTeam',
      populate: [
        { path: 'leader', select: 'name email phone rating' },
        { path: 'members', select: 'name email phone role' },
        { path: 'zone', select: 'zoneName district' },
      ],
    })
    .populate('locationId');

  emitBookingUpdated(updatedDoc);

  return updatedDoc;
};

const assignTeamToBookingAdmin = async (
  bookingId: string,
  payload: { teamId?: string; cleanerTeam?: string; notes?: string },
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new AppError(404, 'Booking not found!');
  }

  let targetTeam = null;
  const lookupTerm = payload.teamId || payload.cleanerTeam;

  if (lookupTerm) {
    targetTeam = await Team.findOne({
      $or: [
        { _id: Types.ObjectId.isValid(lookupTerm) ? lookupTerm : null },
        { teamCode: lookupTerm },
        { teamName: lookupTerm },
      ],
    });
  }

  if (targetTeam) {
    if (targetTeam.leaderRequestStatus !== 'ACCEPTED' || targetTeam.status !== 'ACTIVE') {
      targetTeam.leaderRequestStatus = 'ACCEPTED';
      targetTeam.status = 'ACTIVE';
      await targetTeam.save();
    }
    booking.assignedTeam = targetTeam._id as any;
    booking.cleanerTeam = `${targetTeam.teamName} (${targetTeam.teamCode})`;
    booking.status = 'ASSIGNED';

    if (booking.teamRequests && booking.teamRequests.length > 0) {
      booking.teamRequests.forEach((req) => {
        const reqTeamId = (req.team as any)?._id || req.team;
        if (String(reqTeamId) === String(targetTeam._id)) {
          req.status = 'APPROVED';
        } else {
          req.status = 'REJECTED';
        }
      });
    }

    await TeamAssignmentService.syncTeamAssignment(
      booking._id.toString(),
      targetTeam._id.toString(),
      undefined,
      payload.notes || booking.notes,
    );
  } else if (payload.cleanerTeam) {
    booking.cleanerTeam = payload.cleanerTeam;
    booking.status = 'ASSIGNED';
  }

  if (payload.notes) {
    booking.notes = payload.notes;
  }

  if (booking.assignedTeam || (booking.cleanerTeam && booking.cleanerTeam !== 'Unassigned')) {
    booking.status = 'ASSIGNED';
  }

  await booking.save();

  const updatedDoc = await Booking.findById(booking._id)
    .populate('user', 'name email phone avatar')
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate({
      path: 'assignedTeam',
      populate: [
        { path: 'leader', select: 'name email phone rating' },
        { path: 'members', select: 'name email phone role' },
        { path: 'zone', select: 'zoneName district' },
      ],
    })
    .populate('locationId');

  emitBookingUpdated(updatedDoc);

  return updatedDoc;
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

  emitBookingUpdated(booking);

  return booking;
};

const getAvailableBookingsForTeamsFromDB = async () => {
  const filter: Record<string, unknown> = {
    isDeleted: false,
    status: { $ne: 'CANCELLED' },
    $or: [
      { assignedTeam: { $exists: false } },
      { assignedTeam: null },
    ],
  };

  const availableBookings = await Booking.find(filter)
    .populate('user', 'name email phone avatar')
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('locationId', 'address city zipCode')
    .populate({
      path: 'teamRequests.team',
      select: 'teamName teamCode leader status',
      populate: { path: 'leader', select: 'name email phone rating' },
    })
    .populate({
      path: 'teamRequests.requestedBy',
      select: 'name email phone',
    })
    .sort({ createdAt: -1 });

  return availableBookings;
};

const requestBookingByTeamInDB = async (
  bookingId: string,
  jwtUser: { id: string; role: string; email: string },
  teamSlug?: string,
) => {
  let team = null;

  if (teamSlug) {
    let queryObj: Record<string, unknown> = { isDeleted: false };
    if (Types.ObjectId.isValid(teamSlug)) {
      queryObj._id = teamSlug;
      team = await Team.findOne(queryObj);
    } else {
      const formattedName = teamSlug.replace(/-/g, ' ');
      queryObj.$or = [
        { teamCode: { $regex: new RegExp(teamSlug.trim(), 'i') } },
        { teamName: { $regex: new RegExp(formattedName.trim(), 'i') } },
      ];
      team = await Team.findOne(queryObj);
    }
  }

  if (!team && jwtUser) {
    team = await Team.findOne({ leader: jwtUser.id, isDeleted: false });
  }

  if (!team && jwtUser) {
    const cleanerProfile = await Cleaner.findOne({ user: jwtUser.id });
    if (cleanerProfile) {
      team = await Team.findOne({
        isDeleted: false,
        $or: [{ leader: cleanerProfile._id }, { members: cleanerProfile._id }],
      });
    }
  }

  if (!team) {
    throw new AppError(404, 'Team not found for the logged-in team leader!');
  }

  const booking = await Booking.findById(bookingId);
  if (!booking || booking.isDeleted) {
    throw new AppError(404, 'Customer service booking not found!');
  }

  if (booking.assignedTeam) {
    throw new AppError(400, 'This booking has already been assigned to a team!');
  }

  if (!booking.teamRequests) {
    booking.teamRequests = [];
  }

  const existingIndex = booking.teamRequests.findIndex(
    (r) => r.team.toString() === team!._id.toString(),
  );

  if (existingIndex > -1) {
    booking.teamRequests[existingIndex].status = 'PENDING';
    booking.teamRequests[existingIndex].requestedAt = new Date();
  } else {
    booking.teamRequests.push({
      team: team._id as any,
      requestedBy: new Types.ObjectId(jwtUser.id) as any,
      requestedAt: new Date(),
      status: 'PENDING',
    });
  }

  await booking.save();

  const updatedDoc = await Booking.findById(booking._id)
    .populate('user', 'name email phone avatar')
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('locationId')
    .populate({
      path: 'teamRequests.team',
      select: 'teamName teamCode leader status',
      populate: { path: 'leader', select: 'name email phone rating' },
    })
    .populate({
      path: 'teamRequests.requestedBy',
      select: 'name email phone',
    });

  if (updatedDoc) {
    emitBookingUpdated(updatedDoc);
  }

  return updatedDoc;
};

const updateBookingProgressByTeamInDB = async (
  bookingId: string,
  payload: { status: 'CONFIRMED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'; notes?: string },
) => {
  const booking = await Booking.findById(bookingId);
  if (!booking || booking.isDeleted) {
    throw new AppError(404, 'Customer service booking not found!');
  }

  if (payload.status) {
    booking.status = payload.status;
    if (payload.status === 'COMPLETED') {
      booking.paymentStatus = 'PAID';
    }
  }

  if (payload.notes) {
    booking.notes = payload.notes;
  }

  await booking.save();

  const updatedDoc = await Booking.findById(booking._id)
    .populate('user', 'name email phone avatar')
    .populate('serviceType', 'title slug category badge price heroImage fields')
    .populate('coverageArea', 'zoneName district areasIncluded zipCodes')
    .populate({
      path: 'assignedTeam',
      populate: [
        { path: 'leader', select: 'name email phone rating' },
        { path: 'members', select: 'name email phone role' },
        { path: 'zone', select: 'zoneName district' },
      ],
    })
    .populate('locationId');

  if (updatedDoc) {
    emitBookingUpdated(updatedDoc);
  }

  return updatedDoc;
};

export const BookingService = {
  createBooking,
  getMyBookings,
  getSingleBooking,
  getAllBookingsAdmin,
  updateBookingStatusAdmin,
  assignTeamToBookingAdmin,
  cancelBooking,
  getAvailableBookingsForTeamsFromDB,
  requestBookingByTeamInDB,
  updateBookingProgressByTeamInDB,
};
