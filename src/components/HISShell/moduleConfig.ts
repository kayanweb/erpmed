import { 
  LayoutDashboard, 
  UserPlus, 
  Stethoscope, 
  AlertTriangle, 
  Bed, 
  Scissors, 
  Pill, 
  FlaskConical, 
  Radio, 
  CreditCard, 
  Layers, 
  Building,
  Activity,
  Microscope,
  FileText,
  Truck,
  Users,
  ShieldCheck,
  Search,
  Bot,
  Cpu,
  Globe,
  CheckSquare,
  Bell,
  Shield,
  MessageSquare,
  Calendar,
  Book,
  Briefcase
} from "lucide-react";

export interface HISSubModule {
  id: string;
  labelAr: string;
  labelEn: string;
  component?: string; // For dynamic loading if needed, or just for reference
}

export interface HISModule {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: any;
  subItems: HISSubModule[];
}

export const systemModules: HISModule[] = [
  { 
    id: "dashboard", 
    labelAr: "مركز القيادة", 
    labelEn: "Command Center", 
    icon: LayoutDashboard, 
    subItems: [
      { id: "missioncontrol", labelAr: "مركز القيادة السريري", labelEn: "Clinical Command Center" },
      { id: "analytics", labelAr: "لوحة مؤشرات الأداء", labelEn: "KPI Analytics" },
      { id: "executiveportal", labelAr: "بوابة الإدارة التنفيذية", labelEn: "Executive Portal" },
      { id: "disasterrecovery", labelAr: "إدارة الكوارث", labelEn: "Disaster Recovery" }
    ]
  },
  { 
    id: "registration", 
    labelAr: "إدارة المرضى", 
    labelEn: "Patient Flow", 
    icon: UserPlus, 
    subItems: [
      { id: "admissioncenter", labelAr: "مركز القبول والتسجيل (ADT)", labelEn: "Admission Center (ADT)" },
      { id: "empi", labelAr: "السجل الطبي الموحد (MPI)", labelEn: "Master Patient Index (MPI)" },
      { id: "patientjourney", labelAr: "محاكي ومتابع مسار المريض (Event-Driven)", labelEn: "Event-Driven Patient Journey Engine" },
      { id: "smartbedallocation", labelAr: "إدارة وتوزيع الأسرة", labelEn: "Bed Management" },
      { id: "queuemanagement", labelAr: "إدارة الطوابير", labelEn: "Queue Management" },
      { id: "referral", labelAr: "الإحالات", labelEn: "Referrals" }
    ]
  },
  { 
    id: "outpatient", 
    labelAr: "العيادات الخارجية", 
    labelEn: "Outpatient (OPD)", 
    icon: Stethoscope, 
    subItems: [
      { id: "clinics", labelAr: "قائمة العيادات", labelEn: "Clinics List" },
      { id: "telemedicine", labelAr: "الطب الاتصالي", labelEn: "Telemedicine" },
      { id: "doctorportal", labelAr: "بوابة الطبيب", labelEn: "Doctor Portal" }
    ]
  },
  { 
    id: "emergency", 
    labelAr: "الطوارئ", 
    labelEn: "Emergency (ER)", 
    icon: AlertTriangle, 
    subItems: [
      { id: "er", labelAr: "لوحة الطوارئ الذكية", labelEn: "ER Workspace" },
      { id: "ambulance", labelAr: "إدارة الإسعاف", labelEn: "Ambulance Dashboard" },
      { id: "rrtdashboard", labelAr: "فريق الاستجابة", labelEn: "RRT Dashboard" }
    ]
  },
  { 
    id: "inpatient", 
    labelAr: "التنويم", 
    labelEn: "Inpatient (IPD)", 
    icon: Bed, 
    subItems: [
      { id: "wards", labelAr: "أجنحة التنويم", labelEn: "Wards Workspace" },
      { id: "icu", labelAr: "العناية المركزة", labelEn: "ICU Dashboard" },
      { id: "nursingflowkardex", labelAr: "متابعة التمريض (Kardex)", labelEn: "Nursing Kardex" },
      { id: "smartwhiteboards", labelAr: "اللوحات الذكية", labelEn: "Smart Whiteboards" }
    ]
  },
  { 
    id: "surgery", 
    labelAr: "العمليات", 
    labelEn: "Surgery (OR)", 
    icon: Scissors, 
    subItems: [
      { id: "operatingtheater", labelAr: "لوحة العمليات الحية", labelEn: "Live OR Board" },
      { id: "cssd", labelAr: "التعقيم المركزي", labelEn: "CSSD Workspace" }
    ]
  },
  { 
    id: "pharmacy", 
    labelAr: "الصيدلية", 
    labelEn: "Pharmacy", 
    icon: Pill, 
    subItems: [
      { id: "pharmacy", labelAr: "الصيدلية المركزية", labelEn: "Central Pharmacy" }
    ]
  },
  { 
    id: "laboratory", 
    labelAr: "المختبر", 
    labelEn: "Laboratory", 
    icon: FlaskConical, 
    subItems: [
      { id: "lisris", labelAr: "نظام المختبر (LIS)", labelEn: "LIS Workspace" },
      { id: "bloodbank", labelAr: "بنك الدم", labelEn: "Blood Bank" }
    ]
  },
  { 
    id: "radiology", 
    labelAr: "الأشعة", 
    labelEn: "Radiology", 
    icon: Radio, 
    subItems: [
      { id: "radiology", labelAr: "نظام الأشعة (RIS/PACS)", labelEn: "RIS/PACS Board" }
    ]
  },
  {
    id: "clinical_tools",
    labelAr: "الأدوات السريرية ودعم القرار",
    labelEn: "Clinical Tools & CDSS",
    icon: Activity,
    subItems: [
      { id: "ai_cdss", labelAr: "نظام دعم القرار السريري (AI CDSS)", labelEn: "AI Clinical Decision Support" },
      { id: "clinicalcalendar", labelAr: "التقويم السريري", labelEn: "Clinical Calendar" },
      { id: "clinicalcommunication", labelAr: "التواصل السريري", labelEn: "Clinical Communication" },
      { id: "medicationsafety", labelAr: "سلامة الأدوية", labelEn: "Medication Safety" },
      { id: "medicalknowledgebase", labelAr: "قاعدة المعرفة", labelEn: "Knowledge Base" }
    ]
  },
  {
    id: "ai_smart",
    labelAr: "الأنظمة الذكية والذكاء الاصطناعي",
    labelEn: "AI & Smart Systems",
    icon: Bot,
    subItems: [
      { id: "vision2026", labelAr: "محرك الجيل الرابع 2026", labelEn: "Gen-IV 2026 Engine" },
      { id: "hospitaldigitalassistant", labelAr: "المساعد الرقمي", labelEn: "Digital Assistant" },
      { id: "hospitalrulesengine", labelAr: "محرك القواعد", labelEn: "Rules Engine" },
      { id: "smartchecklistengine", labelAr: "القوائم الذكية", labelEn: "Smart Checklists" },
      { id: "infectionsurveillanceai", labelAr: "مراقبة العدوى", labelEn: "Infection Surveillance AI" }
    ]
  },
  { 
    id: "billing", 
    labelAr: "دورة الإيرادات", 
    labelEn: "Revenue Cycle", 
    icon: CreditCard, 
    subItems: [
      { id: "revenuecycle", labelAr: "الفوترة والتأمين", labelEn: "Billing & Claims" }
    ]
  },
  { 
    id: "operations", 
    labelAr: "العمليات اللوجستية", 
    labelEn: "Operations & Logistics", 
    icon: Layers, 
    subItems: [
      { id: "new_inventory", labelAr: "المخزون المتطور (Inventory V2)", labelEn: "Advanced Inventory V2" },
      { id: "patient_consumables", labelAr: "إدارة المستهلكات (Patient Consumables)", labelEn: "Patient Consumables" },
      { id: "enterpriseinventoryengine", labelAr: "مركز التحكم بالمخزون", labelEn: "Inventory Control Center" },
      { id: "assetmanagement", labelAr: "إدارة الأصول", labelEn: "Asset Tracking" },
      { id: "transport", labelAr: "نقل المرضى", labelEn: "Patient Transport" },
      { id: "meals", labelAr: "شيت وجبات المرضى والموظفين", labelEn: "Meals Delivery Log" }
    ]
  },
  {
    id: "enterprise",
    labelAr: "أنظمة المؤسسة وتكامل SAP",
    labelEn: "Enterprise SAP Integration",
    icon: Globe,
    subItems: [
      { id: "sap_cloudcare", labelAr: "منصة SAP & CloudCare Sync الذكية", labelEn: "SAP & CloudCare Sync Hub" },
      { id: "integrationcenter", labelAr: "مركز الربط والتبادل (Interoperability)", labelEn: "Interoperability & FHIR Hub" },
      { id: "enterprisenotificationcenter", labelAr: "مركز الإشعارات", labelEn: "Notification Center" },
      { id: "enterprisesearch", labelAr: "البحث الشامل", labelEn: "Enterprise Search" },
      { id: "escalationengine", labelAr: "محرك التصعيد", labelEn: "Escalation Engine" },
      { id: "universaltaskengine", labelAr: "محرك المهام", labelEn: "Universal Tasks" },
      { id: "hospitalpolicycenter", labelAr: "مركز السياسات", labelEn: "Policy Center" },
      { id: "securitydashboard", labelAr: "مركز الأمان", labelEn: "Security Center" }
    ]
  },
  { 
    id: "administration", 
    labelAr: "الإدارة والنظام", 
    labelEn: "Administration", 
    icon: Building, 
    subItems: [
      { id: "hr", labelAr: "الموارد البشرية", labelEn: "Human Resources" },
      { id: "iam", labelAr: "صلاحيات الوصول (IAM)", labelEn: "Access Control (IAM)" },
      { id: "it_admin", labelAr: "إدارة تقنية المعلومات", labelEn: "IT Administration" },
      { id: "audit_center", labelAr: "مركز التدقيق", labelEn: "Audit Center" }
    ]
  }
];
