import React, { useState } from 'react';
import { 
  Settings, Building2, Bed as BedIcon, Plus, 
  Trash2, Edit3, Save, ShieldAlert, CheckCircle2,
  Stethoscope, Users, LayoutDashboard, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useHIS, HISDepartment, HISClinic } from '../context/HISContext';
import { HospitalBed as Bed } from '../types';
import { toast } from 'sonner';

export const HISInfrastructureAdmin: React.FC<{ language: 'ar' | 'en' }> = ({ language }) => {
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [editDeptData, setEditDeptData] = useState<Partial<HISDepartment>>({});
  const isAr = language === 'ar';
  const { departments, setDepartments, beds, setBeds, clinics, setClinics, auditLogs } = useHIS();
  const [activeTab, setActiveTab] = useState<'depts' | 'beds' | 'clinics' | 'audit'>('depts');

  // Local state for forms
  const [newDept, setNewDept] = useState<Partial<HISDepartment>>({ type: 'clinical' });
  const [newBed, setNewBed] = useState<Partial<Bed>>({ 
    status: 'available',
    isolationType: 'none',
    genderRestriction: 'none'
  });
  const [newClinic, setNewClinic] = useState<Partial<HISClinic>>({});

  const handleAddDept = () => {
    if (!newDept.nameEn || !newDept.nameAr) return;
    const dept: HISDepartment = {
      id: `dept-${Date.now()}`,
      nameEn: newDept.nameEn!,
      nameAr: newDept.nameAr!,
      type: newDept.type as any || 'clinical',
      building: newDept.building || "",
      floor: newDept.floor || "",
      manager: newDept.manager || ""
    };
    setDepartments([...departments, dept]);
    setNewDept({ type: 'clinical' });
    toast.success(isAr ? "تمت إضافة القسم" : "Department added");
  };

  const handleAddBed = () => {
    if (!newBed.bedNumber || !newBed.departmentId) return;
    const bed: Bed = {
      id: `bed-${Date.now()}`,
      bedNumber: newBed.bedNumber!,
      hospitalId: "HOSP-01",
      departmentId: newBed.departmentId!,
      wardId: newBed.wardId || "",
      roomId: newBed.roomId || "",
      building: newBed.building || "",
      floor: newBed.floor || "",
      status: 'available',
      roomNumber: newBed.roomNumber || "",
      isolationType: (newBed.isolationType as any) || 'none',
      genderRestriction: (newBed.genderRestriction as any) || 'none',
      specialty: newBed.specialty || "",
      equipment: newBed.equipment || [],
      isActive: true,
      hasMonitor: false,
      hasVentilator: false,
      equipmentList: [],
      createdAt: new Date().toISOString()
    };
    setBeds([...beds, bed]);
    setNewBed({ 
      status: 'available',
      isolationType: 'none',
      genderRestriction: 'none'
    });
    toast.success(isAr ? "تمت إضافة السرير" : "Bed added");
  };

  const handleAddClinic = () => {
    if (!newClinic.nameEn || !newClinic.nameAr || !newClinic.departmentId) return;
    const clinic: HISClinic = {
      id: `clinic-${Date.now()}`,
      nameEn: newClinic.nameEn!,
      nameAr: newClinic.nameAr!,
      departmentId: newClinic.departmentId!,
      location: newClinic.location || ""
    };
    setClinics([...clinics, clinic]);
    setNewClinic({});
    toast.success(isAr ? "تمت إضافة العيادة" : "Clinic added");
  };

  const deleteBed = (id: string) => {
    setBeds(beds.filter(b => b.id !== id));
  };

  const deleteDept = (id: string) => {
    setDepartments(departments.filter(d => d.id !== id));
  };

  const deleteClinic = (id: string) => {
    setClinics(clinics.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-[32px] overflow-hidden border border-slate-200" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center text-slate-800">
            <Database size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800">
              {isAr ? "إدارة البنية التحتية للمستشفى" : "Hospital Infrastructure Admin"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {isAr ? "تكوين الأقسام والأسرة والعيادات" : "Configure Departments, Beds, and Clinics"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 bg-slate-100 m-6 rounded-2xl w-fit">
        {[
          { id: 'depts', label: isAr ? "الأقسام" : "Departments", icon: Building2 },
          { id: 'beds', label: isAr ? "الأسرة" : "Beds", icon: BedIcon },
          { id: 'clinics', label: isAr ? "العيادات" : "Clinics", icon: Stethoscope },
          { id: 'audit', label: isAr ? "سجل التدقيق" : "Audit Trail", icon: ShieldAlert }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto p-8">
        <AnimatePresence mode="wait">
          {activeTab === 'depts' && (
            <motion.div
              key="depts"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Add Dept Form */}
              <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">Dept Name (En)</label>
                  <input
                    type="text"
                    value={newDept.nameEn || ""}
                    onChange={e => setNewDept({...newDept, nameEn: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">اسم القسم (عربي)</label>
                  <input
                    type="text"
                    value={newDept.nameAr || ""}
                    onChange={e => setNewDept({...newDept, nameAr: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">Type</label>
                  <select
                    value={newDept.type}
                    onChange={e => setNewDept({...newDept, type: e.target.value as any})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="clinical">Clinical</option>
                    <option value="administrative">Administrative</option>
                    <option value="support">Support</option>
                  </select>
                </div>
                <button
                  onClick={handleAddDept}
                  className="h-12 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> {isAr ? "إضافة قسم" : "Add Dept"}
                </button>
              </div>

              {/* List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departments.map(dept => (
                  <div key={dept.id} className="p-6 bg-white border border-slate-200 rounded-3xl hover:shadow-xl transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <Building2 size={20} />
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingDeptId === dept.id ? (
                          <button onClick={() => {
                            setDepartments(departments.map(d => d.id === dept.id ? { ...d, ...editDeptData } : d));
                            setEditingDeptId(null);
                            toast.success(isAr ? "تم تعديل القسم" : "Department updated");
                          }} className="text-emerald-500 hover:text-emerald-600 transition-colors">
                            <Save size={16} />
                          </button>
                        ) : (
                          <button onClick={() => {
                            setEditingDeptId(dept.id);
                            setEditDeptData(dept);
                          }} className="text-slate-300 hover:text-indigo-500 transition-colors">
                            <Edit3 size={16} />
                          </button>
                        )}
                        <button onClick={() => deleteDept(dept.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    {editingDeptId === dept.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editDeptData.nameEn || ""}
                          onChange={e => setEditDeptData({...editDeptData, nameEn: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded text-sm font-bold"
                          placeholder="English Name"
                        />
                        <input
                          type="text"
                          value={editDeptData.nameAr || ""}
                          onChange={e => setEditDeptData({...editDeptData, nameAr: e.target.value})}
                          className="w-full p-2 border border-slate-200 rounded text-sm font-bold text-right"
                          placeholder="Arabic Name"
                        />
                      </div>
                    ) : (
                      <>
                        <h3 className="font-black text-slate-800">{dept.nameEn}</h3>
                        <p className="font-bold text-slate-500 mb-2">{dept.nameAr}</p>
                      </>
                    )}
                    <span className="px-2 py-1 bg-slate-100 text-[8px] font-black uppercase text-slate-400 rounded-md inline-block mt-2">
                      {dept.type}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'beds' && (
            <motion.div
              key="beds"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Add Bed Form */}
              <div className="p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">Bed Number</label>
                  <input
                    type="text"
                    placeholder="B-101"
                    value={newBed.bedNumber || ""}
                    onChange={e => setNewBed({...newBed, bedNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">Room Number</label>
                  <input
                    type="text"
                    placeholder="Room 10"
                    value={newBed.roomNumber || ""}
                    onChange={e => setNewBed({...newBed, roomNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-1">Department</label>
                  <select
                    value={newBed.departmentId || ""}
                    onChange={e => setNewBed({...newBed, departmentId: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-emerald-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="">Select Dept</option>
                    {departments.filter(d => d.type === 'clinical').map(d => (
                      <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddBed}
                  className="h-12 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition shadow-lg shadow-emerald-100 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> {isAr ? "إضافة سرير" : "Add Bed"}
                </button>
              </div>

              {/* List */}
              <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "رقم السرير" : "Bed No."}</th>
                      <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الغرفة" : "Room"}</th>
                      <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "القسم" : "Department"}</th>
                      <th className="p-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                      <th className="p-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {beds.map(bed => {
                      const dept = departments.find(d => d.id === bed.departmentId);
                      return (
                        <tr key={bed.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                                <BedIcon size={14} />
                              </div>
                              <span className="font-black text-slate-700">{bed.bedNumber}</span>
                            </div>
                          </td>
                          <td className="p-4 text-sm font-bold text-slate-500">{bed.roomNumber || "-"}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-full">
                              {dept ? (isAr ? dept.nameAr : dept.nameEn) : "Unknown"}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 text-[10px] font-black uppercase rounded-full ${
                              bed.status === 'available' ? 'bg-emerald-50 text-emerald-600' :
                              bed.status === 'occupied' ? 'bg-rose-50 text-rose-600' :
                              'bg-amber-50 text-amber-600'
                            }`}>
                              {bed.status}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <button onClick={() => deleteBed(bed.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'clinics' && (
            <motion.div
              key="clinics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Add Clinic Form */}
              <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">Clinic Name (En)</label>
                  <input
                    type="text"
                    value={newClinic.nameEn || ""}
                    onChange={e => setNewClinic({...newClinic, nameEn: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">اسم العيادة (عربي)</label>
                  <input
                    type="text"
                    value={newClinic.nameAr || ""}
                    onChange={e => setNewClinic({...newClinic, nameAr: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">Department</label>
                  <select
                    value={newClinic.departmentId || ""}
                    onChange={e => setNewClinic({...newClinic, departmentId: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Dept</option>
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleAddClinic}
                  className="h-12 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> {isAr ? "إضافة عيادة" : "Add Clinic"}
                </button>
              </div>

              {/* List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clinics.map(clinic => {
                  const dept = departments.find(d => d.id === clinic.departmentId);
                  return (
                    <div key={clinic.id} className="p-6 bg-white border border-slate-200 rounded-[32px] hover:shadow-xl transition-all group relative overflow-hidden">
                       <div className="flex justify-between items-start mb-4 relative z-10">
                          <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                            <Stethoscope size={24} />
                          </div>
                          <button onClick={() => deleteClinic(clinic.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 size={18} />
                          </button>
                       </div>
                       <h3 className="text-lg font-black text-slate-800">{isAr ? clinic.nameAr : clinic.nameEn}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                         {dept ? (isAr ? dept.nameAr : dept.nameEn) : "No Dept"}
                       </p>
                       {clinic.location && (
                         <div className="mt-4 p-3 bg-slate-50 rounded-xl text-[10px] font-bold text-slate-500">
                           {clinic.location}
                         </div>
                       )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
          {activeTab === 'audit' && (
            <motion.div
              key="audit"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{isAr ? "سجل التحركات والعمليات" : "Audit Log - System Operations"}</h3>
                  <button className="px-4 py-2 bg-slate-100 rounded-xl text-[10px] font-black uppercase text-slate-600 hover:bg-slate-200 transition-colors">
                    {isAr ? "تصدير التقرير" : "Export Report"}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest text-left">
                        <th className="p-4">{isAr ? "الوقت" : "Timestamp"}</th>
                        <th className="p-4">{isAr ? "المستخدم" : "User"}</th>
                        <th className="p-4">{isAr ? "العملية" : "Action"}</th>
                        <th className="p-4">{isAr ? "الكيان" : "Entity"}</th>
                        <th className="p-4">{isAr ? "التفاصيل" : "Details"}</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs">
                      {auditLogs.slice().reverse().map((log, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-mono text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="p-4 font-bold text-indigo-600">{log.userName}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-black uppercase text-[9px] ${
                              log.action === 'DELETE' ? 'bg-rose-50 text-rose-600' :
                              log.action === 'CREATE' ? 'bg-emerald-50 text-emerald-600' :
                              'bg-indigo-50 text-indigo-600'
                            }`}>
                              {log.action}
                            </span>
                          </td>
                          <td className="p-4 font-bold text-slate-700">{log.entityType} ({log.entityId})</td>
                          <td className="p-4">
                            <div className="max-w-xs truncate text-slate-500 italic">
                              {log.reason || "N/A"}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="p-6 bg-slate-50 border-t border-slate-100">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-amber-500" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {isAr ? "سياسة صارمة: يجب أن يتطابق قسم السرير مع قسم المريض." : "Strict Policy: Bed department must match patient department."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
              {isAr ? "نظام الترقيم الموحد مفعل." : "Unified numbering system active."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
