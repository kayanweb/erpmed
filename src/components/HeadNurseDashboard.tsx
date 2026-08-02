import React, { useState } from "react";
import { User, ClipboardList, Database, Clock, CalendarCheck, ShieldCheck, CheckSquare, PlusCircle, Activity, BedDouble, ArrowRightLeft, FileWarning, Search, ShieldAlert, AlertTriangle } from "lucide-react";
import SmartNotificationCenter from "./SmartNotificationCenter";

interface Props {
  language: "ar" | "en";
  currentUser?: any;
  onNavigate?: (tab: string, subTab?: string) => void;
}

export default function HeadNurseDashboard({ language, currentUser, onNavigate }: Props) {
  const isAr = language === "ar";
  const [activeTab, setActiveTab] = useState<"handover" | "assignment" | "tasks" | "stock" | "admit" | "incidents">("handover");

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-right font-sans flex flex-col gap-6" dir={isAr ? "rtl" : "ltr"}>
      
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 border-r-4 border-r-pink-500">
        <div>
          <h1 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center gap-2">
            <User className="h-7 w-7 text-pink-600" />
            {isAr ? "إدارة القسم والكارديكس السريري (Head Nurse)" : "Ward Manager & Head Nurse Dashboard"}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {isAr ? "إدارة الشفت الفعلي، تسليم الحالات (Kardex)، التوزيع اليومي، عهد الأدوية، والترجيع الجانبي." : "Floor management, Shift Handovers, Daily assignments, Ward Stock, and Admissions."}
          </p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 flex-wrap">
          <button 
            onClick={() => setActiveTab("handover")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "handover" ? "bg-white text-pink-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <ClipboardList className="w-4 h-4" />
            {isAr ? "ملخص الشفت" : "Shift Summary"}
          </button>
          <button 
            onClick={() => setActiveTab("assignment")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "assignment" ? "bg-white text-pink-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <User className="w-4 h-4" />
            {isAr ? "توزيع التمريض" : "Assignment"}
          </button>
          <button 
            onClick={() => setActiveTab("tasks")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "tasks" ? "bg-white text-pink-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <CheckSquare className="w-4 h-4" />
            {isAr ? "تنفيذ الخطة (MAR)" : "Medication & MAR"}
          </button>
          <button 
            onClick={() => setActiveTab("stock")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "stock" ? "bg-white text-pink-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <Database className="w-4 h-4" />
            {isAr ? "العهد والمخدرات" : "Ward Stock"}
          </button>
          <button 
            onClick={() => setActiveTab("admit")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "admit" ? "bg-white text-pink-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <ArrowRightLeft className="w-4 h-4" />
            {isAr ? "الدخول والخروج (ADT)" : "Admission Tracker"}
          </button>
          <button 
            onClick={() => setActiveTab("incidents")}
            className={`px-3 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 ${activeTab === "incidents" ? "bg-white text-pink-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            <ShieldAlert className="w-4 h-4" />
            {isAr ? "الحوادث والتقييم" : "Incidents & Audits"}
          </button>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 h-full items-stretch">
        
        {/* Main Content */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {activeTab === "handover" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in flex flex-col gap-6">
              <div className="flex-1 space-y-6">
                 <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <ClipboardList className="w-6 h-6 text-pink-500" />
                        {isAr ? "ملخص وملاحظات القسم (Ward Shift Summary)" : "Ward Shift Summary"}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 font-medium">
                        {isAr ? "الإعلانات، الأحداث، النواقص، وتحديثات القسم العامة." : "General ward announcements, incidents, equipment issues, and updates."}
                      </p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                       <FileWarning className="w-4 h-4 text-amber-500" /> {isAr ? "أحداث هامة (Incidents / Code)" : "Important Incidents"}
                     </label>
                     <textarea 
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                       rows={4} 
                       placeholder={isAr ? "سجل أي أحداث طارئة أو حالات Code..." : "Record any emergencies or codes..."}
                     ></textarea>
                   </div>
                   
                   <div className="space-y-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                       <AlertTriangle className="w-4 h-4 text-rose-500" /> {isAr ? "أعطال الأجهزة والنواقص" : "Equipment Issues & Shortages"}
                     </label>
                     <textarea 
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                       rows={4} 
                       placeholder={isAr ? "مثال: جهاز رسم القلب في غرفة 204 معطل..." : "e.g., ECG machine in room 204 is broken..."}
                     ></textarea>
                   </div>
                   
                   <div className="space-y-2 md:col-span-2">
                     <label className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                       <ClipboardList className="w-4 h-4 text-pink-500" /> {isAr ? "إعلانات إدارية (Ward Announcements)" : "Ward Announcements"}
                     </label>
                     <textarea 
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-pink-500 outline-none" 
                       rows={4} 
                       placeholder={isAr ? "أي تعليمات من الإدارة أو تحديثات للقسم..." : "Management instructions or ward updates..."}
                     ></textarea>
                   </div>
                 </div>
                 
                 <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
                   <button className="bg-pink-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-pink-700 transition shadow-md flex items-center gap-2">
                     <ShieldCheck className="w-5 h-5"/>
                     {isAr ? "اعتماد ملخص القسم (Sign Shift Summary)" : "Sign Ward Shift Summary"}
                   </button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "assignment" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-500" />
                      {isAr ? "توزيع أسرة ومهام المرضى على التمريض (Daily Patient Assignment)" : "Daily Patient & Room Mapping"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">توزيع مرئي للعبء السريري بناءً على كفاءة الممرض ووضع المريض.</p>
                  </div>
                  <button className="w-full sm:w-auto bg-slate-100 text-slate-700 px-4 py-2 text-xs font-bold hover:bg-slate-200 rounded-lg shadow-sm border border-slate-200 flex items-center justify-center gap-2">
                    <User className="w-4 h-4" /> {isAr ? "سحب التمريض المتاح من الروستر" : "Sync Today's Staff"}
                  </button>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                 <div className="border border-slate-200 rounded-xl p-0 overflow-hidden shadow-sm hover:border-slate-300 transition">
                   <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">س. م</div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">سالمة محمد سعيد</p>
                          <p className="text-[10px] text-slate-500 font-bold">ممرض مسجل (RN) | 12 ساعة</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">2 Cases</div>
                   </div>
                   
                   <div className="p-4 space-y-2">
                     <div className="bg-white rounded-lg p-2.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-sm flex justify-between items-center group">
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">Bed 1</span>
                           <span>علي إبراهيم</span>
                        </div>
                        <span className="text-[9px] text-slate-400 group-hover:text-rose-500 cursor-pointer">إزالة</span>
                     </div>
                     <div className="bg-white rounded-lg p-2.5 text-xs font-bold text-slate-700 border border-slate-200 shadow-sm flex justify-between items-center group border-l-4 border-l-rose-500">
                        <div className="flex items-center gap-2">
                           <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono border border-slate-200">Bed 4</span>
                           <span>محمود السيد <span className="text-rose-500">(حرج)</span></span>
                        </div>
                        <span className="text-[9px] text-slate-400 hover:text-rose-500 cursor-pointer">إزالة</span>
                     </div>
                     <button className="w-full mt-2 bg-slate-50 text-indigo-600 text-[10px] border border-dashed border-slate-300 font-bold py-2 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors">
                        <PlusCircle className="w-3 h-3"/> {isAr ? "تعيين سرير إضافي" : "Assign Bed"}
                     </button>
                   </div>
                 </div>
                 
                 <div className="border border-slate-200 rounded-xl p-0 overflow-hidden shadow-sm hover:border-slate-300 transition">
                   <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">أ. ع</div>
                        <div>
                          <p className="font-bold text-sm text-slate-800">أحمد العتوم</p>
                          <p className="text-[10px] text-slate-500 font-bold">ممرض مسجل (RN) | 12 ساعة</p>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">1:1 Isolation</div>
                   </div>
                   
                   <div className="p-4 space-y-2">
                     <div className="bg-rose-50 rounded-lg p-2.5 text-xs font-bold flex flex-col gap-2 text-slate-700 border border-rose-200 shadow-sm group">
                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                              <span className="bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-mono border border-rose-200">Iso Room 1</span>
                              <span className="text-rose-900">مجهول الهوية</span>
                           </div>
                        </div>
                        <span className="text-[9px] text-rose-600 bg-white border border-rose-100 max-w-max px-2 py-0.5 rounded self-start">مريض شديد العدوى / عزل هوائي</span>
                     </div>
                     <button className="w-full mt-2 bg-slate-50 text-indigo-600 text-[10px] border border-dashed border-slate-300 font-bold py-2 rounded-lg hover:bg-slate-100 flex items-center justify-center gap-1 transition-colors opacity-50 cursor-not-allowed">
                        <PlusCircle className="w-3 h-3"/> غير متاح للتعيين (Max Ratio)
                     </button>
                   </div>
                 </div>

                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 hover:bg-slate-50 cursor-pointer transition min-h-[200px]">
                     <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-400">
                       <PlusCircle className="w-6 h-6" />
                     </div>
                     <p className="font-bold text-sm text-slate-600">{isAr ? "إضافة تعيين جديد متفرغ (مثال: Charge Nurse)" : "Add Special Assignment"}</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                      <CheckSquare className="w-5 h-5 text-indigo-500" />
                      {isAr ? "مراقبة تنفيذ الخطة العلاجية الدوائية (Live e-MAR Monitoring)" : "Therapeutic & MAR Tracking"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">{isAr ? "لوحة تحكم إشرافية، الألوان تعكس حالة التنفيذ المباشرة لجدول الأدوية (الأحمر للمتأخر / المعلق)." : "Colors reflect real-time MAR status (Red = Overdue)"}</p>
                 </div>
                 <div className="flex gap-2 shrink-0">
                    <div className="bg-rose-50 text-rose-700 px-3 flex items-center gap-1 py-1 rounded border border-rose-200 text-[10px] font-bold"><Activity className="w-3 h-3"/> 1 متأخر</div>
                    <div className="bg-emerald-50 text-emerald-700 px-3 flex items-center gap-1 py-1 rounded border border-emerald-200 text-[10px] font-bold"><CheckSquare className="w-3 h-3"/> 45 تم الصرف</div>
                 </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-sm border-collapse ">
                   <thead>
                     <tr className="bg-slate-50 border-y border-slate-200">
                       <th className="py-3 px-4 font-bold text-right">{isAr ? "المريض / السرير" : "Patient / Bed"}</th>
                       <th className="py-3 px-4 font-bold text-center">{isAr ? "المهمة أو الدواء (Order)" : "Task / Medication"}</th>
                       <th className="py-3 px-4 font-bold text-center">{isAr ? "الموعد المجدول" : "Scheduled Time"}</th>
                       <th className="py-3 px-4 font-bold text-center">{isAr ? "ممرض الحالة" : "Assigned Nurse"}</th>
                       <th className="py-3 px-4 font-bold text-center">{isAr ? "حالة التنفيذ والختم" : "Status & Seal"}</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100 font-semibold text-slate-700 text-center">
                     <tr className="bg-rose-50/30">
                       <td className="py-4 px-4 text-right">
                         <p className="font-bold text-slate-900">محمود السيد</p>
                         <p className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 rounded max-w-max mt-1">Bed 4</p>
                       </td>
                       <td className="py-4 px-4 font-mono text-xs font-bold text-indigo-900">
                          Ceftriaxone 1g IV
                          <div className="text-[9px] text-slate-500 font-sans mt-1">Antibiotic, Dilute in 100ml NS</div>
                       </td>
                       <td className="py-4 px-4 text-rose-600 font-bold">10:00 AM <br/><span className="text-[9px] font-normal underline">منذ ساعتين</span></td>
                       <td className="py-4 px-4 text-[10px] font-bold">سالمة محمد</td>
                       <td className="py-4 px-4">
                         <span className="bg-rose-100 text-rose-700 px-3 py-1.5 rounded-lg text-[10px] border border-rose-200 font-black animate-pulse shadow-sm block max-w-max mx-auto text-center whitespace-nowrap">متأخر (Overdue) - اتخاذ إجراء</span>
                       </td>
                     </tr>
                     <tr className="hover:bg-slate-50 transition">
                       <td className="py-4 px-4 text-right">
                         <p className="font-bold text-slate-900">سعاد علي</p>
                         <p className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1 rounded max-w-max mt-1">Bed 2</p>
                       </td>
                       <td className="py-4 px-4 text-xs font-bold text-emerald-900">
                          Vital Signs / BP Check
                          <div className="text-[9px] text-slate-500 font-sans mt-1">Routine every 4 hrs</div>
                       </td>
                       <td className="py-4 px-4 text-slate-600">10:30 AM</td>
                       <td className="py-4 px-4 text-[10px] font-bold">أحمد العتوم</td>
                       <td className="py-4 px-4">
                         <span className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] border border-emerald-200 font-black flex items-center justify-center gap-1 mx-auto max-w-max whitespace-nowrap">
                            <CheckSquare className="w-3 h-3" /> مسجل رقميا في 10:28
                         </span>
                       </td>
                     </tr>
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === "stock" && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in flex flex-col xl:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
                  <Database className="w-5 h-5 text-indigo-500" />
                  {isAr ? "جرد عهدة القسم المباشر والرقابة المتشددة للمخدرات" : "Ward Stock & Narcotics Audit Control"}
                </h3>
                
                <div className="space-y-4">
                   <div className="p-5 bg-white border-2 border-rose-100 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
                     <div>
                       <p className="font-black text-rose-900 text-sm flex items-center gap-1.5"><ShieldAlert className="w-4 h-4 text-rose-500"/> Fentanyl 100mcg Ampoules المتبقي بالخزنة</p>
                       <p className="text-[10px] text-rose-700 font-bold mt-1 max-w-sm">جرد الشفت الإلزامي يتطلب توقيع مزدوج لمسؤول الصيدلة والتمريض للمطابقة مع استهلاك المرضى (MAR).</p>
                     </div>
                     <div className="text-3xl font-black font-mono text-rose-700 text-center">
                       12
                       <span className="block text-[8px] uppercase tracking-widest text-rose-500">Ampoules</span>
                     </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                        <p className="font-bold text-sm text-slate-800">مستلزمات عامة (IV Sets)</p>
                        <div className="mt-2 flex justify-between items-end">
                           <span className="font-mono text-xl font-black text-slate-700">45</span>
                           <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">مخزون آمن</span>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col">
                        <p className="font-bold text-sm text-slate-800 flex-1">أدوية الثلاجة (Insulin)</p>
                        <div className="mt-2 flex justify-between items-end">
                           <span className="bg-white border border-slate-300 font-mono text-xs px-2 py-1 rounded text-slate-700">Temp: +4°C</span>
                           <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold">مطابق</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>
              
              <div className="w-full xl:w-[320px] bg-slate-900 rounded-2xl p-6 self-start space-y-5 shadow-xl shrink-0 border-t-4 border-t-rose-500">
                 <h4 className="font-black text-white text-sm text-center flex items-center justify-center gap-1.5 border-b border-slate-700 pb-3 mb-2">
                   <ShieldCheck className="w-5 h-5 text-rose-400"/> {isAr ? "بوابة الصرف المغلقة (توقيع ثنائي)" : "Dual Signature Vault"}
                 </h4>
                 <div className="space-y-4">
                   <div>
                     <label className="text-[10px] text-slate-400 block mb-1 font-bold">رقم هوية الصيدلي / الطبيب المصرّح</label>
                     <input type="password" placeholder="***" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-rose-500" />
                   </div>
                   <div>
                     <label className="text-[10px] text-slate-400 block mb-1 font-bold">رقم هوية الممرض المسئول (أنت)</label>
                     <input type="password" placeholder="***" className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg p-3 text-center text-lg tracking-widest font-mono focus:outline-none focus:border-rose-500" />
                   </div>
                   <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black py-4 rounded-xl text-sm transition mt-2 shadow-[0_0_15px_rgba(225,29,72,0.4)]">
                     {isAr ? "افتح الخزنة وسجل حركة الصرف" : "Unlock Vault & Log Dispense"}
                   </button>
                 </div>
              </div>
            </div>
          )}

          {activeTab === "admit" && (
             <div className="bg-white p-6 sm:p-12 rounded-2xl border border-slate-200 shadow-sm animate-fade-in text-center flex flex-col items-center justify-center min-h-[400px]">
                <ArrowRightLeft className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-black text-xl text-slate-800 mb-2">{isAr ? "تتبع حركات دخول وخروج ونقل المرضى (ADT)" : "Admission, Discharge, Transfer (ADT)"}</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 font-medium">
                  {isAr ? "متابعة أوامر الطبيب بخروج المرضى، تسوية الغرف للتعقيم، وتجهيز الأسرة للحالات المحولة من الطوارئ." : "Track physician discharge orders, flag rooms for terminal cleaning, and prep beds for incoming ER transfers."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
                   <button className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-indigo-700 transition w-full sm:w-auto">
                      + {isAr ? "استقبال مريض جديد بالقسم" : "Admit New Patient from ER"}
                   </button>
                   <button className="bg-white border border-slate-300 text-slate-700 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-slate-50 transition w-full sm:w-auto">
                      {isAr ? "بدء إجراءات خروج مريض (Discharge)" : "Initiate Discharge Checklist"}
                   </button>
                   <button className="bg-sky-50 border border-sky-300 text-sky-700 font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-sky-100 transition w-full sm:w-auto">
                      {isAr ? "اعتماد نقل (Approve Transfer)" : "Approve Transfer"}
                   </button>
                </div>
             </div>
          )}

          {activeTab === "incidents" && (
             <div className="bg-white p-6 sm:p-12 rounded-2xl border border-slate-200 shadow-sm animate-fade-in text-center flex flex-col items-center justify-center min-h-[400px]">
                <ShieldAlert className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="font-black text-xl text-slate-800 mb-2">{isAr ? "مراجعة الحوادث والتقييمات" : "Review Incidents & Audits"}</h3>
                <p className="text-slate-500 text-sm max-w-md mx-auto mb-8 font-medium">
                  {isAr ? "مراجعة واعتماد تقارير الحوادث (OVR) وتقييمات الجودة للقسم." : "Review and approve incident reports (OVR) and ward quality audits."}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3 w-full sm:w-auto">
                   <button className="bg-rose-600 text-white font-bold px-6 py-3 rounded-xl shadow-md hover:bg-rose-700 transition w-full sm:w-auto">
                      {isAr ? "مراجعة الحوادث" : "Review Incidents"}
                   </button>
                   <button className="bg-slate-800 text-white font-bold px-6 py-3 rounded-xl shadow-sm hover:bg-slate-700 transition w-full sm:w-auto">
                      {isAr ? "مراجعة التقييمات" : "Review Audits"}
                   </button>
                </div>
             </div>
          )}
        </div>

        {/* Right Sidebar - Smart Notification Center */}
        <div className="w-full xl:w-[320px] shrink-0 xl:h-[calc(100vh-140px)] sticky top-6">
          <SmartNotificationCenter 
            language={language} 
            currentUser={currentUser}
            onNavigate={onNavigate} 
          />
        </div>

      </div>
    </div>
  );
}

