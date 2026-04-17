import { useState } from "react";
import { motion } from "framer-motion";
import { Printer, FileText, Clock, DollarSign, MoreHorizontal, Loader2, Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePrintOrderManagement, usePrintOrderStats } from "@/hooks/usePrintOrders";
import { type PrintOrder, type PrintOrderStatus } from "@/services/printService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import PrintPricingSettings from "@/pages/admin/PrintPricingSettings";

const statusColor: Record<PrintOrderStatus, string> = {
  Printing: "bg-blue-500/10 text-blue-600",
  Ready: "bg-primary/10 text-primary",
  Completed: "bg-muted text-muted-foreground",
  Pending: "bg-amber-500/10 text-amber-600",
  Cancelled: "bg-destructive/10 text-destructive",
};

const AdminPrintingPage = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PrintOrder | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { orders, loading, actionLoading, changeOrderStatus, removeOrder } = usePrintOrderManagement();
  const { stats } = usePrintOrderStats();

  const filtered = orders.filter(o => 
    o.fileName?.toLowerCase().includes(search.toLowerCase()) ||
    o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    o.id?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (orderId: string, newStatus: PrintOrderStatus) => {
    try {
      await changeOrderStatus(orderId, newStatus);
      toast.success(t("adminPrinting.statusUpdated") as string);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm(t("adminPrinting.delete") as string + "?")) return;
    try {
      await removeOrder(orderId);
      toast.success(t("adminPrinting.orderDeleted") as string);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete print order");
    }
  };

  const viewOrder = (order: PrintOrder) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return t("common.nA") as string;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const statCards = [
    { label: t("adminPrinting.activeJobs") as string, value: stats.printing + stats.pending, icon: Printer },
    { label: t("adminPrinting.todaysRevenue") as string, value: `${stats.todayRevenue.toFixed(0)} ${t("currency")}`, icon: DollarSign },
    { label: t("adminPrinting.completed") as string, value: stats.completed, icon: FileText },
    { label: t("adminPrinting.pending") as string, value: stats.pending, icon: Clock },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adminPrinting.title") as string}</h1>
        <p className="text-sm text-muted-foreground">{t("adminPrinting.subtitle") as string}</p>
      </div>

      <PrintPricingSettings />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder={t("adminPrinting.search") as string} 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-9 bg-secondary/50 border-0 rounded-lg" 
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0 overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("adminPrinting.order") as string}</TableHead>
                  <TableHead>{t("adminPrinting.file") as string}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("adminPrinting.sizeType") as string}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("adminPrinting.copies") as string}</TableHead>
                  <TableHead>{t("adminPrinting.status") as string}</TableHead>
                  <TableHead>{t("adminPrinting.total") as string}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(o => (
                  <TableRow key={o.id}>
                    <TableCell>
                      <p className="text-sm font-medium">{o.id}</p>
                      <p className="text-xs text-muted-foreground">{o.customerName}</p>
                    </TableCell>
                    <TableCell className="text-sm">{o.fileName}</TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{o.size} · {o.color}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm">{o.copies}</TableCell>
                    <TableCell>
                      <Badge className={`text-[10px] ${statusColor[o.status]}`} variant="secondary">{o.status}</Badge>
                    </TableCell>
                    <TableCell className="text-sm font-semibold">{o.total?.toFixed(2) || "0.00"} {t("currency") as string}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={actionLoading}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewOrder(o)}>
                            <Eye className="w-4 h-4 mr-2" /> {t("adminPrinting.viewDetails") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(o.id, "Printing")} disabled={o.status === "Printing" || o.status === "Cancelled"}>
                            <Printer className="w-4 h-4 mr-2" /> {t("adminPrinting.markPrinting") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(o.id, "Ready")} disabled={o.status === "Ready" || o.status === "Cancelled"}>
                            <CheckCircle className="w-4 h-4 mr-2" /> {t("adminPrinting.markReady") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(o.id, "Completed")} disabled={o.status === "Completed" || o.status === "Cancelled"}>
                            <CheckCircle className="w-4 h-4 mr-2" /> {t("adminPrinting.markCompleted") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(o.id)}>
                            <XCircle className="w-4 h-4 mr-2" /> {t("adminPrinting.delete") as string}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {!loading && filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground text-sm">
              {search ? t("adminPrinting.noOrdersSearch") as string : t("adminPrinting.noOrders") as string}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("adminPrinting.orderDetails") as string} - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{t("adminPrinting.status") as string}</span>
                <Badge className={statusColor[selectedOrder.status]}>{selectedOrder.status}</Badge>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{t("adminPrinting.date") as string}</span>
                <span className="text-sm font-medium">{formatDate(selectedOrder.createdAt)}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/50">
                <span className="text-sm text-muted-foreground">{t("adminPrinting.total") as string}</span>
                <span className="text-lg font-bold">{selectedOrder.total?.toFixed(2)} {t("currency") as string}</span>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">{t("adminPrinting.customer") as string}</h4>
                <p className="text-sm">{selectedOrder.customerName}</p>
                <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">{t("adminPrinting.printDetails") as string}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPrinting.file") as string}</span>
                    <span>{selectedOrder.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("printing.size") as string}</span>
                    <span>{selectedOrder.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPrinting.copies") as string}</span>
                    <span>{selectedOrder.copies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("printing.printType") as string}</span>
                    <span>{selectedOrder.color}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPrinting.paper") as string}</span>
                    <span>{selectedOrder.paperType || "Standard"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminPrinting.doubleSided") as string}</span>
                    <span>{selectedOrder.doubleSided ? t("adminGifts.yes") as string : t("adminGifts.no") as string}</span>
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">{t("adminPrinting.notes") as string}</h4>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AdminPrintingPage;
