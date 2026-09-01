import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { SubscriptionService } from './subscription.service';

const createSubscription = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await SubscriptionService.createSubscriptionInDB(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Monthly cleaning subscription activated successfully!',
    data: result,
  });
});

const getMySubscriptions = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await SubscriptionService.getMySubscriptionsFromDB(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Customer subscriptions retrieved successfully!',
    data: result,
  });
});

const getSingleSubscription = catchAsync(async (req: Request, res: Response) => {
  const subscriptionId = req.params.id as string;
  const userId = req.user!.role === 'ADMIN' || req.user!.role === 'SUPER_ADMIN' ? undefined : req.user!.id;

  const result = await SubscriptionService.getSingleSubscriptionFromDB(subscriptionId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription details retrieved successfully!',
    data: result,
  });
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const subscriptionId = req.params.id as string;
  const userId = req.user!.role === 'ADMIN' || req.user!.role === 'SUPER_ADMIN' ? undefined : req.user!.id;

  const result = await SubscriptionService.cancelSubscriptionInDB(subscriptionId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription cancelled successfully!',
    data: result,
  });
});

const getAllSubscriptionsAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await SubscriptionService.getAllSubscriptionsAdminFromDB(req.query);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All subscriptions retrieved for admin successfully!',
    data: result,
  });
});

const updateSubscriptionStatusAdmin = catchAsync(async (req: Request, res: Response) => {
  const subscriptionId = req.params.id as string;
  const result = await SubscriptionService.updateSubscriptionStatusAdminInDB(subscriptionId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Subscription status updated by admin successfully!',
    data: result,
  });
});

const downloadSubscriptionPDF = catchAsync(async (req: Request, res: Response) => {
  const subscriptionId = req.params.id as string;
  const userId = req.user!.role === 'ADMIN' || req.user!.role === 'SUPER_ADMIN' ? undefined : req.user!.id;

  const sub = await SubscriptionService.getSingleSubscriptionFromDB(subscriptionId, userId);
  const userObj: any = sub.user || {};

  const items = [
    {
      description: `Monthly Subscription Plan: ${sub.planTitle} (${sub.totalVisitsPerMonth} Visits/Month)`,
      qty: 1,
      unitPrice: sub.subtotal || sub.totalAmount,
      total: sub.subtotal || sub.totalAmount,
    },
  ];

  if (Array.isArray(sub.selectedAddons) && sub.selectedAddons.length > 0) {
    sub.selectedAddons.forEach((addonSlug) => {
      items.push({
        description: `Addon Care Extra: ${addonSlug.toUpperCase()}`,
        qty: 1,
        unitPrice: 0,
        total: 0,
      });
    });
  }

  const { generatePDFInvoiceStream } = await import('../../utils/pdfGenerator');

  generatePDFInvoiceStream(res, {
    title: 'CLEANIX SUBSCRIPTION INVOICE',
    invoiceNumber: sub.subscriptionRef,
    date: new Date(sub.createdAt || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    customerName: userObj.name || 'Cleanix Subscriber',
    customerPhone: userObj.phone || sub.bkashPhone,
    customerEmail: userObj.email,
    customerAddress: `${sub.streetAddress} (${sub.zoneName})`,
    items,
    subtotal: sub.subtotal || sub.totalAmount,
    discount: sub.discount || 0,
    totalAmount: sub.totalAmount,
    paymentMethod: sub.paymentMethod,
    paymentStatus: sub.paymentStatus,
    trxId: sub.trxId,
    notes: sub.specialInstructions,
  });
});

export const SubscriptionController = {
  createSubscription,
  getMySubscriptions,
  getSingleSubscription,
  cancelSubscription,
  getAllSubscriptionsAdmin,
  updateSubscriptionStatusAdmin,
  downloadSubscriptionPDF,
};
