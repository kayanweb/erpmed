import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Stethoscope,
  Syringe,
  Microscope,
  Globe,
  Lock,
  ChevronRight,
  Printer,
  Download,
  Eye,
  Activity,
  HeartPulse,
  UserCircle,
  Ambulance,
  FolderOpen,
  BedDouble,
  Scissors,
  Pill,
  Radiation,
  Droplet,
  ShieldCheck,
  Receipt,
  HeartHandshake,
  Server,
  PenTool,
  CheckCircle,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";

interface FormsLibraryProps {
  isAr?: boolean;
  patientId?: string;
  patientName?: string;
  initialCategory?: string;
  initialForm?: any;
}

export default function ClinicalFormsLibrary({ isAr = true, patientId = "", patientName = "", initialCategory, initialForm }: FormsLibraryProps = {}) {
  const [activeTab, setActiveTab] = useState(initialCategory || "admission");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<any>(initialForm || null);

  useEffect(() => {
    if (initialCategory) setActiveTab(initialCategory);
    if (initialForm) setSelectedForm(initialForm);
  }, [initialCategory, initialForm]);

  const categories = [
    { id: "admission", label: "الاستقبال والتسجيل والقبول (Admission & Registration)", icon: UserCircle },
    { id: "opd", label: "العيادات الخارجية (Outpatient - OPD)", icon: Stethoscope },
    { id: "ed", label: "الطوارئ والإصابات (Emergency - ED)", icon: Ambulance },
    { id: "him", label: "السجلات الطبية وإدارة المعلومات (HIM)", icon: FolderOpen },
    { id: "ipd", label: "الأقسام الداخلية والتنويم (Inpatient - IPD)", icon: BedDouble },
    { id: "icu", label: "العناية المركزة (ICU / Critical Care)", icon: Activity },
    { id: "or", label: "العمليات الجراحية والتخدير (OR & Anesthesia)", icon: Scissors },
    { id: "pharmacy", label: "الصيدلية وإدارة الدواء (Pharmacy)", icon: Pill },
    { id: "lab", label: "المختبرات الطبية (LIS)", icon: Microscope },
    { id: "rad", label: "الأشعة والتصوير الطبي (RIS)", icon: Radiation },
    { id: "blood", label: "بنك الدم (Blood Bank)", icon: Droplet },
    { id: "quality", label: "الجودة وسلامة المرضى ومكافحة العدوى (Quality & Infection Control)", icon: ShieldCheck },
    { id: "billing", label: "الحسابات الطبية وشؤون المرضى (Billing & Finance)", icon: Receipt },
    { id: "allied", label: "الخدمات الطبية المساعدة (Allied Health Services)", icon: HeartHandshake },
    { id: "admin", label: "إدارة وتأمين النظام (HIS Administration)", icon: Server },
  ];

  const formsData: Record<string, any[]> = {
    admission: [
      { id: "adm-1", title: "Patient Registration Form", category: "Admission", description: "نموذج تسجيل المريض الجديد", rating: 4.9 },
      { id: "adm-2", title: "Demographic Data Sheet", category: "Admission", description: "شيت البيانات الديموغرافية والاجتماعية", rating: 4.8 },
      { id: "adm-3", title: "General Consent for Treatment", category: "Admission", description: "نموذج الموافقة العامة على العلاج والتنويم", rating: 5.0 },
      { id: "adm-4", title: "Emergency Contact Update", category: "Admission", description: "شيت تحديث بيانات الاتصال والطوارئ", rating: 4.7 },
      { id: "adm-5", title: "Insurance Verification Form", category: "Admission", description: "نموذج التحقق من الهوية والتأمين الصحي", rating: 4.9 },
      { id: "adm-6", title: "Patient ID Barcode Generation", category: "Admission", description: "بطاقة تعريف المريض الرقمية / باركود المريض", rating: 4.8 },
      { id: "adm-7", title: "MRN Creation Sheet", category: "Admission", description: "شيت فتح الملف الطبي الموحد", rating: 5.0 },
      { id: "adm-8", title: "Appointment Scheduling Form", category: "Admission", description: "نموذج حجز المواعيد والجدولة", rating: 4.8 },
      { id: "adm-9", title: "Cancellation/Rescheduling Notice", category: "Admission", description: "إشعار إلغاء أو إعادة جدولة موعد", rating: 4.6 },
      { id: "adm-10", title: "Referral Request Form", category: "Admission", description: "نموذج طلب تحويل خارجي/داخلي", rating: 4.7 },
    ],
    opd: [
      { id: "opd-1", title: "OPD Triage & Vital Signs Sheet", category: "OPD", description: "شيت الفرز الأولي والعلامات الحيوية", rating: 4.9 },
      { id: "opd-2", title: "History & Physical Examination (H&P)", category: "OPD", description: "التاريخ الطبي والفحص السريري العام", rating: 5.0 },
      { id: "opd-3", title: "Chief Complaint & HPI Sheet", category: "OPD", description: "شيت الشكوى الرئيسية والتاريخ المرضي الحالي", rating: 4.8 },
      { id: "opd-4", title: "Review of Systems (ROS)", category: "OPD", description: "نموذج مراجعة الأنظمة الطبية للجسم", rating: 4.7 },
      { id: "opd-5", title: "e-Prescription Form", category: "OPD", description: "نموذج الوصفة الطبية الإلكترونية", rating: 5.0 },
      { id: "opd-6", title: "Laboratory Investigation Request", category: "OPD", description: "طلب الفحوصات المخبرية", rating: 4.9 },
      { id: "opd-7", title: "Radiology/Imaging Request", category: "OPD", description: "طلب الأشعة والفحوصات التصويرية", rating: 4.9 },
      { id: "opd-8", title: "Treatment & Follow-up Plan", category: "OPD", description: "شيت خطة العلاج والمتابعة", rating: 4.8 },
      { id: "opd-9", title: "Internal Consultation Request", category: "OPD", description: "نموذج الإحالة التخصصية الداخلية", rating: 4.7 },
      { id: "opd-10", title: "Sick Leave / Medical Report Form", category: "OPD", description: "تقرير الإجازة المرضية أو التقرير الطبي القصير", rating: 4.9 },
    ],
    ed: [
      { id: "ed-1", title: "ED Triage/ESI Scoring Sheet", category: "Emergency", description: "شيت الفرز الطبي للطوارئ - نظام الخمس مستويات", rating: 5.0 },
      { id: "ed-2", title: "Trauma Assessment Sheet", category: "Emergency", description: "نموذج تقييم حالات الحوادث والإصابات", rating: 4.9 },
      { id: "ed-3", title: "ED Observation/Monitoring Flowsheet", category: "Emergency", description: "شيت الملاحظة الطبية المستمرة بالطوارئ", rating: 4.8 },
      { id: "ed-4", title: "Emergency Procedure Consent", category: "Emergency", description: "نموذج الموافقة على الإجراءات الطارئة", rating: 4.9 },
      { id: "ed-5", title: "Nursing Quick Assessment", category: "Emergency", description: "شيت التقييم التمريضي السريع للطوارئ", rating: 4.8 },
      { id: "ed-6", title: "Emergency Stat Medication Orders", category: "Emergency", description: "أمر إعطاء الأدوية الوريدية الطارئة", rating: 5.0 },
      { id: "ed-7", title: "Medico-Legal/Police Report Form", category: "Emergency", description: "تقرير الحوادث الجنائية والإبلاغ الشرطي", rating: 4.7 },
      { id: "ed-8", title: "DAMA Form - Emergency", category: "Emergency", description: "نموذج الخروج ضد النصح الطبي من الطوارئ", rating: 4.6 },
      { id: "ed-9", title: "ED Admission/Transfer Order", category: "Emergency", description: "قرار وتوصية النقل من الطوارئ إلى التنويم أو العناية", rating: 4.9 },
    ],
    him: [
      { id: "him-1", title: "Access to Medical Records Request", category: "HIM", description: "نموذج طلب الاطلاع على الملف الطبي", rating: 4.7 },
      { id: "him-2", title: "Authorization for Release of Information", category: "HIM", description: "تفويض الإفصاح عن المعلومات الطبية", rating: 4.8 },
      { id: "him-3", title: "Quantitative Medical Record Audit", category: "HIM", description: "شيت التدقيق والمراجعة الكمية للملف الطبي", rating: 4.6 },
      { id: "him-4", title: "ICD-10/ICD-11 & CPT Coding Sheet", category: "HIM", description: "نموذج ترميز الأمراض والعمليات", rating: 4.9 },
      { id: "him-5", title: "Amendment Request Form", category: "HIM", description: "طلب تصحيح أو تعديل بيانات في الملف الطبي", rating: 4.7 },
      { id: "him-6", title: "File Archiving & Destruction Log", category: "HIM", description: "نموذج أرشفة وإتلاف الملفات الوريقية القديمة", rating: 4.5 },
      { id: "him-7", title: "File Tracking/Outguide Sheet", category: "HIM", description: "شيت تتبع حركة الملف الورقي", rating: 4.6 },
    ],
    ipd: [
      { id: "ipd-1", title: "Inpatient Admission Order & Sheet", category: "IPD", description: "شيت القبول الطبي وبدء التنويم", rating: 5.0 },
      { id: "ipd-2", title: "Initial Nursing Assessment", category: "IPD", description: "التقييم التمريضي الشامل عند الدخول", rating: 4.9 },
      { id: "ipd-3", title: "Daily Progress Notes", category: "IPD", description: "شيت الفحص الطبي اليومي والملاحظات التقدمية", rating: 5.0 },
      { id: "ipd-4", title: "Physician Orders Sheet", category: "IPD", description: "شيت أوامر الطبيب الموحدة", rating: 5.0 },
      { id: "ipd-5", title: "MAR - Medication Administration Record", category: "IPD", description: "سجل إعطاء الأدوية التمريضي", rating: 5.0 },
      { id: "ipd-6", title: "Vital Signs Flowsheet", category: "IPD", description: "شيت مراقبة العلامات الحيوية الدوري", rating: 4.9 },
      { id: "ipd-7", title: "Intake & Output Balance Sheet", category: "IPD", description: "سجل السوائل الداخلة والخارجة", rating: 4.8 },
      { id: "ipd-8", title: "Morse Fall Risk Assessment", category: "IPD", description: "نموذج تقييم مخاطر السقوط - مورس", rating: 4.8 },
      { id: "ipd-9", title: "Braden Scale for Bedsores", category: "IPD", description: "نموذج تقييم مخاطر قرح الفراش - برادن", rating: 4.8 },
      { id: "ipd-10", title: "Pain Assessment & Management Scale", category: "IPD", description: "شيت تقييم الألم وإدارته", rating: 4.9 },
      { id: "ipd-11", title: "Nursing Care Plan", category: "IPD", description: "نموذج خطة الرعاية التمريضية اليومية", rating: 4.9 },
      { id: "ipd-12", title: "Internal Consultation Request", category: "IPD", description: "طلب استشارة طبية بين الأقسام", rating: 4.7 },
      { id: "ipd-13", title: "Discharge Summary Sheet", category: "IPD", description: "نموذج ملخص الخروج الطبي", rating: 5.0 },
      { id: "ipd-14", title: "Patient Discharge Instructions", category: "IPD", description: "تعليمات الخروج وإرشادات المريض", rating: 4.9 },
      { id: "ipd-15", title: "DAMA - Discharge Against Medical Advice", category: "IPD", description: "نموذج الخروج ضد النصح الطبي", rating: 4.7 },
    ],
    icu: [
      { id: "icu-1", title: "Hourly Critical Care Flowsheet", category: "ICU", description: "شيت المراقبة المكثفة للساعة", rating: 5.0 },
      { id: "icu-2", title: "Mechanical Ventilator Parameters Log", category: "ICU", description: "سجل إعدادات جهاز التنفس الصناعي", rating: 4.9 },
      { id: "icu-3", title: "Glasgow Coma Scale - GCS", category: "ICU", description: "شيت تقييم درجة الوعي - جلاسكو", rating: 4.9 },
      { id: "icu-4", title: "CAM-ICU Assessment Sheet", category: "ICU", description: "نموذج تقييم الهذيان في العناية", rating: 4.8 },
      { id: "icu-5", title: "Infusion Pump Titration Log", category: "ICU", description: "شيت مراقبة المحاليل الوريدية ومضخات الحقن", rating: 5.0 },
      { id: "icu-6", title: "APACHE II / SOFA Scoring Sheet", category: "ICU", description: "نموذج حساب سكور الخطورة الطبي", rating: 4.7 },
      { id: "icu-7", title: "CRRT Therapy Log", category: "ICU", description: "سجل غسيل الكلى الحاد المستمر", rating: 4.8 },
      { id: "icu-8", title: "Lines, Drains, & Airway Care Sheet", category: "ICU", description: "شيت العناية التمريضية الخاصة بالقساطر والأنابيب", rating: 4.9 },
    ],
    or: [
      { id: "or-1", title: "Pre-Anesthesia Evaluation Sheet", category: "OR", description: "نموذج تقييم ما قبل التخدير", rating: 4.9 },
      { id: "or-2", title: "Surgical & Anesthesia Informed Consent", category: "OR", description: "نموذج الموافقة المستنيرة على الجراحة والتخدير", rating: 5.0 },
      { id: "or-3", title: "WHO Surgical Safety Checklist", category: "OR", description: "قائمة التحقق من سلامة الجراحة", rating: 5.0 },
      { id: "or-4", title: "Intra-Operative Anesthesia Record", category: "OR", description: "شيت المراقبة أثناء التخدير", rating: 4.9 },
      { id: "or-5", title: "Operative/Surgery Report", category: "OR", description: "تقرير الإجراء الجراحي وتفاصيل العملية", rating: 5.0 },
      { id: "or-6", title: "Surgical Count Sheet - Sponges & Instruments", category: "OR", description: "سجل العد الجراحي - الفوط والأدوات", rating: 4.9 },
      { id: "or-7", title: "PACU / Recovery Room Monitoring Sheet", category: "OR", description: "شيت الإنعاش والملاحظة في الإفاقة", rating: 4.9 },
      { id: "or-8", title: "Aldrete Scoring Sheet", category: "OR", description: "تقييم الخروج من الإفاقة إلى القسم الداخلي", rating: 4.8 },
      { id: "or-9", title: "Pathology Specimen Request", category: "OR", description: "نموذج طلب وفحص الأنسجة المستأصلة - الباثولوجي", rating: 4.7 },
    ],
    pharmacy: [
      { id: "rx-1", title: "Prescription Clinical Review", category: "Pharmacy", description: "نموذج مراجعة وتدقيق ملاءمة الوصفة الطبية", rating: 4.8 },
      { id: "rx-2", title: "Medication Reconciliation Sheet", category: "Pharmacy", description: "شيت مراجعة وتوفيق الأدوية عند الدخول/الخروج", rating: 4.9 },
      { id: "rx-3", title: "Ward Stock Requisition", category: "Pharmacy", description: "نموذج طلب الأدوية والمحاليل للأقسام - نظام الكوتا", rating: 4.7 },
      { id: "rx-4", title: "Unit Dose Dispensing Log", category: "Pharmacy", description: "شيت صرف أدوية جرعة اليوم الواحد", rating: 4.9 },
      { id: "rx-5", title: "Narcotics & Controlled Drugs Ledger", category: "Pharmacy", description: "سجل صرف ومراقبة الأدوية المخدرة والمراقبة", rating: 5.0 },
      { id: "rx-6", title: "ADR - Adverse Drug Reaction Report", category: "Pharmacy", description: "نموذج الإبلاغ عن الآثار الجانبية للأدوية", rating: 4.8 },
      { id: "rx-7", title: "Medication Error / Near Miss Report", category: "Pharmacy", description: "تقرير الأخطاء الدوائية أو وشيك الوقوع", rating: 4.9 },
      { id: "rx-8", title: "IV Admixture & Oncology Compounding Sheet", category: "Pharmacy", description: "شيت التحضير الورقي المعقم للمحاليل والكيماوي", rating: 4.8 },
      { id: "rx-9", title: "Non-Formulary Drug Request Form", category: "Pharmacy", description: "نموذج طلب توفير دواء غير مدرج بالدليل", rating: 4.6 },
    ],
    lab: [
      { id: "lab-1", title: "Phlebotomy & Patient Verification Log", category: "Laboratory", description: "شيت سحب العينات وتطابق الهوية", rating: 4.8 },
      { id: "lab-2", title: "Lab Investigation Request", category: "Laboratory", description: "طلب فحص مخبري تخصصي - كيمياء، دم، مناعة", rating: 4.9 },
      { id: "lab-3", title: "Microbiology & Culture Request Sheet", category: "Laboratory", description: "نموذج طلب فحص الميكروبيولوجيا والمزارع", rating: 4.8 },
      { id: "lab-4", title: "Critical Value Notification Log", category: "Laboratory", description: "شيت تسجيل النتائج الحرجة والإبلاغ الفوري", rating: 5.0 },
      { id: "lab-5", title: "Daily QC/Calibration Log", category: "Laboratory", description: "سجل ضبط الجودة اليومي للأجهزة", rating: 4.7 },
      { id: "lab-6", title: "Specimen Rejection Form", category: "Laboratory", description: "نموذج رفض أو إعادة سحب العينة غير المطابقة", rating: 4.6 },
    ],
    rad: [
      { id: "rad-1", title: "MRI Safety Checklist", category: "Radiology", description: "شيت فحص السلامة قبل الرنين المغناطيسي", rating: 5.0 },
      { id: "rad-2", title: "Contrast Media Informed Consent", category: "Radiology", description: "نموذج الموافقة على حقن الصبغة والتحقق من وظائف الكلى", rating: 4.9 },
      { id: "rad-3", title: "Radiology/Interventional Request", category: "Radiology", description: "طلب فحص أشعة تشخيصية/تداخلية", rating: 4.8 },
      { id: "rad-4", title: "Radiology Diagnostic Report Template", category: "Radiology", description: "تقرير طبيب الأشعة النهائي", rating: 4.9 },
      { id: "rad-5", title: "Patient Radiation Dose Tracking Log", category: "Radiology", description: "سجل مراقبة الجرعات الإشعاعية للمرضى", rating: 4.7 },
      { id: "rad-6", title: "Post-Interventional Radiology Monitoring Sheet", category: "Radiology", description: "شيت متابعة المريض بعد الأشعة التداخلية", rating: 4.8 },
    ],
    blood: [
      { id: "bld-1", title: "Blood Requisition & Crossmatch Form", category: "Blood Bank", description: "نموذج طلب وفحص توافق الدم ومشتقاته", rating: 5.0 },
      { id: "bld-2", title: "Blood Donor Screening Questionnaire", category: "Blood Bank", description: "شيت فحص واستبيان المتبرعين بالدم", rating: 4.9 },
      { id: "bld-3", title: "Blood & Blood Components Issuing Log", category: "Blood Bank", description: "سجل صرف الدم ومشتقاته للأقسام", rating: 4.9 },
      { id: "bld-4", title: "Blood Transfusion Monitoring Flowsheet", category: "Blood Bank", description: "شيت مراقبة نقل الدم والعلامات الحيوية", rating: 5.0 },
      { id: "bld-5", title: "Blood Transfusion Reaction Report", category: "Blood Bank", description: "تقرير الإبلاغ عن تفاعلات ومضاعفات نقل الدم", rating: 4.9 },
      { id: "bld-6", title: "Blood Unit Discard/Wastage Log", category: "Blood Bank", description: "سجل إتلاف وتخلص من وحدات الدم المنتهية", rating: 4.8 },
    ],
    quality: [
      { id: "qa-1", title: "OVR - Occurrence/Incident Report Form", category: "Quality", description: "تقرير الحوادث العارضة والمخاطر", rating: 5.0 },
      { id: "qa-2", title: "HAIs - Hospital Acquired Infection Surveillance", category: "Quality", description: "شيت رصد وتتبع عدوى المنشآت الصحية", rating: 4.9 },
      { id: "qa-3", title: "Infection Control Daily Audit Checklist", category: "Quality", description: "قائمة تدقيق المرور اليومي لمكافحة العدوى", rating: 4.8 },
      { id: "qa-4", title: "Communicable Disease Notification Form", category: "Quality", description: "نموذج الإبلاغ عن الأمراض المعدية للوزارة", rating: 4.9 },
      { id: "qa-5", title: "Hand Hygiene Compliance Observation Sheet", category: "Quality", description: "شيت مراقبة الالتزام بنظافة الأيدي", rating: 4.7 },
      { id: "qa-6", title: "Needlestick & Sharp Injury Report", category: "Quality", description: "تقرير تقصي حادثة وخز الإبر والآلات الحادة", rating: 4.9 },
      { id: "qa-7", title: "Patient Satisfaction Survey", category: "Quality", description: "نموذج استبيان رضا المرضى عن الخدمات الطبية", rating: 4.8 },
      { id: "qa-8", title: "IPSG Compliance Log", category: "Quality", description: "شيت متابعة المؤشرات القياسية لأهداف سلامة المرضى الدولية", rating: 4.8 },
    ],
    billing: [
      { id: "bil-1", title: "Pro-forma / Provisional Invoice", category: "Finance", description: "شيت الفاتورة المبدئية للمريض", rating: 4.7 },
      { id: "bil-2", title: "Final Detailed Medical Bill", category: "Finance", description: "شيت الفاتورة التفصيلية النهائية والخروج", rating: 4.9 },
      { id: "bil-3", title: "Insurance Invoicing & Claims Form", category: "Finance", description: "نموذج المطالبة المالية لشركات التأمين", rating: 4.8 },
      { id: "bil-4", title: "Insurance Denial Management Log", category: "Finance", description: "سجل معالجة رفض المطالبان التأمينية", rating: 4.7 },
      { id: "bil-5", title: "Patient Ledger & Payment History", category: "Finance", description: "نموذج كشف حساب المريض وحركة السداد", rating: 4.8 },
      { id: "bil-6", title: "Financial Charity/Waiver Request", category: "Finance", description: "طلب إعفاء مالي أو تحويل للجمعيات الخيرية", rating: 4.6 },
      { id: "bil-7", title: "Patient Valuables/Deposit Form", category: "Finance", description: "نموذج إيداع الأمانات النقدية أو العينية للمريض", rating: 4.7 },
    ],
    allied: [
      { id: "ah-1", title: "Physical Therapy Initial Assessment", category: "Allied Health", description: "شيت التقييم الأولي للعلاج الطبيعي", rating: 4.8 },
      { id: "ah-2", title: "Physiotherapy Session & Progress Log", category: "Allied Health", description: "سجل جلسات ومتابعة التأهيل الطبي", rating: 4.7 },
      { id: "ah-3", title: "Nutritional Assessment & Diet Order", category: "Allied Health", description: "نموذج التقييم التغذوي ووضع خطة الوجبات", rating: 4.8 },
      { id: "ah-4", title: "Medical Social Work Assessment", category: "Allied Health", description: "شيت الخدمة الاجتماعية الطبية ومتابعة الحالات", rating: 4.6 },
      { id: "ah-5", title: "Home Health Care Plan Sheet", category: "Allied Health", description: "نموذج خطة الرعاية المنزلية للمريض", rating: 4.7 },
    ],
    admin: [
      { id: "adm-sys-1", title: "User Account & Role Creation Request", category: "IT/Admin", description: "نموذج طلب إنشاء / تعديل صلاحيات مستخدم", rating: 4.7 },
      { id: "adm-sys-2", title: "User Access & Login Audit Log", category: "IT/Admin", description: "سجل مراقبة وتتبع دخول المستخدمين", rating: 4.8 },
      { id: "adm-sys-3", title: "Data Modification/Delete Audit Trail", category: "IT/Admin", description: "سجل التعديلات والحذف على البيانات الحساسة", rating: 4.9 },
      { id: "adm-sys-4", title: "Medical Record Locking Request", category: "IT/Admin", description: "نموذج طلب تجميد أو إغلاق ملف طبي", rating: 4.6 },
      { id: "adm-sys-5", title: "HIS System Bug/Issue Report", category: "IT/Admin", description: "تقرير الأخطاء التقنية والأعطال بالبرنامج", rating: 4.5 },
      { id: "adm-sys-6", title: "System Backup & Restore Log", category: "IT/Admin", description: "سجل النسخ الاحتياطي واسترجاع البيانات", rating: 4.8 },
      { id: "adm-sys-7", title: "System Update & Downtime Log", category: "IT/Admin", description: "نموذج توثيق تحديث النظام والصيانة الدورية", rating: 4.7 },
    ],
  };

  const currentForms = formsData[activeTab]?.filter(form => 
    form.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) || 
    form.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  ) || [];

  const { updatePatient, patients } = useHIS();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [signedBy, setSignedBy] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  const currentPatient = patients?.find(p => p.id === patientId || p.mrn === patientId);
  const activePatientName = currentPatient ? (isAr ? currentPatient.nameAr : currentPatient.nameEn) : (patientName || (isAr ? "سمير عبدالله حافظ" : "Samir Abdullah Hafez"));
  const activePatientMRN = currentPatient ? currentPatient.mrn : (patientId || "MRN-2026-0041");
  const activePatientAge = currentPatient ? currentPatient.age : 45;
  const activePatientGender = currentPatient ? currentPatient.gender : (isAr ? "ذكر" : "Male");

  const getInitialFormData = (form: any) => {
    // If patient already has this form saved, load it!
    if (currentPatient?.filledForms?.[form.id]) {
      const saved = currentPatient.filledForms[form.id];
      if (saved.signedBy) {
        setSignedBy(saved.signedBy);
        setSignedAt(saved.signedAt);
      }
      return saved.data;
    }

    const defaults: Record<string, any> = {
      patientName: activePatientName,
      mrn: activePatientMRN,
      date: new Date().toLocaleDateString(),
      clinicianName: isAr ? "د. أحمد علي" : "Dr. Ahmad Ali",
    };

    if (form.id === "adm-1" || form.id === "adm-2") {
      return {
        ...defaults,
        dob: "1981-04-12",
        gender: activePatientGender,
        nationality: isAr ? "سعودي" : "Saudi",
        nationalId: "1098374839",
        phone: currentPatient?.phone || "0501234567",
        emergencyContact: isAr ? "عبدالله حافظ (الأب) - 0507654321" : "Abdullah Hafez (Father) - 0507654321",
        admissionReason: isAr ? "التهاب الزائدة الدودية الحاد" : "Acute appendicitis with localized peritonitis",
        bloodGroup: "O+",
        wardRoom: "ICU-Bed 4"
      };
    } else if (form.id === "adm-3" || form.id === "or-2") {
      return {
        ...defaults,
        consentText: isAr 
          ? "أقر بموافقتي التامة على إجراء الفحوصات والتدخلات الطبية والجراحية اللازمة تحت التخدير الموضعي أو العام لحالتي الصحية، وقد تم شرح كافة المخاطر المتوقعة من قبل الفريق الطبي."
          : "I hereby declare my full consent to undergo the necessary diagnostic and surgical procedures under local or general anesthesia for my clinical condition, and all associated risks have been explained to me by the clinical team.",
        guardianName: activePatientName,
        guardianId: "1098374839",
        witnessName: isAr ? "أحمد العتيبي" : "Ahmad Al-Otaibi",
        consentSigned: true
      };
    } else if (form.id === "opd-1" || form.id === "ipd-6") {
      return {
        ...defaults,
        temp: "37.2",
        bp: "118/76",
        hr: "82",
        spo2: "98",
        rr: "16",
        height: "175",
        weight: "78",
        bmi: "25.5",
        painScore: "3",
        triagePriority: "Level 3 - Urgent"
      };
    } else if (form.id === "opd-2" || form.id === "ipd-3") {
      return {
        ...defaults,
        chiefComplaint: isAr ? "ألم شديد في الربع الأسفل الأيمن من البطن منذ 12 ساعة" : "Severe right lower quadrant abdominal pain for 12 hours.",
        hpi: isAr 
          ? "يعاني المريض من ألم مفاجئ بدأ حول السرة ثم انتقل إلى الجهة اليمنى السفلى. الألم مصحوب بغثيان وتقيؤ مرتين وحرارة خفيفة."
          : "Patient reports sudden onset of colicky pain starting periumbilical then migrating to RLQ. Associated with nausea, twice vomiting, and mild subjective fever.",
        pastHistory: isAr ? "ارتفاع ضغط الدم يتم التحكم فيه بعقار أملوديبين." : "Hypertension managed with Amlodipine.",
        allergies: isAr ? "البنسلين (يسبب حكة وطفح جلدي)" : "Penicillin (causes rash)",
        physicalExam: isAr
          ? "البطن: ألم وضغط عند نقطة ماكبيرني مع وجود علامة الارتداد الإيجابية. الصدر: سليم. القلب: أصوات طبيعية."
          : "Abdomen: Guarding and tenderness at McBurney's point. Positive rebound tenderness. Chest: Clear. CVS: S1 S2 normal.",
        assessment: isAr ? "التهاب الزائدة الدودية الحاد" : "Acute Appendicitis",
        carePlan: isAr
          ? "منع الأكل والشرب، البدء بالمحاليل الوريدية، إعطاء باراسيتامول 1 جرام وريدياً، وتحضير المريض لعملية جراحية عاجلة بالمنظار."
          : "NPO, IV fluids started. Administered paracetamol 1g IV. Prepared for urgent laparoscopic appendectomy."
      };
    } else if (form.id === "opd-5" || form.id === "ipd-4") {
      return {
        ...defaults,
        drugName: "Ceftriaxone IV",
        dosageStrength: "1 g",
        route: "IV",
        frequency: "Q12H",
        duration: "5",
        quantity: "10 vials",
        licenseNumber: "SCHS-8293847"
      };
    } else if (form.id === "ed-2") {
      return {
        ...defaults,
        mechanismOfInjury: isAr ? "حادث سير - اصطدام أمامي بسرعة 60 كم/س" : "Road Traffic Accident (RTA) - Frontal impact at 60 km/h",
        airway: isAr ? "مفتوح ومحمي" : "Patent, protected",
        breathing: isAr ? "تمدد متماثل للصدر، معدل التنفس 18 دورة/د" : "Symmetric chest expansion, respiratory rate 18 bpm",
        circulation: isAr ? "النبض الكعبري قوي ومنتظم (90 ن/د)، الأطراف دافئة" : "Radial pulse strong & regular (90 bpm), warm extremities",
        disability: "GCS 15 (E4 V5 M6)",
        exposure: isAr ? "سحجات خفيفة في الذراع اليمنى. تم استخدام غطاء دافئ." : "Mild abrasions on right arm. Warm blanket applied.",
        traumaScore: "12/12"
      };
    } else if (form.id === "ipd-8") {
      return {
        ...defaults,
        fallHistory: "Yes (25)",
        secondaryDiagnosis: "Yes (15)",
        ambulatoryAid: "None/Bedrest/Nurse assist (0)",
        ivTherapy: "Yes (20)",
        gait: "Weak (10)",
        mentalStatus: "Knows own limits (0)",
        totalFallScore: "70",
        fallRiskLevel: "High Risk"
      };
    } else if (form.id === "ipd-13") {
      return {
        ...defaults,
        admissionDate: "2026-06-25",
        dischargeDate: "2026-06-30",
        diagnosis: isAr ? "التهاب الزائدة الدودية الحاد - بعد استئصالها بالمنظار" : "Acute Appendicitis - Post Laparoscopic Appendectomy",
        hospitalCourse: isAr
          ? "فترة نقاهة خالية من المضاعفات بعد العملية. المريض يتناول الطعام بشكل طبيعي. تم التحكم في الألم بالمسكنات الفموية."
          : "Uncomplicated post-operative recovery. Tolerating regular diet. Pain controlled with oral analgesics.",
        procedures: isAr ? "استئصال الزائدة الدودية بالمنظار (2026-06-25)" : "Laparoscopic Appendectomy (2026-06-25)",
        dischargeMeds: "Cefuroxime 500mg PO BID for 5 days, Ibuprofen 400mg PO TID PRN for pain.",
        dischargeInstructions: isAr
          ? "المحافظة على نظافة وجفاف الجرح. تجنب رفع الأشياء الثقيلة لأكثر من 5 كجم لمدة شهر. مراجعة الطوارئ فوراً في حال حدوث حمى أو ألم حاد."
          : "Keep wound dry. Avoid heavy lifting (>5 kg) for 4 weeks. Return to ED if fever, severe abdominal pain, or redness/pus at wound sites.",
        followupDate: "2026-07-07 in Surgical OPD"
      };
    } else if (form.id === "icu-2") {
      return {
        ...defaults,
        ventMode: "ACVC (Assist/Control Volume)",
        tidalVolume: "450",
        setRR: "14",
        actualRR: "15",
        fio2: "40",
        peep: "5",
        pressureSupport: "0",
        etSizeDepth: "8.0 mm @ 22 cm"
      };
    } else if (form.id === "or-3") {
      return {
        ...defaults,
        signInConfirmed: "Yes",
        siteMarked: "Yes",
        anesthesiaCheck: "Yes",
        timeOutConfirmed: "Yes",
        antibioticProphylaxis: "Yes",
        signOutConfirmed: "Yes",
        countsCorrect: "Yes",
        specimenLabeled: "Yes"
      };
    } else if (form.id === "qa-1") {
      return {
        ...defaults,
        incidentDateTime: "2026-06-29 14:30",
        incidentLocation: "Inpatient Ward 3 - Room 302",
        incidentType: "Medication Error - Near Miss",
        incidentDesc: isAr
          ? "تم تحضير جرعة خاطئة من دواء السيفتركسون من قبل مخزن القسم ولكن تم رصدها وتصحيحها أثناء الفحص بجانب السرير (eMAR) قبل الإعطاء."
          : "Incorrect dose of Ceftriaxone (2g instead of 1g) was prepared by the ward stock but noticed and corrected during bedside barcode verification (eMAR check) before administration.",
        actionTaken: isAr ? "تم تحضير الجرعة الصحيحة وإعطاؤها وتوعية الفريق بأهمية مراجعة الأوامر. لا يوجد ضرر على المريض." : "The correct dose was prepared. Ward team debriefed on double-checking orders. No patient harm.",
        reporterName: isAr ? "سارة سميث (ممرضة قانونية)" : "Sarah Smith, RN"
      };
    } else if (form.id === "bil-2") {
      return {
        ...defaults,
        roomCharges: "1500.00",
        labFees: "850.00",
        pharmacyCharges: "620.00",
        radFees: "1200.00",
        consultFees: "500.00",
        grossTotal: "4670.00",
        insuranceCover: "4203.00 (90%)",
        patientNet: "467.00"
      };
    }

    return {
      ...defaults,
      notes: ""
    };
  };

  useEffect(() => {
    if (selectedForm) {
      setFormData(getInitialFormData(selectedForm));
      setIsEditing(false);
      setSignedBy(null);
      setSignedAt(null);
    }
  }, [selectedForm, patientId, patientName]);

  const handleSaveForm = () => {
    if (!patientId) {
      toast.warning(isAr ? "يجب اختيار مريض أولاً لحفظ السجل" : "Please select a patient to save this record");
      return;
    }

    const clinicianSignature = isAr ? "د. أحمد علي (موقّع رقمياً)" : "Dr. Ahmad Ali (E-Signed)";
    const timestamp = new Date().toLocaleString();

    setSignedBy(clinicianSignature);
    setSignedAt(timestamp);
    setIsEditing(false);

    // Save to Firestore / local context
    if (updatePatient) {
      const existingForms = currentPatient?.filledForms || {};
      updatePatient(patientId, {
        filledForms: {
          ...existingForms,
          [selectedForm.id]: {
            data: formData,
            signedBy: clinicianSignature,
            signedAt: timestamp,
            title: selectedForm.title,
            category: selectedForm.category,
            id: selectedForm.id
          }
        }
      });
    }

    toast.success(isAr ? "تم توقيع وحفظ المستند السريري في ملف المريض بنجاح" : "Clinical document signed and saved to patient file successfully");
  };

  const renderField = (labelAr: string, labelEn: string, key: string, type: "text" | "textarea" | "select" | "checkbox" = "text", options: string[] = []) => {
    const isReadOnly = !isEditing || signedBy !== null;
    const value = formData[key] || "";

    const handleChange = (val: any) => {
      setFormData(prev => ({ ...prev, [key]: val }));
    };

    return (
      <div className={`space-y-1 ${type === "checkbox" ? "flex items-center gap-3 pt-3" : ""}`}>
        {type !== "checkbox" && (
          <label className="text-xs font-bold text-slate-700 flex justify-between items-center">
            <span className="text-slate-800">{labelAr}</span>
            <span className="text-slate-400 text-[10px] font-mono font-medium">{labelEn}</span>
          </label>
        )}

        {type === "textarea" ? (
          isReadOnly ? (
            <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl text-sm text-slate-800 min-h-[80px] whitespace-pre-wrap leading-relaxed">
              {value || <span className="text-slate-300 italic">فارغ / Empty</span>}
            </div>
          ) : (
            <textarea
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[80px]"
            />
          )
        ) : type === "select" ? (
          isReadOnly ? (
            <div className="h-10 px-3 flex items-center bg-slate-50/50 border border-slate-100 rounded-xl text-sm text-slate-800 font-medium">
              {value || <span className="text-slate-300 italic">غير محدد / Not specified</span>}
            </div>
          ) : (
            <select
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="">-- اختر / Choose --</option>
              {options.map((opt, i) => (
                <option key={i} value={opt}>{opt}</option>
              ))}
            </select>
          )
        ) : type === "checkbox" ? (
          <>
            <input
              type="checkbox"
              id={key}
              checked={!!value}
              disabled={isReadOnly}
              onChange={(e) => handleChange(e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 disabled:opacity-50"
            />
            <label htmlFor={key} className="text-xs font-bold text-slate-700 flex flex-col cursor-pointer">
              <span className="text-slate-800">{labelAr}</span>
              <span className="text-slate-400 text-[10px] font-mono font-medium">{labelEn}</span>
            </label>
          </>
        ) : (
          isReadOnly ? (
            <div className="h-10 px-3 flex items-center bg-slate-50/50 border border-slate-100 rounded-xl text-sm text-slate-800">
              {value || <span className="text-slate-300 italic">فارغ / Empty</span>}
            </div>
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              className="w-full h-10 px-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          )
        )}
      </div>
    );
  };

  const renderClinicalFormBody = (formId: string) => {
    if (formId === "adm-1" || formId === "adm-2") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("تاريخ الميلاد", "Date of Birth", "dob", "text")}
            {renderField("الجنس", "Gender", "gender", "text")}
            {renderField("الجنسية", "Nationality", "nationality", "text")}
            {renderField("رقم الهوية الوطنية / الإقامة", "National ID / Iqama", "nationalId", "text")}
            {renderField("رقم الجوال", "Phone Number", "phone", "text")}
            {renderField("جهة اتصال الطوارئ", "Emergency Contact (Name/Phone)", "emergencyContact", "text")}
          </div>
          <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/50 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("سبب التنويم الطبي المقترح", "Proposed Admission Diagnosis", "admissionReason", "textarea")}
            {renderField("فصيلة الدم", "Blood Group", "bloodGroup", "select", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"])}
            {renderField("الجناح والغرفة المخصصة", "Assigned Ward & Room", "wardRoom", "text")}
            {renderField("تاريخ وتوقيت الدخول المتوقع", "Scheduled Admission Date/Time", "date", "text")}
          </div>
        </div>
      );
    }

    if (formId === "adm-3" || formId === "or-2") {
      return (
        <div className="space-y-4">
          <div className="p-5 bg-amber-50/50 border border-amber-200/50 rounded-2xl space-y-3">
            <h4 className="font-bold text-sm text-amber-800 flex items-center gap-2">
              <ShieldCheck size={18} />
              <span>إقرار وإذن بالتدخل الطبي والجراحي</span>
            </h4>
            {renderField("نص الإقرار الطبي الرسمي المعتمد بالمستشفى", "Official Consent & Disclosure Text", "consentText", "textarea")}
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("اسم ولي الأمر (في حال القاصر أو فاقد الأهلية)", "Guardian Full Name (If minor/incapacitated)", "guardianName", "text")}
            {renderField("رقم هوية ولي الأمر", "Guardian National ID/Passport", "guardianId", "text")}
            {renderField("اسم الشاهد على الإقرار", "Witness Full Name", "witnessName", "text")}
            {renderField("تم التوقيع والموافقة إلكترونياً من المريض/الولي", "Consent Digitally Confirmed by Patient/Guardian", "consentSigned", "checkbox")}
          </div>
        </div>
      );
    }

    if (formId === "opd-1" || formId === "ipd-6") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/30 border border-emerald-100/50 rounded-2xl grid grid-cols-2 md:grid-cols-5 gap-3">
            {renderField("الحرارة (C°)", "Temperature (C°)", "temp", "text")}
            {renderField("ضغط الدم (mmHg)", "Blood Pressure (mmHg)", "bp", "text")}
            {renderField("النبض (bpm)", "Heart Rate (bpm)", "hr", "text")}
            {renderField("الأكسجين (%)", "Oxygen Saturation (%)", "spo2", "text")}
            {renderField("معدل التنفس (rpm)", "Respiratory Rate (rpm)", "rr", "text")}
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderField("الطول (cm)", "Height (cm)", "height", "text")}
            {renderField("الوزن (kg)", "Weight (kg)", "weight", "text")}
            {renderField("مؤشر كتلة الجسم", "Body Mass Index (BMI)", "bmi", "text")}
          </div>
          <div className="p-4 bg-rose-50/30 border border-rose-100/50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("مقياس الألم (1-10)", "Pain Scale (1-10)", "painScore", "select", ["0 - No Pain", "1 - Mild", "2", "3 - Moderate", "4", "5", "6 - Severe", "7", "8", "9", "10 - Worst Pain"])}
            {renderField("أولوية الفرز والفرز الطبي", "Triage Priority Level", "triagePriority", "select", ["Level 1 - Resuscitation (أحمر)", "Level 2 - Emergent (برتقالي)", "Level 3 - Urgent (أصفر)", "Level 4 - Less Urgent (أخضر)", "Level 5 - Non-Urgent (أزرق)"])}
          </div>
        </div>
      );
    }

    if (formId === "opd-2" || formId === "ipd-3") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 gap-4">
            {renderField("الشكوى الرئيسية للمريض والمدة", "Chief Complaint & Duration", "chiefComplaint", "textarea")}
            {renderField("تفاصيل التاريخ المرضي الحالي", "History of Present Illness (HPI)", "hpi", "textarea")}
          </div>
          <div className="p-4 bg-rose-50/20 border border-rose-100/30 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("التاريخ المرضي السابق والأمراض المزمنة", "Past Medical & Surgical History", "pastHistory", "textarea")}
            {renderField("الحساسية المعروفة (أدوية/أطعمة)", "Known Allergies & Adverse Reactions", "allergies", "text")}
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 gap-4">
            {renderField("نتائج الفحص السريري العام للأجهزة", "Physical Examination Findings", "physicalExam", "textarea")}
          </div>
          <div className="p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("التقييم والتشخيص المبدئي", "Clinical Assessment & Diagnosis", "assessment", "textarea")}
            {renderField("خطة العلاج والمتابعة التفصيلية", "Care Plan & Orders", "carePlan", "textarea")}
          </div>
        </div>
      );
    }

    if (formId === "opd-5" || formId === "ipd-4") {
      return (
        <div className="space-y-4">
          <div className="p-5 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-indigo-800 flex items-center gap-2">
              <Pill size={18} />
              <span>تفاصيل الدواء والجرعات الطبية الموصوفة</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("اسم الدواء العلمي والتجاري", "Medication Name (Generic/Brand)", "drugName", "text")}
              {renderField("قوة الجرعة وشكلها", "Dosage & Strength", "dosageStrength", "text")}
            </div>
            <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderField("طريقة الإعطاء", "Route of Administration", "route", "select", ["Oral (فمي)", "IV (وريدي)", "IM (عضلي)", "Subcutaneous (تحت الجلد)", "Inhalation (استنشاق)", "Topical (موضعي)"])}
              {renderField("معدل التكرار", "Frequency", "frequency", "select", ["Once (مرة واحدة)", "QD (يومياً)", "BID (مرتين باليوم)", "TID (3 مرات باليوم)", "QID (4 مرات باليوم)", "Q8H (كل 8 ساعات)", "Q12H (كل 12 ساعة)", "PRN (عند الحاجة)"])}
              {renderField("مدة العلاج (بالأيام)", "Duration (Days)", "duration", "text")}
              {renderField("الكمية الإجمالية للصرف", "Total Quantity To Dispense", "quantity", "text")}
            </div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("اسم الطبيب الواصف المعتمد", "Authorized Prescriber Name", "clinicianName", "text")}
            {renderField("رقم ترخيص الهيئة السعودية للتخصصات الصحية", "Saudi Commission Health Specialty License (SCHS)", "licenseNumber", "text")}
          </div>
        </div>
      );
    }

    if (formId === "ed-2") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50/30 border border-rose-100/50 rounded-2xl grid grid-cols-1 gap-4">
            {renderField("آلية حدوث الإصابة وتفاصيل الحادث", "Mechanism of Injury & Incident Details", "mechanismOfInjury", "textarea")}
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("مجرى التنفس وحماية العنق", "Airway & Cervical Spine Control", "airway", "text")}
            {renderField("التنفس وتدفق الهواء بالصدر", "Breathing & Ventilation", "breathing", "text")}
            {renderField("الدورة الدموية والنبض وموقع النزيف", "Circulation & Hemorrhage Control", "circulation", "text")}
            {renderField("التقييم العصبي ومستوى الاستجابة", "Disability & Neurological Status (GCS)", "disability", "text")}
          </div>
          <div className="p-4 bg-amber-50/30 border border-amber-100/50 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("الفحص الظاهري وتعرض الجسم للبيئة", "Exposure & Environmental Control", "exposure", "textarea")}
            {renderField("مجموع نقاط تقييم الإصابات", "Trauma Score Assessment", "traumaScore", "text")}
          </div>
        </div>
      );
    }

    if (formId === "ipd-8") {
      return (
        <div className="space-y-4">
          <div className="p-5 bg-red-50/40 border border-red-100 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-red-800 flex items-center gap-2">
              <Activity size={18} />
              <span>تقييم مورس لمخاطر سقوط المرضى المومنين بالقسم</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("تاريخ السقوط خلال الـ 3 أشهر الماضية", "History of Falling (Last 3 Months)", "fallHistory", "select", ["No (0 points)", "Yes (25 points)"])}
              {renderField("وجود تشخيص طبي ثانوي مضاف بالملف", "Secondary Diagnosis (Multiple active diagnoses)", "secondaryDiagnosis", "select", ["No (0 points)", "Yes (15 points)"])}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("وسائل مساعدة على المشي والحركة", "Ambulatory Aid Used", "ambulatoryAid", "select", ["None / Bedrest / Nurse Assist (0 points)", "Crutches / Cane / Walker (15 points)", "Clutches on furniture (30 points)"])}
              {renderField("قسطرة وريدية متصلة بمحاليل مستمرة", "Intravenous Therapy / Heparin Lock", "ivTherapy", "select", ["No (0 points)", "Yes (20 points)"])}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("نمط وطريقة المشي والاتزان", "Gait & Balance", "gait", "select", ["Normal / Bedrest / Wheelchair (0 points)", "Weak - light limp, slight hunch (10 points)", "Impaired - holds furniture, unsteady (20 points)"])}
              {renderField("الحالة العقلية والوعي بالقدرات الذاتية", "Mental Status / Cognitive Fall Awareness", "mentalStatus", "select", ["Oriented to own ability (0 points)", "Overestimates or forgets limitations (15 points)"])}
            </div>
            <div className="pt-4 border-t border-red-100 flex justify-between items-center bg-white/50 p-3 rounded-xl">
              {renderField("مجموع نقاط تقييم مورس", "Total Morse Fall Score", "totalFallScore", "text")}
              {renderField("درجة خطورة السقوط والاحتياطات", "Fall Risk Level Classification", "fallRiskLevel", "select", ["Low Risk (0 - 24 points)", "Medium Risk (25 - 44 points)", "High Risk (>= 45 points)"])}
            </div>
          </div>
        </div>
      );
    }

    if (formId === "ipd-13") {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("تاريخ الدخول والقبول بالمستشفى", "Admission Date", "admissionDate", "text")}
            {renderField("تاريخ الخروج المرخص من الطبيب", "Discharge Date", "dischargeDate", "text")}
          </div>
          <div className="p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-2xl grid grid-cols-1 gap-4">
            {renderField("التشخيص الطبي النهائي والكامل عند الخروج", "Final Discharge Diagnosis", "diagnosis", "textarea")}
            {renderField("العمليات والإجراءات الطبية والسريرية التي أجريت", "Procedures & Operations Performed", "procedures", "textarea")}
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-1 gap-4">
            {renderField("ملخص فترة التنويم وسير العلاج بالمستشفى", "Brief Hospital Course", "hospitalCourse", "textarea")}
            {renderField("الأدوية الموصوفة للمنزل والجرعات التفصيلية", "Discharge Medications & Frequencies", "dischargeMeds", "textarea")}
          </div>
          <div className="p-4 bg-emerald-50/20 border border-emerald-100/30 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("التعليمات والتوجيهات الطبية للمنزل وأعراض الخطورة", "Discharge Instructions & Danger Signs", "dischargeInstructions", "textarea")}
            {renderField("موعد ومكان الاستشارة والمراجعة القادمة", "Follow-up Appointment Details", "followupDate", "text")}
          </div>
        </div>
      );
    }

    if (formId === "icu-2") {
      return (
        <div className="space-y-4">
          <div className="p-5 bg-sky-50/40 border border-sky-100 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-sky-800 flex items-center gap-2">
              <Activity size={18} />
              <span>إعدادات وقراءات جهاز التنفس الصناعي - العناية المركزة</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("نظام التهوئة المعتمد للجهاز", "Ventilator Mode", "ventMode", "select", ["ACVC (Assist/Control Volume)", "ACPC (Assist/Control Pressure)", "SIMV-VC", "SIMV-PC", "CPAP/PS (ضغط مستمر/دعم ضغط)", "BiPAP"])}
              {renderField("حجم الهواء للموجة الواحدة (Vt)", "Tidal Volume (Vt - mL)", "tidalVolume", "text")}
            </div>
            <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {renderField("معدل التنفس المستهدف", "Set Respiratory Rate (bpm)", "setRR", "text")}
              {renderField("معدل التنفس الفعلي للمريض", "Actual Respiratory Rate (bpm)", "actualRR", "text")}
              {renderField("نسبة الأكسجين المروى %", "Fraction of Inspired Oxygen (FiO2 %)", "fio2", "text")}
              {renderField("الضغط الإيجابي نهاية الزفير", "Positive End-Expiratory Pressure (PEEP)", "peep", "text")}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("دعم الضغط الإضافي فوق الـ PEEP", "Pressure Support (PS - cmH2O)", "pressureSupport", "text")}
              {renderField("مقاس الأنبوب الرغامي وعمقه عند الشفة", "Endotracheal Tube Size & Depth (cm)", "etSizeDepth", "text")}
            </div>
          </div>
        </div>
      );
    }

    if (formId === "or-3") {
      return (
        <div className="space-y-4">
          <div className="p-5 bg-teal-50/40 border border-teal-100 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-teal-800 flex items-center gap-2">
              <ShieldCheck size={18} />
              <span>WHO Surgical Safety Checklist - قائمة سلامة العمليات الجراحية</span>
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-white border border-teal-50 rounded-xl space-y-2">
                <span className="text-xs font-black text-teal-800">1. قبل التخدير (Sign In)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {renderField("تأكيد هوية المريض وموقع وموافقة الجراحة", "Patient/Site/Consent Confirmed", "signInConfirmed", "select", ["Yes (نعم)", "No (لا)"])}
                  {renderField("تعليم وتحديد موقع الجراحة بوضوح", "Surgical Site Marked", "siteMarked", "select", ["Yes (نعم)", "No (لا)", "Not Applicable"])}
                  {renderField("فحص وتجهيز أدوية وأجهزة التخدير بالكامل", "Anesthesia Safety Check Completed", "anesthesiaCheck", "select", ["Yes (نعم)", "No (لا)"])}
                </div>
              </div>

              <div className="p-3 bg-white border border-teal-50 rounded-xl space-y-2">
                <span className="text-xs font-black text-teal-800">2. قبل جرح الجلد (Time Out)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {renderField("تأكيد الفريق بالكامل لأدوارهم والعملية بصوت مسموع", "Introduction & Time Out Confirmed", "timeOutConfirmed", "select", ["Yes (نعم)", "No (لا)"])}
                  {renderField("إعطاء المضاد الحيوي الوقائي خلال آخر 60 دقيقة", "Antibiotic Prophylaxis Administered", "antibioticProphylaxis", "select", ["Yes (نعم)", "No (لا)", "Not Applicable"])}
                </div>
              </div>

              <div className="p-3 bg-white border border-teal-50 rounded-xl space-y-2">
                <span className="text-xs font-black text-teal-800">3. قبل مغادرة غرفة العمليات (Sign Out)</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {renderField("تأكيد اسم الإجراء وصحة تسجيله بالملف", "Procedure Recorded Correctly", "signOutConfirmed", "select", ["Yes (نعم)", "No (لا)"])}
                  {renderField("تطابق عد الإبر والشاش والآلات بالكامل", "Sponge, Needle & Instrument Counts Correct", "countsCorrect", "select", ["Yes (نعم)", "No (لا)"])}
                  {renderField("ترميز عينة الخزعة باسم ورقم ملف المريض", "Surgical Specimen Labeled Properly", "specimenLabeled", "select", ["Yes (نعم)", "No (لا)", "Not Applicable"])}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (formId === "qa-1") {
      return (
        <div className="space-y-4">
          <div className="p-5 bg-amber-50/40 border border-amber-100 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-amber-800 flex items-center gap-2">
              <Info size={18} />
              <span> Occurrence Variance Report (OVR) - نموذج تقرير الأحداث العارضة والمخاطر</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderField("تاريخ ووقت وقوع الحدث العارض", "Date & Time of Incident", "incidentDateTime", "text")}
              {renderField("موقع حدوث الواقعة بالمستشفى", "Location of Incident", "incidentLocation", "text")}
              {renderField("تصنيف ونوع الحدث العارض", "Incident Type / Category", "incidentType", "select", ["Medication Error (خطأ دوائي)", "Patient Fall (سقوط مريض)", "Device/Equipment Failure (عطل جهاز)", "Clinical Process Delay (تأخير سريري)", "Staff Injury (إصابة موظف)", "Other Incident"])}
            </div>
            {renderField("الوصف التفصيلي والكامل للواقعة والوقائع المصاحبة", "Detailed Description of the Occurrence", "incidentDesc", "textarea")}
            {renderField("الإجراء التصحيحي المباشر والفوري المتخذ لحماية المريض", "Immediate Action Taken to Mitigate Risk", "actionTaken", "textarea")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("اسم المبلّغ وموقّع التقرير", "Reporter Name & Designation", "reporterName", "text")}
              {renderField("تاريخ الرفع لإدارة المخاطر والجودة", "Date Reported", "date", "text")}
            </div>
          </div>
        </div>
      );
    }

    if (formId === "bil-2") {
      return (
        <div className="space-y-4">
          <div className="p-5 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-4">
            <h4 className="font-bold text-sm text-emerald-800 flex items-center gap-2">
              <Receipt size={18} />
              <span>Detailed Patient Invoice - الفاتورة الطبية التفصيلية وتكاليف الخدمات</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderField("رسوم الغرفة والتنويم الافتراضية (SAR)", "Room & Board Charges", "roomCharges", "text")}
              {renderField("رسوم الفحوصات الطبية والمخبرية (SAR)", "Laboratory & Pathology Fees", "labFees", "text")}
              {renderField("رسوم الصيدلية والأدوية الموصوفة (SAR)", "Pharmacy & Consumables Charges", "pharmacyCharges", "text")}
              {renderField("رسوم الأشعة والتصوير الطبي (SAR)", "Radiology & Imaging Fees", "radFees", "text")}
              {renderField("رسوم الاستشارات وزيارات الأطباء (SAR)", "Physician Clinical Consult Fees", "consultFees", "text")}
            </div>
            <div className="pt-4 border-t border-emerald-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white/50 p-3 rounded-xl">
              {renderField("المجموع الإجمالي غير الصافي للفاتورة", "Gross Total Bill Amount", "grossTotal", "text")}
              {renderField("نسبة وتغطية شركة التأمين المعتمدة", "Insurance Covered Amount", "insuranceCover", "text")}
              {renderField("المبلغ المتبقي والصافي المستحق للدفع", "Patient Net Amount Due", "patientNet", "text")}
            </div>
          </div>
        </div>
      );
    }

    // Dynamic Fallback Based on Category
    const category = selectedForm?.category || "";
    const isLab = category?.includes("Lab") || category?.includes("المختبر") || category?.includes("Pathology");
    const isRad = category?.includes("Radiology") || category?.includes("الأشعة") || category?.includes("Imaging");
    const isBlood = category?.includes("Blood") || category?.includes("بنك الدم");
    const isNursing = category?.includes("Nursing") || category?.includes("التمريض") || category?.includes("Ward");
    const isPharmacy = category?.includes("Pharmacy") || category?.includes("الصيدلية") || category?.includes("Medication");
    const isAdmin = category?.includes("Admin") || category?.includes("إدارة") || category?.includes("IT");
    const isAllied = category?.includes("Allied") || category?.includes("تأهيل") || category?.includes("Nutrition");

    if (isLab) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("نوع العينة / مصدر التحليل", "Specimen Type / Source", "specimenType", "select", ["Blood (دم)", "Urine (بول)", "Stool (براز)", "Swab (مسحة)", "CSF", "Other"])}
            {renderField("تاريخ ووقت سحب العينة", "Collection Date & Time", "collectionTime", "text")}
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-2xl">
            {renderField("النتائج المخبرية المفصلة", "Detailed Lab Results / Values", "labResults", "textarea")}
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("القيم المرجعية (النطاق الطبيعي)", "Reference Ranges", "refRange", "text")}
            {renderField("تفسير أخصائي المختبر", "Pathologist/Technician Interpretation", "interpretation", "text")}
          </div>
        </div>
      );
    }

    if (isRad) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-slate-800 text-slate-100 rounded-2xl border border-slate-700 grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("نوع الفحص الإشعاعي (Modality)", "Radiology Modality", "modality", "select", ["X-Ray", "CT Scan", "MRI", "Ultrasound", "Nuclear Medicine", "Fluoroscopy"])}
            {renderField("الجزء التشريحي المستهدف", "Target Anatomical Region", "bodyPart", "text")}
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl grid grid-cols-1 gap-4">
            {renderField("دواعي الفحص السريرية", "Clinical Indications", "indications", "textarea")}
            {renderField("التقرير الإشعاعي والمكتشفات (Findings)", "Radiological Findings", "findings", "textarea")}
          </div>
          <div className="p-4 bg-sky-50/40 border border-sky-100 rounded-2xl">
            {renderField("التشخيص الإشعاعي النهائي (Impression)", "Final Impression / Conclusion", "impression", "textarea")}
          </div>
        </div>
      );
    }

    if (isBlood) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {renderField("فصيلة دم المريض المعتمدة", "Patient Blood Group", "ptBlood", "text")}
            {renderField("فصيلة الوحدة المنصرفة", "Unit Blood Group", "unitBlood", "text")}
            {renderField("رقم وحدة الدم (Unit ID)", "Blood Unit ID/Barcode", "unitId", "text")}
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("نوع المشتقات", "Component Type", "componentType", "select", ["PRBC (كرات دم حمراء)", "FFP (بلازما)", "Platelets (صفائح)", "Cryoprecipitate"])}
            {renderField("كمية الوحدات المطلوبة", "Volume/Quantity Requested", "qty", "text")}
          </div>
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
            {renderField("العلامات الحيوية قبل وأثناء وبعد النقل", "Vital Signs Monitoring Log (Pre, During, Post)", "transfusionVitals", "textarea")}
          </div>
        </div>
      );
    }

    if (isNursing) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50/30 border border-emerald-100 rounded-2xl grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {renderField("الوعي (GCS)", "Level of Consciousness", "gcs", "text")}
            {renderField("الحركة والنشاط", "Mobility / Activity", "mobility", "select", ["Independent", "Assisted", "Bedridden"])}
            {renderField("التغذية والبلع", "Diet / Swallowing", "diet", "text")}
            {renderField("الإخراج والسوائل", "Elimination & Input/Output", "io", "text")}
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 gap-4">
            {renderField("تقييم تمريضي مفصل للحالة الحالية", "Detailed Nursing Assessment", "nursingAssessment", "textarea")}
            {renderField("التدخلات التمريضية والإجراءات", "Nursing Interventions Performed", "interventions", "textarea")}
          </div>
        </div>
      );
    }

    if (isPharmacy) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-sky-50/40 border border-sky-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("اسم الدواء أو الصنف الدوائي", "Medication / Drug Name", "drugName", "text")}
            {renderField("الجرعة والشكل الصيدلاني", "Dosage & Formulation", "dosage", "text")}
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 gap-4">
            {renderField("مراجعة التفاعلات الدوائية أو الحساسية", "Drug Interactions / Allergy Review", "interactions", "textarea")}
            {renderField("تعليمات الصرف للمريض / الصيدلي", "Dispensing Instructions", "instructions", "textarea")}
          </div>
        </div>
      );
    }

    if (isAdmin) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-slate-800 text-slate-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("معرف النظام / النظام الفرعي", "System / Module ID", "sysId", "text")}
            {renderField("تصنيف الإجراء الإداري", "Administrative Action Type", "actionType", "select", ["Create", "Update", "Delete", "Audit", "Grant Access", "Revoke Access"])}
          </div>
          <div className="p-4 bg-white border border-slate-200 rounded-2xl grid grid-cols-1 gap-4">
            {renderField("وصف الإجراء أو المشكلة بالتفصيل", "Detailed Description of Action/Issue", "adminDesc", "textarea")}
            {renderField("أثر الإجراء وملاحظات الأمان", "Impact & Security Notes", "impact", "textarea")}
          </div>
        </div>
      );
    }

    if (isAllied) {
      return (
        <div className="space-y-4">
          <div className="p-4 bg-orange-50/40 border border-orange-100 rounded-2xl grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderField("التقييم الوظيفي المبدئي", "Initial Functional Assessment", "funcAssessment", "textarea")}
            {renderField("أهداف الخطة العلاجية والتأهيلية", "Therapeutic / Rehab Goals", "goals", "textarea")}
          </div>
          <div className="p-4 bg-white border border-slate-100 rounded-2xl grid grid-cols-1 gap-4">
            {renderField("سجل الجلسة والتطور المحرز", "Session Log & Progress Tracked", "progress", "textarea")}
          </div>
        </div>
      );
    }

    // Default Fallback
    return (
      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
          {renderField("ملاحظات وتدوينات سريرية تفصيلية", "Detailed Clinical Notes & Documentation", "notes", "textarea")}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 w-full space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="w-10 h-10 sm:w-14 sm:h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <FileText size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">مكتبة النماذج الطبية والشيتات</h1>
            <p className="text-slate-500">النماذج العالمية، الخاصة، والعامة لجميع الأقسام</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="بحث في النماذج..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-10 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
            />
          </div>
          <button className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors">
            <Plus size={18} />
            <span>نموذج جديد</span>
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Categories */}
        <div className="lg:col-span-1 space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all ${
                activeTab === cat.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-100"
              }`}
            >
              <cat.icon size={20} className={activeTab === cat.id ? "text-indigo-200" : "text-slate-400"} />
              <span className="font-medium text-sm">{cat.label}</span>
              {activeTab === cat.id && (
                <ChevronRight size={16} className="mr-auto" />
              )}
            </button>
          ))}
        </div>

        {/* Forms List */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AnimatePresence mode="popLayout">
              {currentForms.map((form) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={form.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
                  onClick={() => setSelectedForm(form)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                      {form.category}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <span>★</span>
                      <span>{form.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {form.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                    {form.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex gap-2 min-w-max">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
                        <Printer size={16} />
                      </button>
                    </div>
                    <button className="text-xs font-medium text-indigo-600 flex items-center gap-1 hover:underline">
                      <span>استخدام النموذج</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {currentForms.length === 0 && (
              <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-400">
                <FileText size={48} className="mb-4 opacity-20" />
                <p>لا توجد نماذج مطابقة للبحث</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Preview */}
      <AnimatePresence>
        {selectedForm && (
          <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-slate-800">{selectedForm.title}</h2>
                    <p className="text-xs text-slate-500">{selectedForm.category}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedForm(null)}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  ✕
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
                {/* Official Medical Document Layout */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 min-h-[500px] relative overflow-hidden" id="clinical-document-pdf">
                  
                  {/* Decorative stamp for digital signatures */}
                  {signedBy && (
                    <div className="absolute top-10 left-10 w-44 h-44 border-4 border-emerald-500/30 rounded-full flex flex-col items-center justify-center rotate-12 pointer-events-none select-none">
                      <div className="text-[10px] text-emerald-500 font-bold tracking-widest uppercase font-mono">Unified Hospital</div>
                      <div className="text-emerald-500 text-lg font-black tracking-wide my-1">E-SIGNED</div>
                      <div className="text-[10px] text-emerald-500/80 font-semibold">{signedAt?.split(" ")[0]}</div>
                      <div className="text-[8px] text-emerald-500/60 font-mono">ID: {selectedForm.id}</div>
                    </div>
                  )}

                  {/* Document Header (Seal / Title / Barcode) */}
                  <div className="border-b-4 border-double border-slate-700 pb-4 mb-6">
                    <div className="flex justify-between items-start">
                      <div className="text-right space-y-1">
                        <h3 className="font-bold text-sm text-slate-800">المستشفى الرقمي الموحد</h3>
                        <p className="text-[10px] text-slate-400 font-mono">Unified Digital Hospital - HIS</p>
                        <p className="text-[10px] text-slate-500">مكتب السجلات الطبية الإلكترونية</p>
                      </div>
                      
                      <div className="text-center">
                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-full flex items-center justify-center mx-auto mb-1 text-indigo-600">
                          <Stethoscope size={24} />
                        </div>
                        <span className="text-[9px] text-indigo-600 font-semibold tracking-wider font-mono">E-HEALTH / وزارة الصحة</span>
                      </div>

                      <div className="text-left space-y-1">
                        <div className="h-6 w-32 bg-slate-200 rounded flex items-center justify-center font-mono text-[9px] text-slate-600 tracking-wider">
                          |||| | ||| || ||| | |||
                        </div>
                        <p className="text-[9px] text-slate-400 text-center font-mono">Doc ID: {selectedForm.id}</p>
                        <p className="text-[9px] text-slate-500 text-center">تحديث: 2026-06-25</p>
                      </div>
                    </div>

                    <div className="text-center mt-4">
                      <h1 className="text-xl font-extrabold text-slate-800 tracking-tight">{selectedForm.title}</h1>
                      <p className="text-xs text-slate-500 mt-0.5 font-mono">{selectedForm.category} Departmental Record</p>
                    </div>
                  </div>

                  {/* Patient Demographic Banner Block */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-6 text-sm">
                    <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">معلومات المريض الأساسية / Patient Demographics</h4>
                    <div className="grid grid-cols-2 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">اسم المريض / Patient Name</span>
                        <span className="font-bold text-slate-800">{activePatientName}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">رقم الملف الطبي / MRN</span>
                        <span className="font-bold text-slate-800 font-mono">{activePatientMRN}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">العمر والجنس / Age & Gender</span>
                        <span className="font-bold text-slate-800">{activePatientAge} سنة / {activePatientGender}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400">تاريخ المعاينة / Date</span>
                        <span className="font-bold text-slate-800 font-mono">{formData.date || new Date().toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Form-Specific Fields Body */}
                  <div className="min-h-[250px] pb-6">
                    {renderClinicalFormBody(selectedForm.id)}
                  </div>

                  {/* Signature Section at Document Bottom */}
                  <div className="border-t-2 border-dashed border-slate-200 pt-6 mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-slate-400">توقيع المريض أو الولي الشرعي / Patient or Guardian Sign</span>
                      <div className="h-12 border border-slate-100 rounded-xl bg-slate-50/30 flex items-center justify-center text-slate-300 italic">
                        {formData.consentSigned ? "✓ موافق وموقّع إلكترونياً" : "بانتظار الإقرار الطبي / Pending Signature"}
                      </div>
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="block text-[10px] font-bold text-slate-400 text-right">الممارس الطبي المسؤول / Attending Clinician E-Sign</span>
                      <div className="h-12 border border-slate-100 rounded-xl bg-slate-50/30 flex flex-col items-center justify-center text-slate-600">
                        {signedBy ? (
                          <>
                            <span className="font-bold text-indigo-600 flex items-center gap-1">
                              <PenTool size={12} />
                              {signedBy}
                            </span>
                            <span className="text-[9px] text-slate-400 font-mono">{signedAt}</span>
                          </>
                        ) : (
                          <span className="text-slate-300 italic">بانتظار توقيع الطبيب المرخص / Pending Physician Sign</span>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex justify-end items-center gap-3">
                {/* Print & Status Indication */}
                <span className="text-xs font-semibold text-slate-400 mr-auto flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${signedBy ? "bg-emerald-500 animate-pulse" : isEditing ? "bg-amber-500" : "bg-slate-300"}`}></span>
                  {signedBy ? "مستند طبي مغلق وموقّع" : isEditing ? "قيد التعبئة والتعديل" : "معاينة النموذج"}
                </span>

                <button
                  onClick={() => setSelectedForm(null)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  إغلاق
                </button>

                <button
                  onClick={() => {
                    window.print();
                    toast.success(isAr ? "تم إرسال المستند للطباعة المباشرة" : "Document sent to print queue");
                  }}
                  className="px-4 py-2.5 text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-2"
                >
                  <Printer size={16} />
                  <span>طباعة المستند</span>
                </button>

                {!signedBy && (
                  isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-5 py-2.5 text-sm font-medium bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        إلغاء التعديل
                      </button>
                      <button
                        onClick={handleSaveForm}
                        className="px-5 py-2.5 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-100"
                      >
                        <CheckCircle size={16} />
                        <span>توقيع وحفظ السجل</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-5 py-2.5 text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-100"
                    >
                      <PenTool size={16} />
                      <span>تعبئة وتوقيع النموذج</span>
                    </button>
                  )
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
