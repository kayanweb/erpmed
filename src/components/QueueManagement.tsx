import React, { useState, useMemo } from "react";
import { 
  Users, UserCheck, UserPlus, Clock, 
  Play, CheckCircle2, XCircle, RefreshCcw,
  Monitor, LayoutGrid, Search, Filter,
  PhoneCall, Bell, Volume2, ArrowRight
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { motion, AnimatePresence } from "motion/react";

interface QueueManagementProps {
  language: "ar" | "en";
}

export default function QueueManagement({ language }: QueueManagementProps) {
  const { 
    queues = [], 
    patients = [], 
    departments = [],
    addToQueue,
    updateQueueStatus
  } = useHIS();
  
  const isAr = language === "ar";
  const [selectedDept, setSelectedDept] = useState<string>("ERD");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const deptQueues = useMemo(() => {
    return queues.filter(q => q.departmentId === selectedDept)
      .sort((a, b) => {
        // Priority first, then timestamp
        if (a.priority !== b.priority) return b.priority - a.priority;
        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      });
  }, [queues, selectedDept]);

  const stats = useMemo(() => {
    return {
      waiting: deptQueues.filter(q => q.status === 'waiting').length,
      calling: deptQueues.filter(q => q.status === 'calling').length,
      inConsultation: deptQueues.filter(q => q.status === 'in_consultation').length,
      finished: deptQueues.filter(q => q.status === 'finished').length,
    };
  }, [deptQueues]);

  const handleCallNext = () => {
    const next = deptQueues.find(q => q.status === 'waiting');
    if (next) {
      updateQueueStatus(next.id, 'calling');
      // In a real system, this would trigger the TV/Monitor voice call
      const patient = patients.find(p => p.id === next.patientId);
      const name = isAr ? patient?.nameAr : patient?.nameEn;
      toast.success(isAr ? `جاري مناداة المريض: ${name}` : `Calling patient: ${name}`);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-xl flex items-center justify-center">
            <Monitor size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{isAr ? 'نظام إدارة قوائم الانتظار' : 'Queue Management System (QMS)'}</h1>
            <p className="text-xs text-slate-500">{isAr ? 'مناداة المرضى، متابعة الانتظار، وتدفق الزيارات' : 'Call patients, monitor waiting times, and visit flow'}</p>
          </div>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold border border-slate-200 hover:bg-slate-200 transition-all">
            <Volume2 size={18} />
            {isAr ? 'اختبار الصوت' : 'Test Audio'}
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold shadow-md hover:bg-primary-700 transition-all">
            <Monitor size={18} />
            {isAr ? 'شاشة العرض' : 'Public Display View'}
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Departments */}
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-2 shrink-0 overflow-y-auto">
          <div className="px-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">{isAr ? 'الأقسام والعيادات' : 'Departments & Clinics'}</div>
          {departments.filter(d => d.type === 'clinical').map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                selectedDept === dept.id 
                  ? "bg-primary-50 text-primary-700 ring-1 ring-primary-100" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="truncate">{isAr ? dept.nameAr : dept.nameEn}</span>
              {queues.filter(q => q.departmentId === dept.id && q.status === 'waiting').length > 0 && (
                <span className="bg-primary-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {queues.filter(q => q.departmentId === dept.id && q.status === 'waiting').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden p-6 gap-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-4">
             {[
               { label: isAr ? 'في الانتظار' : 'Waiting', value: stats.waiting, color: 'text-orange-600', bg: 'bg-orange-50' },
               { label: isAr ? 'جاري المناداة' : 'Calling', value: stats.calling, color: 'text-blue-600', bg: 'bg-blue-50' },
               { label: isAr ? 'داخل الكشف' : 'In Consultation', value: stats.inConsultation, color: 'text-purple-600', bg: 'bg-purple-50' },
               { label: isAr ? 'انتهى اليوم' : 'Completed', value: stats.finished, color: 'text-green-600', bg: 'bg-green-50' },
             ].map((s, idx) => (
               <div key={idx} className={`p-4 rounded-2xl border border-slate-200 shadow-sm ${s.bg} flex flex-col gap-1`}>
                 <span className="text-[10px] font-black uppercase tracking-tight text-slate-500">{s.label}</span>
                 <span className={`text-2xl font-black ${s.color}`}>{s.value}</span>
               </div>
             ))}
          </div>

          {/* Controls & List */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
             <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div className="flex gap-2">
                 <button 
                  onClick={handleCallNext}
                  disabled={stats.waiting === 0}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-black shadow-lg hover:bg-primary-700 disabled:opacity-50 disabled:grayscale transition-all active:scale-95"
                 >
                   <PhoneCall size={18} />
                   {isAr ? 'مناداة المريض التالي' : 'Call Next Patient'}
                 </button>
                 <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
                   <RefreshCcw size={18} />
                 </button>
               </div>
               <div className="flex gap-2">
                 <select 
                   value={filterStatus}
                   onChange={(e) => setFilterStatus(e.target.value)}
                   className="text-xs font-bold bg-white border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-500"
                 >
                   <option value="all">{isAr ? 'الكل' : 'All Status'}</option>
                   <option value="waiting">{isAr ? 'انتظار' : 'Waiting'}</option>
                   <option value="calling">{isAr ? 'مناداة' : 'Calling'}</option>
                 </select>
               </div>
             </div>

             <div className="overflow-y-auto flex-1">
               <table className="w-full text-sm text-left border-collapse">
                 <thead className="bg-slate-50 sticky top-0 z-10">
                   <tr className="border-b border-slate-200">
                     <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'التذكرة' : 'Ticket'}</th>
                     <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'المريض' : 'Patient'}</th>
                     <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'الأولوية' : 'Priority'}</th>
                     <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'الوقت' : 'Time'}</th>
                     <th className="px-6 py-4 font-bold text-slate-900">{isAr ? 'الحالة' : 'Status'}</th>
                     <th className="px-6 py-4 font-bold text-slate-900 text-right">{isAr ? 'الإجراءات' : 'Actions'}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    <AnimatePresence initial={false}>
                      {deptQueues.filter(q => filterStatus === 'all' || q.status === filterStatus).map((entry) => {
                        const patient = patients.find(p => p.id === entry.patientId);
                        return (
                          <motion.tr 
                            layout
                            key={entry.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`hover:bg-slate-50 transition-colors group ${entry.status === 'calling' ? 'bg-blue-50/50' : ''}`}
                          >
                            <td className="px-6 py-4 font-mono font-black text-lg text-slate-900">
                              {entry.ticketNumber}
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-bold text-slate-900">{isAr ? patient?.nameAr : patient?.nameEn}</p>
                                <p className="text-[10px] text-slate-500">MRN: {patient?.mrn}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                 entry.priority === 3 ? 'bg-red-100 text-red-700 border border-red-200' :
                                 entry.priority === 2 ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                 'bg-slate-100 text-slate-600 border border-slate-200'
                               }`}>
                                 {entry.priority === 3 ? (isAr ? 'عاجل' : 'Urgent') : 
                                  entry.priority === 2 ? (isAr ? 'هام' : 'High') : 
                                  (isAr ? 'عادي' : 'Routine')}
                               </span>
                            </td>
                            <td className="px-6 py-4 text-xs font-medium text-slate-500">
                              {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-2">
                                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                                    entry.status === 'waiting' ? 'bg-orange-500' :
                                    entry.status === 'calling' ? 'bg-blue-500' :
                                    entry.status === 'in_consultation' ? 'bg-purple-500' :
                                    'bg-green-500'
                                  }`}></div>
                                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-600">{entry.status.replace('_', ' ')}</span>
                               </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <div className="flex justify-end gap-2">
                                  {entry.status === 'waiting' && (
                                    <button 
                                      onClick={() => updateQueueStatus(entry.id, 'calling')}
                                      className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                                      title={isAr ? 'مناداة' : 'Call'}
                                    >
                                      <PhoneCall size={16} />
                                    </button>
                                  )}
                                  {entry.status === 'calling' && (
                                    <button 
                                      onClick={() => updateQueueStatus(entry.id, 'in_consultation')}
                                      className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100"
                                      title={isAr ? 'بدء الكشف' : 'Start Consultation'}
                                    >
                                      <Play size={16} />
                                    </button>
                                  )}
                                  {entry.status === 'in_consultation' && (
                                    <button 
                                      onClick={() => updateQueueStatus(entry.id, 'finished')}
                                      className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                                      title={isAr ? 'إنهاء' : 'Finish'}
                                    >
                                      <CheckCircle2 size={16} />
                                    </button>
                                  )}
                                  <button 
                                    onClick={() => updateQueueStatus(entry.id, 'cancelled')}
                                    className="p-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-200"
                                    title={isAr ? 'إلغاء' : 'Cancel'}
                                  >
                                    <XCircle size={16} />
                                  </button>
                               </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { toast } from "sonner";
