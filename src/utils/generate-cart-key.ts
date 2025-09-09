import slugify from "@/utils/slugify";

/**
 * Generates a unique cart item key with slugification and date
 * Format: {slugified-family}-{random-string}-{timestamp}
 * Example: fuzar-x7k9m2p4q8-20241215-143022
 */
export function generateCartKey(familyName: string): string {
  // Generate a random string (8 characters)
  const randomString = Math.random().toString(36).substring(2, 10).toLowerCase();

  // Get current date in YYYYMMDD-HHMMSS format
  const now = new Date();
  const dateString = now.toISOString().slice(0, 19).replace(/[-:T]/g, "").replace(/\..+/, "");

  // Slugify the family name
  const slugifiedFamily = slugify(familyName);

  // Combine all parts
  const cartKey = `${slugifiedFamily}-${randomString}-${dateString}`;

  return cartKey;
}
