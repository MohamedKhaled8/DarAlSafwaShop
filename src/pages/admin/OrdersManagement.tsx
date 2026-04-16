import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, Eye, Package, Truck, CheckCircle, Clock, XCircle, MoreHorizontal, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useOrderManagement, useOrderStats } from "@/hooks/useOrders";
import { type Order, type OrderStatus, updateOrder } from "@/services/orderService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const statusConfig: Record<OrderStatus, { icon: React.ElementType; color: string; label: string }> = {
  Delivered: { icon: CheckCircle, color: "bg-primary/10 text-primary", label: "Delivered" },
  Shipped: { icon: Truck, color: "bg-blue-500/10 text-blue-600", label: "Shipped" },
  Processing: { icon: Package, color: "bg-accent/20 text-accent-foreground", label: "Processing" },
  Pending: { icon: Clock, color: "bg-muted text-muted-foreground", label: "Pending" },
  Cancelled: { icon: XCircle, color: "bg-destructive/10 text-destructive", label: "Cancelled" },
};

const OrdersManagement = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { orders, loading, actionLoading, changeOrderStatus, removeOrder, refresh } = useOrderManagement();
  const { stats } = useOrderStats();

  const filtered = orders.filter(o => {
    const matchSearch = o.id?.toLowerCase().includes(search.toLowerCase()) || 
                       o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                       o.email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const summaryStats = [
    { label: t("adminOrders.allStatus") as string, count: stats.total, color: "bg-secondary" },
    { label: t("adminOverview.processing") as string, count: stats.processing, color: "bg-accent/20" },
    { label: t("adminOverview.shipped") as string, count: stats.shipped, color: "bg-blue-500/10" },
    { label: t("adminOverview.delivered") as string, count: stats.delivered, color: "bg-primary/10" },
  ];

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await changeOrderStatus(orderId, newStatus);
      toast.success(t("adminOrders.orderStatusUpdated") as string);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleApproveOrder = async (orderId: string) => {
    try {
      await updateOrder(orderId, {
        paymentStatus: "Paid",
        status: "Processing"
      });
      toast.success("تم تأكيد عملية الدفع والموافقة على الطلب بنجاح");
      setDialogOpen(false);
      refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to approve order");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm(t("adminOrders.delete") as string + "?")) return;
    try {
      await removeOrder(orderId);
      toast.success(t("adminOrders.orderDeleted") as string);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete order");
    }
  };

  const viewOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return t("common.nA") as string;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adminOrders.title") as string}</h1>
        <p className="text-sm text-muted-foreground">{t("adminOrders.subtitle") as string}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summaryStats.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t("adminOrders.search") as string} 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-9 bg-secondary/50 border-0 rounded-lg" 
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as OrderStatus | "all")}>
              <SelectTrigger className="w-full sm:w-[160px] rounded-lg"><SelectValue placeholder={t("adminOrders.allStatus") as string} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("adminOrders.allStatus") as string}</SelectItem>
                {Object.keys(statusConfig).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("adminOrders.orderId") as string}</TableHead>
                    <TableHead>{t("adminOrders.customer") as string}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t("adminOrders.date") as string}</TableHead>
                    <TableHead>{t("adminOrders.items") as string}</TableHead>
                    <TableHead>{t("adminOrders.total") as string}</TableHead>
                    <TableHead>{t("adminOrders.status") as string}</TableHead>
                    <TableHead className="hidden md:table-cell">{t("adminOrders.payment") as string}</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(o => {
                    const sc = statusConfig[o.status];
                    const Icon = sc.icon;
                    return (
                      <TableRow key={o.id}>
                        <TableCell className="font-medium text-sm font-mono text-primary">#{o.id.substring(0, 6).toUpperCase()}</TableCell>
                        <TableCell>
                          <p className="text-sm font-medium">{o.customerName}</p>
                          <p className="text-xs text-muted-foreground hidden md:block">{o.email}</p>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                          {formatDate(o.createdAt)}
                        </TableCell>
                        <TableCell className="text-sm max-w-[200px]">
                          <div className="truncate font-medium" title={o.items?.[0]?.name}>
                            {o.items?.[0]?.name || "N/A"}
                          </div>
                          {o.items && o.items.length > 1 && (
                            <span className="text-[11px] text-muted-foreground font-semibold inline-block mt-0.5 px-1.5 py-0.5 bg-secondary rounded-md">
                              (+ {o.items.length - 1} منتجات أخرى)
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm font-semibold tabular-nums">{o.total?.toFixed(2) || "0.00"} {t("currency") as string}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${sc.color}`}>
                            <Icon className="w-3 h-3" /> {o.status}
                          </span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant={o.paymentStatus === "Paid" ? "default" : o.paymentStatus === "Refunded" ? "destructive" : "secondary"} className="text-[10px]">
                            {o.paymentStatus}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" disabled={actionLoading}>
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="text-right">
                              <DropdownMenuItem onClick={() => viewOrder(o)} className="flex justify-end gap-2">
                                عرض التفاصيل <Eye className="w-4 h-4 ml-2" />
                              </DropdownMenuItem>
                              
                              {o.status === "Pending" && (
                                <DropdownMenuItem 
                                  onClick={() => handleApproveOrder(o.id)} 
                                  className="flex justify-end gap-2 text-emerald-600 focus:text-emerald-600 focus:bg-emerald-50 font-bold"
                                >
                                  موافقة وتأكيد <CheckCircle className="w-4 h-4 ml-2" />
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem onClick={() => handleStatusChange(o.id, "Processing")} disabled={o.status === "Processing" || o.status === "Cancelled"} className="flex justify-end gap-2">
                                جاري التجهيز <Package className="w-4 h-4 ml-2" />
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(o.id, "Shipped")} disabled={o.status === "Shipped" || o.status === "Delivered" || o.status === "Cancelled"} className="flex justify-end gap-2">
                                تم الشحن <Truck className="w-4 h-4 ml-2" />
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(o.id, "Delivered")} disabled={o.status === "Delivered" || o.status === "Cancelled"} className="flex justify-end gap-2">
                                تم التوصيل <CheckCircle className="w-4 h-4 ml-2" />
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="flex justify-end gap-2 text-destructive focus:text-destructive focus:bg-destructive/10" 
                                onClick={() => handleDelete(o.id)}
                                disabled={actionLoading}
                              >
                                حذف <XCircle className="w-4 h-4 ml-2" />
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {search || statusFilter !== "all" ? t("adminOrders.noOrdersMatch") as string : t("adminOrders.noOrdersFound") as string}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("adminOrders.orderDetails") as string} - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{t("adminOrders.status") as string}</span>
                <Badge className={statusConfig[selectedOrder.status].color}>
                  {selectedOrder.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{t("adminOrders.payment") as string}</span>
                <div className="flex gap-2 items-center">
                  {selectedOrder.paymentMethod && (
                    <Badge variant="outline" className="capitalize border-primary/50 text-primary">
                      {selectedOrder.paymentMethod}
                    </Badge>
                  )}
                  <Badge variant={selectedOrder.paymentStatus === "Paid" ? "default" : "secondary"}>
                    {selectedOrder.paymentStatus}
                  </Badge>
                </div>
              </div>

              {selectedOrder.receiptImage && (
                <div className="p-3 rounded-lg bg-secondary/30 border border-border">
                  <span className="text-sm font-semibold mb-2 block">إيصال الدفع (Receipt)</span>
                  <a href={selectedOrder.receiptImage} target="_blank" rel="noreferrer">
                    <img src={selectedOrder.receiptImage} alt="Receipt" className="max-w-full h-auto max-h-64 object-contain rounded-lg border shadow-sm hover:opacity-90 transition-opacity bg-white" />
                  </a>
                  <p className="text-xs text-muted-foreground mt-2">اضغط على الصورة لتكبيرها</p>
                  
                  {selectedOrder.status === "Pending" && (
                     <div className="mt-4 flex flex-col sm:flex-row gap-2">
                       <Button onClick={() => handleApproveOrder(selectedOrder.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white">
                         <CheckCircle className="w-4 h-4 mr-2 ml-2" /> تأكيد الدفع والموافقة على الطلب
                       </Button>
                       <Button variant="destructive" onClick={() => { handleStatusChange(selectedOrder.id, "Cancelled"); setDialogOpen(false); }}>
                         <XCircle className="w-4 h-4 mr-2 ml-2" /> رفض
                       </Button>
                     </div>
                  )}
                </div>
              )}
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{t("adminOrders.date") as string}</span>
                <span className="text-sm font-medium">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{t("adminOrders.total") as string}</span>
                <span className="text-lg font-bold">{selectedOrder.total?.toFixed(2)} {t("currency") as string}</span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">{t("adminOrders.customer") as string}</h4>
                <p className="text-sm">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">{t("adminOrders.items") as string}</h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 rounded bg-secondary/30">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{t("adminOrders.qty") as string}: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold">{(item.price * item.quantity).toFixed(2)} {t("currency") as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedOrder.deliveryMethod && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">{t("adminOrders.deliveryMethod") as string || "Delivery Method"}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrder.deliveryMethod === 'pickup' ? "Store Pickup" : "Delivery Shipping"}<br />
                    {selectedOrder.governorate && `Governorate: ${selectedOrder.governorate}`}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OrdersManagement;
