import React, { useState } from 'react';
import { 
  Activity, Pill, Users, Syringe, Thermometer, Droplets,
  ClipboardList, CheckCircle2, AlertCircle, Clock, HeartPulse,
  MoreHorizontal, Bed, Filter
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

const beds = [
  { id: "W-201", patient: "Ali Hassan", status: "occupied", alert: false, nextMed: "14:00" },
  { id: "W-202", patient: "Empty", status: "available", alert: false, nextMed: null },
  { id: "W-203", patient: "Mona Ali", status: "occupied", alert: true, nextMed: "12:30" },
  { id: "W-204", patient: "Sarah Smith", status: "occupied", alert: false, nextMed: "15:00" },
];

const medPasses = [
  { time: "12:00 PM", patient: "Mona Ali", med: "Paracetamol 500mg IV", status: "pending" },
  { time: "12:30 PM", patient: "Ali Hassan", med: "Ceftriaxone 1g IV", status: "pending" },
];

export const NurseWorkspace: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
            <HeartPulse className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-800">{isAr ? "محطة عمل التمريض" : "Nursing Station"}</h1>
            <p className="text-sm text-slate-500">{isAr ? "جناح الباطنة - وردية الصباح" : "Medical Ward - Morning Shift"}</p>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            {isAr ? "تصفية" : "Filter"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Left Col: Ward Overview */}
        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="p-3 bg-blue-50 rounded-xl"><Users className="w-6 h-6 text-blue-600"/></div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-slate-800">12/15</p>
                <p className="text-xs text-slate-500 font-medium">{isAr ? "الأسرة المشغولة" : "Occupied Beds"}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="p-3 bg-rose-50 rounded-xl"><AlertCircle className="w-6 h-6 text-rose-600"/></div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-slate-800">2</p>
                <p className="text-xs text-slate-500 font-medium">{isAr ? "تنبيهات حرجة" : "Critical Alerts"}</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className="p-3 bg-emerald-50 rounded-xl"><CheckCircle2 className="w-6 h-6 text-emerald-600"/></div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-slate-800">85%</p>
                <p className="text-xs text-slate-500 font-medium">{isAr ? "إنجاز المهام" : "Task Completion"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Bed className="w-5 h-5 text-teal-600" />
              {isAr ? "خريطة الأسرة" : "Bed Map"}
            </h3>
            <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {beds.map(bed => (
                <div key={bed.id} className={`p-4 rounded-xl border-2 transition-all ${
                  bed.status === 'available' ? 'border-dashed border-slate-200 bg-slate-50' :
                  bed.alert ? 'border-rose-200 bg-rose-50' : 'border-slate-100 bg-white hover:border-teal-200'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono text-sm font-bold text-slate-600">{bed.id}</span>
                    {bed.alert && <span className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></span>}
                  </div>
                  <h4 className={`font-bold ${bed.status === 'available' ? 'text-slate-400' : 'text-slate-800'}`}>
                    {bed.patient}
                  </h4>
                  {bed.status === 'occupied' && (
                    <div className="mt-3 flex gap-2">
                      <button className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-1.5 rounded-lg text-xs font-medium transition-colors">
                        {isAr ? "العلامات" : "Vitals"}
                      </button>
                      <button className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 py-1.5 rounded-lg text-xs font-medium transition-colors">
                        {isAr ? "الأدوية" : "Meds"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Meds & Tasks */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-600" />
              {isAr ? "جدول الأدوية (Med Pass)" : "Med Pass"}
            </h3>
            <div className="space-y-3">
              {medPasses.map((pass, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {pass.time}
                    </span>
                  </div>
                  <p className="font-bold text-slate-800 text-sm mb-1">{pass.patient}</p>
                  <p className="text-xs text-slate-500">{pass.med}</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors">
              {isAr ? "بدء إعطاء الأدوية" : "Start Med Pass"}
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl shadow-xl border border-slate-800 p-5 text-white">
            <h3 className="font-bold text-slate-100 mb-4">{isAr ? "تسجيل سريع" : "Quick Entry"}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Thermometer className="w-5 h-5 text-rose-400 mb-2" />
                <span className="text-xs text-center">{isAr ? "العلامات الحيوية" : "Vitals"}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Droplets className="w-5 h-5 text-blue-400 mb-2" />
                <span className="text-xs text-center">{isAr ? "السوائل (I/O)" : "Fluid I/O"}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <Syringe className="w-5 h-5 text-purple-400 mb-2" />
                <span className="text-xs text-center">{isAr ? "سحب دم" : "Blood Draw"}</span>
              </button>
              <button className="flex flex-col items-center justify-center p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors">
                <ClipboardList className="w-5 h-5 text-amber-400 mb-2" />
                <span className="text-xs text-center">{isAr ? "ملاحظات تمريضية" : "Notes"}</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default NurseWorkspace;
