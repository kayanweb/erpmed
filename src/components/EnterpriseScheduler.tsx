import React, { useState, useMemo } from 'react';
import { useHIS } from '../context/HISContext';
import { Calendar, Search, Filter, Clock, Users, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnterpriseScheduler({ language }: { language: "ar" | "en" }) {
  const isAr = language === "ar";
  const { patients = [], departments = [] } = useHIS();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("ALL");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Generate 9 AM to 5 PM slots, 15 min intervals
  const slots = useMemo(() => {
    const list = [];
    let start = new Date(selectedDate + "T09:00:00");
    const end = new Date(selectedDate + "T17:00:00");
    while (start < end) {
      list.push(start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      start = new Date(start.getTime() + 15 * 60000);
    }
    return list;
  }, [selectedDate]);

  // Mock mapping patients to slots based on their ID hashes to make it deterministic
  const schedule = useMemo(() => {
    const mapped: any = {};
    slots.forEach(slot => { mapped[slot] = null; });
    
    // Distribute waiting/scheduled patients into slots
    const candidates = patients.filter(p => p.status === 'waiting' || p.status === 'scheduled');
    
    candidates.forEach((p, idx) => {
      const slotIdx = (p.id.charCodeAt(0) + idx) % slots.length;
      if (!mapped[slots[slotIdx]]) {
        mapped[slots[slotIdx]] = p;
      }
    });

    return slots.map(time => ({
      time,
      status: mapped[time] ? 'booked' : 'available',
      patient: mapped[time] || null
    }));
  }, [slots, patients]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
       <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex flex-1 items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200 max-w-xl w-full">
            <Search className="w-5 h-5 text-slate-400 ml-2" />
            <input 
               type="text" 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder={isAr ? "بحث..." : "Search..."} 
               className="bg-transparent border-none outline-none text-sm w-full" 
             />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none" />
            <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)} className="bg-white border border-slate-300 rounded-lg p-2 text-sm outline-none">
               <option value="ALL">All Departments</option>
               {departments.map(d => <option key={d.id} value={d.id}>{d.nameEn}</option>)}
            </select>
          </div>
       </div>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
         {schedule.filter(s => {
            if (!searchQuery) return true;
            return s.time.includes(searchQuery) || (s.patient && s.patient.nameEn.toLowerCase().includes(searchQuery.toLowerCase()));
         }).map((slot, idx) => (
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }} key={slot.time} className={`border rounded-xl p-4 transition-colors cursor-pointer ${slot.status === 'booked' ? 'bg-indigo-50 border-indigo-200' : 'bg-emerald-50 border-emerald-200'}`}>
             <div className="flex justify-between items-start mb-2">
               <span className="font-bold text-slate-800 text-sm font-mono">{slot.time}</span>
               <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${slot.status === 'available' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'}`}>
                 {slot.status === 'available' ? (isAr ? "متاح" : "Available") : (isAr ? "محجوز" : "Booked")}
               </span>
             </div>
             {slot.status === 'booked' && slot.patient ? (
                <div className="text-xs">
                  <p className="font-bold text-slate-900">{isAr ? slot.patient.nameAr : slot.patient.nameEn}</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">{slot.patient.mrn}</p>
                  <p className="text-[10px] text-indigo-600 font-bold mt-2 truncate">{slot.patient.departmentId || "General Clinic"}</p>
                </div>
             ) : (
                <button className="mt-2 w-full bg-white border border-emerald-200 text-emerald-700 text-[10px] font-bold py-2 rounded-lg hover:bg-emerald-50 transition shadow-sm">
                  {isAr ? "حجز موعد" : "Book Slot"}
                </button>
             )}
           </motion.div>
         ))}
       </div>
    </div>
  )
}
