import { 
  RadiologyStudy, 
  RadiologyReport, 
  EquipmentModality, 
  QualityAnalysisRecord, 
  ContrastInventoryItem, 
  RadiologyConsumable, 
  RadiologyStaffShift, 
  CriticalAlertRecord,
  AuditLogEntry 
} from "../types/radiology";

export const DEFAULT_RADIOLOGY_STUDIES: RadiologyStudy[] = [
  {
    id: "ACC-2026-9001",
    studyInstanceUid: "1.2.840.113619.2.55.3.283129321.401",
    patientId: "P-10021",
    patientName: "أحمد عبد الله القحطاني",
    patientAge: 54,
    patientGender: "Male",
    mrn: "MRN-88291",
    nationalId: "1083920192",
    modality: "CT",
    bodyPart: "Chest HRCT",
    procedureName: "CT Chest High Resolution (أشعة مقطعية عالية الدقة للصدر)",
    priority: "STAT",
    status: "CheckedIn",
    orderingDoctor: "د. خالد العتيبي (استشاري أمراض الصدر)",
    orderingDepartment: "ER / Emergency Department",
    orderDate: "2026-07-27T08:15:00Z",
    scheduledTime: "2026-07-27T08:30:00Z",
    scheduledRoom: "CT Room 01 (GE Revolution 128-Slice)",
    technicianId: "TECH-04",
    technicianName: "فني/ سعيد الغامدي",
    radiologistId: "RAD-01",
    radiologistName: "د. محمد زاهر (استشاري الأشعة التشخيصية)",
    clinicalIndication: "Severe Dyspnea, Oxygen saturation 88%, Rule out Pulmonary Embolism & Interstitial Fibrosis.",
    icd10Code: "R06.02",
    transportMode: "Wheelchair",
    prepCompleted: true,
    fastingHours: 6,
    contrastRequired: true,
    contrastType: "Omnipaque 350 mgI/ml",
    contrastVolumeMl: 80,
    contrastBatchNo: "LOT-883912",
    creatinineLevel: 0.9,
    eGFR: 92,
    pregnancyCheck: "Not Applicable",
    allergyHistory: [],
    consentSigned: true,
    seriesCount: 4,
    instanceCount: 320,
    dicomAeTitle: "GE_CT_01",
    sampleImages: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80"
    ],
    doseDlpMgyCm: 420,
    doseCtdiVolMgy: 12.4,
    effectiveDoseMsv: 5.8,
    doseAlertTriggered: false,
    checkInTime: "2026-07-27T08:25:00Z",
    cptCode: "71260",
    billingAmount: 850,
    billingStatus: "Billed"
  },
  {
    id: "ACC-2026-9002",
    studyInstanceUid: "1.2.840.113619.2.55.3.283129321.402",
    patientId: "P-10022",
    patientName: "سارة محمد الشمري",
    patientAge: 38,
    patientGender: "Female",
    mrn: "MRN-99102",
    nationalId: "2049182391",
    modality: "MRI",
    bodyPart: "Brain & MRA",
    procedureName: "MRI Brain W/ Contrast (رنين مغناطيسي للمخ بالصبغة)",
    priority: "Urgent",
    status: "DraftReport",
    orderingDoctor: "د. عبد المجيد الزهراني (استشاري المخ والأعصاب)",
    orderingDepartment: "Outpatient Neurology Clinic",
    orderDate: "2026-07-27T09:00:00Z",
    scheduledTime: "2026-07-27T10:00:00Z",
    scheduledRoom: "MRI 3.0 Tesla Suite (Siemens Magnetom)",
    technicianId: "TECH-02",
    technicianName: "فنية/ أمل الشريف",
    radiologistId: "RAD-01",
    radiologistName: "د. محمد زاهر (استشاري الأشعة التشخيصية)",
    clinicalIndication: "Recurrent severe left-sided hemicranial headaches with focal numbness.",
    icd10Code: "G43.909",
    transportMode: "Ambulatory",
    prepCompleted: true,
    fastingHours: 4,
    contrastRequired: true,
    contrastType: "Dotarem (Gadoterate meglumine)",
    contrastVolumeMl: 15,
    contrastBatchNo: "LOT-11928",
    creatinineLevel: 0.8,
    eGFR: 104,
    pregnancyCheck: "Negative",
    allergyHistory: ["Penicillin"],
    consentSigned: true,
    seriesCount: 8,
    instanceCount: 512,
    dicomAeTitle: "SIEMENS_MRI_01",
    sampleImages: [
      "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80"
    ],
    doseDlpMgyCm: 0,
    doseCtdiVolMgy: 0,
    effectiveDoseMsv: 0,
    checkInTime: "2026-07-27T09:50:00Z",
    procedureStartTime: "2026-07-27T10:05:00Z",
    procedureEndTime: "2026-07-27T10:45:00Z",
    cptCode: "70553",
    billingAmount: 1800,
    billingStatus: "Billed"
  },
  {
    id: "ACC-2026-9003",
    studyInstanceUid: "1.2.840.113619.2.55.3.283129321.403",
    patientId: "P-10023",
    patientName: "فهد إبراهيم الدوسري",
    patientAge: 62,
    patientGender: "Male",
    mrn: "MRN-77381",
    nationalId: "1029381923",
    modality: "X-RAY",
    bodyPart: "Lumbo-Sacral Spine",
    procedureName: "X-Ray Lumbo-Sacral Spine AP/LAT (أشعة الفقرات القطنية العجزية)",
    priority: "Routine",
    status: "Reported",
    orderingDoctor: "د. طارق الحارثي (عظام)",
    orderingDepartment: "Orthopedic OPD",
    orderDate: "2026-07-27T10:30:00Z",
    scheduledTime: "2026-07-27T11:00:00Z",
    scheduledRoom: "DR X-Ray Room 02",
    technicianId: "TECH-01",
    technicianName: "فني/ علي السالم",
    radiologistId: "RAD-02",
    radiologistName: "د. نورة الشامي (استشاري العظام والأشعة)",
    clinicalIndication: "Chronic low back pain radiating down right sciatica distribution.",
    icd10Code: "M54.5",
    transportMode: "Ambulatory",
    prepCompleted: true,
    contrastRequired: false,
    consentSigned: true,
    seriesCount: 2,
    instanceCount: 4,
    dicomAeTitle: "CARESTREAM_XRAY",
    sampleImages: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80"
    ],
    doseDlpMgyCm: 0,
    doseCtdiVolMgy: 0,
    effectiveDoseMsv: 0.8,
    cptCode: "72100",
    billingAmount: 250,
    billingStatus: "Billed"
  },
  {
    id: "ACC-2026-9004",
    studyInstanceUid: "1.2.840.113619.2.55.3.283129321.404",
    patientId: "P-10024",
    patientName: "نورة حسن المطيري",
    patientAge: 45,
    patientGender: "Female",
    mrn: "MRN-66491",
    nationalId: "2019283812",
    modality: "ULTRASOUND",
    bodyPart: "Abdomen & Pelvis",
    procedureName: "US Abdomen & Pelvis (موجات فوق صوتية للبطن والحوض)",
    priority: "Routine",
    status: "Prepped",
    orderingDoctor: "د. حاتم المالكي (باطنة)",
    orderingDepartment: "Gastroenterology OPD",
    orderDate: "2026-07-27T11:15:00Z",
    scheduledTime: "2026-07-27T11:45:00Z",
    scheduledRoom: "Ultrasound Suite 03 (Philips EPIQ 7)",
    technicianId: "TECH-03",
    technicianName: "أخصائية/ مريم العنزي",
    clinicalIndication: "Right upper quadrant postprandial abdominal pain.",
    icd10Code: "R10.11",
    transportMode: "Ambulatory",
    prepCompleted: true,
    fastingHours: 8,
    contrastRequired: false,
    pregnancyCheck: "Negative",
    consentSigned: true,
    seriesCount: 1,
    instanceCount: 24,
    dicomAeTitle: "PHILIPS_US_03",
    sampleImages: [],
    doseDlpMgyCm: 0,
    doseCtdiVolMgy: 0,
    effectiveDoseMsv: 0,
    cptCode: "76700",
    billingAmount: 380,
    billingStatus: "Pending"
  },
  {
    id: "ACC-2026-9005",
    studyInstanceUid: "1.2.840.113619.2.55.3.283129321.405",
    patientId: "P-10025",
    patientName: "عمر سالم الشهري",
    patientAge: 67,
    patientGender: "Male",
    mrn: "MRN-33120",
    nationalId: "1098273615",
    modality: "PET_CT",
    bodyPart: "Whole Body 18F-FDG",
    procedureName: "PET/CT Whole Body Oncology (مسح بوزيتروني للجسم بالكامل)",
    priority: "Urgent",
    status: "Scheduled",
    orderingDoctor: "د. عبد الله الراجحي (أورام)",
    orderingDepartment: "Oncology Center",
    orderDate: "2026-07-27T12:00:00Z",
    scheduledTime: "2026-07-27T13:30:00Z",
    scheduledRoom: "Nuclear Medicine PET-CT Suite",
    technicianId: "TECH-05",
    technicianName: "فني/ وليد البقمي",
    radiologistId: "RAD-03",
    radiologistName: "د. فيصل السبيعي (استشاري الطب النووي)",
    clinicalIndication: "Staging for recently diagnosed lymphoma.",
    icd10Code: "C85.90",
    transportMode: "Ambulatory",
    prepCompleted: false,
    fastingHours: 6,
    contrastRequired: true,
    contrastType: "18F-FDG 370 MBq + Oral Contrast",
    creatinineLevel: 1.1,
    eGFR: 78,
    consentSigned: true,
    seriesCount: 6,
    instanceCount: 680,
    dicomAeTitle: "SIEMENS_PET_01",
    sampleImages: [],
    doseDlpMgyCm: 680,
    doseCtdiVolMgy: 16.2,
    effectiveDoseMsv: 14.5,
    doseAlertTriggered: false,
    cptCode: "78816",
    billingAmount: 4200,
    billingStatus: "Pending"
  }
];

