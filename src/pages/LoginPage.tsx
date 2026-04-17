import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { loginUser, getUserProfile } from "@/services/authService";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const LoginPage = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) {
      newErrors.email = t("error.emailRequired") as string || "البريد الإلكتروني مطلوب";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("error.emailInvalid") as string || "بريد إلكتروني غير صالح";
    }
    if (!formData.password) {
      newErrors.password = t("error.passwordRequired") as string || "كلمة السر مطلوبة";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const userCred = await loginUser(formData.email, formData.password);
      
      let isAdminUser = formData.email === "admin@admin.com";
      if (!isAdminUser && userCred.user) {
        const profile = await getUserProfile(userCred.user.uid);
        if (profile?.role === "admin") {
          isAdminUser = true;
        }
      }

      toast.success((t("login.welcomeBack") as string) || (isRTL ? "تم تسجيل الدخول بنجاح!" : "Signed in successfully!"));
      
      // Delay navigation slightly so AuthContext can finish its state updates properly
      const redirect = searchParams.get("redirect");
      const safeRedirect = redirect && redirect.startsWith("/") ? redirect : null;
      setTimeout(() => {
        if (isAdminUser) {
          navigate("/admin");
        } else {
          navigate(safeRedirect || "/");
        }
      }, 500);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

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
        <div className="flex min-h-[650px] flex-col overflow-hidden rounded-[2.5rem] border border-white bg-white/80 shadow-2xl backdrop-blur-xl dark:border-border dark:bg-card/95 lg:flex-row">
          
          {/* IMAGE SIDE */}
          <div className="relative w-full lg:w-1/2 min-h-[300px] lg:min-h-full">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop')" }}
            />
            {/* Elegant overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            
            <div className="absolute inset-0 p-10 flex flex-col justify-end" dir={isRTL ? "rtl" : "ltr"}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-md"
              >
                <div className="w-16 h-1 bg-white mb-6 rounded-full" />
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4 tracking-tight">
                  {(t("app.name") as string) || "دار الصفوة"}
                </h1>
                <p className="text-slate-200 text-lg md:text-xl font-light leading-relaxed">
                  {isRTL 
                    ? "بوابتك لكل ما تحتاجه من الكتب والأدوات المكتبية المتميزة. عالم من الإبداع بين يديك."
                    : "Your gateway to premium books and stationery. A world of creativity at your fingertips."}
                </p>
              </motion.div>
            </div>
          </div>

          {/* FORM SIDE */}
          <div className="flex w-full flex-col justify-center bg-white p-8 sm:p-12 lg:w-1/2 lg:p-20 dark:bg-card">
            <div className="mx-auto w-full max-w-md" dir={isRTL ? "rtl" : "ltr"}>
              
              <div className="mb-10 text-center lg:mb-14 lg:text-start" dir={isRTL ? "rtl" : "ltr"}>
                <h2 className="mb-3 text-3xl font-bold tracking-tight text-slate-900 dark:text-card-foreground">
                  {t("login.title") as string || "مرحباً بك مجدداً"}
                </h2>
                <p className="text-base text-slate-500 dark:text-muted-foreground">
                  {t("login.subtitle") as string || "سجل دخولك لمتابعة التسوق"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{t("login.email") as string}</label>
                  <div className="group relative">
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 dark:text-muted-foreground">
                      <Mail size={18} className="transition-colors group-focus-within:text-slate-900 dark:group-focus-within:text-primary" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`h-14 w-full rounded-xl border bg-slate-50 pl-4 pr-11 text-base text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground dark:placeholder:text-muted-foreground
                        ${errors.email ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                      placeholder={isRTL ? "البريد الإلكتروني" : "Email address"}
                      dir="ltr"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium px-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700 dark:text-foreground">{t("login.password") as string}</label>
                    <a href="#" className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-muted-foreground dark:hover:text-foreground">
                      {t("login.forgotPassword") as string || "نسيت كلمة السر؟"}
                    </a>
                  </div>
                  <div className="group relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`h-14 w-full rounded-xl border bg-slate-50 pl-11 pr-4 text-base text-slate-900 outline-none transition-all duration-300 dark:bg-muted/50 dark:text-foreground dark:placeholder:text-muted-foreground
                        ${errors.password ? "border-red-300 bg-red-50/30 focus:border-red-500 dark:bg-red-950/20" : "border-slate-200 hover:border-slate-300 focus:border-slate-900 dark:border-border dark:hover:border-muted-foreground/40 dark:focus:border-primary"}`}
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 font-medium px-1">{errors.password}</p>}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-slate-900 text-base font-bold text-white shadow-lg shadow-slate-900/10 transition-all duration-300 hover:bg-slate-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary dark:shadow-primary/20 dark:hover:bg-primary/90"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRTL ? "تسجيل الدخول" : "Sign In")}
                    {!loading && <LogIn size={18} className={isRTL ? "rotate-0" : "rotate-180"} />}
                  </button>
                </div>

                <div className="text-center pt-8">
                  <p className="text-sm text-slate-500 dark:text-muted-foreground">
                    {(t("login.noAccount") as string) || (isRTL ? "ليس لديك حساب؟" : "Don't have an account?")}{" "}
                    <Link to="/register" className="font-bold text-slate-900 underline decoration-2 underline-offset-4 hover:underline dark:text-primary">
                      {(t("login.createAccount") as string) || (isRTL ? "إنشاء حساب" : "Create account")}
                    </Link>
                  </p>
                </div>
                
              </form>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-muted-foreground">
          © 2026 {(t("app.name") as string) || "Dar Al Safwa"} 
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
