import React, { useState } from "react";
import {
  Dna,
  Activity,
  Syringe,
  Crosshair,
  FileText,
  CheckCircle2,
  ShieldAlert,
  ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import DepartmentTasks from "./DepartmentTasks";

interface Props {
  language: "ar" | "en";
}

export default function OncologyDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"chemo" | "radio" | "tasks">(
    "chemo",
  );

  const [patients] = useState([
    {
      id: "ONC-01",
      patient: "Ahmed Youssef",
      plan: "Chemo Cycle 3/6",
      drug: "Paclitaxel",
      time: "10:00 AM",
      status: "In Progress",
    },
    {
      id: "ONC-02",
      patient: "Sarah Ali",
      plan: "Chemo Cycle 1/4",
      drug: "Doxorubicin",
      time: "12:30 PM",
      status: "Scheduled",
    },
  ]);

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full font-sans animate-fade-in"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Dna className="w-7 h-7 text-purple-600" />
            {isAr
              ? "الأورام والعلاج الكيماوي والإشعاعي"
              : "Oncology & Radiotherapy"}
          </h2>
          <p className="text-slate-500 font-medium mt-1">
            {isAr
              ? "إدارة بروتوكولات الأورام وجرعات العلاج"
              : "Manage oncology protocols and therapy sessions"}
          </p>
        </div>
        <div className="flex bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <button
            onClick={() => setActiveTab("chemo")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "chemo" ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "العلاج الكيماوي" : "Chemotherapy"}
          </button>
          <button
            onClick={() => setActiveTab("radio")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "radio" ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600" : "text-slate-500 hover:bg-slate-50"}`}
          >
            {isAr ? "العلاج الإشعاعي" : "Radiotherapy"}
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-6 py-2.5 text-sm font-bold transition-colors ${activeTab === "tasks" ? "bg-purple-50 text-purple-700 border-b-2 border-purple-600" : "text-slate-500 hover:bg-slate-50"} flex items-center gap-1.5`}
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
            departmentId="oncology"
            departmentName={isAr ? "قسم الأورام" : "Oncology Unit"}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-purple-500" />
                  {activeTab === "chemo"
                    ? isAr
                      ? "جلسات الكيماوي الحالية"
                      : "Active Chemo Sessions"
                    : isAr
                      ? "جلسات الإشعاعي"
                      : "Active Radio Sessions"}
                </h3>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm">
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
                        {isAr ? "المريض" : "Patient"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الخطة" : "Treatment Plan"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {activeTab === "chemo"
                          ? isAr
                            ? "الدواء"
                            : "Drug"
                          : isAr
                            ? "المنطقة"
                            : "Target Area"}
                      </th>
                      <th className="px-4 py-3 font-bold">
                        {isAr ? "الوقت" : "Time"}
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
                    {patients.map((session, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-bold text-slate-800">
                          {session.patient}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {session.plan}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {session.drug}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {session.time}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-[10px] font-bold ${session.status === "In Progress" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-700"}`}
                          >
                            {session.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 flex gap-2 justify-center flex-wrap">
                          {activeTab === "chemo" && (
                            <button
                              onClick={() =>
                                toast.info(isAr ? "تم فتح حساب الجرعة" : "Dose calculation opened")
                              }
                              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <Syringe className="w-3 h-3" />{" "}
                              {isAr ? "الجرعة" : "Dose"}
                            </button>
                          )}
                          {activeTab === "radio" && (
                            <button
                              onClick={() =>
                                toast.info(isAr ? "تم فتح تحديد المنطقة" : "Targeting opened")
                              }
                              className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                            >
                              <Crosshair className="w-3 h-3" />{" "}
                              {isAr ? "المنطقة" : "Target"}
                            </button>
                          )}
                          <button
                            onClick={() =>
                              toast.info(isAr ? "تم تسجيل الآثار الجانبية" : "Side effects logged")
                            }
                            className="bg-rose-50 text-rose-600 hover:bg-rose-100 px-2 py-1.5 rounded text-[10px] font-bold transition flex items-center gap-1"
                          >
                            <ShieldAlert className="w-3 h-3" />{" "}
                            {isAr ? "آثار جانبية" : "Toxicity"}
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
                {activeTab === "chemo"
                  ? isAr
                    ? "إدارة الكيماوي"
                    : "Chemo Management"
                  : isAr
                    ? "إدارة الإشعاعي"
                    : "Radio Management"}
              </h3>
              <div className="space-y-3">
                {activeTab === "chemo" && (
                  <>
                    <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                      <FileText className="w-5 h-5 text-purple-500" />
                      <span className="text-sm font-bold text-left flex-1">
                        {isAr ? "خطة علاجية (Protocol)" : "Treatment Protocol"}
                      </span>
                    </button>
                    <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                      <Syringe className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold text-left flex-1">
                        {isAr ? "حساب الجرعة (BSA)" : "Dose Calc (BSA)"}
                      </span>
                    </button>
                  </>
                )}
                {activeTab === "radio" && (
                  <>
                    <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                      <Crosshair className="w-5 h-5 text-indigo-500" />
                      <span className="text-sm font-bold text-left flex-1">
                        {isAr ? "تحديد منطقة الإشعاع" : "Target Area Mapping"}
                      </span>
                    </button>
                    <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                      <Activity className="w-5 h-5 text-emerald-500" />
                      <span className="text-sm font-bold text-left flex-1">
                        {isAr ? "تحديد الجرعة (Gy)" : "Radiation Dose (Gy)"}
                      </span>
                    </button>
                  </>
                )}
                <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-rose-200">
                  <ShieldAlert className="w-5 h-5 text-rose-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "مراقبة الآثار (Toxicity)" : "Toxicity Monitoring"}
                  </span>
                </button>
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3 transition border border-slate-200">
                  <FileText className="w-5 h-5 text-indigo-500" />
                  <span className="text-sm font-bold text-left flex-1">
                    {isAr ? "تقرير الجلسة" : "Session Report"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
