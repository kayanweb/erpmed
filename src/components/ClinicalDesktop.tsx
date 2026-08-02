import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  User, 
  Calendar, 
  ArrowRight,
  ChevronLeft,
  Activity,
  FileText,
  Stethoscope,
  ClipboardList,
  Clock,
  TestTube,
  Pill,
  CreditCard,
  Building,
  BedDouble
} from "lucide-react";
import { Patient, AppUser } from "../types";
import { syncPatients } from "../lib/workflowService";
import { TaskCenter } from "./TaskCenter";

interface Props {
  currentUser: AppUser;
  onPatientSelect?: (patientId: string, patientName: string) => void;
}

export const ClinicalDesktop: React.FC<Props> = ({ currentUser, onPatientSelect }) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = syncPatients(setPatients);
    return () => unsubscribe();
  }, []);

  const filteredPatients = patients.filter(p => 
    p.nameAr?.includes(searchTerm) || 
    p.mrn?.includes(searchTerm) || 
    p.nameEn?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="p-8 w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-indigo-600"></div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Clinical Desktop</h2>
              <p className="text-slate-500 font-medium mt-2 max-w-xl leading-relaxed">
                Comprehensive patient management hub. Search or select a patient to access full electronic medical records, interconnected entities, billing, and timelines.
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Search by MRN, Name, ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl shadow-sm focus:border-indigo-500 transition-all outline-none font-bold text-slate-700 focus:bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatients.map(patient => (
              <button 
                key={patient.id}
                onClick={() => onPatientSelect?.(patient.id, patient.nameEn)}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-400 transition-all text-left group flex flex-col items-start gap-4 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:bg-indigo-50" />
                
                <div className="flex w-full justify-between items-start relative z-10">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                    <User className="w-7 h-7" />
                  </div>
                  <div className="px-3 py-1 bg-slate-100 rounded-full border border-slate-200 text-[10px] font-black text-slate-500 uppercase">
                    {patient.currentWorkflowStage?.replace("_", " ") ?? ""}
                  </div>
                </div>
                
                <div className="relative z-10 w-full mt-2">
                  <h4 className="font-black text-slate-900 text-lg leading-tight truncate">{patient.nameAr}</h4>
                  <p className="text-slate-400 font-mono text-xs mt-1 uppercase tracking-widest">{patient.nameEn}</p>
                  <div className="flex gap-2 items-center mt-3 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">MRN</span>
                    <span className="text-xs font-black text-slate-700">{patient.mrn}</span>
                  </div>
                </div>
              </button>
            ))}
            
            {filteredPatients.length === 0 && (
              <div className="col-span-full py-20 text-center space-y-4 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-sm">
                 <Users className="w-12 h-12 text-slate-300 mx-auto" />
                 <p className="text-slate-500 font-bold">No patients found matching your search.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 h-[calc(100vh-8rem)] sticky top-6">
          <TaskCenter userRole={currentUser.role} userId={currentUser.id} />
        </div>
      </div>
    </div>
  );
};

