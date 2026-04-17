import type { Timestamp } from "firebase/firestore";

/** Convert Firestore Timestamp, plain object, or ISO string to a JS Date. */
export function firestoreToDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as Timestamp).toDate === "function") {
    const d = (value as Timestamp).toDate();
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const sec = (value as { seconds?: number })?.seconds;
  if (typeof sec === "number") return new Date(sec * 1000);
  const d = new Date(value as string | number);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatFirestoreDate(
  value: unknown,
  locale: string,
  opts: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" },
): string {
  const d = firestoreToDate(value);
  if (!d) return "—";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", opts).format(d);
}
