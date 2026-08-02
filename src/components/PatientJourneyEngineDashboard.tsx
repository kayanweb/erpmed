import React, { useState } from 'react';
import { 
  Activity, MapPin, Clock, ArrowRight, UserCheck, Stethoscope, 
  BedDouble, FileCheck, CheckCircle2, AlertCircle
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export const PatientJourneyEngineDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 rounded-2xl p-6 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="p-3 bg-purple-500/20 rounded-xl">
            <Activity className="w-5 h-5 sm:w-8 sm:h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black">{isAr ? "محرك تتبع مسار المريض" : "Patient Journey Engine"}</h1>
            <p className="text-purple-100 text-sm mt-1">
              {isAr ? "تتبع تدفق المرضى، تقليل وقت الانتظار، وتحسين تجربة المريض من الدخول حتى الخروج" : "Track patient flow, reduce wait times, and optimize experience from admission to discharge"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="font-bold text-slate-800 mb-6 text-lg">{isAr ? "الرؤية الحية للمسار (Live Journey Map)" : "Live Journey Map"}</h3>
            
            <div className="relative">
              {/* Journey Path Line */}
              <div className={`absolute top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 ${isAr ? 'right-0' : 'left-0'}`}></div>
              
              <div className="relative z-10 flex justify-between">
                {[
                  { icon: UserCheck, label: isAr ? "التسجيل" : "Registration", status: "completed", time: "10 mins" },
                  { icon: Stethoscope, label: isAr ? "الفرز (Triage)" : "Triage", status: "completed", time: "15 mins" },
                  { icon: Activity, label: isAr ? "الطبيب" : "Doctor", status: "active", time: "Waiting: 20m" },
                  { icon: BedDouble, label: isAr ? "التنويم" : "Admission", status: "pending", time: "--" },
                  { icon: FileCheck, label: isAr ? "الخروج" : "Discharge", status: "pending", time: "--" },
                ].map((step, i) => (
                  <div key={i} className="flex flex-col items-center bg-white">
                    <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center mb-2 ${
                      step.status === 'completed' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' :
                      step.status === 'active' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 animate-pulse' :
                      'border-slate-200 bg-slate-50 text-slate-400'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-sm text-slate-800">{step.label}</span>
                    <span className={`text-xs mt-1 font-medium ${step.status === 'active' ? 'text-rose-500' : 'text-slate-500'}`}>
                      {step.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-4">{isAr ? "الاختناقات الحالية (Bottlenecks)" : "Current Bottlenecks"}</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-rose-50 rounded-lg">
                  <span className="font-medium text-rose-800">{isAr ? "انتظار الصيدلية" : "Pharmacy Wait"}</span>
                  <span className="text-rose-600 font-bold">45 mins</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                  <span className="font-medium text-amber-800">{isAr ? "انتظار الأشعة" : "Radiology Wait"}</span>
                  <span className="text-amber-600 font-bold">32 mins</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
              <h4 className="font-bold text-slate-700 mb-4">{isAr ? "مؤشرات الأداء" : "KPIs"}</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{isAr ? "متوسط طول البقاء (ALOS)" : "Average Length of Stay"}</span>
                    <span className="font-bold">3.2 Days</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-teal-500 h-2 rounded-full w-[60%]"></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{isAr ? "وقت الانتظار في الطوارئ" : "ER Wait Time"}</span>
                    <span className="font-bold">18 Mins</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full w-[40%]"></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-slate-900 rounded-2xl shadow-xl p-5 text-white">
          <h3 className="font-bold text-slate-100 mb-4">{isAr ? "حالات تتطلب التدخل" : "Intervention Required"}</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-3 bg-slate-800 border border-slate-700 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded-full">SLA Breach</span>
                  <span className="text-slate-400 text-xs">ER-04</span>
                </div>
                <p className="font-bold text-sm mb-1">Ahmed Hassan</p>
                <p className="text-xs text-slate-400">{isAr ? "تجاوز وقت انتظار السرير (> 4 ساعات)" : "Bed allocation wait > 4 hours"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientJourneyEngineDashboard;
