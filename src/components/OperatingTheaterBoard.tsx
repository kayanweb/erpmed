import React, { useState, useMemo, useEffect } from "react";
import { 
  Scissors, Activity, Users, Clock, CheckSquare, ShieldCheck, HeartPulse,
  LayoutDashboard, ListTodo, FileSearch, MoreVertical, ChevronRight,
  ArrowLeft, ArrowRight, Bell, Zap, Eye, FileOutput, Printer, Filter,
  History, Package, MonitorPlay, ShieldAlert, Thermometer, UserPlus,
  Calendar, ClipboardCheck, Timer, Plus, BarChart3, Search, Edit
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { useFirestoreSync } from "../hooks/useFirestoreSync";
import { subscribeToClinicalData, saveDataPermanently, deleteDataPermanently } from "../lib/realTimeService";
import { toast } from "sonner";
import { ORManagementModule } from "./ORManagementModule";

export type SurgeryCase = {
  id: string;
  patientId: string;
  mrn: string;
  patientNameEn: string;
  patientNameAr: string;
  roomId: string; // e.g. "OR-1"
  procedureEn: string;
  procedureAr: string;
  surgeonId: string;
  anesthesiologistId: string;
  status: "scheduled" | "pre-op" | "intra-op" | "pacu" | "completed" | "cancelled";
  scheduledStartTime: string;
  scheduledEndTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  anesthesiaType: string;
  priority: "elective" | "urgent" | "emergency";
  preOpChecklist: {
    consentSigned: boolean;
    bloodAvailable: boolean;
    npoConfirmed: boolean;
    siteMarked: boolean;
  };
  intraOp: {
    timeOutDone: boolean;
    estimatedBloodLoss: number;
    complications: string;
  };
  createdAt: string;
  createdBy: string;
};

const syncSurgeries = (cb: (data: SurgeryCase[]) => void) => subscribeToClinicalData("or_cases", cb, (err) => console.error(err));

export default function OperatingTheaterBoard({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  const { currentUser, patients, systemUsers, surgeries, addSurgery, updateSurgery } = useHIS();
  
  const [activeMainTab, setActiveMainTab] = useState<string>("dashboard");
  
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSurgery, setSelectedSurgery] = useState<any | null>(null);

  const [activeCaseDetails, setActiveCaseDetails] = useState<any | null>(null);

  const mainTabs = [
    { id: "dashboard", icon: LayoutDashboard, en: "Command Center", ar: "مركز القيادة" },
    { id: "schedule", icon: Calendar, en: "OR Schedule", ar: "جدول العمليات" },
    { id: "or_management", icon: Scissors, en: "OR Pro Management", ar: "إدارة العمليات المتقدمة" },
    { id: "intraop", icon: Scissors, en: "Intra-Operative", ar: "أثناء العملية" },
    { id: "pacu", icon: HeartPulse, en: "PACU / Recovery", ar: "الإفاقة" }
  ];

  const rooms = ["OR-1", "OR-2", "OR-3", "OR-4 (Cath Lab)"];

  const handleSaveSurgery = async (newCase: any) => {
    try {
      await addSurgery(newCase);
      toast.success(isAr ? "تم حفظ العملية بنجاح" : "Surgery case saved successfully");
      setIsBookingModalOpen(false);
      setSelectedSurgery(null);
    } catch (e) {
      toast.error(isAr ? "حدث خطأ أثناء الحفظ" : "Error saving case");
    }
  };

  const handleUpdateStatus = async (s: any, newStatus: any) => {
    try {
      const updates: any = { status: newStatus };
      if (newStatus === "intra-op") updates.actualStartTime = new Date().toISOString();
      if (newStatus === "completed") updates.actualEndTime = new Date().toISOString();
      await updateSurgery(s.id, updates);
      toast.success(isAr ? "تم تحديث الحالة" : "Status updated");
    } catch (e) {
      toast.error("Error updating status");
    }
  };

  // Stats
  const activeCases = surgeries.filter(s => s.status === "intra-op").length;
  const scheduledToday = surgeries.filter(s => s.status === "scheduled" && s.scheduledStartTime.startsWith(new Date().toISOString().split('T')[0])).length;
  const inPacu = surgeries.filter(s => s.status === "pacu").length;

  const otStats = [
    { label: isAr ? "عمليات جارية" : "In Progress", value: activeCases.toString(), icon: Activity, color: "rose" },
    { label: isAr ? "مجدول اليوم" : "Today's Schedule", value: scheduledToday.toString(), icon: Calendar, color: "blue" },
    { label: isAr ? "حالات الإفاقة" : "In PACU", value: inPacu.toString(), icon: HeartPulse, color: "emerald" },
  ];

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-[#f8fafc]" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-sm z-30 shrink-0">
        <div className="flex flex-wrap items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-100">
            <Scissors className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{isAr ? "نظام إدارة غرف العمليات (OTIS)" : "Operating Theater Management System"}</h1>
            <p className="text-sm font-bold text-slate-500">{isAr ? "جدولة الغرف والمراقبة السريرية" : "OR Scheduling & Clinical Monitoring"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {mainTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                activeMainTab === tab.id ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{isAr ? tab.ar : tab.en}</span>
            </button>
          ))}
          {onClose && (
            <button onClick={onClose} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 ml-2 font-bold">
              {isAr ? "إغلاق" : "Close"}
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-8">
        {activeMainTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {otStats.map((stat, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-6 flex items-center gap-6 shadow-sm">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-900 mt-1">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-black text-slate-800">{isAr ? "لوحة غرف العمليات" : "Live OR Board"}</h2>
                <button onClick={() => { setSelectedSurgery(null); setIsBookingModalOpen(true); }} className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg flex items-center gap-2">
                  <Plus className="w-4 h-4" /> {isAr ? "حجز غرفة" : "Book OR"}
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {rooms.map(room => {
                  const currentCase = surgeries.find(s => s.roomId === room && (s.status === "pre-op" || s.status === "intra-op"));
                  return (
                    <div key={room} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                      <h3 className="font-black text-slate-800 mb-4">{room}</h3>
                      {currentCase ? (
                        <div className="bg-white p-4 rounded-lg border border-rose-100 shadow-sm border-l-4 border-l-rose-500">
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded uppercase mb-2 inline-block">
                            {currentCase.status}
                          </span>
                          <p className="font-bold text-sm text-slate-800">{isAr ? currentCase.patientNameAr : currentCase.patientNameEn}</p>
                          <p className="text-xs text-slate-500 mt-1">{isAr ? currentCase.procedureAr : currentCase.procedureEn}</p>
                          <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between">
                            <button onClick={() => handleUpdateStatus(currentCase, currentCase.status === "pre-op" ? "intra-op" : "pacu")} className="text-xs font-bold text-indigo-600 hover:underline">
                              {currentCase.status === "pre-op" ? (isAr ? "بدء العملية" : "Start Surgery") : (isAr ? "نقل للإفاقة" : "Transfer to PACU")}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400">
                          <CheckSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                          <p className="text-xs font-bold">{isAr ? "الغرفة متاحة" : "Room Available"}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeMainTab === "schedule" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="font-black text-slate-800">{isAr ? "جدول العمليات" : "OR Schedule"}</h2>
              <button onClick={() => { setSelectedSurgery(null); setIsBookingModalOpen(true); }} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                {isAr ? "إضافة موعد" : "Schedule Case"}
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الوقت" : "Time"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "المريض" : "Patient"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الغرفة" : "OR"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الإجراء الجراحي" : "Procedure"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الجراح" : "Surgeon"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {surgeries.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="p-4 text-xs font-bold text-slate-600">{new Date(s.scheduledStartTime).toLocaleString()}</td>
                    <td className="p-4 text-sm font-bold text-slate-800">{isAr ? s.patientNameAr : s.patientNameEn} <br/><span className="text-[10px] text-slate-400">{s.mrn}</span></td>
                    <td className="p-4 text-xs font-bold text-slate-600">{s.roomId}</td>
                    <td className="p-4 text-xs font-bold text-slate-700">{isAr ? s.procedureAr : s.procedureEn}</td>
                    <td className="p-4 text-xs font-bold text-slate-600">{systemUsers?.find((u:any) => u.id === s.surgeonId)?.nameEn || s.surgeonId}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                        s.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                        s.status === 'pre-op' ? 'bg-amber-100 text-amber-700' :
                        s.status === 'intra-op' ? 'bg-rose-100 text-rose-700' :
                        s.status === 'pacu' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {surgeries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-400 text-sm font-bold">
                      {isAr ? "لا توجد عمليات مجدولة" : "No surgeries scheduled"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeMainTab === "or_management" && (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 overflow-hidden">
            <ORManagementModule />
          </div>
        )}

        {/* PACU and Intra-op are similar lists but filtered */}
      </div>

      {isBookingModalOpen && (
        <BookingModal 
          onClose={() => setIsBookingModalOpen(false)} 
          onSave={handleSaveSurgery} 
          isAr={isAr} 
          patients={patients} 
          users={systemUsers}
          rooms={rooms}
        />
      )}
    </div>
  );
}

function BookingModal({ onClose, onSave, isAr, patients, users, rooms }: any) {
  const [formData, setFormData] = useState<Partial<SurgeryCase>>({
    status: "scheduled",
    priority: "elective",
    preOpChecklist: { consentSigned: false, bloodAvailable: false, npoConfirmed: false, siteMarked: false },
    intraOp: { timeOutDone: false, estimatedBloodLoss: 0, complications: "" }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const patient = patients.find((p:any) => p.id === formData.patientId);
    onSave({
      ...formData,
      id: `SURG-${Date.now()}`,
      mrn: patient?.mrn || "",
      patientNameEn: patient?.nameEn || "",
      patientNameAr: patient?.nameAr || "",
      createdAt: new Date().toISOString(),
      createdBy: "sys"
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-800">{isAr ? "حجز غرفة عمليات" : "Book OR Schedule"}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-slate-200 rounded-lg hover:bg-rose-100 hover:text-rose-600"><Plus className="w-5 h-5 rotate-45" /></button>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "المريض" : "Patient"}</label>
              <select required className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, patientId: e.target.value})}>
                <option value="">Select Patient</option>
                {patients.map((p:any) => <option key={p.id} value={p.id}>{p.nameEn} ({p.mrn})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الغرفة" : "Room"}</label>
              <select required className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, roomId: e.target.value})}>
                <option value="">Select Room</option>
                {rooms.map((r:string) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الإجراء الجراحي (EN)" : "Procedure (EN)"}</label>
              <input required type="text" className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, procedureEn: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الإجراء الجراحي (AR)" : "Procedure (AR)"}</label>
              <input required type="text" className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, procedureAr: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "الجراح" : "Surgeon"}</label>
              <select required className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, surgeonId: e.target.value})}>
                <option value="">Select Surgeon</option>
                {users?.map((u:any) => <option key={u.id} value={u.id}>{u.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "طبيب التخدير" : "Anesthesiologist"}</label>
              <select required className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, anesthesiologistId: e.target.value})}>
                <option value="">Select Anesthesiologist</option>
                {users?.map((u:any) => <option key={u.id} value={u.id}>{u.nameEn}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "وقت البدء" : "Start Time"}</label>
              <input required type="datetime-local" className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, scheduledStartTime: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? "نوع التخدير" : "Anesthesia Type"}</label>
              <select required className="w-full p-3 border border-slate-200 rounded-lg text-sm bg-slate-50" onChange={e => setFormData({...formData, anesthesiaType: e.target.value})}>
                <option value="">Select Type</option>
                <option value="General">General</option>
                <option value="Local">Local</option>
                <option value="Spinal">Spinal</option>
                <option value="Epidural">Epidural</option>
              </select>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold">{isAr ? "إلغاء" : "Cancel"}</button>
            <button type="submit" className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold">{isAr ? "حفظ الحجز" : "Save Booking"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
