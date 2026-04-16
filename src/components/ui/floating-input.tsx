import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, error, required, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const hasValue = props.value !== undefined && props.value !== "";

    return (
      <div className={cn("relative w-full pb-5", className)}>
        <div className="relative">
          <input
            {...props}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "flex h-12 w-full rounded-xl border bg-background px-4 pt-4 pb-1 text-sm shadow-sm transition-all outline-none",
              error 
                ? "border-destructive focus-visible:ring-1 focus-visible:ring-destructive" 
                : "border-input focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary",
              className
            )}
            placeholder=" " // necessary for the :placeholder-shown trick if used, but we use state
          />
          <motion.label
            initial={false}
            animate={{
              y: isFocused || hasValue ? -10 : 0,
              scale: isFocused || hasValue ? 0.85 : 1,
              color: error ? "hsl(var(--destructive))" : isFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
            }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute left-4 top-3.5 origin-top-left pointer-events-none text-base"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </motion.label>
        </div>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 left-1 text-xs text-destructive font-medium"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);
FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
