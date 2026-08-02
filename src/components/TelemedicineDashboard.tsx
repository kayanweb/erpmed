import React, { useState } from 'react';
import { 
  Video, Calendar, Plus, Search, Users, Phone, Clock, 
  MoreHorizontal, VideoIcon, Mic, MicOff, Camera, PhoneOff, Settings
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Props {
  language: 'ar' | 'en';
}

const scheduleData = [
  { name: '08:00', value: 2 },
  { name: '10:00', value: 5 },
  { name: '12:00', value: 3 },
  { name: '14:00', value: 7 },
  { name: '16:00', value: 4 },
];

const DUMMY_SESSIONS = [
  { id: 1, patient: "Ahmed Ali", doctor: "Dr. Sarah", time: "10:30 AM", duration: "30 min", status: "In Progress", type: "Follow-up" },
  { id: 2, patient: "Mona Hassan", doctor: "Dr. Khaled", time: "01:00 PM", duration: "45 min", status: "Scheduled", type: "Initial Consult" },
  { id: 3, patient: "Omar Zayed", doctor: "Dr. Tarek", time: "02:30 PM", duration: "15 min", status: "Completed", type: "Prescription Refill" },
  { id: 4, patient: "Laila Samir", doctor: "Dr. Hoda", time: "04:00 PM", duration: "30 min", status: "Scheduled", type: "Test Results" },
];

export const TelemedicineDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-4 shrink-0 shadow-sm z-10 flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-blue-200">
            <Video size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "الطب الاتصالي (Telemedicine)" : "Telemedicine"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "إدارة الاستشارات المرئية والعيادات الافتراضية" : "Virtual Clinics & Video Consultations"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white text-[11px] font-black uppercase rounded-lg shadow-md hover:bg-blue-700 transition-all flex items-center gap-2">
            <Plus size={16} />
            {isAr ? "استشارة جديدة" : "New Consult"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Call Simulation Panel */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden lg:col-span-2 relative">
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
              <span className="bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded animate-pulse flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                {isAr ? "مباشر" : "LIVE"}
              </span>
              <span className="bg-black/50 text-white text-xs font-bold px-2 py-1 rounded backdrop-blur-md">
                10:24
              </span>
            </div>
            
            <div className="h-80 bg-slate-800 flex items-center justify-center relative">
              <Users size={64} className="text-slate-700" />
              <div className="absolute bottom-4 right-4 w-32 h-24 bg-slate-700 rounded-lg border-2 border-slate-600 overflow-hidden flex items-center justify-center shadow-lg">
                <Users size={32} className="text-slate-500" />
              </div>
            </div>
            
            <div className="p-4 bg-slate-900 flex justify-center items-center gap-4 border-t border-slate-800">
              <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors">
                <MicOff size={20} />
              </button>
              <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors">
                <VideoIcon size={20} />
              </button>
              <button className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center transition-colors shadow-lg shadow-rose-900/50">
                <PhoneOff size={24} />
              </button>
              <button className="w-12 h-12 rounded-full bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>

          {/* Schedule Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-blue-600" />
              {isAr ? "كثافة المواعيد اليوم" : "Today's Schedule Volume"}
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scheduleData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveTab('upcoming')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'upcoming' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                {isAr ? "القادمة" : "Upcoming"}
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-colors ${activeTab === 'history' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
              >
                {isAr ? "السجل" : "History"}
              </button>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
              <input 
                type="text"
                placeholder={isAr ? "بحث..." : "Search..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "المريض" : "Patient"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الطبيب" : "Doctor"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الوقت" : "Time"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "المدة" : "Duration"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "النوع" : "Type"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase text-center">{isAr ? "إجراء" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {DUMMY_SESSIONS.filter(s => activeTab === 'history' ? s.status === 'Completed' : s.status !== 'Completed').map(session => (
                  <tr key={session.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-800">{session.patient}</td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{session.doctor}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-slate-600">
                        <Clock size={14} className="text-slate-400" />
                        {session.time}
                      </div>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-500">{session.duration}</td>
                    <td className="p-4 text-sm font-medium text-slate-500">{session.type}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                        ${session.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                          session.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                        {session.status}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      {session.status !== 'Completed' && (
                        <button className="px-3 py-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold text-xs rounded-md transition-colors">
                          {isAr ? "انضمام" : "Join"}
                        </button>
                      )}
                      <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelemedicineDashboard;
