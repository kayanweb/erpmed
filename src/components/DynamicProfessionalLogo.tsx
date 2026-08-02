import React from "react";
import { Heart, Activity, ShieldAlert, Sparkles, Star, Award, Layers } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

interface Props {
  nameAr?: string;
  nameEn?: string;
  taglineAr?: string;
  taglineEn?: string;
  size?: "sm" | "md" | "lg" | "xl" | "print";
  isAr?: boolean;
  dark?: boolean;
  hideText?: boolean;
}

export const DynamicProfessionalLogo: React.FC<Props> = ({
  nameAr,
  nameEn,
  taglineAr,
  taglineEn,
  size = "md",
  isAr = true,
  dark = false,
  hideText = false,
}) => {
  let settings: any = null;
  try {
    const res = useSettings();
    settings = res?.settings;
  } catch (e) {
    // Graceful fallback if called outside SettingsProvider
  }

  const normAr = settings?.institutionNameAr || nameAr || "مستشفى الرعاية السريرية الموحدة";
  const normEn = settings?.institutionNameEn || nameEn || "Unified Clinical Care Hospital";
  const finalTaglineAr = settings?.taglineAr || taglineAr || "نحو رعاية طبية آمنة وممتازة وجودة مستدامة";
  const finalTaglineEn = settings?.taglineEn || taglineEn || "Towards Safe, Quality & Standardized Patient Care";

  // Choose a clean professional color scheme (Teal / Blue)
  const isDark = dark;
  const primaryColor = isDark ? "#2dd4bf" : "#0f766e"; // teal-400 / teal-700
  const secondaryColor = isDark ? "#38bdf8" : "#0284c7"; // sky-400 / sky-600
  const gradientId = "professionalLogoGrad" + (isDark ? "Dark" : "Light");

  // A visually stunning, highly professional glowing geometric mark
  const renderProfessionalMark = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-lg">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id={`${gradientId}-alt`} x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={secondaryColor} />
          <stop offset="100%" stopColor={primaryColor} />
        </linearGradient>
      </defs>
      
      {/* Outer elegant rounded square shape */}
      <rect x="5" y="5" width="90" height="90" rx="28" fill={`url(#${gradientId}-alt)`} opacity="0.1" />
      <rect x="15" y="15" width="70" height="70" rx="20" fill={`url(#${gradientId})`} />
      
      {/* Medical Cross composed of intersecting curved elements indicating unity and care */}
      <path d="M 50 30 C 50 30 50 40 40 50 C 50 60 50 70 50 70 C 50 70 60 60 60 50 C 60 40 50 30 50 30 Z" fill="#ffffff" opacity="0.9" />
      <path d="M 30 50 C 30 50 40 50 50 40 C 60 50 70 50 70 50 C 70 50 60 60 50 60 C 40 60 30 50 30 50 Z" fill="#ffffff" opacity="0.9" />
      
      <circle cx="50" cy="50" r="6" fill="#ffffff" />
    </svg>
  );

  const getSizingClasses = () => {
    switch (size) {
      case "sm": return "h-8 sm:h-10";
      case "md": return "h-12 sm:h-14";
      case "lg": return "h-16 sm:h-20";
      case "xl": return "h-24 sm:h-28";
      case "print": return "h-16";
      default: return "h-12";
    }
  };

  const markSizeClasses = () => {
    switch (size) {
      case "sm": return "w-8 h-8 sm:w-10 sm:h-10";
      case "md": return "w-12 h-12 sm:w-14 sm:h-14";
      case "lg": return "w-16 h-16 sm:w-20 sm:h-20";
      case "xl": return "w-24 h-24 sm:w-28 sm:h-28";
      case "print": return "w-16 h-16";
      default: return "w-12 h-12";
    }
  };

  // If hideText is true, render *only* the logomark in its pristine form
  if (hideText) {
    return (
      <div className={`flex items-center justify-center shrink-0 ${markSizeClasses()}`}>
        {renderProfessionalMark()}
      </div>
    );
  }

  // Full lockup (Mark + Text)
  return (
    <div className={`flex items-center gap-3 sm:gap-4 select-none ${isAr ? "flex-row" : "flex-row-reverse"}`}>
      <div className={`flex items-center justify-center shrink-0 ${markSizeClasses()}`}>
        {renderProfessionalMark()}
      </div>
      
      <div className={`flex flex-col justify-center ${isAr ? "text-right" : "text-left"}`}>
        <h1 className={`font-black tracking-tight leading-tight transition-colors
          ${size === 'sm' ? 'text-xs sm:text-sm' : 
            size === 'md' ? 'text-base sm:text-lg' : 
            size === 'lg' ? 'text-xl sm:text-2xl' : 
            size === 'xl' ? 'text-2xl sm:text-3xl' : 'text-xl'}
          ${isDark ? "text-white" : "text-slate-900"}
        `}>
          {isAr ? normAr : normEn}
        </h1>
        
        <h2 className={`font-mono uppercase tracking-widest leading-relaxed mt-0.5
          ${size === 'sm' ? 'text-[8px] sm:text-[9px]' : 
            size === 'md' ? 'text-[10px]' : 
            size === 'lg' || size === 'xl' ? 'text-xs' : 'text-[10px]'}
          ${isDark ? "text-teal-400" : "text-teal-700"}
        `}>
          {isAr ? normEn : normAr}
        </h2>
        
        {size !== 'sm' && (
          <div className="flex items-center gap-1.5 mt-1 sm:mt-1.5 opacity-80">
            <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isDark ? "bg-teal-400" : "bg-teal-600"}`}></span>
            <span className={`font-medium tracking-wide uppercase max-w-[200px] sm:max-w-xs truncate
              ${
                size === 'md' ? 'text-[8.5px]' : 
                size === 'lg' || size === 'xl' ? 'text-[10px]' : 'text-[8px]'}
              ${isDark ? "text-slate-300" : "text-slate-500"}
            `}>
              {isAr ? finalTaglineAr : finalTaglineEn}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
