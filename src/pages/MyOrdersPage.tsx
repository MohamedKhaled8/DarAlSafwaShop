import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ArrowLeft, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByCustomer, Order } from "@/services/orderService";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { localizedOrderStatus } from "@/lib/orderLabels";

const orderStatusStyle: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-900",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-violet-100 text-violet-800",
  Delivered: "bg-emerald-100 text-emerald-800",
  Cancelled: "bg-rose-100 text-rose-800",
};

const MyOrdersPage = () => {
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        const data = await getOrdersByCustomer(user.uid);
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchOrders();
  }, [user]);

  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return "";
    const date =
      timestamp && typeof timestamp === "object" && "toDate" in (timestamp as object)
        ? (timestamp as { toDate: () => Date }).toDate()
        : new Date(timestamp as string | number);
    return new Intl.DateTimeFormat(language === "ar" ? "ar-EG" : "en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  if (!user) return <Navigate to="/login" />;

  return (
    <main className="min-h-screen bg-slate-50 section-padding py-10 lg:py-16" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="mb-2 text-3xl font-black text-slate-900">{t("myOrders.title") as string}</h1>
            <p className="font-medium text-slate-500">{t("myOrders.subtitle") as string}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl px-4 py-2 font-bold text-primary transition-colors hover:bg-primary/5"
          >
            {t("myOrders.back") as string}{" "}
            <ChevronLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-100 bg-white p-12 text-center shadow-sm"
          >
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-slate-50">
              <Package className="h-10 w-10 text-slate-300" />
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-800">{t("myOrders.emptyTitle") as string}</h2>
            <p className="mx-auto mb-8 max-w-md text-slate-500">{t("myOrders.emptyDesc") as string}</p>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-8 py-4 font-bold text-white transition-colors hover:bg-primary"
            >
              {t("myOrders.browse") as string}
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.article
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.06 }}
                className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition-shadow hover:shadow-md md:rounded-[24px]"
              >
                <div className="flex flex-col gap-4 border-b border-slate-100 p-5 md:flex-row md:items-center md:justify-between md:p-6">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("orders.refLabel") as string}
                    </p>
                    <p className="font-mono text-sm font-bold text-slate-700" dir="ltr">
                      ···{order.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <div className="space-y-1 md:text-end">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      {t("orders.dateLabel") as string}
                    </p>
                    <p className="font-semibold text-slate-800">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 md:justify-end">
                    <Badge
                      className={`rounded-full px-3 py-1 font-semibold hover:opacity-95 ${
                        orderStatusStyle[order.status] || "bg-slate-100 text-slate-800"
                      }`}
                    >
                      {localizedOrderStatus(order.status, t)}
                    </Badge>
                    {order.paymentStatus === "Paid" && (
                      <Badge variant="secondary" className="rounded-full">
                        {t("orders.paid") as string}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="p-5 md:p-6">
                  <p className="mb-3 text-sm font-bold text-slate-800">{t("orders.products") as string}</p>
                  <ul className="space-y-3">
                    {order.items.map((item, i) => (
                      <li key={`${order.id}-${i}`} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                        <img
                          src={item.image || "/print-order.svg"}
                          alt=""
                          className="h-16 w-16 shrink-0 rounded-lg border border-white object-cover shadow-sm"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="line-clamp-2 font-semibold text-slate-900">{item.name}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            ×{item.quantity} · {item.price.toFixed(2)} {t("currency") as string}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/80 p-5 sm:flex-row sm:items-center sm:justify-between md:px-6">
                  <div>
                    <p className="text-xs font-medium text-slate-500">{t("checkout.total") as string}</p>
                    <p className="text-2xl font-black text-slate-900 tabular-nums" dir="ltr">
                      {order.total.toFixed(2)} {t("currency") as string}
                    </p>
                  </div>
                  <Link
                    to={`/invoice/${order.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-200 bg-white px-6 py-3 font-bold text-slate-900 transition-all hover:border-primary hover:text-primary"
                  >
                    <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
                    {t("orders.viewInvoice") as string}
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrdersPage;
