import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Mail, MoreHorizontal, Loader2, UserCog, Trash2, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserManagement, useUserStats } from "@/hooks/useUsers";
import { type User } from "@/services/userService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const CustomersPage = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const { users, loading, actionLoading, changeUserStatus, removeUser, refresh } = useUserManagement();
  const { stats } = useUserStats();

  const filtered = users.filter(c => 
    c.displayName?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const handleStatusChange = async (userId: string, newStatus: User["status"]) => {
    try {
      await changeUserStatus(userId, newStatus);
      toast.success(t("adminCustomers.statusUpdated") as string || `User status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm(t("adminCustomers.delete") as string + "?")) return;
    try {
      await removeUser(userId);
      toast.success(t("adminCustomers.userDeleted") as string);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const viewUser = (user: User) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return t("common.nA") as string;
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const getInitials = (name: string) => {
    return name?.split(" ").map(n => n[0]).join("").toUpperCase() || "?";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("admin.customers") as string}</h1>
        <p className="text-sm text-muted-foreground">
          {loading ? t("loading") as string : `${stats.total} ${t("admin.customers") as string}`}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: t("adminCustomers.total") as string, count: stats.total, color: "bg-secondary" },
          { label: t("adminCustomers.active") as string, count: stats.active, color: "bg-primary/10" },
          { label: t("adminCustomers.vip") as string, count: stats.vip, color: "bg-amber-500/10" },
          { label: t("adminCustomers.new") as string, count: stats.new, color: "bg-blue-500/10" },
        ].map(s => (
          <Card key={s.label as string}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{s.count}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder={t("adminCustomers.search") as string} 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-9 bg-secondary/50 border-0 rounded-lg" 
            />
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("adminCustomers.customer") as string}</TableHead>
                  <TableHead className="hidden sm:table-cell">{t("adminCustomers.orders") as string}</TableHead>
                  <TableHead>{t("adminCustomers.totalSpent") as string}</TableHead>
                  <TableHead className="hidden md:table-cell">{t("adminCustomers.joined") as string}</TableHead>
                  <TableHead>{t("adminCustomers.status") as string}</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(c => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={c.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.displayName}`} />
                          <AvatarFallback className="text-xs">{getInitials(c.displayName)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{c.displayName}</p>
                          <p className="text-xs text-muted-foreground hidden md:block">{c.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm">{c.ordersCount || 0}</TableCell>
                    <TableCell className="text-sm font-semibold tabular-nums">{t("currency") as string} {(c.totalSpent || 0).toFixed(2)}</TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {formatDate(c.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={c.status === "VIP" ? "default" : c.status === "Active" ? "secondary" : c.status === "New" ? "outline" : "destructive"} 
                        className="text-[10px]"
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" disabled={actionLoading}>
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => viewUser(c)}>
                            <UserCog className="w-4 h-4 mr-2" /> {t("adminCustomers.viewProfile") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(c.id, "Active")} disabled={c.status === "Active"}>
                            {t("adminCustomers.markActive") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(c.id, "VIP")} disabled={c.status === "VIP"}>
                            {t("adminCustomers.markVIP") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange(c.id, "Inactive")} disabled={c.status === "Inactive"}>
                            {t("adminCustomers.markInactive") as string}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(c.id)}>
                            <Trash2 className="w-4 h-4 mr-2" /> {t("adminCustomers.delete") as string}
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
              {search ? t("adminCustomers.noCustomersSearch") as string : t("adminCustomers.noCustomers") as string}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("adminCustomers.customerProfile") as string}</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedUser.displayName}`} />
                  <AvatarFallback className="text-lg">{getInitials(selectedUser.displayName)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedUser.displayName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                  <Badge className="mt-1" variant={selectedUser.status === "VIP" ? "default" : "secondary"}>
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/50 text-center">
                  <ShoppingBag className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xl font-bold">{selectedUser.ordersCount || 0}</p>
                  <p className="text-xs text-muted-foreground">{t("adminCustomers.orders") as string}</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary/50 text-center">
                  <Mail className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                  <p className="text-xl font-bold">{t("currency") as string} {(selectedUser.totalSpent || 0).toFixed(0)}</p>
                  <p className="text-xs text-muted-foreground">{t("adminCustomers.totalSpent") as string}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">{t("adminCustomers.accountInfo") as string}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminCustomers.memberSince") as string}</span>
                    <span>{formatDate(selectedUser.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminCustomers.lastLogin") as string}</span>
                    <span>{formatDate(selectedUser.lastLoginAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("adminCustomers.role") as string}</span>
                    <span className="capitalize">{selectedUser.role}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t("adminCustomers.phone") as string}</span>
                      <span>{selectedUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedUser.address && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-2">{t("adminCustomers.address") as string}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedUser.address.street}<br />
                    {selectedUser.address.city}, {selectedUser.address.state} {selectedUser.address.zip}<br />
                    {selectedUser.address.country}
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

export default CustomersPage;
