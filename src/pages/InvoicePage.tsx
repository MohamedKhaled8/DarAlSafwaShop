import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Printer, ArrowLeft, ExternalLink } from "lucide-react";
import { getOrderById, type Order } from "@/services/orderService";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatFirestoreDate } from "@/lib/firestoreDate";
import { localizedOrderStatus } from "@/lib/orderLabels";

const InvoicePage = () => {
  const { id } = useParams();
  const { t, language, isRTL } = useLanguage();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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

  const deliveryLabel = (method: string | undefined, gov: string | null | undefined) => {
    const g = gov ? ` (${gov})` : "";
    if (method === "pickup") return `${t("checkout.pickupTitle") as string}${g}`;
    if (method === "shipping") return `${t("checkout.shippingTitle") as string}${g}`;
    return method ? `${method}${g}` : "—";
  };

  const payMethodLabel = (m: string | undefined) => {
    if (!m) return "—";
    if (m === "vodafone") return t("checkout.vodafoneCash") as string;
    if (m === "instapay") return t("checkout.instapay") as string;
    return m;
  };

  const payStatusLabel = (s: string | undefined) => {
    if (!s) return "—";
    if (s === "Pending") return language === "ar" ? "بانتظار الدفع" : "Payment pending";
    if (s === "Paid") return t("orders.paid") as string;
    if (s === "Refunded") return language === "ar" ? "مسترد" : "Refunded";
    if (s === "Failed") return language === "ar" ? "فشل" : "Failed";
    return s;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        {t("loading") as string}
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
        <h1 className="mb-4 text-2xl font-bold">{language === "ar" ? "الطلب غير موجود" : "Order not found"}</h1>
        <Link to="/">
          <Button variant="outline">{language === "ar" ? "العودة للرئيسية" : "Back home"}</Button>
        </Link>
      </div>
    );
  }

  const dateStr = formatFirestoreDate(order.createdAt, language);
  const email = order.email || "";

  return (
    <main
      className="min-h-screen bg-gray-50 py-10 section-padding lg:py-16 dark:bg-gray-900/40"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">
            <ArrowLeft className={`h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            {language === "ar" ? "المتجر" : "Store"}
          </Link>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2 print:hidden" variant="outline" type="button">
              <Printer className="h-4 w-4" /> {language === "ar" ? "طباعة" : "Print"}
            </Button>
            <Button onClick={handlePrint} className="gap-2 print:hidden" type="button">
              <Download className="h-4 w-4" /> PDF
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-12 dark:border-gray-800 dark:bg-gray-950"
        >
          <div className="mb-8 flex flex-col items-center border-b border-gray-100 pb-8 text-center text-black dark:text-white">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-3xl font-bold">{language === "ar" ? "تم تأكيد الطلب" : "Order confirmed"}</h1>
            <p className="text-muted-foreground">
              {language === "ar" ? "شكراً لشرائك. أدناه تفاصيل الفاتورة." : "Thank you. Invoice details below."}
            </p>
          </div>

          <div className="mb-8 grid gap-8 text-black md:grid-cols-2 dark:text-white">
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {language === "ar" ? "بيانات العميل" : "Customer"}
              </h3>
              <p className="text-lg font-medium">{order.customerName}</p>
              <p className="text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
              {order.altPhone ? (
                <p className="text-gray-600 dark:text-gray-400">
                  {language === "ar" ? "هاتف بديل: " : "Alt: "}
                  {order.altPhone}
                </p>
              ) : null}
              {email ? <p className="text-gray-600 dark:text-gray-400">{email}</p> : null}
              {order.nationalId ? (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {t("checkout.nationalId") as string}: <span dir="ltr">{order.nationalId}</span>
                </p>
              ) : null}
            </div>
            <div className="md:text-end">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                {language === "ar" ? "تفاصيل الفاتورة" : "Invoice details"}
              </h3>
              <p className="font-medium">
                {language === "ar" ? "رقم الطلب: " : "Order ID: "}
                <span className="font-normal text-gray-600 dark:text-gray-300" dir="ltr">
                  #{order.id?.slice(0, 10)}
                </span>
              </p>
              <p className="font-medium">
                {language === "ar" ? "التاريخ: " : "Date: "}
                <span className="font-normal text-gray-600 dark:text-gray-300">{dateStr}</span>
              </p>
              <p className="font-medium">
                {language === "ar" ? "الاستلام: " : "Delivery: "}
                <span className="font-normal text-gray-600 dark:text-gray-300">
                  {deliveryLabel(order.deliveryMethod, order.governorate ?? null)}
                </span>
              </p>
              <p className="font-medium">
                {language === "ar" ? "الدفع: " : "Payment: "}
                <span className="font-normal text-gray-600 dark:text-gray-300">{payMethodLabel(order.paymentMethod)}</span>
              </p>
              <p className="font-medium">
                {language === "ar" ? "حالة الدفع: " : "Payment status: "}
                <span className="font-normal text-gray-600 dark:text-gray-300">{payStatusLabel(order.paymentStatus)}</span>
              </p>
              <p className="font-medium">
                {language === "ar" ? "حالة الطلب: " : "Order status: "}
                <span className="font-normal text-gray-600 dark:text-gray-300">
                  {localizedOrderStatus(order.status, t)}
                </span>
              </p>
              {order.receiptImage ? (
                <p className="mt-2">
                  <a
                    href={order.receiptImage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                  >
                    {language === "ar" ? "إيصال الدفع" : "Payment receipt"} <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </p>
              ) : null}
            </div>
          </div>

          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 text-black dark:border-gray-800 dark:text-white">
            <table className="w-full text-start">
              <thead className="border-b border-gray-200 bg-gray-50 text-sm font-semibold text-muted-foreground dark:border-gray-800 dark:bg-gray-900">
                <tr>
                  <th className="px-6 py-3">{language === "ar" ? "الصنف" : "Item"}</th>
                  <th className="px-6 py-3 text-center">{language === "ar" ? "الكمية" : "Qty"}</th>
                  <th className="px-6 py-3 text-end">{language === "ar" ? "السعر" : "Price"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {order.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        {item.image ? (
                          <img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-lg border object-cover" />
                        ) : null}
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.variantId ? (
                            <p className="mt-0.5 whitespace-pre-wrap text-xs text-muted-foreground">{item.variantId}</p>
                          ) : null}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-end tabular-nums" dir="ltr">
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
                <span className="text-muted-foreground">{t("checkout.subtotal") as string}</span>
                <span className="tabular-nums" dir="ltr">
                  {order.subtotal?.toFixed(2)} {t("currency") as string}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t("checkout.shipping") as string}</span>
                <span className="tabular-nums" dir="ltr">
                  {order.shippingFee
                    ? `${order.shippingFee.toFixed(2)} ${t("currency") as string}`
                    : (t("checkout.shippingFreePickup") as string)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-xl font-bold text-primary dark:border-gray-800">
                <span>{t("checkout.total") as string}</span>
                <span className="tabular-nums" dir="ltr">
                  {order.total?.toFixed(2)} {t("currency") as string}
                </span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8 text-center text-sm text-muted-foreground print:block">
            <p className="font-medium text-black dark:text-white">{t("app.name") as string}</p>
            <p>{language === "ar" ? "شكراً لتسوقكم معنا." : "Thanks for shopping with us."}</p>
          </div>
        </motion.div>
      </div>

      <style>{`
        @media print {
          body { background: white; color: black; }
          .print\\:hidden { display: none !important; }
          nav, footer { display: none !important; }
        }
      `}</style>
    </main>
  );
};

export default InvoicePage;
