import React, { useState, useEffect } from "react";
import { Key, Shield, ShieldCheck, ShieldAlert, Monitor, CheckCircle2, RotateCw, Copy, Download, Upload, Server, Search, Check, AlertTriangle, FileText, Plus, Edit, X, Save, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  language: "ar" | "en";
}

export default function LicenseManagerDashboard({ language }: Props) {
  const isAr = language === "ar";
  const [hardwareId, setHardwareId] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [status, setStatus] = useState<"active" | "expired" | "unregistered" | "invalid">("active");
  const [isChecking, setIsChecking] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    serialNumber: "",
    licenseType: "Trial",
    expirationDate: ""
  });
  const [licenseInfo, setLicenseInfo] = useState({
    customerName: "Dr. Ahmed Clinic",
    email: "ahmed@example.com",
    serialNumber: "HIS-2026-9876-XYZ",
    licenseType: "Annual (Pro)",
    expirationDate: "2027-01-01",
    lastValidation: "2026-07-01 10:00 AM",
  });

  // Simulate hardware ID generation
  useEffect(() => {
    const generateHardwareFingerprint = async () => {
      // In a real app this would call a native bridge or use browser fingerprinting
      const rawId = `${navigator.userAgent}-${navigator.language}-${screen.width}x${screen.height}-${new Date().getTimezoneOffset()}`;
      // Simulate SHA256
      const sampleHash = "E3B0C44298FC1C149AFBF4C8996FB92427AE41E4649B934CA495991B7852B855".substring(0, 32);
      setHardwareId(`HWID-${sampleHash}`);
    };
    generateHardwareFingerprint();
  }, []);

  const handleActivate = () => {
    if (!licenseKey.trim()) {
      toast.error(isAr ? "يرجى إدخال مفتاح التفعيل" : "Please enter a license key");
      return;
    }
    
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      if (licenseKey.length > 10) {
        setStatus("active");
        toast.success(isAr ? "تم تفعيل الترخيص بنجاح" : "License activated successfully");
      } else {
        setStatus("invalid");
        toast.error(isAr ? "مفتاح الترخيص غير صالح" : "Invalid license key");
      }
    }, 1500);
  };

  const handleCheckServer = () => {
    setIsChecking(true);
    setTimeout(() => {
      setIsChecking(false);
      toast.success(isAr ? "الترخيص متزامن مع الخادم" : "License is synced with server");
    }, 1500);
  };

  const handleCopyHWID = () => {
    navigator.clipboard.writeText(hardwareId);
    toast.success(isAr ? "تم نسخ بصمة الجهاز" : "Hardware ID copied to clipboard");
  };

  const openAddModal = () => {
    setFormData({
      customerName: "",
      email: "",
      serialNumber: "",
      licenseType: "Trial",
      expirationDate: ""
    });
    setShowAddModal(true);
  };

  const openEditModal = () => {
    setFormData({
      customerName: licenseInfo.customerName,
      email: licenseInfo.email,
      serialNumber: licenseInfo.serialNumber,
      licenseType: licenseInfo.licenseType,
      expirationDate: licenseInfo.expirationDate
    });
    setShowEditModal(true);
  };

  const generateNewSerial = () => {
    const newSerial = `HIS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
    setFormData({ ...formData, serialNumber: newSerial });
  };

  const handleSaveAdd = () => {
    setLicenseInfo({
      ...licenseInfo,
      customerName: formData.customerName,
      email: formData.email,
      serialNumber: formData.serialNumber,
      licenseType: formData.licenseType,
      expirationDate: formData.expirationDate || "Never"
    });
    setStatus("unregistered");
    setShowAddModal(false);
    toast.success(isAr ? "تم إضافة التراخيص الأولية بنجاح" : "Initial license details added successfully");
  };

  const handleSaveEdit = () => {
    setLicenseInfo({
      ...licenseInfo,
      customerName: formData.customerName,
      email: formData.email,
      serialNumber: formData.serialNumber,
      licenseType: formData.licenseType,
      expirationDate: formData.expirationDate || "Never"
    });
    setShowEditModal(false);
    toast.success(isAr ? "تم تعديل التراخيص بنجاح" : "License details updated successfully");
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 font-sans" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4 flex flex-col md:flex-row items-start md:items-center justify-between shrink-0 shadow-sm gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 flex items-center justify-center rounded-xl">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              {isAr ? "مدير التراخيص (License Manager)" : "License Manager"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "إدارة التراخيص والتفعيل" : "Manage system licenses and activation"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-bold rounded-lg hover:bg-slate-900 transition shadow-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {isAr ? "إضافة ترخيص" : "Add License"}
          </button>
          
          {status === "active" ? (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black flex items-center gap-2 border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
              {isAr ? "الترخيص فعال" : "License Active"}
            </span>
          ) : status === "expired" ? (
            <span className="px-3 py-1.5 bg-rose-100 text-rose-800 rounded-lg text-xs font-black flex items-center gap-2 border border-rose-200">
              <ShieldAlert className="w-4 h-4" />
              {isAr ? "الترخيص منتهي" : "License Expired"}
            </span>
          ) : (
            <span className="px-3 py-1.5 bg-amber-100 text-amber-800 rounded-lg text-xs font-black flex items-center gap-2 border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
              {isAr ? "غير مفعل" : "Unregistered"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Activation Box */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-600" />
              {isAr ? "تفعيل النظام" : "System Activation"}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <input 
                type="text" 
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                placeholder="XXXXX-XXXXX-XXXXX-XXXXX"
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-mono focus:ring-2 focus:ring-indigo-500 outline-none uppercase tracking-widest w-full"
              />
              <button 
                onClick={handleActivate}
                disabled={isChecking}
                className="w-full sm:w-auto justify-center px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-70"
              >
                {isChecking ? <RotateCw className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {isAr ? "تفعيل" : "Activate"}
              </button>
            </div>
          </div>

          {/* Device & License Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-slate-500" />
                {isAr ? "بصمة الجهاز (Hardware Fingerprint)" : "Device Fingerprint"}
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center group">
                  <div>
                    <p className="text-xs font-bold text-slate-500 mb-1">{isAr ? "المعرف الفريد (HWID)" : "Hardware ID (HWID)"}</p>
                    <p className="font-mono text-sm font-black text-slate-800">{hardwareId || "Generating..."}</p>
                  </div>
                  <button onClick={handleCopyHWID} className="p-2 bg-white text-slate-500 rounded-lg border border-slate-200 shadow-xs hover:text-indigo-600 hover:border-indigo-200 transition opacity-0 group-hover:opacity-100">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 mt-4">
                  <button onClick={() => toast.success(isAr ? "تم تصدير ملف الطلب بنجاح" : "Request file exported successfully")} className="flex-1 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" />
                    {isAr ? "تصدير ملف الطلب" : "Export Request"}
                  </button>
                  <button onClick={() => toast.success(isAr ? "تم استيراد التفعيل بنجاح" : "License imported successfully")} className="flex-1 py-2 bg-slate-100 text-slate-700 text-sm font-bold rounded-lg hover:bg-slate-200 transition flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    {isAr ? "استيراد التفعيل" : "Import License"}
                  </button>
                </div>
                <p className="text-xs font-semibold text-slate-400 leading-relaxed">
                  {isAr 
                    ? "لتفعيل النظام بدون إنترنت (Offline)، قم بتصدير ملف الطلب وإرساله للدعم الفني، ثم استورد ملف التفعيل هنا."
                    : "For offline activation, export the request file and send it to support, then import the received license file here."}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-slate-500" />
                  {isAr ? "تفاصيل الترخيص" : "License Details"}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={openEditModal} className="text-slate-500 hover:text-indigo-600 p-1 hover:bg-indigo-50 rounded transition">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={handleCheckServer} disabled={isChecking} className="text-indigo-600 hover:text-indigo-800 p-1 bg-indigo-50 rounded">
                    <RotateCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </h3>
              
              <div className="space-y-3">
                <DetailRow label={isAr ? "العميل" : "Customer Name"} value={licenseInfo.customerName} />
                <DetailRow label={isAr ? "السيريال" : "Serial Number"} value={licenseInfo.serialNumber} />
                <DetailRow label={isAr ? "نوع الترخيص" : "License Type"} value={licenseInfo.licenseType} />
                <DetailRow label={isAr ? "تاريخ الانتهاء" : "Expiration Date"} value={licenseInfo.expirationDate} highlight={status === "active"} />
                <DetailRow label={isAr ? "آخر مزامنة" : "Last Validation"} value={licenseInfo.lastValidation} />
              </div>
            </div>
          </div>
          
          {/* Logs */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">
                {isAr ? "سجل العمليات (Validation Logs)" : "Validation Logs"}
             </h3>
             <div className="space-y-2">
               <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono flex items-center justify-between border border-slate-100">
                 <span className="text-slate-500">2026-07-01 10:00:05</span>
                 <span className="font-bold text-slate-700">Validated against server: OK</span>
                 <span className="text-emerald-600 font-bold">SUCCESS</span>
               </div>
               <div className="p-3 bg-slate-50 rounded-lg text-xs font-mono flex items-center justify-between border border-slate-100">
                 <span className="text-slate-500">2026-06-25 10:00:12</span>
                 <span className="font-bold text-slate-700">Validated against server: OK</span>
                 <span className="text-emerald-600 font-bold">SUCCESS</span>
               </div>
               <div className="p-3 bg-rose-50 rounded-lg text-xs font-mono flex items-center justify-between border border-rose-100">
                 <span className="text-slate-500">2026-06-18 10:00:00</span>
                 <span className="font-bold text-slate-700">No internet connection - using local token</span>
                 <span className="text-amber-600 font-bold">OFFLINE</span>
               </div>
             </div>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                  {showAddModal ? <Plus className="w-5 h-5 text-indigo-600" /> : <Edit className="w-5 h-5 text-indigo-600" />}
                  {showAddModal ? (isAr ? "إضافة تفاصيل الترخيص" : "Add License Details") : (isAr ? "تعديل بيانات الترخيص" : "Edit License Details")}
                </h3>
                <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-slate-400 hover:text-slate-600 hover:bg-slate-200 p-1 rounded-lg transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "اسم العميل" : "Customer Name"}</label>
                    <input 
                      type="text" 
                      value={formData.customerName} 
                      onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "البريد الإلكتروني" : "Email"}</label>
                    <input 
                      type="email" 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">{isAr ? "مفتاح الترخيص" : "License Key"}</label>
                  <div className="flex gap-2 min-w-max">
                    <input 
                      type="text" 
                      value={formData.serialNumber} 
                      onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none uppercase"
                    />
                    <button 
                      onClick={generateNewSerial}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg hover:bg-slate-200 transition border border-slate-200 flex items-center gap-2 whitespace-nowrap"
                    >
                      <RefreshCw className="w-4 h-4" />
                      {isAr ? "توليد مفتاح" : "Generate Key"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "نوع الترخيص" : "License Type"}</label>
                    <select 
                      value={formData.licenseType} 
                      onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    >
                      <option value="Trial">{isAr ? "تجريبي" : "Trial"}</option>
                      <option value="Annual">{isAr ? "سنوي" : "Annual"}</option>
                      <option value="Lifetime">{isAr ? "دائم" : "Lifetime"}</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">{isAr ? "تاريخ الانتهاء" : "Expiration Date"}</label>
                    <input 
                      type="date" 
                      value={formData.expirationDate} 
                      onChange={(e) => setFormData({...formData, expirationDate: e.target.value})}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2 shrink-0">
                <button 
                  onClick={() => { setShowAddModal(false); setShowEditModal(false); }}
                  className="px-4 py-2 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition"
                >
                  {isAr ? "إلغاء" : "Cancel"}
                </button>
                <button 
                  onClick={showAddModal ? handleSaveAdd : handleSaveEdit}
                  className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isAr ? "حفظ البيانات" : "Save Changes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DetailRow({ label, value, highlight = false }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className={`text-sm font-black ${highlight ? 'text-emerald-700' : 'text-slate-800'}`}>{value}</span>
    </div>
  );
}
