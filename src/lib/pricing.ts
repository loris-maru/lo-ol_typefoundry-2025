export type LicenseType = 'Web' | 'Print' | 'Both';
export type UserTier = '1-4' | '5-10' | '11-20' | '21+';

export const LICENSE_MULT: Record<LicenseType, number> = {
  Web: 1.0,
  Print: 1.0,
  Both: 2.5,        // Web + Desktop
};

export const USER_TIER_MULT: Record<UserTier, number> = {
  '1-4': 1.0,
  '5-10': 1.5,
  '11-20': 2.0,
  '21+': 3.0,
};

export function priceForItem(basePrice: number, license: LicenseType, tier: UserTier): number {
  return Math.round(basePrice * LICENSE_MULT[license] * USER_TIER_MULT[tier]);
}

export function totalFromItems(items: Array<{ basePrice: number; license: LicenseType; tier: UserTier }>) {
  return items.reduce((sum, it) => sum + priceForItem(it.basePrice, it.license, it.tier), 0);
}