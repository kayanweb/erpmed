import React from "react";
import { HISModule } from "./moduleConfig";
import { DynamicProfessionalLogo } from "../DynamicProfessionalLogo";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface HISSidebarProps {
  modules: HISModule[];
  activeModule: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  isAr: boolean;
  onModuleSelect: (moduleId: string) => void;
  hospitalSettings?: any;
  isMobile?: boolean;
}

export const HISSidebar: React.FC<HISSidebarProps> = ({
  modules,
  activeModule,
  isSidebarOpen,
  setIsSidebarOpen,
  isAr,
  onModuleSelect,
  hospitalSettings,
  isMobile = false,
}) => {
  return (
    <motion.div
      initial={false}
      animate={{
        x: isMobile 
          ? (isSidebarOpen ? 0 : (isAr ? "100%" : "-100%")) 
          : 0,
        width: isSidebarOpen ? (isMobile ? 280 : 288) : (isMobile ? 280 : 88)
      }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={`fixed lg:static inset-y-0 ${isAr ? "right-0" : "left-0"} z-50 text-white flex-shrink-0 flex flex-col border-${isAr ? "l" : "r"} border-slate-800 shadow-2xl lg:shadow-[4px_0_24px_rgba(0,0,0,0.05)] overflow-hidden`}
      style={{
        backgroundColor: "#0f172a",
        backgroundImage: "linear-gradient(to bottom, #0f172a, #1e293b)"
      }}
    >
      <div className="h-16 flex items-center justify-between px-3 border-b border-white/10 shrink-0 overflow-hidden">
        <DynamicProfessionalLogo
          nameAr={hospitalSettings?.nameAr || "مستشفى الرعاية السريرية الموحدة"}
          nameEn={hospitalSettings?.nameEn || "Unified Clinical Care Hospital"}
          taglineAr={hospitalSettings?.taglineAr || "نحو رعاية طبية آمنة وممتازة وجودة مستدامة"}
          taglineEn={hospitalSettings?.taglineEn || "Towards Safe, Quality & Standardized Patient Care"}
          size="sm"
          isAr={isAr}
          dark={true}
          hideText={!isSidebarOpen}
        />
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar py-4 space-y-1 px-2">
        {modules.map((module) => {
          const MIcon = module.icon;
          const isModuleActive = activeModule === module.id;
          return (
            <div key={module.id} className="flex flex-col">
              <button
                onClick={() => onModuleSelect(module.id)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all duration-200 group ${isModuleActive ? "bg-indigo-600 text-white font-semibold shadow-lg shadow-indigo-600/20" : "bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white font-medium"}`}
              >
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <MIcon className={`w-5 h-5 shrink-0 ${isModuleActive ? "text-white" : "text-slate-400"}`} />
                  <span className={`whitespace-nowrap ${!isSidebarOpen && "md:hidden"}`}>
                    {isAr ? module.labelAr : module.labelEn}
                  </span>
                </div>
              </button>
            </div>
          );
        })}
      </div>

      <div className={`p-4 text-xs text-white/50 border-t border-white/10 shrink-0 whitespace-nowrap ${!isSidebarOpen && "md:hidden"}`}>
        © 2024 Medica CloudCare
        <br />
        v2.5.1
      </div>
    </motion.div>
  );
};
