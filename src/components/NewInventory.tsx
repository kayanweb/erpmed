import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Package, Plus, Search, RotateCw, AlertTriangle, CheckCircle, Eye, Layers } from 'lucide-react';

export default function NewInventory({ language }: { language?: 'ar' | 'en' } = {}) {
    const [inventory, setInventory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [storeFilter, setStoreFilter] = useState('All');

    // Add item form state
    const [itemName, setItemName] = useState('');
    const [storeName, setStoreName] = useState('Operations Store');
    const [currentQty, setCurrentQty] = useState<number>(50);
    const [minQty, setMinQty] = useState<number>(10);
    const [isSaving, setIsSaving] = useState(false);
    
    useEffect(() => {
        loadData();
    }, []);
    
    const loadData = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/inventory');
            if (response.ok) {
                const data = await response.json();
                setInventory(data || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!itemName.trim()) {
            toast.error('الرجاء إدخال اسم المادة');
            return;
        }

        try {
            setIsSaving(true);
            const newItem = {
                id: 'inv_' + Date.now().toString(),
                itemName: itemName.trim(),
                store: storeName,
                currentQuantity: currentQty.toString(),
                minQuantity: minQty.toString(),
                lastUpdated: new Date().toISOString()
            };

            const response = await fetch('/api/inventory/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            });

            if (response.ok) {
                toast.success(`تم إضافة المادة ${itemName} إلى المخزون بنجاح`);
                setItemName('');
                setCurrentQty(50);
                setMinQty(10);
                await loadData();
            } else {
                toast.error('فشل حفظ المادة في المخزون');
            }
        } catch (err) {
            console.error('Error adding item:', err);
            toast.error('خطأ في الاتصال بالخادم');
        } finally {
            setIsSaving(false);
        }
    };
    
    const filteredInventory = inventory.filter(item => {
        const matchesSearch = (item.itemName || item.item_name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStore = storeFilter === 'All' || item.store === storeFilter;
        return matchesSearch && matchesStore;
    });

    const uniqueStores = ['All', ...new Set(inventory.map(item => item.store).filter(Boolean))];

    return (
        <div className="max-w-7xl mx-auto p-6 font-sans space-y-6" dir="rtl">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Layers className="h-6 w-6 text-cyan-600" />
                        <span>نظام إدارة المخزون الموحد المتطور V2</span>
                    </h1>
                    <p className="text-slate-500 text-xs mt-1">مراقبة المخزون الطبي اللوجستي، التنبيهات الذكية لنقص المواد، ومستويات الأمان للمستودعات</p>
                </div>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={loadData}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm cursor-pointer text-sm font-semibold"
                    >
                        <RotateCw className="h-4 w-4 animate-spin-hover" />
                        <span>تحديث القائمة</span>
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 block">إجمالي المواد المسجلة</span>
                    <span className="text-2xl font-bold text-slate-900 font-mono mt-1 block">{inventory.length}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 block">المواد المتوفرة بالكامل</span>
                    <span className="text-2xl font-bold text-emerald-600 font-mono mt-1 block">
                        {inventory.filter(i => parseFloat(i.currentQuantity || i.current_quantity) > parseFloat(i.minQuantity || i.min_quantity)).length}
                    </span>
                </div>
                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-amber-900">
                    <span className="text-xs font-bold text-amber-700 block flex items-center gap-1">
                        <AlertTriangle className="h-3.5 w-3.5" />
                        <span>تحذير: مواد أوشكت على النفاد</span>
                    </span>
                    <span className="text-2xl font-bold font-mono mt-1 block">
                        {inventory.filter(i => parseFloat(i.currentQuantity || i.current_quantity) <= parseFloat(i.minQuantity || i.min_quantity)).length}
                    </span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-500 block">عدد المستودعات النشطة</span>
                    <span className="text-2xl font-bold text-indigo-600 font-mono mt-1 block">
                        {new Set(inventory.map(i => i.store)).size}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Add Material Form */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Plus className="h-5 w-5 text-cyan-600" />
                        <span>إضافة صنف/مادة جديدة للمستودع</span>
                    </h2>

                    <form onSubmit={handleAddItem} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المادة الطبية:</label>
                            <input
                                type="text"
                                value={itemName}
                                onChange={(e) => setItemName(e.target.value)}
                                placeholder="مثال: قطن طبي معقم، قفازات لاتكس"
                                className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">المستودع الرئيسي:</label>
                            <select
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                            >
                                <option value="Operations Store">مستودع العمليات (Operations Store)</option>
                                <option value="Main Medical Store">المستودع الرئيسي (Main Medical Store)</option>
                                <option value="ER Sub-store">مستودع الطوارئ (ER Sub-store)</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">الكمية الابتدائية:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={currentQty}
                                    onChange={(e) => setCurrentQty(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold font-mono text-center"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">الحد الأدنى للتنبيه:</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={minQty}
                                    onChange={(e) => setMinQty(Math.max(0, parseInt(e.target.value) || 0))}
                                    className="w-full bg-white border border-slate-300 rounded-lg py-2 px-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold font-mono text-center"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-sm py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed cursor-pointer mt-2"
                        >
                            {isSaving ? 'جاري الحفظ والجدولة...' : 'إضافة المادة للمخزون'}
                        </button>
                    </form>
                </div>

                {/* Right Side: Inventory List & Search */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm lg:col-span-2 space-y-4">
                    {/* Search and Filters */}
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <Search className="h-4 w-4" />
                            </span>
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ابحث باسم المادة الطبية..."
                                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg py-2 pr-9 pl-3 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-semibold"
                            />
                        </div>

                        <select
                            value={storeFilter}
                            onChange={(e) => setStoreFilter(e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-xs font-bold text-slate-700 shadow-sm cursor-pointer"
                        >
                            <option value="All">كل المستودعات</option>
                            <option value="Operations Store">مستودع العمليات</option>
                            <option value="Main Medical Store">المستودع الرئيسي</option>
                            <option value="ER Sub-store">مستودع الطوارئ الفرعي</option>
                        </select>
                    </div>

                    {/* Table View */}
                    <div className="overflow-x-auto border border-slate-100 rounded-xl">
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50">
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500">اسم المادة الطبية</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500">المستودع</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center">الكمية الحالية</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center">الحد الأدنى للحماية</th>
                                    <th className="py-3 px-4 text-xs font-bold text-slate-500 text-center">الحالة الإمدادية</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            جاري الاتصال بقاعدة البيانات اللوجستية...
                                        </td>
                                    </tr>
                                ) : filteredInventory.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm font-semibold">
                                            لا توجد مواد تطابق معايير البحث والفلترة في المخزون
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item, idx) => {
                                        const qty = parseFloat(item.currentQuantity || item.current_quantity || 0);
                                        const min = parseFloat(item.minQuantity || item.min_quantity || 0);
                                        const isLowStock = qty <= min;

                                        return (
                                            <tr key={item.id ? `${item.id}-${idx}` : `inv-item-${idx}`} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                <td className="py-3.5 px-4 font-bold text-slate-800 text-sm flex items-center gap-2">
                                                    <Package className="h-4 w-4 text-slate-400" />
                                                    <span>{item.itemName || item.item_name}</span>
                                                </td>
                                                <td className="py-3.5 px-4 text-slate-500 text-xs font-semibold">{item.store}</td>
                                                <td className="py-3.5 px-4 text-center font-bold font-mono text-sm">
                                                    <span className={isLowStock ? 'text-rose-600' : 'text-emerald-600'}>
                                                        {qty} وحدة
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-center text-xs font-mono text-slate-500 font-semibold">{min} وحدة</td>
                                                <td className="py-3.5 px-4 text-center">
                                                    {isLowStock ? (
                                                        <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded border border-rose-100">
                                                            <AlertTriangle className="h-3 w-3" />
                                                            <span>مخزون منخفض جداً</span>
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded border border-emerald-100">
                                                            <CheckCircle className="h-3 w-3" />
                                                            <span>آمن ومتوفر</span>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
