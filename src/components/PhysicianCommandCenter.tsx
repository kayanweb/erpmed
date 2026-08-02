import React, { useState } from "react";
import { Users, Activity, Bed, Calendar, PhoneCall, Stethoscope } from "lucide-react";

export default function PhysicianCommandCenter({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";

  const cards = [
    {
      titleAr: "العيادات اليوم", titleEn: "Today's Clinics",
      value: "14", color: "bg-purple-100 text-purple-700", icon: Calendar
    },
    {
      titleAr: "المرضى المنومين", titleEn: "Inpatients",
      value: "3", color: "bg-blue-100 text-blue-700", icon: Bed
    },
    {
      titleAr: "الطوارئ", titleEn: "ER Cases",
      value: "1", color: "bg-rose-100 text-rose-700", icon: Activity
    },
    {
      titleAr: "استشارات عن بعد", titleEn: "Teleconsultations",
      value: "2", color: "bg-emerald-100 text-emerald-700", icon: PhoneCall
    }
  ];

  return (
    <div className="space-y-6 animate-fade font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-2">
          {isAr ? "شاشة الطبيب التنفيذية (Physician Command Center)" : "Physician Command Center"}
        </h2>
        <p className="text-slate-400">
          {isAr 
            ? "تعرض جميع مرضى الطبيب (عيادات + تنويم + استشارات) في مكان واحد." 
            : "Displays all doctor's patients (Clinics + Inpatient + Consultations) in one place."}
        </p>
      </div>

      <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
            <div className={`p-3 rounded-xl mb-3 ${c.color}`}>
              <c.icon className="h-6 w-6" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-1">{c.value}</h3>
            <p className="text-sm font-medium text-slate-500">{isAr ? c.titleAr : c.titleEn}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-blue-600" />
          {isAr ? "قائمة المرضى النشطين" : "Active Patients List"}
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-slate-600">
            <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">{isAr ? "المريض" : "Patient"}</th>
                <th className="px-4 py-3">{isAr ? "الموقع" : "Location"}</th>
                <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                <th className="px-4 py-3">{isAr ? "الإجراء المطلوب" : "Action Required"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Sara Mahmoud (MRN-002)</td>
                <td className="px-4 py-3">Clinic Room 4</td>
                <td className="px-4 py-3">
                  <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium">Waiting</span>
                </td>
                <td className="px-4 py-3 text-blue-600 cursor-pointer font-medium">Review Labs</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Ahmed Ali (MRN-001)</td>
                <td className="px-4 py-3">Ward A - Bed 12</td>
                <td className="px-4 py-3">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Admitted</span>
                </td>
                <td className="px-4 py-3 text-blue-600 cursor-pointer font-medium">Daily Round</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-bold text-slate-900">Omar Hassan (MRN-005)</td>
                <td className="px-4 py-3">Emergency (Triage)</td>
                <td className="px-4 py-3">
                  <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-medium">Critical</span>
                </td>
                <td className="px-4 py-3 text-blue-600 cursor-pointer font-medium">Immediate Consult</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
