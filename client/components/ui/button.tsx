import { ButtonHTMLAttributes, forwardRef } from "react";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`rounded-md bg-primary hover:bg-primary-hover text-primary-foreground font-medium text-sm py-3 px-4 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";