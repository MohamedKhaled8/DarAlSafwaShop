/** Localized Firestore order status for UI */
export function localizedOrderStatus(
  status: string,
  t: (key: string) => string | Record<string, string>,
): string {
  const map: Record<string, string> = {
    Pending: t("orders.statusPending") as string,
    Processing: (t("orders.statusApprovedProcessing") as string) || (t("orders.statusProcessing") as string),
    Shipped: t("orders.statusShipped") as string,
    Delivered: t("orders.statusDelivered") as string,
    Cancelled: t("orders.statusCancelled") as string,
  };
  return map[status] || status;
}
