import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Printer, ArrowLeft, ExternalLink } from "lucide-react";
import { getOrderById, type Order } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { firestoreTimestampToDate, formatFirestoreDate } from "@/lib/firestoreDate";

const maskNationalId = (id: string | undefined): string => {
  if (!id || id.length < 4) return "—";
  if (id.length <= 6) return "****" + id.slice(-2);
  return id.slice(0, 2) + "****" + id.slice(-4);
};

const InvoicePage = () => {
  const { id } = useParams();
  const { t, language, isRTL } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const locale = language === "ar" ? "ar-EG" : "en-US";

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        {t("loading") as string}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">{t("invoice.notFound") as string}</h1>
        <Link to="/">
          <Button variant="outline">{t("invoice.back") as string}</Button>
        </Link>
      </div>
    );
  }

  const dateStr = firestoreTimestampToDate(order.createdAt)
    ? formatFirestoreDate(order.createdAt, locale, { dateStyle: "long", timeStyle: "short" })
    : "—";

  const deliveryLabel =
    order.deliveryMethod === "pickup"
      ? (t("invoice.pickup") as string)
      : `${t("invoice.shipping") as string}${order.governorate ? ` (${order.governorate})` : ""}`;

  return (
    <main
      className="min-h-screen bg-gray-50 py-10 section-padding lg:py-16 dark:bg-gray-900/40"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} /> {t("invoice.back") as string}
          </Link>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2 print:hidden" variant="outline" type="button">
              <Printer className="h-4 w-4" /> {t("invoice.print") as string}
            </Button>
            <Button onClick={handlePrint} className="gap-2 print:hidden" type="button">
              <Download className="h-4 w-4" /> {t("invoice.savePdf") as string}
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-950 md:p-12"
        >
          <div className="mb-8 flex flex-col items-center border-b border-gray-100 pb-8 text-center text-black dark:text-white">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">{t("invoice.title") as string}</h1>
            <p className="text-muted-foreground">{t("invoice.subtitle") as string}</p>
          </div>

          <div className="mb-8 grid gap-8 text-black md:grid-cols-2 dark:text-white">
            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("invoice.billedTo") as string}
              </h3>
              <p className="text-lg font-medium">{order.customerName}</p>
              <p className="text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
              {order.altPhone ? (
                <p className="text-gray-600 dark:text-gray-400">
                  {t("invoice.altPhone") as string}: {order.altPhone}
                </p>
              ) : null}
              {order.email ? (
                <p className="text-gray-600 dark:text-gray-400">{order.email}</p>
              ) : null}
              <p className="mt-2 text-sm text-muted-foreground">
                {t("invoice.nationalId") as string}: {maskNationalId(order.nationalId)}
              </p>
            </div>
            <div className="md:text-end">
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {t("invoice.details") as string}
              </h3>
              <p className="font-medium">
                {t("invoice.orderId") as string}:{" "}
                <span className="font-mono font-normal text-gray-600 dark:text-gray-300" dir="ltr">
                  #{order.id}
                </span>
              </p>
              <p className="font-medium">
                {t("invoice.date") as string}:{" "}
                <span className="font-normal text-gray-600 dark:text-gray-300" dir="ltr">
                  {dateStr}
                </span>
              </p>
              <p className="font-medium capitalize">
                {t("invoice.delivery") as string}:{" "}
                <span className="font-normal text-gray-600 dark:text-gray-300">{deliveryLabel}</span>
              </p>
              {order.paymentMethod ? (
                <p className="font-medium">
                  {t("invoice.paymentMethod") as string}:{" "}
                  <span className="font-normal text-gray-600 dark:text-gray-300">{order.paymentMethod}</span>
                </p>
              ) : null}
              <p className="font-medium">
                {t("invoice.paymentStatus") as string}:{" "}
                <span className="font-normal text-gray-600 dark:text-gray-300">{order.paymentStatus}</span>
              </p>
            </div>
          </div>

          {order.receiptImage ? (
            <div className="mb-8 rounded-xl border border-dashed border-primary/30 bg-primary/5 p-4">
              <p className="mb-2 text-sm font-semibold">{t("invoice.receipt") as string}</p>
              <a
                href={order.receiptImage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                {t("invoice.viewReceipt") as string}
              </a>
            </div>
          ) : null}

          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
            <table className="w-full text-start">
              <thead className="border-b border-gray-200 bg-gray-50 text-sm font-semibold text-muted-foreground dark:border-gray-800 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3">{t("invoice.items") as string}</th>
                  <th className="px-4 py-3 text-center">{t("invoice.qty") as string}</th>
                  <th className="px-4 py-3 text-end">{t("invoice.lineTotal") as string}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-4">
                      <div className="flex gap-3">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="h-14 w-14 shrink-0 rounded-lg border object-cover"
                          />
                        ) : null}
                        <div className="min-w-0">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground" dir="ltr">
                            {t("invoice.unitPrice") as string}: {item.price.toFixed(2)} {t("currency") as string}
                          </p>
                          {item.variantId ? (
                            <p className="mt-1 whitespace-pre-wrap text-[10px] text-muted-foreground">{item.variantId}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">{item.quantity}</td>
                    <td className="px-4 py-4 text-end tabular-nums" dir="ltr">
                      {(item.price * item.quantity).toFixed(2)} {t("currency") as string}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-8 flex flex-col items-end text-black dark:text-white">
            <div className="w-full space-y-3 md:w-1/2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invoice.subtotal") as string}</span>
                <span className="tabular-nums" dir="ltr">
                  {order.subtotal?.toFixed(2) ?? "0.00"} {t("currency") as string}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("invoice.shippingFee") as string}</span>
                <span className="tabular-nums" dir="ltr">
                  {order.shippingFee != null && order.shippingFee > 0
                    ? `${order.shippingFee.toFixed(2)} ${t("currency") as string}`
                    : (t("invoice.free") as string)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-xl font-bold text-primary dark:border-gray-800">
                <span>{t("invoice.total") as string}</span>
                <span className="tabular-nums" dir="ltr">
                  {order.total?.toFixed(2) ?? "0.00"} {t("currency") as string}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center text-sm text-muted-foreground print:block">
            <p className="font-medium text-black dark:text-white">{(t("app.name") as string) || "Dar Al Safwa"}</p>
            <p>{t("invoice.subtitle") as string}</p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media print {
          body {
            background: white;
            color: black;
          }
          .print\\:hidden {
            display: none !important;
          }
          nav, footer {
            display: none !important;
          }
        }
      `}</style>
    </main>
  );
};

export default InvoicePage;
