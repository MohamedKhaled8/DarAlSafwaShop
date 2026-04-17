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
  <footer className="mt-10 bg-slate-950 text-slate-50">
    <div className="section-padding py-8 sm:py-12">
      <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">ص</span>
            </div>
            <span className="font-bold">{(t("app.name") as string)}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-50/70">
            {t("app.description") as string}
          </p>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t("footer.quickLinks") as string}</h4>
          <ul className="space-y-1.5">
            {categories.filter(c => c?.id).slice(0, 5).map(c => (
              <li key={c.id}>
                <Link
                  to={`/category/${c.slug || c.id}`}
                  className="text-sm text-slate-50/70 transition-colors hover:text-slate-50"
                >
                  {resolveCategoryName(c, language)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t("footer.customerService") as string}</h4>
          <ul className="space-y-1.5">
            <li>
              <Link to="/printing" className="text-sm text-slate-50/70 transition-colors hover:text-slate-50">
                {t("top.printing") as string}
              </Link>
            </li>
            <li>
              <Link to="/gifts" className="text-sm text-slate-50/70 transition-colors hover:text-slate-50">
                {t("top.gifts") as string}
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-sm text-slate-50/70 transition-colors hover:text-slate-50">
                {t("nav.account") as string}
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t("footer.contact") as string}</h4>
          <ul className="space-y-2.5">
            <li><span className="text-sm text-slate-50/70">{t("top.help") as string}</span></li>
            <li>
              <p className="mb-1 text-xs font-semibold text-slate-50/80">{t("footer.walletTitle") as string}</p>
              <a
                href={`tel:${WALLET_PHONE_E164}`}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-50/90 transition-colors hover:text-slate-50"
                dir="ltr"
              >
                <Phone className="w-4 h-4 shrink-0 opacity-70" />
                {language === "ar" ? WALLET_PHONE_AR : WALLET_PHONE_EN}
              </a>
              <p className="mt-1 text-xs text-slate-50/55">{t("footer.walletHint") as string}</p>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-8 border-t border-white/10 pt-5 text-center">
        <p className="text-xs text-slate-50/50">
          © 2026 {t("app.name") as string}. {t("footer.rights") as string}
        </p>
      </div>
    </div>
  </footer>
  );
};

export default Footer;
