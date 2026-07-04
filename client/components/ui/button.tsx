import { ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`w-full rounded-md bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm py-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";