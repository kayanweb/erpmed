import React, { useState, useRef } from "react";
import { 
  File, 
  Upload, 
  Image as ImageIcon, 
  FileText, 
  MoreVertical, 
  Download, 
  Trash2, 
  Eye, 
  ShieldCheck,
  Zap,
  Search,
  Filter
} from "lucide-react";
import { toast } from "sonner";

export interface PatientDocument {
  id: string;
  name: string;
  type: string; // pdf, dicom, image, word
  size: string;
  uploadDate: string;
  uploadedBy: string;
  category: string;
  status: "verified" | "pending" | "rejected";
  ocrText?: string;
  hasSignature: boolean;
}

const DEFAULT_DOCS: PatientDocument[] = [
  {
    id: "DOC-001",
    name: "Chest_XRay_PostOp.dcm",
    type: "dicom",
    size: "45.2 MB",
    uploadDate: "2026-06-25T14:30:00Z",
    uploadedBy: "Dr. Ahmed Youssef",
    category: "Radiology",
    status: "verified",
    hasSignature: false
  },
  {
    id: "DOC-002",
    name: "Insurance_Approval.pdf",
    type: "pdf",
    size: "1.2 MB",
    uploadDate: "2026-06-24T09:15:00Z",
    uploadedBy: "Admin Salem",
    category: "Billing",
    status: "verified",
    hasSignature: true
  },
  {
    id: "DOC-003",
    name: "Discharge_Summary.docx",
    type: "word",
    size: "850 KB",
    uploadDate: "2026-06-26T11:00:00Z",
    uploadedBy: "Nurse Fatima",
    category: "Clinical",
    status: "pending",
    hasSignature: true
  }
];

interface Props {
  patientId: string;
  language: "ar" | "en";
}

export const DocumentManager: React.FC<Props> = ({ patientId, language }) => {
  const isAr = language === "ar";
  const [docs, setDocs] = useState<PatientDocument[]>(DEFAULT_DOCS);
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    setIsUploading(true);
    // Mock upload delay
    setTimeout(() => {
      const newDoc: PatientDocument = {
        id: `DOC-${Date.now()}`,
        name: "New_Clinical_Report.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadDate: new Date().toISOString(),
        uploadedBy: "Current User",
        category: "Clinical",
        status: "pending",
        hasSignature: false
      };
      setDocs([newDoc, ...docs]);
      setIsUploading(false);
      toast.success(isAr ? "تم رفع الملف بنجاح" : "File uploaded successfully");
    }, 2000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "dicom": return <Zap className="w-5 h-5 text-indigo-600" />;
      case "image": return <ImageIcon className="w-5 h-5 text-rose-600" />;
      case "pdf": return <FileText className="w-5 h-5 text-red-600" />;
      default: return <File className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex-1 flex flex-col h-full min-h-0 overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <File className="w-6 h-6 text-indigo-600" />
            {isAr ? "إدارة المستندات والملفات" : "Document & File Manager"}
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {isAr ? "إدارة الأشعة، التحاليل، والموافقات الإلكترونية" : "Manage DICOM, PDFs, Images, and Electronic Consents"}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleUpload()}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? (isAr ? "جاري الرفع..." : "Uploading...") : (isAr ? "رفع ملف" : "Upload File")}
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 items-center justify-between bg-white">
        <div className="relative w-full sm:w-64">
           <Search className={`absolute ${isAr ? "right-3" : "left-3"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
           <input 
             type="text" 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             placeholder={isAr ? "بحث في الملفات..." : "Search documents..."}
             className={`w-full py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold ${isAr ? "pr-10" : "pl-10"} focus:ring-2 focus:ring-indigo-500 outline-none`}
           />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
           <Filter className="w-4 h-4 text-slate-400" />
           <select className="bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none">
              <option value="ALL">{isAr ? "كل الأقسام" : "All Categories"}</option>
              <option value="Radiology">Radiology</option>
              <option value="Clinical">Clinical</option>
              <option value="Billing">Billing</option>
           </select>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/30">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.filter(doc => {
            const q = searchTerm?.toLowerCase().trim();
            if (!q) return true;
            return (
              doc.name?.toLowerCase()?.includes(q) ||
              doc.id?.toLowerCase()?.includes(q) ||
              doc.category?.toLowerCase()?.includes(q) ||
              doc.uploadedBy?.toLowerCase()?.includes(q)
            );
          }).map(doc => (
            <div key={doc.id} className="group bg-white p-5 rounded-3xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50 transition-all cursor-pointer relative">
               <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 transition-colors">
                     {getIcon(doc.type)}
                  </div>
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg">
                     <MoreVertical className="w-4 h-4" />
                  </button>
               </div>

               <div className="space-y-1 mb-4">
                  <h4 className="text-sm font-black text-slate-800 truncate" title={doc.name}>{doc.name}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.category}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-[10px] font-bold text-slate-400">{doc.size}</span>
                  </div>
               </div>

               <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-1.5">
                    {doc.status === 'verified' ? (
                      <div className="flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 uppercase tracking-tight">
                         <ShieldCheck className="w-3 h-3" />
                         Verified
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 uppercase tracking-tight">
                         <Eye className="w-3 h-3" />
                         Review
                      </div>
                    )}
                    {doc.hasSignature && (
                      <div className="flex items-center gap-1 text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-tight">
                         Signed
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View"><Eye className="w-4 h-4" /></button>
                     <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Download"><Download className="w-4 h-4" /></button>
                     <button className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>

               {/* Quick Info Hover */}
               <div className="mt-3 text-[9px] text-slate-400 font-medium">
                  Uploaded by {doc.uploadedBy} • {new Date(doc.uploadDate).toLocaleDateString()}
               </div>
            </div>
          ))}
          
          {/* Add Card */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white p-6 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all cursor-pointer group"
          >
             <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                <PlusIcon className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
             </div>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-indigo-600 transition-colors">Add Document</span>
          </div>
        </div>
      </div>

      {/* Footer / OCR Status */}
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
         <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">OCR Engine Active</span>
            </div>
            <span className="text-[10px] text-slate-500 font-bold border-l border-slate-700 pl-4 uppercase tracking-widest">348 Pages Processed Today</span>
         </div>
         <button className="text-[10px] font-black bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl uppercase tracking-widest transition-all">
            Manage Encryption Keys
         </button>
      </div>
    </div>
  );
};

const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-0h6m-6 0H6" />
  </svg>
);
