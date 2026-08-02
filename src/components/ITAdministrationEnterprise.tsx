import React, { useState, useEffect } from "react";
import { 
  Users, Shield, Server, Database, Activity, Monitor, Globe, ShieldAlert,
  HardDrive, Lock, History, RefreshCcw, Bell, Play, Square, Wifi, Printer, Barcode, ScanFace,
  Terminal, Cpu, Zap, Radio
} from "lucide-react";
import { toast } from "sonner";
import { DeviceInfo, DeviceDetails } from "../utils/DeviceInfo";
import { AuditLogger, AuditLog } from "../utils/AuditLogger";
import EnterprisePrintCenter from "./EnterprisePrintCenter";

interface Props { language: "ar" | "en"; }

export default function ITAdministrationEnterprise({ language }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState("users");
  const [deviceInfo, setDeviceInfo] = useState<DeviceDetails | null>(null);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    setDeviceInfo(DeviceInfo.getDetails());
    setAuditLogs(AuditLogger.getLocalLogs());
    
    // Auto-log access to IT panel
    AuditLogger.log({
      userId: "IT-ADMIN-01",
      userName: "Enterprise Admin",
      action: "ACCESS_ADMIN_PANEL",
      module: "IT_ADMIN",
      details: "IT Administration panel accessed for system audit",
      severity: "info"
    });
  }, []);

  const TABS = [
    { id: "users", icon: Users, labelAr: "إدارة المستخدمين والأدوار", labelEn: "Users & Roles" },
    { id: "security", icon: Shield, labelAr: "الأمان والصلاحيات (MFA)", labelEn: "Security & MFA" },
    { id: "devices", icon: Monitor, labelAr: "إدارة الأجهزة والجلسات", labelEn: "Devices & Sessions" },
    { id: "infrastructure", icon: Server, labelAr: "الخوادم والتكاملات", labelEn: "Servers & Integrations" },
    { id: "database", icon: Database, labelAr: "قواعد البيانات والنسخ الاحتياطي", labelEn: "DB & Backups" },
    { id: "monitoring", icon: Activity, labelAr: "مراقبة الأداء والأعطال", labelEn: "Monitoring & Faults" },
    { id: "peripherals", icon: Printer, labelAr: "الطابعات والباركود و RFID", labelEn: "Peripherals (Printers, RFID)" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-lg z-10 relative">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/20 rounded-lg">
            <ShieldAlert className="w-6 h-6 text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold">{isAr ? "لوحة تحكم قسم تقنية المعلومات المؤسسية" : "Enterprise IT Administration"}</h1>
            <p className="text-xs text-slate-400">{isAr ? "إدارة شاملة لجميع موارد وأجهزة وصلاحيات النظام" : "Comprehensive management of all system resources, devices, and permissions"}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-72 bg-white border-l border-r border-slate-200 overflow-y-auto">
          <div className="p-2 space-y-1">
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm font-semibold transition-all ${
                    activeTab === t.id ? 'bg-sky-50 text-sky-700 border border-sky-100' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${activeTab === t.id ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span className="text-right">{isAr ? t.labelAr : t.labelEn}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800">{isAr ? "المستخدمين، الأدوار، والصلاحيات" : "Users, Roles & Permissions"}</h2>
                <button 
                  onClick={() => window.dispatchEvent(new CustomEvent("openGenericModal", { detail: { titleEn: "Add New System User", titleAr: "إضافة مستخدم جديد للنظام", type: "form" } }))}
                  className="px-4 py-2 bg-sky-600 text-white rounded shadow text-sm font-bold active:scale-95 transition-all"
                >
                  {isAr ? "+ مستخدم جديد" : "+ New User"}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">{isAr ? "المستخدمين النشطين" : "Active Users"}</p>
                    <p className="text-2xl font-black text-slate-800">1,245</p>
                  </div>
                  <Users className="w-8 h-8 text-sky-500 opacity-50" />
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">{isAr ? "الأدوار والصلاحيات" : "Roles & Policies"}</p>
                    <p className="text-2xl font-black text-slate-800">42</p>
                  </div>
                  <Lock className="w-8 h-8 text-amber-500 opacity-50" />
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 font-semibold">{isAr ? "المزامنة مع Active Directory" : "AD Sync Status"}</p>
                    <p className="text-lg font-bold text-emerald-600">Synced</p>
                  </div>
                  <RefreshCcw className="w-8 h-8 text-emerald-500 opacity-50" />
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-start">{isAr ? "المستخدم" : "User"}</th>
                      <th className="p-3 text-start">{isAr ? "الدور" : "Role"}</th>
                      <th className="p-3 text-start">{isAr ? "القسم" : "Department"}</th>
                      <th className="p-3 text-start">{isAr ? "الحالة" : "Status"}</th>
                      <th className="p-3 text-start">{isAr ? "الإجراءات" : "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1,2,3,4].map(i => (
                      <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800">Dr. Ahmed {i}</td>
                        <td className="p-3 text-slate-600">Senior Consultant</td>
                        <td className="p-3 text-slate-600">Cardiology</td>
                        <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-xs font-bold">Active</span></td>
                        <td className="p-3">
                          <button 
                            onClick={() => toast.info(isAr ? `تعديل المستخدم ${i}` : `Editing user ${i}`)}
                            className="text-sky-600 font-bold hover:underline active:scale-95 transition-all"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'devices' && (
            <div className="space-y-6">
               <h2 className="text-lg font-bold text-slate-800">{isAr ? "إدارة الأجهزة والجلسات (Workstations & Sessions)" : "Devices & Sessions Management"}</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                   <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                     <Terminal className="w-5 h-5 text-sky-600" />
                     <h3 className="font-bold text-slate-800">{isAr ? "معلومات جهازك الحالي" : "Current Device Information"}</h3>
                   </div>
                   {deviceInfo && (
                     <div className="grid grid-cols-2 gap-4 text-sm">
                       <div>
                         <p className="text-slate-400 font-medium">{isAr ? "نظام التشغيل" : "Operating System"}</p>
                         <p className="font-bold text-slate-700">{deviceInfo.platform}</p>
                       </div>
                       <div>
                         <p className="text-slate-400 font-medium">{isAr ? "المتصفح" : "Browser"}</p>
                         <p className="font-bold text-slate-700 truncate" title={deviceInfo.userAgent}>{deviceInfo.userAgent.split(' ')[0]}</p>
                       </div>
                       <div>
                         <p className="text-slate-400 font-medium">{isAr ? "الذاكرة المتاحة" : "Device Memory"}</p>
                         <p className="font-bold text-slate-700">{deviceInfo.memory}</p>
                       </div>
                       <div>
                         <p className="text-slate-400 font-medium">{isAr ? "أنوية المعالج" : "CPU Cores"}</p>
                         <p className="font-bold text-slate-700">{deviceInfo.cores}</p>
                       </div>
                       <div className="col-span-2">
                         <p className="text-slate-400 font-medium">{isAr ? "دقة الشاشة" : "Screen Resolution"}</p>
                         <p className="font-bold text-slate-700">{deviceInfo.screenResolution}</p>
                       </div>
                     </div>
                   )}
                 </div>

                 <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <Wifi className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-bold text-slate-800">{isAr ? "حالة الشبكة والاتصال" : "Network & Connectivity"}</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{isAr ? "نوع الاتصال" : "Connection Type"}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded uppercase">{deviceInfo?.connection || 'Active'}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-semibold">{isAr ? "حالة الإنترنت" : "Online Status"}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{deviceInfo?.online ? (isAr ? 'متصل' : 'ONLINE') : (isAr ? 'غير متصل' : 'OFFLINE')}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                         <span>IP Address: 192.168.1.105 (Local)</span>
                         <span>MAC: 00:1A:2B:3C:4D:5E</span>
                      </div>
                    </div>
                 </div>
               </div>

               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 text-sm">{isAr ? "الأجهزة النشطة في الشبكة" : "Active Network Workstations"}</h3>
                    <button className="text-xs font-bold text-sky-600 hover:underline">{isAr ? "تحديث القائمة" : "Refresh List"}</button>
                 </div>
                <table className="w-full text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 text-start">{isAr ? "الجهاز" : "Device"}</th>
                      <th className="p-3 text-start">{isAr ? "المستخدم الحالي" : "Current User"}</th>
                      <th className="p-3 text-start">{isAr ? "IP / MAC" : "IP / MAC"}</th>
                      <th className="p-3 text-start">{isAr ? "الموقع" : "Location"}</th>
                      <th className="p-3 text-start">{isAr ? "بيئة التشغيل" : "Environment"}</th>
                      <th className="p-3 text-start">{isAr ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold">ER-PC-01</td>
                      <td className="p-3 text-slate-600">Nurse Sarah</td>
                      <td className="p-3 font-mono text-slate-500">192.168.1.15<br/>00:1B:44:11:3A:B7</td>
                      <td className="p-3">ER Triage</td>
                      <td className="p-3 text-slate-500">Chrome 114<br/>Windows 11</td>
                      <td className="p-3"><span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-bold">Online</span></td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="p-3 font-bold">ICU-MOB-04</td>
                      <td className="p-3 text-slate-600">Dr. Khalid</td>
                      <td className="p-3 font-mono text-slate-500">10.0.0.52<br/>AA:BB:CC:DD:EE</td>
                      <td className="p-3">ICU Ward A</td>
                      <td className="p-3 text-slate-500">Safari 16<br/>iPadOS 16</td>
                      <td className="p-3"><span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded font-bold">Idle (15m)</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'infrastructure' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800">{isAr ? "الخوادم والتكاملات والمزامنة" : "Servers & Integrations"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Globe className="w-6 h-6 text-indigo-500" />
                    <h3 className="font-bold text-slate-800">{isAr ? "الخدمات السحابية والتكامل الخارجي" : "Cloud & External Integrations"}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-sm font-semibold">National Health Hub (Sehaty)</span> <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Connected</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-semibold">Insurance Gateway (NPHIES)</span> <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Connected</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-semibold">External Lab (Alborg)</span> <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Syncing...</span></div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
                    <Server className="w-6 h-6 text-slate-700" />
                    <h3 className="font-bold text-slate-800">{isAr ? "الخوادم الداخلية (On-Prem)" : "On-Premises Servers"}</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center"><span className="text-sm font-semibold">App Server 01 (Core)</span> <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Healthy (CPU 24%)</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-semibold">DB Node Primary</span> <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Healthy (IOPS 450)</span></div>
                    <div className="flex justify-between items-center"><span className="text-sm font-semibold">Cache Server (Redis)</span> <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Healthy (RAM 65%)</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'peripherals' && (
             <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-800">{isAr ? "إدارة الطرفيات (طابعات، باركود، RFID)" : "Peripherals Management"}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                     <Printer className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                     <h3 className="font-bold mb-2">Printers Network</h3>
                     <p className="text-2xl font-black text-slate-800 mb-2">45</p>
                     <p className="text-sm text-emerald-600 font-bold">42 Online | 3 Offline</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                     <Barcode className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                     <h3 className="font-bold mb-2">Barcode Scanners</h3>
                     <p className="text-2xl font-black text-slate-800 mb-2">120</p>
                     <p className="text-sm text-emerald-600 font-bold">Active globally</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
                     <ScanFace className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                     <h3 className="font-bold mb-2">Biometric / RFID</h3>
                     <p className="text-2xl font-black text-slate-800 mb-2">32</p>
                     <p className="text-sm text-emerald-600 font-bold">Access Points Active</p>
                   </div>
                </div>
             </div>
          )}

          {activeTab === 'monitoring' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-slate-800">{isAr ? "مراقبة الأداء والأعطال (Enterprise Monitoring)" : "Enterprise Monitoring & Diagnostics"}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Cpu className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">CPU Load</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">14%</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[14%]"></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">RAM Usage</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">4.2 GB</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-sky-500 h-full w-[42%]"></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <HardDrive className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Disk I/O</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">12 MB/s</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-amber-500 h-full w-[12%]"></div>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <Radio className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase">Latency</span>
                  </div>
                  <p className="text-2xl font-black text-slate-800">12 ms</p>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[10%]"></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
                 <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sky-400">
                       <History className="w-5 h-5" />
                       <h3 className="font-bold text-sm">{isAr ? "سجل الأحداث والتدقيق (Audit Trail)" : "Audit Trail & Event Log"}</h3>
                    </div>
                    <button onClick={() => setAuditLogs(AuditLogger.getLocalLogs())} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400">
                       <RefreshCcw className="w-4 h-4" />
                    </button>
                 </div>
                 <div className="max-h-[400px] overflow-y-auto font-mono text-[10px]">
                    {auditLogs.length > 0 ? (
                       <table className="w-full text-left">
                          <thead className="bg-slate-800 text-slate-500 sticky top-0">
                             <tr>
                                <th className="p-2">Timestamp</th>
                                <th className="p-2">User</th>
                                <th className="p-2">Action</th>
                                <th className="p-2">Module</th>
                                <th className="p-2">Details</th>
                             </tr>
                          </thead>
                          <tbody className="text-slate-300 divide-y divide-slate-800">
                             {auditLogs.map((log, idx) => (
                                <tr key={idx} className="hover:bg-slate-800/50 transition-colors">
                                   <td className="p-2 whitespace-nowrap text-sky-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                                   <td className="p-2 font-bold">{log.userName}</td>
                                   <td className="p-2"><span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                      log.severity === 'error' ? 'bg-rose-500/20 text-rose-400' :
                                      log.severity === 'warning' ? 'bg-amber-500/20 text-amber-400' :
                                      'bg-sky-500/20 text-sky-400'
                                   }`}>{log.action}</span></td>
                                   <td className="p-2 text-slate-500">{log.module}</td>
                                   <td className="p-2 italic">{log.details}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    ) : (
                       <div className="p-12 text-center text-slate-600 italic">
                          No audit logs recorded in current session.
                       </div>
                    )}
                 </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
