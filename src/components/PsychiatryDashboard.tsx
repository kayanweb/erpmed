import React, { useState } from "react";
import {
  Brain,
  FileText,
  Calendar,
  Pill,
  MessageSquare,
  UserCheck,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

export default function PsychiatryDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"sessions" | "tasks">("sessions");

  const [sessions, setSessions] = useState([
    {
      id: "PSY-01",
      patient: "Ahmed Youssef",
      type: "Cognitive Behavioral",
      time: "10:00 AM",
      status: "Completed",
    },
    {
      id: "PSY-02",
      patient: "Sarah Ali",
      type: "Initial Psych Assessment",
      time: "11:30 AM",
      status: "In Progress",
    },
  ]);

  // Dedicated Psychiatry Modals
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showProgressNoteModal, setShowProgressNoteModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [selectedSessionPatient, setSelectedSessionPatient] = useState("Sarah Ali");

  const [sessionForm, setSessionForm] = useState({ patient: "", type: "Cognitive Behavioral (CBT)", time: "12:00 PM" });
  const [assessmentForm, setAssessmentForm] = useState({ appearance: "Normal", mood: "Euthymic", thoughts: "Logical", diagnosis: "Generalized Anxiety Disorder" });
  const [progressForm, setProgressForm] = useState({ summary: "", response: "Good progress", nextSteps: "" });
  const [rxForm, setRxForm] = useState({ medication: "Escitalopram 10mg", dosage: "1 tablet daily", duration: "30 days" });
  const [riskForm, setRiskForm] = useState({ ideation: "None", riskLevel: "Low", plan: "Outpatient follow-up" });

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Brain className="w-7 h-7 text-indigo-600" />
            {isAr ? "الطب النفسي (Psychiatry)" : "Psychiatry & Mental Health"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr
              ? "إدارة التقييمات النفسية والجلسات العلاجية"
              : "Psychiatric assessments and therapy sessions"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setActiveTab("sessions")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "sessions" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "الجلسات العلاجية" : "Therapy Sessions"}
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "tasks" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"} flex items-center gap-1.5`}
          >
            <ClipboardList className="w-4 h-4" />
            {isAr ? "المهام السريرية" : "Clinical Tasks"}
          </button>
        </div>
      </div>

      {activeTab === "tasks" ? (
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm">
          <DepartmentTasks
            language={language}
            departmentId="psychiatry"
            departmentName={isAr ? "قسم الطب النفسي" : "Psychiatry Unit"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  {isAr ? "جدول الجلسات" : "Session Schedule"}
                </h3>
                <button 
                  onClick={() => setShowNewSessionModal(true)} 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm cursor-pointer"
                >
                  {isAr ? "جلسة جديدة" : "New Session"}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table
                  className="w-full text-left text-sm"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الوقت" : "Time"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "المريض" : "Patient"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "النوع" : "Session Type"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الحالة" : "Status"}
                      </th>
                      <th className="px-4 py-3 font-bold text-center">
                        {isAr ? "إجراءات" : "Actions"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sessions.map((session, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-bold text-slate-700">
                          {session.time}
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {session.patient}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {session.type}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${session.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedSessionPatient(session.patient);
                              setShowAssessmentModal(true);
                            }}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            {isAr ? "تقييم أولي" : "Assessment"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedSessionPatient(session.patient);
                              setShowProgressNoteModal(true);
                            }}
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1.5 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            {isAr ? "تطور الحالة" : "Progress Note"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 mb-4">
                {isAr ? "أدوات الطب النفسي" : "Psychiatry Tools"}
              </h3>
              <div className="space-y-3">
                <button onClick={() => setShowAssessmentModal(true)} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200 cursor-pointer">
                  <UserCheck className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "تقييم نفسي شامل" : "Comprehensive Psych Eval"}
                  </span>
                </button>
                <button onClick={() => setShowPrescriptionModal(true)} className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-rose-200 cursor-pointer">
                  <Pill className="w-5 h-5" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "وصف أدوية نفسية" : "Psychiatric Prescriptions"}
                  </span>
                </button>
                <button onClick={() => setShowProgressNoteModal(true)} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200 cursor-pointer">
                  <MessageSquare className="w-5 h-5 text-amber-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "ملاحظات الجلسة العلاجية" : "Therapy Session Notes"}
                  </span>
                </button>
                <button onClick={() => setShowRiskModal(true)} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200 cursor-pointer">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr
                      ? "تقييم خطورة وميول"
                      : "Risk Assessment (Suicide/Harm)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: New Psychiatry Session */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {isAr ? "حجز جلسة علاج نفسي جديدة" : "Schedule Psychiatry Session"}
              </h3>
              <button onClick={() => setShowNewSessionModal(false)} className="hover:bg-indigo-700 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setSessions([...sessions, {
                id: `PSY-0${sessions.length + 1}`,
                patient: sessionForm.patient || "Patient",
                type: sessionForm.type,
                time: sessionForm.time,
                status: "In Progress"
              }]);
              toast.success(isAr ? "تم حجز وتأكيد جلسة العلاج النفسي بنجاح" : "Psychiatry session scheduled successfully");
              setShowNewSessionModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "اسم المريض" : "Patient Name"}</label>
                <input type="text" value={sessionForm.patient} onChange={e => setSessionForm({...sessionForm, patient: e.target.value})} placeholder={isAr ? "أدخل اسم المريض..." : "Enter patient name..."} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "نوع الجلسة العلاجية" : "Session Type"}</label>
                <select value={sessionForm.type} onChange={e => setSessionForm({...sessionForm, type: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                  <option value="Cognitive Behavioral (CBT)">Cognitive Behavioral (CBT)</option>
                  <option value="Initial Psych Assessment">Initial Psych Assessment</option>
                  <option value="Psychotherapy & Counseling">Psychotherapy & Counseling</option>
                  <option value="Family Therapy Session">Family Therapy Session</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "وقت الجلسة" : "Session Time"}</label>
                <input type="text" value={sessionForm.time} onChange={e => setSessionForm({...sessionForm, time: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowNewSessionModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">{isAr ? "حجز الجلسة" : "Schedule Session"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Psychiatric Assessment */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                {isAr ? `التقييم النفسي للمريض (${selectedSessionPatient})` : `Psychiatric Assessment (${selectedSessionPatient})`}
              </h3>
              <button onClick={() => setShowAssessmentModal(false)} className="hover:bg-indigo-700 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? "تم حفظ التقييم النفسي الشامل بنجاح" : "Psychiatric assessment saved successfully");
              setShowAssessmentModal(false);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "المظهر والسلوك" : "Appearance & Behavior"}</label>
                  <input type="text" value={assessmentForm.appearance} onChange={e => setAssessmentForm({...assessmentForm, appearance: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "المزاج والوجدان" : "Mood & Affect"}</label>
                  <input type="text" value={assessmentForm.mood} onChange={e => setAssessmentForm({...assessmentForm, mood: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "محتوى ونمط التفكير" : "Thought Content & Process"}</label>
                <input type="text" value={assessmentForm.thoughts} onChange={e => setAssessmentForm({...assessmentForm, thoughts: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "التشخيص النفسي" : "Psychiatric Diagnosis (DSM-5 / ICD-11)"}</label>
                <input type="text" value={assessmentForm.diagnosis} onChange={e => setAssessmentForm({...assessmentForm, diagnosis: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowAssessmentModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">{isAr ? "حفظ التقييم" : "Save Assessment"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Therapy Progress Note */}
      {showProgressNoteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-emerald-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {isAr ? `ملاحظات تطور الجلسة النفسية (${selectedSessionPatient})` : `Therapy Progress Note (${selectedSessionPatient})`}
              </h3>
              <button onClick={() => setShowProgressNoteModal(false)} className="hover:bg-emerald-700 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? "تم حفظ ملاحظات محضر الجلسة بنجاح" : "Therapy session notes saved successfully");
              setShowProgressNoteModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "ملخص الجلسة والتدخلات العلاجية" : "Session Summary & Interventions"}</label>
                <textarea value={progressForm.summary} onChange={e => setProgressForm({...progressForm, summary: e.target.value})} rows={3} placeholder={isAr ? "تفاصيل محضر الجلسة..." : "Session notes..."} className="w-full border rounded-xl p-2 text-sm mt-1" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "استجابة المريض" : "Patient Response"}</label>
                <input type="text" value={progressForm.response} onChange={e => setProgressForm({...progressForm, response: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowProgressNoteModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition text-sm">{isAr ? "حفظ الملاحظات" : "Save Notes"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Psychiatric Prescription CPOE */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-rose-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Pill className="w-5 h-5" />
                {isAr ? "وصف الأدوية والمثبطات النفسية" : "Psychiatric Prescriptions (CPOE)"}
              </h3>
              <button onClick={() => setShowPrescriptionModal(false)} className="hover:bg-rose-700 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? `تمت إضافة الوصفة النفسية (${rxForm.medication}) وإرسالها للصيدلية` : `Psychiatric prescription (${rxForm.medication}) sent to pharmacy`);
              setShowPrescriptionModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "الدواء النفسي" : "Psychotropic Medication"}</label>
                <select value={rxForm.medication} onChange={e => setRxForm({...rxForm, medication: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                  <option value="Escitalopram 10mg">Escitalopram 10mg (SSRI)</option>
                  <option value="Sertraline 50mg">Sertraline 50mg (SSRI)</option>
                  <option value="Quetiapine 25mg">Quetiapine 25mg (Atypical Antipsychotic)</option>
                  <option value="Olanzapine 5mg">Olanzapine 5mg</option>
                  <option value="Alprazolam 0.5mg">Alprazolam 0.5mg (Anxiolytic)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الجرعة" : "Dosage"}</label>
                  <input type="text" value={rxForm.dosage} onChange={e => setRxForm({...rxForm, dosage: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "المدة" : "Duration"}</label>
                  <input type="text" value={rxForm.duration} onChange={e => setRxForm({...rxForm, duration: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowPrescriptionModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition text-sm">{isAr ? "إصدار الوصفة" : "Issue Prescription"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Risk Assessment */}
      {showRiskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-rose-700 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" />
                {isAr ? "تقييم مخاطر السلوك الإيذائي والانتحار" : "Suicide & Self-Harm Risk Assessment"}
              </h3>
              <button onClick={() => setShowRiskModal(false)} className="hover:bg-rose-800 p-1 rounded-lg transition">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? "تم حفظ وتقييم بروتوكول سلامة المريض" : "Suicide/Self-harm risk protocol saved successfully");
              setShowRiskModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "مستوى الخطورة" : "Risk Level"}</label>
                <select value={riskForm.riskLevel} onChange={e => setRiskForm({...riskForm, riskLevel: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                  <option value="Low">{isAr ? "منخفض - متابعة خارجية" : "Low Risk"}</option>
                  <option value="Moderate">{isAr ? "متوسط - الملاحظة المستمرة" : "Moderate Risk"}</option>
                  <option value="High">{isAr ? "عالي جدًا - دخول فوري ومراقبة دقيقة" : "High Risk (Immediate Action)"}</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "خطة السلامة والطوارئ" : "Safety Plan & Action"}</label>
                <textarea value={riskForm.plan} onChange={e => setRiskForm({...riskForm, plan: e.target.value})} rows={3} className="w-full border rounded-xl p-2 text-sm mt-1" required />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowRiskModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-rose-700 text-white font-bold rounded-xl hover:bg-rose-800 transition text-sm">{isAr ? "اعتماد تقييم الخطورة" : "Approve Assessment"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
