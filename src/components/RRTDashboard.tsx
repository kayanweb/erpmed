import React, { useState, useEffect } from 'react';
import { Siren, Activity, MapPin, Clock, Phone, AlertTriangle, Users, Calendar, CheckCircle2, XCircle, Search, Plus, Loader2 } from 'lucide-react';
import { firestoreService } from '../lib/firestoreService';
import { motion, AnimatePresence } from 'motion/react';

interface CodeActivation {
  id: string;
  codeType: 'Code Blue' | 'Code Yellow' | 'Code Stroke' | 'Code Sepsis' | 'Code White';
  location: string;
  patientName?: string;
  patientId?: string;
  activatedBy: string;
  activationTime: string;
  status: 'Active' | 'Responded' | 'Resolved' | 'Cancelled';
  teamLeader?: string;
  notes?: string;
}

export default function RRTDashboard({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';
  const [activations, setActivations] = useState<CodeActivation[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCodeForm, setShowNewCodeForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  
  // New Code Form State
  const [newCode, setNewCode] = useState<Partial<CodeActivation>>({
    codeType: 'Code Blue',
    status: 'Active',
    location: '',
    activatedBy: 'Dr. System',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await firestoreService.getAll<CodeActivation>('rrt_activations');
      setActivations(data.sort((a, b) => new Date(b.activationTime).getTime() - new Date(a.activationTime).getTime()));
    } catch (error) {
      console.error('Error fetching RRT data:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleActivateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.location || !newCode.codeType) return;
    setSaving(true);
    try {
      const activation: Omit<CodeActivation, 'id'> = {
        codeType: newCode.codeType as any,
        location: newCode.location,
        patientName: newCode.patientName || '',
        patientId: newCode.patientId || '',
        activatedBy: newCode.activatedBy || 'System User',
        activationTime: new Date().toISOString(),
        status: 'Active',
      };
      await firestoreService.add('rrt_activations', activation);
      await fetchData();
      setShowNewCodeForm(false);
      setNewCode({ codeType: 'Code Blue', status: 'Active', location: '', activatedBy: 'Dr. System' });
    } catch (error) {
      console.error('Failed to activate code:', error);
    }
    setSaving(false);
  };

  const handleUpdateStatus = async (id: string, newStatus: CodeActivation['status']) => {
    try {
      await firestoreService.update('rrt_activations', id, { status: newStatus });
      await fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const activeCodes = activations.filter(a => a.status === 'Active' || a.status === 'Responded');
  const pastCodes = activations.filter(a => a.status === 'Resolved' || a.status === 'Cancelled');
  const filteredPastCodes = pastCodes.filter(c => 
    c.location.toLowerCase().includes(search.toLowerCase()) || 
    c.codeType.toLowerCase().includes(search.toLowerCase())
  );

  const getCodeColor = (type: string) => {
    switch(type) {
      case 'Code Blue': return 'bg-blue-600';
      case 'Code Yellow': return 'bg-yellow-500';
      case 'Code Stroke': return 'bg-rose-500';
      case 'Code Sepsis': return 'bg-purple-600';
      case 'Code White': return 'bg-slate-700';
      default: return 'bg-indigo-600';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-slate-900 text-white p-6 shadow-md flex justify-between items-center z-10">
        <div>
          <div className="flex items-center gap-3">
            <Siren className="w-8 h-8 text-rose-500 animate-pulse" />
            <h1 className="text-2xl font-black tracking-tight">{isAr ? 'فريق الاستجابة السريعة (RRT)' : 'Rapid Response Team (RRT)'}</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">{isAr ? 'مركز التحكم وإدارة الاستجابة الطارئة' : 'Emergency Response Control Center'}</p>
        </div>
        <button 
          onClick={() => setShowNewCodeForm(true)}
          className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center gap-2 transition-all shadow-lg shadow-rose-900/20"
        >
          <AlertTriangle className="w-5 h-5" />
          {isAr ? 'تفعيل نداء (Code)' : 'Activate Code'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Active Codes Section */}
        <div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-rose-600" />
            {isAr ? 'النداءات النشطة حالياً' : 'Currently Active Codes'}
            <span className="bg-rose-100 text-rose-700 py-0.5 px-2 rounded-full text-xs">{activeCodes.length}</span>
          </h2>

          {loading ? (
            <div className="flex items-center justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>
          ) : activeCodes.length === 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl flex flex-col items-center justify-center text-center shadow-sm">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
              <h3 className="text-lg font-bold text-emerald-900">{isAr ? 'الوضع مستقر' : 'Situation Stable'}</h3>
              <p className="text-emerald-700 text-sm mt-1">{isAr ? 'لا توجد نداءات طوارئ نشطة حالياً.' : 'No active emergency codes at the moment.'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AnimatePresence>
                {activeCodes.map((code) => (
                  <motion.div 
                    key={code.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden relative"
                  >
                    <div className={`absolute top-0 left-0 w-2 h-full ${getCodeColor(code.codeType)}`} />
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-md text-white text-xs font-black uppercase tracking-widest ${getCodeColor(code.codeType)}`}>
                            {code.codeType}
                          </span>
                          <h3 className="text-xl font-black text-slate-900 mt-2">{code.location}</h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-rose-600">
                            {Math.floor((new Date().getTime() - new Date(code.activationTime).getTime()) / 60000)}m
                          </div>
                          <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{isAr ? 'منذ التفعيل' : 'Since Activation'}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{isAr ? 'المريض' : 'Patient'}</p>
                          <p className="font-bold text-slate-800 text-sm truncate">{code.patientName || '--'}</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">{isAr ? 'أُطلق بواسطة' : 'Activated By'}</p>
                          <p className="font-bold text-slate-800 text-sm truncate">{code.activatedBy}</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {code.status === 'Active' && (
                          <button 
                            onClick={() => handleUpdateStatus(code.id, 'Responded')}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors"
                          >
                            {isAr ? 'تسجيل وصول الفريق' : 'Mark Team Arrived'}
                          </button>
                        )}
                        {code.status === 'Responded' && (
                          <button 
                            onClick={() => handleUpdateStatus(code.id, 'Resolved')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors"
                          >
                            {isAr ? 'إنهاء الحالة (استقرار)' : 'Resolve (Stable)'}
                          </button>
                        )}
                        <button 
                          onClick={() => handleUpdateStatus(code.id, 'Cancelled')}
                          className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-colors"
                        >
                          {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* History Section */}
        <div>
           <div className="flex justify-between items-end mb-4">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <Clock className="w-5 h-5 text-slate-400" />
              {isAr ? 'سجل النداءات' : 'Code History'}
            </h2>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 text-slate-400" />
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isAr ? 'بحث...' : 'Search...'} 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className={`px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'النداء' : 'Code'}</th>
                  <th className={`px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الموقع' : 'Location'}</th>
                  <th className={`px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'الوقت' : 'Time'}</th>
                  <th className={`px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest ${isAr ? 'text-right' : 'text-left'}`}>{isAr ? 'النتيجة' : 'Outcome'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPastCodes.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      {isAr ? 'لا توجد سجلات مطابقة.' : 'No matching records found.'}
                    </td>
                  </tr>
                ) : (
                  filteredPastCodes.map((code) => (
                    <tr key={code.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                         <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${getCodeColor(code.codeType)}`} />
                           <span className="font-bold text-slate-800">{code.codeType}</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-700">{code.location}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(code.activationTime).toLocaleString(isAr ? 'ar-SA' : 'en-US')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          code.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {code.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* New Code Modal */}
      <AnimatePresence>
        {showNewCodeForm && (
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200"
              dir={isAr ? "rtl" : "ltr"}
            >
              <div className="bg-rose-600 p-6 text-white flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6" />
                  <h3 className="text-xl font-black">{isAr ? 'تفعيل نداء طوارئ' : 'Activate Emergency Code'}</h3>
                </div>
                <button onClick={() => setShowNewCodeForm(false)} className="text-rose-200 hover:text-white">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleActivateCode} className="p-8 space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    {isAr ? 'نوع النداء' : 'Code Type'} <span className="text-rose-500">*</span>
                  </label>
                  <select 
                    required
                    value={newCode.codeType}
                    onChange={(e) => setNewCode({...newCode, codeType: e.target.value as any})}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  >
                    <option value="Code Blue">Code Blue (Cardiac Arrest)</option>
                    <option value="Code Yellow">Code Yellow (Missing Patient)</option>
                    <option value="Code Stroke">Code Stroke</option>
                    <option value="Code Sepsis">Code Sepsis</option>
                    <option value="Code White">Code White (Aggressive Person)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                    {isAr ? 'الموقع' : 'Location'} <span className="text-rose-500">*</span>
                  </label>
                  <input 
                    required
                    type="text"
                    value={newCode.location}
                    onChange={(e) => setNewCode({...newCode, location: e.target.value})}
                    placeholder="e.g. ICU Bed 4, East Wing"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      {isAr ? 'اسم المريض (اختياري)' : 'Patient Name (Opt)'}
                    </label>
                    <input 
                      type="text"
                      value={newCode.patientName}
                      onChange={(e) => setNewCode({...newCode, patientName: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                      {isAr ? 'الملف الطبي' : 'MRN (Opt)'}
                    </label>
                    <input 
                      type="text"
                      value={newCode.patientId}
                      onChange={(e) => setNewCode({...newCode, patientId: e.target.value})}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setShowNewCodeForm(false)}
                    className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold uppercase tracking-widest transition-colors"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex-[2] py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAr ? 'إطلاق النداء فوراً' : 'Activate Immediately')}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
