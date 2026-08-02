import React, { cloneElement, useState } from 'react';
import { useHIS } from '../context/HISContext';
import { 
  Building2, MapPin, Layers, Layout, 
  Home, Bed, Plus, Trash2, Edit3, 
  ChevronRight, ChevronDown, Search,
  ShieldCheck, Activity, Users, DollarSign,
  History as HistoryIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrgNode {
  id: string;
  type: 'group' | 'hospital' | 'branch' | 'building' | 'floor' | 'department' | 'unit' | 'room' | 'bed';
  nameEn: string;
  nameAr: string;
  code?: string;
  managerId?: string;
  status: 'active' | 'inactive';
  children?: OrgNode[];
  metadata?: any;
}

export default function OrganizationManager({ language, onClose }: { language: 'ar' | 'en', onClose?: () => void }) {
  const isAr = language === 'ar';
  const { departments, currentUser } = useHIS();
  
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // sample initial hierarchy - In a real app, this would come from HISContext/Firestore
  const [hierarchy, setHierarchy] = useState<OrgNode[]>([
    {
      id: 'root',
      type: 'group',
      nameEn: 'Global Health Group',
      nameAr: 'مجموعة الصحة العالمية',
      status: 'active',
      children: [
        {
          id: 'hosp-1',
          type: 'hospital',
          nameEn: 'Main Specialized Hospital',
          nameAr: 'المستشفى التخصصي الرئيسي',
          status: 'active',
          children: [
            {
              id: 'branch-1',
              type: 'branch',
              nameEn: 'North Branch',
              nameAr: 'فرع الشمال',
              status: 'active',
              children: [
                {
                  id: 'dept-im',
                  type: 'department',
                  nameEn: 'Internal Medicine',
                  nameAr: 'الباطنة العامة',
                  status: 'active',
                  metadata: { costCenter: 'CC-101', capacity: 40, type: 'Clinical' }
                },
                {
                  id: 'dept-er',
                  type: 'department',
                  nameEn: 'Emergency Department',
                  nameAr: 'قسم الطوارئ',
                  status: 'active',
                  metadata: { costCenter: 'CC-911', capacity: 25, type: 'Clinical' }
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  const toggleNode = (id: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedNodes(newExpanded);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'group': return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'hospital': return <Building2 className="w-4 h-4 text-blue-600" />;
      case 'branch': return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'department': return <Layout className="w-4 h-4 text-purple-600" />;
      case 'unit': return <Layers className="w-4 h-4 text-amber-600" />;
      case 'room': return <Home className="w-4 h-4 text-slate-600" />;
      case 'bed': return <Bed className="w-4 h-4 text-rose-600" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  const renderTree = (nodes: OrgNode[], level = 0) => {
    return nodes.map(node => (
      <div key={node.id} className="select-none">
        <div 
          onClick={() => {
            setSelectedNode(node);
            if (node.children) toggleNode(node.id);
          }}
          className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer transition-all ${
            selectedNode?.id === node.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-slate-50'
          }`}
          style={{ paddingLeft: isAr ? '12px' : `${level * 20 + 12}px`, paddingRight: isAr ? `${level * 20 + 12}px` : '12px' }}
        >
          {node.children ? (
            expandedNodes.has(node.id) ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronRight className={`w-3 h-3 text-slate-400 ${isAr ? 'rotate-180' : ''}`} />
          ) : <div className="w-3" />}
          
          <div className="p-1.5 rounded-md bg-white shadow-sm border border-slate-100">
            {getIcon(node.type)}
          </div>
          
          <span className={`text-xs font-bold ${selectedNode?.id === node.id ? 'text-indigo-700' : 'text-slate-700'}`}>
            {isAr ? node.nameAr : node.nameEn}
          </span>

          {node.status === 'inactive' && (
            <span className="text-[8px] font-black uppercase px-1.5 bg-slate-100 text-slate-400 rounded">Inactive</span>
          )}
        </div>

        <AnimatePresence>
          {node.children && expandedNodes.has(node.id) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {renderTree(node.children, level + 1)}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    ));
  };

  return (
    <div className="flex h-[700px] gap-6" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Sidebar Tree */}
      <div className="w-1/3 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
           <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
              <button 
                onClick={onClose}
                className="w-5 h-5 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group"
              >
                 <Plus className="w-4 h-4 rotate-45 group-hover:scale-110 transition-transform" />
              </button>
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-800">{isAr ? "الهيكل التنظيمي" : "Org Hierarchy"}</h3>
           </div>
           <button className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 hover:scale-105 transition-transform">
             <Plus className="w-4 h-4" />
           </button>
        </div>
        <div className="p-4 border-b border-slate-100">
           <div className="relative">
             <Search className="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
             <input type="text" className="w-full h-9 ltr:pl-9 rtl:pr-9 bg-slate-50 border border-slate-100 rounded-lg text-xs outline-none" placeholder={isAr ? "بحث في الهيكل..." : "Search tree..."} />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {renderTree(hierarchy)}
        </div>
      </div>

      {/* Details Area */}
      <div className="flex-1 bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col shadow-sm">
        {selectedNode ? (
          <>
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
               <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                    {cloneElement(getIcon(selectedNode.type) as any, { className: "w-7 h-7" })}
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-slate-800">{isAr ? selectedNode.nameAr : selectedNode.nameEn}</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                       <ShieldCheck className="w-3 h-3" />
                       {selectedNode.type} ID: {selectedNode.id}
                    </p>
                  </div>
               </div>
               <div className="flex gap-2 min-w-max">
                  <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
                    {isAr ? "تعديل" : "Edit"}
                  </button>
                  <button className="px-4 py-2 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl text-xs font-bold hover:bg-rose-100 transition">
                    {isAr ? "حذف" : "Delete"}
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
               {/* General Settings */}
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الاسم (EN)" : "Name (EN)"}</label>
                    <input type="text" readOnly={!isEditing} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500" value={selectedNode.nameEn} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الاسم (AR)" : "Name (AR)"}</label>
                    <input type="text" readOnly={!isEditing} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500 text-right" value={selectedNode.nameAr} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "كود التعريف" : "Entity Code"}</label>
                    <input type="text" readOnly={!isEditing} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500" value={selectedNode.code || "N/A"} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">{isAr ? "الحالة" : "Status"}</label>
                    <select disabled={!isEditing} className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none focus:border-indigo-500">
                       <option value="active">Active</option>
                       <option value="inactive">Inactive</option>
                    </select>
                  </div>
               </div>

               {/* Advanced Metadata (e.g., for Departments) */}
               {selectedNode.type === 'department' && (
                 <div className="space-y-6">
                    <h4 className="text-xs font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2 pb-2 border-b border-indigo-50">
                      <Layout className="w-4 h-4" />
                      {isAr ? "إعدادات القسم المتقدمة" : "Advanced Department Settings"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                       <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
                          <DollarSign className="w-6 h-6 text-emerald-600" />
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{isAr ? "مركز التكلفة" : "Cost Center"}</p>
                            <p className="text-sm font-black text-slate-800">{selectedNode.metadata?.costCenter || 'N/A'}</p>
                          </div>
                       </div>
                       <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
                          <Activity className="w-6 h-6 text-blue-600" />
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{isAr ? "السعة التشغيلية" : "Capacity"}</p>
                            <p className="text-sm font-black text-slate-800">{selectedNode.metadata?.capacity || 0} {isAr ? "سرير/وحدة" : "Beds/Units"}</p>
                          </div>
                       </div>
                       <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 flex flex-col items-center gap-3">
                          <Users className="w-6 h-6 text-purple-600" />
                          <div className="text-center">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{isAr ? "المدير المسؤول" : "Department Manager"}</p>
                            <p className="text-sm font-black text-slate-800">{isAr ? "د. محمد أحمد" : "Dr. Mohamed Ahmed"}</p>
                          </div>
                       </div>
                    </div>
                 </div>
               )}

               {/* Action History / Audit */}
               <div className="pt-8 border-t border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                       <HistoryIcon className="w-4 h-4" />
                       {isAr ? "سجل التغييرات الأخير" : "Recent Change Log"}
                    </h4>
                    <button className="text-[10px] font-black text-indigo-600 hover:underline">{isAr ? "عرض الكل" : "View Full Audit"}</button>
                  </div>
                  <div className="space-y-3">
                    {[1, 2].map(i => (
                      <div key={i} className="flex items-center justify-between py-2 px-4 bg-slate-50 rounded-xl text-[11px]">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                          <p className="font-bold text-slate-700">{isAr ? "تعديل السعة التشغيلية" : "Capacity Updated"}</p>
                        </div>
                        <p className="text-slate-400 font-medium">12-07-2026 10:30 AM - Admin</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-20">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
               <Building2 className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-400">{isAr ? "اختر كياناً لعرض التفاصيل" : "Select an entity to view details"}</h3>
            <p className="text-sm text-slate-400 mt-2 max-w-sm">{isAr ? "يمكنك إدارة الهيكل التنظيمي للمستشفى بالكامل من هنا، بما في ذلك الفروع والأقسام والوحدات." : "Manage your entire hospital structure hierarchy here, including branches, departments, and units."}</p>
          </div>
        )}
      </div>
    </div>
  );
}
