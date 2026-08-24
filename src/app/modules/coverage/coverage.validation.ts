import { z } from 'zod';

const createCoverageValidationSchema = z.object({
  body: z.object({
    zoneName: z.string().min(1, 'Zone name is required'),
    district: z.string().min(1, 'District is required'),
    areasIncluded: z.array(z.string()).min(1, 'At least one area must be included'),
    zipCodes: z.array(z.string()).optional(),
    desc: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

const updateCoverageValidationSchema = z.object({
  body: z.object({
    zoneName: z.string().optional(),
    district: z.string().optional(),
    areasIncluded: z.array(z.string()).optional(),
    zipCodes: z.array(z.string()).optional(),
    desc: z.string().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const CoverageValidation = {
  createCoverageValidationSchema,
  updateCoverageValidationSchema,
};
