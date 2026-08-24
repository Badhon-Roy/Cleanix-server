import { z } from 'zod';

const createTeamValidationSchema = z.object({
  body: z.object({
    teamCode: z.string().min(1, 'Team code is required'),
    teamName: z.string().min(1, 'Team name is required'),
    teamImage: z.string().min(1, 'Team image URL is required'),
    leader: z.string().min(1, 'Team leader ID is required'),
    members: z.array(z.string()).optional().default([]),
    zone: z.string().min(1, 'Coverage zone is required'),
    commissionRate: z.number().optional().default(10),
    cleanerPoolShare: z.number().optional().default(40),
    adminShare: z.number().optional().default(50),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional().default('ACTIVE'),
  }),
});

const updateTeamValidationSchema = z.object({
  body: z.object({
    teamCode: z.string().optional(),
    teamName: z.string().optional(),
    teamImage: z.string().optional(),
    leader: z.string().optional(),
    members: z.array(z.string()).optional(),
    zone: z.string().optional(),
    commissionRate: z.number().optional(),
    cleanerPoolShare: z.number().optional(),
    adminShare: z.number().optional(),
    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  }),
});

export const TeamValidation = {
  createTeamValidationSchema,
  updateTeamValidationSchema,
};
