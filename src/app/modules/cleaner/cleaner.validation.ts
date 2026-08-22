import { z } from 'zod';

const updateCleanerProfileValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z.string().optional(),
    avatar: z.string().optional().nullable(),
    dob: z.string().optional().nullable(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    nidNumber: z.string().optional().nullable(),
    coverageArea: z.array(z.string()).optional(),
    isAvailable: z.boolean().optional(),
  }),
});

const updateCleanerApprovalValidationSchema = z.object({
  body: z.object({
    status: z.enum(['PENDING_APPROVAL', 'APPROVED', 'BLOCKED']),
    isApproved: z.boolean(),
  }),
});

export const CleanerValidation = {
  updateCleanerProfileValidationSchema,
  updateCleanerApprovalValidationSchema,
};
