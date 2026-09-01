import { Types } from 'mongoose';
import { Subscription } from './subscription.model';
import { Plan } from '../plan/plan.model';
import { Addon } from '../addon/addon.model';
import { CoverageArea } from '../coverage/coverage.model';
import AppError from '../../errors/AppError';
import { emitSubscriptionCreated, emitSubscriptionUpdated } from '../../socket/socket';

const createSubscriptionInDB = async (userId: string, payload: any) => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new AppError(401, 'User authentication is required to purchase a subscription!');
  }

  const planIdRaw = (payload.selectedPlanId || payload.planId || 'STANDARD').toUpperCase();

  // Find Plan Details from DB or default fallback
  let planDoc = await Plan.findOne({
    $or: [
      { _id: Types.ObjectId.isValid(planIdRaw) ? planIdRaw : null },
      { id: planIdRaw },
      { title: planIdRaw },
    ],
    isDeleted: false,
  });

  let planTitle = planDoc ? planDoc.title : planIdRaw;
  let rawPrice = planDoc ? parseFloat(planDoc.price.replace(/[^0-9.]/g, '')) : 14000;
  let planPrice = isNaN(rawPrice) || rawPrice <= 0 ? 14000 : rawPrice;

  let totalVisits = 4;
  if (planIdRaw.includes('BASIC')) totalVisits = 2;
  else if (planIdRaw.includes('PREMIUM')) totalVisits = 8;
  else if (planIdRaw.includes('STANDARD')) totalVisits = 4;

  // Selected Addons Pricing Calculation
  const addonSlugs: string[] = Array.isArray(payload.selectedAddonIds)
    ? payload.selectedAddonIds
    : Array.isArray(payload.selectedAddons)
    ? payload.selectedAddons
    : [];

  const addonDocs = addonSlugs.length
    ? await Addon.find({ slug: { $in: addonSlugs }, active: true, isDeleted: false })
    : [];

  const addonsTotal = addonDocs.reduce((sum, a) => sum + (a.price || 0), 0);
  const subtotal = planPrice + addonsTotal;
  const discount = Number(payload.discount) || 0;
  const totalAmount = Math.max(0, subtotal - discount);

  // Coverage Area / Zone check
  let zoneName = payload.selectedZone || payload.zoneName || 'Dhaka Central Zone';
  let coverageAreaId: Types.ObjectId | undefined = undefined;

  if (payload.coverageArea && Types.ObjectId.isValid(payload.coverageArea)) {
    coverageAreaId = new Types.ObjectId(payload.coverageArea);
    const covDoc = await CoverageArea.findById(coverageAreaId);
    if (covDoc) {
      zoneName = `${covDoc.zoneName} (${covDoc.district || 'Dhaka'})`;
    }
  }

  // Generate Unique Subscription Reference Code
  const randomCode = Math.floor(1000 + Math.random() * 9000);
  const subscriptionRef = `#SUB-2026-${randomCode}`;

  // Calculate 30-Day Subscription Period
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);

  // Enforce single active subscription constraint (Expire any previous active subscription for this user)
  const existingActiveSubscriptions = await Subscription.find({
    user: new Types.ObjectId(userId),
    status: 'ACTIVE',
    isDeleted: false,
  });

  for (const existingSub of existingActiveSubscriptions) {
    existingSub.status = 'EXPIRED';
    await existingSub.save();
    emitSubscriptionUpdated(existingSub);
  }

  const newSubscription = await Subscription.create({
    subscriptionRef,
    user: new Types.ObjectId(userId),
    plan: planDoc?._id ? planDoc._id : undefined,
    planId: planIdRaw,
    planTitle,
    coverageArea: coverageAreaId,
    zoneName,
    streetAddress: payload.streetAddress || payload.address || 'Dhaka',
    selectedAddons: addonSlugs,
    firstVisitDate: payload.firstVisitDate || payload.scheduledDate || '2026-09-05',
    timeSlot: payload.timeSlot || '09:00 AM - 11:00 AM',
    specialInstructions: payload.specialInstructions || payload.notes || '',
    billingCycle: 'MONTHLY',
    totalVisitsPerMonth: totalVisits,
    remainingVisits: totalVisits,
    usedVisits: 0,
    subtotal,
    discount,
    totalAmount,
    paymentMethod: payload.paymentMethod || 'BKASH',
    paymentStatus: payload.paymentMethod === 'COD' ? 'PENDING' : 'PAID',
    status: 'ACTIVE',
    trxId: payload.bkashTrxId || payload.trxId || `TXN-${randomCode}912`,
    bkashPhone: payload.bkashPhone || payload.phone || '',
    startDate,
    endDate,
  });

  const populatedDoc = await Subscription.findById(newSubscription._id)
    .populate('user', 'name email phone avatar')
    .populate('plan')
    .populate('coverageArea');

  emitSubscriptionCreated(populatedDoc);

  return populatedDoc;
};

