import { ErrorBoundary } from "../ErrorBoundary";
import React, { Suspense, lazy } from "react";
import { lazyWithRetry } from "../../utils/lazyWithRetry";
import { LayoutDashboard, User } from "lucide-react";
import MedicalCommandCenter from "../MedicalCommandCenter";
import { useHIS } from "../../context/HISContext";

// Lazy load components to avoid massive initial bundle and circular dependencies if any
const AnalyticsKPIDashboard = lazyWithRetry(() => import("../AnalyticsKPIDashboard"));
const AdmissionCenterDashboard = lazyWithRetry(() => import("../AdmissionCenterDashboard"));
const EMPIDashboard = lazyWithRetry(() => import("../EMPIDashboard"));
const MPIDashboard = lazyWithRetry(() => import("../Enterprise/MPIDashboard"));
const PatientJourneyEngine = lazyWithRetry(() => import("../Enterprise/PatientJourneyEngine"));
const PatientConsumables = lazyWithRetry(() => import("../PatientConsumables"));
const NewInventory = lazyWithRetry(() => import("../NewInventory"));
const BedManagementDashboard = lazyWithRetry(() => import("../BedManagementDashboard"));
const OutpatientClinicsDashboard = lazyWithRetry(() => import("../OutpatientClinicsDashboard"));
const TelemedicineDashboard = lazyWithRetry(() => import("../TelemedicineDashboard"));
const ERDashboard = lazyWithRetry(() => import("../ERDashboard"));
const AmbulanceDashboard = lazyWithRetry(() => import("../AmbulanceDashboard"));
const InpatientDashboard = lazyWithRetry(() => import("../InpatientDashboard"));
const ICUDashboard = lazyWithRetry(() => import("../ICUDashboard"));
const NursingFlowKardex = lazyWithRetry(() => import("../NursingFlowKardex"));
const OperatingTheaterBoard = lazyWithRetry(() => import("../OperatingTheaterBoard"));
const CSSDDashboard = lazyWithRetry(() => import("../CSSDDashboard"));
const PharmacyDashboard = lazyWithRetry(() => import("../PharmacyDashboard"));
const LISDashboard = lazyWithRetry(() => import("../LISDashboard"));
const RISDashboard = lazyWithRetry(() => import("../RISDashboard"));
const BloodBankDashboard = lazyWithRetry(() => import("../BloodBankDashboard"));
const RevenueCycleDashboard = lazyWithRetry(() => import("../RevenueCycleDashboard"));
const BillingInsurance = lazyWithRetry(() => import("../BillingInsurance"));
const AdvancedInventoryManager = lazyWithRetry(() => import("../AdvancedInventoryManager"));
const AssetManagementDashboard = lazyWithRetry(() => import("../AssetManagementDashboard"));
const PatientTransportLog = lazyWithRetry(() => import("../PatientTransportLog"));
const HRDashboard = lazyWithRetry(() => import("../HRDashboard"));
const IAMDashboard = lazyWithRetry(() => import("../IAMDashboard"));
const AdvancedAuditCenter = lazyWithRetry(() => import("../AdvancedAuditCenter"));
const AIClinicalDecisionSupport = lazyWithRetry(() => import("../AIClinicalDecisionSupport"));
const ExecutivePortalDashboard = lazyWithRetry(() => import("../ExecutivePortalDashboard"));
const QueueManagementDashboard = lazyWithRetry(() => import("../QueueManagementDashboard"));
const ReferralDashboard = lazyWithRetry(() => import("../ReferralDashboard"));
const DoctorPortalDashboard = lazyWithRetry(() => import("../DoctorPortalDashboard"));
const RRTDashboard = lazyWithRetry(() => import("../RRTDashboard"));
const SmartWhiteboards = lazyWithRetry(() => import("../SmartWhiteboards"));
const ClinicalCalendar = lazyWithRetry(() => import("../ClinicalCalendar"));
const ClinicalCommunication = lazyWithRetry(() => import("../ClinicalCommunication"));
const MedicationSafetyDashboard = lazyWithRetry(() => import("../MedicationSafetyDashboard"));
const MedicalKnowledgeBase = lazyWithRetry(() => import("../MedicalKnowledgeBase"));
const HospitalDigitalAssistant = lazyWithRetry(() => import("../HospitalDigitalAssistant"));
const HospitalRulesEngine = lazyWithRetry(() => import("../HospitalRulesEngine"));
const SmartChecklistEngine = lazyWithRetry(() => import("../SmartChecklistEngine"));
const InfectionSurveillanceAI = lazyWithRetry(() => import("../InfectionSurveillanceAI"));
const EnterpriseNotificationCenter = lazyWithRetry(() => import("../EnterpriseNotificationCenter"));
const EnterpriseSearch = lazyWithRetry(() => import("../EnterpriseSearch"));
const EscalationEngine = lazyWithRetry(() => import("../EscalationEngine"));
const UniversalTaskEngine = lazyWithRetry(() => import("../UniversalTaskEngine"));
const HospitalPolicyCenter = lazyWithRetry(() => import("../HospitalPolicyCenter"));
const SecurityDashboard = lazyWithRetry(() => import("../SecurityDashboard"));
const HISProfileWorkspace = lazyWithRetry(() => import("../HISProfileWorkspace"));
const ITAdministrationEnterprise = lazyWithRetry(() => import("../ITAdministrationEnterprise"));
const Patient360 = lazyWithRetry(() => import("../Patient360"));

