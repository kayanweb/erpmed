import React, { useState, useEffect, useRef } from "react";
import { Search, Stethoscope, UserPlus, FileText, Pill, Activity, Calendar } from "lucide-react";

export default function EnterpriseCommandPalette({ isAr }: { isAr?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const commands = [
    { icon: UserPlus, labelEn: "Register New Patient", labelAr: "تسجيل مريض جديد", action: () => window.dispatchEvent(new CustomEvent('openPatientRegistration')) },
    { icon: Stethoscope, labelEn: "Open ER Dashboard", labelAr: "فتح لوحة الطوارئ", action: () => console.log('ER Dashboard') },
    { icon: Activity, labelEn: "Order Lab Test", labelAr: "طلب فحص مختبر", action: () => console.log('Order Lab') },
    { icon: Pill, labelEn: "Order Medication", labelAr: "صرف أدوية", action: () => console.log('Order Meds') },
    { icon: Calendar, labelEn: "View My Schedule", labelAr: "عرض جدولي", action: () => console.log('View Schedule') }
  ];

  const filteredCommands = query 
    ? commands.filter(cmd => (cmd.labelEn + cmd.labelAr).toLowerCase().includes(query.toLowerCase()))
    : commands;

  return (
    <div className="fixed inset-0 z-modal flex items-start justify-center pt-[10vh] bg-slate-900/50 backdrop-blur-sm" dir={isAr ? "rtl" : "ltr"} onClick={() => setIsOpen(false)}>
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center px-4 py-3 border-b border-slate-100">
          <Search className="w-5 h-5 text-indigo-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="flex-1 bg-transparent border-none focus:ring-0 outline-none px-3 text-lg text-slate-800 placeholder:text-slate-400"
            placeholder={isAr ? "اكتب أمرك هنا (مثال: طلب باراسيتامول)..." : "Type a command or search (e.g. Order Paracetamol)..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">ESC</div>
        </div>
        
        <div className="max-h-96 overflow-y-auto p-2">
          {filteredCommands.length > 0 ? (
            <div className="space-y-1">
              {filteredCommands.map((cmd, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    cmd.action();
                    setIsOpen(false);
                  }}
                  className="w-full flex flex-wrap items-center gap-2 sm:gap-3 px-3 py-3 rounded-xl hover:bg-indigo-50 transition-colors text-left"
                >
                  <div className="w-5 h-5 sm:w-8 sm:h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                    <cmd.icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-slate-700 text-sm">
                    {isAr ? cmd.labelAr : cmd.labelEn}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-sm">
              {isAr ? "لم يتم العثور على أوامر مطابقة" : "No matching commands found"}
            </div>
          )}
        </div>
        <div className="bg-slate-50 border-t border-slate-100 px-4 py-2 text-xs text-slate-500 flex items-center justify-between">
          <span>{isAr ? "الوضع الذكي نشط" : "Smart Mode Active"}</span>
          <div className="flex gap-2 min-w-max">
            <span className="flex items-center gap-1"><span className="bg-slate-200 px-1 rounded">↑↓</span> {isAr ? "للتنقل" : "to navigate"}</span>
            <span className="flex items-center gap-1"><span className="bg-slate-200 px-1 rounded">Enter</span> {isAr ? "للتحديد" : "to select"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
