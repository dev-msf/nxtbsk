import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().max(255),
  description: z.string().max(2000),
  tags: z.array(z.string()).optional().default([]),
  price: z.number().positive(),
  category: z.string().max(100).optional(),
  brand: z.string().max(100).optional(),
});

export type ProductInput = z.infer<typeof productSchema>; 