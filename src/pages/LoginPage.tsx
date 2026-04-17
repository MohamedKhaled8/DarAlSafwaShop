import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Mail, Eye, EyeOff, LogIn } from "lucide-react";
import { toast } from "sonner";
import { loginUser, getUserProfile } from "@/services/authService";
import { useLanguage } from "@/contexts/LanguageContext";

const LoginPage = () => {
  const { t, isRTL } = useLanguage();
  const navigate = useNavigate();
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
      setTimeout(() => {
        if (isAdminUser) {
          navigate("/admin");
        } else {
          navigate("/");
        }
      }, 500);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f4f5] p-4 sm:p-6 lg:p-12 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/20 blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-6xl z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[650px] border border-white">
          
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
          <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center bg-white">
            <div className="w-full max-w-md mx-auto" dir={isRTL ? "rtl" : "ltr"}>
              
              <div className="mb-10 lg:mb-14 text-center lg:text-start" dir={isRTL ? "rtl" : "ltr"}>
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  {t("login.title") as string || "مرحباً بك مجدداً"}
                </h2>
                <p className="text-slate-500 text-base">
                  {t("login.subtitle") as string || "سجل دخولك لمتابعة التسوق"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">{t("login.email") as string}</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                      <Mail size={18} className="group-focus-within:text-slate-900 transition-colors" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full h-14 pr-11 pl-4 rounded-xl border bg-slate-50 text-slate-900 text-base transition-all duration-300 outline-none
                        ${errors.email ? "border-red-300 focus:border-red-500 bg-red-50/30" : "border-slate-200 focus:border-slate-900 hover:border-slate-300"}`}
                      placeholder={isRTL ? "البريد الإلكتروني" : "Email address"}
                      dir="ltr"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-red-500 font-medium px-1">{errors.email}</p>}
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-slate-700">{t("login.password") as string}</label>
                    <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                      {t("login.forgotPassword") as string || "نسيت كلمة السر؟"}
                    </a>
                  </div>
                  <div className="relative group">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className={`w-full h-14 pl-11 pr-4 rounded-xl border bg-slate-50 text-slate-900 text-base transition-all duration-300 outline-none
                        ${errors.password ? "border-red-300 focus:border-red-500 bg-red-50/30" : "border-slate-200 focus:border-slate-900 hover:border-slate-300"}`}
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 hover:text-slate-900 transition-colors"
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
                    className="w-full h-14 bg-slate-900 text-white font-bold text-base rounded-xl hover:bg-slate-800 transition-all duration-300 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg shadow-slate-900/10"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRTL ? "تسجيل الدخول" : "Sign In")}
                    {!loading && <LogIn size={18} className={isRTL ? "rotate-0" : "rotate-180"} />}
                  </button>
                </div>

                <div className="text-center pt-8">
                  <p className="text-slate-500 text-sm">
                    {(t("login.noAccount") as string) || (isRTL ? "ليس لديك حساب؟" : "Don't have an account?")}{" "}
                    <Link to="/register" className="font-bold text-slate-900 hover:underline decoration-2 underline-offset-4">
                      {(t("login.createAccount") as string) || (isRTL ? "إنشاء حساب" : "Create account")}
                    </Link>
                  </p>
                </div>
                
              </form>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs font-semibold text-slate-400 mt-8 tracking-wider uppercase">
          © 2026 {(t("app.name") as string) || "Dar Al Safwa"} 
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
