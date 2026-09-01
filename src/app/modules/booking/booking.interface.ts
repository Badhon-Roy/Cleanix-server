import { Types } from 'mongoose';

export type TBookingPaymentMethod = 'BKASH' | 'NAGAD' | 'STRIPE' | 'COD';
export type TBookingPaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type TBookingStatus = 'PENDING' | 'CONFIRMED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface IBookingServiceItem {
  name: string;
  value: number;
  addOn: boolean;
}

export interface ITeamBookingRequest {
  team: Types.ObjectId;
  requestedBy?: Types.ObjectId;
  requestedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface IBooking {
  bookingRef: string;
  user: Types.ObjectId;
  serviceType: Types.ObjectId; // ref to ServiceCategory (populate)
  coverageArea: Types.ObjectId; // ref to CoverageArea (populate)
  selectedAddons?: string[];
  scheduledDate: string;
  timeSlot: string;
  address: string;
  locationId?: Types.ObjectId;
  paymentMethod: TBookingPaymentMethod;
  paymentStatus: TBookingPaymentStatus;
  status: TBookingStatus;
  cleanerTeam?: string;
  assignedTeam?: Types.ObjectId;
  teamRequests?: ITeamBookingRequest[];
  services: IBookingServiceItem[];
  addonsTotal: number;
  totalAmount: number;
  customFieldValues?: Record<string, any>;
  notes?: string;
  isDeleted?: boolean;
}