interface HISWorkspaceProps {
  activeSubTab: string;
  language: "en" | "ar";
  currentUser?: any;
}

export const HISWorkspace: React.FC<HISWorkspaceProps> = ({ activeSubTab, language, currentUser }) => {
  const isAr = language === "ar";

  const renderContent = () => {
    switch (activeSubTab) {
      case "missioncontrol": return <MedicalCommandCenter language={language} />;
      case "analytics": return <AnalyticsKPIDashboard language={language} />;
      case "admissioncenter": return <AdmissionCenterDashboard language={language} />;
      case "empi":
      case "mpi_dashboard": return <MPIDashboard language={language} />;
      case "patientjourney":
      case "enterprise_simulator": return <PatientJourneyEngine language={language} />;
      case "patient_consumables": return <PatientConsumables language={language} patientId="p2" />;
      case "new_inventory":
      case "inventory_v2": return <NewInventory language={language} />;
      case "smartbedallocation": return <BedManagementDashboard language={language} />;
      case "clinics": return <OutpatientClinicsDashboard language={language} />;
      case "telemedicine": return <TelemedicineDashboard language={language} />;
      case "er": return <ERDashboard language={language} />;
      case "ambulance": return <AmbulanceDashboard language={language} />;
      case "wards": return <InpatientDashboard language={language} defaultModuleType="ward_im" />;
      case "icu": return <ICUDashboard language={language} />;
      case "nursingflowkardex": return <NursingFlowKardex language={language} />;
      case "operatingtheater": return <OperatingTheaterBoard language={language} />;
      case "cssd": return <CSSDDashboard language={language} />;
      case "pharmacy": return <PharmacyDashboard language={language} />;
      case "lisris": 
      case "laboratory": return <LISDashboard language={language} />;
      case "bloodbank": return <BloodBankDashboard language={language} />;
      case "radiology":
      case "ris": return <RISDashboard language={language} />;
      case "revenuecycle": return <RevenueCycleDashboard language={language} />;
      case "billing": return <BillingInsurance language={language} />;
      case "enterpriseinventoryengine": return <AdvancedInventoryManager language={language} />;
      case "assetmanagement": return <AssetManagementDashboard language={language} />;
      case "transport": return <PatientTransportLog language={language} />;
      case "hr": return <HRDashboard language={language} />;
      case "iam": return <IAMDashboard language={language} />;
      case "audit_center": return <AdvancedAuditCenter language={language} />;
      case "executiveportal": return <ExecutivePortalDashboard language={language} />;
      case "queuemanagement": return <QueueManagementDashboard language={language} />;
      case "referral": return <ReferralDashboard language={language} />;
      case "doctorportal": return <DoctorPortalDashboard language={language} />;
      case "rrtdashboard": return <RRTDashboard language={language} />;
      case "smartwhiteboards": return <SmartWhiteboards language={language} />;
      case "clinicalcalendar": return <ClinicalCalendar language={language} />;
      case "clinicalcommunication": return <ClinicalCommunication language={language} />;
      case "medicationsafety": return <MedicationSafetyDashboard language={language} />;
      case "medicalknowledgebase": return <MedicalKnowledgeBase language={language} />;
      case "ai_cdss": return <AIClinicalDecisionSupport language={language} />;
      case "hospitaldigitalassistant": return <HospitalDigitalAssistant language={language} />;
      case "hospitalrulesengine": return <HospitalRulesEngine language={language} />;
      case "smartchecklistengine": return <SmartChecklistEngine language={language} />;
      case "infectionsurveillanceai": return <InfectionSurveillanceAI language={language} />;
      case "enterprisenotificationcenter": return <EnterpriseNotificationCenter language={language} currentUser={currentUser} />;
      case "enterprisesearch": return <EnterpriseSearch language={language} />;
      case "escalationengine": return <EscalationEngine language={language} />;
      case "universaltaskengine": return <UniversalTaskEngine language={language} />;
      case "hospitalpolicycenter": return <HospitalPolicyCenter language={language} />;
      case "securitydashboard": return <SecurityDashboard language={language} />;
      case "profile": return <HISProfileWorkspace currentUser={currentUser} language={language} />;
      case "patient_360": {
        const { activePatient, setActivePatient } = useHIS();
        if (!activePatient) {
          return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <User className="w-16 h-16 mb-4 opacity-20" />
              <h3 className="text-xl font-bold">{isAr ? "يرجى اختيار مريض أولاً" : "Please select a patient first"}</h3>
            </div>
          );
        }
        return <Patient360 patient={activePatient} onClose={() => setActivePatient(null)} />;
      }
      case "it_admin":
        return <ITAdministrationEnterprise language={language} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 py-20">
            <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
            <h3 className="text-xl font-bold text-slate-500">
              {isAr ? "المساحة التشغيلية قيد التجهيز" : "Operational Workspace Under Construction"}
            </h3>
            <p className="text-sm opacity-60 mt-2">Target Module ID: {activeSubTab}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-50">
      <ErrorBoundary>
      <Suspense fallback={
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-bold text-slate-600">
              {isAr ? "جاري تحميل بيئة العمل..." : "Loading Operational Workspace..."}
            </p>
          </div>
        </div>
      }>
        {renderContent()}
      </Suspense>
      </ErrorBoundary>
        
    </div>
  );
};
