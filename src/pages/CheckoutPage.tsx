import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ShieldCheck, MapPin, Truck, Store, ArrowRight, Loader2, CreditCard, Smartphone, Copy, X } from "lucide-react";
import { uploadToCloudinary } from "@/utils/cloudinary";
import { useCartContext } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useShippingRates } from "@/hooks/useShippingRates";
import { createOrder } from "@/services/orderService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { INSTAPAY_ADDRESS, WALLET_PHONE_EN } from "@/lib/paymentWallet";
import { useLanguage } from "@/contexts/LanguageContext";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { items, cartTotal, clearCart } = useCartContext();
  const { user, profile } = useAuth();
  const { rates } = useShippingRates();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    altPhone: "",
    email: "",
    nationalId: "",
  });

  const [deliveryMethod, setDeliveryMethod] = useState<"pickup" | "shipping">("pickup");
  const [selectedGov, setSelectedGov] = useState<string>("");

  const [paymentMethod, setPaymentMethod] = useState<"vodafone" | "instapay">("vodafone");
  const [receiptImage, setReceiptImage] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  const currency = (t("currency") as string) || "EGP";

  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
    }
  }, [items, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        phone: profile.phone || "",
        email: user?.email && !user.email.includes("@shop-vibe.local") ? user.email : "",
      }));
      if (profile.governorate) {
        setSelectedGov(profile.governorate);
        setDeliveryMethod("shipping");
      }
    }
  }, [profile, user]);

  const shippingRate =
    deliveryMethod === "shipping" && selectedGov ? rates.find((r) => r.name === selectedGov)?.rate || 0 : 0;

  const total = cartTotal + shippingRate;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error(t("checkout.loginRequired") as string);
      return;
    }

    if (deliveryMethod === "shipping" && !selectedGov) {
      toast.error(t("checkout.selectGovError") as string);
      return;
    }

    if (!receiptImage) {
      toast.error(t("checkout.receiptRequired") as string);
      return;
    }

    if (!formData.nationalId || formData.nationalId.length < 14) {
      toast.error(t("checkout.nationalIdError") as string);
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        customerId: user.uid,
        customerName: formData.name,
        customerPhone: formData.phone,
        email: formData.email,
        altPhone: formData.altPhone,
        nationalId: formData.nationalId,
        items: items.map((item) => ({
          productId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variantId: item.variantId,
        })),
        subtotal: cartTotal,
        shippingFee: shippingRate,
        total: total,
        deliveryMethod,
        governorate: deliveryMethod === "shipping" ? selectedGov : null,
        paymentMethod: paymentMethod,
        receiptImage: receiptImage,
        status: "Pending" as const,
        paymentStatus: "Pending" as const,
      };

      const orderId = await createOrder(orderData);
      clearCart();
      toast.success(t("checkout.orderSuccess") as string);
      navigate(`/invoice/${orderId}`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg || (t("checkout.orderFailed") as string));
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingReceipt(true);
      const toastId = toast.loading(t("checkout.uploadingReceipt") as string);
      const secureUrl = await uploadToCloudinary(file);
      setReceiptImage(secureUrl);
      toast.success(t("checkout.receiptUploaded") as string, { id: toastId });
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      toast.error(msg || (t("checkout.uploadFailed") as string));
    } finally {
      setUploadingReceipt(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <main className="section-padding min-h-screen bg-gray-50 py-10 dark:bg-gray-900/40 lg:py-16" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-3xl font-bold">{t("checkout.title") as string}</h1>

        <form onSubmit={handlePlaceOrder} className="items-start gap-8 lg:flex">
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <ShieldCheck className="h-5 w-5 text-primary" /> {t("checkout.customerDetails") as string}
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    {t("checkout.fullName") as string} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={language === "ar" ? "الاسم الكامل" : "Full name"}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    {t("checkout.email") as string}{" "}
                    <span className="text-xs text-muted-foreground">{t("checkout.emailOptional") as string}</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@example.com"
                    dir="ltr"
                    className="text-start"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    {t("checkout.phone") as string} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01xxxxxxxxx"
                    dir="ltr"
                    className="text-start"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">{t("checkout.altPhone") as string}</label>
                  <Input
                    type="tel"
                    value={formData.altPhone}
                    onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
                    placeholder={t("checkout.altPhonePlaceholder") as string}
                    dir="ltr"
                    className="text-start"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium">
                    {t("checkout.nationalId") as string} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    required
                    minLength={14}
                    maxLength={14}
                    value={formData.nationalId}
                    onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                    placeholder={t("checkout.nationalIdPlaceholder") as string}
                    dir="ltr"
                    className="text-start"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <MapPin className="h-5 w-5 text-primary" /> {t("checkout.deliveryMethod") as string}
              </h2>
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <label
                  className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
                    deliveryMethod === "pickup" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="pickup"
                    checked={deliveryMethod === "pickup"}
                    onChange={() => setDeliveryMethod("pickup")}
                    className="sr-only"
                  />
                  <div className="mb-2 flex items-center justify-between">
                    <Store className={`h-6 w-6 ${deliveryMethod === "pickup" ? "text-primary" : "text-muted-foreground"}`} />
                    {deliveryMethod === "pickup" && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <span className="text-lg font-semibold">{t("checkout.pickupTitle") as string}</span>
                  <span className="text-sm text-muted-foreground">{t("checkout.pickupDesc") as string}</span>
                </label>

                <label
                  className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
                    deliveryMethod === "shipping" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value="shipping"
                    checked={deliveryMethod === "shipping"}
                    onChange={() => setDeliveryMethod("shipping")}
                    className="sr-only"
                  />
                  <div className="mb-2 flex items-center justify-between">
                    <Truck className={`h-6 w-6 ${deliveryMethod === "shipping" ? "text-primary" : "text-muted-foreground"}`} />
                    {deliveryMethod === "shipping" && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <span className="text-lg font-semibold">{t("checkout.shippingTitle") as string}</span>
                  <span className="text-sm text-muted-foreground">{t("checkout.shippingDesc") as string}</span>
                </label>
              </div>

              <AnimatePresence>
                {deliveryMethod === "shipping" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="overflow-hidden"
                  >
                    <div className="rounded-xl border border-border bg-gray-50 p-4 dark:bg-gray-900">
                      <label className="mb-1.5 block text-sm font-medium">
                        {t("checkout.selectGovernorate") as string} <span className="text-destructive">*</span>
                      </label>
                      <select
                        required
                        className="h-11 w-full rounded-lg border-2 border-primary/20 bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-0"
                        value={selectedGov}
                        onChange={(e) => setSelectedGov(e.target.value)}
                      >
                        <option value="">{t("checkout.selectGovernoratePlaceholder") as string}</option>
                        {rates
                          .filter((r) => r.isActive)
                          .map((rate) => (
                            <option key={rate.id} value={rate.name}>
                              {rate.name} (+{rate.rate} {currency})
                            </option>
                          ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950"
            >
              <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
                <CreditCard className="h-5 w-5 text-primary" /> {t("checkout.paymentMethod") as string}
              </h2>
              <div className="mb-6 grid gap-4 sm:grid-cols-2">
                <label
                  className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === "vodafone" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="vodafone"
                    checked={paymentMethod === "vodafone"}
                    onChange={() => setPaymentMethod("vodafone")}
                    className="sr-only"
                  />
                  <div className="mb-2 flex items-center justify-between">
                    <Smartphone className={`h-6 w-6 ${paymentMethod === "vodafone" ? "text-rose-600" : "text-muted-foreground"}`} />
                    {paymentMethod === "vodafone" && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <span className="text-lg font-semibold text-rose-600">{t("checkout.vodafoneCash") as string}</span>
                  <span className="text-sm text-muted-foreground">
                    {t("checkout.transferTo") as string} {WALLET_PHONE_EN}
                  </span>
                </label>

                <label
                  className={`relative flex cursor-pointer flex-col rounded-xl border-2 p-4 transition-all ${
                    paymentMethod === "instapay" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="instapay"
                    checked={paymentMethod === "instapay"}
                    onChange={() => setPaymentMethod("instapay")}
                    className="sr-only"
                  />
                  <div className="mb-2 flex items-center justify-between">
                    <Smartphone className={`h-6 w-6 ${paymentMethod === "instapay" ? "text-indigo-600" : "text-muted-foreground"}`} />
                    {paymentMethod === "instapay" && <Check className="h-5 w-5 text-primary" />}
                  </div>
                  <span className="text-lg font-semibold text-indigo-600">{t("checkout.instapay") as string}</span>
                  <span className="break-all text-sm text-muted-foreground" dir="ltr">
                    {INSTAPAY_ADDRESS}
                  </span>
                </label>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-gray-50 p-5 dark:bg-gray-900">
                <p className="mb-2 text-sm font-semibold">
                  {t("checkout.stepTransfer") as string}{" "}
                  <span className="text-lg font-bold text-primary" dir="ltr">
                    {total.toFixed(2)} {currency}
                  </span>
                </p>
                <div className="mb-4 flex items-center gap-3 rounded-lg border border-border bg-white p-3 shadow-sm">
                  <span className="flex-1 text-center font-mono text-xl font-black tracking-widest text-slate-800" dir="ltr">
                    {paymentMethod === "vodafone" ? WALLET_PHONE_EN : INSTAPAY_ADDRESS}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(paymentMethod === "vodafone" ? WALLET_PHONE_EN : INSTAPAY_ADDRESS);
                      toast.success(t("checkout.copied") as string);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                    <span className="ms-1 hidden sm:inline">{t("checkout.copy") as string}</span>
                  </Button>
                </div>

                <p className="mb-2 mt-4 text-sm font-semibold text-rose-600">
                  {t("checkout.stepUpload") as string} <span className="text-destructive">*</span>
                </p>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleReceiptUpload}
                    className="flex-1 cursor-pointer bg-white"
                    disabled={uploadingReceipt}
                    required={!receiptImage}
                  />
                  {uploadingReceipt && <Loader2 className="h-5 w-5 shrink-0 animate-spin text-muted-foreground" />}
                </div>
                {receiptImage && (
                  <div className="relative mt-4 inline-block">
                    <img
                      src={receiptImage}
                      alt={t("checkout.receiptPreview") as string}
                      className="h-auto max-h-56 w-auto rounded-xl border-2 border-primary/20 bg-white object-contain shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setReceiptImage("")}
                      className="absolute -end-2 -top-2 rounded-full bg-rose-500 p-1.5 text-white shadow-md transition-colors hover:bg-rose-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 lg:sticky lg:top-24 lg:mt-0 lg:w-96"
          >
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
              <h3 className="mb-4 text-lg font-bold">{t("checkout.orderSummary") as string}</h3>

              <div className="mb-6 space-y-4">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <img src={item.image} alt={item.name} className="h-12 w-12 shrink-0 rounded object-cover border" />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 font-medium">{item.name}</p>
                      <p className="text-muted-foreground">
                        {t("checkout.qty") as string}: {item.quantity}
                      </p>
                    </div>
                    <p className="shrink-0 font-semibold" dir="ltr">
                      {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-border pt-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("checkout.subtotal") as string}</span>
                  <span dir="ltr">
                    {cartTotal.toFixed(2)} {currency}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{t("checkout.shipping") as string}</span>
                  <span dir="ltr">
                    {deliveryMethod === "pickup"
                      ? (t("checkout.shippingFreePickup") as string)
                      : shippingRate
                        ? `${shippingRate.toFixed(2)} ${currency}`
                        : (t("checkout.shippingSelectGov") as string)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-bold text-primary">
                  <span>{t("checkout.total") as string}</span>
                  <span dir="ltr">
                    {total.toFixed(2)} {currency}
                  </span>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="mt-6 w-full gap-2 rounded-xl py-6 text-base font-bold">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" /> {t("checkout.processing") as string}
                  </>
                ) : (
                  <>
                    {t("checkout.placeOrder") as string}{" "}
                    <ArrowRight className={`h-5 w-5 ${language === "ar" ? "rotate-180" : ""}`} />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
