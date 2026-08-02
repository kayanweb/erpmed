import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  User,
  Stethoscope,
  Activity,
  MapPin,
  Share2,
  CornerDownRight,
  ServerCrash,
  GitPullRequest,
} from "lucide-react";
import { syncSetting, saveSetting } from "../lib/firestoreService";

interface Visit {
  id: string;
  patientId: string;
  mrn: string;
  patientName: string;
  visitType: "OPD" | "ER" | "IPD" | "ICU" | "Telemedicine";
  doctorId: string;
  department: string;
  status: "Active" | "Admitted" | "Discharged" | "Transferred";
  createdAt: string;
}

export default function VisitManager({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const [visits, setVisits] = useState<Visit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsub = syncSetting("his_visits", (data) => {
      if (data?.value && Array.isArray(data.value)) {
        setVisits(data.value);
      } else {
        const seeded: Visit[] = [
          {
            id: "VST-881",
            patientId: "PAT-01",
            mrn: "MRN-1002",
            patientName: "Said Kamal",
            visitType: "OPD",
            doctorId: "Dr. Hisham",
            department: "Internal Medicine",
            status: "Active",
            createdAt: new Date(Date.now() - 7200000).toISOString(),
          },
          {
            id: "VST-882",
            patientId: "PAT-02",
            mrn: "MRN-5521",
            patientName: "Ibrahim Salem",
            visitType: "ER",
            doctorId: "Dr. Khaled",
            department: "Emergency",
            status: "Active",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "VST-105",
            patientId: "PAT-03",
            mrn: "MRN-3341",
            patientName: "Amina Saleh",
            visitType: "IPD",
            doctorId: "Dr. Rami",
            department: "Cardiology",
            status: "Admitted",
            createdAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ];
        setVisits(seeded);
        saveSetting("his_visits", seeded);
      }
    });
    return () => unsub();
  }, []);

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "ER":
        return "bg-rose-100 text-rose-700 border-rose-200";
      case "IPD":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "ICU":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "OPD":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const filtered = visits.filter(
    (v) =>
      v.patientName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      v.id?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
      v.mrn?.toLowerCase()?.includes(searchTerm?.toLowerCase()),
  );

  return (
    <div
      className="p-4 md:p-6 bg-slate-50 min-h-full"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Share2 className="h-7 w-7 text-indigo-600" />
            {isAr ? "محرك الزيارات (Visit Engine)" : "Visit Engine Core"}
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1">
            {isAr
              ? "نقطة الارتكاز المركزية لجميع الخدمات. لا خدمة بدون زيارة نشطة."
              : "Absolute core of the HIS. No clinical or financial action exists without a Visit entity."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search
              className={`absolute ${isAr ? "right-3" : "left-3"} top-2.5 h-4 w-4 text-slate-400`}
            />
            <input
              type="text"
              placeholder={
                isAr ? "بحث بالزيارة، المريض..." : "Search Visit ID, Patient..."
              }
              className={`w-full ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 font-bold`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={() => window.dispatchEvent(new CustomEvent('openVisitRegistration'))}
            className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2 rounded-lg font-bold text-sm shadow flex items-center gap-2 transition whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />{" "}
            {isAr ? "إنشاء زيارة جديدة" : "New Visit"}
          </button>
        </div>
      </div>

      <div className="bg-indigo-900 rounded-2xl shadow-lg border border-indigo-700/50 p-6 mb-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="flex flex-col md:flex-row gap-8 items-center justify-between relative z-10">
          <div className="text-indigo-100 max-w-xl">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
              <ServerCrash className="h-5 w-5 text-indigo-400" />{" "}
              {isAr
                ? "هيكلية محرك الزيارات (HL7)"
                : "Visit Engine Architecture"}
            </h3>
            <p className="text-sm">
              {isAr
                ? "تُشكل الزيارة العقدة الأساسية في النظام. يتم ربط الطلبات التشخيصية، الأدوية السريرية، ومطالبات التأمين بمعرف الزيارة حصراً. إغلاق الزيارة ينهي استقبال الطلبات."
                : "The Visit entity acts as the primary node. Diagnostic orders, clinical medications, and insurance claims strictly bind to VisitID. Discharging halts new order entries."}
            </p>
          </div>
          <div className="flex gap-4 shrink-0 font-mono text-xs font-bold text-white items-center bg-indigo-950 p-3 rounded-xl border border-indigo-800">
            <div className="text-center px-4">
              <span className="block text-indigo-400 mb-1">PATIENT</span>
              PAT-(MRN)
            </div>
            <GitPullRequest className="w-5 h-5 text-indigo-500" />
            <div className="text-center px-4 bg-indigo-600 rounded py-2 shadow">
              <span className="block text-white/70 mb-1">VISIT</span>VST-ID
            </div>
            <GitPullRequest className="w-5 h-5 text-indigo-500" />
            <div className="text-center px-4 text-indigo-300">
              <div>ORDERS (ORD)</div>
              <div className="my-1 border-t border-indigo-700"></div>
              <div>INVOICES (INV)</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table
            className="w-full text-sm text-left"
            dir={isAr ? "rtl" : "ltr"}
          >
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-4">
                  {isAr ? "رقم الزيارة" : "Visit ID"}
                </th>
                <th className="px-4 py-4">
                  {isAr ? "توقيت الإنشاء" : "Created At"}
                </th>
                <th className="px-4 py-4">{isAr ? "المريض" : "Patient"}</th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "تصنيف الزيارة" : "Type"}
                </th>
                <th className="px-4 py-4">
                  {isAr ? "الطبيب المعالج / التوجيه" : "Attending / Dept"}
                </th>
                <th className="px-4 py-4 text-center">
                  {isAr ? "الحالة" : "Status"}
                </th>
                <th className="px-4 py-4 text-right">
                  {isAr ? "إدارة التدفق" : "Flow"}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((visit) => (
                <tr
                  key={visit.id}
                  className="hover:bg-slate-50 transition border-l-4 border-l-transparent hover:border-l-indigo-500"
                >
                  <td className="px-4 py-3 font-mono font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <CornerDownRight className="w-4 h-4 text-slate-400" />{" "}
                      {visit.id}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-slate-500 font-bold">
                    {new Date(visit.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-800">
                      {visit.patientName}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {visit.mrn}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold border ${getTypeStyle(visit.visitType)}`}
                    >
                      {visit.visitType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-slate-700 text-xs">
                      {visit.doctorId}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {visit.department}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        visit.status === "Active"
                          ? "bg-emerald-50 text-emerald-600"
                          : visit.status === "Admitted"
                            ? "bg-indigo-50 text-indigo-600"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {visit.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                       <button className="bg-slate-100 text-slate-700 hover:bg-indigo-600 hover:text-white px-3 py-1.5 rounded font-bold text-[11px] transition shadow-sm border border-slate-200">
                         {isAr ? "تفاصيل" : "Inspect"}
                       </button>
                       <button className="bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white px-3 py-1.5 rounded font-bold text-[11px] transition shadow-sm border border-rose-200 disabled:opacity-50" disabled={visit.status === "Discharged"}>
                         {isAr ? "إنهاء الزيارة" : "End Visit"}
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500 font-bold"
                  >
                    {isAr ? "لا توجد زيارات نشطة" : "No active visits"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
