import React, { useState, useEffect } from 'react';
import { Stethoscope, Calendar, Clock, Activity, FileText, CheckCircle2, ChevronRight, User, Bed, Phone, AlertCircle } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';
import { motion, AnimatePresence } from 'motion/react';
import { useHIS } from '../context/HISContext';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  time: string;
  type: 'Follow-up' | 'Consultation' | 'Procedure';
  status: 'Scheduled' | 'Arrived' | 'Completed';
}

interface DoctorTask {
  id: string;
  patientName: string;
  task: string;
  priority: 'High' | 'Normal';
  status: 'Pending' | 'Done';
}

export default function DoctorPortalDashboard({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';
  const { currentUser } = useHIS();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [tasks, setTasks] = useState<DoctorTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const appts = await firestoreService.getAll<Appointment>('doctor_appointments');
      const tsks = await firestoreService.getAll<DoctorTask>('doctor_tasks');
      
      if (appts.length === 0) {
        const defaultAppts: Omit<Appointment, 'id'>[] = [
          { patientName: 'Ahmed Ali', patientId: 'MRN-2026-0012', time: '09:00 AM', type: 'Consultation', status: 'Arrived' },
          { patientName: 'Sarah Smith', patientId: 'MRN-2026-0142', time: '10:30 AM', type: 'Follow-up', status: 'Scheduled' },
          { patientName: 'Mohammad Khan', patientId: 'MRN-2026-0881', time: '11:15 AM', type: 'Procedure', status: 'Scheduled' },
        ];
        for (const a of defaultAppts) await firestoreService.add('doctor_appointments', a);
        setAppointments(await firestoreService.getAll<Appointment>('doctor_appointments'));
      } else {
        setAppointments(appts);
      }

      if (tsks.length === 0) {
        const defaultTasks: Omit<DoctorTask, 'id'>[] = [
          { patientName: 'Ahmed Ali', task: 'Review latest CBC results', priority: 'High', status: 'Pending' },
          { patientName: 'Fatima Z.', task: 'Sign discharge summary', priority: 'Normal', status: 'Pending' },
        ];
        for (const t of defaultTasks) await firestoreService.add('doctor_tasks', t);
        setTasks(await firestoreService.getAll<DoctorTask>('doctor_tasks'));
      } else {
        setTasks(tsks);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const markTaskDone = async (id: string) => {
    try {
      await firestoreService.update('doctor_tasks', id, { status: 'Done' });
      await fetchData();
    } catch (e) {}
  };

  const updateApptStatus = async (id: string, newStatus: Appointment['status']) => {
    try {
      await firestoreService.update('doctor_appointments', id, { status: newStatus });
      await fetchData();
    } catch (e) {}
  };

  return (
    <div className="h-full flex flex-col bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6 sm:p-8 flex justify-between items-center z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center">
            <Stethoscope className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{isAr ? 'مرحباً، د.' : 'Welcome, Dr.'} {currentUser?.name.split(' ')[isAr ? 1 : 0] || 'Doctor'}</h1>
            <p className="text-slate-500 font-medium mt-1">{isAr ? 'جدولك ومهامك اليومية' : 'Your daily schedule & pending tasks'}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          
          {/* Main Schedule */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-end">
              <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                {isAr ? 'مواعيد اليوم' : 'Today\'s Schedule'}
              </h2>
              <span className="text-sm font-bold text-slate-500">{new Date().toLocaleDateString(isAr ? 'ar-SA' : 'en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>

            <div className="space-y-4">
              {appointments.map((appt) => (
                <div key={appt.id} className="bg-white border border-slate-200 p-6 rounded-[24px] shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
                  <div className="text-center min-w-[80px]">
                    <div className="text-lg font-black text-indigo-900">{appt.time.split(' ')[0]}</div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{appt.time.split(' ')[1]}</div>
                  </div>
                  
                  <div className="w-px h-12 bg-slate-200 hidden sm:block" />
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-black text-slate-800">{appt.patientName}</h3>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        appt.status === 'Arrived' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        appt.status === 'Completed' ? 'bg-slate-100 text-slate-600 border border-slate-200' :
                        'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {appt.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><User className="w-4 h-4" /> {appt.patientId}</span>
                      <span className="flex items-center gap-1"><Activity className="w-4 h-4" /> {appt.type}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {appt.status === 'Arrived' && (
                       <button 
                         onClick={() => updateApptStatus(appt.id, 'Completed')}
                         className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-600 flex items-center justify-center transition-colors border border-emerald-200"
                         title={isAr ? "إنهاء الموعد" : "Complete"}
                       >
                         <CheckCircle2 className="w-5 h-5" />
                       </button>
                    )}
                    <button className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 text-indigo-600 flex items-center justify-center transition-colors border border-slate-200">
                      <ChevronRight className={`w-5 h-5 ${isAr ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar (Tasks & Inpatients) */}
          <div className="space-y-8">
            
            {/* Tasks */}
            <div className="bg-white border border-slate-200 rounded-[24px] shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-200 p-5 flex items-center gap-2">
                <FileText className="w-5 h-5 text-rose-500" />
                <h3 className="font-black text-slate-800">{isAr ? 'مهام معلقة' : 'Pending Tasks'}</h3>
                <span className="ml-auto bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-xs font-bold">{tasks.filter(t => t.status === 'Pending').length}</span>
              </div>
              <div className="p-4 space-y-3">
                {tasks.filter(t => t.status === 'Pending').map(task => (
                  <div key={task.id} className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex gap-3">
                    <button onClick={() => markTaskDone(task.id)} className="mt-0.5 text-slate-300 hover:text-emerald-500 transition-colors">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`w-2 h-2 rounded-full ${task.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{task.priority} Priority</span>
                      </div>
                      <p className="text-sm font-bold text-slate-800 mb-1">{task.task}</p>
                      <p className="text-xs font-medium text-slate-500">{task.patientName}</p>
                    </div>
                  </div>
                ))}
                {tasks.filter(t => t.status === 'Pending').length === 0 && (
                  <div className="text-center py-6 text-slate-400 text-sm font-bold">
                    {isAr ? 'لا توجد مهام معلقة' : 'No pending tasks'}
                  </div>
                )}
              </div>
            </div>

            {/* Inpatients Snippet */}
            <div className="bg-indigo-900 border border-indigo-800 rounded-[24px] shadow-sm overflow-hidden text-white flex flex-col relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
              <div className="p-6 relative z-10">
                <h3 className="font-black text-lg mb-1 flex items-center gap-2">
                  <Bed className="w-5 h-5 text-indigo-400" />
                  {isAr ? 'مرضى التنويم' : 'My Inpatients'}
                </h3>
                <p className="text-indigo-300 text-xs font-medium mb-6">4 {isAr ? 'مرضى تحت إشرافك' : 'patients under your care'}</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-indigo-950/50 p-3 rounded-xl border border-indigo-800/50">
                    <div>
                      <p className="font-bold text-sm">Hassan Saeed</p>
                      <p className="text-xs text-indigo-400">ICU Bed 4 • Post-op Day 2</p>
                    </div>
                    <AlertCircle className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex justify-between items-center bg-indigo-950/50 p-3 rounded-xl border border-indigo-800/50">
                    <div>
                      <p className="font-bold text-sm">Laila Mahmoud</p>
                      <p className="text-xs text-indigo-400">Ward A, Room 102</p>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm py-3 rounded-xl transition-colors">
                  {isAr ? 'فتح لوحة التنويم' : 'Open Inpatient Board'}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
