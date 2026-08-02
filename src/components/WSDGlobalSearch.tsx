import React, { useState, useRef, useEffect } from "react";
import { Search, FileText, Database, User } from "lucide-react";

interface Props {
  language: "ar" | "en";
  systemUsers?: any[];
  allAvailableTemplates?: any[];
  setActiveTab?: (tab: string) => void;
}

export function WSDGlobalSearch({ language, systemUsers = [], allAvailableTemplates = [], setActiveTab }: Props) {
  const isAr = language === "ar";
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

  const results = [];
  
  if (query.trim()) {
    const q = query.toLowerCase();
    
    // Search users
    systemUsers.filter(u => 
      (u.nameEn && u.nameEn.toLowerCase().includes(q)) || 
      (u.nameAr && u.nameAr.toLowerCase().includes(q)) ||
      (u.staffId && u.staffId.toLowerCase().includes(q))
    ).slice(0, 3).forEach(u => {
      results.push({ type: 'user', id: u.staffId, nameEn: u.nameEn, nameAr: u.nameAr, icon: User });
    });

    // Search templates
    allAvailableTemplates.filter(t =>
      (t.titleEn && t.titleEn.toLowerCase().includes(q)) ||
      (t.titleAr && t.titleAr.toLowerCase().includes(q)) ||
      (t.formCode && t.formCode.toLowerCase().includes(q))
    ).slice(0, 3).forEach(t => {
      results.push({ type: 'template', id: t.formCode, nameEn: t.titleEn, nameAr: t.titleAr, icon: FileText });
    });
  }

  const handleSelect = (item: any) => {
    if (setActiveTab) {
      if (item.type === 'user') setActiveTab('it_panel'); // or some WSD user module
      else if (item.type === 'template') setActiveTab('it_panel'); 
    }
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="flex items-center relative flex-1 max-w-sm w-full mx-2 sm:mx-4">
      <Search className={`absolute ${isAr ? "right-2.5 sm:right-3" : "left-2.5 sm:left-3"} top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400`} />
      <input
        type="text"
        placeholder={isAr ? "البحث في بوابة WSD (موظفين، قوالب)..." : "Search WSD Portal (Staff, Templates)..."}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className={`w-full ${isAr ? "pr-8 sm:pr-9 pl-2 sm:pl-3" : "pl-8 sm:pl-9 pr-2 sm:pr-3"} py-1.5 sm:py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all shadow-sm`}
      />
      
      {isOpen && query.trim() !== "" && (
        <div className={`absolute top-full mt-1 ${isAr ? 'right-0' : 'left-0'} w-full bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-dropdown`}>
          {results.length > 0 ? (
            <div className="py-2 max-h-64 overflow-y-auto">
              {results.map((item, idx) => (
                <div 
                   key={idx} 
                   onClick={() => handleSelect(item)}
                   className="px-4 py-2 hover:bg-slate-50 cursor-pointer flex items-center justify-between group transition-colors"
                >
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 group-hover:bg-pink-100 transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <div className="text-right flex-1">
                      <div className="font-bold text-sm text-slate-800">{isAr ? item.nameAr : item.nameEn}</div>
                      <div className="font-mono text-[10px] text-slate-500">{item.id} • {item.type}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-slate-500">
              {isAr ? "لا توجد نتائج في بوابة WSD" : "No WSD results found"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
