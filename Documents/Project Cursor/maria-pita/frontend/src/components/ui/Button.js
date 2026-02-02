import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export const Button = ({ 
  children, 
  variant = "primary", 
  className,
  as,
  href,
  to,
  ...props 
}) => {
  const variants = {
    primary: "rounded-full bg-primary text-white hover:scale-105 transition-transform px-8 py-3 font-medium",
    secondary: "border border-white/20 text-white hover:bg-white/10 px-8 py-3 font-medium transition-colors",
    ghost: "text-white hover:text-primary transition-colors px-4 py-2",
  };

  const classes = cn(variants[variant], className);

  // Se for um link externo
  if (as === "a" && href) {
    return (
      <a
        href={href}
        className={classes}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Se for um link interno (react-router)
  if (to) {
    return (
      <Link
        to={to}
        className={classes}
        {...props}
      >
        {children}
      </Link>
    );
  }

  // Se for um botão normal
  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
};
