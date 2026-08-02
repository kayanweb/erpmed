import React, { useState, useRef, useEffect } from "react";
import { Search, User, FileText, Activity } from "lucide-react";
import { useHIS } from "../context/HISContext";

interface Props {
  language: "ar" | "en";
}

export function GlobalSearch({ language }: Props) {
  const isAr = language === "ar";
  const { patients } = useHIS();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = patients.filter(p => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      (p.mrn && p.mrn.toLowerCase().includes(q)) ||
      (p.nameEn && p.nameEn.toLowerCase().includes(q)) ||
      (p.nameAr && p.nameAr.toLowerCase().includes(q)) ||
      (p.phone && p.phone.toLowerCase().includes(q))
    );
  }).slice(0, 5); // Limit to 5

  const handleSelect = (patient: any) => {
    window.dispatchEvent(new CustomEvent("openPatientChart", { 
      detail: { patientId: patient.mrn || patient.id, patientName: isAr ? patient.nameAr : patient.nameEn, initialTab: "summary" } 
    }));
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="flex items-center relative flex-1 max-w-sm w-full mx-2 sm:mx-4">
      <Search className={`absolute ${isAr ? "right-2.5 sm:right-3" : "left-2.5 sm:left-3"} top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400`} />
      <input
        type="text"
        placeholder={isAr ? "بحث بالرقم الطبي أو الاسم..." : "Search MRN or Name..."}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className={`w-full ${isAr ? "pr-8 sm:pr-9 pl-2 sm:pl-3" : "pl-8 sm:pl-9 pr-2 sm:pr-3"} py-1.5 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm`}
      />
      
      {isOpen && query.trim() !== "" && (
        <div className={`absolute top-full mt-1 ${isAr ? 'right-0' : 'left-0'} w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-dropdown`}>
          {results.length > 0 ? (
            <div className="py-2 max-h-64 overflow-y-auto">
              {results.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => handleSelect(p)}
                  className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{isAr ? p.nameAr : p.nameEn}</div>
                      <div className="font-mono text-xs text-slate-500">MRN: {p.mrn}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              {isAr ? "لا توجد نتائج" : "No results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
