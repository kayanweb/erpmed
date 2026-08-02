import React, { useState } from 'react';
import { 
  BedDouble, Bed, UserPlus, AlertTriangle, CheckCircle2,
  Filter, Search, Map
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export const SmartBedAllocation: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-r from-teal-900 to-emerald-900 rounded-2xl p-6 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="p-3 bg-teal-500/20 rounded-xl">
            <BedDouble className="w-5 h-5 sm:w-8 sm:h-8 text-teal-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black">{isAr ? "نظام تخصيص الأسرة الذكي" : "Smart Bed Allocation Engine"}</h1>
            <p className="text-teal-100 text-sm mt-1">
              {isAr ? "إدارة ذكية للطاقة الاستيعابية وتخصيص الأسرة بناءً على حالة المريض" : "Intelligent capacity management and clinical condition-based bed allocation"}
            </p>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-teal-600 hover:bg-teal-500 rounded-lg text-sm font-bold transition-colors shadow-lg flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            {isAr ? "طلب سرير جديد" : "Request Bed"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium mb-1">{isAr ? "إجمالي الأسرة" : "Total Beds"}</p>
          <p className="text-3xl font-black text-slate-800">450</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium mb-1">{isAr ? "المشغولة" : "Occupied"}</p>
          <p className="text-3xl font-black text-indigo-600">385 <span className="text-sm text-slate-400 font-normal">(85%)</span></p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium mb-1">{isAr ? "قيد التنظيف" : "Dirty / Cleaning"}</p>
          <p className="text-3xl font-black text-amber-500">12</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
          <p className="text-sm text-slate-500 font-medium mb-1">{isAr ? "المتاحة فوراً" : "Available Now"}</p>
          <p className="text-3xl font-black text-emerald-500">53</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
              <Map className="w-5 h-5 text-teal-600" />
              {isAr ? "خريطة الأقسام" : "Ward Map"}
            </h3>
            <select className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1 text-sm">
              <option>{isAr ? "جميع الأقسام" : "All Wards"}</option>
              <option>ICU</option>
              <option>Internal Medicine</option>
              <option>Surgery</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-4 border rounded-xl bg-slate-50 border-slate-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-slate-700">Ward {i}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">3 Available</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full w-[80%]"></div>
                </div>
                <p className="text-xs text-slate-500 mt-2">24/27 Occupied</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-lg text-slate-800 mb-4">{isAr ? "طلبات قيد الانتظار" : "Pending Requests"}</h3>
          <div className="space-y-3">
            {[
              { pt: "Sara Ali", type: "ICU Step-down", wait: "45m", priority: "High" },
              { pt: "Omar M.", type: "ER to Ward", wait: "1h 20m", priority: "Medium" }
            ].map((req, i) => (
              <div key={i} className="p-3 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${req.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {req.priority}
                  </span>
                  <span className="text-xs font-medium text-slate-500">{req.wait}</span>
                </div>
                <p className="font-bold text-slate-800 text-sm">{req.pt}</p>
                <p className="text-xs text-slate-500">{req.type}</p>
                <button className="w-full mt-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
                  {isAr ? "تخصيص سرير" : "Assign Bed"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartBedAllocation;
