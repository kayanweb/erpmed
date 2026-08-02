import React, { useState } from 'react';
import { 
  BedDouble, Plus, Search, Filter, Edit2, Trash2, 
  ShieldAlert, Settings, Building, MapPin, CheckCircle2,
  AlertCircle, LayoutGrid, List, Save, X, HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from "motion/react";
import { useHIS } from '../context/HISContext';
import { HospitalBed } from '../types';
import { toast } from 'sonner';

interface Props {
  language?: "ar" | "en";
  onClose?: () => void;
}

export default function MasterBedRegistry({ language: propLanguage, onClose }: Props) {
  const { language: contextLanguage, beds, setBeds, departments, logAudit, currentUser } = useHIS();
  const language = propLanguage || contextLanguage || 'en';
  const isAr = language === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDept, setFilterDept] = useState('ALL');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [isAdding, setIsAdding] = useState(false);
  const [editingBed, setEditingBed] = useState<HospitalBed | null>(null);

  const [formData, setFormData] = useState<Partial<HospitalBed>>({
    bedNumber: '',
    building: '',
    floor: '',
    departmentId: '',
    status: 'available',
    isolationType: 'none',
    genderRestriction: 'none',
    isActive: true,
    hasMonitor: false,
    hasVentilator: false,
    equipmentList: []
  });

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bed.roomId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDept === 'ALL' || bed.departmentId === filterDept;
    return matchesSearch && matchesDept;
  });

  const handleSave = () => {
    if (!formData.bedNumber || !formData.departmentId) {
      toast.error(isAr ? "يرجى ملء البيانات الأساسية (رقم السرير والقسم)" : "Please fill required fields (Bed Number & Department)");
      return;
    }

    // Check uniqueness
    const exists = beds.find(b => b.bedNumber === formData.bedNumber && b.id !== editingBed?.id);
    if (exists) {
      toast.error(isAr ? "رقم السرير موجود مسبقاً في المستشفى" : "Bed number already exists in the hospital registry");
      return;
    }

    if (editingBed) {
      const updatedBeds = beds.map(b => b.id === editingBed.id ? { ...editingBed, ...formData } as HospitalBed : b);
      setBeds(updatedBeds);
      logAudit({
        action: 'UPDATE_BED_REGISTRY',
        entityType: 'BED',
        entityId: editingBed.id,
        reason: 'Master Registry Update',
        oldValue: editingBed,
        newValue: formData
      });
      toast.success(isAr ? "تم تحديث بيانات السرير" : "Bed record updated successfully");
    } else {
      const newBed: HospitalBed = {
        id: `bed-${Date.now()}`,
        hospitalId: 'HOSP-01',
        createdAt: new Date().toISOString(),
        ...formData as any
      };
      setBeds([...beds, newBed]);
      logAudit({
        action: 'CREATE_BED_REGISTRY',
        entityType: 'BED',
        entityId: newBed.id,
        reason: 'New Bed Registration',
        newValue: newBed
      });
      toast.success(isAr ? "تم إضافة السرير للسجل العام" : "New bed added to master registry");
    }

    setIsAdding(false);
    setEditingBed(null);
    setFormData({
      bedNumber: '',
      building: '',
      floor: '',
      departmentId: '',
      status: 'available',
      isolationType: 'none',
      genderRestriction: 'none',
      isActive: true,
      hasMonitor: false,
      hasVentilator: false,
      equipmentList: []
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm(isAr ? "هل أنت متأكد من حذف هذا السرير نهائياً من السجل؟" : "Are you sure you want to permanently delete this bed from registry?")) return;
    
    setBeds(beds.filter(b => b.id !== id));
    logAudit({
      action: 'DELETE_BED_REGISTRY',
      entityType: 'BED',
      entityId: id,
      reason: 'Administrative Deletion'
    });
    toast.warning(isAr ? "تم حذف السرير من السجل" : "Bed removed from registry");
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <HardDrive size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "سجل الأسرة الرئيسي (Master Bed Registry)" : "Master Bed Registry"}
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase">
              {isAr ? "إدارة الأصول السريرية والهوية الفريدة للأسرة" : "Clinical Asset Management & Unique Bed Identity"}
            </p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
        >
          <Plus size={18} />
          {isAr ? "إضافة سرير جديد" : "Add New Bed"}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-slate-100 px-6 py-3 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-[300px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder={isAr ? "البحث برقم السرير أو الغرفة..." : "Search by bed # or room..."}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select 
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            <option value="ALL">{isAr ? "جميع الأقسام" : "All Departments"}</option>
            {departments.filter(d => d.type === 'clinical').map(d => (
              <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setViewMode('table')}
            className={`p-2 rounded-md transition-all ${viewMode === 'table' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <List size={18} />
          </button>
          <button 
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest">{isAr ? "رقم السرير" : "Bed #"}</th>
                  <th className="px-4 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest">{isAr ? "القسم" : "Department"}</th>
                  <th className="px-4 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest">{isAr ? "الموقع" : "Location"}</th>
                  <th className="px-4 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest">{isAr ? "الحالة" : "Status"}</th>
                  <th className="px-4 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest">{isAr ? "العزل" : "Isolation"}</th>
                  <th className="px-4 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest">{isAr ? "التجهيزات" : "Equipment"}</th>
                  <th className="px-4 py-4 font-black text-slate-500 uppercase text-[10px] tracking-widest text-center">{isAr ? "إجراءات" : "Actions"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBeds.map(bed => {
                  const dept = departments.find(d => d.id === bed.departmentId);
                  return (
                    <tr key={bed.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-4 py-4 font-bold text-slate-800">{bed.bedNumber}</td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700">{isAr ? dept?.nameAr : dept?.nameEn}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase">{bed.departmentId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <MapPin size={12} />
                          <span className="text-xs">{bed.building} - F{bed.floor} - R{bed.roomId}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                          bed.status === 'available' ? 'bg-emerald-100 text-emerald-700' :
                          bed.status === 'occupied' ? 'bg-blue-100 text-blue-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {bed.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {bed.isolationType !== 'none' && (
                          <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-[10px] font-black uppercase flex items-center gap-1 w-fit">
                            <ShieldAlert size={10} />
                            {bed.isolationType}
                          </span>
                        )}
                        {bed.isolationType === 'none' && <span className="text-slate-300">-</span>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          {bed.hasMonitor && <div className="p-1 bg-indigo-50 text-indigo-600 rounded" title="Monitor"><Settings size={14} /></div>}
                          {bed.hasVentilator && <div className="p-1 bg-indigo-50 text-indigo-600 rounded" title="Ventilator"><Plus size={14} /></div>}
                          {!bed.hasMonitor && !bed.hasVentilator && <span className="text-slate-300">-</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setEditingBed(bed); setFormData(bed); setIsAdding(true); }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(bed.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBeds.map(bed => {
              const dept = departments.find(d => d.id === bed.departmentId);
              return (
                <div key={bed.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all group relative overflow-hidden">
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    bed.status === 'available' ? 'bg-emerald-500' :
                    bed.status === 'occupied' ? 'bg-blue-500' :
                    'bg-amber-500'
                  }`}></div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <BedDouble size={20} />
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingBed(bed); setFormData(bed); setIsAdding(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(bed.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <h3 className="text-lg font-black text-slate-800 mb-1">{bed.bedNumber}</h3>
                  <p className="text-xs font-bold text-slate-500 mb-4">{isAr ? dept?.nameAr : dept?.nameEn}</p>
                  
                  <div className="space-y-2 border-t border-slate-50 pt-3">
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span className="text-slate-400">{isAr ? "الموقع:" : "Location:"}</span>
                      <span className="text-slate-700">{bed.building} - F{bed.floor}</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase">
                      <span className="text-slate-400">{isAr ? "الغرفة:" : "Room:"}</span>
                      <span className="text-slate-700">{bed.roomId}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-black text-slate-800 uppercase tracking-tight">
                {editingBed ? (isAr ? "تعديل بيانات السرير" : "Edit Bed Registry") : (isAr ? "تسجيل سرير جديد" : "New Bed Registration")}
              </h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "رقم السرير الفريد *" : "Unique Bed Number *"}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    value={formData.bedNumber}
                    onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "القسم المسؤول *" : "Responsible Department *"}</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    <option value="">{isAr ? "اختر القسم..." : "Select Dept..."}</option>
                    {departments.filter(d => d.type === 'clinical').map(d => (
                      <option key={d.id} value={d.id}>{isAr ? d.nameAr : d.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "المبنى" : "Building"}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "الطابق" : "Floor"}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "رقم الغرفة" : "Room ID"}</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.roomId}
                    onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{isAr ? "نوع العزل" : "Isolation Type"}</label>
                  <select 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                    value={formData.isolationType}
                    onChange={(e) => setFormData({ ...formData, isolationType: e.target.value as any })}
                  >
                    <option value="none">None</option>
                    <option value="contact">Contact</option>
                    <option value="droplet">Droplet</option>
                    <option value="airborne">Airborne</option>
                    <option value="protective">Protective</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-8">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.hasMonitor}
                    onChange={(e) => setFormData({ ...formData, hasMonitor: e.target.checked })}
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{isAr ? "يتوفر جهاز مراقبة (Monitor)" : "Has Patient Monitor"}</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-5 h-5 rounded-lg border-slate-200 text-indigo-600 focus:ring-indigo-500"
                    checked={formData.hasVentilator}
                    onChange={(e) => setFormData({ ...formData, hasVentilator: e.target.checked })}
                  />
                  <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{isAr ? "يتوفر جهاز تنفس صناعي (Ventilator)" : "Has Ventilator"}</span>
                </label>
              </div>
            </div>

            <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-all"
              >
                {isAr ? "إلغاء" : "Cancel"}
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-2 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-95 transition-all flex items-center gap-2"
              >
                <Save size={18} />
                {isAr ? "حفظ السجل" : "Save Record"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
