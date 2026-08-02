import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Command, 
  User, 
  FileText, 
  Settings, 
  ClipboardList, 
  Activity,
  Plus,
  ArrowRight,
  Stethoscope,
  ShieldAlert
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CommandItem {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: any;
  action: () => void;
  category: "navigation" | "patient" | "action" | "system";
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const commands: CommandItem[] = [
    { 
      id: "nav-desktop", 
      titleAr: "المكتب السريري", 
      titleEn: "Clinical Desktop", 
      icon: Stethoscope, 
      category: "navigation",
      action: () => { console.log("Navigate to Desktop"); setIsOpen(false); }
    },
    { 
      id: "nav-quality", 
      titleAr: "مركز الجودة", 
      titleEn: "Quality Center", 
      icon: ShieldAlert, 
      category: "navigation",
      action: () => { console.log("Navigate to Quality"); setIsOpen(false); }
    },
    { 
      id: "action-new-patient", 
      titleAr: "تسجيل مريض جديد", 
      titleEn: "Register New Patient", 
      icon: Plus, 
      category: "action",
      action: () => { console.log("New Patient Modal"); setIsOpen(false); }
    },
    { 
      id: "action-tasks", 
      titleAr: "عرض مهامي", 
      titleEn: "View My Tasks", 
      icon: ClipboardList, 
      category: "action",
      action: () => { console.log("Open Tasks"); setIsOpen(false); }
    }
  ];

  const filteredCommands = commands.filter(c => 
    c.titleEn?.toLowerCase()?.includes(query?.toLowerCase()) || 
    c.titleAr?.includes(query)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Palette Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b border-slate-100 flex items-center gap-2 sm:gap-4 flex-wrap ">
          <Search className="w-6 h-6 text-slate-400" />
          <input 
            autoFocus
            type="text"
            placeholder="Search patients, tasks, or commands (Ctrl+K)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-xl font-bold text-slate-900 placeholder:text-slate-300"
          />
          <div className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-500 border border-slate-200">
            ESC
          </div>
        </div>

        <div className="flex-1 overflow-y-auto max-h-[60vh] p-3 space-y-6">
          {/* Categories */}
          {["navigation", "action"].map(cat => {
            const catItems = filteredCommands.filter(i => i.category === cat);
            if (catItems.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h5 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{cat}</h5>
                <div className="space-y-1">
                  {catItems.map((item, idx) => (
                    <button
                      key={item.id}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group text-left"
                    >
                      <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 leading-none">{item.titleEn}</h4>
                          <p className="text-xs text-slate-400 font-medium mt-1">{item.titleAr}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredCommands.length === 0 && (
            <div className="py-20 text-center space-y-4">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                 <Command className="w-5 h-5 sm:w-8 sm:h-8 text-slate-200" />
               </div>
               <p className="text-slate-400 font-bold">No results found for "{query}"</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
           <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-4 bg-white rounded border border-slate-200 flex items-center justify-center shadow-sm">
                  ↑
                </div>
                <div className="w-4 h-4 bg-white rounded border border-slate-200 flex items-center justify-center shadow-sm">
                  ↓
                </div>
                <span>Navigate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-8 h-4 bg-white rounded border border-slate-200 flex items-center justify-center shadow-sm">
                  ENTER
                </div>
                <span>Select</span>
              </div>
           </div>
           <div className="flex items-center gap-2">
              <Activity className="w-3 h-3 text-indigo-500" />
              <span>Hospital Intelligence Active</span>
           </div>
        </div>
      </motion.div>
    </div>
  );
};
