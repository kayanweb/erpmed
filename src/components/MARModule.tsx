import React, { useState, useMemo } from "react";
import { 
  Pill, Clock, CheckCircle2, AlertTriangle, Syringe, 
  Search, Filter, ChevronRight, User, Calendar, 
  Barcode, ClipboardCheck, History, AlertCircle, Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { toast } from "sonner";

export default function MARModule({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  const { patients, prescriptions, administerMedication, marRecords = [] } = useHIS();
  
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeMar, setActiveMar] = useState<any | null>(null);

  const activePatient = useMemo(() => patients.find(p => p.id === selectedPatientId), [patients, selectedPatientId]);

  const patientMars = useMemo(() => {
    if (!selectedPatientId) return [];
    // In a real system, we'd fetch MAR specifically, but here we combine prescriptions + MAR records
    return prescriptions.filter(p => p.patientId === selectedPatientId).map(rx => {
      const administered = (marRecords || []).filter((m: any) => m.prescriptionId === rx.id);
      return { ...rx, administered };
    });
  }, [selectedPatientId, prescriptions, marRecords]);

  const handleAdminister = async () => {
    if (!activeMar) return;
    try {
      await administerMedication(activeMar.id, "nurse-1");
      toast.success(isAr ? "تم إعطاء الجرعة بنجاح" : "Medication administered successfully");
      setIsVerifying(false);
      setActiveMar(null);
    } catch (e) {
      toast.error("Error administering medication");
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f1f5f9]" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <ClipboardCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{isAr ? "سجل إعطاء الدواء (MAR)" : "Medication Administration Record (MAR)"}</h1>
            <p className="text-sm font-bold text-slate-500">{isAr ? "نظام التحقق الإلكتروني وسلامة الدواء" : "Electronic Verification & Medication Safety"}</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors">
            {isAr ? "إغلاق" : "Close"}
          </button>
        )}
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Patient Sidebar */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 absolute top-3 left-3 text-slate-400" />
              <input type="text" placeholder={isAr ? "بحث بالمريض..." : "Search patient..."} className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {patients.map(p => (
              <button 
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`w-full p-3 rounded-xl flex items-center gap-3 transition-all ${selectedPatientId === p.id ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-slate-50 border border-transparent'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${selectedPatientId === p.id ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {p.nameEn.charAt(0)}
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className={`text-sm font-black truncate ${selectedPatientId === p.id ? 'text-indigo-900' : 'text-slate-800'}`}>{isAr ? p.nameAr : p.nameEn}</p>
                  <p className="text-[10px] font-bold text-slate-400">MRN: {p.mrn}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activePatient ? (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">{isAr ? activePatient.nameAr : activePatient.nameEn}</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-bold text-slate-500">MRN: <span className="text-slate-900">{activePatient.mrn}</span></span>
                      <span className="text-sm font-bold text-slate-500">Ward: <span className="text-slate-900">Ward A / Room 302</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg border border-rose-100 flex items-center gap-2 font-black text-xs">
                     <AlertCircle className="w-4 h-4" />
                     {isAr ? "حساسية: البنسلين" : "Allergy: Penicillin"}
                   </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{isAr ? "الجرعات المجدولة" : "Scheduled Meds"}</h3>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-indigo-600 rounded-full"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "اليوم" : "Today"}</span>
                  </div>
                </div>

                {patientMars.map(rx => (
                  <div key={rx.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden group">
                    <div className="p-5 flex items-center justify-between border-b border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          <Pill className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-black text-slate-900">{rx.medication}</p>
                          <p className="text-xs font-bold text-slate-500">{rx.dose} • {rx.route} • {rx.frequency}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الجرعة التالية" : "Next Dose"}</p>
                          <p className="text-sm font-black text-slate-800">10:00 AM</p>
                        </div>
                        <button 
                          onClick={() => { setActiveMar(rx); setIsVerifying(true); }}
                          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
                        >
                          {isAr ? "إعطاء" : "Administer"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-6">
                <User className="w-12 h-12 text-slate-300" />
              </div>
              <p className="text-xl font-black">{isAr ? "اختر مريضاً من القائمة" : "Select a patient to view MAR"}</p>
              <p className="text-sm font-bold mt-2">{isAr ? "ابدأ بالبحث أو اختر من القائمة الجانبية" : "Start by searching or choosing from the sidebar"}</p>
            </div>
          )}
        </div>
      </div>

      {isVerifying && activeMar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-8 space-y-6 text-center">
              <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Barcode className="w-10 h-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{isAr ? "التحقق من الدواء" : "Medication Verification"}</h3>
                <p className="text-slate-500 font-bold mt-2">{isAr ? "يرجى مسح باركود الدواء للتأكد من المريض والجرعة" : "Please scan patient and medication barcode"}</p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-left">
                <div className="flex justify-between items-center mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المريض" : "Patient"}</p>
                   <p className="text-sm font-black text-slate-900">{isAr ? activePatient?.nameAr : activePatient?.nameEn}</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الدواء" : "Medication"}</p>
                   <p className="text-sm font-black text-indigo-600">{activeMar.medication}</p>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الجرعة" : "Dose"}</p>
                   <p className="text-sm font-black text-slate-900">{activeMar.dose}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsVerifying(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-200"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  onClick={handleAdminister}
                  className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-100 hover:bg-emerald-700"
                >
                  {isAr ? "تأكيد الإعطاء" : "Confirm & Sign"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
