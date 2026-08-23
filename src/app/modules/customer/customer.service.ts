import mongoose from 'mongoose';
import { Customer } from './customer.model';
import { User } from '../user/user.model';
import { ICustomer } from './customer.interface';
import AppError from '../../errors/AppError';

const formatCustomerResponse = (customerDoc: any) => {
  const customerObj = customerDoc.toObject ? customerDoc.toObject() : customerDoc;
  const isVip = (customerObj.totalBookings || 0) >= 5 || customerObj.subscriptionPlan === 'VIP';
  const hasActiveSub =
    customerObj.subscriptionStatus === 'ACTIVE' ||
    (customerObj.subscriptionPlan && customerObj.subscriptionPlan !== 'NONE');

  let badge = 'Free Member';
  let planText = 'No Active Subscription (Free Account)';

  if (isVip) {
    badge = 'VIP Subscriber';
    planText = 'VIP Subscription (Active Plan)';
  } else if (hasActiveSub) {
    const planName = customerObj.subscriptionPlan || 'Standard';
    badge = `${planName} Subscriber`;
    planText = `${planName} Subscription (Active Plan)`;
  }

  const createdAtDate = customerObj.createdAt ? new Date(customerObj.createdAt) : new Date();
  const memberSince = `Member since ${createdAtDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

  return {
    ...customerObj,
    membershipBadge: badge,
    membershipPlan: planText,
    memberSince,
  };
};

const getMyProfile = async (userId: string) => {
  const customer = await Customer.findOne({ user: userId, isDeleted: false });
  if (!customer) {
    throw new AppError(404, 'Customer profile not found!');
  }
  return formatCustomerResponse(customer);
};

const updateMyProfile = async (userId: string, payload: Partial<ICustomer>) => {
  const customer = await Customer.findOne({ user: userId, isDeleted: false });
  if (!customer) {
    throw new AppError(404, 'Customer profile not found!');
  }

  const updatedData: Partial<ICustomer> = {};
  if (payload.name !== undefined) updatedData.name = payload.name;
  if (payload.phone !== undefined) updatedData.phone = payload.phone;
  if (payload.avatar !== undefined) updatedData.avatar = payload.avatar;

  const updatedCustomer = await Customer.findOneAndUpdate(
    { user: userId, isDeleted: false },
    { $set: updatedData },
    { new: true, runValidators: true },
  );

  if (payload.name || payload.phone) {
    const userUpdate: Record<string, any> = {};
    if (payload.name) userUpdate.name = payload.name;
    if (payload.phone) userUpdate.phone = payload.phone;
    await User.findByIdAndUpdate(userId, { $set: userUpdate });
  }

  return formatCustomerResponse(updatedCustomer);
};

const deleteMyAccount = async (userId: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // 1. Permanently delete Customer record from MongoDB
    const customer = await Customer.findOneAndDelete(
      { user: userId },
      { session },
    );

    // 2. Permanently delete User record from MongoDB
    const user = await User.findByIdAndDelete(userId, { session });

    if (!customer && !user) {
      throw new AppError(404, 'Customer profile not found or already deleted!');
    }

    // Clean up any potential duplicate records by email across collections
    if (user?.email) {
      await Customer.deleteMany({ email: user.email.toLowerCase() }, { session });
      await User.deleteMany({ email: user.email.toLowerCase() }, { session });
    }

    await session.commitTransaction();
    await session.endSession();

    return customer || { _id: userId };
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const CustomerService = {
  getMyProfile,
  updateMyProfile,
  deleteMyAccount,
};
