export const SHIRT_SIZES = ["S", "M", "L", "XL", "XXL"];
export const WAIST_SIZES = ["28", "30", "32", "34", "36", "38", "40", "42"];
export const FOOTWEAR_SIZES = ["6", "7", "8", "9", "10", "11"];

export function getRecommendedSizes(categoryNameOrSlug?: string): string[] {
  if (!categoryNameOrSlug) return SHIRT_SIZES;

  const normalized = categoryNameOrSlug.toLowerCase().trim();

  if (
    normalized.includes("pant") ||
    normalized.includes("jean") ||
    normalized.includes("short") ||
    normalized.includes("trouser") ||
    normalized.includes("bottom")
  ) {
    return WAIST_SIZES;
  }

  if (
    normalized.includes("shoe") ||
    normalized.includes("footwear") ||
    normalized.includes("sneaker")
  ) {
    return FOOTWEAR_SIZES;
  }

  return SHIRT_SIZES;
}

export function formatCategorySizeTitle(categoryNameOrSlug?: string): string {
  const normalized = (categoryNameOrSlug || "").toLowerCase().trim();
  if (
    normalized.includes("pant") ||
    normalized.includes("jean") ||
    normalized.includes("short") ||
    normalized.includes("trouser")
  ) {
    return "Select Waist Size (Inches)";
  }
  return "Select Size";
}
