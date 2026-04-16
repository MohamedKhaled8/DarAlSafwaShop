import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Eye, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProductManagement, useCategories } from "@/hooks/useProducts";
import { Product } from "@/services/productService";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadToCloudinary } from "@/utils/cloudinary";

interface ProductEntry {
  localId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  description: string;
  specs: Record<string, string>;
  inStock: boolean;
  isFlashSale: boolean;
  collapsed: boolean;
}

const makeNewEntry = (): ProductEntry => ({
  localId: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  name: "",
  price: 0,
  originalPrice: 0,
  image: "",
  images: [],
  category: "",
  rating: 4.5,
  reviews: 0,
  description: "",
  specs: {},
  inStock: true,
  isFlashSale: false,
  collapsed: false,
});

const ProductsManagement = () => {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editFormData, setEditFormData] = useState<ProductEntry>(makeNewEntry());
  const [productEntries, setProductEntries] = useState<ProductEntry[]>([makeNewEntry()]);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const { products, loading, actionLoading, addProduct, editProduct, removeProduct } = useProductManagement();
  const { categories } = useCategories();

  // ── Image upload ──
  const handleImageUpload = async (entryLocalId: string, files: FileList | null, isEdit: boolean) => {
    const fileArray = Array.from(files || []);
    if (fileArray.length === 0) return;

    try {
      setUploadingFor(entryLocalId);
      const toastId = toast.loading(`جاري رفع ${fileArray.length} صورة...`);

      const uploadedUrls: string[] = [];
      for (const file of fileArray) {
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
      }

      if (isEdit) {
        setEditFormData(prev => ({
          ...prev,
          image: prev.image || uploadedUrls[0],
          images: [...prev.images, ...uploadedUrls],
        }));
      } else {
        setProductEntries(prev => prev.map(e =>
          e.localId === entryLocalId
            ? { ...e, image: e.image || uploadedUrls[0], images: [...e.images, ...uploadedUrls] }
            : e
        ));
      }
      toast.success("تم رفع الصور بنجاح!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "فشل رفع الصور");
    } finally {
      setUploadingFor(null);
    }
  };

  const updateEntry = (localId: string, updates: Partial<ProductEntry>) => {
    setProductEntries(prev => prev.map(e => e.localId === localId ? { ...e, ...updates } : e));
  };

  const removeEntry = (localId: string) => {
    setProductEntries(prev => prev.length <= 1 ? prev : prev.filter(e => e.localId !== localId));
  };

  const removeImage = (localId: string, imgIdx: number, isEdit: boolean) => {
    if (isEdit) {
      const removedImg = editFormData.images[imgIdx];
      const newImages = editFormData.images.filter((_, i) => i !== imgIdx);
      setEditFormData(prev => ({
        ...prev,
        images: newImages,
        image: prev.image === removedImg ? (newImages[0] || "") : prev.image,
      }));
    } else {
      setProductEntries(prev => prev.map(e => {
        if (e.localId !== localId) return e;
        const removedImg = e.images[imgIdx];
        const newImages = e.images.filter((_, i) => i !== imgIdx);
        return {
          ...e,
          images: newImages,
          image: e.image === removedImg ? (newImages[0] || "") : e.image,
        };
      }));
    }
  };

  // ── Filtering ──
  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProductEntries([makeNewEntry()]);
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setEditFormData({
      localId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice || 0,
      image: product.image,
      images: product.images || [],
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
      description: product.description,
      specs: { ...product.specs },
      inStock: product.inStock,
      isFlashSale: product.isFlashSale || false,
      collapsed: false,
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
    setProductEntries([makeNewEntry()]);
  };

  // ── Submit ──
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingProduct) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { localId, collapsed, ...data } = editFormData;
        await editProduct(editingProduct.id, {
          ...data,
          originalPrice: data.originalPrice > 0 ? data.originalPrice : undefined,
        });
        toast.success("تم تحديث المنتج بنجاح");
        handleClose();
      } else {
        const validEntries = productEntries.filter(e => e.name.trim() && e.price > 0);
        if (validEntries.length === 0) {
          toast.error("يرجى إدخال اسم وسعر لمنتج واحد على الأقل");
          setSaving(false);
          return;
        }

        let successCount = 0;
        for (const entry of validEntries) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { localId, collapsed, ...data } = entry;
          try {
            await addProduct({
              ...data,
              originalPrice: data.originalPrice > 0 ? data.originalPrice : undefined,
            });
            successCount++;
          } catch (err) {
            console.error("فشل إضافة:", entry.name, err);
          }
        }

        if (successCount > 0) toast.success(`تم إضافة ${successCount} منتج بنجاح!`);
        if (successCount < validEntries.length) toast.error(`فشل في إضافة ${validEntries.length - successCount} منتج`);
        handleClose();
      }
    } catch (error: any) {
      toast.error(error.message || "فشل في حفظ المنتج");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("حذف هذا المنتج؟")) return;
    try {
      await removeProduct(productId);
      toast.success("تم حذف المنتج بنجاح");
    } catch (error: any) {
      toast.error(error.message || "فشل في حذف المنتج");
    }
  };

  // ── Render a single product entry ──
  const renderEntryForm = (entry: ProductEntry, index: number, isEdit: boolean) => {
    const data = isEdit ? editFormData : entry;
    const setData = (updates: Partial<ProductEntry>) => {
      if (isEdit) setEditFormData(prev => ({ ...prev, ...updates }));
      else updateEntry(entry.localId, updates);
    };

    return (
      <div
        key={entry.localId}
        className={`space-y-4 ${!isEdit && productEntries.length > 1 ? 'p-5 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50/50 dark:bg-slate-900/30' : ''}`}
      >
        {/* Collapsible header for multi-entry */}
        {!isEdit && productEntries.length > 1 && (
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-300"
              onClick={() => updateEntry(entry.localId, { collapsed: !data.collapsed })}
            >
              {data.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              منتج {index + 1}{data.name ? `: ${data.name}` : ""}
            </button>
            <button
              type="button"
              onClick={() => removeEntry(entry.localId)}
              className="text-rose-500 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        {!data.collapsed && (
          <>
            <Input placeholder="اسم المنتج" value={data.name} onChange={e => setData({ name: e.target.value })} required={index === 0} />
            <div className="grid grid-cols-2 gap-3">
              <Input placeholder="السعر" type="number" step="0.01" value={data.price || ""} onChange={e => setData({ price: parseFloat(e.target.value) || 0 })} required={index === 0} />
              <Input placeholder="السعر قبل الخصم (اختياري)" type="number" step="0.01" value={data.originalPrice || ""} onChange={e => setData({ originalPrice: parseFloat(e.target.value) || 0 })} />
            </div>
            <Select value={data.category} onValueChange={value => setData({ category: value })}>
              <SelectTrigger><SelectValue placeholder="اختر القسم" /></SelectTrigger>
              <SelectContent>
                {categories && categories.filter(c => c && c.id).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name || "بدون اسم"}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Images */}
            <div className="space-y-2">
              <p className="text-sm font-medium">صور المنتج</p>
              <div className="flex gap-2 items-center">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={e => { handleImageUpload(entry.localId, e.target.files, isEdit); e.target.value = ""; }}
                  className="flex-1 cursor-pointer"
                  disabled={uploadingFor === entry.localId}
                />
                {uploadingFor === entry.localId && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground shrink-0" />}
              </div>
              {data.images.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {data.images.map((img, idx) => (
                    <div key={idx} className="relative inline-block">
                      <img
                        src={img}
                        alt={`صورة ${idx + 1}`}
                        className={`w-16 h-16 object-cover border shadow-sm rounded-lg cursor-pointer ${data.image === img ? "border-primary ring-2 ring-primary" : "border-slate-300 opacity-60 hover:opacity-100"}`}
                        onClick={() => setData({ image: img })}
                        title="اضغط لجعلها الصورة الرئيسية"
                      />
                      <button type="button" onClick={() => removeImage(entry.localId, idx, isEdit)} className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 shadow-md transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <textarea className="min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm" placeholder="الوصف" value={data.description} onChange={e => setData({ description: e.target.value })} />

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={data.inStock} onChange={e => setData({ inStock: e.target.checked })} className="rounded" />
                متوفر
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer text-orange-600">
                <input type="checkbox" checked={data.isFlashSale} onChange={e => setData({ isFlashSale: e.target.checked })} className="rounded text-orange-500" />
                عرض فلاش
              </label>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t("adminProducts.title") as string}</h1>
          <p className="text-sm text-muted-foreground">{products.length} {t("adminProducts.subtitle") as string}</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4" /> إضافة منتج
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "تعديل منتج" : `إضافة منتجات (${productEntries.length})`}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              {editingProduct ? (
                renderEntryForm(editFormData, 0, true)
              ) : (
                <>
                  {productEntries.map((entry, idx) => renderEntryForm(entry, idx, false))}
                  <button
                    type="button"
                    onClick={() => setProductEntries(prev => [...prev.map(e => ({ ...e, collapsed: true })), makeNewEntry()])}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-sm font-bold text-slate-500 hover:text-primary hover:border-primary transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    إضافة منتج آخر
                  </button>
                </>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button className="rounded-xl" variant="outline" type="button" onClick={handleClose}>إلغاء</Button>
                <Button className="rounded-xl" type="submit" disabled={saving || uploadingFor !== null}>
                  {saving ? (
                    <><Loader2 className="w-4 h-4 ml-2 animate-spin" /> جاري الحفظ...</>
                  ) : editingProduct ? (
                    "حفظ التعديلات"
                  ) : productEntries.length > 1 ? (
                    `حفظ ${productEntries.length} منتجات`
                  ) : (
                    "حفظ المنتج"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="البحث في المنتجات..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 bg-secondary/50 border-0 rounded-lg" />
            </div>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger className="w-full sm:w-[180px] rounded-lg">
                <Filter className="w-4 h-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                {categories && categories.filter(c => c && c.id).map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name || "Unnamed"}</SelectItem>
                ))}
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
                    <TableHead>المنتج</TableHead>
                    <TableHead className="hidden md:table-cell">القسم</TableHead>
                    <TableHead>السعر</TableHead>
                    <TableHead className="hidden sm:table-cell">التقييم</TableHead>
                    <TableHead className="hidden md:table-cell">المخزون</TableHead>
                    <TableHead className="w-10" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(p => (
                    <TableRow key={p.id} className="group">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate max-w-[200px]">{p.name}</p>
                            {p.badge && <Badge variant="secondary" className="text-[10px] mt-0.5">{p.badge}</Badge>}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-muted-foreground capitalize">{p.category}</TableCell>
                      <TableCell>
                        <span className="text-sm font-semibold">{p.price.toFixed(2)} {t("currency") as string}</span>
                        {p.originalPrice && <span className="text-xs text-muted-foreground line-through ml-1">{p.originalPrice.toFixed(2)} {t("currency") as string}</span>}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm">⭐ {p.rating}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={p.inStock ? "default" : "destructive"} className="text-[10px]">
                          {p.inStock ? "متوفر" : "غير متوفر"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity"><MoreHorizontal className="w-4 h-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/product/${p.id}`} target="_blank" className="flex items-center">
                                <Eye className="w-4 h-4 mr-2" /> عرض
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(p)}>
                              <Edit className="w-4 h-4 mr-2" /> تعديل
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(p.id)}>
                              <Trash2 className="w-4 h-4 mr-2" /> حذف
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {filtered.length === 0 && !loading && (
            <div className="text-center py-12 text-muted-foreground text-sm">لم يتم العثور على منتجات</div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductsManagement;
