import React from "react";
import { toast } from "sonner";

interface SafeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: () => Promise<void> | void;
  successMessage?: string;
  errorMessage?: string;
  isAr?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function SafeButton({ 
  children, 
  action, 
  successMessage, 
  errorMessage = "Operation failed", 
  isAr,
  className,
  ...props 
}: SafeButtonProps) {
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await action();
      if (successMessage) toast.success(successMessage);
    } catch (err) {
      console.error(err);
      toast.error(errorMessage);
    }
  };

  return (
    <button 
      {...props} 
      onClick={handleClick} 
      className={`transition ${className}`}
    >
      {children}
    </button>
  );
}