export const DEFAULT_RADIOLOGY_REPORTS: RadiologyReport[] = [
  {
    id: "REP-2026-001",
    studyId: "ACC-2026-9003",
    patientId: "P-10023",
    patientName: "فهد إبراهيم الدوسري",
    modality: "X-RAY",
    procedureName: "X-Ray Lumbo-Sacral Spine AP/LAT",
    clinicalHistory: "Chronic low back pain with right radiculopathy.",
    technique: "Standard anteroposterior and lateral radiographs of the lumbo-sacral spine were obtained.",
    comparisonStudy: "X-Ray LS Spine dated 12/05/2025.",
    findings: `1. Alignment: Mild loss of normal lumbar lordosis suggesting paravertebral muscle spasm.
2. Vertebral Bodies: Intact vertebral body heights with mild endplate osteophytosis noted at L4-L5 and L5-S1.
3. Disc Spaces: Moderate narrowing of the L5-S1 intervertebral disc space.
4. Posterior Elements & Sacroiliac Joints: Pedicles are preserved. SI joints demonstrate bilateral normal articular margins.
5. Soft Tissues: No obvious abnormal soft tissue shadow.`,
    impression: "Moderate L5-S1 degenerative disc disease with spondylosis. No fracture or listhesis identified.",
    recommendations: "MRI of the Lumbar Spine is recommended if clinical neurological deficit progresses.",
    isCritical: false,
    status: "Final",
    radiologistName: "د. نورة الشامي",
    radiologistTitle: "Consultant Musculoskeletal Radiologist",
    signedAt: "2026-07-27T11:45:00Z",
    digitalSignatureHash: "e4d909c2901238a892b01237ef12",
    version: 1
  }
];

