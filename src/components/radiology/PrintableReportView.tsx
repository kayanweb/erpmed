import React from "react";
import { Printer, ShieldCheck, FileText, CheckCircle2, X } from "lucide-react";
import { RadiologyReport, RadiologyStudy } from "../../types/radiology";

interface PrintableReportViewProps {
  report: RadiologyReport;
  study?: RadiologyStudy;
  isAr: boolean;
  onClose: () => void;
}

export const PrintableReportView: React.FC<PrintableReportViewProps> = ({
  report,
  study,
  isAr,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden text-slate-800 flex flex-col max-h-[90vh]" dir={isAr ? "rtl" : "ltr"}>
        {/* Top Control Bar */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {isAr ? "معاينة التقرير الطباعي المعتمد" : "Official Diagnostic Radiology Report"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
            >
              <Printer className="w-4 h-4" />
              {isAr ? "طباعة التقرير (PDF)" : "Print / Export PDF"}
            </button>
            <button 
              onClick={onClose}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Paper */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 font-serif leading-relaxed bg-white text-slate-900">
          {/* Official Hospital Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-black tracking-tight font-sans text-slate-900">
                مستشفى الرعاية المتقدمة للجامعات الطبية
              </h1>
              <h2 className="text-xs font-bold tracking-widest text-slate-500 uppercase font-sans mt-0.5">
                ENTERPRISE MEDICAL CENTER • RADIOLOGY & PACS DEPARTMENT
              </h2>
            </div>
            <div className="text-right font-sans text-xs">
              <div className="font-bold text-slate-900">ACCESSION #: {report.studyId}</div>
              <div className="text-slate-500 font-mono text-[10px]">VERIFIED DICOM SR</div>
            </div>
          </div>

          {/* Patient Details Grid Box */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-sans">
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Patient Name / اسم المريض</span>
              <span className="font-black text-slate-900">{report.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">MRN / رقم الملف</span>
              <span className="font-bold font-mono text-slate-800">{study?.mrn || report.patientId}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Modality / التقنية</span>
              <span className="font-bold text-blue-700">{report.modality}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold text-[10px] uppercase">Date / التاريخ</span>
              <span className="font-mono font-bold text-slate-800">{report.signedAt.split('T')[0]}</span>
            </div>
          </div>

          {/* Procedure Title */}
          <div className="font-sans border-b border-slate-200 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">EXAMINATION PERFORMED</span>
            <h3 className="text-base font-black text-slate-900 mt-0.5">{report.procedureName}</h3>
          </div>

          {/* Clinical History */}
          <div className="space-y-1">
            <h4 className="text-xs font-black font-sans uppercase tracking-wider text-slate-900">CLINICAL INDICATION & HISTORY:</h4>
            <p className="text-xs font-sans text-slate-700">{report.clinicalHistory}</p>
          </div>

          {/* Technique */}
          {report.technique && (
            <div className="space-y-1">
              <h4 className="text-xs font-black font-sans uppercase tracking-wider text-slate-900">TECHNIQUE:</h4>
              <p className="text-xs font-sans text-slate-700">{report.technique}</p>
            </div>
          )}

          {/* Detailed Findings */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <h4 className="text-xs font-black font-sans uppercase tracking-wider text-slate-900">FINDINGS:</h4>
            <div className="text-xs text-slate-800 whitespace-pre-line leading-relaxed font-sans">
              {report.findings}
            </div>
          </div>

          {/* Impression / Conclusion Box */}
          <div className="p-4 bg-slate-50 border-l-4 border-slate-900 rounded-r-xl space-y-1 font-sans">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">IMPRESSION:</h4>
            <p className="text-xs font-bold text-slate-900 whitespace-pre-line leading-relaxed">
              {report.impression}
            </p>
          </div>

          {/* Recommendations if present */}
          {report.recommendations && (
            <div className="space-y-1 font-sans">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">RECOMMENDATIONS:</h4>
              <p className="text-xs font-medium text-slate-700">{report.recommendations}</p>
            </div>
          )}

          {/* Digital Signature Footer */}
          <div className="pt-8 border-t border-slate-300 flex items-end justify-between font-sans text-xs">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>ELECTRONICALLY SIGNED AND VERIFIED</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                HASH: {report.digitalSignatureHash}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                TIMESTAMP: {report.signedAt}
              </div>
            </div>

            <div className="text-right">
              <div className="font-black text-slate-900 text-sm">{report.radiologistName}</div>
              <div className="text-slate-500 text-[11px] font-medium">{report.radiologistTitle}</div>
              <div className="text-slate-400 text-[10px] uppercase tracking-wider mt-1">Department of Diagnostic Radiology</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
