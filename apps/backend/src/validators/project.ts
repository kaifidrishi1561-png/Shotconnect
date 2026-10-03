import { z } from 'zod';

export const createProjectSchema = z.object({
  title: z.string().min(3),
  category: z.string().min(2),
  productName: z.string().min(2),
  numberOfProducts: z.number().min(1),
  requiredPhotos: z.number().min(1),
  photographyStyle: z.string().min(2),
  backgroundRequirement: z.string().optional(),
  modelRequired: z.boolean().optional(),
  propsRequired: z.boolean().optional(),
  videoRequired: z.boolean().optional(),
  description: z.string().optional(),
  referenceImages: z.array(z.string()).optional(),
  budget: z.number().min(0),
  location: z.string().min(2),
  deadline: z.string().or(z.date()),
  additionalInstructions: z.string().optional()
});
