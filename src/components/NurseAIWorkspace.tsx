import React, { useState } from 'react';
import { 
  CheckCircle2, AlertTriangle, Clock, Activity, ArrowRight,
  Pill, FileText, UserPlus, HeartPulse, ShieldAlert
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

export const NurseAIWorkspace: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-6 rounded-2xl shadow-xl border border-emerald-800 text-emerald-100 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-emerald-400">NURSE AI HUB</h1>
          <p className="text-sm font-mono mt-1 opacity-80">
            {isAr ? "مرحباً سارة. إليكِ ملخص الوردية بناءً على الذكاء الاصطناعي." : "Welcome Sarah. Here is your AI-optimized shift summary."}
          </p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4 border-r border-emerald-800 last:border-0">
            <p className="text-[10px] font-bold uppercase mb-1 opacity-60">Total Tasks</p>
            <p className="text-3xl font-black">18</p>
          </div>
          <div className="text-center px-4 border-r border-emerald-800 last:border-0">
            <p className="text-[10px] font-bold uppercase mb-1 opacity-60 text-rose-400">Critical</p>
            <p className="text-3xl font-black text-rose-400 animate-pulse">4</p>
          </div>
        </div>
      </div>

      {/* Critical Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl shadow-sm flex items-start gap-3">
          <Clock className="w-5 h-5 text-rose-500 mt-0.5" />
          <div>
            <h4 className="font-bold text-rose-800">{isAr ? "دواء متأخر (2)" : "2 Late Medications"}</h4>
            <p className="text-xs text-rose-600 mt-1">Bed 4 (Antibiotic), Bed 7 (Pain Med)</p>
          </div>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl shadow-sm flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-500 mt-0.5" />
          <div>
            <h4 className="font-bold text-amber-800">{isAr ? "معرض للسقوط (1)" : "1 High Fall Risk"}</h4>
            <p className="text-xs text-amber-600 mt-1">Bed 12 requires assistance to bathroom</p>
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl shadow-sm flex items-start gap-3">
          <Activity className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <h4 className="font-bold text-blue-800">{isAr ? "إعادة تقييم (1)" : "1 Reassessment"}</h4>
            <p className="text-xs text-blue-600 mt-1">Bed 3 (Post-op vitals due in 5m)</p>
          </div>
        </div>
      </div>

      {/* Smart Task List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          {isAr ? "المهام المرتبة آلياً (حسب الأولوية)" : "AI-Prioritized Task List"}
        </h3>
        
        <div className="space-y-3">
          {[
            { id: 1, bed: "Bed 4", task: "Administer IV Vancomycin (Late)", type: "Meds", priority: "critical", icon: Pill },
            { id: 2, bed: "Bed 3", task: "Post-op Vitals Reassessment", type: "Vitals", priority: "critical", icon: HeartPulse },
            { id: 3, bed: "Bed 7", task: "Administer PRN Analgesic", type: "Meds", priority: "high", icon: Pill },
            { id: 4, bed: "Bed 12", task: "Assist to bathroom (Fall Risk)", type: "Care", priority: "high", icon: UserPlus },
            { id: 5, bed: "Bed 5", task: "Complete admission assessment", type: "Doc", priority: "medium", icon: FileText },
          ].map(task => (
            <div key={task.id} className="flex items-center gap-2 sm:gap-4 flex-wrap  p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors">
              <input type="checkbox" className="w-5 h-5 text-emerald-500 rounded border-slate-300" />
              <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className={`p-2 rounded-lg ${
                    task.priority === 'critical' ? 'bg-rose-100 text-rose-600' :
                    task.priority === 'high' ? 'bg-amber-100 text-amber-600' :
                    'bg-slate-200 text-slate-600'
                  }`}>
                    <task.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-400">{task.bed}</span>
                    <p className="font-bold text-slate-800 text-sm">{task.task}</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-emerald-100">
                  {isAr ? "بدء المهمة" : "Start Task"} <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NurseAIWorkspace;
