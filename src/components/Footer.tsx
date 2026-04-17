import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import { useCategories } from "@/hooks/useProducts";
import { useLanguage } from "@/contexts/LanguageContext";
import { resolveCategoryName } from "@/lib/localizedContent";
import { WALLET_PHONE_AR, WALLET_PHONE_E164, WALLET_PHONE_EN } from "@/lib/paymentWallet";

const Footer = () => {
  const { t, language } = useLanguage();
  const { categories } = useCategories();

  return (
  <footer className="mt-16 bg-slate-950 text-slate-50">
    <div className="section-padding py-12">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">ص</span>
            </div>
            <span className="font-bold">{(t("app.name") as string)}</span>
          </div>
          <p className="text-sm opacity-60 leading-relaxed">{t("app.description") as string}</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">{t("footer.quickLinks") as string}</h4>
          <ul className="space-y-2">
            {categories.filter(c => c?.id).slice(0, 5).map(c => (
              <li key={c.id}><Link to={`/category/${c.slug || c.id}`} className="text-sm opacity-60 hover:opacity-100 transition-opacity">{resolveCategoryName(c, language)}</Link></li>
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
          <ul className="space-y-3">
            <li><span className="text-sm opacity-60">{t("top.help") as string}</span></li>
            <li>
              <p className="text-xs font-semibold opacity-80 mb-1">{t("footer.walletTitle") as string}</p>
              <a
                href={`tel:${WALLET_PHONE_E164}`}
                className="inline-flex items-center gap-2 text-sm font-bold opacity-90 hover:opacity-100 transition-opacity"
                dir="ltr"
              >
                <Phone className="w-4 h-4 shrink-0 opacity-70" />
                {language === "ar" ? WALLET_PHONE_AR : WALLET_PHONE_EN}
              </a>
              <p className="text-xs opacity-50 mt-1">{t("footer.walletHint") as string}</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center">
        <p className="text-xs text-slate-50/50">© 2026 {t("app.name") as string}. {t("footer.rights") as string}</p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