export const DEFAULT_CRITICAL_ALERTS: CriticalAlertRecord[] = [
  {
    id: "CRIT-901",
    studyId: "ACC-2026-9001",
    patientName: "أحمد عبد الله القحطاني",
    mrn: "MRN-88291",
    modality: "CT",
    findingSummary: "Acute Pulmonary Embolism in Right Main Pulmonary Artery with RV Strain.",
    orderingDoctor: "د. خالد العتيبي",
    orderingDoctorPhone: "+966501234567",
    radiologistName: "د. محمد زاهر",
    timestamp: "2026-07-27T08:50:00Z",
    notificationMethod: "Phone Call",
    status: "Notified & Documented",
    acknowledgedBy: "Dr. Khaled Al-Otaibi (Recorded by Phone)",
    acknowledgeTime: "2026-07-27T08:52:00Z",
    notes: "Direct verbal communication completed. Anticoagulation initiated immediately."
  }
];

export const DEFAULT_EQUIPMENT: EquipmentModality[] = [
  {
    id: "EQ-CT-01",
    name: "GE Revolution 128-Slice CT",
    code: "CT-ROOM-1",
    modality: "CT",
    room: "Radiology Dept - Room 101",
    aeTitle: "GE_CT_01",
    ipAddress: "192.168.10.45",
    port: 104,
    status: "In-Use",
    lastCalibrationDate: "2026-07-01",
    nextMaintenanceDate: "2026-08-15",
    tubeUsageHours: 1420,
    contractVendor: "GE Healthcare Middle East",
    serialNumber: "GE-REV-982103"
  },
  {
    id: "EQ-MRI-01",
    name: "Siemens Magnetom Vida 3.0T MRI",
    code: "MRI-ROOM-1",
    modality: "MRI",
    room: "MRI Suite - Ground Floor",
    aeTitle: "SIEMENS_MRI_01",
    ipAddress: "192.168.10.46",
    port: 104,
    status: "Online",
    lastCalibrationDate: "2026-06-20",
    nextMaintenanceDate: "2026-09-01",
    contractVendor: "Siemens Healthineers",
    serialNumber: "SM-VIDA-3T-009"
  },
  {
    id: "EQ-XRAY-01",
    name: "Carestream DRX-Evolution Plus",
    code: "XRAY-ROOM-2",
    modality: "X-RAY",
    room: "X-Ray Dept - Room 102",
    aeTitle: "CARESTREAM_XRAY",
    ipAddress: "192.168.10.48",
    port: 104,
    status: "Online",
    lastCalibrationDate: "2026-07-10",
    nextMaintenanceDate: "2026-10-10",
    contractVendor: "Carestream Health",
    serialNumber: "CS-DRX-77123"
  },
  {
    id: "EQ-US-03",
    name: "Philips EPIQ 7 Ultrasound System",
    code: "US-ROOM-3",
    modality: "ULTRASOUND",
    room: "Ultrasound Suite 03",
    aeTitle: "PHILIPS_US_03",
    ipAddress: "192.168.10.50",
    port: 104,
    status: "Online",
    lastCalibrationDate: "2026-07-05",
    nextMaintenanceDate: "2026-11-01",
    contractVendor: "Philips Healthcare",
    serialNumber: "PH-EPIQ7-991"
  },
  {
    id: "EQ-PET-01",
    name: "Siemens Biograph Vision PET/CT",
    code: "PET-ROOM-1",
    modality: "PET_CT",
    room: "Nuclear Medicine Dept",
    aeTitle: "SIEMENS_PET_01",
    ipAddress: "192.168.10.55",
    port: 104,
    status: "Calibration",
    lastCalibrationDate: "2026-07-27",
    nextMaintenanceDate: "2026-08-01",
    contractVendor: "Siemens Healthineers",
    serialNumber: "PET-BIO-44102"
  }
];

