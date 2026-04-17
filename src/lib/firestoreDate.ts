/** Convert Firestore Timestamp / serialized timestamp / ISO string to a valid Date. */
export function firestoreTimestampToDate(value: unknown): Date | null {
  if (value == null) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "object" && value !== null && typeof (value as { toDate?: () => Date }).toDate === "function") {
    try {
      const d = (value as { toDate: () => Date }).toDate();
      return Number.isNaN(d.getTime()) ? null : d;
    } catch {
      return null;
    }
  }
  const sec = (value as { seconds?: number })?.seconds;
  if (typeof sec === "number") return new Date(sec * 1000);
  const ms = (value as { _seconds?: number })?._seconds;
  if (typeof ms === "number") return new Date(ms * 1000);
  if (typeof value === "number") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (typeof value === "string") {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatFirestoreDate(
  value: unknown,
  locale: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const d = firestoreTimestampToDate(value);
  if (!d) return "—";
  return d.toLocaleString(locale, options ?? { dateStyle: "medium", timeStyle: "short" });
}
