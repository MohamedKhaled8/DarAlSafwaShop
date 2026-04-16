import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck, XCircle, ArrowLeft, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByCustomer, Order } from "@/services/orderService";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  Pending: { label: "قيد المراجعة", color: "bg-amber-100 text-amber-800", icon: Clock },
  Processing: { label: "جاري التجهيز", color: "bg-blue-100 text-blue-800", icon: Package },
  Shipped: { label: "تم الشحن", color: "bg-purple-100 text-purple-800", icon: Truck },
  Delivered: { label: "تم التوصيل", color: "bg-emerald-100 text-emerald-800", icon: CheckCircle },
  Cancelled: { label: "ملغي", color: "bg-rose-100 text-rose-800", icon: XCircle },
};

const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const MyOrdersPage = () => {
  const { user } = useAuth();
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

    fetchOrders();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <main className="section-padding py-10 lg:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">طلباتي</h1>
            <p className="text-slate-500 font-medium">تابع حالة طلباتك ومشترياتك السابقة</p>
          </div>
          <Link to="/" className="flex items-center gap-2 text-primary font-bold hover:bg-primary/5 px-4 py-2 rounded-xl transition-colors">
             العودة للمتجر <ChevronLeft className="w-5 h-5" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-12 text-center shadow-sm border border-slate-100">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-slate-300" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">لا توجد طلبات بعد</h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">لم تقم بشراء أي منتجات حتى الآن. ابدأ بتصفح منتجاتنا المميزة وضع طلبك الأول!</p>
            <Link to="/" className="inline-flex items-center justify-center bg-slate-900 text-white font-bold px-8 py-4 rounded-xl hover:bg-primary transition-colors">
              تصفح المنتجات
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const status = statusConfig[order.status] || statusConfig.Pending;
              const StatusIcon = status.icon;

              return (
                <motion.div 
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl md:rounded-[24px] p-6 lg:p-8 flex flex-col md:flex-row gap-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow"
                >
                  <div className="flex-1 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="space-y-1">
                        <span className="text-sm text-slate-500 font-medium">رقم الطلب</span>
                        <p className="text-lg font-mono font-bold text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</p>
                      </div>
                      <div className="space-y-1 text-right">
                        <span className="text-sm text-slate-500 font-medium">تاريخ الطلب</span>
                        <p className="font-semibold text-slate-800">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${status.color}`}>
                        <StatusIcon className="w-5 h-5" />
                        {status.label}
                      </div>
                      {order.paymentStatus === "Paid" && (
                        <Badge variant="default" className="px-3 py-1.5 text-xs">تم الدفع</Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                       {order.items.slice(0, 4).map((item, i) => (
                         <div key={i} className="relative group">
                           <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-slate-100 bg-slate-50" />
                           <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                             {item.quantity}
                           </div>
                         </div>
                       ))}
                       {order.items.length > 4 && (
                         <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm">
                           +{order.items.length - 4}
                         </div>
                       )}
                    </div>
                  </div>

                  <div className="md:w-64 min-w-[250px] bg-slate-50 rounded-2xl p-6 flex flex-col justify-center">
                    <span className="text-slate-500 font-medium mb-1">الإجمالي</span>
                    <p className="text-3xl font-black text-slate-900 mb-4">{order.total.toFixed(2)} <span className="text-sm text-primary">ج.م</span></p>
                    
                    <Link to={`/invoice/${order.id}`} className="w-full inline-flex items-center justify-center bg-white border-2 border-slate-200 text-slate-900 font-bold py-3 rounded-xl hover:border-primary hover:text-primary transition-all">
                      عرض الفاتورة
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrdersPage;
