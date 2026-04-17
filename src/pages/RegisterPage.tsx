import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, Eye, EyeOff, MapPin, Phone, User, Mail, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { registerUser } from "@/services/authService";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const GOVERNORATES = [
  { en: "Cairo", ar: "القاهرة" },
  { en: "Giza", ar: "الجيزة" },
  { en: "Alexandria", ar: "الإسكندرية" },
  { en: "Dakahlia", ar: "الدقهلية" },
  { en: "Red Sea", ar: "البحر الأحمر" },
  { en: "Beheira", ar: "البحيرة" },
  { en: "Fayoum", ar: "الفيوم" },
  { en: "Gharbiya", ar: "الغربية" },
  { en: "Ismailia", ar: "الإسماعيلية" },
  { en: "Menofia", ar: "المنوفية" },
  { en: "Minya", ar: "المنيا" },
  { en: "Qaliubiya", ar: "القليوبية" },
  { en: "New Valley", ar: "الوادي الجديد" },
  { en: "Sharqia", ar: "الشرقية" },
  { en: "Suez", ar: "السويس" },
  { en: "Aswan", ar: "أسوان" },
  { en: "Assiut", ar: "أسيوط" },
  { en: "Beni Suef", ar: "بني سويف" },
  { en: "Port Said", ar: "بورسعيد" },
  { en: "Damietta", ar: "دمياط" },
  { en: "South Sinai", ar: "جنوب سيناء" },
  { en: "Kafr El Sheikh", ar: "كفر الشيخ" },
  { en: "Matrouh", ar: "مطروح" },
  { en: "Luxor", ar: "الأقصر" },
  { en: "Qena", ar: "قنا" },
  { en: "North Sinai", ar: "شمال سيناء" },
  { en: "Sohag", ar: "سوهاج" },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isGovOpen, setIsGovOpen] = useState(false);
  const govRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    governorate: "",
    address: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (govRef.current && !govRef.current.contains(event.target as Node)) {
        setIsGovOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = t("error.nameRequired") as string || "الاسم مطلوب";
    if (!formData.email.trim()) {
      newErrors.email = t("error.emailRequired") as string || "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("error.emailInvalid") as string || "بريد إلكتروني غير صالح";
    }
    if (!formData.phone) {
      newErrors.phone = t("error.phoneRequired") as string || "رقم الهاتف مطلوب";
    } else if (!/^01[0125][0-9]{8}$/.test(formData.phone)) {
      newErrors.phone = t("error.phoneInvalid") as string || "رقم هاتف غير صالح";
    }
    if (!formData.password) {
      newErrors.password = t("error.passwordRequired") as string || "كلمة السر مطلوبة";
    } else if (formData.password.length < 6) {
      newErrors.password = t("error.passwordShort") as string || "كلمة السر قصيرة جداً";
    }
    if (!formData.governorate) newErrors.governorate = isRTL ? "يرجى اختيار المحافظة" : "Please select a governorate";
    if (!formData.address.trim()) newErrors.address = t("error.addressRequired") as string || "العنوان مطلوب";
    if (!agreedToTerms) newErrors.terms = t("error.termsRequired") as string || "يجب الموافقة على الشروط";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await registerUser(formData.email, formData.password, {
        name: formData.name,
        phone: formData.phone,
        governorate: formData.governorate,
        address: formData.address,
      });

      setSuccess(true);
      toast.success(t("register.success") as string || "تم إنشاء الحساب بنجاح");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error: any) {
      toast.error(error.message);
      setErrors({ ...errors, general: error.message });
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 dark:bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex max-w-sm flex-col items-center justify-center space-y-6 rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-2xl dark:border-border dark:bg-card"
        >
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg shadow-slate-900/20 dark:bg-primary dark:shadow-primary/25"
          >
            <CheckCircle2 className="w-12 h-12" />
          </motion.div>
          <div>
            <h2 className="mb-2 text-3xl font-black text-slate-800 dark:text-card-foreground">{t("register.success") as string || "نجح التسجيل!"}</h2>
            <p className="font-medium text-slate-500 dark:text-muted-foreground">{t("register.redirecting") as string || "جاري توجيهك للمتجر خلال لحظات..."}</p>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-muted">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
              className="h-full bg-slate-900 dark:bg-primary"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f4f4f5] p-4 text-foreground sm:p-6 lg:p-12 dark:bg-background">
      <div className="absolute end-4 top-4 z-20">
        <ThemeSwitcher variant="default" />
      </div>
      {/* Decorative blurred background shapes */}
      <div className="pointer-events-none absolute left-[-10%] top-[-10%] h-[40%] w-[40%] rounded-full bg-blue-400/20 blur-[120px] dark:bg-primary/10" />
      <div className="pointer-events-none absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-indigo-400/20 blur-[120px] dark:bg-violet-500/10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-6xl z-10"
      >
        <div className="flex flex-col overflow-hidden rounded-[2.5rem] border border-white bg-white/80 shadow-2xl backdrop-blur-xl dark:border-border dark:bg-card/95 lg:flex-row">
          
          {/* IMAGE SIDE */}
          <div className="relative w-full lg:w-[45%] min-h-[250px] lg:min-h-auto">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=2070&auto=format&fit=crop')" }}
            />
            {/* Elegant overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            
            <div className="absolute inset-0 p-8 lg:p-12 flex flex-col justify-end" dir={isRTL ? "rtl" : "ltr"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-md"
              >
                <div className="w-16 h-1 bg-white mb-6 rounded-full" />
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
                  {isRTL ? "انضم لعائلتنا" : "Join Our Family"}
                </h1>
                <p className="text-slate-200 text-lg font-light leading-relaxed">
                  {isRTL 
                    ? "البيت الأول لكل القراء والمبدعين. احصل على أفضل الكتب والأدوات المكتبية المتميزة."
                    : "The primary home for all readers and creators. Get the best premium books and stationery."}
                </p>
              </motion.div>
            </div>
          </div>

          {/* FORM SIDE */}
          <div className="flex w-full flex-col bg-white p-6 sm:p-10 lg:w-[55%] lg:p-16 dark:bg-card">
            <div className="mx-auto w-full max-w-lg" dir={isRTL ? "rtl" : "ltr"}>
              
              <div className="mb-10 text-center lg:text-start" dir={isRTL ? "rtl" : "ltr"}>
                <h2 className="mb-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-card-foreground">{t("register.title") as string || "إنشاء حساب جديد"}</h2>
                <p className="text-base text-slate-500 dark:text-muted-foreground">{t("register.subtitle") as string || "ابدأ رحلتك معنا اليوم"}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5" dir={isRTL ? "rtl" : "ltr"}>
                
                <div className="grid md:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{t("register.fullName") as string}</label>
                    <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-muted-foreground">
                      <User size={18} className="transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-primary" />
                      </div>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`h-12 w-full rounded-xl border bg-slate-50 pl-4 pr-11 text-sm text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground dark:placeholder:text-muted-foreground
                          ${errors.name ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                        placeholder={isRTL ? "الاسم الرباعي" : "Full Name"}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 font-medium px-1">{errors.name}</p>}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{t("register.phone") as string}</label>
                    <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-muted-foreground">
                      <Phone size={18} className="transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-primary" />
                      </div>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className={`h-12 w-full rounded-xl border bg-slate-50 pl-4 pr-11 text-sm text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground dark:placeholder:text-muted-foreground
                          ${errors.phone ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                        placeholder="01012345678"
                        dir="ltr"
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-red-500 font-medium px-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{t("register.email") as string}</label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-muted-foreground">
                      <Mail size={18} className="transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-primary" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`h-12 w-full rounded-xl border bg-slate-50 pl-4 pr-11 text-sm text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground dark:placeholder:text-muted-foreground
                        ${errors.email ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                      placeholder="example@mail.com"
                      dir="ltr"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium px-1">{errors.email}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {/* Governorate */}
                  <div className="space-y-2" ref={govRef}>
                    <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{isRTL ? "المحافظة" : "Governorate"}</label>
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={() => setIsGovOpen(!isGovOpen)}
                        className={`flex h-12 w-full items-center justify-between rounded-xl border bg-slate-50 px-4 text-sm font-medium text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground
                          ${errors.governorate ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                      >
                        <span className={formData.governorate ? "text-slate-900 dark:text-foreground" : "text-slate-400 dark:text-muted-foreground"}>
                          {formData.governorate ? (GOVERNORATES.find(g => g.en === formData.governorate || g.ar === formData.governorate)?.[isRTL ? "ar" : "en"] || formData.governorate) : (isRTL ? "اختر المحافظة" : "Select...")}
                        </span>
                        <ChevronDown size={18} className={`text-slate-400 transition-transform duration-300 group-hover:text-slate-900 dark:group-hover:text-foreground ${isGovOpen ? "rotate-180 text-slate-900 dark:text-foreground" : ""}`} />
                      </button>

                      <AnimatePresence>
                        {isGovOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute left-0 right-0 z-50 mt-2 max-h-56 origin-top overflow-y-auto overflow-x-hidden rounded-xl border border-slate-100 bg-white p-1 shadow-2xl shadow-slate-900/10 dark:border-border dark:bg-popover"
                          >
                            <div className="grid grid-cols-1 gap-1">
                              {GOVERNORATES.map((gov) => (
                                <button
                                  key={gov.en}
                                  type="button"
                                  onClick={() => {
                                    setFormData({ ...formData, governorate: isRTL ? gov.ar : gov.en });
                                    setIsGovOpen(false);
                                  }}
                                  className={`flex h-10 w-full items-center justify-between rounded-lg px-3 text-right text-sm font-medium transition-colors
                                    ${formData.governorate === (isRTL ? gov.ar : gov.en) ? "bg-slate-900 text-white dark:bg-primary dark:text-primary-foreground" : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 dark:text-foreground dark:hover:bg-muted"}`}
                                >
                                  {isRTL ? gov.ar : gov.en}
                                  {formData.governorate === (isRTL ? gov.ar : gov.en) && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {errors.governorate && <p className="text-xs text-red-500 font-medium px-1">{errors.governorate}</p>}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{t("register.password") as string}</label>
                    <div className="relative group">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 left-0 z-10 flex items-center pl-4 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className={`h-12 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground dark:placeholder:text-muted-foreground
                          ${errors.password ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                        placeholder="••••••••"
                        dir="ltr"
                      />
                    </div>
                    {errors.password && <p className="text-xs text-red-500 font-medium px-1">{errors.password}</p>}
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{t("register.address") as string}</label>
                  <div className="relative group">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-muted-foreground">
                      <MapPin size={18} className="transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-primary" />
                    </div>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`h-12 w-full rounded-xl border bg-slate-50 pl-4 pr-11 text-sm text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground dark:placeholder:text-muted-foreground
                        ${errors.address ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                      placeholder={isRTL ? "العنوان بالتفصيل" : "Detailed Address"}
                    />
                  </div>
                  {errors.address && <p className="text-xs text-red-500 font-medium px-1">{errors.address}</p>}
                </div>

                {/* Terms Checkbox */}
                <div className="pt-2">
                  <label className="flex items-center gap-3 cursor-pointer group select-none">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className={`flex h-5 w-5 items-center justify-center rounded border transition-all duration-200
                        ${agreedToTerms ? "border-slate-900 bg-slate-900 dark:border-primary dark:bg-primary" : "border-slate-300 bg-white group-hover:border-slate-400 dark:border-border dark:bg-card dark:group-hover:border-muted-foreground"}`}>
                        {agreedToTerms && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 className="w-3.5 h-3.5 text-white" /></motion.div>}
                      </div>
                    </div>
                    <span className="cursor-pointer select-none text-sm font-medium text-slate-600 dark:text-muted-foreground">
                      {t("register.agreeTerms") as string}{" "}
                      <a href="#" className="font-bold text-slate-900 hover:underline dark:text-primary">{t("register.termsLink") as string}</a>
                    </span>
                  </label>
                  {errors.terms && <p className="text-xs text-red-500 font-medium px-1 mt-1">{errors.terms}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-slate-900 text-base font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary dark:shadow-primary/20 dark:hover:bg-primary/90"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRTL ? "إنشاء حساب" : "Create Account")}
                  </button>
                </div>

                <div className="text-center pt-6">
                  <p className="text-sm text-slate-500 dark:text-muted-foreground">
                    {t("register.haveAccount") as string}{" "}
                    <Link to="/login" className="font-bold text-slate-900 underline decoration-2 underline-offset-4 hover:underline dark:text-primary">
                      {isRTL ? "تسجيل الدخول" : "Sign In"}
                    </Link>
                  </p>
                </div>

              </form>
            </div>
          </div>
        </div>
        
        <p className="mt-8 select-none text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-muted-foreground">
          © 2026 {(t("app.name") as string) || "Dar Al Safwa"} 
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
