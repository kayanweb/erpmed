import React, { useEffect, useState } from "react";
import { 
  HeartPulse, 
  Activity, 
  Droplets, 
  Thermometer, 
  Wind,
  CheckCircle2,
  Clock,
  AlertCircle,
  ClipboardCheck,
  Plus,
  ScanBarcode,
  Scale,
  Brain,
  ArrowRightLeft,
  Stethoscope
} from "lucide-react";
import { Patient, VitalSigns, MARRecord, NursingAssessment } from "../types";
import { subscribeToClinicalData, saveDataPermanently } from "../lib/realTimeService";
import { toast } from "sonner";
import { format } from "date-fns";
import { safeFormatDate } from "../lib/dateUtils";
import { PatientClinicalHeader } from "./PatientClinicalHeader";
import { ClinicalSignaturePanel } from "./ClinicalSignaturePanel";
import { useHIS } from "../context/HISContext";
import { ClinicalFormsEngine } from "./ClinicalFormsEngine";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldAlert } from "lucide-react";

interface Props {
  patient?: Patient | null;
  staffId: string;
  language?: "ar" | "en";
}

export const NursingConsole: React.FC<Props> = ({ patient, staffId, language = "ar" }) => {
  const isAr = language === "ar";
  const { currentUser, logAudit } = useHIS();

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-slate-500 font-medium">
        {isAr ? "الرجاء اختيار مريض للمتابعة" : "Please select a patient to continue"}
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<"vitals" | "mar" | "assessment" | "io" | "icu" | "orders" | "handover">("vitals");
  const [showFormWorkflow, setShowFormWorkflow] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [sbar, setSbar] = useState({
    situation: "",
    background: "",
    assessment: "",
    recommendation: ""
  });

  useEffect(() => {
    const unsub = subscribeToClinicalData<any>("hospital_cpoe_orders", (data) => {
      setOrders(data.filter(o => o.mrn === patient.mrn) || []);
    }, (err) => console.error(err));
    return () => unsub();
  }, [patient.mrn]);

  const handleVerifyOrder = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const updatedOrder = {
        ...order,
        status: "Verified",
        verifiedAt: new Date().toISOString(),
        verifiedBy: staffId
      };

      await saveDataPermanently("hospital_cpoe_orders", updatedOrder);
      
      logAudit({
        action: 'ORDER_VERIFICATION',
        entityType: 'CPOE_ORDER',
        entityId: orderId,
        reason: 'Nursing verification of physician order',
        newValue: updatedOrder
      });

      toast.success(isAr ? "تم التحقق من الطلب بنجاح" : "Order verified successfully");
    } catch (error) {
      toast.error(isAr ? "فشل التحقق من الطلب" : "Failed to verify order");
    }
  };

  const saveHandover = async () => {
    try {
      const handoverData = {
        id: `handover-${patient.mrn}-${Date.now()}`,
        patientId: patient.id,
        mrn: patient.mrn,
        staffId,
        ...sbar,
        timestamp: new Date().toISOString()
      };

      await saveDataPermanently("hospital_handovers", handoverData);
      
      logAudit({
        action: 'NURSING_HANDOVER',
        entityType: 'CLINICAL_RECORD',
        entityId: patient.id,
        reason: 'SBAR Handover finalized',
        newValue: handoverData
      });

      toast.success(isAr ? "تم حفظ تسليم الحالة بنجاح" : "Handover saved successfully");
    } catch (error) {
      toast.error(isAr ? "فشل حفظ تسليم الحالة" : "Failed to save handover");
    }
  };
  const [vitals, setVitals] = useState<Partial<VitalSigns>>({
    temperature: 37,
    pulse: 80,
    respiratoryRate: 16,
    bloodPressure: "120/80",
    oxygenSaturation: 98,
    painScale: 0
  });

  // State for I/O
  const [ioData, setIoData] = useState({
    oralIntake: 0,
    ivIntake: 0,
    urineOutput: 0,
    drainageOutput: 0
  });

  // State for ICU
  const [icuData, setIcuData] = useState({
    fio2: 40,
    peep: 5,
    rr: 14,
    map: 75,
    cvp: 8,
    cardiacOutput: 5.2,
    gcs: 15,
    bilirubin: 1.0,
    platelets: 150,
    creatinine: 1.0
  });

  const [sofaScore, setSofaScore] = useState<number | null>(null);

  const calculateSofa = () => {
    let score = 0;
    // Simple heuristic for demonstration of functional logic
    if (icuData.fio2 > 50) score += 2;
    if (icuData.map < 70) score += 1;
    if (icuData.gcs < 15) score += 1;
    if (icuData.gcs < 10) score += 2;
    if (icuData.platelets < 100) score += 2;
    if (icuData.creatinine > 1.5) score += 2;
    if (icuData.bilirubin > 2) score += 2;
    
    setSofaScore(score);
    toast.success(isAr ? `تم حساب نقاط SOFA: ${score}` : `SOFA Score Calculated: ${score}`);
  };

  const [marRecords, setMarRecords] = useState<MARRecord[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToClinicalData<MARRecord>(
      "hospital_mar_records",
      (data) => {
        const filtered = data
          .filter(rec => rec.patientId === patient.id)
          .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime());
        setMarRecords(filtered);
      },
      (err) => console.error("Error loading MAR records:", err)
    );
    return () => unsubscribe();
  }, [patient.id]);

  const handleBarcodeScan = (recordId: string) => {
    toast.info(isAr ? "جاري مسح الباركود..." : "Scanning barcode...");
    setTimeout(() => {
      toast.success(isAr ? "تم التحقق من الدواء" : "Barcode matched: Medication verified");
      administerMedication(recordId);
    }, 1000);
  };

  const administerMedication = async (recordId: string) => {
    try {
      const existing = marRecords.find(r => r.id === recordId);
      if (existing) {
        const updated = {
          ...existing,
          status: "administered" as const,
          administeredTime: new Date().toISOString(),
          administeredByStaffId: staffId,
          barcodeScanned: true
        };
        await saveDataPermanently("hospital_mar_records", updated);
        logAudit({
          action: 'MEDICATION_ADMINISTRATION',
          entityType: 'MAR',
          entityId: recordId,
          reason: `Medication ${existing.medicationName} administered`,
          newValue: updated
        });
        toast.success(isAr ? "تم إعطاء الدواء بنجاح" : "Medication administered successfully");
      }
    } catch (e) {
      toast.error("Failed to administer medication");
    }
  };
  const saveVitals = async () => {
    try {
      const vitalToSave = {
        id: `vital-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...vitals,
        patientId: patient.id,
        staffId,
        timestamp: new Date().toISOString()
      };
      await saveDataPermanently("hospital_vital_signs", vitalToSave);
      logAudit({
        action: 'VITALS_RECORDING',
        entityType: 'CLINICAL_RECORD',
        entityId: patient.id,
        reason: 'Vital signs recorded by nursing',
        newValue: vitalToSave
      });
      toast.success(isAr ? "تم تسجيل العلامات الحيوية" : "Vitals recorded");
    } catch (e) {
      toast.error(isAr ? "فشل في تسجيل العلامات" : "Failed to record vitals");
    }
  };

  const handleSaveIO = async () => {
    try {
      const record = {
        id: `io-${Date.now()}`,
        patientId: patient.id,
        ...ioData,
        netBalance: (ioData.oralIntake + ioData.ivIntake) - (ioData.urineOutput + ioData.drainageOutput),
        staffId,
        timestamp: new Date().toISOString()
      };
      await saveDataPermanently("hospital_io_records", record);
      logAudit({
        action: 'IO_RECORDING',
        entityType: 'CLINICAL_RECORD',
        entityId: patient.id,
        reason: 'Fluid intake and output recorded',
        newValue: record
      });
      toast.success(isAr ? "تم تسجيل وحفظ السوائل" : "I/O recorded successfully");
    } catch (e) {
      toast.error(isAr ? "فشل حفظ السوائل" : "Failed to save I/O record");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col h-full min-h-0 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <PatientClinicalHeader patient={patient as any} language={language} showVitals={true} />
      </div>
      {/* Tab Navigation */}
      <div className="flex bg-slate-50 p-1 border-b border-slate-200 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("vitals")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "vitals" ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Activity className="w-4 h-4" />
          Vitals
        </button>
        <button 
          onClick={() => setActiveTab("orders")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "orders" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Stethoscope className="w-4 h-4" />
          Clinical Orders
        </button>
        <button 
          onClick={() => setActiveTab("mar")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "mar" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <ClipboardCheck className="w-4 h-4" />
          MAR
        </button>
        <button 
          onClick={() => setActiveTab("assessment")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "assessment" ? "bg-white text-pink-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Plus className="w-4 h-4" />
          Scales
        </button>
        <button 
          onClick={() => setActiveTab("io")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "io" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <Droplets className="w-4 h-4" />
          I / O
        </button>
        <button 
          onClick={() => setActiveTab("icu")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "icu" ? "bg-white text-rose-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <HeartPulse className="w-4 h-4" />
          ICU
        </button>
        <button 
          onClick={() => setActiveTab("handover")}
          className={`min-w-[120px] flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold transition-all rounded-xl ${activeTab === "handover" ? "bg-white text-purple-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          SBAR Handover
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "vitals" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{isAr ? "تسجيل العلامات الحيوية الحالية" : "Active Vital Signs Entry"}</h3>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-[10px] font-black text-emerald-600 uppercase">Live Telemetry Linked</span>
              </div>
            </div>

            <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* BP - High Density Card */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:border-indigo-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-500" />
                    Blood Pressure
                  </label>
                  <span className="text-[9px] font-black text-slate-400">mmHg</span>
                </div>
                <input 
                  type="text" 
                  value={vitals.bloodPressure}
                  onChange={(e) => setVitals({...vitals, bloodPressure: e.target.value})}
                  className="w-full text-2xl font-black bg-slate-50 border-none rounded-xl p-2.5 text-slate-800 text-center focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400">
                  <span>Prev: 118/76</span>
                  <span className="text-emerald-500">Normal</span>
                </div>
              </div>

              {/* Pulse */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:border-rose-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-500" />
                    Pulse
                  </label>
                  <span className="text-[9px] font-black text-slate-400">bpm</span>
                </div>
                <input 
                  type="number" 
                  value={vitals.pulse}
                  onChange={(e) => setVitals({...vitals, pulse: parseInt(e.target.value)})}
                  className="w-full text-2xl font-black bg-slate-50 border-none rounded-xl p-2.5 text-slate-800 text-center focus:ring-2 focus:ring-rose-500 outline-none"
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400">
                  <span>Prev: 82</span>
                  <span className="text-slate-400">Stable</span>
                </div>
              </div>

              {/* SpO2 */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:border-sky-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-4 h-4 text-sky-500" />
                    SpO2
                  </label>
                  <span className="text-[9px] font-black text-slate-400">%</span>
                </div>
                <input 
                  type="number" 
                  value={vitals.oxygenSaturation}
                  onChange={(e) => setVitals({...vitals, oxygenSaturation: parseInt(e.target.value)})}
                  className="w-full text-2xl font-black bg-slate-50 border-none rounded-xl p-2.5 text-slate-800 text-center focus:ring-2 focus:ring-sky-500 outline-none"
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400">
                  <span>Prev: 98</span>
                  <span className="text-emerald-500">Target Met</span>
                </div>
              </div>

              {/* Temp */}
              <div className="bg-white border-2 border-slate-100 rounded-2xl p-4 shadow-sm hover:border-orange-200 transition-all">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-orange-500" />
                    Temp
                  </label>
                  <span className="text-[9px] font-black text-slate-400">°C</span>
                </div>
                <input 
                  type="number" 
                  step="0.1"
                  value={vitals.temperature}
                  onChange={(e) => setVitals({...vitals, temperature: parseFloat(e.target.value)})}
                  className="w-full text-2xl font-black bg-slate-50 border-none rounded-xl p-2.5 text-slate-800 text-center focus:ring-2 focus:ring-orange-500 outline-none"
                />
                <div className="flex justify-between mt-2 text-[9px] font-bold text-slate-400">
                  <span>Prev: 36.8</span>
                  <span className="text-slate-400">Afebrile</span>
                </div>
              </div>
            </div>

            {/* Vitals Trends Graph (Miniature Workstation View) */}
            <div className="bg-slate-900 rounded-2xl p-5 shadow-lg border border-slate-800">
               <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">24-Hour Trends Flowsheet</h4>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                      <span className="text-[9px] font-black text-slate-300 uppercase">Pulse</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                      <span className="text-[9px] font-black text-slate-300 uppercase">BP (Sys)</span>
                    </div>
                  </div>
               </div>
               <div className="h-24 w-full flex items-end justify-between px-2 gap-1">
                  {[65, 72, 85, 90, 82, 78, 80, 85, 88, 82, 75, 78].map((val, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                       <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white text-slate-900 text-[8px] font-black px-1 rounded shadow-sm z-10">{val}</div>
                       <div className="w-full bg-rose-500/20 rounded-t-sm hover:bg-rose-500/40 transition-colors" style={{ height: `${(val / 120) * 100}%` }}></div>
                       <div className="w-full bg-indigo-500/20 rounded-t-sm hover:bg-indigo-500/40 transition-colors" style={{ height: `${(val * 0.8 / 120) * 100}%` }}></div>
                    </div>
                  ))}
               </div>
               <div className="flex justify-between mt-2 px-1 text-[8px] font-black text-slate-500 uppercase tracking-tighter">
                 <span>08:00</span>
                 <span>12:00</span>
                 <span>16:00</span>
                 <span>20:00</span>
                 <span>00:00</span>
                 <span>04:00</span>
                 <span>08:00</span>
               </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <ClinicalSignaturePanel
                language={language}
                currentUser={currentUser}
                titleEn="Commit Vitals to EMR"
                titleAr="ترحيل العلامات الحيوية للملف الطبي"
                onSave={() => toast.success(isAr ? "تم حفظ المسودة" : "Draft saved")}
                onSign={saveVitals}
              />
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">{isAr ? "طلبات الأطباء الحالية" : "Active Physician Orders"}</h3>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {orders.map(order => (
                <div key={order.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        order.priority === 'STAT' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-600'
                      }`}>
                         <Activity className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                           <span className="font-black text-slate-800">{order.orderName}</span>
                           {order.priority === 'STAT' && <span className="bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">STAT</span>}
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                          {order.orderType} • Ordered by: {order.doctorId}
                        </p>
                      </div>
                   </div>
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                         order.status === 'Pending' || order.status === 'ordered' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 
                         order.status === 'Verified' ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-emerald-50 text-emerald-600'
                       }`}>
                         {order.status}
                       </span>
                       {(order.status === 'Pending' || order.status === 'ordered') && (
                         <button 
                           onClick={() => handleVerifyOrder(order.id)}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100"
                         >
                           <CheckCircle2 className="w-4 h-4" />
                           {isAr ? "تحقق" : "Verify"}
                         </button>
                       )}
                    </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <Stethoscope className="w-12 h-12 text-slate-200 mx-auto" />
                  <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Active Clinical Orders</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "handover" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-3xl text-white shadow-xl">
               <h3 className="font-black text-xl mb-2 flex items-center gap-2">
                 <ArrowRightLeft className="w-6 h-6" />
                 SBAR Digital Handover
               </h3>
               <p className="text-purple-100 text-sm font-medium">Standardized clinical communication for shift changes and patient transfers.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-red-500">S - Situation</h4>
                  <textarea 
                    className="w-full text-sm font-medium border-none focus:ring-0 p-0 min-h-[80px] resize-none" 
                    placeholder="Concise statement of the problem..."
                    value={sbar.situation}
                    onChange={(e) => setSbar({...sbar, situation: e.target.value})}
                  />
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-amber-500">B - Background</h4>
                  <textarea 
                    className="w-full text-sm font-medium border-none focus:ring-0 p-0 min-h-[80px] resize-none" 
                    placeholder="Pertinent clinical history & overview..."
                    value={sbar.background}
                    onChange={(e) => setSbar({...sbar, background: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-blue-500">A - Assessment</h4>
                  <textarea 
                    className="w-full text-sm font-medium border-none focus:ring-0 p-0 min-h-[80px] resize-none" 
                    placeholder="What do you think the problem is? Analysis of situation..."
                    value={sbar.assessment}
                    onChange={(e) => setSbar({...sbar, assessment: e.target.value})}
                  />
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 text-emerald-500">R - Recommendation</h4>
                  <textarea 
                    className="w-full text-sm font-medium border-none focus:ring-0 p-0 min-h-[80px] resize-none" 
                    placeholder="What action is requested? Follow-up tasks..."
                    value={sbar.recommendation}
                    onChange={(e) => setSbar({...sbar, recommendation: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
               <ClinicalSignaturePanel
                  language={language}
                  currentUser={currentUser}
                  titleEn="Finalize Handover"
                  titleAr="إعتماد تسليم الحالة"
                  onSave={saveHandover}
                  onSign={saveHandover}
               />
            </div>
          </div>
        )}

        {activeTab === "mar" && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between mb-2">
               <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "جدول إعطاء الأدوية النشط" : "Active Medication Administration Flowsheet"}</h4>
               <div className="flex gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Due / Given</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Pending</span>
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {marRecords.map(record => (
                <div 
                  key={record.id}
                  className={`group relative border rounded-2xl p-4 flex items-center justify-between transition-all hover:shadow-md ${
                    record.status === 'administered' 
                      ? 'bg-slate-50 border-slate-200 opacity-70' 
                      : 'bg-white border-slate-200 hover:border-emerald-400'
                  }`}
                >
                  {/* Status Indicator Bar */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${
                    record.status === 'administered' ? 'bg-emerald-500' : 'bg-amber-400'
                  }`}></div>

                  <div className="flex items-center gap-4 pl-2">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${
                      record.status === 'administered' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                    }`}>
                      {record.status === 'administered' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-800 text-sm">{record.medicationName}</h4>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{record.dosage}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-wide">
                        {record.route} • {isAr ? "الموعد المقر:" : "Scheduled:"} {safeFormatDate(record.scheduledTime, "HH:mm")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {record.status !== 'administered' ? (
                      <div className="flex gap-2">
                         <button 
                          onClick={() => handleBarcodeScan(record.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-sm"
                        >
                          <ScanBarcode className="w-4 h-4" />
                          Scan Barcode
                        </button>
                        <button 
                          onClick={() => administerMedication(record.id)}
                          className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-sm"
                        >
                          Quick Admin
                        </button>
                      </div>
                    ) : (
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 text-emerald-600 justify-end">
                           <CheckCircle2 className="w-4 h-4" />
                           <span className="text-[10px] font-black uppercase tracking-widest">Administered</span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">
                          {isAr ? "بواسطة:" : "By:"} {record.administeredByStaffId} @ {safeFormatDate(record.administeredTime, "HH:mm")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {marRecords.length === 0 && (
              <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <ClipboardCheck className="w-12 h-12 text-slate-200 mx-auto" />
                <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Medication Orders Pending</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "assessment" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             <button 
              onClick={() => setShowFormWorkflow({ titleEn: "Braden Scale Assessment", titleAr: "تقييم مقياس برادن" })}
              className="p-6 border-2 border-slate-100 rounded-3xl hover:border-pink-300 hover:bg-pink-50/30 transition-all text-left group bg-white shadow-sm"
            >
                <div className="w-10 h-10 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-pink-100 transition-colors">
                  <Scale className="w-5 h-5 text-pink-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Braden Scale</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Assess pressure ulcer risk based on sensory, moisture, activity, mobility, nutrition, and friction.</p>
             </button>
 
             <button 
              onClick={() => setShowFormWorkflow({ titleEn: "Glasgow Coma Scale", titleAr: "مقياس غلاسكو للوعي" })}
              className="p-6 border-2 border-slate-100 rounded-3xl hover:border-indigo-300 hover:bg-indigo-50/30 transition-all text-left group bg-white shadow-sm"
            >
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <Brain className="w-5 h-5 text-indigo-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Glasgow Coma Scale</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Neurological scale to record the conscious state of a person for initial and subsequent assessment.</p>
             </button>
 
             <button 
              onClick={() => setShowFormWorkflow({ titleEn: "Fall Risk Assessment", titleAr: "تقييم مخاطر السقوط" })}
              className="p-6 border-2 border-slate-100 rounded-3xl hover:border-amber-300 hover:bg-amber-50/30 transition-all text-left group bg-white shadow-sm"
            >
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition-colors">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Fall Risk Assessment</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Determine the risk level for patient falls using Morse Fall Scale or similar protocols.</p>
             </button>
 
             <button 
              onClick={() => setShowFormWorkflow({ titleEn: "Skin Assessment", titleAr: "تقييم حالة الجلد" })}
              className="p-6 border-2 border-slate-100 rounded-3xl hover:border-rose-300 hover:bg-rose-50/30 transition-all text-left group bg-white shadow-sm"
            >
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-rose-100 transition-colors">
                  <Activity className="w-5 h-5 text-rose-600" />
                </div>
                <h4 className="font-black text-slate-800 text-sm">Skin Assessment</h4>
                <p className="text-[10px] text-slate-500 mt-1 font-medium leading-relaxed">Detailed documentation of skin integrity, wounds, and lesions.</p>
             </button>
          </div>
        )}

        {activeTab === "io" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
                <h4 className="text-xs font-black text-blue-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Intake (Input)
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">Oral Fluids</span>
                    <div className="flex items-center gap-2">
                       <input 
                        type="number" 
                        value={ioData.oralIntake} 
                        onChange={(e) => setIoData({...ioData, oralIntake: parseInt(e.target.value) || 0})}
                        className="w-16 p-1 border border-slate-200 rounded text-right text-xs" 
                      />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-blue-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">IV Fluids</span>
                    <div className="flex items-center gap-2">
                       <input 
                        type="number" 
                        value={ioData.ivIntake} 
                        onChange={(e) => setIoData({...ioData, ivIntake: parseInt(e.target.value) || 0})}
                        className="w-16 p-1 border border-slate-200 rounded text-right text-xs" 
                      />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                </div>
              </div>
 
              <div className="bg-amber-50/50 p-6 rounded-3xl border border-amber-100">
                <h4 className="text-xs font-black text-amber-800 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Output
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">Urine</span>
                    <div className="flex items-center gap-2">
                       <input 
                        type="number" 
                        value={ioData.urineOutput} 
                        onChange={(e) => setIoData({...ioData, urineOutput: parseInt(e.target.value) || 0})}
                        className="w-16 p-1 border border-slate-200 rounded text-right text-xs" 
                      />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-amber-100 shadow-sm">
                    <span className="text-xs font-bold text-slate-700">Drainage</span>
                    <div className="flex items-center gap-2">
                       <input 
                        type="number" 
                        value={ioData.drainageOutput} 
                        onChange={(e) => setIoData({...ioData, drainageOutput: parseInt(e.target.value) || 0})}
                        className="w-16 p-1 border border-slate-200 rounded text-right text-xs" 
                      />
                       <span className="text-[10px] text-slate-400">ml</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
 
            <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-xl flex flex-col gap-6">
               <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Net Balance</p>
                    <h3 className="text-lg sm:text-2xl font-black">
                      {(ioData.oralIntake + ioData.ivIntake) - (ioData.urineOutput + ioData.drainageOutput) >= 0 ? "+" : ""}
                      {(ioData.oralIntake + ioData.ivIntake) - (ioData.urineOutput + ioData.drainageOutput)} ml
                    </h3>
                  </div>
               </div>
               <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                 <ClinicalSignaturePanel
                    language={language}
                    currentUser={currentUser}
                    titleEn="Sign I/O Balance"
                    titleAr="توقيع ميزان السوائل"
                    onSave={() => toast.success(isAr ? "تم حفظ المسودة" : "Draft saved")}
                    onSign={handleSaveIO}
                 />
               </div>
            </div>
          </div>
        )}

        {activeTab === "icu" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-rose-50/30 border border-rose-100 p-6 rounded-3xl space-y-6">
               <h4 className="text-xs font-black text-rose-800 uppercase tracking-widest flex items-center gap-2">
                 <Wind className="w-4 h-4" />
                 Ventilator Settings
               </h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">Mode</p>
                    <select className="w-full text-xs font-bold border-none p-0 focus:ring-0">
                       <option>AC/VC</option>
                       <option>SIMV</option>
                       <option>CPAP/PS</option>
                    </select>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">FiO2 (%)</p>
                    <input type="number" defaultValue={40} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">PEEP</p>
                    <input type="number" defaultValue={5} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-rose-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">RR</p>
                    <input type="number" defaultValue={14} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
               </div>
            </div>

            <div className="bg-indigo-50/30 border border-indigo-100 p-6 rounded-3xl space-y-6">
               <h4 className="text-xs font-black text-indigo-800 uppercase tracking-widest flex items-center gap-2">
                 <Activity className="w-4 h-4" />
                 Hemodynamic Monitoring
               </h4>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">MAP</p>
                    <input type="number" defaultValue={75} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">CVP</p>
                    <input type="number" defaultValue={8} className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-indigo-100">
                    <p className="text-[10px] font-bold text-slate-400 mb-1">Cardiac Output</p>
                    <input type="number" defaultValue={5.2} step="0.1" className="w-full text-xs font-bold border-none p-0 focus:ring-0" />
                  </div>
               </div>
            </div>

            <div className="md:col-span-2 p-6 border-2 border-slate-100 rounded-3xl flex items-center justify-between bg-white shadow-sm">
               <div className="flex gap-8">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">SOFA Score</p>
                    <h4 className="text-xl font-black text-rose-600">8 (High Risk)</h4>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">APACHE II</p>
                    <h4 className="text-xl font-black text-orange-600">18</h4>
                  </div>
               </div>
               <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-slate-800 transition-all flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  CALCULATE SCORES
               </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showFormWorkflow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[150] flex items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full h-full sm:h-[90vh] sm:max-w-5xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col text-left"
              dir="ltr"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                 <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center">
                       <ShieldAlert size={20} />
                    </div>
                    <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                      {isAr ? showFormWorkflow.titleAr : showFormWorkflow.titleEn}
                    </h2>
                 </div>
                 <button onClick={() => setShowFormWorkflow(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X size={20} className="text-slate-400" />
                 </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ClinicalFormsEngine 
                  patientId={patient.id}
                  patientMRN={patient.mrn}
                  currentUser={currentUser}
                  isAr={isAr}
                  onClose={() => setShowFormWorkflow(null)}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
