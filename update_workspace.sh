#!/bin/bash

# We will inject the imports and case statements using sed

sed -i '/const AdvancedAuditCenter = lazy/a \
const ExecutivePortalDashboard = lazy(() => import("../ExecutivePortalDashboard"));\
const DisasterRecoveryDashboard = lazy(() => import("../DisasterRecoveryDashboard"));\
const QueueManagementDashboard = lazy(() => import("../QueueManagementDashboard"));\
const ReferralDashboard = lazy(() => import("../ReferralDashboard"));\
const DoctorPortalDashboard = lazy(() => import("../DoctorPortalDashboard"));\
const RRTDashboard = lazy(() => import("../RRTDashboard"));\
const SmartWhiteboards = lazy(() => import("../SmartWhiteboards"));\
const ClinicalCalendar = lazy(() => import("../ClinicalCalendar"));\
const ClinicalCommunication = lazy(() => import("../ClinicalCommunication"));\
const MedicationSafetyDashboard = lazy(() => import("../MedicationSafetyDashboard"));\
const MedicalKnowledgeBase = lazy(() => import("../MedicalKnowledgeBase"));\
const HospitalDigitalAssistant = lazy(() => import("../HospitalDigitalAssistant"));\
const HospitalRulesEngine = lazy(() => import("../HospitalRulesEngine"));\
const SmartChecklistEngine = lazy(() => import("../SmartChecklistEngine"));\
const InfectionSurveillanceAI = lazy(() => import("../InfectionSurveillanceAI"));\
const EnterpriseNotificationCenter = lazy(() => import("../EnterpriseNotificationCenter"));\
const EnterpriseSearch = lazy(() => import("../EnterpriseSearch"));\
const EscalationEngine = lazy(() => import("../EscalationEngine"));\
const UniversalTaskEngine = lazy(() => import("../UniversalTaskEngine"));\
const HospitalPolicyCenter = lazy(() => import("../HospitalPolicyCenter"));\
const SecurityDashboard = lazy(() => import("../SecurityDashboard"));\
' src/components/HISShell/HISWorkspace.tsx

sed -i '/case "audit_center":/a \
      case "executiveportal": return <ExecutivePortalDashboard language={language} />;\
      case "disasterrecovery": return <DisasterRecoveryDashboard language={language} />;\
      case "queuemanagement": return <QueueManagementDashboard language={language} />;\
      case "referral": return <ReferralDashboard language={language} />;\
      case "doctorportal": return <DoctorPortalDashboard language={language} />;\
      case "rrtdashboard": return <RRTDashboard language={language} />;\
      case "smartwhiteboards": return <SmartWhiteboards language={language} />;\
      case "clinicalcalendar": return <ClinicalCalendar language={language} />;\
      case "clinicalcommunication": return <ClinicalCommunication language={language} />;\
      case "medicationsafety": return <MedicationSafetyDashboard language={language} />;\
      case "medicalknowledgebase": return <MedicalKnowledgeBase language={language} />;\
      case "hospitaldigitalassistant": return <HospitalDigitalAssistant language={language} />;\
      case "hospitalrulesengine": return <HospitalRulesEngine language={language} />;\
      case "smartchecklistengine": return <SmartChecklistEngine language={language} />;\
      case "infectionsurveillanceai": return <InfectionSurveillanceAI language={language} />;\
      case "enterprisenotificationcenter": return <EnterpriseNotificationCenter language={language} />;\
      case "enterprisesearch": return <EnterpriseSearch language={language} />;\
      case "escalationengine": return <EscalationEngine language={language} />;\
      case "universaltaskengine": return <UniversalTaskEngine language={language} />;\
      case "hospitalpolicycenter": return <HospitalPolicyCenter language={language} />;\
      case "securitydashboard": return <SecurityDashboard language={language} />;\
' src/components/HISShell/HISWorkspace.tsx