export const DEFAULT_CONTRAST_INVENTORY: ContrastInventoryItem[] = [
  {
    id: "CNT-01",
    name: "Omnipaque 350 mgI/ml (100ml)",
    type: "Iodinated",
    brand: "GE Healthcare",
    concentration: "350 mgI/ml",
    stockVials: 140,
    minThreshold: 30,
    unitPrice: 120,
    expiryDate: "2027-12-31",
    batchNumber: "LOT-883912"
  },
  {
    id: "CNT-02",
    name: "Dotarem 0.5 mmol/ml (15ml)",
    type: "Gadolinium",
    brand: "Guerbet",
    concentration: "0.5 mmol/ml",
    stockVials: 85,
    minThreshold: 20,
    unitPrice: 210,
    expiryDate: "2028-06-30",
    batchNumber: "LOT-11928"
  },
  {
    id: "CNT-03",
    name: "E-Z-HD Barium Sulfate Powder (340g)",
    type: "Barium",
    brand: "Bracco Imaging",
    concentration: "98% w/w",
    stockVials: 45,
    minThreshold: 15,
    unitPrice: 65,
    expiryDate: "2027-09-15",
    batchNumber: "LOT-EZ-9910"
  }
];

export const DEFAULT_CONSUMABLES: RadiologyConsumable[] = [
  {
    id: "CON-01",
    name: "Laser Medical Dry Film 14x17 inch",
    category: "Film",
    stockQty: 450,
    unit: "Sheets",
    minLevel: 100,
    expiryDate: "2028-01-01"
  },
  {
    id: "CON-02",
    name: "CT High Pressure Dual Injector Syringes",
    category: "Syringe",
    stockQty: 120,
    unit: "Kits",
    minLevel: 30,
    expiryDate: "2027-08-30"
  },
  {
    id: "CON-03",
    name: "Lead Apron 0.5mm Pb Equivalent",
    category: "Protective",
    stockQty: 24,
    unit: "Pieces",
    minLevel: 10,
    expiryDate: "2030-12-31"
  }
];

