import { readFileSync } from "fs";
import { extname, join } from "path";
import { MedusaContainer } from "@medusajs/framework";
import { ProductStatus } from "@medusajs/framework/utils";
import {
  createProductCategoriesWorkflow,
  createProductOptionsWorkflow,
  createProductsWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows";

const productImageDir = join(__dirname, "../assets/product-images");

const GRIND_VALUES = ["Whole Bean", "Drip Ground", "Espresso Ground"] as const;
const BAG_SIZE_VALUES = ["2 lb", "5 lb", "10 lb"] as const;
const BOTTLE_SIZE_VALUES = ["32 oz", "64 oz"] as const;

// Bulk pricing: $/lb drops as bag size goes up. Grind doesn't affect price.
const BAG_SIZE_LB: Record<(typeof BAG_SIZE_VALUES)[number], number> = {
  "2 lb": 2,
  "5 lb": 5,
  "10 lb": 10,
};
const BAG_SIZE_DISCOUNT: Record<(typeof BAG_SIZE_VALUES)[number], number> = {
  "2 lb": 1,
  "5 lb": 0.88,
  "10 lb": 0.78,
};

type BagCoffeeSeed = {
  kind: "bag";
  title: string;
  handle: string;
  category: string;
  pricePerLb: number;
  origin: string;
  roastLevel: string;
  description: string;
  imageFile: string;
};

type BottleCoffeeSeed = {
  kind: "bottle";
  title: string;
  handle: string;
  category: string;
  bottlePrices: Record<(typeof BOTTLE_SIZE_VALUES)[number], number>;
  origin: string;
  roastLevel: string;
  description: string;
  imageFile: string;
};

type ProductSeed = BagCoffeeSeed | BottleCoffeeSeed;

const products: ProductSeed[] = [
  {
    kind: "bag",
    title: "Ethiopia Yirgacheffe",
    handle: "ethiopia-yirgacheffe",
    category: "Single-Origin Roasts",
    pricePerLb: 23,
    origin: "Yirgacheffe, Ethiopia",
    roastLevel: "Light",
    description:
      "<p>Grown at high altitude in the birthplace of coffee, this washed Yirgacheffe is bright and floral with a tea-like body. Expect notes of <strong>jasmine, bergamot, and lemon zest</strong>, finishing clean and sweet. A favorite among our light-roast drinkers who want a cup that tastes like the farm it came from.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Yirgacheffe, Ethiopia</li><li><strong>Process:</strong> Washed</li><li><strong>Altitude:</strong> 1,900-2,200m</li><li><strong>Roast Level:</strong> Light</li></ul>",
    imageFile: "ethiopia-yirgacheffe.jpg",
  },
  {
    kind: "bag",
    title: "Colombia Huila",
    handle: "colombia-huila",
    category: "Single-Origin Roasts",
    pricePerLb: 19,
    origin: "Huila, Colombia",
    roastLevel: "Medium",
    description:
      "<p>A reliable, well-rounded cup from the Huila region's rich volcanic soil. Balanced sweetness with notes of <strong>caramel, red apple, and toasted almond</strong> - the roast most of our customers reach for on a normal Tuesday.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Huila, Colombia</li><li><strong>Process:</strong> Washed</li><li><strong>Altitude:</strong> 1,600-1,900m</li><li><strong>Roast Level:</strong> Medium</li></ul>",
    imageFile: "colombia-huila.jpg",
  },
  {
    kind: "bag",
    title: "Kenya AA",
    handle: "kenya-aa",
    category: "Single-Origin Roasts",
    pricePerLb: 24,
    origin: "Nyeri, Kenya",
    roastLevel: "Medium-Light",
    description:
      "<p>Grown at high elevation and processed with care, this AA-grade lot delivers the winey acidity Kenyan coffee is known for. Bold notes of <strong>black currant, grapefruit, and brown sugar</strong> make this our most requested single-origin.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Nyeri, Kenya</li><li><strong>Process:</strong> Washed</li><li><strong>Altitude:</strong> 1,700-2,000m</li><li><strong>Roast Level:</strong> Medium-Light</li></ul>",
    imageFile: "kenya-aa.jpg",
  },
  {
    kind: "bag",
    title: "Sumatra Mandheling",
    handle: "sumatra-mandheling",
    category: "Single-Origin Roasts",
    pricePerLb: 20,
    origin: "Mandailing, Sumatra",
    roastLevel: "Dark",
    description:
      "<p>Wet-hulled and full-bodied, this is the roast for people who want their coffee to taste like coffee. Earthy and herbal with notes of <strong>dark chocolate, cedar, and dried fig</strong>, and almost no acidity - low and slow the whole way down.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Mandailing, Sumatra</li><li><strong>Process:</strong> Wet-hulled</li><li><strong>Altitude:</strong> 1,100-1,500m</li><li><strong>Roast Level:</strong> Dark</li></ul>",
    imageFile: "sumatra-mandheling.jpg",
  },
  {
    kind: "bag",
    title: "Amber Hour Signature Blend",
    handle: "signature-blend",
    category: "House Blends",
    pricePerLb: 18,
    origin: "Colombia & Brazil",
    roastLevel: "Medium",
    description:
      "<p>Our flagship blend, built to be the coffee you make every single morning without thinking twice. A Colombia/Brazil base gives it <strong>milk chocolate, hazelnut, and brown butter</strong> notes - smooth enough for drip, balanced enough for milk drinks.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Colombia &amp; Brazil</li><li><strong>Process:</strong> Washed &amp; Natural</li><li><strong>Roast Level:</strong> Medium</li></ul>",
    imageFile: "signature-blend.jpg",
  },
  {
    kind: "bag",
    title: "Midnight Espresso Blend",
    handle: "midnight-espresso",
    category: "House Blends",
    pricePerLb: 20,
    origin: "Brazil, Guatemala & Sumatra",
    roastLevel: "Dark",
    description:
      "<p>Built specifically to pull good shots - low acidity, heavy body, and a sweetness that cuts through milk without disappearing. Notes of <strong>dark caramel, cocoa nib, and toasted walnut</strong>. Works just as well as a bold drip cup if that's your thing.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Brazil, Guatemala &amp; Sumatra</li><li><strong>Process:</strong> Natural &amp; Washed</li><li><strong>Roast Level:</strong> Dark</li></ul>",
    imageFile: "midnight-espresso.jpg",
  },
  {
    kind: "bag",
    title: "Sunrise Decaf Blend",
    handle: "sunrise-decaf",
    category: "House Blends",
    pricePerLb: 19,
    origin: "Colombia (Swiss Water Process)",
    roastLevel: "Medium",
    description:
      "<p>Decaffeinated using the Swiss Water Process - no chemical solvents, just water, temperature, and time. You'd never guess it's decaf: full body, real sweetness, notes of <strong>toffee, pecan, and dried cherry</strong>.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Colombia</li><li><strong>Decaf Process:</strong> Swiss Water Process</li><li><strong>Roast Level:</strong> Medium</li></ul>",
    imageFile: "sunrise-decaf.jpg",
  },
  {
    kind: "bottle",
    title: "Cold Brew Concentrate",
    handle: "cold-brew-concentrate",
    category: "Cold Brew & Ready-to-Drink",
    bottlePrices: { "32 oz": 14, "64 oz": 25 },
    origin: "Brazil & Colombia",
    roastLevel: "Medium-Dark",
    description:
      "<p>Steeped cold for 18 hours, this concentrate is smooth and low-acid with notes of <strong>dark chocolate and molasses</strong>. Cut 1:1 with water or milk over ice, or use it as an espresso substitute in any milk drink.</p><strong>Details:</strong><ul><li><strong>Origin:</strong> Brazil &amp; Colombia</li><li><strong>Steep Time:</strong> 18 hours</li><li><strong>Dilution:</strong> 1:1 recommended</li></ul>",
    imageFile: "cold-brew-concentrate.jpg",
  },
];

export const COFFEE_CATEGORY_NAMES = Array.from(
  new Set(products.map((p) => p.category))
);

export const COFFEE_PRODUCT_HANDLES = products.map((p) => p.handle);

// Medusa's default handle generation keeps characters like "&", which
// aren't safe in a URL path segment. Slugify explicitly instead.
const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mimeTypeForExt: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function uploadFile(container: MedusaContainer, filePath: string) {
  const ext = extname(filePath);
  const { result } = await uploadFilesWorkflow(container).run({
    input: {
      files: [
        {
          filename: `${Date.now()}-${filePath.split("/").pop()}`,
          mimeType: mimeTypeForExt[ext.toLowerCase()] ?? "application/octet-stream",
          content: readFileSync(filePath).toString("base64"),
          access: "public" as const,
        },
      ],
    },
  });
  return result[0].url;
}

const GRAMS_PER_LB = 454;
const GRAMS_PER_OZ = 28;

/**
 * Creates the coffee categories, options, and products. Reused by the
 * fresh-install seed script.
 *
 * Bag coffees get a Grind x Bag Size variant matrix (9 variants each) so
 * the storefront's option-based filtering has real, shared facets to show
 * off across the whole catalog. The cold brew bottle uses its own Bottle
 * Size option instead - grind doesn't apply to a liquid product, and
 * forcing it to share the bag options would produce nonsense combinations
 * (e.g. a "10 lb, Espresso Ground" bottle of cold brew).
 */
export async function seedCoffeeCatalog(
  container: MedusaContainer,
  opts: { salesChannelId: string; shippingProfileId: string }
) {
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: COFFEE_CATEGORY_NAMES.map((name) => ({
        name,
        handle: slugify(name),
        is_active: true,
      })),
    },
  });
  const categoryIdByName = new Map(categoryResult.map((c) => [c.name, c.id]));

  // Shared (non-exclusive) options so they show up as cross-product filter
  // facets in the storefront, not just per-product variant pickers.
  const { result: optionResult } = await createProductOptionsWorkflow(
    container
  ).run({
    input: {
      product_options: [
        { title: "Grind", values: [...GRIND_VALUES] },
        { title: "Bag Size", values: [...BAG_SIZE_VALUES] },
        { title: "Bottle Size", values: [...BOTTLE_SIZE_VALUES] },
      ],
    },
  });
  const grindOption = optionResult.find((o) => o.title === "Grind")!;
  const bagSizeOption = optionResult.find((o) => o.title === "Bag Size")!;
  const bottleSizeOption = optionResult.find((o) => o.title === "Bottle Size")!;

  type ProductInput = {
    title: string;
    category_ids: string[];
    description: string;
    handle: string;
    status: ProductStatus;
    shipping_profile_id: string;
    metadata: Record<string, string>;
    images: { url: string }[];
    options: { id: string }[];
    variants: {
      title: string;
      sku: string;
      weight: number;
      options: Record<string, string>;
      prices: { amount: number; currency_code: string }[];
    }[];
    sales_channels: { id: string }[];
  };

  const productsInput: ProductInput[] = [];
  for (const p of products) {
    const imageUrl = await uploadFile(
      container,
      join(productImageDir, p.imageFile)
    );

    const variants: ProductInput["variants"] = [];
    if (p.kind === "bag") {
      for (const bagSize of BAG_SIZE_VALUES) {
        const lb = BAG_SIZE_LB[bagSize];
        const price = Math.round(p.pricePerLb * lb * BAG_SIZE_DISCOUNT[bagSize]);
        for (const grind of GRIND_VALUES) {
          variants.push({
            title: `${grind} / ${bagSize}`,
            sku: `${p.handle.toUpperCase()}-${grind.slice(0, 2).toUpperCase()}-${bagSize.replace(" lb", "LB")}`,
            weight: lb * GRAMS_PER_LB,
            options: { Grind: grind, "Bag Size": bagSize },
            prices: [{ amount: price, currency_code: "usd" }],
          });
        }
      }
    } else {
      for (const bottleSize of BOTTLE_SIZE_VALUES) {
        const oz = parseInt(bottleSize, 10);
        variants.push({
          title: bottleSize,
          sku: `${p.handle.toUpperCase()}-${bottleSize.replace(" oz", "OZ")}`,
          weight: oz * GRAMS_PER_OZ,
          options: { "Bottle Size": bottleSize },
          prices: [{ amount: p.bottlePrices[bottleSize], currency_code: "usd" }],
        });
      }
    }

    productsInput.push({
      title: p.title,
      category_ids: [categoryIdByName.get(p.category)!],
      description: p.description,
      handle: p.handle,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: opts.shippingProfileId,
      metadata: {
        origin: p.origin,
        roast_level: p.roastLevel,
      },
      images: [{ url: imageUrl }],
      options:
        p.kind === "bag"
          ? [{ id: grindOption.id }, { id: bagSizeOption.id }]
          : [{ id: bottleSizeOption.id }],
      variants,
      sales_channels: [{ id: opts.salesChannelId }],
    });
  }

  await createProductsWorkflow(container).run({
    input: {
      products: productsInput,
    },
  });

  return { categoryResult };
}
