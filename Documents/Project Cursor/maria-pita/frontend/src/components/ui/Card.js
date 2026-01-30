import { cn } from "@/lib/utils";

export const Card = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        "bg-surface border border-white/5 hover:border-primary/50 transition-colors duration-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
