import React, { useMemo } from "react";
import { 
  Clock, Activity, FileText, Pill, FlaskConical, Stethoscope, 
  CheckCircle2, AlertTriangle, Syringe, ClipboardList, Zap,
  UserPlus, LogOut, ArrowRight, ClipboardCheck
} from "lucide-react";
import { motion } from "motion/react";
import { useHIS } from "../context/HISContext";
import { Patient, PatientVisitWorkflow, ClinicalNote, VitalSigns, Order, MARRecord } from "../types";

interface TimelineEvent {
  id: string;
  type: "journey" | "vital" | "note" | "order" | "mar" | "assessment";
  titleAr: string;
  titleEn: string;
  descAr?: string;
  descEn?: string;
  timestamp: string;
  staffName: string;
  staffRole?: string;
  status?: string;
  priority?: string;
  color: string;
  icon: any;
  data?: any;
}

export function UnifiedClinicalTimeline({ patientId, isAr }: { patientId: string, isAr: boolean }) {
  const { 
    patients, 
    patientJourneys = [], 
    marRecords = [], 
    prescriptions = [], 
    cpoeOrders = [],
    labResults = [],
    radiologyReports = []
  } = useHIS();

  const patient = patients.find(p => p.id === patientId || p.mrn === patientId);
  
  const events = useMemo(() => {
    const list: TimelineEvent[] = [];
    if (!patient) return list;

    // 1. Journey Steps
    const journeys = patientJourneys.filter(j => j.patientId === patient.id);
    journeys.forEach((j: any) => {
      list.push({
        id: `journey-${j.id}`,
        type: "journey",
        titleAr: j.notesAr || `انتقال إلى ${j.department}`,
        titleEn: j.notesEn || `Moved to ${j.department}`,
        timestamp: j.startTime || j.timestamp,
        staffName: j.completedByStaffId || "System",
        status: j.status,
        color: "blue",
        icon: j.status === "Registered" ? UserPlus : j.status === "Discharged" ? LogOut : ArrowRight
      });
    });

    // 2. Clinical Notes (from patient object)
    const notes: ClinicalNote[] = (patient as any).clinicalNotes || [];
    notes.forEach(n => {
      list.push({
        id: `note-${n.id}`,
        type: "note",
        titleAr: "ملاحظة سريرية",
        titleEn: "Clinical Progress Note",
        descAr: n.content || (n.soapData ? `الخطة: ${n.soapData.plan}` : ""),
        descEn: n.content || (n.soapData ? `Plan: ${n.soapData.plan}` : ""),
        timestamp: n.timestamp,
        staffName: n.staffName,
        staffRole: n.noteType,
        color: "emerald",
        icon: FileText,
        data: n
      });
    });

    // 3. Vitals History
    const vitals: VitalSigns[] = (patient as any).vitalsHistory || [];
    vitals.forEach(v => {
      list.push({
        id: `vital-${v.id}`,
        type: "vital",
        titleAr: "قياس المؤشرات الحيوية",
        titleEn: "Vital Signs Recorded",
        descAr: `الضغط: ${v.bloodPressure || v.bp} • النبض: ${v.pulse || v.hr} • الحرارة: ${v.temperature || v.temp}°C`,
        descEn: `BP: ${v.bloodPressure || v.bp} • HR: ${v.pulse || v.hr} • Temp: ${v.temperature || v.temp}°C`,
        timestamp: v.timestamp || (v as any).recordedAt,
        staffName: (v as any).author || "Nursing",
        color: "rose",
        icon: Activity,
        data: v
      });
    });

    // 4. Orders
    const orders: Order[] = (patient as any).orders || [];
    orders.forEach(o => {
      list.push({
        id: `order-${o.id}`,
        type: "order",
        titleAr: `طلب ${o.orderType || (o as any).type}`,
        titleEn: `${o.orderType || (o as any).type} Order`,
        descAr: o.itemName || (o as any).name,
        descEn: o.itemName || (o as any).name,
        timestamp: o.timestamp || (o as any).date,
        staffName: o.staffId || "Physician",
        status: o.status,
        priority: o.priority,
        color: o.priority === "stat" ? "rose" : "indigo",
        icon: o.orderType === "lab" ? FlaskConical : o.orderType === "radiology" ? Zap : Pill,
        data: o
      });
    });

    // 5. MAR Administrations
    const patientMar = marRecords.filter(m => m.patientId === patient.id && m.status === "administered");
    patientMar.forEach(m => {
      list.push({
        id: `mar-${m.id}`,
        type: "mar",
        titleAr: "إعطاء دواء",
        titleEn: "Medication Administered",
        descAr: `${m.medicationName} - ${m.dosage} (${m.route})`,
        descEn: `${m.medicationName} - ${m.dosage} (${m.route})`,
        timestamp: m.administeredTime || m.scheduledTime,
        staffName: m.administeredByStaffId || "Nurse",
        status: "Administered",
        color: "emerald",
        icon: Syringe,
        data: m
      });
    });

    // 6. Lab Results
    const patientLabs = labResults.filter(l => l.patientId === patient.id);
    patientLabs.forEach(l => {
      list.push({
        id: `lab-${l.id}`,
        type: "order", // Reuse order icon/color or create specific
        titleAr: "نتائج مخبرية",
        titleEn: "Lab Results Released",
        descAr: `${l.testName}: ${l.value} ${l.unit || ""}`,
        descEn: `${l.testName}: ${l.value} ${l.unit || ""}`,
        timestamp: l.date,
        staffName: l.performedBy || "Laboratory",
        status: l.status,
        color: l.flag === "critical" ? "rose" : "emerald",
        icon: FlaskConical,
        data: l
      });
    });

    // 7. Radiology
    const patientRad = radiologyReports.filter(r => r.patientId === patient.id);
    patientRad.forEach(r => {
      list.push({
        id: `rad-${r.id}`,
        type: "order",
        titleAr: "تقرير أشعة",
        titleEn: "Radiology Report Available",
        descAr: r.studyName,
        descEn: r.studyName,
        timestamp: r.date,
        staffName: r.radiologistId || "Radiology",
        status: r.status,
        color: "indigo",
        icon: Zap,
        data: r
      });
    });

    // Sort by timestamp descending
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [patient, patientJourneys, marRecords, prescriptions, cpoeOrders, labResults, radiologyReports]);

  if (!patient) return <div className="p-8 text-center text-slate-400">{isAr ? "لم يتم العثور على سجل المريض" : "Patient record not found"}</div>;

  return (
    <div className="p-4 bg-slate-50 min-h-full">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-indigo-600" />
            {isAr ? "التسلسل الزمني السريري الموحد" : "Unified Clinical Timeline"}
          </h2>
          <div className="flex gap-2">
             <span className="px-3 py-1 bg-white border rounded-full text-xs font-bold text-slate-500 shadow-sm">
               {events.length} {isAr ? "حدث" : "Events"}
             </span>
          </div>
        </div>

        <div className="relative border-l-2 border-slate-200 ml-4 rtl:ml-0 rtl:mr-4 pl-8 rtl:pl-0 rtl:pr-8 space-y-8">
          {events.map((event, idx) => (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: isAr ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="relative"
            >
              {/* Dot */}
              <div className={`absolute -left-[41px] rtl:-right-[41px] top-1 w-6 h-6 rounded-full border-4 border-slate-50 bg-${event.color}-500 flex items-center justify-center shadow-sm`}>
                <event.icon className="w-3 h-3 text-white" />
              </div>

              {/* Card */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition group">
                <div className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                       <span className={`text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-${event.color}-100 text-${event.color}-700`}>
                         {isAr ? event.titleAr : event.titleEn}
                       </span>
                       {event.priority === "stat" && (
                         <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded animate-pulse font-bold uppercase">STAT</span>
                       )}
                    </div>
                    <time className="text-xs font-bold text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US', {
                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </time>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 mb-1">
                    {isAr ? (event.descAr || event.titleAr) : (event.descEn || event.titleEn)}
                  </h3>

                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                        {event.staffName?.charAt(0) || "S"}
                      </div>
                      <span className="text-xs font-bold text-slate-600">{event.staffName}</span>
                    </div>
                    {event.status && (
                      <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {event.status}
                      </span>
                    )}
                  </div>
                </div>

                {/* Optional Data Expand (Simplified for now) */}
                {event.type === 'note' && event.data?.soapData && (
                  <div className="bg-slate-50 p-3 text-[11px] border-t border-slate-100 grid grid-cols-2 gap-2 font-medium text-slate-500">
                    <div><span className="font-bold text-slate-700">{isAr ? "الذاتي:" : "Subjective:"}</span> {event.data.soapData.subjective}</div>
                    <div><span className="font-bold text-slate-700">{isAr ? "التقييم:" : "Assessment:"}</span> {event.data.soapData.assessment}</div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {events.length === 0 && (
            <div className="py-20 text-center">
              <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-bold">{isAr ? "لا توجد أحداث سريرية مسجلة حتى الآن" : "No clinical events recorded yet"}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
