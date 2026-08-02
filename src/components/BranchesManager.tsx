import React, { useState, useEffect } from "react";
import { Building2, Plus, LogIn, Key, ShieldCheck } from "lucide-react";

export default function BranchesManager({
  language,
}: {
  language: "ar" | "en";
}) {
  const isAr = language === "ar";

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Building2 className="h-7 w-7 text-indigo-600" />
            {isAr ? "الهيكلية والفروع" : "Branches & Facilities"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "إدارة هيكلية المستشفى، الفروع، والأجنحة"
              : "Configures the physical and administrative layout of the entire healthcare enterprise."}
          </p>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap  text-slate-700 font-bold">
          <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <div className="text-lg">Main Hospital Campus (HQ)</div>
            <div className="text-xs text-slate-500 font-mono">
              ID: BRN-01 • Active Layers: 5 • Wards: 12
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
