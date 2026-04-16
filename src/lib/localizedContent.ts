import type { Language } from "@/contexts/LanguageContext";
import type { Category, Product } from "@/data/products";
import { categories as seedCategories } from "@/data/products";

const norm = (v: string | undefined) => (v ?? "").trim().toLowerCase();

/** Arabic display name for categories: DB `nameAr`, else seed catalog match, else `name`. */
export function resolveCategoryName(
  cat: Pick<Category, "id" | "slug" | "name"> & { nameAr?: string },
  lang: Language
): string {
  if (lang === "en") return cat.name?.trim() || "";
  const ar = cat.nameAr?.trim();
  if (ar) return ar;
  const id = norm(cat.id);
  const slug = norm(cat.slug);
  const seed = seedCategories.find(
    (s) => norm(s.id) === id || norm(s.slug) === slug || norm(s.id) === slug || norm(s.slug) === id
  );
  if (seed?.name) return seed.name;
  return cat.name?.trim() || "";
}

export function resolveProductName(
  product: Pick<Product, "name"> & { nameAr?: string },
  lang: Language
): string {
  if (lang === "en") return product.name?.trim() || "";
  return product.nameAr?.trim() || product.name?.trim() || "";
}

export function resolveProductDescription(
  product: Pick<Product, "description"> & { descriptionAr?: string },
  lang: Language
): string {
  if (lang === "en") return product.description?.trim() || "";
  return product.descriptionAr?.trim() || product.description?.trim() || "";
}

const BADGE_KEY: Record<string, string> = {
  "Best Seller": "product.badge.bestSeller",
  "Top Rated": "product.badge.topRated",
  Popular: "product.badge.popular",
};

export function resolveProductBadge(
  badge: string | undefined,
  lang: Language,
  t: (key: string) => string | Record<string, string>
): string | undefined {
  if (!badge) return undefined;
  if (badge === "Deal") return t("product.off") as string;
  const key = BADGE_KEY[badge];
  if (key) return t(key) as string;
  return badge;
}
