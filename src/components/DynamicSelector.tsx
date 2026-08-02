import React, { useState, useEffect, useRef } from 'react';
import { useHIS } from '../context/HISContext';
import { Search, ChevronDown, Plus, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DynamicSelectorProps {
  category: string;
  labelAr: string;
  labelEn: string;
  value: string;
  onChange: (value: string) => void;
  language: 'ar' | 'en';
  placeholder?: string;
  required?: boolean;
  module?: string;
  screen?: string;
  fieldName?: string;
  className?: string;
}

export default function DynamicSelector({
  category,
  labelAr,
  labelEn,
  value,
  onChange,
  language,
  placeholder,
  required,
  module,
  screen,
  fieldName,
  className = ""
}: DynamicSelectorProps) {
  const isAr = language === 'ar';
  const { masterData, addMasterData, currentUser } = useHIS();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter official master data for this category
  const options = masterData.filter(m => m.category === category && (m.isOfficial || m.status === 'approved'));
  
  // Also check if current value is a custom one not yet approved
  const currentEntry = masterData.find(m => m.category === category && (m.valueEn === value || m.valueAr === value));

  const filteredOptions = options.filter(opt => 
    opt.valueEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    opt.valueAr.includes(searchTerm)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt: any) => {
    onChange(isAr ? opt.valueAr : opt.valueEn);
    setIsOpen(false);
    setShowCustomInput(false);
  };

  const handleAddCustom = () => {
    if (!customValue.trim()) return;

    // Check if it already exists in master data (any status)
    const exists = masterData.find(m => 
      m.category === category && 
      (m.valueEn.toLowerCase() === customValue.toLowerCase() || m.valueAr === customValue)
    );

    if (exists) {
      handleSelect(exists);
      setCustomValue("");
      return;
    }

    // Add as pending
    addMasterData({
      category,
      valueEn: customValue, // For now we use the same for both if not provided
      valueAr: customValue,
      createdBy: currentUser?.nameEn || "Unknown",
      module,
      screen,
      fieldName,
      department: currentUser?.departmentId
    });

    onChange(customValue);
    setCustomValue("");
    setShowCustomInput(false);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (!value) return placeholder || (isAr ? "اختر..." : "Select...");
    const opt = options.find(o => o.valueEn === value || o.valueAr === value);
    if (opt) return isAr ? opt.valueAr : opt.valueEn;
    return value; // Return custom value if selected
  };

  return (
    <div className={`relative ${className}`} ref={containerRef} dir={isAr ? 'rtl' : 'ltr'}>
      <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 px-1">
        {isAr ? labelAr : labelEn} {required && <span className="text-rose-500">*</span>}
      </label>

      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full h-11 px-4 bg-white border rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-sm group ${
          isOpen ? 'border-indigo-500 ring-4 ring-indigo-50' : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <span className={`text-sm truncate ${!value ? 'text-slate-400' : 'font-bold text-slate-800'}`}>
          {getDisplayValue()}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute z-dropdown w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[400px]"
          >
            {!showCustomInput ? (
              <>
                <div className="p-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="relative">
                    <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      autoFocus
                      type="text"
                      className="w-full h-9 ltr:pl-10 rtl:pr-10 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:border-indigo-400"
                      placeholder={isAr ? "بحث..." : "Search..."}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>

                <div className="overflow-y-auto flex-1 custom-scrollbar">
                  {filteredOptions.length > 0 ? (
                    <div className="p-1">
                      {filteredOptions.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleSelect(opt)}
                          className={`w-full px-4 py-2.5 text-right flex items-center justify-between rounded-lg hover:bg-slate-50 transition-colors group ${
                            (value === opt.valueEn || value === opt.valueAr) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'
                          }`}
                        >
                          <span className="text-xs font-bold">{isAr ? opt.valueAr : opt.valueEn}</span>
                          {(value === opt.valueEn || value === opt.valueAr) && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                         <AlertCircle className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-xs text-slate-500 font-medium">{isAr ? "لا يوجد نتائج" : "No results found"}</p>
                    </div>
                  )}

                  <div className="p-1 border-t border-slate-100 bg-slate-50/30">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCustomInput(true);
                      }}
                      className="w-full px-4 py-3 text-right flex items-center gap-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors group"
                    >
                      <Plus className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">{isAr ? "إضافة قيمة مخصصة (Other...)" : "Add Custom Value (Other...)"}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-tighter text-slate-800">
                    {isAr ? "إضافة قيمة جديدة" : "Add New Value"}
                  </h4>
                  <button 
                    onClick={() => setShowCustomInput(false)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600"
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                </div>

                <div className="space-y-2">
                  <input 
                    autoFocus
                    type="text"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all"
                    placeholder={isAr ? "أدخل القيمة الجديدة هنا..." : "Enter new value here..."}
                    value={customValue}
                    onChange={(e) => setCustomValue(e.target.value)}
                  />
                  <p className="text-[9px] text-slate-500 leading-relaxed italic">
                    {isAr 
                      ? "* ستتم إضافة هذه القيمة كبيانات معلقة (Pending) للمراجعة من قبل الإدارة، ولكن يمكنك استخدامها فوراً."
                      : "* This value will be added as Pending Master Data for review, but you can use it immediately."
                    }
                  </p>
                </div>

                <button
                  onClick={handleAddCustom}
                  disabled={!customValue.trim()}
                  className="w-full h-11 bg-indigo-600 disabled:bg-slate-200 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all active:scale-[0.98]"
                >
                  {isAr ? "تأكيد الإضافة" : "Confirm & Use"}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
