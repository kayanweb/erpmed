import EnterpriseTaskManager from "./EnterpriseTaskManager";
import LISComprehensiveDashboard from "./LISComprehensiveDashboard";
import RISComprehensiveDashboard from "./RISComprehensiveDashboard";
import { lazyWithRetry } from "../utils/lazyWithRetry";
import NewInventory from "./NewInventory";
import PatientConsumables from "./PatientConsumables";
import React, { Suspense, lazy, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import PatientAdministrativeDashboard from "./PatientAdministrativeDashboard";
import EMRView from "./EMRView";
import QueueManagement from "./QueueManagement";

// Lazy load heavy dashboard modules
const InpatientDashboard = lazyWithRetry(() => import("./InpatientDashboard"));
const ProfileView = lazyWithRetry(() => import("./ProfileView"));
const AdvancedMedicalCalculators = lazyWithRetry(() => import("./AdvancedMedicalCalculators"));
const ITAdministrationEnterprise = lazyWithRetry(() => import("./ITAdministrationEnterprise"));
const DocumentCenter = lazyWithRetry(() => import("./DocumentCenter"));
const MessagingDashboard = lazyWithRetry(() => import("./MessagingDashboard"));
const HISSettingsPage = lazyWithRetry(() => import("./HISSettingsPage"));
const EnterprisePrintCenter = lazyWithRetry(() => import("./EnterprisePrintCenter"));

// Loading fallback component
const ModuleLoader = () => (
  <div className="flex-1 flex items-center justify-center bg-slate-50 min-h-[400px]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin" />
      <div className="flex flex-col items-center">
        <p className="text-slate-900 font-bold tracking-tight">جاري تحميل الموديول...</p>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mt-1">Loading Clinical Module</p>
      </div>
    </div>
  </div>
);

interface DashboardRouterProps {
  activeTab: string;
  currentUser: any;
  language: "ar" | "en";
  onClose?: () => void;
  addSystemLog: any;
  itStrictComplianceMode: boolean;
  setItStrictComplianceMode: any;
  itConflictResolutionWithNewest: boolean;
  setItConflictResolutionWithNewest: any;
  rosterWishes: any;
  setRosterWishes: any;
  rosterList: any;
  setRosterList: any;
  notifications: any;
  setNotifications: any;
  hospitalSettings: any;
  setHospitalSettings?: any;
  systemUsers?: any[];
  [key: string]: any;
}

export const DashboardRouter: React.FC<DashboardRouterProps> = ({
  activeTab,
  currentUser,
  language,
  onClose,
  addSystemLog,
  itStrictComplianceMode,
  setItStrictComplianceMode,
  itConflictResolutionWithNewest,
  setItConflictResolutionWithNewest,
  rosterWishes,
  setRosterWishes,
  rosterList,
  setRosterList,
  notifications,
  setNotifications,
  hospitalSettings,
  setHospitalSettings,
  systemUsers,
  ...props
}) => {
  const [selectedPatientForEMR, setSelectedPatientForEMR] = useState<string | null>(null);

  const componentProps = {
    currentUser,
    language,
    onClose,
    addSystemLog,
    itStrictComplianceMode,
    setItStrictComplianceMode,
    itConflictResolutionWithNewest,
    setItConflictResolutionWithNewest,
    rosterWishes,
    setRosterWishes,
    rosterList,
    setRosterList,
    notifications,
    setNotifications,
    hospitalSettings,
    setHospitalSettings,
    systemUsers,
    ...props
  };

  if (selectedPatientForEMR) {
    return (
      <Suspense fallback={<ModuleLoader />}>
        <div className="relative h-full">
           <button 
             onClick={() => setSelectedPatientForEMR(null)}
             className="absolute top-4 right-4 z-50 bg-slate-100 hover:bg-slate-200 p-2 rounded-full shadow-sm"
           >
             <X size={20} />
           </button>
           <EMRView patientId={selectedPatientForEMR} language={language} />
        </div>
      </Suspense>
    );
  }

  const renderModule = () => {
    switch (activeTab) {
      case "patient_admin":
      case "mpi":
      case "registration":
        return (
          <PatientAdministrativeDashboard 
            language={language} 
            onOpenEMR={(id) => setSelectedPatientForEMR(id)}
            onStartEncounter={(id, type) => {
              // Handle start encounter - maybe open a specific board or just toast for now
              toast.info(`Starting ${type} encounter for patient ${id}`);
            }}
          />
        );
      case "qms":
      case "queue_management":
        return <QueueManagement language={language} />;
      case "profile":
        return <ProfileView user={currentUser} language={language} {...componentProps} />;
      case "lis":
      case "lab":
      case "laboratory":
        return <LISComprehensiveDashboard language={language} />;
      case "ris":
      case "radiology":
      case "pacs":
        return <RISComprehensiveDashboard language={language} />;
      case "medical_tools":
        return <AdvancedMedicalCalculators {...componentProps} />;
      case "admin_dashboard":
        return <InpatientDashboard language={language} defaultModuleType="ward_im" />;
      case "document_center":
        return <DocumentCenter {...componentProps} />;
      case "his_settings":
        return <HISSettingsPage {...componentProps} />;
      case "report_center":
        return <EnterprisePrintCenter language={language} />;
      case "new_inventory":
        return <NewInventory />;
      case "patient_consumables":
        return <PatientConsumables patientId="p2" />;
      case "messaging":
        return <MessagingDashboard {...componentProps} />;
      case "it_admin":
          return <ITAdministrationEnterprise language={language} />;
      case "tasks":
      case "task_center":
      case "universal_tasks":
      case "task_management":
      case "department_tasks":
        return <EnterpriseTaskManager language={language} onClose={onClose} />;
      default:
        return null;
    }
  };

  return (
    <Suspense fallback={<ModuleLoader />}>
      {renderModule()}
    </Suspense>
  );
};
