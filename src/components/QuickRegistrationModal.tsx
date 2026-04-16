import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { registerUser } from "@/services/authService";
import { useShippingRates } from "@/hooks/useShippingRates";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface QuickRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const QuickRegistrationModal = ({ isOpen, onClose, onSuccess }: QuickRegistrationModalProps) => {
  const [formData, setFormData] = useState({ name: "", phone: "", password: "", governorate: "" });
  const [loading, setLoading] = useState(false);
  const { rates } = useShippingRates();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.password || !formData.governorate) {
      toast.error("Please fill all required fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      // Generate a dummy email from the phone number since firebase auth needs an email by default 
      // without setting up phone auth which requires sms and captcha
      const generatedEmail = `${formData.phone}@shop-vibe.local`;
      
      await registerUser(generatedEmail, formData.password, {
        name: formData.name,
        phone: formData.phone,
        governorate: formData.governorate,
      });

      toast.success("Account created successfully!");
      onSuccess();
    } catch (error: any) {
      // If email is in use, maybe they already registered with this phone
      if (error.message.includes('Email is already registered')) {
        toast.error("This phone number is already registered. Please login instead.");
      } else {
        toast.error(error.message || "Failed to create account");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-background">
        <div className="bg-gradient-to-r from-primary/10 to-transparent p-6 pb-4 relative">
          <div className="absolute top-4 right-4">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
            <UserPlus className="w-6 h-6 text-primary" />
          </div>
          <DialogTitle className="text-xl font-bold mb-2">Welcome to Shop Vibe!</DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            It looks like you are new here. Please create a quick account to continue your purchase safely.
          </DialogDescription>
        </div>

        <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
            <Input 
              placeholder="e.g. Ahmed Ali" 
              value={formData.name}
              onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
              required 
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Phone Number <span className="text-destructive">*</span></label>
            <Input 
              type="tel"
              placeholder="01xxxxxxxxx" 
              value={formData.phone}
              onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Password <span className="text-destructive">*</span></label>
            <Input 
              type="password"
              placeholder="Min. 6 characters" 
              value={formData.password}
              onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))}
              required 
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Governorate <span className="text-destructive">*</span></label>
            <select 
              className="w-full h-10 px-3 rounded-md border border-input bg-transparent text-sm"
              value={formData.governorate}
              onChange={(e) => setFormData(p => ({ ...p, governorate: e.target.value }))}
              required
            >
              <option value="">Select your Governorate</option>
              {rates.filter(r => r.isActive).map(rate => (
                <option key={rate.id} value={rate.name}>{rate.name}</option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full rounded-xl py-6 text-base font-semibold" disabled={loading}>
              {loading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin"/> Creating account...</>
              ) : (
                "Create Account & Continue"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default QuickRegistrationModal;
