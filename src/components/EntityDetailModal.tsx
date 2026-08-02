import React, { useState, useEffect } from "react";
import { 
  FileText, Activity, Clock, Paperclip, Shield, Edit, X, User, ArrowLeft, 
  Stethoscope, Receipt, AlertTriangle, Building, TestTube, Pill, Printer,
  BedDouble, Cpu, CheckSquare, Image as ImageIcon, ClipboardList, ShieldCheck, CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GlobalEntityLink } from "./GlobalEntityLink";
import { PatientChartModal } from "./PatientChartModal";
import { toast } from "sonner";

// ============================================================================
// ENTITY CONTEXT ENGINE (ECE) - REGISTRY & RENDERERS
// ============================================================================

// --- Patient Entity Renderer ---
const PatientRenderer = ({ entity, isAr, onClose }: any) => {
  return <PatientChartModal patientId={entity.id} patientName={entity.name || entity.nameAr} isAr={isAr} isEmbedded={true} onClose={onClose} />;
};

// --- Doctor Entity Renderer ---
const DoctorRenderer = ({ entity, isAr, onClose, config }: any) => {
  const [activeTab, setActiveTab] = useState("schedule");
  const Icon = config.icon;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                {isAr ? "طبيب استشاري" : "Senior Consultant"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ID: {entity.id || "MD-908"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">
            {isAr ? "مراسلة" : "Message"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 shrink-0">
        {[
          { id: "schedule", label: isAr ? "الجدول" : "Schedule" },
          { id: "patients", label: isAr ? "المرضى" : "Assigned Patients" },
          { id: "performance", label: isAr ? "الأداء" : "Performance" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "schedule" && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="font-bold text-slate-800 text-lg mb-4">{isAr ? "جدول العيادة والعمليات" : "Clinic & OR Schedule"}</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-l-emerald-500">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                  <div className="text-center">
                    <span className="block text-xl font-black text-slate-800">09:00</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">AM</span>
                  </div>
                  <div className="h-10 w-px bg-slate-200"></div>
                  <div>
                    <h4 className="font-bold text-slate-800">OPD Clinic 3 - Cardiology</h4>
                    <p className="text-sm text-slate-500">12 Patients Scheduled</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-100">In Progress</span>
              </div>
              
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-l-blue-500 opacity-60 hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
                  <div className="text-center">
                    <span className="block text-xl font-black text-slate-800">01:00</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">PM</span>
                  </div>
                  <div className="h-10 w-px bg-slate-200"></div>
                  <div>
                    <h4 className="font-bold text-slate-800">OR 4 - CABG Surgery</h4>
                    <p className="text-sm text-slate-500">Patient: MRN-99812</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">Upcoming</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "patients" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Patient</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <GlobalEntityLink entityId="MRN-1092" entityName="Ahmed Ali" entityType="patient" isAr={isAr} className="font-bold text-slate-800 hover:text-blue-600 block" />
                    <span className="text-xs text-slate-400">Age: 45 | Male</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-600">ICU Bed 4</td>
                  <td className="px-4 py-3"><span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded">Critical</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <GlobalEntityLink entityId="MRN-5541" entityName="Sara Khalid" entityType="patient" isAr={isAr} className="font-bold text-slate-800 hover:text-blue-600 block" />
                    <span className="text-xs text-slate-400">Age: 32 | Female</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-600">Ward A, Room 102</td>
                  <td className="px-4 py-3"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Stable</span></td>
                </tr>
              </tbody>
            </table>
</div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-4xl font-black text-blue-600 mb-2">98%</div>
              <div className="text-sm font-bold text-slate-600">Patient Satisfaction</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
              <div className="text-4xl font-black text-emerald-600 mb-2">12 mins</div>
              <div className="text-sm font-bold text-slate-600">Avg Wait Time</div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center col-span-2">
              <div className="text-4xl font-black text-indigo-600 mb-2">142</div>
              <div className="text-sm font-bold text-slate-600">Consultations This Month</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Lab Result Entity Renderer ---
const LabResultRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
                {isAr ? "نتيجة مختبرية" : "Lab Result Report"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">REQ-81923</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Complete Blood Count (CBC)"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center">
            Final Report
          </span>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            {isAr ? "طباعة" : "Print"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-700">Requested by: Dr. Sami (Cardiology)</p>
            <p className="text-xs text-slate-500 mt-1">Sample Collected: Today, 08:30 AM</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
              <tr>
                <th className="px-4 py-3">Test Component</th>
                <th className="px-4 py-3">Result</th>
                <th className="px-4 py-3">Flag</th>
                <th className="px-4 py-3">Ref. Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-medium">Hemoglobin (Hb)</td>
                <td className="px-4 py-3 font-mono font-bold text-rose-600">9.5 g/dL</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded">Low</span></td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">13.8 - 17.2</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">WBC Count</td>
                <td className="px-4 py-3 font-mono font-bold">7.2 x10^9/L</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">4.5 - 11.0</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium">Platelets</td>
                <td className="px-4 py-3 font-mono font-bold">250 x10^9/L</td>
                <td className="px-4 py-3">-</td>
                <td className="px-4 py-3 text-slate-500 font-mono text-xs">150 - 450</td>
              </tr>
            </tbody>
          </table>
</div>
        </div>
      </div>
    </div>
  );
};

// --- Invoice Entity Renderer ---
const InvoiceRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                {isAr ? "فاتورة مالية" : "Financial Invoice"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">INV-{entity.id || "009182"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Encounter Billing"}</h2>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="text-right">
            <div className="text-lg sm:text-2xl font-black text-slate-800">1,250.00 SR</div>
            <span className="text-[10px] font-bold text-amber-600">Pending Insurance</span>
          </div>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2 border-l border-slate-200 pl-4 ml-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            {isAr ? "طباعة" : "Print"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border-l border-slate-200 pl-4 ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
             <p className="text-sm font-bold text-slate-700">Billed to: Tawuniya Insurance (Class A)</p>
          </div>
          <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left">
            <thead className="bg-white border-b border-slate-100 font-bold text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-center">Qty</th>
                <th className="px-4 py-3 text-right">Unit Price</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-4 font-medium text-slate-800">Specialist Consultation (Cardiology)</td>
                <td className="px-4 py-4 text-center">1</td>
                <td className="px-4 py-4 text-right font-mono text-slate-500">350.00</td>
                <td className="px-4 py-4 text-right font-mono font-bold text-slate-800">350.00</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-slate-800">ECG - 12 Leads</td>
                <td className="px-4 py-4 text-center">1</td>
                <td className="px-4 py-4 text-right font-mono text-slate-500">150.00</td>
                <td className="px-4 py-4 text-right font-mono font-bold text-slate-800">150.00</td>
              </tr>
              <tr>
                <td className="px-4 py-4 font-medium text-slate-800">Complete Blood Count (CBC)</td>
                <td className="px-4 py-4 text-center">1</td>
                <td className="px-4 py-4 text-right font-mono text-slate-500">75.00</td>
                <td className="px-4 py-4 text-right font-mono font-bold text-slate-800">75.00</td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-50 border-t border-slate-200">
               <tr>
                 <td colSpan={3} className="px-4 py-3 text-right font-bold text-slate-700">Total Amount</td>
                 <td className="px-4 py-3 text-right font-mono font-black text-indigo-700 text-lg">575.00</td>
               </tr>
            </tfoot>
          </table>
</div>
        </div>
      </div>
    </div>
  );
};

// --- Medication Entity Renderer ---
const MedicationRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                {isAr ? "معلومات الدواء" : "Medication Data"}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Paracetamol 500mg Tab"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            {isAr ? "طباعة" : "Print"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-sm text-slate-500 font-medium mb-4">Analgesic / Antipyretic</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Form</span>
              <div className="text-sm font-bold text-slate-700">Tablet (Oral)</div>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Standard Dose</span>
              <div className="text-sm font-bold text-slate-700">500mg - 1000mg</div>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">{isAr ? "التحذيرات والتفاعلات" : "Warnings & Interactions"}</h3>
          <div className="space-y-2">
             <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-bold text-rose-800 block mb-1">Hepatotoxicity Risk</span>
                  <span className="text-xs text-rose-600 leading-relaxed">Do not exceed 4g per day. Monitor liver function in chronic use. Concurrent use with alcohol increases risk.</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Department Entity Renderer ---
const DepartmentRenderer = ({ entity, isAr, onClose, config }: any) => {
  const [activeTab, setActiveTab] = useState("overview");
  const Icon = config.icon;

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      {/* Header */}
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                {isAr ? "قسم المستشفى" : "Hospital Department"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Location: Floor 3, East Wing</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Internal Medicine Ward"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200 flex items-center">
            Operational
          </span>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 bg-white px-6 shrink-0">
        {[
          { id: "overview", label: isAr ? "نظرة عامة" : "Overview" },
          { id: "bedmap", label: isAr ? "خريطة الأسرة" : "Bed Map" },
          { id: "staff", label: isAr ? "الطاقم الطبي" : "On-Duty Staff" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id ? "border-indigo-600 text-indigo-700" : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-4xl font-black text-indigo-600">42</span>
                <span className="block text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Total Beds</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-4xl font-black text-rose-600">38</span>
                <span className="block text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Occupied</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-4xl font-black text-emerald-600">4</span>
                <span className="block text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Available</span>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm text-center">
                <span className="text-4xl font-black text-amber-600">12</span>
                <span className="block text-xs font-bold text-slate-500 mt-2 uppercase tracking-wider">Staff On Shift</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">{isAr ? "المرضى الحرجين" : "Critical Patients in Ward"}</h3>
              <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex justify-between items-center">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <AlertTriangle className="text-rose-500 w-6 h-6" />
                  <div>
                    <h4 className="font-bold text-rose-900">Bed 12 - Cardiac Monitoring</h4>
                    <p className="text-xs text-rose-700">Patient requires continuous monitoring.</p>
                  </div>
                </div>
                <GlobalEntityLink entityId="MRN-5541" entityName="Sara Khalid" entityType="patient" isAr={isAr} className="px-3 py-1.5 bg-rose-600 text-white rounded text-sm font-bold shadow-sm" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "bedmap" && (
          <div className="animate-fade-in space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">{isAr ? "خريطة الغرف" : "Room Layout"}</h3>
                <div className="flex gap-3 text-xs font-bold">
                   <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Available</span>
                   <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Occupied</span>
                </div>
             </div>
             
             <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 20 }).map((_, i) => {
                  const isOccupied = i % 5 !== 0; // Just sample some available beds
                  return (
                    <div key={i} className={`p-4 rounded-xl border-2 transition-all ${isOccupied ? 'bg-white border-rose-200 hover:border-rose-400' : 'bg-emerald-50 border-emerald-200 hover:border-emerald-400 cursor-pointer'}`}>
                       <div className="flex justify-between items-start mb-2">
                         <span className="font-bold text-slate-700">Bed {101 + i}</span>
                         <div className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
                       </div>
                       {isOccupied ? (
                         <div className="mt-4">
                           <GlobalEntityLink entityId={`MRN-90${i}`} entityName="Occupied Patient" entityType="patient" isAr={isAr} className="text-xs font-bold text-slate-800 truncate block hover:text-blue-600" />
                           <span className="text-[10px] text-slate-400">Dr. Ahmed</span>
                         </div>
                       ) : (
                         <div className="mt-4 text-xs font-bold text-emerald-700 flex items-center justify-center h-[34px]">
                           {isAr ? "متاح" : "Available"}
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>
          </div>
        )}

        {activeTab === "staff" && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
             <div className="responsive-table-container custom-scrollbar">
<table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="px-4 py-3">Staff Member</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Shift</th>
                  <th className="px-4 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <GlobalEntityLink entityId="MD-102" entityName="Dr. Sarah Johnson" entityType="doctor" isAr={isAr} className="font-bold text-slate-800 hover:text-blue-600 block" />
                  </td>
                  <td className="px-4 py-3 text-slate-600">Attending Physician</td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-xs">07:00 - 19:00</td>
                  <td className="px-4 py-3 text-right"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">Nurse Emily Davis</td>
                  <td className="px-4 py-3 text-slate-600">Charge Nurse</td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-xs">07:00 - 19:00</td>
                  <td className="px-4 py-3 text-right"><span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Active</span></td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-bold text-slate-800">Nurse John Smith</td>
                  <td className="px-4 py-3 text-slate-600">Staff Nurse</td>
                  <td className="px-4 py-3 font-mono text-slate-500 text-xs">07:00 - 19:00</td>
                  <td className="px-4 py-3 text-right"><span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">On Break</span></td>
                </tr>
              </tbody>
            </table>
</div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Radiology Entity Renderer ---
const RadiologyRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon || ImageIcon;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-cyan-100 text-cyan-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded">
                {isAr ? "تقرير وتصوير الأشعة" : "Radiology & Imaging Study"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">RAD-{entity.id || "77182"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Chest CT Scan (High Resolution)"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-cyan-600 text-white hover:bg-cyan-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2" onClick={() => toast.success(isAr ? "فتح عرض PACS DICOM" : "Launching PACS DICOM Viewer")}>
            <ImageIcon className="w-4 h-4" />
            {isAr ? "عرض الصور PACS" : "Launch PACS"}
          </button>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            {isAr ? "طباعة" : "Print"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-sm font-bold text-slate-700">Radiologist: Dr. Tariq (Consultant Radiologist)</p>
            <p className="text-xs text-slate-500 mt-1">Study Date: Today | Modality: CT | Status: Verified & Approved</p>
          </div>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">Verified Report</span>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-lg border-b border-slate-100 pb-2">{isAr ? "التقرير الطبي الأصلي" : "Official Radiology Findings"}</h3>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Clinical Indication</h4>
            <p className="text-sm text-slate-700 font-medium">Shortness of breath, persistent cough for 2 weeks.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Findings</h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
              Lungs show normal parenchymal attenuation without evidence of focal consolidation, mass, or ground-glass opacities. Tracheobronchial tree is clear. No pleural effusion or pneumothorax identified. Cardiac size is normal.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impression</h4>
            <p className="text-sm font-bold text-slate-900 bg-cyan-50 text-cyan-900 p-3 rounded-lg border border-cyan-100">
              Unremarkable HRCT Chest. No active parenchymal disease.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Order Entity Renderer ---
const OrderRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon || ClipboardList;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                {isAr ? "طلب طبي معتمد" : "Clinical Order"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ORD-{entity.id || "9018"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "STAT Blood Cultures & ABG"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button onClick={() => toast.success(isAr ? "تم اعتماد الطلب وتحديث الحالة" : "Order status verified")} className="px-4 py-2 bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            {isAr ? "اعتماد الطلب" : "Verify Order"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">Priority</span>
            <span className="text-sm font-black text-rose-600 uppercase bg-rose-50 px-3 py-1 rounded-full">STAT / Urgent</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">Fulfilling Dept</span>
            <span className="text-sm font-bold text-slate-800">Laboratory Services</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
            <span className="text-xs text-slate-400 font-bold block mb-1">Ordering Provider</span>
            <span className="text-sm font-bold text-slate-800">Dr. Khalid (ER)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Bed Entity Renderer ---
const BedRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon || BedDouble;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                {isAr ? "بيانات السرير والغرفة" : "Bed Registry Detail"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">BED-{entity.id || "104"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Bed 104 - Ward A (ICU Suite)"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button onClick={() => toast.success(isAr ? "تم تحديث حالة التنظيف بالسرير" : "Bed housekeeping updated")} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors">
            {isAr ? "تغيير حالة التنظيف" : "Update Housekeeping"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">{isAr ? "حالة الإشغال والتجهيز" : "Bed Status & Features"}</h3>
            <p className="text-xs text-slate-500 mt-1">Telemetry Equipped | Negative Pressure Capability | Motorized Height</p>
          </div>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs rounded-lg">Clean & Available</span>
        </div>
      </div>
    </div>
  );
};

// --- Device Entity Renderer ---
const DeviceRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon || Cpu;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                {isAr ? "جهاز معملي / طبي" : "Medical Device / Analyzer"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">DEV-{entity.id || "COBAS-6000"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Roche Cobas 6000 Chemistry Analyzer"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button onClick={() => toast.info(isAr ? "تم إرسال إشارة الفحص الذاتي للشبكة" : "Ping sent to device interface")} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold rounded-lg transition-colors">
            {isAr ? "اختبار الاتصال" : "Test Interface"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">{isAr ? "حالة الأجهزة وضبط الجودة QC" : "Analyzer Hardware & QC Status"}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 text-center">
               <span className="text-xs text-emerald-600 font-bold block">Interface State</span>
               <span className="text-sm font-black text-emerald-800">ONLINE</span>
             </div>
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
               <span className="text-xs text-slate-400 font-bold block">Reagent Level</span>
               <span className="text-sm font-bold text-slate-800">84% Full</span>
             </div>
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
               <span className="text-xs text-slate-400 font-bold block">Last Calibration</span>
               <span className="text-sm font-bold text-slate-800">Today 06:00 AM</span>
             </div>
             <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
               <span className="text-xs text-slate-400 font-bold block">Westgard Rules</span>
               <span className="text-sm font-bold text-emerald-700">Passed (1-2s OK)</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Task Entity Renderer ---
const TaskRenderer = ({ entity, isAr, onClose, config }: any) => {
  const Icon = config.icon || CheckSquare;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                {isAr ? "مهمة عمل ذكية" : "Smart System Task"}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">TSK-{entity.id || "1102"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || "Critical Lab Result Verification Needed"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button onClick={() => { toast.success(isAr ? "تم تنفيذ المهمة وإغلاقها تلقائيًا" : "Task executed & closed"); onClose(); }} className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {isAr ? "إكمال المهمة الآن" : "Mark Completed"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">{isAr ? "تفاصيل المهمة والسياق" : "Task Scope & Context"}</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            High Troponin I result detected for patient in ER Bed 2. Requires attending physician authorization and nurse notification.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Generic/Default Renderer ---
const DefaultRenderer = ({ entity, isAr, type, onClose, config }: any) => {
  const Icon = config.icon || Activity;
  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50">
      <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center ${config.color || 'bg-slate-100 text-slate-500'}`}>
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${config.color || 'bg-slate-100 text-slate-500'}`}>
                {isAr ? (config.labelAr || "كيان") : (config.labelEn || "Entity")}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">ID: {entity.id || "N/A"}</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">{entity.name || entity.nameAr || "Unknown Entity"}</h2>
          </div>
        </div>
        <div className="flex gap-2 min-w-max">
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors flex items-center gap-2" onClick={() => window.print()}>
            <Printer className="w-4 h-4" />
            {isAr ? "طباعة" : "Print"}
          </button>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2">
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          <div className="col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4">{isAr ? "البيانات المسجلة" : "Entity Data"}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(entity).map(([key, value]) => (
                  <div key={key} className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                    <div className="text-sm font-medium text-slate-800 break-words">{String(value)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-indigo-500" />
                {isAr ? "سجل الأحداث" : "Audit Log"}
              </h3>
              <div className="space-y-4">
                <div className="relative pl-4 border-l-2 border-indigo-100 pb-4">
                  <div className="absolute w-2 h-2 bg-indigo-500 rounded-full -left-[5px] top-1"></div>
                  <p className="text-xs text-slate-500 font-mono mb-1">{new Date().toLocaleString()}</p>
                  <p className="text-sm font-bold text-slate-700">Entity Created / Accessed</p>
                  <p className="text-xs text-slate-400 mt-1">System User</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// Entity Configuration Registry
const entityRegistry: Record<string, { icon: any; color: string; labelEn: string; labelAr: string; Renderer: any }> = {
  patient: { icon: User, color: "text-blue-500 bg-blue-50", labelEn: "Patient Chart", labelAr: "ملف المريض", Renderer: PatientRenderer },
  doctor: { icon: Stethoscope, color: "text-teal-500 bg-teal-50", labelEn: "Provider Profile", labelAr: "ملف الطبيب", Renderer: DoctorRenderer },
  nurse: { icon: User, color: "text-emerald-500 bg-emerald-50", labelEn: "Nurse Profile", labelAr: "ملف الممرض", Renderer: DoctorRenderer },
  lab: { icon: TestTube, color: "text-purple-500 bg-purple-50", labelEn: "Lab Result", labelAr: "نتيجة تحليل", Renderer: LabResultRenderer },
  lab_result: { icon: TestTube, color: "text-purple-500 bg-purple-50", labelEn: "Lab Result", labelAr: "نتيجة تحليل", Renderer: LabResultRenderer },
  radiology: { icon: ImageIcon, color: "text-cyan-600 bg-cyan-50", labelEn: "Radiology Report", labelAr: "تقرير الأشعة", Renderer: RadiologyRenderer },
  medication: { icon: Pill, color: "text-rose-500 bg-rose-50", labelEn: "Medication Info", labelAr: "معلومات الدواء", Renderer: MedicationRenderer },
  invoice: { icon: Receipt, color: "text-amber-500 bg-amber-50", labelEn: "Financial Invoice", labelAr: "فاتورة مالية", Renderer: InvoiceRenderer },
  department: { icon: Building, color: "text-indigo-500 bg-indigo-50", labelEn: "Department Info", labelAr: "بيانات القسم", Renderer: DepartmentRenderer },
  order: { icon: ClipboardList, color: "text-indigo-600 bg-indigo-50", labelEn: "Clinical Order", labelAr: "طلب طبي", Renderer: OrderRenderer },
  case: { icon: ClipboardList, color: "text-indigo-600 bg-indigo-50", labelEn: "Encounter Case", labelAr: "تفاصيل حالة الزيارة", Renderer: OrderRenderer },
  bed: { icon: BedDouble, color: "text-emerald-600 bg-emerald-50", labelEn: "Bed Registry", labelAr: "سجل السرير", Renderer: BedRenderer },
  device: { icon: Cpu, color: "text-blue-600 bg-blue-50", labelEn: "Medical Device", labelAr: "جهاز طبي", Renderer: DeviceRenderer },
  analyzer: { icon: Cpu, color: "text-blue-600 bg-blue-50", labelEn: "Laboratory Analyzer", labelAr: "جهاز المختبر", Renderer: DeviceRenderer },
  task: { icon: CheckSquare, color: "text-amber-600 bg-amber-50", labelEn: "Task Center Item", labelAr: "مهمة عمل", Renderer: TaskRenderer },
};


// ============================================================================
// MAIN COMPONENT: SMART CONTEXT DRAWER
// ============================================================================

export function EntityDetailModal({ entity, type, onClose, isAr }: any) {
  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "auto"; };
  }, []);

  const config = entityRegistry[type] || {
    icon: FileText,
    color: "text-slate-500 bg-slate-100",
    labelEn: "System Entity",
    labelAr: "كيان نظام",
    Renderer: DefaultRenderer
  };

  const RendererComponent = config.Renderer;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-modal flex justify-end" 
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Drawer Panel */}
        <motion.div 
          initial={{ x: isAr ? "-100%" : "100%" }}
          animate={{ x: 0 }}
          exit={{ x: isAr ? "-100%" : "100%" }}
          transition={{ type: "spring", bounce: 0, duration: 0.4 }}
          className={`relative w-full ${type === 'patient' ? 'max-w-6xl' : 'max-w-4xl'} h-full bg-slate-50 shadow-2xl flex flex-col border-l border-slate-200`}
        >
          {/* We now delegate the ENTIRE layout to the specific Renderer, so each entity has completely different contextual structures */}
          <RendererComponent entity={entity} isAr={isAr} type={type} onClose={onClose} config={config} />
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

