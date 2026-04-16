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

const CheckoutPage = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name || "",
        phone: profile.phone || "",
        email: user?.email && !user.email.includes('@shop-vibe.local') ? user.email : "",
      }));
      if (profile.governorate) {
        setSelectedGov(profile.governorate);
        // default to shipping if they have a governorate maybe?
        setDeliveryMethod("shipping");
      }
    }
  }, [profile, user]);

  const shippingRate = deliveryMethod === "shipping" && selectedGov
    ? rates.find(r => r.name === selectedGov)?.rate || 0
    : 0;

  const total = cartTotal + shippingRate;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    if (deliveryMethod === "shipping" && !selectedGov) {
      toast.error("Please select a governorate for shipping.");
      return;
    }

    if (!receiptImage) {
      toast.error("You MUST upload the payment receipt before checking out.");
      return;
    }

    if (!formData.nationalId || formData.nationalId.length < 14) {
      toast.error("Please enter a valid National ID (14 digits).");
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
        items: items.map(item => ({
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
      toast.success("Order placed successfully!");
      navigate(`/invoice/${orderId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingReceipt(true);
      const toastId = toast.loading("Uploading receipt image...");
      const secureUrl = await uploadToCloudinary(file);
      setReceiptImage(secureUrl);
      toast.success("Receipt uploaded successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to upload receipt image");
    } finally {
      setUploadingReceipt(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <main className="section-padding py-10 lg:py-16 bg-gray-50 dark:bg-gray-900/40 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <form onSubmit={handlePlaceOrder} className="lg:flex gap-8 items-start">
          <div className="flex-1 space-y-6">
            
            {/* Customer Details */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-primary w-5 h-5" /> Customer Details
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                  <Input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Ahmed Ali" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Email <span className="text-muted-foreground text-xs">(Optional)</span></label>
                  <Input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="ahmed@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Phone Number <span className="text-destructive">*</span></label>
                  <Input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="01xxxxxxxxx" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Alternative Phone</label>
                  <Input type="tel" value={formData.altPhone} onChange={e => setFormData({...formData, altPhone: e.target.value})} placeholder="Optional second number" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-sm font-medium">National ID (الرقم القومي) <span className="text-destructive">*</span></label>
                  <Input required minLength={14} maxLength={14} value={formData.nationalId} onChange={e => setFormData({...formData, nationalId: e.target.value})} placeholder="14 digit ID number" />
                </div>
              </div>
            </motion.div>

            {/* Delivery Method */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <MapPin className="text-primary w-5 h-5" /> Delivery Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'pickup' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input type="radio" name="delivery" value="pickup" checked={deliveryMethod === 'pickup'} onChange={() => setDeliveryMethod('pickup')} className="sr-only" />
                  <div className="flex justify-between items-center mb-2">
                    <Store className={`w-6 h-6 ${deliveryMethod === 'pickup' ? 'text-primary' : 'text-muted-foreground'}`} />
                    {deliveryMethod === 'pickup' && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <span className="font-semibold text-lg">Store Pickup</span>
                  <span className="text-sm text-muted-foreground">Free - Pick up from library</span>
                </label>
                
                <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${deliveryMethod === 'shipping' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input type="radio" name="delivery" value="shipping" checked={deliveryMethod === 'shipping'} onChange={() => setDeliveryMethod('shipping')} className="sr-only" />
                  <div className="flex justify-between items-center mb-2">
                    <Truck className={`w-6 h-6 ${deliveryMethod === 'shipping' ? 'text-primary' : 'text-muted-foreground'}`} />
                    {deliveryMethod === 'shipping' && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <span className="font-semibold text-lg">Delivery Shipping</span>
                  <span className="text-sm text-muted-foreground">Delivered to your address</span>
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
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 border border-border rounded-xl">
                      <label className="text-sm font-medium mb-1.5 block">Select Governorate <span className="text-destructive">*</span></label>
                      <select 
                        required
                        className="w-full h-11 px-3 rounded-lg border-2 border-primary/20 bg-background focus:border-primary focus:ring-0 outline-none transition-colors"
                        value={selectedGov}
                        onChange={(e) => setSelectedGov(e.target.value)}
                      >
                        <option value="">Select your Governorate</option>
                        {rates.filter(r => r.isActive).map(rate => (
                          <option key={rate.id} value={rate.name}>{rate.name} (+{rate.rate} EGP)</option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Payment & Receipt Method */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm mt-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="text-primary w-5 h-5" /> Payment Method
              </h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'vodafone' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input type="radio" name="paymentMethod" value="vodafone" checked={paymentMethod === 'vodafone'} onChange={() => setPaymentMethod('vodafone')} className="sr-only" />
                  <div className="flex justify-between items-center mb-2">
                    <Smartphone className={`w-6 h-6 ${paymentMethod === 'vodafone' ? 'text-rose-600' : 'text-muted-foreground'}`} />
                    {paymentMethod === 'vodafone' && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <span className="font-semibold text-lg text-rose-600">Vodafone Cash</span>
                  <span className="text-sm text-muted-foreground">Transfer to {WALLET_PHONE_EN}</span>
                </label>
                
                <label className={`relative flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'instapay' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}>
                  <input type="radio" name="paymentMethod" value="instapay" checked={paymentMethod === 'instapay'} onChange={() => setPaymentMethod('instapay')} className="sr-only" />
                  <div className="flex justify-between items-center mb-2">
                    <Smartphone className={`w-6 h-6 ${paymentMethod === 'instapay' ? 'text-indigo-600' : 'text-muted-foreground'}`} />
                    {paymentMethod === 'instapay' && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <span className="font-semibold text-lg text-indigo-600">InstaPay</span>
                  <span className="text-sm text-muted-foreground">InstaPay: {INSTAPAY_ADDRESS}</span>
                </label>
              </div>

              {/* Instructions & Upload */}
              <div className="bg-gray-50 dark:bg-gray-900 border border-border rounded-xl p-5 mt-4">
                <p className="text-sm font-semibold mb-2">
                  1. Please transfer <span className="text-primary font-bold text-lg">{total.toFixed(2)} EGP</span> to the selected method:
                </p>
                <div className="flex items-center gap-3 p-3 bg-white border border-border shadow-sm rounded-lg mb-4">
                  <span className="font-mono text-xl tracking-widest text-slate-800 font-black flex-1 text-center">
                    {paymentMethod === "vodafone" ? WALLET_PHONE_EN : INSTAPAY_ADDRESS}
                  </span>
                  <Button variant="outline" size="sm" type="button" onClick={() => {
                    navigator.clipboard.writeText(paymentMethod === "vodafone" ? WALLET_PHONE_EN : INSTAPAY_ADDRESS);
                    toast.success("Copied to clipboard!");
                  }}>
                     <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm font-semibold mb-2 mt-4 text-rose-600">
                  2. Upload Payment Receipt / Screenshot <span className="text-destructive">*</span>
                </p>
                <div className="flex gap-2 items-center">
                   <Input 
                     type="file" 
                     accept="image/*"
                     onChange={handleReceiptUpload}
                     className="flex-1 cursor-pointer bg-white"
                     disabled={uploadingReceipt}
                     required={!receiptImage} 
                   />
                   {uploadingReceipt && <Loader2 className="w-5 h-5 animate-spin text-muted-foreground shrink-0" />}
                </div>
                {receiptImage && (
                  <div className="relative inline-block mt-4">
                    <img src={receiptImage} alt="Receipt Preview" className="w-auto h-auto max-h-56 object-contain rounded-xl border-2 border-primary/20 shadow-md bg-white" />
                    <button 
                      type="button" 
                      onClick={() => setReceiptImage("")}
                      className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-1.5 shadow-md transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:w-96 mt-8 lg:mt-0 sticky top-24">
            <div className="bg-white dark:bg-gray-950 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover flex-shrink-0 border" />
                    <div className="flex-1">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-4 border-t border-border text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{cartTotal.toFixed(2)} EGP</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{deliveryMethod === 'pickup' ? 'Free (Pickup)' : (shippingRate ? `${shippingRate.toFixed(2)} EGP` : 'Select Governorate')}</span>
                </div>
                <div className="pt-3 flex justify-between font-bold text-lg text-primary border-t border-border">
                  <span>Total</span>
                  <span>{total.toFixed(2)} EGP</span>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full mt-6 py-6 text-base rounded-xl font-bold gap-2">
                {loading ? <><Loader2 className="w-5 h-5 animate-spin"/> Processing...</> : <>Place Order <ArrowRight className="w-5 h-5" /></>}
              </Button>
            </div>
          </motion.div>

        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
