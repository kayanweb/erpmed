import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlobalEntityLink } from '../GlobalEntityLink';
import { 
  Users, Search, ShieldAlert, Link as LinkIcon, 
  History, Activity, UserPlus, Database, Fingerprint,
  ChevronRight, AlertTriangle, CheckCircle2, ShieldCheck, Merge
} from 'lucide-react';

interface Props {
  language: 'ar' | 'en';
}

const DUMMY_MPI_RECORDS = [
  {
    mpi_id: 'MPI-2023-88910',
    mrn: 'MRN-100234',
    national_id: '1099283746',
    name_ar: 'أحمد محمود صالح',
    name_en: 'Ahmed Mahmoud Saleh',
    dob: '1985-04-12',
    gender: 'M',
    status: 'VERIFIED',
    linked_records: 2,
    last_encounter: '2023-11-20T10:30:00Z',
    score: 98
  },
  {
    mpi_id: 'MPI-2023-88911',
    mrn: 'MRN-100235',
    national_id: '1099283746',
    name_ar: 'أحمد محمود ص.',
    name_en: 'Ahmed M. Saleh',
    dob: '1985-04-12',
    gender: 'M',
    status: 'SUSPECTED_DUPLICATE',
    linked_records: 1,
    last_encounter: '2023-12-01T14:15:00Z',
    score: 85
  },
  {
    mpi_id: 'MPI-2024-10291',
    mrn: 'MRN-220199',
    national_id: '2019928833',
    name_ar: 'سارة خالد عبدالله',
    name_en: 'Sarah Khaled Abdullah',
    dob: '1992-08-30',
    gender: 'F',
    status: 'VERIFIED',
    linked_records: 4,
    last_encounter: '2024-01-15T09:00:00Z',
    score: 100
  }
];

