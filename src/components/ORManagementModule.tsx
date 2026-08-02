import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Scissors, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Stethoscope, 
  Activity,
  History,
  FileText,
  Plus,
  Search,
  ChevronRight,
  UserCheck,
  ShieldCheck,
  Syringe,
  Thermometer,
  HeartPulse,
  Sparkles
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { toast } from "sonner";

interface Surgery {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  surgeon: string;
  anesthesiologist?: string;
  status: 'scheduled' | 'pre-op' | 'in-progress' | 'recovery' | 'completed' | 'cancelled';
  scheduledTime: string;
  room: string;
  priority: 'elective' | 'urgent' | 'emergency';
  preOpChecklist: {
    consentSigned: boolean;
    anesthesiaAssessment: boolean;
    fastingVerified: boolean;
    siteMarked: boolean;
    labsReviewed: boolean;
  };
}

export const ORManagementModule: React.FC = () => {
  const { patients = [], activePatient, setActivePatient } = useHIS();
  const [activeView, setActiveView] = useState<'schedule' | 'active-case' | 'post-op'>('schedule');
  const [selectedCase, setSelectedCase] = useState<Surgery | null>(null);

  // Patient Selection State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient?.id || "");
  const [patientQuery, setPatientQuery] = useState("");
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);

  // Schedule Modal State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [procedureName, setProcedureName] = useState("");
  const [surgeonName, setSurgeonName] = useState("");
  const [anesthesiologistName, setAnesthesiologistName] = useState("");
  const [orRoom, setOrRoom] = useState("OR-1");
  const [surgeryPriority, setSurgeryPriority] = useState<'elective' | 'urgent' | 'emergency'>("elective");

  // WHO Checklist Modal
  const [checklistCase, setChecklistCase] = useState<Surgery | null>(null);

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  const patientSearchResults = useMemo(() => {
    if (!patientQuery.trim()) return patients.slice(0, 5);
    const q = patientQuery.toLowerCase().trim();
    return patients.filter(p => 
      p.nameAr?.toLowerCase().includes(q) ||
      p.nameEn?.toLowerCase().includes(q) ||
      p.mrn?.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [patients, patientQuery]);

  // Mock initial surgery cases
  const [surgeries, setSurgeries] = useState<Surgery[]>([
    {
      id: "OR-2024-001",
      patientId: "P-101",
      patientName: "Ahmed Mansour",
      procedure: "Laparoscopic Cholecystectomy (استئصال المرارة بالمنظار)",
      surgeon: "Dr. Khaled Ibraheem",
      anesthesiologist: "Dr. Sarah Ahmed",
      status: 'in-progress',
      scheduledTime: "2026-07-31T08:00:00",
      room: "OR-1",
      priority: 'elective',
      preOpChecklist: {
        consentSigned: true,
        anesthesiaAssessment: true,
        fastingVerified: true,
        siteMarked: true,
        labsReviewed: true
      }
    },
    {
      id: "OR-2024-002",
      patientId: "P-105",
      patientName: "Mona Hassan",
      procedure: "Total Hip Arthroplasty (استبدال مفصل الورك)",
      surgeon: "Dr. Youssef Zidan",
      status: 'pre-op',
      scheduledTime: "2026-07-31T10:30:00",
      room: "OR-3",
      priority: 'elective',
      preOpChecklist: {
        consentSigned: true,
        anesthesiaAssessment: true,
        fastingVerified: false,
        siteMarked: true,
        labsReviewed: true
      }
    }
  ]);

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatientId(p.id);
    setActivePatient(p);
    setIsSearchingPatient(false);
    toast.info(`تم تحديد المريض للجراحة: ${p.nameAr || p.nameEn}`);
  };

  const handleCreateSurgery = () => {
    if (!selectedPatient) {
      toast.error("يرجى تحديد المريض الجراحي أولاً من الشريط الأعلى!");
      setIsSearchingPatient(true);
      return;
    }
    if (!procedureName) {
      toast.error("يرجى كتابة الإجراء الجراحي!");
      return;
    }

    const newCase: Surgery = {
      id: `OR-${Date.now().toString().slice(-4)}`,
      patientId: selectedPatient.id,
      patientName: selectedPatient.nameAr || selectedPatient.nameEn,
      procedure: procedureName,
      surgeon: surgeonName || "Dr. Chief Surgeon",
      anesthesiologist: anesthesiologistName || "Dr. Anesthesia Duty",
      status: 'scheduled',
      scheduledTime: new Date().toISOString(),
      room: orRoom,
      priority: surgeryPriority,
      preOpChecklist: {
        consentSigned: true,
        anesthesiaAssessment: true,
        fastingVerified: true,
        siteMarked: true,
        labsReviewed: true
      }
    };

    setSurgeries(prev => [newCase, ...prev]);
    toast.success(`تم حجز غرفة العمليات (${orRoom}) للمريض بنجاح!`);
    setIsScheduleModalOpen(false);
    setProcedureName("");
  };

  const getStatusColor = (status: Surgery['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'pre-op': return 'bg-amber-100 text-amber-700 border border-amber-200';
      case 'in-progress': return 'bg-purple-100 text-purple-700 animate-pulse border border-purple-200';
      case 'recovery': return 'bg-emerald-100 text-emerald-700 border border-emerald-200';
      case 'completed': return 'bg-slate-100 text-slate-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-200">
            <Scissors size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">جناح إدارة العمليات الجراحية والتخدير (OR Suite)</h1>
            <p className="text-xs text-slate-500 font-bold">جدولة الجراحات، التحضير التخديري، وتفقد الأمان الجراحي (WHO Checklist)</p>
          </div>
        </div>
        
        <button 
          onClick={() => {
            if (!selectedPatient) {
              toast.error("يرجى اختيار المريض أولاً من قائمة مرضى العمليات!");
              setIsSearchingPatient(true);
            } else {
              setIsScheduleModalOpen(true);
            }
          }}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black transition-all shadow-lg shadow-indigo-100 active:scale-95"
        >
          <Plus size={18} />
          <span>جدولة عملية جراحية جديدة</span>
        </button>
      </div>

      {/* MANDATORY PATIENT SELECTOR FOR SURGERY */}
      <div className="mx-6 mt-4 bg-slate-900 text-white p-4 rounded-3xl shadow-md border border-slate-800 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-2">
          <span className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            المريض المباشر للعمليات الجراحية
          </span>
          {selectedPatient && (
            <button 
              onClick={() => setIsSearchingPatient(!isSearchingPatient)}
              className="text-xs font-black text-indigo-400 hover:text-indigo-200 underline"
            >
              {isSearchingPatient ? "إلغاء" : "تغيير المريض"}
            </button>
          )}
        </div>

        {selectedPatient && !isSearchingPatient ? (
          <div className="bg-slate-800 border border-indigo-500/30 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 text-white font-black rounded-xl flex items-center justify-center text-sm shadow">
                {(selectedPatient.nameEn || "PT").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white">{selectedPatient.nameAr || selectedPatient.nameEn}</h4>
                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-mono text-[10px] font-black rounded border border-indigo-800">MRN: {selectedPatient.mrn}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-bold">{selectedPatient.gender === "male" ? "ذكر" : "أنثى"} • {selectedPatient.age} سنة • فصيلة الدم: {selectedPatient.bloodType || "O+"}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsScheduleModalOpen(true)}
              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-black shadow transition-all flex items-center gap-1.5"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>حجز العملية لهذه الحالة</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder="ابحث عن مريض الجراحة بالاسم أو رقم الملف MRN..."
                className="w-full pr-10 pl-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {patientSearchResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className="p-2 bg-slate-800 hover:bg-indigo-900/60 rounded-xl border border-slate-700 text-right transition flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-black text-white">{p.nameAr || p.nameEn}</div>
                    <div className="text-[10px] text-slate-400 font-mono">MRN: {p.mrn}</div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded">اختيار</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 px-6 flex items-center gap-6 shrink-0 mt-4">
        <button 
          onClick={() => setActiveView('schedule')}
          className={`py-4 text-xs font-black transition-all border-b-2 relative ${activeView === 'schedule' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent'}`}
        >
          جدول عمليات اليوم
          {activeView === 'schedule' && <motion.div layoutId="or-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
        </button>
        <button 
          onClick={() => setActiveView('active-case')}
          className={`py-4 text-xs font-black transition-all border-b-2 relative ${activeView === 'active-case' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent'}`}
        >
          غرف العمليات النشطة الجارية
          <span className="mr-2 px-1.5 py-0.5 bg-rose-500 text-white text-[10px] rounded-full animate-pulse">{surgeries.filter(s => s.status === 'in-progress').length}</span>
          {activeView === 'active-case' && <motion.div layoutId="or-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
        </button>
      </div>

      {/* Main View Content */}
      <div className="flex-1 overflow-hidden flex flex-col p-6 gap-6">
        {activeView === 'schedule' && (
          <div className="space-y-4 overflow-y-auto">
            {/* Table */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-slate-800 flex items-center gap-2 text-sm">
                  <History size={18} className="text-slate-400" />
                  <span>قائمة الحالات المجدولة بغرف العمليات</span>
                </h3>
              </div>
              
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-3">المريض</th>
                    <th className="px-6 py-3">الإجراء الجراحي</th>
                    <th className="px-6 py-3">الجراح المسؤول</th>
                    <th className="px-6 py-3">الوقت / الغرفة</th>
                    <th className="px-6 py-3">الأولوية</th>
                    <th className="px-6 py-3">الحالة</th>
                    <th className="px-6 py-3 text-center">أمان الجراحة (WHO)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {surgeries.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-black text-xs shrink-0">
                            {s.patientName.charAt(0)}
                          </div>
                          <div>
                            <GlobalEntityLink entityType="patient" entityId={s.patientId} className="text-xs font-black text-slate-800 hover:text-indigo-600">
                              {s.patientName}
                            </GlobalEntityLink>
                            <div className="text-[10px] text-slate-400 font-mono">{s.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-bold text-slate-800">{s.procedure}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <Stethoscope size={14} className="text-indigo-600" />
                          <span>{s.surgeon}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs font-black text-slate-800">{s.room}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black ${s.priority === 'emergency' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                          {s.priority === 'emergency' ? 'طوارئ' : 'اختيارية'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${getStatusColor(s.status)}`}>
                          {s.status === 'in-progress' ? 'داخل العمليات' : s.status === 'pre-op' ? 'تحت التحضير' : 'مجدولة'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => setChecklistCase(s)}
                          className="px-3 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-xl text-[10px] font-black hover:bg-indigo-100 transition flex items-center gap-1 mx-auto"
                        >
                          <ShieldCheck size={14} />
                          <span>تفقّد قائمة WHO</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeView === 'active-case' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["OR-1", "OR-2", "OR-3", "OR-4"].map(room => {
              const activeCase = surgeries.find(s => s.room === room && s.status === 'in-progress');
              return (
                <div key={room} className={`bg-white rounded-3xl p-6 border-2 shadow-sm space-y-4 ${activeCase ? "border-purple-300 ring-2 ring-purple-100" : "border-slate-200"}`}>
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-base font-black text-slate-900">{room}</span>
                    <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black ${activeCase ? "bg-purple-100 text-purple-700 animate-pulse" : "bg-emerald-100 text-emerald-700"}`}>
                      {activeCase ? "جراحة جارية الآن" : "غرفة متاحة ومعقمة"}
                    </span>
                  </div>

                  {activeCase ? (
                    <div className="space-y-3">
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">المريض الخاضع للجراحة:</div>
                        <div className="text-sm font-black text-slate-900">{activeCase.patientName}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase">الإجراء:</div>
                        <div className="text-xs font-bold text-indigo-700">{activeCase.procedure}</div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-bold border-t pt-2">
                        <span>الجراح: {activeCase.surgeon}</span>
                        <span>التخدير: {activeCase.anesthesiologist}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-slate-400 font-bold text-xs space-y-2">
                      <p>غرفة العمليات جاهزة للتعقيم والاستقبال</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isScheduleModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-modal flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 text-right">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-indigo-600" />
                حجز وحجز غرفة عمليات
              </h3>
              <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3">
              <div className="text-[10px] font-bold text-indigo-700">المريض المحدد:</div>
              <div className="text-sm font-black text-indigo-950">{selectedPatient.nameAr || selectedPatient.nameEn} (MRN: {selectedPatient.mrn})</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم العملية / الإجراء الجراحي *</label>
                <input 
                  type="text" 
                  value={procedureName} 
                  onChange={(e) => setProcedureName(e.target.value)} 
                  placeholder="مثال: استئصال المرارة بالمنظار / تثبيت كسر..." 
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الجراح الرئيسي</label>
                  <input 
                    type="text" 
                    value={surgeonName} 
                    onChange={(e) => setSurgeonName(e.target.value)} 
                    placeholder="د. الاستشاري..." 
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-slate-50"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">طبيب التخدير</label>
                  <input 
                    type="text" 
                    value={anesthesiologistName} 
                    onChange={(e) => setAnesthesiologistName(e.target.value)} 
                    placeholder="د. التخدير..." 
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-slate-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">غرفة العمليات</label>
                  <select 
                    value={orRoom} 
                    onChange={(e) => setOrRoom(e.target.value)} 
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-slate-50"
                  >
                    <option value="OR-1">غرفة عمليات 1 (OR-1 Major)</option>
                    <option value="OR-2">غرفة عمليات 2 (OR-2 Endoscopy)</option>
                    <option value="OR-3">غرفة عمليات 3 (OR-3 Ortho)</option>
                    <option value="OR-4">غرفة عمليات 4 (OR-4 Cardiac)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">الأولوية</label>
                  <select 
                    value={surgeryPriority} 
                    onChange={(e: any) => setSurgeryPriority(e.target.value)} 
                    className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-slate-50"
                  >
                    <option value="elective">جراحة مجدولة (Elective)</option>
                    <option value="urgent">عاجلة (Urgent)</option>
                    <option value="emergency">طوارئ (Emergency)</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleCreateSurgery}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all"
            >
              تأكيد جدولة العملية وحجز الغرفة
            </button>
          </div>
        </div>
      )}

      {/* WHO Checklist Modal */}
      {checklistCase && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-modal flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 border border-slate-200 text-right">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                قائمة منظمة الصحة العالمية لأمان الجراحة (WHO Checklist)
              </h3>
              <button onClick={() => setChecklistCase(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border text-xs space-y-2">
              <div className="font-black text-slate-900">{checklistCase.patientName} - {checklistCase.procedure}</div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>تأكيد هوية المريض وموقع العملية</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>فحص جهاز ومعدات التخدير</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>تأكيد قياس النبض والأكسجين</span>
                </label>
                <label className="flex items-center gap-2 font-bold cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded text-indigo-600" />
                  <span>تفقّد الحساسية والنزيف المتوقع</span>
                </label>
              </div>
            </div>

            <button 
              onClick={() => {
                toast.success("تم حفظ واعتماد قائمة تفقّد الأمان الجراحي للمريض!");
                setChecklistCase(null);
              }}
              className="w-full py-3 bg-emerald-600 text-white font-black rounded-2xl"
            >
              اعتماد نتائج قائمة الأمان الجراحي
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

