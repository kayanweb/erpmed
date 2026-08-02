import React, { useState } from "react";
import {
  Activity,
  Calendar,
  UserCheck,
  Dumbbell,
  Stethoscope,
  FileText,
  TrendingUp,
  AlertTriangle,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

export default function RehabDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"pt" | "rehab" | "tasks">("pt");

  const [ptSessions, setPtSessions] = useState([
    {
      id: "PT-01",
      patient: "Ahmed Youssef",
      type: "Post-Op Ortho",
      therapist: "Dr. Samy",
      time: "10:00 AM",
      status: "In Progress",
    },
    {
      id: "PT-02",
      patient: "Sarah Ali",
      type: "Neuro Rehab",
      therapist: "Dr. Hoda",
      time: "11:30 AM",
      status: "Scheduled",
    },
  ]);

  // Dedicated Rehab Modals
  const [showNewSessionModal, setShowNewSessionModal] = useState(false);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDeviceModal, setShowDeviceModal] = useState(false);
  const [selectedPatientName, setSelectedPatientName] = useState("Ahmed Youssef");

  const [sessionForm, setSessionForm] = useState({ patient: "", type: "Post-Op Ortho", therapist: "Dr. Samy", time: "12:00 PM" });
  const [evalForm, setEvalForm] = useState({ rom: "Normal", strength: "4/5", gait: "Independent with cane", notes: "" });
  const [deviceForm, setDeviceForm] = useState({ device: "Wheelchair (Standard)", urgency: "Normal", notes: "" });

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Dumbbell className="w-7 h-7 text-indigo-600" />
            {isAr
              ? "العلاج الطبيعي والتأهيل (PT & Rehab)"
              : "Physical Therapy & Rehab"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr
              ? "إدارة الجلسات، التقييم الوظيفي، والتقدم"
              : "Manage sessions, functional assessments, and progress"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setActiveTab("pt")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "pt" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "العلاج الطبيعي (PT)" : "Physical Therapy"}
          </button>
          <button
            onClick={() => setActiveTab("rehab")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "rehab" ? "bg-indigo-50 text-indigo-700 border-b-2 border-indigo-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "التأهيل الوظيفي" : "Occupational Rehab"}
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
            departmentId="rehab"
            departmentName={isAr ? "قسم التأهيل الطبي" : "Rehabilitation Unit"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />
                  {isAr ? "جدول الجلسات اليومية" : "Daily Session Schedule"}
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
                        {isAr ? "وقت الجلسة" : "Time"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "المريض" : "Patient"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "نوع العلاج" : "Therapy Type"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الأخصائي" : "Therapist"}
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
                    {ptSessions.map((session, idx) => (
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
                        <td className="px-4 py-3 text-slate-600">
                          {session.therapist}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${session.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                          <button
                            onClick={() => {
                              setSelectedPatientName(session.patient);
                              setShowAssessmentModal(true);
                            }}
                            className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition cursor-pointer"
                          >
                            {isAr ? "تقييم أولي" : "Assessment"}
                          </button>
                          <button
                            onClick={() => {
                              setSelectedPatientName(session.patient);
                              setShowProgressModal(true);
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
                {isAr ? "أدوات التقييم والأجهزة" : "Assessment & Devices"}
              </h3>
              <div className="space-y-3">
                <button onClick={() => setShowAssessmentModal(true)} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200 cursor-pointer">
                  <Activity className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr
                      ? "تقييم القدرات الوظيفية"
                      : "Functional Capacity Eval"}
                  </span>
                </button>
                <button onClick={() => setShowPlanModal(true)} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200 cursor-pointer">
                  <Stethoscope className="w-5 h-5 text-teal-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "خطة التأهيل الشاملة" : "Comprehensive Rehab Plan"}
                  </span>
                </button>
                <button onClick={() => setShowDeviceModal(true)} className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-amber-200 cursor-pointer">
                  <AlertTriangle className="w-5 h-5" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr
                      ? "طلب أجهزة مساعدة (كرسي/مشاية)"
                      : "Assistive Devices Request"}
                  </span>
                </button>
                <button onClick={() => setShowProgressModal(true)} className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200 cursor-pointer">
                  <FileText className="w-5 h-5 text-purple-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "تقرير تقدم المريض" : "Patient Progress Report"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: New Rehab Session */}
      {showNewSessionModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {isAr ? "حجز جلسة علاج طبيعي جديدة" : "Schedule Rehab Session"}
              </h3>
              <button onClick={() => setShowNewSessionModal(false)} className="hover:bg-indigo-700 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setPtSessions([...ptSessions, {
                id: `PT-0${ptSessions.length + 1}`,
                patient: sessionForm.patient || "Patient",
                type: sessionForm.type,
                therapist: sessionForm.therapist,
                time: sessionForm.time,
                status: "Scheduled"
              }]);
              toast.success(isAr ? "تم إدراج جلسة العلاج الطبيعي بالجدول بنجاح" : "Rehab session scheduled successfully");
              setShowNewSessionModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "اسم المريض" : "Patient Name"}</label>
                <input type="text" value={sessionForm.patient} onChange={e => setSessionForm({...sessionForm, patient: e.target.value})} placeholder={isAr ? "أدخل اسم المريض..." : "Enter patient name..."} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1" required />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "نوع الجلسة" : "Therapy Type"}</label>
                <select value={sessionForm.type} onChange={e => setSessionForm({...sessionForm, type: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                  <option value="Post-Op Ortho">Post-Op Orthopedic</option>
                  <option value="Neuro Rehab">Neurological Rehab</option>
                  <option value="Cardiopulmonary PT">Cardiopulmonary PT</option>
                  <option value="Pediatric Rehab">Pediatric Rehab</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "الأخصائي المعالج" : "Therapist"}</label>
                  <input type="text" value={sessionForm.therapist} onChange={e => setSessionForm({...sessionForm, therapist: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "وقت الجلسة" : "Session Time"}</label>
                  <input type="text" value={sessionForm.time} onChange={e => setSessionForm({...sessionForm, time: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowNewSessionModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">{isAr ? "حجز الجلسة" : "Schedule Session"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Functional Assessment */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-indigo-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {isAr ? `تقييم القدرات الوظيفية (${selectedPatientName})` : `Functional Capacity Eval (${selectedPatientName})`}
              </h3>
              <button onClick={() => setShowAssessmentModal(false)} className="hover:bg-indigo-700 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? "تم حفظ التقييم الوظيفي بنجاح" : "Functional assessment saved successfully");
              setShowAssessmentModal(false);
            }} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "مدى الحركة (ROM)" : "Range of Motion (ROM)"}</label>
                  <input type="text" value={evalForm.rom} onChange={e => setEvalForm({...evalForm, rom: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600">{isAr ? "قوة العضلات (MMT)" : "Muscle Strength (MMT)"}</label>
                  <input type="text" value={evalForm.strength} onChange={e => setEvalForm({...evalForm, strength: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "نمط ووظيفة المشي" : "Gait & Mobility Assessment"}</label>
                <input type="text" value={evalForm.gait} onChange={e => setEvalForm({...evalForm, gait: e.target.value})} className="w-full border rounded-xl p-2 text-sm mt-1" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "توصيات الأخصائي" : "Therapist Recommendations"}</label>
                <textarea value={evalForm.notes} onChange={e => setEvalForm({...evalForm, notes: e.target.value})} rows={3} placeholder={isAr ? "تفاصيل التوصيات..." : "Enter notes..."} className="w-full border rounded-xl p-2 text-sm mt-1" />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowAssessmentModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition text-sm">{isAr ? "حفظ التقييم" : "Save Assessment"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEDICATED MODAL: Assistive Devices Request */}
      {showDeviceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
            <div className="bg-amber-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                {isAr ? "طلب جهاز أو وسيلة مساعدة للمريض" : "Request Assistive Device"}
              </h3>
              <button onClick={() => setShowDeviceModal(false)} className="hover:bg-amber-700 p-1 rounded-lg">✕</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              toast.success(isAr ? `تم تقديم طلب صرف ${deviceForm.device} بنجاح` : `Assistive device request (${deviceForm.device}) submitted`);
              setShowDeviceModal(false);
            }} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "نوع الجهاز المطلوب" : "Assistive Device"}</label>
                <select value={deviceForm.device} onChange={e => setDeviceForm({...deviceForm, device: e.target.value})} className="w-full border rounded-xl p-2.5 text-sm font-bold mt-1">
                  <option value="Wheelchair (Standard)">Standard Wheelchair</option>
                  <option value="Electric Wheelchair">Electric Wheelchair</option>
                  <option value="Quad Cane / Walker">Quad Cane / Walker</option>
                  <option value="Knee-Ankle-Foot Orthosis (KAFO)">Orthosis (KAFO/AFO)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600">{isAr ? "ملاحظات الدواعي الطبية" : "Clinical Indication"}</label>
                <textarea value={deviceForm.notes} onChange={e => setDeviceForm({...deviceForm, notes: e.target.value})} rows={3} placeholder={isAr ? "سبب الصرف..." : "Indication notes..."} className="w-full border rounded-xl p-2 text-sm mt-1" required />
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button type="button" onClick={() => setShowDeviceModal(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition text-sm">{isAr ? "إلغاء" : "Cancel"}</button>
                <button type="submit" className="px-5 py-2 bg-amber-600 text-white font-bold rounded-xl hover:bg-amber-700 transition text-sm">{isAr ? "إرسال الطلب" : "Submit Request"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
