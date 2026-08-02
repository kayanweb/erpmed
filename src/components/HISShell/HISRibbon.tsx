import React from "react";
import { HISModule } from "./moduleConfig";

interface HISRibbonProps {
  activeModule: HISModule | undefined;
  activeSubTab: string;
  onSubTabSelect: (subId: string) => void;
  isAr: boolean;
}

export const HISRibbon: React.FC<HISRibbonProps> = ({
  activeModule,
  activeSubTab,
  onSubTabSelect,
  isAr,
}) => {
  if (!activeModule || !activeModule.subItems || activeModule.subItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border-b border-slate-200 shrink-0 shadow-sm z-10 ">
      <div className="overflow-x-auto hide-scrollbar">
        <div className="flex p-1 sm:p-2 gap-1 items-center px-4 sm:px-8">
          {activeModule.subItems.map((sub) => {
            const isActive = activeSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => onSubTabSelect(sub.id)}
                className={`whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-lg transition-all duration-200 ${isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 border-indigo-600" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent"}`}
              >
                {isAr ? sub.labelAr : sub.labelEn}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
