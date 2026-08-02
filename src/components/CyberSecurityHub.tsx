import React from "react";
import { Shield, Lock, AlertTriangle, Key, Users, Activity, Eye, Server, Database, Globe, Plus } from "lucide-react";

export default function CyberSecurityHub({ language, onClose }: { language: "ar" | "en", onClose?: () => void }) {
  const isAr = language === "ar";
  return (
    <div className="p-6 bg-slate-950 min-h-full font-sans text-slate-200" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-6">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-500 hover:border-rose-500/50 transition-all shadow-sm group shrink-0"
          >
             <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
          </button>
          <div className="bg-red-500/20 p-4 rounded-2xl border border-red-500/50 shrink-0">
            <Shield className="w-5 h-5 sm:w-8 sm:h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white">
              {isAr ? "مركز الأمن السيبراني" : "Cyber Security Command"}
            </h1>
            <p className="text-slate-400 font-mono mt-1 uppercase tracking-widest text-[10px]">Zero Trust Architecture - Level 5 Defense</p>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_#10b981]"></div>
          <span className="font-bold text-emerald-400 font-mono text-sm uppercase tracking-tighter">Secure & Compliant (HIPAA/GDPR)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: AlertTriangle, label: isAr ? "التهديدات النشطة" : "Active Threats", value: "0", color: "text-emerald-500" },
          { icon: Lock, label: isAr ? "تشفير البيانات" : "Data Encryption", value: "AES-256", color: "text-blue-500" },
          { icon: Eye, label: isAr ? "محاولات وصول مرفوضة" : "Blocked Access Attempts", value: "1,245", color: "text-amber-500" },
          { icon: Key, label: isAr ? "جلسات نشطة (MFA)" : "Active MFA Sessions", value: "8,942", color: "text-indigo-500" }
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
            <h3 className="text-slate-400 text-sm font-bold">{stat.label}</h3>
            <p className={`text-3xl font-black mt-2 ${stat.color} font-mono`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Server className="text-blue-500" /> 
            {isAr ? "حالة الأمان للميكروسيرفيس" : "Microservices Security Posture"}
          </h2>
          <div className="space-y-4">
            {['EHR Database Cluster', 'HL7 Integration Gateway', 'AI Diagnostic Engine', 'Pharmacy Robotics API'].map((service, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <span className="font-mono text-sm">{service}</span>
                <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-lg text-xs font-bold">VERIFIED</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="text-indigo-500" /> 
            {isAr ? "سجل تدقيق بلوكتشين (Immutable)" : "Immutable Blockchain Audit Log"}
          </h2>
          <div className="space-y-4">
            {[
              { act: "User Dr. Smith accessed Patient #991", time: "10:45:12 UTC", hash: "0x8f...3a2" },
              { act: "Prescription Signed via MFA", time: "10:44:50 UTC", hash: "0x2c...9b1" },
              { act: "Database Sync (Region EU to MENA)", time: "10:40:00 UTC", hash: "0x11...abc" },
              { act: "Failed Login (IP: 192.168.x.x)", time: "10:35:11 UTC", hash: "0x4e...7df" },
            ].map((log, i) => (
              <div key={i} className="flex flex-col p-4 bg-slate-950 rounded-xl border border-slate-800 gap-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">{log.act}</span>
                  <span className="text-slate-500 text-xs">{log.time}</span>
                </div>
                <div className="text-[10px] text-slate-600 font-mono">HASH: {log.hash}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
