import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Loader2, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCategories, useCategoryManagement } from "@/hooks/useProducts";
import { createCategory, updateCategory, deleteCategory } from "@/services/productService";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { uploadToCloudinary } from "@/utils/cloudinary";

const CategoriesManagement = () => {
  const { t } = useLanguage();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", icon: "", image: "" });
  const [actionLoading, setActionLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const { categories, loading, refetch } = useCategories();

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: "", icon: "", image: "" });
    setDialogOpen(true);
  };

  const handleOpenEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || "",
      image: category.image || "",
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", icon: "", image: "" });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const toastId = toast.loading("جاري رفع الصورة...");
      const secureUrl = await uploadToCloudinary(file);
      setFormData(prev => ({ ...prev, image: secureUrl }));
      toast.success("تم رفع الصورة بنجاح!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error(t("adminCategories.categoryName") + " " + t("error.nameRequired"));
      return;
    }

    try {
      setActionLoading(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, {
          name: formData.name,
          icon: formData.icon,
          image: formData.image,
        });
        toast.success(t("adminCategories.categoryUpdated") as string);
      } else {
        await createCategory({
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-\u0600-\u06FF]/g, ''),
          icon: "Package",
          image: formData.image || "",
          count: 0,
        });
        toast.success(t("adminCategories.categoryAdded") as string || "تم إضافة القسم بنجاح");
      }
      await refetch();
      handleClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save category");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm(t("adminCategories.delete") as string + "?")) return;
    try {
      await deleteCategory(categoryId);
      await refetch();
      toast.success(t("adminCategories.categoryDeleted") as string);
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{t("adminCategories.title") as string}</h1>
          <p className="text-sm text-muted-foreground">
            {loading ? t("loading") as string : `${categories.length} ${t("admin.categories") as string}`}
          </p>
        </div>
        <Button className="gap-2 rounded-xl" onClick={handleOpenAdd}>
          <Plus className="w-4 h-4" /> {t("adminCategories.addCategory") as string}
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div>
          {!loading && categories.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>{t("adminCategories.noCategories") as string}</p>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.filter(c => c && c.id).map((c, i) => (
                <motion.div 
                  key={c.id} 
                  initial={{ opacity: 0, y: 16 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden group hover:shadow-md transition-shadow">
                    <div className="relative h-32 overflow-hidden bg-muted">
                      {c.image ? (
                        <img 
                          src={c.image} 
                          alt={c.name || t("adminCategories.category") as string} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <h3 className="text-white font-semibold text-sm">{c.name || t("common.nA") as string}</h3>
                        <p className="text-white/70 text-xs">{c.count || 0} {t("adminProducts.subtitle") as string}</p>
                      </div>
                    </div>
                    <CardContent className="p-3 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">ID: {c.id}</span>
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-7 h-7" 
                          onClick={() => handleOpenEdit(c)}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="w-7 h-7 text-destructive" 
                          onClick={() => handleDelete(c.id)}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? t("adminCategories.editCategory") as string : t("adminCategories.addNewCategory") as string}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">{t("adminCategories.categoryName") as string} *</label>
              <Input 
                placeholder={t("adminProducts.productName") as string} 
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <p className="text-sm font-medium mb-1.5 block">{t("adminProducts.imageUrl") as string || "صورة القسم"}</p>
              <div className="flex gap-2 items-center">
                <Input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1 cursor-pointer"
                  disabled={uploadingImage}
                />
                {uploadingImage && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground shrink-0" />}
              </div>
              {formData.image && (
                <div className="relative inline-block mt-3">
                  <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-slate-200 shadow-sm" />
                  <button 
                    type="button" 
                    onClick={() => setFormData({...formData, image: ""})}
                    className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1 shadow-md transition-colors"
                  >
                    <span className="sr-only">Remove</span>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            <Button 
              className="rounded-xl mt-2" 
              type="submit"
              disabled={actionLoading || uploadingImage}
            >
              {actionLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("adminProducts.saving") as string}
                </>
              ) : (
                t("adminCategories.addCategory") as string
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CategoriesManagement;
