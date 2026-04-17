import { useState, useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Printer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartContext } from "@/contexts/CartContext";
import { usePrintPricing } from "@/hooks/usePrintPricing";
import { toast } from "sonner";
import { compressImageFileToDataUrl } from "@/utils/imageCompress";

const PRINT_ORDER_IMAGE = "/print-order.svg";

const printModes = ["Black & White", "Color"] as const;

const PrintingPage = () => {
  const { t, isRTL, language } = useLanguage();
  const { addToCart } = useCartContext();
  const { config, loading: pricingLoading } = usePrintPricing();

  const [sizeId, setSizeId] = useState<string>("");
  const [typeId, setTypeId] = useState<string>("");
  const [print, setPrint] = useState<(typeof printModes)[number]>("Black & White");
  const [copies, setCopies] = useState(1);
  const [fileName, setFileName] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const previewUrlRef = useRef<string | null>(null);

  const sizes = config?.paperSizes ?? [];
  const types = config?.paperTypes ?? [];

  useEffect(() => {
    if (sizes.length && !sizeId) setSizeId(sizes[0].id);
  }, [sizes, sizeId]);

  useEffect(() => {
    if (types.length && !typeId) setTypeId(types[0].id);
  }, [types, typeId]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrlRef.current);
        previewUrlRef.current = null;
      }
    };
  }, []);

  const setPreviewFromFile = (file: File | null) => {
    if (previewUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    if (!file) {
      setFilePreview(null);
      return;
    }
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      previewUrlRef.current = url;
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const selectedSize = useMemo(() => sizes.find((s) => s.id === sizeId) ?? sizes[0], [sizes, sizeId]);
  const selectedType = useMemo(() => types.find((x) => x.id === typeId) ?? types[0], [types, typeId]);

  const colorExtra = config?.colorExtraPerCopy ?? 0;
  const bwExtra = config?.bwExtraPerCopy ?? 0;

  const unitPrice = useMemo(() => {
    const sz = selectedSize?.price ?? 0;
    const tp = selectedType?.price ?? 0;
    const mode = print === "Color" ? colorExtra : bwExtra;
    return sz + tp + mode;
  }, [selectedSize, selectedType, print, colorExtra, bwExtra]);

  const total = useMemo(() => (unitPrice * Math.max(1, copies)).toFixed(2), [unitPrice, copies]);

  const labelOf = (labelAr: string, labelEn: string) => (language === "ar" ? labelAr || labelEn : labelEn || labelAr);

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-2xl font-bold md:text-3xl">{(t("top.printing") as string)}</h1>
          <p className="mb-8 text-sm text-muted-foreground">
            {(t("printing.description") as string) || "Upload your document and customize your print order"}
          </p>
        </motion.div>

        <div className="items-start gap-8 lg:flex">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="min-w-0 flex-1 space-y-6"
          >
            <div className="cursor-pointer rounded-2xl border-2 border-dashed border-border p-10 text-center transition-colors hover:border-primary/50">
              <input
                type="file"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileName(file.name);
                    setUploadedFile(file);
                    setPreviewFromFile(file);
                  } else {
                    setUploadedFile(null);
                  }
                  e.target.value = "";
                }}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="mb-1 text-sm font-medium">{fileName || (t("printing.uploadText") as string) || "Click to upload"}</p>
                <p className="text-xs text-muted-foreground">{(t("printing.fileTypes") as string) || "PDF, images (max 50MB)"}</p>
              </label>
            </div>

            {pricingLoading && !config ? (
              <p className="text-sm text-muted-foreground">{t("loading") as string}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium">{(t("printing.paperSize") as string) || "Paper Size"}</label>
                    <div className="space-y-1">
                      {sizes.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => setSizeId(s.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${
                            sizeId === s.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
                          }`}
                        >
                          <span>{labelOf(s.labelAr, s.labelEn)}</span>
                          <span className="tabular-nums text-xs opacity-90">+{s.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium">{(t("printing.paperType") as string) || "Paper Type"}</label>
                    <div className="space-y-1">
                      {types.map((pt) => (
                        <button
                          key={pt.id}
                          type="button"
                          onClick={() => setTypeId(pt.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-start text-sm transition-colors ${
                            typeId === pt.id ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
                          }`}
                        >
                          <span>{labelOf(pt.labelAr, pt.labelEn)}</span>
                          <span className="tabular-nums text-xs opacity-90">+{pt.price.toFixed(2)}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{(t("printing.printType") as string) || "Print Type"}</label>
                  <div className="flex gap-2">
                    {printModes.map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPrint(p)}
                        className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                          print === p ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"
                        }`}
                      >
                        {p === "Color" ? (isRTL ? "ملون" : "Color") : isRTL ? "أبيض وأسود" : "Black & White"}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {print === "Color"
                      ? `+${colorExtra.toFixed(2)} ${t("currency") as string} / ${isRTL ? "نسخة" : "copy"}`
                      : `+${bwExtra.toFixed(2)} ${t("currency") as string} / ${isRTL ? "نسخة" : "copy"}`}
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">{(t("printing.copies") as string) || "Copies"}</label>
                  <input
                    type="number"
                    min={1}
                    value={copies}
                    onChange={(e) => setCopies(Math.max(1, +e.target.value))}
                    className="w-32 rounded-lg bg-secondary px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 w-full shrink-0 lg:mt-0 lg:w-80 lg:max-w-sm"
          >
            <div className="sticky top-24 rounded-xl border border-border bg-card p-6">
              <div className="mb-4 flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">{(t("printing.orderPreview") as string) || "Order Preview"}</h3>
              </div>
              <div className="mb-4 flex max-h-72 min-h-[140px] items-center justify-center overflow-hidden rounded-lg bg-secondary">
                {filePreview ? (
                  <img src={filePreview} alt="" className="max-h-72 w-full object-contain" />
                ) : (
                  <FileText className="h-12 w-12 text-muted-foreground/30" />
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{(t("printing.size") as string) || "Size"}</span>
                  <span className="text-end">{selectedSize ? labelOf(selectedSize.labelAr, selectedSize.labelEn) : "—"}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{(t("printing.type") as string) || "Type"}</span>
                  <span className="text-end">{selectedType ? labelOf(selectedType.labelAr, selectedType.labelEn) : "—"}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{(t("printing.print") as string) || "Print"}</span>
                  <span>{print === "Color" ? (isRTL ? "ملون" : "Color") : isRTL ? "أبيض وأسود" : "B&W"}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground">{(t("printing.copies") as string) || "Copies"}</span>
                  <span>{copies}</span>
                </div>
                <div className="flex justify-between gap-2 border-t border-border pt-2 text-base font-bold">
                  <span>{(t("printing.estimated") as string) || "Estimated"}</span>
                  <span className="tabular-nums" dir="ltr">
                    {(t("currency") as string)} {total}
                  </span>
                </div>
              </div>
              <button
                type="button"
                disabled={addingToCart}
                onClick={() => {
                  void (async () => {
                    if (!fileName || !uploadedFile) {
                      toast.error(isRTL ? "يرجى رفع الملف المراد طباعته أولاً" : "Please upload a file first");
                      return;
                    }
                    if (!selectedSize || !selectedType) {
                      toast.error(isRTL ? "تعذر تحميل أسعار الطباعة" : "Print pricing not loaded");
                      return;
                    }
                    try {
                      setAddingToCart(true);
                      let imageUrl = PRINT_ORDER_IMAGE;
                      if (uploadedFile.type.startsWith("image/")) {
                        const dataUrl = await compressImageFileToDataUrl(uploadedFile, 520, 0.82);
                        if (dataUrl) imageUrl = dataUrl;
                      }
                      const sizeLabel = labelOf(selectedSize.labelAr, selectedSize.labelEn);
                      const typeLabel = labelOf(selectedType.labelAr, selectedType.labelEn);
                      addToCart({
                        id: `print-${Date.now()}`,
                        name: `${isRTL ? "طباعة" : "Print"}: ${fileName} (${sizeLabel} · ${typeLabel})`,
                        price: parseFloat(total),
                        image: imageUrl,
                        variantId: `sizeId:${selectedSize.id}|typeId:${selectedType.id}|print:${print}|copies:${copies}`,
                      });
                      toast.success(isRTL ? "تم إضافة طلب الطباعة للسلة بنجاح" : "Printing order added to cart");
                      setFileName("");
                      setUploadedFile(null);
                      setPreviewFromFile(null);
                      setCopies(1);
                    } catch {
                      toast.error(isRTL ? "تعذر معالجة الصورة" : "Could not process the image");
                    } finally {
                      setAddingToCart(false);
                    }
                  })();
                }}
                className="btn-press mt-4 w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {addingToCart ? (t("loading") as string) : ((t("printing.placeOrder") as string) || "Add to Cart")}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default PrintingPage;
