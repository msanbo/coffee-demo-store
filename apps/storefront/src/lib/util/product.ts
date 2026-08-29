import { HttpTypes } from "@medusajs/types";

export const isSimpleProduct = (product: HttpTypes.StoreProduct): boolean => {
    return (product.variants?.length ?? 0) <= 1;
}

// Medusa doesn't store an explicit display order for a product's options
// (no rank column on product_option or the product<->option join table),
// so the API returns them in whatever order the query happens to produce -
// which isn't guaranteed to be consistent across products, even when every
// product was seeded with options in the same order. Without this, the
// same two option types (e.g. Grind, Bag Size) can render in a different
// order from one product page to the next.
const OPTION_DISPLAY_ORDER = ["Grind", "Bag Size", "Bottle Size"];

export const sortProductOptions = <T extends { title?: string | null }>(
  options: T[]
): T[] => {
  return [...options].sort((a, b) => {
    const rankA = OPTION_DISPLAY_ORDER.indexOf(a.title ?? "");
    const rankB = OPTION_DISPLAY_ORDER.indexOf(b.title ?? "");
    if (rankA === -1 && rankB === -1) {
      return (a.title ?? "").localeCompare(b.title ?? "");
    }
    if (rankA === -1) return 1;
    if (rankB === -1) return -1;
    return rankA - rankB;
  });
};