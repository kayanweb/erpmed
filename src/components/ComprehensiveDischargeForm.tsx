import React, { useState } from 'react';
import { Pill, Activity, FlaskConical, Stethoscope, FileText, Search, Plus, Trash2, Receipt, ActivitySquare, CheckCircle2 } from 'lucide-react';
import { useHIS } from '../context/HISContext';

interface ComprehensiveDischargeFormProps {
  onDataChange: (data: any) => void;
  initialData?: any;
  language?: "ar" | "en";
}

export default function ComprehensiveDischargeForm({ onDataChange, initialData, language = "en" }: ComprehensiveDischargeFormProps) {
  const isAr = language === 'ar';

  const [activeTab, setActiveTab] = useState('summary');
  
  const [data, setData] = useState({
    dischargeType: 'routine',
    followUpDate: '',
    followUpClinic: '',
    icdCodes: [] as any[],
    medications: [] as any[],
    labs: [] as any[],
    radiology: [] as any[],
    services: [] as any[],
    totalAmount: 0,
    paidAmount: 0,
    paymentStatus: 'unpaid'
  });

  const handleUpdate = (updates: any) => {
    const newData = { ...data, ...updates };
    setData(newData);
    onDataChange(newData);
  };

  const addMedication = () => {
    handleUpdate({ medications: [...data.medications, { name: '', dose: '', route: '', duration: '' }] });
  };
  
  const addICDCode = () => {
    handleUpdate({ icdCodes: [...data.icdCodes, { code: '', description: '' }] });
  };
  
  const addLab = () => {
    handleUpdate({ labs: [...data.labs, { name: '', notes: '' }] });
  };
  
  const addRadiology = () => {
    handleUpdate({ radiology: [...data.radiology, { type: '', bodyPart: '', notes: '' }] });
  };

  const addService = () => {
    handleUpdate({ services: [...data.services, { name: '', price: 0 }] });
  };

  const removeArrayItem = (key: keyof typeof data, index: number) => {
    const arr = [...(data[key] as any[])];
    arr.splice(index, 1);
    handleUpdate({ [key]: arr });
  };

  const updateArrayItem = (key: keyof typeof data, index: number, field: string, value: any) => {
    const arr = [...(data[key] as any[])];
    arr[index][field] = value;
    
    // Recalculate total if services updated
    if (key === 'services') {
      const newTotal = arr.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
      const updates: any = { [key]: arr, totalAmount: newTotal };
      if (data.paidAmount >= newTotal) updates.paymentStatus = 'paid';
      handleUpdate(updates);
    } else {
      handleUpdate({ [key]: arr });
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mt-4">
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button onClick={() => setActiveTab('summary')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'summary' ? 'bg-white text-indigo-700 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-100'}`}>
          <FileText className="w-4 h-4" />
          {isAr ? 'الملخص والتشخيص' : 'Summary & ICD-10'}
        </button>
        <button onClick={() => setActiveTab('rx')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'rx' ? 'bg-white text-emerald-700 border-b-2 border-emerald-600' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Pill className="w-4 h-4" />
          {isAr ? 'روشتة إلكترونية' : 'E-Prescription'}
        </button>
        <button onClick={() => setActiveTab('labs')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'labs' ? 'bg-white text-rose-700 border-b-2 border-rose-600' : 'text-slate-500 hover:bg-slate-100'}`}>
          <FlaskConical className="w-4 h-4" />
          {isAr ? 'التحاليل الطبية' : 'Laboratory'}
        </button>
        <button onClick={() => setActiveTab('rad')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'rad' ? 'bg-white text-amber-700 border-b-2 border-amber-600' : 'text-slate-500 hover:bg-slate-100'}`}>
          <ActivitySquare className="w-4 h-4" />
          {isAr ? 'الأشعة والتصوير' : 'Radiology'}
        </button>
        <button onClick={() => setActiveTab('billing')} className={`px-4 py-3 text-xs font-bold whitespace-nowrap flex items-center gap-2 transition ${activeTab === 'billing' ? 'bg-white text-blue-700 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}>
          <Receipt className="w-4 h-4" />
          {isAr ? 'الحسابات والتسوية' : 'Billing & Settlement'}
        </button>
      </div>

      <div className="p-4 bg-white min-h-[300px] max-h-[500px] overflow-y-auto">
        {activeTab === 'summary' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? 'نوع الخروج' : 'Discharge Type'}</label>
                <select 
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  value={data.dischargeType}
                  onChange={(e) => handleUpdate({ dischargeType: e.target.value })}
                >
                  <option value="routine">{isAr ? 'خروج تحسن (طبيعي)' : 'Routine Discharge'}</option>
                  <option value="dama">{isAr ? 'خروج على مسؤولية المريض (DAMA)' : 'Discharge Against Medical Advice'}</option>
                  <option value="transfer">{isAr ? 'تحويل لمستشفى آخر' : 'Transfer to another facility'}</option>
                  <option value="deceased">{isAr ? 'وفاة' : 'Deceased'}</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? 'تاريخ المراجعة' : 'Follow-up Date'}</label>
                  <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500" value={data.followUpDate} onChange={e => handleUpdate({ followUpDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">{isAr ? 'عيادة المراجعة' : 'Follow-up Clinic'}</label>
                  <input type="text" placeholder={isAr ? 'مثال: الباطنة' : 'e.g. Internal Med'} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500" value={data.followUpClinic} onChange={e => handleUpdate({ followUpClinic: e.target.value })} />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><Activity className="w-4 h-4 text-indigo-500" /> {isAr ? 'التشخيصات (ICD-10)' : 'Diagnoses (ICD-10)'}</h3>
                <button onClick={addICDCode} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> {isAr ? 'إضافة تشخيص' : 'Add Diagnosis'}
                </button>
              </div>
              <div className="space-y-3">
                {data.icdCodes.length === 0 ? <p className="text-xs text-slate-500 italic text-center py-4">{isAr ? 'لا يوجد تشخيصات مضافة' : 'No diagnoses added'}</p> : data.icdCodes.map((item, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="relative w-32">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-2.5" />
                      <input type="text" placeholder="ICD Code" className="w-full border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-sm focus:border-indigo-500" value={item.code} onChange={e => updateArrayItem('icdCodes', idx, 'code', e.target.value)} />
                    </div>
                    <input type="text" placeholder={isAr ? 'وصف التشخيص' : 'Diagnosis Description'} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-indigo-500" value={item.description} onChange={e => updateArrayItem('icdCodes', idx, 'description', e.target.value)} />
                    <button onClick={() => removeArrayItem('icdCodes', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rx' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-emerald-800 flex items-center gap-2"><Pill className="w-4 h-4 text-emerald-500" /> {isAr ? 'الروشتة الإلكترونية الاحترافية' : 'Pro E-Prescription'}</h3>
              <button onClick={addMedication} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold hover:bg-emerald-100 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> {isAr ? 'إضافة دواء' : 'Add Medication'}
              </button>
            </div>
            <div className="space-y-3">
              {data.medications.length === 0 ? <p className="text-xs text-slate-500 italic text-center py-4">{isAr ? 'لا يوجد أدوية في الروشتة' : 'No medications prescribed'}</p> : data.medications.map((item, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex gap-2 mb-2">
                    <input type="text" placeholder={isAr ? 'اسم الدواء (مثل: Panadol 500mg)' : 'Medication Name'} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500" value={item.name} onChange={e => updateArrayItem('medications', idx, 'name', e.target.value)} />
                    <button onClick={() => removeArrayItem('medications', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    <input type="text" placeholder={isAr ? 'الجرعة (حبة كل 8 ساعات)' : 'Dose (e.g. 1 tab q8h)'} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-emerald-500" value={item.dose} onChange={e => updateArrayItem('medications', idx, 'dose', e.target.value)} />
                    <input type="text" placeholder={isAr ? 'طريقة التعاطي (فموي)' : 'Route (e.g. PO)'} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-emerald-500" value={item.route} onChange={e => updateArrayItem('medications', idx, 'route', e.target.value)} />
                    <input type="text" placeholder={isAr ? 'المدة (5 أيام)' : 'Duration (e.g. 5 days)'} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:border-emerald-500" value={item.duration} onChange={e => updateArrayItem('medications', idx, 'duration', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'labs' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-rose-800 flex items-center gap-2"><FlaskConical className="w-4 h-4 text-rose-500" /> {isAr ? 'طلب تحاليل طبية' : 'Order Lab Tests'}</h3>
              <button onClick={addLab} className="px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> {isAr ? 'إضافة تحليل' : 'Add Test'}
              </button>
            </div>
            <div className="space-y-3">
              {data.labs.length === 0 ? <p className="text-xs text-slate-500 italic text-center py-4">{isAr ? 'لم يتم طلب تحاليل' : 'No lab tests ordered'}</p> : data.labs.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input type="text" placeholder={isAr ? 'اسم التحليل (مثل: CBC, LFT)' : 'Test Name (e.g. CBC)'} className="w-1/3 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-rose-500" value={item.name} onChange={e => updateArrayItem('labs', idx, 'name', e.target.value)} />
                  <input type="text" placeholder={isAr ? 'ملاحظات للمختبر' : 'Lab notes'} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-rose-500" value={item.notes} onChange={e => updateArrayItem('labs', idx, 'notes', e.target.value)} />
                  <button onClick={() => removeArrayItem('labs', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'rad' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-amber-800 flex items-center gap-2"><ActivitySquare className="w-4 h-4 text-amber-500" /> {isAr ? 'طلب أشعة وتصوير' : 'Order Radiology'}</h3>
              <button onClick={addRadiology} className="px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-100 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> {isAr ? 'إضافة أشعة' : 'Add Radiology'}
              </button>
            </div>
            <div className="space-y-3">
              {data.radiology.length === 0 ? <p className="text-xs text-slate-500 italic text-center py-4">{isAr ? 'لم يتم طلب أشعة' : 'No radiology ordered'}</p> : data.radiology.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <select className="w-1/4 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-amber-500" value={item.type} onChange={e => updateArrayItem('radiology', idx, 'type', e.target.value)}>
                    <option value="">{isAr ? 'النوع...' : 'Type...'}</option>
                    <option value="X-Ray">X-Ray (أشعة سينية)</option>
                    <option value="CT">CT Scan (مقطعية)</option>
                    <option value="MRI">MRI (رنين مغناطيسي)</option>
                    <option value="US">Ultrasound (موجات صوتية)</option>
                  </select>
                  <input type="text" placeholder={isAr ? 'الجزء المستهدف (مثل: Chest)' : 'Body Part (e.g. Chest)'} className="w-1/4 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-amber-500" value={item.bodyPart} onChange={e => updateArrayItem('radiology', idx, 'bodyPart', e.target.value)} />
                  <input type="text" placeholder={isAr ? 'ملاحظات وتاريخ مرضي' : 'Clinical notes'} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-amber-500" value={item.notes} onChange={e => updateArrayItem('radiology', idx, 'notes', e.target.value)} />
                  <button onClick={() => removeArrayItem('radiology', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-blue-800 flex items-center gap-2"><Receipt className="w-4 h-4 text-blue-500" /> {isAr ? 'إدارة الفواتير والخدمات' : 'Billing & Services'}</h3>
              <button onClick={addService} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> {isAr ? 'إضافة خدمة/مستلزم' : 'Add Service/Item'}
              </button>
            </div>
            
            <div className="mb-4 space-y-2 max-h-48 overflow-y-auto pr-2">
              {data.services.length === 0 ? <p className="text-xs text-slate-500 italic text-center py-4">{isAr ? 'لا يوجد خدمات مضافة للفاتورة' : 'No services billed'}</p> : data.services.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input type="text" placeholder={isAr ? 'اسم الخدمة (كشف، إقامة، مستلزمات)' : 'Service Name'} className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:border-blue-500" value={item.name} onChange={e => updateArrayItem('services', idx, 'name', e.target.value)} />
                  <div className="relative w-32">
                    <input type="number" className="w-full border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-sm text-right font-mono focus:border-blue-500" value={item.price} onChange={e => updateArrayItem('services', idx, 'price', e.target.value)} />
                    <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">{isAr ? 'ر.س' : 'SAR'}</span>
                  </div>
                  <button onClick={() => removeArrayItem('services', idx)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>

            <div className="bg-slate-800 rounded-xl p-4 text-white">
              <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-700">
                <span className="text-sm text-slate-300">{isAr ? 'إجمالي الفاتورة' : 'Total Amount'}</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{data.totalAmount.toFixed(2)} {isAr ? 'ر.س' : 'SAR'}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-slate-300">{isAr ? 'المبلغ المسدد' : 'Paid Amount'}</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="number" 
                    className="w-24 bg-slate-900 border border-slate-600 rounded px-2 py-1 text-sm text-right font-mono focus:border-emerald-500 outline-none text-white" 
                    value={data.paidAmount} 
                    onChange={e => {
                      const paid = Number(e.target.value);
                      const status = paid >= data.totalAmount ? 'paid' : (paid > 0 ? 'partial' : 'unpaid');
                      handleUpdate({ paidAmount: paid, paymentStatus: status });
                    }} 
                  />
                  <span className="text-xs">{isAr ? 'ر.س' : 'SAR'}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-bold text-slate-400">{isAr ? 'حالة الدفع:' : 'Payment Status:'}</span>
                {data.paymentStatus === 'paid' ? (
                  <span className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" /> {isAr ? 'مسددة بالكامل' : 'Fully Paid'}
                  </span>
                ) : data.paymentStatus === 'partial' ? (
                  <span className="flex items-center gap-1 text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full text-xs font-bold">
                    <ActivitySquare className="w-4 h-4" /> {isAr ? 'سداد جزئي' : 'Partially Paid'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-rose-400 bg-rose-400/10 px-3 py-1 rounded-full text-xs font-bold">
                    <Receipt className="w-4 h-4" /> {isAr ? 'غير مسددة' : 'Unpaid'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
