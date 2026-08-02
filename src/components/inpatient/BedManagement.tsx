import React, { useState, useMemo } from "react";
import { 
  Bed, Info, Plus, Settings, User, Clock, AlertTriangle, ArrowRightLeft, 
  Search, CheckCircle2, UserPlus, Sparkles, Building2, ShieldCheck, Stethoscope, LogOut
} from "lucide-react";
import { useHIS } from "../../context/HISContext";
import { Patient } from "../../types";
import { GlobalEntityLink } from "../GlobalEntityLink";
import { toast } from "sonner";

export default function BedManagement({ language, moduleType }: { language: string, moduleType: string }) {
  const isAr = language === "ar" || language === "AR";
  const { patients = [], beds = [], admissions = [], setBeds, setAdmissions, activePatient, setActivePatient, updatePatientStatus } = useHIS();

  // Patient Selection State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(activePatient?.id || "");
  const [patientQuery, setPatientQuery] = useState("");
  const [isSearchingPatient, setIsSearchingPatient] = useState(false);

  // Bed Assignment Modal State
  const [assigningBed, setAssigningBed] = useState<any | null>(null);
  const [admissionReason, setAdmissionReason] = useState("");
  const [attendingDoctor, setAttendingDoctor] = useState("");

  const selectedPatient = useMemo(() => {
    return patients.find(p => p.id === selectedPatientId);
  }, [patients, selectedPatientId]);

  const patientSearchResults = useMemo(() => {
    if (!patientQuery.trim()) return patients.slice(0, 5);
    const q = patientQuery.toLowerCase().trim();
    return patients.filter(p => 
      p.nameAr?.toLowerCase().includes(q) ||
      p.nameEn?.toLowerCase().includes(q) ||
      p.mrn?.toLowerCase().includes(q) ||
      p.phone?.includes(q)
    ).slice(0, 6);
  }, [patients, patientQuery]);

  const wardBeds = useMemo(() => {
    return beds.filter(b => !moduleType || moduleType === "all" ? true : b.departmentId === moduleType);
  }, [beds, moduleType]);

  const handleSelectPatient = (p: Patient) => {
    setSelectedPatientId(p.id);
    setActivePatient(p);
    setIsSearchingPatient(false);
    toast.info(isAr ? `تم تحديد المريض: ${p.nameAr || p.nameEn}` : `Selected patient: ${p.nameEn}`);
  };

  const handleConfirmBedAssignment = async () => {
    if (!selectedPatient) {
      toast.error(isAr ? "يرجى تحديد المريض أولاً لتسكينه بالسرير!" : "Please select a patient first!");
      return;
    }
    if (!assigningBed) return;

    try {
      // 1. Update Bed status
      setBeds(prev => prev.map(b => b.id === assigningBed.id ? { ...b, status: "occupied" } : b));

      // 2. Add Admission record
      const newAdmission = {
        id: `ADM-${Date.now()}`,
        patientId: selectedPatient.id,
        mrn: selectedPatient.mrn,
        admissionDate: new Date().toISOString(),
        admissionType: 'elective' as const,
        attendingPhysicianId: attendingDoctor || "Dr. Duty Physician",
        wardId: assigningBed.wardId || "ward-01",
        roomId: assigningBed.roomId || "room-101",
        bedId: assigningBed.id,
        status: 'active' as const,
        diagnosisEn: admissionReason || "Inpatient Care",
        diagnosisAr: admissionReason || "تنويم ورعاية طبية",
        source: 'opd' as const,
        notes: admissionReason || "Inpatient Care"
      };

      setAdmissions(prev => [newAdmission, ...(Array.isArray(prev) ? prev : [])]);
      await updatePatientStatus(selectedPatient.id, "admitted" as any);

      toast.success(
        isAr 
          ? `تم تسكين المريض (${selectedPatient.nameAr || selectedPatient.nameEn}) بالسرير (${assigningBed.bedNumber}) بنجاح!` 
          : `Patient (${selectedPatient.nameEn}) assigned to bed ${assigningBed.bedNumber}`
      );

      setAssigningBed(null);
      setAdmissionReason("");
    } catch (e) {
      toast.error(isAr ? "فشل تسكين المريض" : "Failed to assign bed");
    }
  };

  const handleDischargeBed = (bedId: string) => {
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: "cleaning" } : b));
    setAdmissions(prev => prev.map(a => a.bedId === bedId && a.status === 'active' ? { ...a, status: 'discharged' } : a));
    toast.success(isAr ? "تم إخلاء السرير وتحويله للتنظيف والتعقيم" : "Bed discharged & set to cleaning status");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
           <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
             <Bed className="w-7 h-7 text-indigo-600" />
             {isAr ? "إدارة وتخصيص أسرة التنويم" : "Inpatient Bed Allocation & Management"}
           </h2>
           <p className="text-xs font-bold text-slate-500 mt-1">
             {isAr ? "توزيع المرضى، متابعة الإشغال، وإدارة القبول بأسرة الأقسام" : "Real-time patient occupancy, admission & bed assignment"}
           </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openMasterBedRegistry'))} 
            className="flex items-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-800 transition-all shadow-md"
          >
             <Settings className="w-4 h-4 text-indigo-400" />
             {isAr ? "إعدادات سجل الأسرة" : "Bed Registry Setup"}
          </button>
        </div>
      </div>

      {/* MANDATORY PATIENT SELECTION HEADER BAR */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg border border-slate-800 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <span className="text-xs font-black text-indigo-300 uppercase tracking-widest flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-400" />
            {isAr ? "المريض المحدد للقبول وتخصيص السرير" : "Selected Patient for Bed Assignment"}
          </span>
          {selectedPatient && (
            <button 
              onClick={() => setIsSearchingPatient(!isSearchingPatient)}
              className="text-xs font-black text-indigo-400 hover:text-indigo-200 underline"
            >
              {isSearchingPatient ? (isAr ? "إلغاء البحث" : "Cancel Search") : (isAr ? "تغيير المريض" : "Change Patient")}
            </button>
          )}
        </div>

        {selectedPatient && !isSearchingPatient ? (
          <div className="bg-slate-800/90 border border-indigo-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 text-white font-black rounded-xl flex items-center justify-center text-base shadow-md shrink-0">
                {(selectedPatient.nameEn || "PT").substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-black text-white">
                    {isAr ? selectedPatient.nameAr : selectedPatient.nameEn}
                  </h4>
                  <span className="px-2 py-0.5 bg-indigo-950 text-indigo-300 font-mono text-[10px] font-black rounded border border-indigo-800">
                    MRN: {selectedPatient.mrn}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-bold mt-0.5 flex gap-2">
                  <span>{selectedPatient.gender === "male" ? (isAr ? "ذكر" : "Male") : (isAr ? "أنثى" : "Female")} • {selectedPatient.age} سنة</span>
                  <span>• {selectedPatient.phone || "بدون هاتف"}</span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-black flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {isAr ? "جاهز للتسكين بالسرير" : "Ready for Bed Assignment"}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={patientQuery}
                onChange={(e) => setPatientQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن المريض بالتسمية أو رقم الملف (MRN)..." : "Search patient by Name or MRN..."}
                className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-2xl text-xs font-bold text-white outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {patientSearchResults.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleSelectPatient(p)}
                  className="p-2.5 bg-slate-800 hover:bg-indigo-900/60 rounded-xl border border-slate-700 text-right transition flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-black text-white">{isAr ? p.nameAr : p.nameEn}</div>
                    <div className="text-[10px] text-slate-400 font-mono">MRN: {p.mrn}</div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded">
                    {isAr ? "اختر" : "Select"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {wardBeds.length > 0 ? wardBeds.map(bed => {
          const activeAdmission = admissions.find((a: any) => a.bedId === bed.id && a.status === 'active');
          const patient = activeAdmission ? patients.find(p => p.id === activeAdmission.patientId) : null;
          const isOccupied = bed.status === "occupied" && patient;
          
          return (
            <div key={bed.id} className={`bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all ${isOccupied ? 'ring-2 ring-indigo-200' : ''}`}>
              <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/80">
                 <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isOccupied ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-400'}`}>
                      <Bed className="w-5 h-5" />
                    </div>
                    <div>
                       <div className="font-black text-slate-900 text-base">{bed.bedNumber}</div>
                       <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{bed.type || 'Standard'}</div>
                    </div>
                 </div>
                 <span className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider border ${
                    isOccupied ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                    bed.status === 'cleaning' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                    'bg-emerald-50 text-emerald-700 border-emerald-200'
                 }`}>
                   {isOccupied ? (isAr ? "مشغول" : "Occupied") : bed.status === 'cleaning' ? (isAr ? "جاري التعقيم" : "Cleaning") : (isAr ? "متاح" : "Available")}
                 </span>
              </div>
              
              <div className="p-5">
                {isOccupied && patient ? (
                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0">
                           {(patient.nameEn || "PT").substring(0,2).toUpperCase()}
                        </div>
                        <div>
                           <GlobalEntityLink entityType="patient" entityId={patient.id} className="font-bold text-slate-900 text-sm hover:text-indigo-600 block line-clamp-1">
                             {isAr ? patient.nameAr : patient.nameEn}
                           </GlobalEntityLink>
                           <div className="text-[10px] font-mono font-bold text-slate-400 mt-1">MRN: {patient.mrn} • {patient.age}y</div>
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                        <button 
                          onClick={() => window.dispatchEvent(new CustomEvent('openGenericModal', { detail: { titleEn: "Patient Chart", titleAr: "السجل الطبي", type: "clinical", patientId: patient.id } }))} 
                          className="px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl text-[10px] font-black text-slate-700 uppercase tracking-wider text-center transition-colors"
                        >
                          {isAr ? "السجل الطبي" : "Chart"}
                        </button>
                        <button 
                          onClick={() => handleDischargeBed(bed.id)} 
                          className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-[10px] font-black uppercase tracking-wider text-center transition-colors flex items-center justify-center gap-1"
                        >
                          <LogOut className="w-3 h-3" />
                          {isAr ? "إخلاء السرير" : "Discharge"}
                        </button>
                     </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center text-center space-y-2">
                    <User className="w-8 h-8 text-slate-200" />
                    <p className="text-xs font-bold text-slate-400">{isAr ? "السرير متاح للقبول" : "Bed available for admission"}</p>
                    <button 
                      onClick={() => {
                        if (!selectedPatient) {
                          toast.error(isAr ? "يرجى تحديد المريض من الشريط الأعلى أولاً!" : "Please select a patient from the top bar first!");
                          setIsSearchingPatient(true);
                          return;
                        }
                        setAssigningBed(bed);
                      }} 
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? "تخصيص السرير للمريض" : "Assign Bed"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-16 text-center bg-white border border-slate-200 rounded-3xl">
             <Bed className="w-16 h-16 text-slate-200 mx-auto mb-4" />
             <h3 className="text-xl font-black text-slate-800 mb-2">{isAr ? "لا توجد أسرة مجهزة بهذا القسم" : "No Beds Configured"}</h3>
          </div>
        )}
      </div>

      {/* Bed Assignment Modal */}
      {assigningBed && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-modal flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 border border-slate-200">
            <div className="flex justify-between items-center border-b pb-4">
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Bed className="w-5 h-5 text-indigo-600" />
                {isAr ? `تسكين المريض بالسرير (${assigningBed.bedNumber})` : `Assign Bed (${assigningBed.bedNumber})`}
              </h3>
              <button onClick={() => setAssigningBed(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-1">
              <div className="text-xs font-bold text-indigo-700">{isAr ? "المريض المحدد:" : "Selected Patient:"}</div>
              <div className="text-base font-black text-indigo-950">{isAr ? selectedPatient.nameAr : selectedPatient.nameEn}</div>
              <div className="text-xs text-indigo-600 font-mono">MRN: {selectedPatient.mrn} • Age: {selectedPatient.age}</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "السبب الطبي للقبول والتنويم" : "Admission Diagnosis / Reason"}</label>
                <textarea 
                  rows={3} 
                  value={admissionReason} 
                  onChange={(e) => setAdmissionReason(e.target.value)} 
                  placeholder={isAr ? "أدخل التشخيص المبدئي أو ملاحظات التنويم..." : "Enter admission diagnosis or notes..."} 
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">{isAr ? "الطبيب المعالج المسؤول" : "Attending Doctor"}</label>
                <input 
                  type="text" 
                  value={attendingDoctor} 
                  onChange={(e) => setAttendingDoctor(e.target.value)} 
                  placeholder={isAr ? "اسم استشاري التنويم..." : "Attending Physician Name..."} 
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs font-bold bg-slate-50"
                />
              </div>
            </div>

            <button 
              onClick={handleConfirmBedAssignment}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl transition-all"
            >
              {isAr ? "تأكيد التسكين وفتح أمر القبول" : "Confirm Assignment & Open Admission"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