export const DEFAULT_STAFF_SHIFTS: RadiologyStaffShift[] = [
  {
    id: "STF-01",
    staffName: "د. محمد زاهر",
    role: "Consultant Radiologist",
    modalityAssigned: "CT",
    shiftType: "Morning",
    assignedRoom: "Reporting Workstation 01",
    studiesCompletedToday: 18
  },
  {
    id: "STF-02",
    staffName: "د. نورة الشامي",
    role: "Consultant Radiologist",
    modalityAssigned: "X-RAY",
    shiftType: "Morning",
    assignedRoom: "Reporting Workstation 02",
    studiesCompletedToday: 24
  },
  {
    id: "STF-03",
    staffName: "فني/ سعيد الغامدي",
    role: "Senior Technologist",
    modalityAssigned: "CT",
    shiftType: "Morning",
    assignedRoom: "CT Room 01",
    studiesCompletedToday: 14
  },
  {
    id: "STF-04",
    staffName: "فنية/ أمل الشريف",
    role: "Senior Technologist",
    modalityAssigned: "MRI",
    shiftType: "Morning",
    assignedRoom: "MRI Suite",
    studiesCompletedToday: 8
  }
];

export const DEFAULT_REPORT_TEMPLATES = [
  {
    id: "TMPL-CT-CHEST",
    modality: "CT",
    nameAr: "قالب الأشعة المقطعية للصدر (Chest CT)",
    nameEn: "Chest CT Template",
    technique: "Volumetric helical CT scan of the chest performed with IV contrast.",
    findings: `LUNGS & AIRWAYS: Lungs are clear without focal consolidation, mass, or suspicious nodules. Tracheobronchial tree is patent.
PLEURA: No pleural effusion or pneumothorax.
MEDIASTINUM & HILA: Normal mediastinal contour. No mediastinal or hilar lymphadenopathy.
CARDIOVASCULAR: Heart size is normal. Thoracic aorta is within normal limits.
BONES & SOFT TISSUES: Intact osseous structures of the thoracic cage.`,
    impression: "Unremarkable CT scan of the chest. No acute pulmonary process."
  },
  {
    id: "TMPL-MRI-BRAIN",
    modality: "MRI",
    nameAr: "قالب الرنين المغناطيسي للمخ (Brain MRI)",
    nameEn: "Brain MRI Template",
    technique: "Multiplanar T1, T2, FLAIR, DWI, and gradient echo MRI sequences of the brain were performed.",
    findings: `BRAIN PARENCHYMA: Normal signal intensity of the cerebral and cerebellar hemispheres. No diffusion restriction to suggest hyperacute ischemia.
VENTRICLES & CSF SPACES: Ventricles and sulci are normal in size and configuration for age.
EXTRA-AXIAL SPACES: No extra-axial fluid collection or mass effect.
POSTERIOR FOSSA: Brainstem and cerebellum appear unremarkable.
ORBITS & PARANASAL SINUSES: Intact visualized orbits and optic nerves. Clear paranasal sinuses.`,
    impression: "Normal MRI brain study. No acute infarction, intracranial hemorrhage, or space-occupying lesion."
  },
  {
    id: "TMPL-MAMMO-BIRADS",
    modality: "MAMMOGRAPHY",
    nameAr: "قالب أشعة الثدي (Mammography BI-RADS)",
    nameEn: "Mammography BI-RADS Template",
    technique: "Bilateral digital mammography in CC and MLO projections.",
    findings: `BREAST DENSITY: Category B - Scattered areas of fibroglandular density.
RIGHT BREAST: No focal mass, architectural distortion, or suspicious microcalcifications.
LEFT BREAST: No focal mass, architectural distortion, or suspicious microcalcifications.
AXILLAE: Normal axillary lymph nodes bilaterally.`,
    impression: "BI-RADS Category 1: Negative (Normal bilateral mammogram)."
  }
];

export const DEFAULT_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "AUD-1001",
    timestamp: "2026-07-27T08:26:00Z",
    userId: "RAD-01",
    userName: "Dr. Mohamed Zaher",
    userRole: "Consultant Radiologist",
    action: "VIEW_STUDY",
    studyId: "ACC-2026-9001",
    patientMrn: "MRN-88291",
    ipAddress: "10.0.4.12",
    details: "Loaded DICOM series for CT Chest HRCT in PACS Viewer"
  },
  {
    id: "AUD-1002",
    timestamp: "2026-07-27T08:50:00Z",
    userId: "RAD-01",
    userName: "Dr. Mohamed Zaher",
    userRole: "Consultant Radiologist",
    action: "CRITICAL_ALERT",
    studyId: "ACC-2026-9001",
    patientMrn: "MRN-88291",
    ipAddress: "10.0.4.12",
    details: "Triggered Critical Alert for Acute PE; Logged Phone call to Dr. Khaled Al-Otaibi"
  }
];
