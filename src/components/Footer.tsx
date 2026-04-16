import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useProducts";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();
  const { categories } = useCategories();

  return (
  <footer className="bg-foreground text-primary-foreground mt-16">
    <div className="section-padding py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">ص</span>
            </div>
            <span className="font-bold">دار الصفوة</span>
          </div>
          <p className="text-sm opacity-60 leading-relaxed">{t("app.description") as string}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">{t("footer.quickLinks") as string}</h4>
          <ul className="space-y-2">
            {categories.filter(c => c?.id).slice(0, 5).map(c => (
              <li key={c.id}><Link to={`/category/${c.slug || c.id}`} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">{t("footer.customerService") as string}</h4>
          <ul className="space-y-2">
            <li><Link to="/printing" className="text-sm opacity-60 hover:opacity-100 transition-opacity">{t("top.printing") as string}</Link></li>
            <li><Link to="/gifts" className="text-sm opacity-60 hover:opacity-100 transition-opacity">{t("top.gifts") as string}</Link></li>
            <li><Link to="/dashboard" className="text-sm opacity-60 hover:opacity-100 transition-opacity">{t("nav.account") as string}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">{t("footer.contact") as string}</h4>
          <ul className="space-y-2">
            <li><span className="text-sm opacity-60">{t("top.help") as string}</span></li>
            <li><span className="text-sm opacity-60">{t("footer.contact") as string}</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center">
        <p className="text-xs opacity-40">© 2026 {t("app.name") as string}. All rights reserved.</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
