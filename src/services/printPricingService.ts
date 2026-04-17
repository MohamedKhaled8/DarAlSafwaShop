import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface PrintPriceTier {
  id: string;
  labelAr: string;
  labelEn: string;
  price: number;
}

export interface PrintPricingConfig {
  paperSizes: PrintPriceTier[];
  paperTypes: PrintPriceTier[];
  /** Extra EGP per copy when Color is selected */
  colorExtraPerCopy: number;
  /** Extra EGP per copy for B&W (usually 0) */
  bwExtraPerCopy: number;
  updatedAt?: unknown;
}

const DOC_PATH = "printPricing";
const DOC_ID = "config";

export const DEFAULT_PRINT_PRICING: PrintPricingConfig = {
  paperSizes: [
    { id: "a4", labelAr: "A4", labelEn: "A4", price: 2 },
    { id: "a3", labelAr: "A3", labelEn: "A3", price: 4 },
    { id: "letter", labelAr: "Letter", labelEn: "Letter", price: 2 },
    { id: "legal", labelAr: "Legal", labelEn: "Legal", price: 2.5 },
  ],
  paperTypes: [
    { id: "standard", labelAr: "عادي", labelEn: "Standard", price: 0 },
    { id: "glossy", labelAr: "لامع", labelEn: "Glossy", price: 3 },
    { id: "matte", labelAr: "مطفي", labelEn: "Matte", price: 2 },
    { id: "cardstock", labelAr: "كرتون خفيف", labelEn: "Cardstock", price: 5 },
  ],
  colorExtraPerCopy: 4,
  bwExtraPerCopy: 0,
};

function normalizeConfig(raw: Partial<PrintPricingConfig> | null | undefined): PrintPricingConfig {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_PRINT_PRICING };
  const sizes = Array.isArray(raw.paperSizes) && raw.paperSizes.length ? raw.paperSizes : DEFAULT_PRINT_PRICING.paperSizes;
  const types = Array.isArray(raw.paperTypes) && raw.paperTypes.length ? raw.paperTypes : DEFAULT_PRINT_PRICING.paperTypes;
  return {
    paperSizes: sizes.map((s, i) => ({
      id: String(s.id || `size-${i}`),
      labelAr: String(s.labelAr ?? ""),
      labelEn: String(s.labelEn ?? ""),
      price: Number.isFinite(Number(s.price)) ? Number(s.price) : 0,
    })),
    paperTypes: types.map((s, i) => ({
      id: String(s.id || `type-${i}`),
      labelAr: String(s.labelAr ?? ""),
      labelEn: String(s.labelEn ?? ""),
      price: Number.isFinite(Number(s.price)) ? Number(s.price) : 0,
    })),
    colorExtraPerCopy: Number.isFinite(Number(raw.colorExtraPerCopy)) ? Number(raw.colorExtraPerCopy) : DEFAULT_PRINT_PRICING.colorExtraPerCopy,
    bwExtraPerCopy: Number.isFinite(Number(raw.bwExtraPerCopy)) ? Number(raw.bwExtraPerCopy) : DEFAULT_PRINT_PRICING.bwExtraPerCopy,
  };
}

export async function getPrintPricingConfig(): Promise<PrintPricingConfig> {
  try {
    const ref = doc(db, DOC_PATH, DOC_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) return { ...DEFAULT_PRINT_PRICING };
    return normalizeConfig(snap.data() as Partial<PrintPricingConfig>);
  } catch (e) {
    console.warn("getPrintPricingConfig fallback:", e);
    return { ...DEFAULT_PRINT_PRICING };
  }
}

export async function savePrintPricingConfig(config: PrintPricingConfig): Promise<void> {
  const clean = normalizeConfig(config);
  const ref = doc(db, DOC_PATH, DOC_ID);
  await setDoc(
    ref,
    {
      paperSizes: clean.paperSizes,
      paperTypes: clean.paperTypes,
      colorExtraPerCopy: clean.colorExtraPerCopy,
      bwExtraPerCopy: clean.bwExtraPerCopy,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
