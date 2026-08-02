import React, { useState, useMemo } from "react";
import { 
  Siren, UserPlus, X, Bell, User, Clock, ShieldCheck, Timer
} from "lucide-react";
import { AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { ComprehensiveRegistrationModal } from "./ComprehensiveRegistrationModal";
import { AdmissionRequestDialog } from "./AdmissionRequestDialog";
import { ERTrackingBoard } from "./ER/ERTrackingBoard";
import { ERPatientWorkspace } from "./ER/ERPatientWorkspace";

export default function ERDashboard({ language, onOpenPatientChart }: { language: "ar" | "en", onOpenPatientChart?: (id: string, name: string, tab?: string) => void }) {
  const isAr = language === "ar";
  const { patients = [], addPatient } = useHIS();
  
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const activePatient = useMemo(() => patients.find(p => p.id === selectedPatientId), [patients, selectedPatientId]);

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Universal ER Header */}
      <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 z-30 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-200">
                <Siren className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase">{isAr ? "قسم الطوارئ" : "Emergency Department"}</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Enterprise HIS Integration • v4.0</p>
             </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl">
             <button className="px-6 py-2 bg-white rounded-xl shadow-sm text-xs font-black text-slate-800 uppercase tracking-widest transition-all">
                Tracking Board
             </button>
             <button className="px-6 py-2 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all">
                Wait List
             </button>
             <button className="px-6 py-2 text-xs font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all">
                Resources
             </button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
           <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-500">
              <Timer size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Shift Time: 04:12:45</span>
           </div>
           
           <button 
             onClick={() => setIsRegistrationModalOpen(true)}
             className="flex items-center gap-3 px-6 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200 hover:scale-[1.02] active:scale-95 transition-all"
           >
              <UserPlus size={16} />
              <span>{isAr ? "تسجيل مريض" : "Quick Register"}</span>
           </button>

           <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer relative transition-colors">
              <Bell size={20} />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-600 rounded-full border-2 border-white"></div>
           </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
        <ERTrackingBoard 
          isAr={isAr} 
          onSelectPatient={(id) => setSelectedPatientId(id)} 
        />

        {/* Clinical Workspace Modal/Overlay */}
        <AnimatePresence>
          {selectedPatientId && (
            <ERPatientWorkspace 
              patientId={selectedPatientId}
              isAr={isAr}
              onClose={() => setSelectedPatientId(null)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* Persistence / Modals */}
      <ComprehensiveRegistrationModal
        isOpen={isRegistrationModalOpen}
        isAr={isAr}
        onClose={() => setIsRegistrationModalOpen(false)}
        onRegister={(data) => {
          addPatient(data);
          setIsRegistrationModalOpen(false);
        }}
        defaultEmergencyMode={true}
      />
    </div>
  );
}
