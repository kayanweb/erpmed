import React, { useEffect } from "react";
import { createPortal } from "react-dom";

interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  dir?: "rtl" | "ltr";
}

export const BaseDialog: React.FC<BaseDialogProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  className = "max-w-lg", 
  dir = "ltr" 
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-modal flex items-center justify-center p-4" dir={dir}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 w-full relative z-[10000000] ${className}`}>
        {children}
      </div>
    </div>,
    document.body
  );
};
