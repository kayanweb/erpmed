import React, { useState } from "react";
import { X, Cpu, Server, Activity, Database, Zap, RefreshCw, Layers, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface Props {
  language: "ar" | "en";
  onClose?: () => void;
}

export default function PlatformEnginesDashboard({ language, onClose }: Props) {
  const isAr = language === "ar";

  const engines = [
    { id: 1, name: "HL7/FHIR Integration Engine", status: "Running", uptime: "99.99%", load: "42%", icon: Layers },
    { id: 2, name: "Clinical Rules Engine", status: "Running", uptime: "100%", load: "15%", icon: Cpu },
    { id: 3, name: "Background Job Scheduler", status: "Warning", uptime: "98.50%", load: "85%", icon: RefreshCw },
    { id: 4, name: "Real-time Notification Hub", status: "Running", uptime: "99.95%", load: "30%", icon: Zap },
  ];

  const handleAction = (engineName: string) => {
    toast.info(isAr ? `جاري إعادة تشغيل: ${engineName}` : `Restarting engine: ${engineName}`);
  };

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-full font-sans relative" dir={isAr ? "rtl" : "ltr"}>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 ltr:right-4 rtl:left-4 p-2 hover:bg-slate-200 rounded-xl transition text-slate-400 hover:text-slate-600 z-dropdown"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {isAr ? "محركات النظام الأساسية" : "Platform Engines"}
            </h2>
            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
              Core Background Processes & Integration Hubs
            </p>
          </div>
        </div>
        <button onClick={() => handleAction('All Engines')} className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition">
          {isAr ? "إعادة تشغيل النظام" : "Restart All Engines"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {engines.map(engine => (
          <div key={engine.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-6">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${engine.status === 'Running' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                  <engine.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">{engine.name}</h3>
                  <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${engine.status === 'Running' ? 'text-emerald-600' : 'text-amber-600'}`}>
                    <Activity className="w-3 h-3" /> {engine.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>{isAr ? "استهلاك المعالج" : "CPU Load"}</span>
                  <span>{engine.load}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full ${engine.status === 'Warning' ? 'bg-amber-500' : 'bg-indigo-500'}`} style={{ width: engine.load }}></div>
                </div>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <div className="text-xs font-bold text-slate-500">
                  {isAr ? "وقت التشغيل:" : "Uptime:"} <span className="text-slate-900">{engine.uptime}</span>
                </div>
                <button onClick={() => handleAction(engine.name)} className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition">
                  {isAr ? "إعادة تشغيل" : "Restart"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
