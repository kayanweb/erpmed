import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

interface ComboboxOption {
  value: string;
  ar: string;
  en: string;
  category?: string;
  defaultDose?: string;
  defaultSig?: string;
  defaultSigAr?: string;
  defaultQty?: number;
}

interface Props {
  options: ComboboxOption[];
  value: string;
  onChange: (val: string, option?: ComboboxOption) => void;
  placeholder?: string;
  isAr?: boolean;
}

export default function SearchableCombobox({ options, value, onChange, placeholder = "", isAr = false }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Find currently selected option to display its human-friendly label
  const selectedOption = options.find(opt => opt.value === value || opt.ar === value || opt.en === value);
  const displayLabel = selectedOption 
    ? (isAr ? selectedOption.ar : selectedOption.en) 
    : value;

  // Filter options based on search query
  const filtered = options.filter(opt => {
    const q = search?.toLowerCase().trim();
    if (!q) return true;
    return (
      opt.en?.toLowerCase()?.includes(q) ||
      opt.ar?.toLowerCase()?.includes(q) ||
      (opt.category && opt.category?.toLowerCase()?.includes(q)) ||
      opt.value?.toLowerCase()?.includes(q)
    );
  });

  return (
    <div ref={containerRef} className="relative w-full text-right" dir={isAr ? "rtl" : "ltr"}>
      {/* Trigger Button/Field */}
      <div 
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch(""); // Reset search on open
        }}
        className="w-full border border-slate-250 bg-white rounded-lg p-2 text-xs flex items-center justify-between cursor-pointer hover:border-blue-400 transition shadow-xs"
      >
        <span className={`truncate flex-1 ${!displayLabel ? "text-slate-400" : "text-slate-800 font-medium"}`}>
          {displayLabel || placeholder}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 ml-1" />
      </div>

      {/* Floating Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-dropdown mt-1 w-full bg-white border border-slate-200 rounded-xl shadow-xl animate-fade overflow-hidden">
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              className="w-full bg-transparent border-0 text-xs focus:ring-0 outline-none placeholder-slate-400 text-slate-850"
              placeholder={isAr ? "اكتب للبحث السريع في القائمة..." : "Type to filter items instantly..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-xs text-slate-400 italic">
                {isAr ? "لا توجد نتائج مطابقة" : "No matching items found"}
              </div>
            ) : (
              filtered.map(opt => {
                const label = isAr ? opt.ar : opt.en;
                const secondaryLabel = isAr ? opt.en : opt.ar;
                const isSelected = value === opt.value || value === opt.ar || value === opt.en;

                return (
                  <div
                    key={opt.value}
                    onClick={() => {
                      onChange(label, opt);
                      setIsOpen(false);
                      setSearch("");
                    }}
                    className={`p-2.5 text-xs text-right cursor-pointer flex items-center justify-between transition ${
                      isSelected 
                        ? "bg-blue-50 text-blue-700 font-bold" 
                        : "hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{label}</div>
                      <div className="text-[10px] text-slate-400 truncate mt-0.5">
                        {opt.category && <span className="bg-slate-100 text-slate-600 px-1 py-0.2 rounded mr-1">{opt.category}</span>}
                        {secondaryLabel}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0 ml-1.5" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
