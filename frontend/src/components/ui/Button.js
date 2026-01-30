import { cn } from "@/lib/utils";

export const Button = ({ 
  children, 
  variant = "primary", 
  className, 
  ...props 
}) => {
  const variants = {
    primary: "rounded-full bg-primary text-white hover:scale-105 transition-transform px-8 py-3 font-medium",
    secondary: "border border-white/20 text-white hover:bg-white/10 px-8 py-3 font-medium transition-colors",
    ghost: "text-white hover:text-primary transition-colors px-4 py-2",
  };

  return (
    <button
      className={cn(variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};
