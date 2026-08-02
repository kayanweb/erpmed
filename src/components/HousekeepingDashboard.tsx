import React, { useState } from 'react';
import { useHIS } from '../context/HISContext';
import { Sparkles, BedDouble, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function HousekeepingDashboard() {
  const { language } = useHIS();
  const isAr = language === 'ar';

  const [cleaningTasks, setCleaningTasks] = useState([
    { id: "HK-201", bedId: "ICU-03", ward: "ICU", requestedAt: "10 mins ago", status: "pending", priority: "high", reason: "Discharge" },
    { id: "HK-202", bedId: "IM-102", ward: "Internal Medicine", requestedAt: "45 mins ago", status: "pending", priority: "normal", reason: "Transfer" },
    { id: "HK-203", bedId: "ER-05", ward: "Emergency", requestedAt: "2 hours ago", status: "in_progress", priority: "high", reason: "Blood Spill" }
  ]);

  const handleMarkCleaned = (taskId: string, bedId: string) => {
    setCleaningTasks(tasks => tasks.filter(t => t.id !== taskId));
    toast.success(isAr ? `تم تنظيف السرير ${bedId} وأصبح متاحاً للنظام.` : `Bed ${bedId} cleaned and marked as Available in the system.`);
  };

  const handleStartCleaning = (taskId: string) => {
    setCleaningTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, status: 'in_progress' } : t));
    toast.info(isAr ? "تم بدء عملية تنظيف السرير والتعقيم بنجاح" : "Cleaning process started");
  };

  return (
    <div className="p-6 space-y-6" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 sm:w-8 sm:h-8 text-amber-500" />
            {isAr ? "الخدمات الفندقية والنظافة (Housekeeping)" : "Housekeeping & Facilities"}
          </h2>
          <p className="text-slate-500 text-sm mt-1">{isAr ? "إدارة طلبات تنظيف الغرف والأسرة وتجهيزها للمرضى الجدد" : "Manage room/bed cleaning requests and prepare for new admissions"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cleaningTasks.map(task => (
          <div key={task.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className={`p-4 border-b flex justify-between items-center ${task.priority === 'high' ? 'bg-rose-50 border-rose-100' : 'bg-slate-50 border-slate-100'}`}>
              <div className="flex items-center gap-2">
                <BedDouble className={`w-5 h-5 ${task.priority === 'high' ? 'text-rose-600' : 'text-slate-600'}`} />
                <h3 className="font-bold text-slate-800">{task.bedId}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold ${task.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'}`}>
                {task.priority === 'high' ? (isAr ? 'عاجل' : 'Urgent') : (isAr ? 'عادي' : 'Normal')}
              </span>
            </div>
            
            <div className="p-4 flex-1 space-y-3">
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold">{task.ward}</span>
              </p>
              <p className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isAr ? "منذ:" : "Requested:"} {task.requestedAt}</span>
              </p>
              <p className="text-sm">
                <span className="text-slate-500 text-xs font-bold uppercase">{isAr ? "السبب:" : "Reason:"}</span>
                <br/>
                <span className="font-semibold text-slate-800">{task.reason}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-2">
              {task.status === 'pending' ? (
                <button 
                  onClick={() => handleStartCleaning(task.id)}
                  className="flex-1 bg-white border border-indigo-200 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-indigo-50 transition"
                >
                  {isAr ? "بدء التنظيف" : "Start Cleaning"}
                </button>
              ) : (
                <button 
                  onClick={() => handleMarkCleaned(task.id, task.bedId)}
                  className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isAr ? "تم التنظيف (متاح الآن)" : "Cleaned (Make Available)"}
                </button>
              )}
            </div>
          </div>
        ))}

        {cleaningTasks.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <Sparkles className="w-16 h-16 mb-4 opacity-20 text-emerald-500" />
            <p className="text-lg font-bold text-slate-500">{isAr ? "لا توجد طلبات تنظيف حالياً" : "No pending cleaning tasks"}</p>
            <p className="text-sm mt-1">{isAr ? "جميع الأسرة المخصصة نظيفة وجاهزة." : "All assigned beds are clean and ready."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
