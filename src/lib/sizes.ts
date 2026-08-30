export type SizeType = "LETTER" | "WAIST" | "SHOE" | "ONE_SIZE";

export const LETTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
export const WAIST_SIZES = ["28", "30", "32", "34", "36", "38", "40", "42", "44"];
export const SHOE_SIZES = ["6", "7", "8", "9", "10", "11", "12"];
export const ONE_SIZE = ["One Size"];

export function getSizeTypeForCategory(category: string): SizeType {
  const cat = (category || "").toLowerCase().trim();

  if (
    cat.includes("pant") ||
    cat.includes("jean") ||
    cat.includes("trouser") ||
    cat.includes("short") ||
    cat.includes("chino") ||
    cat.includes("bottom")
  ) {
    return "WAIST";
  }

  if (
    cat.includes("shoe") ||
    cat.includes("sneaker") ||
    cat.includes("footwear") ||
    cat.includes("boot")
  ) {
    return "SHOE";
  }

  if (
    cat.includes("accessory") ||
    cat.includes("bag") ||
    cat.includes("belt") ||
    cat.includes("jewel") ||
    cat.includes("watch") ||
    cat.includes("perfume")
  ) {
    return "ONE_SIZE";
  }

  // Default for Shirts, T-Shirts, Dresses, Jackets, Sweaters, Knitwear, Kurtas
  return "LETTER";
}

export function getSizesForCategory(category: string): string[] {
  const sizeType = getSizeTypeForCategory(category);
  switch (sizeType) {
    case "WAIST":
      return WAIST_SIZES;
    case "SHOE":
      return SHOE_SIZES;
    case "ONE_SIZE":
      return ONE_SIZE;
    case "LETTER":
    default:
      return LETTER_SIZES;
  }
}
