import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Loader2, CheckCircle, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { batchCreateProducts, createCategory } from "@/services/productService";
import { collection, getDocs, writeBatch, doc, setDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { seedCategories, seedProducts } from "@/data/seedData";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const SeedDataPage = () => {
  const { t } = useLanguage();
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [seeded, setSeeded] = useState(false);

  /* ── Clear ALL products & categories from Firestore ── */
  const handleClear = async () => {
    if (!confirm("هل أنت متأكد من حذف كل المنتجات والأقسام؟ لا يمكن التراجع!")) return;
    try {
      setClearing(true);

      // Delete products in chunks of 450
      const prodSnap = await getDocs(collection(db, "products"));
      const prodDocs = prodSnap.docs;
      for (let i = 0; i < prodDocs.length; i += 450) {
        const batch = writeBatch(db);
        prodDocs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }

      // Delete categories in chunks of 450
      const catSnap = await getDocs(collection(db, "categories"));
      const catDocs = catSnap.docs;
      for (let i = 0; i < catDocs.length; i += 450) {
        const batch = writeBatch(db);
        catDocs.slice(i, i + 450).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }

      toast.success(t("adminSeed.cleared") as string || "تم مسح البيانات بنجاح");
      setSeeded(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to clear data");
    } finally {
      setClearing(false);
    }
  };

  /* ── Seed categories + products ── */
  const handleSeed = async () => {
    try {
      setSeeding(true);

      // 1. Create categories
      for (const cat of seedCategories) {
        const docRef = doc(db, "categories", cat.id);
        await setDoc(docRef, {
          name: cat.name,
          slug: cat.slug || cat.id,
          icon: cat.icon,
          image: cat.image,
          count: cat.count,
        });
      }

      // 2. Create products (batch — max 500 per batch)
      const BATCH_SIZE = 450;
      for (let i = 0; i < seedProducts.length; i += BATCH_SIZE) {
        const chunk = seedProducts.slice(i, i + BATCH_SIZE);
        await batchCreateProducts(chunk);
      }

      setSeeded(true);
      toast.success(`تم إضافة ${seedCategories.length} قسم و ${seedProducts.length} منتج بنجاح!`);
    } catch (err: any) {
      toast.error(err.message || "Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("adminSeed.title") as string}</h1>
        <p className="text-sm text-muted-foreground">{t("adminSeed.subtitle") as string}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>بيانات وهمية جاهزة</CardTitle>
          <CardDescription>
            {seedProducts.length} منتج في {seedCategories.length} أقسام — كتب، إلكترونيات، ألعاب، هدايا، أدوات فنية، مكتبية، تعليمية، رقمية
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-2xl font-bold">{seedProducts.length}</p>
              <p className="text-sm text-muted-foreground">{t("adminProducts.title") as string}</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary">
              <p className="text-2xl font-bold">{seedCategories.length}</p>
              <p className="text-sm text-muted-foreground">{t("admin.categories") as string}</p>
            </div>
          </div>

          {seeded ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">تم إضافة البيانات بنجاح! أعد تحميل الصفحة الرئيسية لرؤيتها.</span>
            </div>
          ) : (
            <Button
              onClick={handleSeed}
              disabled={seeding || clearing}
              className="w-full gap-2"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري إضافة {seedProducts.length} منتج...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  إضافة كل البيانات الوهمية ({seedProducts.length} منتج)
                </>
              )}
            </Button>
          )}

          <div className="border-t pt-4">
            <Button
              variant="destructive"
              onClick={handleClear}
              disabled={seeding || clearing}
              className="w-full gap-2"
            >
              {clearing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  جاري الحذف...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  حذف كل المنتجات والأقسام
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              استخدم هذا الزر أولاً لو عايز تعمل seed جديد بدون تكرار
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SeedDataPage;
