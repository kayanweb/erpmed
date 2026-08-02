import React, { useState, useEffect } from 'react';
import { 
  UserPlus, UserMinus, ArrowRightLeft, Clock, Bed, ShieldAlert,
  Search, Filter, Plus, FileText, CheckCircle2, UserCheck, 
  UserX, Download, Printer, User, LayoutDashboard, History,
  Activity, MoreHorizontal, ArrowUpRight, ArrowDownRight,
  LogOut, BedDouble, AlertCircle, Check, X, ArrowRight, Eye
} from 'lucide-react';
import { useHIS } from '../context/HISContext';
import { toast } from 'sonner';
import BedManagementWorkflow from './BedManagementWorkflow';
import DirectAdmissionWorkflow from './DirectAdmissionWorkflow';
import InternalTransferWorkflow from './InternalTransferWorkflow';
import DischargeWorkflow from './DischargeWorkflow';
import { motion, AnimatePresence } from 'framer-motion';
import { Patient } from '../types';

interface Props {
  language: 'ar' | 'en';
}

const AdmissionCenterDashboard = ({ language }: Props) => {
  const isAr = language === 'ar';
  const { patients, updatePatient, updatePatientStatus, departments, beds, setBeds, currentUser, logAudit, setActivePatient } = useHIS();
  
  const [activeTab, setActiveTab] = useState<'pending' | 'admitted' | 'discharges' | 'transfers'>('pending');
  const [searchQuery, setSearchQuery] = useState("");
  const [showBedWorkflow, setShowBedWorkflow] = useState<Patient | null>(null);
  const [showDirectAdmission, setShowDirectAdmission] = useState(false);
  const [showTransferWorkflow, setShowTransferWorkflow] = useState<Patient | null>(null);
  const [showDischargeWorkflow, setShowDischargeWorkflow] = useState<Patient | null>(null);
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedBed, setSelectedBed] = useState("");

  const handleBedAssignment = (patient: Patient) => {
    setShowBedWorkflow(patient);
  };

  const stats = [
    { label: isAr ? "تنويم معلق" : "Pending Admissions", value: patients.filter(p => p.status === 'triage' || p.status === 'waiting' || p.status === 'er_waiting_admission').length.toString(), change: "+2", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { label: isAr ? "أسرة مشغولة" : "Occupied Beds", value: beds.filter(b => b.status === 'occupied').length.toString(), change: "82%", icon: Bed, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: isAr ? "خروج اليوم" : "Today's Discharges", value: "27", change: "-4", icon: UserMinus, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: isAr ? "تحويلات نشطة" : "Active Transfers", value: "8", change: "+1", icon: ArrowRightLeft, color: "text-blue-600", bg: "bg-blue-100" },
  ];

  const pendingAdmissions = patients.filter(p => p.status === 'triage' || p.status === 'waiting' || p.status === 'er_waiting_admission');
  const admittedPatients = patients.filter(p => p.status === 'ward');

  const handleDirectAdmission = () => {
    setShowDirectAdmission(true);
  };

  const handleFinalizeDischarge = (patient: any) => {
    updatePatientStatus(patient.id, 'discharged');
    toast.success(isAr ? `تم إكمال خروج المريض ${patient.nameAr}` : `Discharge finalized for ${patient.nameEn}`);
    
    logAudit({
      action: 'DISCHARGE_FINALIZED',
      entityType: 'ADMISSION',
      entityId: patient.id,
      reason: 'Administrative clearance completed',
      newValue: { status: 'discharged' }
    });
  };

  const handleOpenTransfer = () => {
    setActiveTab('transfers');
    toast.info(isAr ? "تم فتح سجل التحويلات" : "Transfer log opened");
  };

  const handleAssignBed = (patient: any) => {
    if (!selectedBed) {
      toast.error(isAr ? "يرجى اختيار سرير أولاً" : "Please select a bed first");
      return;
    }
    // We'll rely on the Signature Panel to finalize
    toast.info(isAr ? "يرجى التوقيع لإتمام العملية" : "Please sign to finalize the process");
  };

  const dischargeCandidates = patients.filter(p => p.status === 'ward').slice(0, 5).map((p, i) => ({
    ...p,
    dischargeOrder: "Today, 09:00 AM",
    clearance: i % 2 === 0 ? "Pending" : "Cleared",
    pharmacy: i % 3 === 0 ? "Pending" : "Cleared"
  }));

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 shrink-0 shadow-sm z-[5] flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
            <UserPlus size={20} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tight truncate">
              {isAr ? "مركز القبول والخروج والتحويل" : "Admissions & Census Management"}
            </h1>
            <p className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">
              {isAr ? "نظام إدارة حركة المرضى - النسخة المؤسسية" : "Patient Flow Control System - Enterprise Edition"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-none min-w-[150px]">
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-3' : 'left-3'}`} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "بحث..." : "Search..."}
              className={`w-full sm:w-48 xl:w-64 ${isAr ? 'pr-9' : 'pl-9'} py-2 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 font-bold`}
            />
          </div>
          <button 
            onClick={handleDirectAdmission}
            className="flex-1 sm:flex-none justify-center px-4 py-2 bg-indigo-600 text-white text-[10px] sm:text-xs font-black uppercase rounded-lg shadow-md hover:bg-indigo-700 transition-all flex items-center gap-2 active:scale-95 whitespace-nowrap"
          >
            <Plus size={16} />
            {isAr ? "تنويم مباشر" : "Direct Admission"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar space-y-4 sm:space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 flex-wrap  group hover:border-indigo-300 transition-all">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline justify-between">
                  <span className="text-lg sm:text-2xl font-black text-slate-800">{stat.value}</span>
                  <div className={`flex items-center text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {stat.change.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('pending')}
              className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'pending' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <Clock size={14} />
              {isAr ? "الطلبات المعلقة" : "Pending Queue"}
              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px] ml-1">14</span>
            </button>
            <button 
              onClick={() => setActiveTab('admitted')}
              className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'admitted' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <UserCheck size={14} />
              {isAr ? "توزيع الأسرة" : "Bed Census"}
            </button>
            <button 
              onClick={() => setActiveTab('discharges')}
              className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'discharges' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <LogOut size={14} />
              {isAr ? "إدارة الخروج" : "Discharge Hub"}
              <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full text-[10px] ml-1">27</span>
            </button>
            <button 
              onClick={() => setActiveTab('transfers')}
              className={`px-4 py-2 text-xs font-black uppercase rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'transfers' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <ArrowRightLeft size={14} />
              {isAr ? "حركة المرضى" : "Internal Transfers"}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1">
            {activeTab === 'pending' && (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 border-b border-slate-100">
                      <th className={`p-4 font-black ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "رقم الطلب" : "Request #"}</th>
                      <th className={`p-4 font-black ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "بيانات المريض" : "Patient Details"}</th>
                      <th className={`p-4 font-black ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الطبيب الطالب / القسم" : "Requesting MD / Dept"}</th>
                      <th className={`p-4 font-black ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "سبب التنويم" : "Admission Reason"}</th>
                      <th className={`p-4 font-black ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الأولوية" : "Priority"}</th>
                      <th className={`p-4 font-black ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? "الإجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {pendingAdmissions.map((req, i) => {
                      const dept = departments.find(d => d.id === req.departmentId);
                      const adReq = req.clinicalData?.admissionRequest;
                      return (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono font-bold text-slate-400 text-xs">
                            {adReq?.requestId || `REQ-${req.id.slice(0,6)}`}
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-slate-800 cursor-pointer hover:text-indigo-600 transition-colors"
                              onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: req.id, patientName: isAr ? req.nameAr : req.nameEn, initialTab: "summary" } }))}
                            >
                              {isAr ? req.nameAr : req.nameEn}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-mono text-slate-400">MRN: {req.mrn}</span>
                              <span className="text-[10px] text-slate-300">•</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">{req.gender} ({req.age})</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-xs font-bold text-slate-700 mb-0.5">{adReq?.requestingDoctorName || (isAr ? "د. مناوب" : "On-call Physician")}</div>
                            <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-indigo-500">
                               <ArrowDownRight size={10} />
                               {adReq?.requestedDeptName || (dept ? (isAr ? dept.nameAr : dept.nameEn) : "General Medicine")}
                            </div>
                          </td>
                          <td className="p-4 max-w-[200px]">
                            <p className="text-[10px] font-bold text-slate-600 leading-tight truncate-2-lines">
                              {adReq?.reason || (isAr ? "تنويم عاجل للتقييم" : "Urgent admission for clinical evaluation")}
                            </p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase border ${
                                (adReq?.priority === 'stat' || req.clinicalData?.esiLevel <= 2)
                                ? 'bg-rose-50 text-rose-700 border-rose-100'
                                : 'bg-amber-50 text-amber-700 border-amber-100'
                            }`}>
                              {adReq?.priority || (req.clinicalData?.esiLevel <= 2 ? "Stat" : "Urgent")}
                            </span>
                          </td>
                          <td className="p-4 flex items-center gap-2">
                            <button 
                              onClick={() => handleBedAssignment(req)}
                              className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-black text-[10px] uppercase rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-2"
                            >
                              <Bed size={12} />
                              {isAr ? "تخصيص السرير" : "Assign Bed"}
                            </button>
                            <button 
                              onClick={() => {
                                setActivePatient(req);
                                toast.info(isAr ? "فتح ملف المريض الشامل..." : "Opening 360 view...");
                              }}
                              className="p-2 bg-slate-100 text-slate-400 hover:bg-slate-200 rounded-lg transition-all"
                              title={isAr ? "نظرة 360 درجة" : "Patient 360"}
                            >
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'admitted' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                    <h3 className="font-black text-slate-800 uppercase tracking-tight">{isAr ? "تعداد المرضى وتوزيع الأسرة" : "Current Census & Bed Map"}</h3>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> {isAr ? "متاح" : "Vacant"}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> {isAr ? "مشغول" : "Occupied"}</span>
                      <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500"><div className="w-2 h-2 rounded-full bg-amber-500"></div> {isAr ? "تجهيز" : "Cleaning"}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 min-w-max">
                    <button className="p-2 bg-slate-100 rounded-lg text-slate-600"><Filter size={14} /></button>
                    <button className="p-2 bg-slate-100 rounded-lg text-slate-600"><Printer size={14} /></button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                  {Array.from({ length: 48 }).map((_, i) => {
                    const isOccupied = i % 3 !== 0;
                    const patient = admittedPatients[i % (admittedPatients.length || 1)];
                    return (
                      <div key={i} className={`p-3 rounded-xl border transition-all flex flex-col justify-between h-24 ${
                        isOccupied 
                          ? 'bg-white border-indigo-100 shadow-sm hover:border-indigo-300' 
                          : i % 10 === 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}>
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-black text-slate-400">B-{100 + i}</span>
                          {isOccupied && <ShieldAlert size={12} className="text-indigo-400" />}
                        </div>
                        {isOccupied ? (
                          <div>
                            <div className="text-[10px] font-black text-slate-800 truncate leading-tight uppercase tracking-tighter">
                              {isAr ? patient?.nameAr : patient?.nameEn}
                            </div>
                            <div className="text-[8px] font-bold text-indigo-500 mt-1 uppercase">Intern. Med</div>
                          </div>
                        ) : i % 10 === 0 ? (
                          <div className="text-[8px] font-black text-amber-600 uppercase flex items-center gap-1">
                            <Activity size={10} /> HOUSEKEEPING
                          </div>
                        ) : (
                          <div className="text-[10px] font-black text-slate-300 uppercase">Vacant</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'discharges' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">{isAr ? "أوامر الخروج المعلقة" : "Pending Discharge Clearance"}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-500">{isAr ? "تمت التصفية:" : "Cleared Today:"} 18</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {dischargeCandidates.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-4 flex-wrap  bg-white p-4 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all group">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all font-black">
                        {p.nameEn?.charAt(0)}
                      </div>
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
                        <div>
                          <div className="font-bold text-slate-800">{isAr ? p.nameAr : p.nameEn}</div>
                          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-tighter">Room: 302B • MRN: {p.mrn}</div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isAr ? "أمر الخروج" : "Discharge Order"}</div>
                          <div className="text-[10px] font-black text-slate-700 flex items-center gap-1">
                            <Clock size={12} className="text-indigo-500" /> {p.dischargeOrder}
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isAr ? "التأمين" : "Finance"}</div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${p.clearance === 'Cleared' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                              {p.clearance}
                            </span>
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">{isAr ? "الصيدلية" : "Pharmacy"}</div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${p.pharmacy === 'Cleared' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                              {p.pharmacy}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <button 
                            onClick={() => handleFinalizeDischarge(p)}
                            className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-[10px] font-black uppercase shadow-sm active:scale-95 transition-all"
                          >
                            {isAr ? "تنفيذ الخروج" : "Finalize Discharge"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'transfers' && (
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">{isAr ? "إدارة تحركات المرضى واللوجستيات" : "Patient Transfer & Logistics Hub"}</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{isAr ? "تتبع التحويلات النشطة والطلبات المعلقة" : "Track active transfers and pending requests"}</p>
                  </div>
                  <button 
                    onClick={() => setShowTransferWorkflow({ id: 'new' } as any)}
                    className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <Plus size={16} />
                    {isAr ? "طلب تحويل جديد" : "New Transfer Request"}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {patients.filter(p => p.status === 'ward').slice(0, 3).map((p, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          <User size={20} />
                        </div>
                        <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded uppercase tracking-tighter">In Progress</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mb-1">{isAr ? p.nameAr : p.nameEn}</h4>
                      <p className="text-[10px] font-mono text-slate-400 mb-4 tracking-tighter">MRN: {p.mrn}</p>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex-1 bg-slate-100 rounded-lg p-2 text-center">
                          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Source</div>
                          <div className="text-[10px] font-bold text-slate-700 truncate">{p.currentClinicalLocation?.split('-')[0] || 'ER'}</div>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 shrink-0 rtl:rotate-180" />
                        <div className="flex-1 bg-indigo-50 rounded-lg p-2 text-center border border-indigo-100">
                          <div className="text-[8px] font-black text-indigo-400 uppercase tracking-widest">Destination</div>
                          <div className="text-[10px] font-bold text-indigo-700 truncate">ICU - Unit A</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold uppercase">
                          <Clock size={12} />
                          Est: 15m
                        </div>
                        <button 
                          onClick={() => setShowTransferWorkflow(p)}
                          className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {patients.filter(p => p.status === 'ward').length === 0 && (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12">
                     <ArrowRightLeft size={48} className="opacity-20 mb-4" />
                     <p className="text-sm font-medium">{isAr ? "لا توجد تحويلات نشطة حالياً" : "No active transfers currently"}</p>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bed Assignment Workflow Overlay */}
      <AnimatePresence>
        {showBedWorkflow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full h-full sm:h-[90vh] sm:max-w-6xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                 <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                   {isAr ? "نظام إدارة توزيع الأسرة والقبول" : "Bed Management & Admission Workflow"}
                 </h2>
                 <button onClick={() => setShowBedWorkflow(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X size={20} className="text-slate-400" />
                 </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <BedManagementWorkflow 
                  patient={showBedWorkflow} 
                  onClose={() => setShowBedWorkflow(null)} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Direct Admission Workflow Overlay */}
      <AnimatePresence>
        {showDirectAdmission && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full h-full sm:h-[90vh] sm:max-w-4xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                 <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                   {isAr ? "إدخال تنويم مباشر جديد" : "New Direct Admission Entry"}
                 </h2>
                 <button onClick={() => setShowDirectAdmission(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X size={20} className="text-slate-400" />
                 </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <DirectAdmissionWorkflow 
                  onClose={() => setShowDirectAdmission(false)} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Internal Transfer Workflow Overlay */}
      <AnimatePresence>
        {showTransferWorkflow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[120] flex items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full h-full sm:h-[90vh] sm:max-w-5xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                 <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                   {isAr ? "نظام إدارة تحركات المرضى الداخلية" : "Internal Patient Transfer Logistics"}
                 </h2>
                 <button onClick={() => setShowTransferWorkflow(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X size={20} className="text-slate-400" />
                 </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <InternalTransferWorkflow 
                  patient={showTransferWorkflow.id === 'new' ? undefined : showTransferWorkflow} 
                  onClose={() => setShowTransferWorkflow(null)} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Discharge Workflow Overlay */}
      <AnimatePresence>
        {showDischargeWorkflow && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[130] flex items-center justify-center p-0 sm:p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white w-full h-full sm:h-[90vh] sm:max-w-5xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                 <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                   {isAr ? "نظام إدارة خروج المرضى الموحد" : "Unified Patient Discharge Management"}
                 </h2>
                 <button onClick={() => setShowDischargeWorkflow(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                   <X size={20} className="text-slate-400" />
                 </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <DischargeWorkflow 
                  patient={showDischargeWorkflow} 
                  onClose={() => setShowDischargeWorkflow(null)} 
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdmissionCenterDashboard;
