import React, { useState } from "react";
import { User, Mail, Phone, Calendar, Shield, MapPin, Briefcase, Activity, CheckCircle, Clock, Settings, Key, Signature, Printer, Monitor, FileText, Award, Bell } from "lucide-react";
import { useHIS } from "../context/HISContext";
import { format } from "date-fns";

export default function HISProfileWorkspace({ currentUser, language }: any) {
  const { rosterWishes } = useHIS();
  // Combine context data with layout representation
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState("overview");

  if (!currentUser) return null;

  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans flex-1 flex flex-col h-full min-h-0 animate-fade-in" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-6 shrink-0 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center justify-center text-indigo-500 overflow-hidden shadow-inner shrink-0 relative group">
            {currentUser?.profilePictureUrl ? (
              <img src={currentUser.profilePictureUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-10 h-10" />
            )}
            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center cursor-pointer transition-all">
               <span className="text-white text-xs font-bold">{isAr ? "تغيير الصورة" : "Change Photo"}</span>
            </div>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h1 className="text-lg sm:text-2xl font-black text-slate-800">{isAr ? currentUser.nameAr : currentUser.nameEn}</h1>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                {isAr ? "متصل" : "Online"}
              </span>
            </div>
            <p className="text-sm font-bold text-indigo-600 mb-2">{currentUser.staffId} • {currentUser.jobTitle}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-slate-400" /> {currentUser.department || (isAr ? "القسم العام" : "General Dept")}</span>
              <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {currentUser.email || "no-email@hospital.local"}</span>
              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {currentUser.phone || "N/A"}</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
           <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {isAr ? "تعديل الملف الشخصي" : "Edit Profile"}
           </button>
           <span className="text-[10px] text-slate-400 font-mono">Last Login: {format(new Date(), "yyyy-MM-dd HH:mm")}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {[
            { id: "overview", icon: Activity, labelAr: "نظرة عامة سريرية", labelEn: "Clinical Overview" },
            { id: "roster", icon: Calendar, labelAr: "الروستر الشخصي", labelEn: "Personal Roster" },
            { id: "permissions", icon: Shield, labelAr: "الصلاحيات والأدوار", labelEn: "Roles & Permissions" },
            { id: "preferences", icon: Monitor, labelAr: "إعدادات واجهة النظام", labelEn: "HIS Preferences" },
            { id: "security", icon: Key, labelAr: "الأمان والدخول", labelEn: "Security & Access" },
            { id: "signature", icon: Signature, labelAr: "التوقيع الإلكتروني", labelEn: "Digital Signature" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all text-left ${activeTab === tab.id ? "bg-indigo-600 text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50"}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-indigo-200" : "text-slate-400"}`} />
              {isAr ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Content Panel */}
        <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-y-auto custom-scrollbar p-6">
          
          
          {activeTab === "roster" && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
                 <div className="flex gap-2 min-w-max">
                    <button className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold border border-indigo-100 hover:bg-indigo-100 transition">{isAr ? "الوردية الحالية" : "Current Shift"}</button>
                    <button className="px-3 py-1.5 bg-white text-slate-600 rounded-lg text-xs font-bold border border-slate-200 hover:bg-slate-50 transition">{isAr ? "تحميل PDF" : "Download PDF"}</button>
                 </div>
                 <h3 className="text-lg font-black text-slate-800">{isAr ? "الروستر الشخصي" : "Personal Roster"}</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="lg:col-span-2 space-y-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                       <h4 className="font-bold text-sm text-slate-800 mb-4 flex items-center justify-between">
                         <span>{isAr ? "جدول الشهر الحالي" : "Current Month Schedule"}</span>
                         <span className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">{isAr ? "يوليو 2026" : "July 2026"}</span>
                       </h4>
                       
                       <div className="grid grid-cols-7 gap-2">
                         {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                            <div key={d} className="text-center text-[10px] font-bold text-slate-400 uppercase">{d}</div>
                         ))}
                         {Array.from({length: 31}).map((_, i) => {
                           const day = i + 1;
                           let shift = "M";
                           let bg = "bg-emerald-50 border-emerald-200 text-emerald-700";
                           if (day % 4 === 0) { shift = "N"; bg = "bg-slate-800 border-slate-700 text-amber-400"; }
                           else if (day % 7 === 0) { shift = "OFF"; bg = "bg-rose-50 border-rose-200 text-rose-600"; }
                           
                           return (
                             <div key={i} className={`aspect-square rounded-lg border ${bg} flex flex-col items-center justify-center relative shadow-sm cursor-pointer hover:opacity-80 transition`}>
                               <span className="absolute top-1 left-1.5 text-[9px] font-mono opacity-60">{day}</span>
                               <span className="font-black text-xs mt-2">{shift}</span>
                             </div>
                           )
                         })}
                       </div>
                    </div>
                 </div>
                 <div className="space-y-4">
                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
                       <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">{isAr ? "الوردية القادمة" : "Upcoming Shift"}</h4>
                       <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                             <Clock className="w-6 h-6" />
                          </div>
                          <div>
                             <div className="font-black text-slate-800 text-lg">Night Shift (N)</div>
                             <div className="text-sm font-medium text-slate-500">20:00 - 08:00</div>
                          </div>
                       </div>
                       <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                          <div className="flex justify-between text-xs">
                             <span className="text-slate-500">{isAr ? "القسم" : "Department"}</span>
                             <span className="font-bold text-slate-700">{isAr ? "عناية مركزة" : "ICU Ward"}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                             <span className="text-slate-500">{isAr ? "الزملاء في الوردية" : "Team Members"}</span>
                             <span className="font-bold text-slate-700">4 RNs, 1 MD</span>
                          </div>
                       </div>
                    </div>

                    <div className="bg-indigo-900 border border-indigo-800 rounded-xl p-4 text-white shadow-md">
                       <h4 className="font-bold text-xs text-indigo-300 uppercase tracking-wider mb-3">{isAr ? "مؤشرات الحضور" : "Attendance KPI"}</h4>
                       <div className="space-y-3">
                          <div>
                             <div className="flex justify-between text-xs mb-1">
                                <span>{isAr ? "ساعات العمل المنجزة" : "Hours Completed"}</span>
                                <span className="font-bold">144 / 160</span>
                             </div>
                             <div className="w-full bg-indigo-950 rounded-full h-1.5">
                                <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: "90%" }}></div>
                             </div>
                          </div>
                          <div>
                             <div className="flex justify-between text-xs mb-1">
                                <span>{isAr ? "رصيد الإجازات" : "Leave Balance"}</span>
                                <span className="font-bold">12 Days</span>
                             </div>
                             <div className="w-full bg-indigo-950 rounded-full h-1.5">
                                <div className="bg-amber-400 h-1.5 rounded-full" style={{ width: "40%" }}></div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}
          {activeTab === "overview" && (

            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2 mb-4">{isAr ? "نظرة عامة سريرية" : "Clinical Overview"}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-indigo-600"><CheckCircle className="w-5 h-5" /><span className="font-bold text-sm">{isAr ? "المهام المنجزة اليوم" : "Tasks Completed Today"}</span></div>
                  <div className="text-3xl font-black text-slate-800">14</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600"><Award className="w-5 h-5" /><span className="font-bold text-sm">{isAr ? "إجمالي الحالات المعالجة" : "Total Cases Handled"}</span></div>
                  <div className="text-3xl font-black text-slate-800">1,248</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-2 mb-2 text-rose-600"><Clock className="w-5 h-5" /><span className="font-bold text-sm">{isAr ? "ساعات المناوبة الحالية" : "Current Shift Hours"}</span></div>
                  <div className="text-3xl font-black text-slate-800">6.5 <span className="text-sm text-slate-500 font-medium">hrs</span></div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-700 mb-3">{isAr ? "النشاطات الحديثة" : "Recent Activity"}</h4>
                <div className="space-y-3">
                  {[
                    { textAr: "تم توثيق ملاحظات سريرية للمريض MRN-10293", textEn: "Documented clinical notes for MRN-10293", time: "10 mins ago", icon: FileText, color: "text-blue-500", bg: "bg-blue-50" },
                    { textAr: "تم طلب فحص دم شامل (CBC) للمريض MRN-10288", textEn: "Ordered CBC lab test for MRN-10288", time: "1 hr ago", icon: Activity, color: "text-rose-500", bg: "bg-rose-50" },
                    { textAr: "تحديث حالة السرير B-12 إلى 'مشغول'", textEn: "Updated Bed B-12 status to 'Occupied'", time: "3 hrs ago", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50" }
                  ].map((act, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.bg} ${act.color}`}>
                        <act.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{isAr ? act.textAr : act.textEn}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "permissions" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2 mb-4">{isAr ? "الصلاحيات والأدوار السريرية" : "Clinical Roles & Permissions"}</h3>
              <p className="text-sm text-slate-600 mb-6">{isAr ? "الصلاحيات الممنوحة لك في النظام الطبي تعتمد على المسمى الوظيفي والقسم." : "Your permissions in the HIS depend on your job title and department."}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="border border-emerald-100 bg-emerald-50/30 p-4 rounded-xl">
                   <h4 className="font-bold text-emerald-800 text-sm mb-3 flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {isAr ? "صلاحيات الوصول (مفعلة)" : "Granted Access"}</h4>
                   <ul className="space-y-2 text-xs font-semibold text-emerald-700">
                     <li className="flex items-center gap-2">• {isAr ? "الوصول إلى السجلات الطبية للمرضى" : "Access to Electronic Medical Records"}</li>
                     <li className="flex items-center gap-2">• {isAr ? "كتابة الأوامر الطبية (أدوية، مختبر)" : "CPOE (Medications, Labs)"}</li>
                     <li className="flex items-center gap-2">• {isAr ? "تسجيل الملاحظات السريرية" : "Clinical Notes Documentation"}</li>
                     <li className="flex items-center gap-2">• {isAr ? "عرض نتائج المختبر والأشعة" : "View Lab & Radiology Results"}</li>
                   </ul>
                 </div>
                 <div className="border border-slate-200 bg-slate-50 p-4 rounded-xl opacity-70">
                   <h4 className="font-bold text-slate-700 text-sm mb-3 flex items-center gap-2"><Shield className="w-4 h-4" /> {isAr ? "صلاحيات مقيدة" : "Restricted Access"}</h4>
                   <ul className="space-y-2 text-xs font-medium text-slate-500">
                     <li className="flex items-center gap-2">• {isAr ? "لوحة الإدارة الأكاديمية (WSD)" : "WSD Academic Console"}</li>
                     <li className="flex items-center gap-2">• {isAr ? "إعدادات النظام المالية" : "Financial System Settings"}</li>
                     <li className="flex items-center gap-2">• {isAr ? "صلاحيات الحذف النهائي للسجلات" : "Permanent Record Deletion"}</li>
                   </ul>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2 mb-4">{isAr ? "إعدادات واجهة النظام" : "HIS UI Preferences"}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{isAr ? "الوضع الليلي للعيادات" : "Clinical Dark Mode"}</h4>
                    <p className="text-xs text-slate-500 mt-1">{isAr ? "تفعيل الوضع المظلم لتقليل إجهاد العين أثناء المناوبات الليلية." : "Enable dark mode to reduce eye strain during night shifts."}</p>
                  </div>
                  <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{isAr ? "إشعارات الطوارئ الصوتية" : "Emergency Audio Alerts"}</h4>
                    <p className="text-xs text-slate-500 mt-1">{isAr ? "تشغيل تنبيه صوتي عند ورود نتيجة حرجة من المختبر." : "Play an audio alert when a critical lab result is received."}</p>
                  </div>
                  <div className="w-12 h-6 bg-indigo-500 rounded-full relative cursor-pointer shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition">
                  <div>
                    <h4 className="font-bold text-sm text-slate-800">{isAr ? "لغة الواجهة السريرية الافتراضية" : "Default Clinical Interface Language"}</h4>
                    <p className="text-xs text-slate-500 mt-1">{isAr ? "تغيير لغة العرض الافتراضية لملفات المرضى." : "Change the default display language for patient charts."}</p>
                  </div>
                  <select className="border border-slate-200 bg-white text-sm font-bold text-slate-700 py-1.5 px-3 rounded-lg outline-none focus:border-indigo-500">
                    <option value="en">English (Medical)</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "signature" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2 mb-4">{isAr ? "التوقيع الإلكتروني" : "Digital Signature"}</h3>
              <p className="text-sm text-slate-600 mb-6">{isAr ? "قم بإعداد توقيعك الإلكتروني ليتم إرفاقه تلقائياً مع الوصفات الطبية والتقارير." : "Set up your digital signature to be automatically attached to prescriptions and reports."}</p>
              
              <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl h-48 flex flex-col items-center justify-center relative hover:bg-slate-100 transition cursor-crosshair">
                <Signature className="w-5 h-5 sm:w-8 sm:h-8 text-slate-300 mb-2" />
                <span className="text-xs font-bold text-slate-400">{isAr ? "قم بالرسم هنا لتسجيل توقيعك" : "Draw here to record your signature"}</span>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition">{isAr ? "مسح التوقيع" : "Clear Signature"}</button>
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-md transition">{isAr ? "حفظ التوقيع" : "Save Signature"}</button>
              </div>
            </div>
          )}
          
          {activeTab === "security" && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-lg font-black text-slate-800 border-b border-slate-100 pb-2 mb-4">{isAr ? "الأمان وسجل الدخول" : "Security & Login History"}</h3>
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 mb-6">
                <Shield className="w-6 h-6 text-amber-600 shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-800 text-sm mb-1">{isAr ? "الامتثال الأمني (HIPAA / NCSC)" : "Security Compliance (HIPAA / NCSC)"}</h4>
                  <p className="text-xs text-amber-700 leading-relaxed">{isAr ? "تأكد من تسجيل الخروج عند مغادرة جهازك. النظام سيقوم بتسجيل الخروج تلقائياً بعد 15 دقيقة من الخمول للحفاظ على سرية بيانات المرضى." : "Ensure you log out when leaving your device. The system will auto-logout after 15 minutes of inactivity to protect patient data confidentiality."}</p>
                </div>
              </div>

              <h4 className="font-bold text-sm text-slate-700 mb-3">{isAr ? "الأجهزة المتصلة مؤخراً" : "Recently Connected Devices"}</h4>
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left text-slate-600" dir={isAr ? "rtl" : "ltr"}>
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase font-black text-slate-500">
                    <tr>
                      <th className="px-4 py-3">{isAr ? "الجهاز" : "Device"}</th>
                      <th className="px-4 py-3">{isAr ? "الموقع (IP)" : "Location (IP)"}</th>
                      <th className="px-4 py-3">{isAr ? "التاريخ والوقت" : "Date & Time"}</th>
                      <th className="px-4 py-3">{isAr ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="font-medium text-xs">
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 flex items-center gap-2"><Monitor className="w-3.5 h-3.5 text-slate-400" /> Chrome (Windows 11)</td>
                      <td className="px-4 py-3 font-mono text-[10px]">192.168.1.104</td>
                      <td className="px-4 py-3 font-mono">{format(new Date(), "yyyy-MM-dd HH:mm")}</td>
                      <td className="px-4 py-3"><span className="text-emerald-600 font-bold">{isAr ? "الجلسة الحالية" : "Current Session"}</span></td>
                    </tr>
                    <tr className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 flex items-center gap-2"><Monitor className="w-3.5 h-3.5 text-slate-400" /> Safari (iOS 17)</td>
                      <td className="px-4 py-3 font-mono text-[10px]">10.0.0.45</td>
                      <td className="px-4 py-3 font-mono">2026-07-10 09:14</td>
                      <td className="px-4 py-3"><span className="text-slate-400 font-bold">{isAr ? "منتهية" : "Expired"}</span></td>
                    </tr>
                  </tbody>
                </table>
</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