export default function MPIDashboard({ language }: Props) {
  const isAr = language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'search' | 'duplicates' | 'audit'>('search');
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const duplicates = DUMMY_MPI_RECORDS.filter(r => r.status === 'SUSPECTED_DUPLICATE');
  
  return (
    <div className="flex flex-col h-full bg-slate-50 font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
              <Database size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800">
                {isAr ? 'السجل الطبي الموحد (MPI)' : 'Master Patient Index (MPI)'}
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                {isAr ? 'محرك الهوية المؤسسية - دمج وتوحيد بيانات المرضى' : 'Enterprise Identity Engine - Patient Data Unification'}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition shadow-sm flex items-center gap-2">
              <UserPlus size={18} className="text-emerald-500" />
              {isAr ? 'تسجيل مريض جديد' : 'New Patient Registration'}
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-sm flex items-center gap-2">
              <Activity size={18} />
              {isAr ? 'تقرير جودة البيانات' : 'Data Quality Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          <button 
            onClick={() => setActiveTab('search')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'search' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Search size={18} />
            {isAr ? 'البحث المركزي' : 'Central Search'}
          </button>
          
          <button 
            onClick={() => setActiveTab('duplicates')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'duplicates' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <ShieldAlert size={18} />
              {isAr ? 'معالجة التكرار' : 'Duplicate Resolution'}
            </div>
            {duplicates.length > 0 && (
              <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{duplicates.length}</span>
            )}
          </button>

          <button 
            onClick={() => setActiveTab('audit')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'audit' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History size={18} />
            {isAr ? 'سجل الحركات (Audit)' : 'Audit Trail'}
          </button>
          
          <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-4 -top-4 opacity-10">
              <Fingerprint size={100} />
            </div>
            <h3 className="font-bold mb-4 relative z-10">{isAr ? 'إحصائيات جودة الهوية' : 'Identity Quality Stats'}</h3>
            <div className="space-y-4 relative z-10">
              <div>
                <div className="flex justify-between text-xs mb-1 opacity-80 font-medium">
                  <span>{isAr ? 'نسبة التطابق' : 'Match Rate'}</span>
                  <span>99.2%</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 w-[99.2%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 opacity-80 font-medium">
                  <span>{isAr ? 'ملفات مكررة محتملة' : 'Suspected Duplicates'}</span>
                  <span>14</span>
                </div>
                <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 w-[5%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'search' && (
              <motion.div 
                key="search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full"
              >
                <div className="relative mb-6">
                  <input 
                    type="text" 
                    placeholder={isAr ? "ابحث بالرقم الطبي، الهوية، الهاتف، أو الاسم..." : "Search by MRN, National ID, Phone, or Name..."}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-12 py-4 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" size={24} />
                  {isAr && <Search className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400" size={24} />}
                </div>

                <div className="space-y-3">
                  {DUMMY_MPI_RECORDS.map((record) => (
                    <div 
                      key={record.mpi_id} 
                      onClick={() => setSelectedRecord(record)}
                      className={`p-4 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                        selectedRecord?.mpi_id === record.mpi_id ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                          record.gender === 'M' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
                        }`}>
                          {isAr ? record.name_ar.charAt(0) : record.name_en.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">
                            <GlobalEntityLink entityId={record.mrn || record.mpi_id} entityName={isAr ? record.name_ar : record.name_en} entityType="patient" isAr={isAr}>
                              {isAr ? record.name_ar : record.name_en}
                            </GlobalEntityLink>
                          </h3>
                          <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mt-1">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md text-slate-600 font-mono">
                              <GlobalEntityLink entityId={record.mrn || record.mpi_id} entityName={isAr ? record.name_ar : record.name_en} entityType="patient" isAr={isAr}>
                                MRN: {record.mrn}
                              </GlobalEntityLink>
                            </span>
                            <span>ID: {record.national_id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="flex justify-end mb-2">
                          {record.status === 'VERIFIED' ? (
                            <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md text-xs font-bold border border-emerald-200">
                              <ShieldCheck size={14} />
                              {isAr ? 'هوية موثقة' : 'Verified Identity'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-md text-xs font-bold border border-amber-200">
                              <AlertTriangle size={14} />
                              {isAr ? 'اشتباه تكرار' : 'Suspected Duplicate'}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 font-medium flex items-center gap-1 justify-end">
                          <LinkIcon size={12} />
                          {record.linked_records} {isAr ? 'سجلات مرتبطة' : 'Linked Records'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedRecord && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 border-t border-slate-200 pt-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-black text-slate-800 text-lg">{isAr ? 'نظرة عامة على السجل الموحد' : 'MPI Record Overview'}</h3>
                      <span className="text-xs font-mono bg-slate-100 px-3 py-1 rounded-full text-slate-500 border border-slate-200">
                        {selectedRecord.mpi_id}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold mb-1">{isAr ? 'تاريخ الميلاد' : 'Date of Birth'}</div>
                        <div className="font-bold text-slate-700">{selectedRecord.dob}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold mb-1">{isAr ? 'الجنس' : 'Gender'}</div>
                        <div className="font-bold text-slate-700">{selectedRecord.gender === 'M' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold mb-1">{isAr ? 'درجة الثقة' : 'Confidence Score'}</div>
                        <div className="font-bold text-emerald-600">{selectedRecord.score}%</div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                        <div className="text-xs text-slate-400 font-bold mb-1">{isAr ? 'آخر زيارة' : 'Last Encounter'}</div>
                        <div className="font-bold text-slate-700 text-sm">{new Date(selectedRecord.last_encounter).toLocaleDateString()}</div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-sm hover:bg-indigo-700 transition">
                        {isAr ? 'عرض الملف الطبي (EMR)' : 'View EMR Record'}
                      </button>
                      <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl shadow-sm hover:bg-slate-50 transition flex items-center gap-2">
                        <Merge size={18} className="text-indigo-500" />
                        {isAr ? 'دمج السجلات' : 'Merge Records'}
                      </button>
                    </div>

                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'duplicates' && (
              <motion.div 
                key="duplicates"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-slate-800">
                    {isAr ? 'مراجعة السجلات المكررة' : 'Duplicate Resolution Center'}
                  </h2>
                </div>
                
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-4 mb-6">
                  <AlertTriangle className="text-amber-500 shrink-0" />
                  <div>
                    <h4 className="font-bold text-amber-800 text-sm mb-1">
                      {isAr ? 'تم اكتشاف تطابق جزئي' : 'Partial Match Detected'}
                    </h4>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      {isAr 
                        ? 'النظام اكتشف سجلات لها نفس رقم الهوية الوطنية ولكن بأسماء أو أرقام ملفات (MRN) مختلفة. يرجى مراجعتها ودمجها إذا كانت تعود لنفس المريض.' 
                        : 'The system detected records with the same National ID but different MRNs or Names. Please review and merge if they belong to the same patient.'}
                    </p>
                  </div>
                </div>

                {/* Example of side-by-side comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                    <div className="flex justify-between items-center mb-4 border-b border-slate-200 pb-3">
                      <span className="font-bold text-slate-500 text-xs uppercase tracking-wider">{isAr ? 'السجل الأساسي' : 'Primary Record'}</span>
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">MPI-2023-88910</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-slate-400 block text-xs">{isAr ? 'الاسم' : 'Name'}</span><span className="font-bold text-slate-700">Ahmed Mahmoud Saleh</span></div>
                      <div><span className="text-slate-400 block text-xs">{isAr ? 'رقم الملف (MRN)' : 'MRN'}</span><span className="font-bold text-slate-700">MRN-100234</span></div>
                      <div><span className="text-slate-400 block text-xs">{isAr ? 'الهوية الوطنية' : 'National ID'}</span><span className="font-bold text-slate-700">1099283746</span></div>
                    </div>
                  </div>
                  
                  <div className="border border-amber-200 rounded-xl p-4 bg-amber-50/30 relative">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 z-10">
                      <LinkIcon size={14} />
                    </div>
                    <div className="flex justify-between items-center mb-4 border-b border-amber-200 pb-3">
                      <span className="font-bold text-amber-600 text-xs uppercase tracking-wider">{isAr ? 'السجل المشتبه به' : 'Suspect Record'}</span>
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded">MPI-2023-88911</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-slate-400 block text-xs">{isAr ? 'الاسم' : 'Name'}</span><span className="font-bold text-slate-700">Ahmed M. Saleh</span></div>
                      <div><span className="text-slate-400 block text-xs">{isAr ? 'رقم الملف (MRN)' : 'MRN'}</span><span className="font-bold text-slate-700">MRN-100235</span></div>
                      <div><span className="text-slate-400 block text-xs">{isAr ? 'الهوية الوطنية' : 'National ID'}</span><span className="font-bold text-slate-700">1099283746</span></div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-6 border-t border-slate-200">
                  <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition">
                    {isAr ? 'فصل السجلات' : 'Unlink Records'}
                  </button>
                  <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shadow-indigo-200">
                    <Merge size={18} />
                    {isAr ? 'تأكيد الدمج (Merge)' : 'Confirm Merge'}
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'audit' && (
              <motion.div 
                key="audit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full flex flex-col items-center justify-center text-slate-500"
              >
                <History size={48} className="mb-4 text-slate-300" />
                <h3 className="text-lg font-bold text-slate-700 mb-2">{isAr ? 'سجل العمليات الأمني' : 'Security Audit Log'}</h3>
                <p className="text-center text-sm max-w-md">
                  {isAr 
                    ? 'يتم هنا تسجيل كافة عمليات دمج السجلات، تعديل الهوية، والوصول لبيانات السجل الطبي الموحد لأغراض الحوكمة والتدقيق.' 
                    : 'All merge operations, identity edits, and MPI data access are logged here for governance and audit purposes.'}
                </p>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
