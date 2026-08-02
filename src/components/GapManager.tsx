import React, { useState } from "react";
import { AlertTriangle, Clock, ArrowRight, ShieldAlert } from "lucide-react";

export default function GapManager({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";

  const gaps = [
    {
      id: "G-001",
      patient: "Sara Mahmoud",
      location: "ER Room 2",
      issueAr: "تأخر نقل المريض للأشعة",
      issueEn: "Delayed Transport to Radiology",
      duration: "45 min",
      status: "critical"
    },
    {
      id: "G-002",
      patient: "Ahmed Ali",
      location: "Ward A",
      issueAr: "تأخر صرف المضاد الحيوي",
      issueEn: "Antibiotic Dispensing Delay",
      duration: "25 min",
      status: "warning"
    },
    {
      id: "G-003",
      patient: "Mona Hassan",
      location: "OPD",
      issueAr: "تأخر دخول الطبيب",
      issueEn: "Doctor Entry Delay",
      duration: "60 min",
      status: "critical"
    }
  ];

  return (
    <div className="space-y-6 animate-fade font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-slate-700 shadow-xl text-white">
        <h2 className="text-2xl font-bold mb-2">
          {isAr ? "نظام إدارة الفجوات (Gap Manager)" : "Gap Manager"}
        </h2>
        <p className="text-slate-400">
          {isAr 
            ? "يكتشف الفجوات الزمنية بين إجراء وآخر ويصدر تنبيهات استباقية." 
            : "Detects time gaps between procedures and issues proactive alerts."}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-600" />
          {isAr ? "الفجوات التشغيلية المكتشفة" : "Detected Operational Gaps"}
        </h3>
        
        <div className="space-y-4">
          {gaps.map((g) => (
            <div key={g.id} className={`p-4 rounded-xl border ${g.status === 'critical' ? 'bg-rose-50 border-rose-200' : 'bg-orange-50 border-orange-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className={`p-2 rounded-lg ${g.status === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-orange-100 text-orange-700'}`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className={`font-bold ${g.status === 'critical' ? 'text-rose-900' : 'text-orange-900'}`}>
                      {isAr ? g.issueAr : g.issueEn}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      <span className="font-medium">{g.patient}</span> • {g.location}
                    </p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <span className={`inline-flex items-center gap-1 font-bold ${g.status === 'critical' ? 'text-rose-600' : 'text-orange-600'}`}>
                    <Clock className="h-4 w-4" />
                    {g.duration}
                  </span>
                  <button className="mt-2 text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
                    {isAr ? "اتخاذ إجراء" : "Take Action"}
                    <ArrowRight className="h-3 w-3 rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
