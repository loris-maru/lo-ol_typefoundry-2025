import { z } from 'zod';

export const LicenseEnum = z.enum(['Web', 'Print', 'Both']);
export const UserTierEnum = z.enum(['1-4', '5-10', '11-20', '21+']);

export const CartItemSchema = z.object({
  fontId: z.string().min(1),
  fontFamilyId: z.string().min(1),
  licenseType: LicenseEnum,
  userTier: UserTierEnum,
  // Optional axis overrides your generator will need:
  weight: z.number().optional(),
  width: z.number().nullable().optional(),
  slant: z.number().nullable().optional(),
  opticalSize: z.number().nullable().optional(),
  isItalic: z.boolean().optional(),
  qty: z.number().int().min(1).default(1),
});
export type CartItem = z.infer<typeof CartItemSchema>;

export const CartSchema = z.object({ items: z.array(CartItemSchema).min(1) });
export type CartPayload = z.infer<typeof CartSchema>;