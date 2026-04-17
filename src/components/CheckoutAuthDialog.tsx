import { Link } from "react-router-dom";
import { LogIn, UserPlus, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface CheckoutAuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo: string;
}

const CheckoutAuthDialog = ({ open, onOpenChange, redirectTo }: CheckoutAuthDialogProps) => {
  const { isRTL } = useLanguage();
  const loginHref = `/login?redirect=${encodeURIComponent(redirectTo)}`;
  const registerHref = `/register?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[94vw] overflow-hidden rounded-2xl border-0 bg-transparent p-0 shadow-none sm:max-w-md">
        <div className="rounded-2xl border border-border/60 bg-background shadow-2xl">
          <div className="bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-6 pb-4">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <DialogHeader className="space-y-2 text-start">
              <DialogTitle className="text-2xl font-black">
                {isRTL ? "اكمل طلبك بأمان" : "Complete your order securely"}
              </DialogTitle>
              <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
                {isRTL
                  ? "علشان نكمل الدفع وتتبع الطلب، محتاجين تسجّل دخول أو تنشئ حساب جديد في دقيقة واحدة."
                  : "To continue checkout and track your order, please sign in or create an account."}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="grid gap-3 p-6 pt-4">
            <Button asChild className="h-12 rounded-xl text-base font-bold">
              <Link to={registerHref}>
                <UserPlus className="me-2 h-5 w-5" />
                {isRTL ? "إنشاء حساب جديد" : "Create Account"}
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12 rounded-xl text-base font-bold">
              <Link to={loginHref}>
                <LogIn className="me-2 h-5 w-5" />
                {isRTL ? "تسجيل الدخول" : "Sign In"}
              </Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutAuthDialog;
