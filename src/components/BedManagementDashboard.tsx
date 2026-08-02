import React, { useState } from 'react';
import { 
  BedDouble, CheckCircle2, AlertCircle, Search, Filter, 
  ArrowRightLeft, MapPin, Activity, ShieldAlert, Wind, 
  Building, Hotel, DoorOpen, Users, Plus, LayoutDashboard,
  MenuSquare, HardDrive
} from 'lucide-react';
import { useHIS } from '../context/HISContext';
import { toast } from 'sonner';
import MasterBedRegistry from './MasterBedRegistry';

interface Props {
  language?: "ar" | "en";
  forceDepartmentId?: string;
  onClose?: () => void;
}

export default function BedManagementDashboard({ language: propLanguage, forceDepartmentId, onClose }: Props = {}) {
  const { language: contextLanguage, admissionRequests, patients, beds, setBeds, departments, updatePatient, logAudit } = useHIS();
  const language = propLanguage || contextLanguage || 'en';
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState<'overview' | 'wards' | 'allocation' | 'master_registry'>('overview');
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(forceDepartmentId || null);
  
  const stats = [
    { label: isAr ? "إجمالي الأسرة" : "Total Beds", value: beds.length.toString(), icon: BedDouble, color: "text-blue-600", bg: "bg-blue-100" },
    { label: isAr ? "الأسرة المشغولة" : "Occupied", value: beds.filter(b => b.status === 'occupied').length.toString(), icon: Users, color: "text-indigo-600", bg: "bg-indigo-100" },
    { label: isAr ? "الأسرة الشاغرة" : "Available", value: beds.filter(b => b.status === 'available').length.toString(), icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { label: isAr ? "تحت الصيانة/النظافة" : "Maintenance/Cleaning", value: beds.filter(b => b.status === 'cleaning' || b.status === 'maintenance').length.toString(), icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100" }
  ];

  const handleAssignBed = (patientId: string, bedId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const bed = beds.find(b => b.id === bedId);

    if (!patient || !bed) return;

    // STRICT VALIDATION: Department Match
    if (patient.departmentId && patient.departmentId !== bed.departmentId) {
      const patientDept = departments.find(d => d.id === patient.departmentId);
      const bedDept = departments.find(d => d.id === bed.departmentId);
      toast.error(isAr 
        ? `خطأ: المريض يتبع قسم (${patientDept?.nameAr || patient.departmentId}) ولا يمكن وضعه في سرير يتبع قسم (${bedDept?.nameAr || bed.departmentId})`
        : `Error: Patient is in ${patientDept?.nameEn || patient.departmentId} and cannot be assigned to a bed in ${bedDept?.nameEn || bed.departmentId}`
      );
      return;
    }

    // Process assignment
    updatePatient(patientId, { 
      bedId: bed.id, 
      status: 'ward',
      departmentId: bed.departmentId,
      currentClinicalLocation: `${bed.building || ''} - ${bed.floor || ''} - ${bed.roomNumber || ''}`
    });

    // Update bed status globally
    setBeds(prev => prev.map(b => b.id === bedId ? { ...b, status: 'occupied', patientId: patientId } : b));

    logAudit({
      action: 'BED_ASSIGNMENT',
      entityType: 'BED',
      entityId: bedId,
      reason: `Patient ${patient.nameEn} assigned to bed ${bed.bedNumber}`,
      newValue: { patientId, bedId }
    });

    toast.success(isAr ? "تم تخصيص السرير بنجاح" : "Bed assigned successfully");
  };

  // Real wards from departments
  const wards = departments.filter(d => d.type === 'clinical').map(dept => {
    const deptBeds = beds.filter(b => b.departmentId === dept.id);
    return {
      id: dept.id,
      name: dept.nameEn,
      nameAr: dept.nameAr,
      capacity: 30, // Default or calculated
      occupied: deptBeds.filter(b => b.status === 'occupied').length,
      type: "Ward"
    };
  });

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-4 shrink-0 shadow-sm z-10 flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
            <Hotel size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "إدارة الأسرة الذكية" : "Smart Bed Allocation"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "مراقبة الإشغال والتوزيع الذكي للأسرة" : "Occupancy Monitoring & Intelligent Allocation"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-6 custom-scrollbar space-y-4 sm:space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-2 sm:gap-4 flex-wrap ">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg sm:text-2xl font-black text-slate-800">{stat.value}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Workspace */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Tabs */}
          <div className="flex items-center gap-1 p-2 bg-slate-50 border-b border-slate-100 overflow-x-auto hide-scrollbar">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'overview' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <LayoutDashboard size={16} />
              {isAr ? "نظرة عامة" : "Overview"}
            </button>
            <button 
              onClick={() => setActiveTab('wards')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'wards' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <Building size={16} />
              {isAr ? "الأقسام (Wards)" : "Wards Layout"}
            </button>
            <button 
              onClick={() => setActiveTab('allocation')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'allocation' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <ArrowRightLeft size={16} />
              {isAr ? "التخصيص والتحويل" : "Allocation & Transfer"}
              <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full text-[10px]">14</span>
            </button>
            <button 
              onClick={() => setActiveTab('master_registry')}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'master_registry' ? 'bg-white text-indigo-700 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-slate-200/50'}`}
            >
              <HardDrive size={16} />
              {isAr ? "سجل الأسرة الرئيسي (Master Bed Index)" : "Master Bed Index"}
            </button>
          </div>

          <div className="p-0">
            {activeTab === 'overview' && (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-slate-800">{isAr ? "إشغال الأقسام" : "Ward Occupancy"}</h3>
                  <div className="flex items-center gap-2">
                    <ShieldAlert size={14} className="text-amber-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {isAr ? "نظام الربط الإلزامي مفعل" : "Strict Department Locking Active"}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {departments.filter(d => d.type === 'clinical').map(dept => {
                    const deptBeds = beds.filter(b => b.departmentId === dept.id);
                    const occupiedBeds = deptBeds.filter(b => b.status === 'occupied').length;
                    const capacity = deptBeds.length || 0;
                    const percentage = capacity > 0 ? Math.round((occupiedBeds / capacity) * 100) : 0;
                    
                    let statusColor = "bg-emerald-500";
                    if (percentage >= 90) statusColor = "bg-rose-500";
                    else if (percentage >= 80) statusColor = "bg-amber-500";

                    return (
                      <div key={dept.id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer bg-white group">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                              <Building size={16} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm">{isAr ? dept.nameAr : dept.nameEn}</h4>
                              <p className="text-[10px] text-slate-400 font-black uppercase">{dept.id}</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                            <span className="text-slate-400">{isAr ? "الإشغال:" : "Occupancy:"}</span>
                            <span className="text-slate-800">{occupiedBeds} / {capacity} ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div className={`${statusColor} h-full rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'wards' && (
              <div className="p-12 text-center text-slate-400">
                <DoorOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <h3 className="text-lg font-bold text-slate-700 mb-1">{isAr ? "مخطط الأقسام التفصيلي" : "Detailed Ward Layout"}</h3>
                <p className="text-sm">{isAr ? "عرض خريطة الأسرة لكل قسم" : "View visual bed map for each ward"}</p>
              </div>
            )}

            {activeTab === 'allocation' && (
              <div className="p-6 space-y-8">
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-800 uppercase tracking-tight">
                      {isAr ? "نظام التدقيق الإلزامي للأسرة" : "Mandatory Bed Validation System"}
                    </h4>
                    <p className="text-[10px] font-bold text-amber-600 uppercase">
                      {isAr ? "يمنع النظام آلياً أي محاولة لوضع مريض في قسم غير مطابق لقسمه المسجل." : "The system automatically blocks any attempt to place a patient in a non-matching department."}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Pending Requests */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                      {isAr ? "طلبات التنويم المعلقة" : "Pending Admission Requests"}
                    </h3>
                    {patients.filter(p => p.status === 'triage' || (p.status === 'waiting' && !p.bedId)).map(patient => {
                      const dept = departments.find(d => d.id === patient.departmentId);
                      return (
                        <div key={patient.id} className="p-4 bg-white border border-slate-200 rounded-2xl hover:border-indigo-400 transition-all group">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                                {patient.nameEn.substring(0, 2)}
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-800 hover:text-indigo-600 cursor-pointer transition" onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient.mrn || patient.id, patientName: isAr ? patient.nameAr : patient.nameEn } }))}>{isAr ? patient.nameAr : patient.nameEn}</h4>
                                <p className="text-[10px] font-bold text-slate-400 font-mono hover:text-indigo-600 cursor-pointer transition" onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient.mrn || patient.id, patientName: isAr ? patient.nameAr : patient.nameEn } }))}>{patient.mrn}</p>
                              </div>
                            </div>
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">
                              {dept ? (isAr ? dept.nameAr : dept.nameEn) : "No Dept"}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 mt-4">
                            {beds
                              .filter(b => b.status === 'available' && b.departmentId === patient.departmentId)
                              .slice(0, 2)
                              .map(bed => (
                                <button
                                  key={bed.id}
                                  onClick={() => handleAssignBed(patient.id, bed.id)}
                                  className="py-2 px-3 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-2"
                                >
                                  <BedDouble size={14} />
                                  {isAr ? "تخصيص " : "Assign "} {bed.bedNumber}
                                </button>
                              ))
                            }
                            {beds.filter(b => b.status === 'available' && b.departmentId === patient.departmentId).length === 0 && (
                              <p className="col-span-2 text-center text-[10px] font-bold text-rose-500 bg-rose-50 p-2 rounded-lg">
                                {isAr ? "لا توجد أسرة شاغرة في هذا القسم" : "No available beds in this department"}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bed Map Visualizer */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">
                      {isAr ? "نظرة سريعة على الأسرة" : "Bed Quick Map"}
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      {beds.map(bed => (
                        <div 
                          key={bed.id} 
                          className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${
                            bed.status === 'available' ? 'bg-white border-slate-100 text-slate-400' :
                            bed.status === 'occupied' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' :
                            'bg-slate-50 border-slate-100 text-slate-300'
                          }`}
                        >
                          <BedDouble size={16} />
                          <span className="text-[8px] font-black uppercase">{bed.bedNumber}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'master_registry' && (
              <div className="p-4">
                <MasterBedRegistry language={language} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