const getMySubscriptionsFromDB = async (userId: string) => {
  const subscriptions = await Subscription.find({
    user: userId,
    isDeleted: false,
  })
    .populate('user', 'name email phone avatar')
    .populate('plan')
    .populate('coverageArea')
    .sort({ createdAt: -1 });

  return subscriptions.map((subDoc) => {
    const sub = subDoc.toObject();
    const start = sub.startDate ? new Date(sub.startDate) : new Date((sub as any).createdAt || Date.now());
    const end = sub.endDate ? new Date(sub.endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);
    return {
      ...sub,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
    };
  });
};

const getSingleSubscriptionFromDB = async (subscriptionId: string, userId?: string) => {
  const query: any = { isDeleted: false };
  if (Types.ObjectId.isValid(subscriptionId)) {
    query._id = subscriptionId;
  } else {
    query.subscriptionRef = subscriptionId;
  }

  if (userId) {
    query.user = userId;
  }

  const subscription = await Subscription.findOne(query)
    .populate('user', 'name email phone avatar')
    .populate('plan')
    .populate('coverageArea');

  if (!subscription) {
    throw new AppError(404, 'Subscription record not found');
  }

  const sub = subscription.toObject();
  const start = sub.startDate ? new Date(sub.startDate) : new Date((sub as any).createdAt || Date.now());
  const end = sub.endDate ? new Date(sub.endDate) : new Date(start.getTime() + 30 * 24 * 60 * 60 * 1000);

  return {
    ...sub,
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
};

const cancelSubscriptionInDB = async (subscriptionId: string, userId?: string) => {
  const query: any = { isDeleted: false };
  if (Types.ObjectId.isValid(subscriptionId)) {
    query._id = subscriptionId;
  } else {
    query.subscriptionRef = subscriptionId;
  }
  if (userId) {
    query.user = userId;
  }

  const subscription = await Subscription.findOne(query);
  if (!subscription) {
    throw new AppError(404, 'Subscription record not found');
  }

  subscription.status = 'CANCELLED';
  await subscription.save();

  emitSubscriptionUpdated(subscription);
  return subscription;
};

const getAllSubscriptionsAdminFromDB = async (query: Record<string, unknown>) => {
  const filter: Record<string, unknown> = { isDeleted: false };

  if (query.status) {
    filter.status = query.status;
  }

  const subscriptions = await Subscription.find(filter)
    .populate('user', 'name email phone avatar')
    .populate('plan')
    .populate('coverageArea')
    .sort({ createdAt: -1 });

  return subscriptions;
};

const updateSubscriptionStatusAdminInDB = async (subscriptionId: string, payload: { status?: string }) => {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) {
    throw new AppError(404, 'Subscription record not found');
  }

  if (payload.status) {
    subscription.status = payload.status as any;
  }

  await subscription.save();
  emitSubscriptionUpdated(subscription);

  return subscription;
};

export const SubscriptionService = {
  createSubscriptionInDB,
  getMySubscriptionsFromDB,
  getSingleSubscriptionFromDB,
  cancelSubscriptionInDB,
  getAllSubscriptionsAdminFromDB,
  updateSubscriptionStatusAdminInDB,
};
