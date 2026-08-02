import React, { useState } from "react";
import { 
  Share2, QrCode, Disc, HardDrive, Link, Copy, Check, Download, X, Eye
} from "lucide-react";
import QRCode from "react-qr-code";
import { RadiologyStudy } from "../../types/radiology";
import { toast } from "sonner";

interface DistributionModalProps {
  study: RadiologyStudy;
  isAr: boolean;
  onClose: () => void;
}

export const DistributionModal: React.FC<DistributionModalProps> = ({
  study,
  isAr,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<"portal" | "media" | "link">("portal");
  const [copied, setCopied] = useState(false);

  const portalUrl = `https://hospital.portal.med/pacs/viewer?accession=${study.id}&token=${Math.random().toString(36).substring(2, 10)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    toast.success(isAr ? "تم نسخ الرابط الآمن لمشاركة الصور" : "Secure tokenized PACS link copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBurnMedia = (type: "CD" | "USB") => {
    toast.success(isAr ? `جاري تجهيز حزمة ISO وتصدير الصور إلى ${type}...` : `Preparing DICOM Web ISO export package for ${type}...`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden text-slate-800" dir={isAr ? "rtl" : "ltr"}>
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                {isAr ? "توزيع الصور والتقارير الطبية (Image Distribution)" : "PACS Image & Report Distribution"}
              </h2>
              <p className="text-xs text-slate-400">
                Patient: {study.patientName} • Study #{study.id}
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button 
            onClick={() => setActiveTab("portal")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'portal' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <QrCode className="w-4 h-4" />
            {isAr ? "رمز QR للبوابة" : "Patient Portal QR"}
          </button>
          <button 
            onClick={() => setActiveTab("link")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'link' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Link className="w-4 h-4" />
            {isAr ? "رابط مشفر آمن" : "Secure Token Link"}
          </button>
          <button 
            onClick={() => setActiveTab("media")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'media' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <Disc className="w-4 h-4" />
            {isAr ? "نسخ CD / USB" : "CD / USB Export"}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "portal" && (
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-md">
                <QRCode value={portalUrl} size={160} />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">
                  {isAr ? "امسح الرمز لاستعراض الصور على الهاتف المحمول" : "Scan QR Code for Mobile DICOM Viewing"}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  {isAr ? "يتيح للمريض أو الطبيب الاستشاري الخارجي الوصول الآمن الفوري للدراسة والتقرير المعتمد" : "Provides zero-footprint web viewer access directly from patient smartphone"}
                </p>
              </div>
            </div>
          )}

          {activeTab === "link" && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-600 block">
                {isAr ? "الرابط الآمن المحدد بصلاحية إكسير مؤقتة:" : "Tokenized Link (Expires in 7 days):"}
              </label>
              <div className="flex items-center gap-2">
                <input 
                  type="text"
                  readOnly
                  value={portalUrl}
                  className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none"
                />
                <button 
                  onClick={handleCopy}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? (isAr ? "تم النسخ" : "Copied") : (isAr ? "نسخ" : "Copy")}
                </button>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleBurnMedia("CD")}
                className="p-6 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl flex flex-col items-center text-center gap-3 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <Disc className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{isAr ? "حرق على قرص طـبي CD/DVD" : "Burn to Medical CD/DVD"}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">Includes DICOM Lite Viewer</p>
                </div>
              </button>

              <button 
                onClick={() => handleBurnMedia("USB")}
                className="p-6 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-2xl flex flex-col items-center text-center gap-3 transition-all group"
              >
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
                  <HardDrive className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900">{isAr ? "تصدير إلى ذاكرة USB" : "Export to USB Drive"}</h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">High Speed Portable Folder</p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-100"
          >
            {isAr ? "إغلاق" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
};
