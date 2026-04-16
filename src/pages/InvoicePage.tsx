import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Printer, ArrowLeft } from "lucide-react";
import { getOrderById } from "@/services/orderService";
import { Button } from "@/components/ui/button";

const InvoicePage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
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
    fetchOrder();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading Invoice...</div>;
  }

  if (!order) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <Link to="/">
          <Button variant="outline">Return Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <main className="section-padding py-10 lg:py-16 bg-gray-50 dark:bg-gray-900/40 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6 flex justify-between items-center print:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-primary font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Store
          </Link>
          <div className="flex gap-2">
            <Button onClick={handlePrint} className="gap-2 print:hidden" variant="outline">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button onClick={handlePrint} className="gap-2 print:hidden">
              <Download className="w-4 h-4" /> Save as PDF
            </Button>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-950 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-sm"
        >
          {/* Header */}
          <div className="flex flex-col items-center text-center border-b border-gray-100 pb-8 mb-8 text-black dark:text-white">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground">Thank you for your purchase. Here is your invoice.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-8 text-black dark:text-white">
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Billed To</h3>
              <p className="font-medium text-lg">{order.customerName}</p>
              <p className="text-gray-600 dark:text-gray-400">{order.customerPhone}</p>
              {order.customerEmail && <p className="text-gray-600 dark:text-gray-400">{order.customerEmail}</p>}
            </div>
            <div className="md:text-right">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">Invoice Details</h3>
              <p className="font-medium">Order ID: <span className="text-gray-600 dark:text-gray-300 font-normal">#{order.id?.slice(0, 8)}</span></p>
              <p className="font-medium">Date: <span className="text-gray-600 dark:text-gray-300 font-normal">{new Date(order.createdAt).toLocaleDateString()}</span></p>
              <p className="font-medium">Delivery: <span className="text-gray-600 dark:text-gray-300 font-normal capitalize">{order.deliveryMethod} {order.governorate ? `(${order.governorate})` : ''}</span></p>
            </div>
          </div>

          <div className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden mb-8 text-black dark:text-white">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 text-sm font-semibold text-muted-foreground">
                <tr>
                  <th className="px-6 py-3">Item</th>
                  <th className="px-6 py-3 text-center">Qty</th>
                  <th className="px-6 py-3 text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {order.items?.map((item: any, i: number) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <p className="font-medium">{item.name}</p>
                      {item.variantId && <p className="text-xs text-muted-foreground whitespace-pre-wrap">{item.variantId}</p>}
                    </td>
                    <td className="px-6 py-4 text-center">{item.quantity}</td>
                    <td className="px-6 py-4 text-right">{(item.price * item.quantity).toFixed(2)} EGP</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-end mb-8 text-black dark:text-white">
            <div className="w-full md:w-1/2 space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{order.subtotal?.toFixed(2)} EGP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping Fee</span>
                <span>{order.shippingFee ? `${order.shippingFee.toFixed(2)} EGP` : 'Free'}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-3 flex font-bold text-xl text-primary">
                <span>Total</span>
                <span>{order.total?.toFixed(2)} EGP</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground border-t border-gray-100 pt-8 print:block">
            <p className="font-medium text-black dark:text-white">Shop Vibe Store</p>
            <p>Thank you for shopping with us!</p>
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
