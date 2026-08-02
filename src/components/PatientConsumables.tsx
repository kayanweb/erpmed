import React, { useState, useEffect } from 'react';
import { getPatientWithConsumables, issueConsumable, getPatients } from '../services/api';
import { toast } from 'sonner';
import { User, ClipboardList, Plus, RotateCw, CheckCircle, Package, Layers } from 'lucide-react';

export default function PatientConsumables({ patientId: initialPatientId, language }: { patientId?: string; language?: 'ar' | 'en' }) {
    const [patientsList, setPatientsList] = useState<any[]>([]);
    const [selectedPatientId, setSelectedPatientId] = useState<string>(initialPatientId || 'p2');
    const [patient, setPatient] = useState<any>(null);
    const [consumables, setConsumables] = useState<any[]>([]);
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isIssuing, setIsIssuing] = useState(false);
    
    // Custom issuance form state
    const [itemName, setItemName] = useState('محقن معقم 5 مل');
    const [quantity, setQuantity] = useState(1);
    const [storeName, setStoreName] = useState('Operations Store');

    const popularItems = [
        { name: 'محقن معقم 5 مل', category: 'مستهلكات حقن' },
        { name: 'ضمادة لاصقة 10سم', category: 'مستلزمات جروح' },
        { name: 'قسطرة وريدية G20', category: 'مستلزمات محاليل' },
        { name: 'طقم جراحي معقم كامل', category: 'أدوات جراحة' },
        { name: 'شاش طبي معقم', category: 'مستلزمات جروح' },
    ];

    useEffect(() => {
        // Load the list of all patients first
        const loadPatients = async () => {
            try {
                const list = await getPatients();
                setPatientsList(list || []);
            } catch (err) {
                console.error('Error fetching patients list:', err);
            }
        };
        loadPatients();
    }, []);

    useEffect(() => {
        loadData();
        
        // Polling as a fallback for updates
        const interval = setInterval(() => {
            loadData();
        }, 5000);
        return () => clearInterval(interval);
    }, [selectedPatientId]);
    
    const loadData = async () => {
        try {
            const data = await getPatientWithConsumables(selectedPatientId);
            setPatient(data.patient);
            setConsumables(data.consumables || []);
            setInventory(data.inventory || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleIssueConsumable = async (itemToIssue: string, qtyToIssue: number) => {
        if (!itemToIssue.trim()) {
            toast.error('الرجاء إدخال اسم المستهلك');
            return;
        }
        if (qtyToIssue <= 0) {
            toast.error('الرجاء إدخال كمية صحيحة');
            return;
        }

        try {
            setIsIssuing(true);
            await issueConsumable({
                patientId: selectedPatientId,
                itemName: itemToIssue,
                quantity: qtyToIssue,
                store: storeName
            });
            toast.success(`تم صرف ${itemToIssue} (الكمية: ${qtyToIssue}) بنجاح`);
            await loadData();
        } catch (error) {
            toast.error('خطأ في صرف المستهلك');
        } finally {
            setIsIssuing(false);
        }
    };
    
    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            'Confirmed': 'bg-emerald-100 text-emerald-800 border-emerald-200',
            'Pending': 'bg-amber-100 text-amber-800 border-amber-200',
            'Cancelled': 'bg-rose-100 text-rose-800 border-rose-200',
            'Completed': 'bg-blue-100 text-blue-800 border-blue-200'
        };
        return colors[status] || 'bg-slate-100 text-slate-800 border-slate-200';
    };
    
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('ar-EG', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    return (
        <div className="max-w-7xl mx-auto p-6 font-sans space-y-6" dir="rtl">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Package className="h-6 w-6 text-indigo-600" />
                        <span>نظام إدارة وصرف المستهلكات الطبية</span>
                    </h1>
                    <p className="text-slate-500 text-xs mt-1">تتبع وصرف المستهلكات الطبية المباشرة لملفات المرضى المنومين وبالطوارئ</p>
                </div>

                {/* Patient Selector */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <label className="text-sm font-bold text-slate-700 whitespace-nowrap">اختر المريض:</label>
                    <select
                        value={selectedPatientId}
                        onChange={(e) => {
                            setLoading(true);
                            setSelectedPatientId(e.target.value);
                        }}
                        className="bg-white border border-slate-300 text-slate-900 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-semibold shadow-sm w-full md:w-64"
                    >
                        {patientsList.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name_ar || p.nameAr || p.name_en || p.name} ({p.id})
                            </option>
                        ))}
                    </select>
                    <button 
                        onClick={loadData}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 p-2 rounded-lg transition-colors shadow-sm cursor-pointer"
                        title="تحديث البيانات"
                    >
                        <RotateCw className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Patient Summary Card */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-3 rounded-lg text-indigo-700">
                        <User className="h-6 w-6" />
                    </div>
                    <div>
                        <span className="block text-xs font-bold text-slate-500">اسم المريض</span>
                        <span 
                            onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient?.mrn || patient?.id || selectedPatientId, patientName: patient?.name_ar || patient?.nameAr || patient?.name_en || patient?.name } }))}
                            className="text-base font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer transition block"
                            title="انقر لفتح الملف الطبي الكامل"
                        >
                            {patient?.name_ar || patient?.nameAr || patient?.name_en || patient?.name || 'مريض مجهول'}
                        </span>
                    </div>
                </div>

                <div>
                    <span className="block text-xs font-bold text-slate-500">الرقم الطبي (MRN)</span>
                    <span 
                        onClick={() => window.dispatchEvent(new CustomEvent("openPatientChart", { detail: { patientId: patient?.mrn || patient?.id || selectedPatientId, patientName: patient?.name_ar || patient?.nameAr || patient?.name_en || patient?.name } }))}
                        className="text-base font-mono font-bold text-indigo-700 hover:text-indigo-900 cursor-pointer transition block"
                        title="انقر لفتح الملف الطبي الكامل"
                    >
                        {patient?.mrn || 'N/A'}
                    </span>
                </div>

                <div>
                    <span className="block text-xs font-bold text-slate-500">موقع المريض / القسم</span>
                    <span className="text-base font-bold text-slate-900">{patient?.department || 'قسم الطوارئ / جناح التنويم'}</span>
                </div>

                <div>
                    <span className="block text-xs font-bold text-slate-500">حالة المريض الحالية</span>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold border ${
                        patient?.status === 'triage' || patient?.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                    }`}>
                        {patient?.status === 'triage' ? 'في الفرز الطبي' : patient?.status || 'نشط'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Issue New Consumable Form */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-5 h-fit">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Plus className="h-5 w-5 text-emerald-600" />
                        <span>طلب صرف مستهلك طبي</span>
                    </h2>

                    {/* Predefined Quick Buttons */}
                    <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-500">صرف سريع لمنتجات شائعة:</label>
                        <div className="grid grid-cols-1 gap-2">
                            {popularItems.map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                        setItemName(item.name);
                                        setQuantity(1);
                                    }}
                                    className="text-right text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 py-2 px-3 rounded-lg flex justify-between items-center transition-all cursor-pointer"
                                >
                                    <span className="font-semibold text-slate-800">{item.name}</span>
                                    <span className="text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-bold">{item.category}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-100 my-4" />

                    {/* Custom Issue Inputs */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المستهلك الطبي:</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder="مثال: محقن 5 مل"
                                className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">الكمية المطلوبة:</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold font-mono text-center"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">المستودع المصدر:</label>
                                <select
                                    value={storeName}
                                    onChange={(e) => setStoreName(e.target.value)}
                                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                                >
                                    <option value="Operations Store">مستودع العمليات</option>
                                    <option value="Main Medical Store">المستودع الرئيسي</option>
                                    <option value="ER Sub-store">مستودع الطوارئ الفرعي</option>
                                </select>
                            </div>
                        </div>

                        <button
                            type="button"
                            disabled={isIssuing}
                            onClick={() => handleIssueConsumable(itemName, quantity)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed cursor-pointer mt-2"
                        >
                            {isIssuing ? (
                                <>
                                    <RotateCw className="h-4 w-4 animate-spin" />
                                    <span>جاري المعالجة والصرف...</span>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4" />
                                    <span>تأكيد عملية الصرف الطبي</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Patient Consumables Transaction History */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <ClipboardList className="h-5 w-5 text-indigo-600" />
                            <span>سجل العمليات والمستهلكات المصروفة للمريض</span>
                        </h2>
                        <span className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">
                            {consumables.length} عمليات مسجلة
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500">اسم الصنف / المستهلك</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500">تاريخ الصرف</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500">الموقع والمستودع</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center">الكمية</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center">رقم القيد / المعاملة</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center">الحالة</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && consumables.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                                            جاري تحميل بيانات السجل المالي واللوجستي...
                                        </td>
                                    </tr>
                                ) : consumables.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400 text-sm font-semibold">
                                            لا توجد مستهلكات مقيدة للملف الطبي الحالي حتى الآن
                                        </td>
                                    </tr>
                                ) : (
                                    consumables.map((item, idx) => (
                                        <tr key={(item.transactionNo || item.transaction_no) ? `${item.transactionNo || item.transaction_no}-${idx}` : `cons-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                            <td className="py-3.5 px-4 font-bold text-slate-800 text-sm">{item.itemName || item.item_name}</td>
                                            <td className="py-3.5 px-4 text-slate-500 text-xs font-semibold">{formatDate(item.transactionDate || item.transaction_date)}</td>
                                            <td className="py-3.5 px-4 text-slate-500 text-xs font-semibold">{item.store || 'مستودع العمليات'}</td>
                                            <td className="py-3.5 px-4 text-center font-bold text-slate-900 text-sm font-mono">{item.quantity}</td>
                                            <td className="py-3.5 px-4 text-center text-xs font-mono text-indigo-600 font-semibold">{item.transactionNo || item.transaction_no}</td>
                                            <td className="py-3.5 px-4 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black border uppercase ${getStatusColor(item.status)}`}>
                                                    {item.status === 'Confirmed' ? 'مؤكدة' : item.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Calculations Summary Section */}
                    <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm mt-4">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-slate-500" />
                            <span className="text-slate-600 font-semibold">إجمالي الأصناف المختلفة:</span>
                            <span className="font-bold text-slate-900">{new Set(consumables.map(c => c.itemName || c.item_name)).size} أصناف</span>
                        </div>
                        <div className="w-[1px] bg-slate-200" />
                        <div className="flex items-center gap-2">
                            <span className="text-slate-600 font-semibold">إجمالي عدد القطع المصروفة:</span>
                            <span className="font-bold text-indigo-600 font-mono">
                                {consumables.reduce((sum, c) => sum + parseFloat(c.quantity || 0), 0)} وحدة
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
