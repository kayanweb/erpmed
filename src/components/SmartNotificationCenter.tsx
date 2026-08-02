import React, { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle, Info, CheckCircle, BellOff } from "lucide-react";
import { SystemNotification, syncNotifications, markAsRead, deleteNotification } from "../lib/notificationService";
import { Trash2 } from "lucide-react";

interface Props {
  language: "ar" | "en";
  currentUser: { id: string; role: string };
  onNavigate?: (tab: string, subTab?: string) => void;
}

export default function SmartNotificationCenter({ language, currentUser, onNavigate }: Props) {
  const isAr = language === "ar";
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = syncNotifications(currentUser.id, currentUser.role, undefined, setNotifications);
    return () => unsubscribe();
  }, [currentUser]);

  const getIcon = (type: string) => {
    switch (type) {
      case "critical":
      case "error": return <AlertCircle className="w-4 h-4 text-rose-400" />;
      case "warning": return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case "success": return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      default: return <Info className="w-4 h-4 text-sky-400" />;
    }
  };

  const getColorClasses = (type: string, read: boolean) => {
    if (read) return "bg-slate-800/30 border-slate-700 opacity-60";
    
    switch (type) {
      case "critical":
      case "error": return "bg-rose-950/50 border-rose-800 hover:bg-rose-900/50";
      case "warning": return "bg-amber-950/50 border-amber-800/50 hover:bg-amber-900/50";
      case "success": return "bg-emerald-950/50 border-emerald-800/50 hover:bg-emerald-900/50";
      default: return "bg-sky-950/50 border-sky-800/50 hover:bg-sky-900/50";
    }
  };

  const getAccentColor = (type: string) => {
    switch (type) {
      case "critical":
      case "error": return "bg-rose-500";
      case "warning": return "bg-amber-500";
      case "success": return "bg-emerald-500";
      default: return "bg-sky-500";
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl flex-1 flex flex-col h-full min-h-0 border border-slate-700 overflow-hidden">
      <h3 className="font-black text-sm mb-4 flex items-center justify-between border-b border-slate-700 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
          </div>
          {isAr ? "مركز التنبيهات الذكي (Live Alerts)" : "Intelligent Notification Center"}
        </div>
        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-400 font-mono">
          {notifications.filter(n => !n.read).length} UNREAD
        </span>
      </h3>
      
      <div className="space-y-3 overflow-y-auto flex-1 pr-1 custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 py-10">
            <BellOff className="w-5 h-5 sm:w-8 sm:h-8 mb-2 opacity-20" />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              {isAr ? "لا توجد تنبيهات حالية" : "No active alerts"}
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n.id}
              onClick={() => {
                if (!n.read) markAsRead(n.id);
                if (onNavigate) {
                  if (n.link) {
                    onNavigate(n.link);
                  } else {
                    // Smart keyword fallback routing
                    const txt = ((n.titleEn || "") + " " + (n.messageEn || "") + " " + (n.titleAr || "") + " " + (n.messageAr || ""))?.toLowerCase();
                    if (
                      txt?.includes("admission") || 
                      txt?.includes("admit") || 
                      txt?.includes("ward") || 
                      txt?.includes("transfer") || 
                      txt?.includes("تنويم") || 
                      txt?.includes("نقل") || 
                      txt?.includes("سرير")
                    ) {
                      onNavigate("admin_support", "bed_management");
                    } else if (
                      txt?.includes("surgery") || 
                      txt?.includes("operation") || 
                      txt?.includes("عملية") || 
                      txt?.includes("جراحة")
                    ) {
                      onNavigate("inpatient_critical", "ot");
                    } else if (
                      txt?.includes("lab") || 
                      txt?.includes("result") || 
                      txt?.includes("cbc") || 
                      txt?.includes("troponin") || 
                      txt?.includes("تحليل") || 
                      txt?.includes("نتائج") || 
                      txt?.includes("معمل")
                    ) {
                      onNavigate("outpatient", "emr_core");
                    } else if (
                      txt?.includes("emergency") || 
                      txt?.includes("er") || 
                      txt?.includes("طوارئ")
                    ) {
                      onNavigate("clinical_front", "er");
                    } else if (
                      txt?.includes("bill") || 
                      txt?.includes("invoice") || 
                      txt?.includes("rcm") || 
                      txt?.includes("فاتورة") || 
                      txt?.includes("دفع") || 
                      txt?.includes("مالي")
                    ) {
                      onNavigate("admin_support", "billing");
                    } else if (
                      txt?.includes("pharmacy") || 
                      txt?.includes("medication") || 
                      txt?.includes("دواء") || 
                      txt?.includes("صيدلية")
                    ) {
                      onNavigate("clinical_services", "pharmacy");
                    } else {
                      onNavigate("outpatient", "emr_core");
                    }
                  }
                }
              }}
              className={`border rounded-xl p-3 relative overflow-hidden transition-all cursor-pointer group ${getColorClasses(n.type, n.read)}`}
            >
              <div className={`absolute top-0 left-0 w-1 h-full ${getAccentColor(n.type)}`}></div>
              <div className="flex gap-3">
                <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 h-min ${n.read ? "bg-slate-800" : "bg-opacity-20"}`}>
                  {getIcon(n.type)}
                </div>
                <div className="flex-1">
                  <h4 className={`text-xs font-bold flex items-center justify-between gap-2 ${n.read ? "text-slate-400" : ""}`}>
                    <div className="flex items-center gap-2">
                    {isAr ? n.titleAr : n.titleEn}
                    {!n.read && n.type === "critical" && (
                      <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded font-mono animate-pulse shrink-0">CRITICAL</span>
                    )}</div>
                    <button onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }} className="text-slate-500 hover:text-rose-400 transition"><Trash2 className="w-3.5 h-3.5" /></button>
                  </h4>
                  <p className={`text-[10px] mt-1 font-semibold leading-relaxed ${n.read ? "text-slate-500" : "text-slate-300"}`}>
                    {isAr ? n.messageAr : n.messageEn}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="text-[8px] font-mono text-slate-500 uppercase">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {n.metadata?.patientMRN && (
                      <div className="text-[8px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        MRN: {n.metadata.patientMRN}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
