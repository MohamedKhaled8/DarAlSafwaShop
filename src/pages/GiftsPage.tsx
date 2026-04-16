import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Type, Gift } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const GiftsPage = () => {
  const { t } = useLanguage();
  const [text, setText] = useState("Your custom text here");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(24);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="pb-20 lg:pb-0">
      <div className="section-padding py-8">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{(t("top.gifts") as string)}</h1>
          <p className="text-sm text-muted-foreground mb-8">{(t("gifts.description") as string) || "Create personalized gifts with custom text and images"}</p>
        </motion.div>

        <div className="lg:flex gap-8">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1 space-y-6">
            <div>
              <label className="text-sm font-medium block mb-2"><Type className="w-4 h-4 inline mr-1" /> {(t("gifts.customText") as string) || "Custom Text"}</label>
              <input
                type="text"
                value={text}
                onChange={e => setText(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder={(t("gifts.textPlaceholder") as string) || "Enter your custom text..."}
              />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2">{(t("gifts.fontSize") as string) || "Font Size"}: {fontSize}px</label>
              <input type="range" min={14} max={48} value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <label className="text-sm font-medium block mb-2"><Upload className="w-4 h-4 inline mr-1" /> {(t("gifts.uploadImage") as string) || "Upload Image"}</label>
              <input type="file" accept="image/*" onChange={handleImage} className="text-sm" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:w-96 mt-8 lg:mt-0">
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-5 h-5 text-primary" />
                <h3 className="font-semibold">{(t("gifts.livePreview") as string) || "Live Preview"}</h3>
              </div>
              <div className="aspect-square bg-secondary rounded-xl flex flex-col items-center justify-center p-6 overflow-hidden">
                {imagePreview && (
                  <motion.img
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    src={imagePreview}
                    alt="Custom"
                    className="w-32 h-32 rounded-xl object-cover mb-4"
                  />
                )}
                <motion.p
                  key={text + fontSize}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center font-semibold break-words max-w-full"
                  style={{ fontSize: `${fontSize}px`, lineHeight: 1.2 }}
                >
                  {text}
                </motion.p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-bold">{t("currency") as string} 24.99</span>
                <button className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold text-sm btn-press hover:bg-primary/90 transition-colors">
                  {(t("product.addToCart") as string)}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default GiftsPage;
