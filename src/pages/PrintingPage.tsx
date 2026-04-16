import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Printer } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCartContext } from "@/contexts/CartContext";
import { toast } from "sonner";

const paperSizes = ["A4", "A3", "Letter", "Legal"];
const paperTypes = ["Standard", "Glossy", "Matte", "Cardstock"];
const printTypes = ["Black & White", "Color"];

const PrintingPage = () => {
  const { t, isRTL } = useLanguage();
  const { addToCart } = useCartContext();
  const [size, setSize] = useState("A4");
  const [type, setType] = useState("Standard");
  const [print, setPrint] = useState("Black & White");
  const [copies, setCopies] = useState(1);
  const [fileName, setFileName] = useState("");
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const pricePerPage = print === "Color" ? 0.25 : 0.08;
  const sizeMultiplier = size === "A3" ? 2 : size === "Legal" ? 1.3 : 1;
  const typeMultiplier = type === "Glossy" ? 1.5 : type === "Cardstock" ? 2 : type === "Matte" ? 1.3 : 1;
  const total = (pricePerPage * sizeMultiplier * typeMultiplier * copies * 10).toFixed(2);

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{(t("top.printing") as string)}</h1>
          <p className="text-sm text-muted-foreground mb-8">{(t("printing.description") as string) || "Upload your document and customize your print order"}</p>
        </motion.div>

        <div className="lg:flex gap-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 space-y-6"
          >
            {/* Upload */}
            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                id="file-upload" 
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setFileName(file.name);
                    if (file.type.startsWith("image/")) {
                      setFilePreview(URL.createObjectURL(file));
                    } else {
                      setFilePreview(null);
                    }
                  }
                }} 
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm font-medium mb-1">{fileName || (t("printing.uploadText") as string) || "Click to upload your document"}</p>
                <p className="text-xs text-muted-foreground">{(t("printing.fileTypes") as string) || "PDF, DOC, PPT (max 50MB)"}</p>
              </label>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium block mb-2">{(t("printing.paperSize") as string) || "Paper Size"}</label>
                <div className="space-y-1">
                  {paperSizes.map(s => (
                    <button key={s} onClick={() => setSize(s)} className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${size === s ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-2">{(t("printing.paperType") as string) || "Paper Type"}</label>
                <div className="space-y-1">
                  {paperTypes.map(t => (
                    <button key={t} onClick={() => setType(t)} className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${type === t ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">{(t("printing.printType") as string) || "Print Type"}</label>
              <div className="flex gap-2">
                {printTypes.map(p => (
                  <button key={p} onClick={() => setPrint(p)} className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${print === p ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-muted"}`}>
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">{(t("printing.copies") as string) || "Copies"}</label>
              <input
                type="number"
                min={1}
                value={copies}
                onChange={e => setCopies(Math.max(1, +e.target.value))}
                className="w-32 px-4 py-2.5 rounded-lg bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:w-80 mt-8 lg:mt-0"
          >
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Printer className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{(t("printing.orderPreview") as string) || "Order Preview"}</h3>
              </div>
              <div className="aspect-[3/4] bg-secondary rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                {filePreview ? (
                  <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <FileText className="w-12 h-12 text-muted-foreground/30" />
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">{(t("printing.size") as string) || "Size"}</span><span>{size}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{(t("printing.type") as string) || "Type"}</span><span>{type}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{(t("printing.print") as string) || "Print"}</span><span>{print}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">{(t("printing.copies") as string) || "Copies"}</span><span>{copies}</span></div>
                <div className="border-t border-border pt-2 flex justify-between font-bold text-base">
                  <span>{(t("printing.estimated") as string) || "Estimated"}</span>
                  <span className="tabular-nums">{(t("currency") as string)} {total}</span>
                </div>
              </div>
              <button 
                onClick={() => {
                  if (!fileName) {
                    toast.error(isRTL ? "يرجى رفع الملف المراد طباعته أولاً" : "Please upload a file first");
                    return;
                  }
                  addToCart({
                    id: `print-${Date.now()}`,
                    name: `${isRTL ? "طباعة" : "Print"}: ${fileName}`,
                    price: parseFloat(total),
                    image: "https://images.unsplash.com/photo-1562564055-71e051d33c1f?auto=format&fit=crop&q=80&w=400",
                    variantId: `size:${size}|type:${type}|print:${print}|copies:${copies}`
                  });
                  toast.success(isRTL ? "تم إضافة طلب الطباعة للسلة بنجاح" : "Printing order added to cart");
                  setFileName("");
                  setFilePreview(null);
                  setCopies(1);
                }}
                className="w-full mt-4 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm btn-press hover:bg-primary/90 transition-colors"
              >
                {(t("printing.placeOrder") as string) || "Add to Cart"}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default PrintingPage;
