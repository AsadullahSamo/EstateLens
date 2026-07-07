import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "destructive";
}

const variantClasses = {
  primary: "bg-primary hover:bg-primary-hover text-primary-foreground",
  destructive: "bg-destructive hover:bg-destructive/90 text-primary-foreground",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`rounded-md font-medium text-sm py-3 px-4 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";