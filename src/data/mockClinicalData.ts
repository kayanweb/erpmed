import { HISDepartment, HISClinic, InventoryItem, MasterDataEntry, Prescription, Invoice } from "../context/HISContext";
import { HospitalBed, Ward, Patient } from "../types";

export const INITIAL_MOCK_DEPARTMENTS: HISDepartment[] = [
  { id: "dept-er", nameEn: "Emergency Department", nameAr: "قسم الطوارئ", type: "clinical", building: "Building A", floor: "G", manager: "Dr. Mohamed Elsayed" },
  { id: "dept-icu", nameEn: "Intensive Care Unit", nameAr: "العناية المركزة", type: "clinical", building: "Building A", floor: "2F", manager: "Dr. Laila Abou El-Kheir" },
  { id: "dept-opd", nameEn: "Outpatient Department", nameAr: "العيادات الخارجية", type: "clinical", building: "Building B", floor: "1F", manager: "Dr. Adel Al-Sherif" },
  { id: "dept-ward-peds", nameEn: "Pediatric Ward", nameAr: "جناح الأطفال", type: "clinical", building: "Building C", floor: "3F", manager: "Sister Hoda Ahmed" },
  { id: "dept-ward-surg", nameEn: "General Surgical Ward", nameAr: "جناح الجراحة العامة", type: "clinical", building: "Building C", floor: "2F", manager: "Sister Fatima El-Zahraa" },
  { id: "dept-pharmacy", nameEn: "Central Pharmacy", nameAr: "الصيدلية المركزية", type: "support", building: "Building A", floor: "1F", manager: "Pharm. Norhan Ali" },
  { id: "dept-radiology", nameEn: "Radiology Unit", nameAr: "وحدة الأشعة", type: "support", building: "Building A", floor: "B1", manager: "Eng. Hany Naser" },
  { id: "dept-laboratory", nameEn: "Laboratory Department", nameAr: "قسم المختبر", type: "support", building: "Building B", floor: "B1", manager: "Dr. Mahmoud Omar" },
];

export const INITIAL_MOCK_CLINICS: HISClinic[] = [
  { id: "clinic-cardio", nameEn: "Cardiology Clinic", nameAr: "عيادة القلب", departmentId: "dept-opd", location: "Room 101" },
  { id: "clinic-onco", nameEn: "Oncology Clinic", nameAr: "عيادة الأورام", departmentId: "dept-opd", location: "Room 102" },
  { id: "clinic-peds", nameEn: "Pediatrics Clinic", nameAr: "عيادة الأطفال", departmentId: "dept-opd", location: "Room 103" },
  { id: "clinic-med", nameEn: "General Medicine Clinic", nameAr: "عيادة الباطنة العامة", departmentId: "dept-opd", location: "Room 104" },
];

export const INITIAL_MOCK_INVENTORY: InventoryItem[] = [
  { id: "inv-1", nameEn: "Paracetamol 500mg Tablets", nameAr: "باراسيتامول 500 ملجم أقراص", type: "medication", stockMain: 5000, stockSub: 1200, unit: "tablet", price: 1.5 },
  { id: "inv-2", nameEn: "Amoxicillin 500mg Capsules", nameAr: "أموكسيسيلين 500 ملجم كبسولات", type: "medication", stockMain: 3000, stockSub: 450, unit: "capsule", price: 3.5 },
  { id: "inv-3", nameEn: "Insulin Glargine 100 U/mL", nameAr: "إنسولين جلارجين 100 وحدة/مل", type: "medication", stockMain: 400, stockSub: 80, unit: "vial", price: 120.0 },
  { id: "inv-4", nameEn: "Salbutamol Inhaler (Ventolin)", nameAr: "بخاخ سالبيوتامول (فنتولين)", type: "medication", stockMain: 600, stockSub: 150, unit: "inhaler", price: 45.0 },
  { id: "inv-5", nameEn: "Aspirin 81mg Chewable", nameAr: "أسبرين 81 ملجم للمضغ", type: "medication", stockMain: 10000, stockSub: 2500, unit: "tablet", price: 0.5 },
  { id: "inv-6", nameEn: "Syringe 5mL with Needle", nameAr: "سرنجة 5 مل بالإبرة", type: "consumable", stockMain: 20000, stockSub: 4000, unit: "pc", price: 1.0 },
  { id: "inv-7", nameEn: "Syringe 10mL with Needle", nameAr: "سرنجة 10 مل بالإبرة", type: "consumable", stockMain: 15000, stockSub: 3000, unit: "pc", price: 1.5 },
  { id: "inv-8", nameEn: "Sterile Gauze Pad 10x10cm", nameAr: "شاش معقم 10×10 سم", type: "consumable", stockMain: 8000, stockSub: 1500, unit: "pack", price: 5.0 },
  { id: "inv-9", nameEn: "IV Cannula 20G (Pink)", nameAr: "كانيولا وريدية 20G (وردي)", type: "consumable", stockMain: 5000, stockSub: 1000, unit: "pc", price: 8.0 },
  { id: "inv-10", nameEn: "Sterile Latex Gloves (Size 7.5)", nameAr: "قفازات طبية معقمة مقاس 7.5", type: "consumable", stockMain: 12000, stockSub: 2000, unit: "pair", price: 12.0 },
  { id: "inv-11", nameEn: "Elastic Bandage 10cm", nameAr: "رباط ضاغط مرن 10 سم", type: "consumable", stockMain: 2500, stockSub: 400, unit: "roll", price: 15.0 },
];

export const INITIAL_MOCK_WARDS: Ward[] = [
  { id: "ward-icu", nameEn: "Intensive Care Unit", nameAr: "العناية المركزة", departmentId: "dept-icu", type: "icu", genderAllowed: "both", ageGroup: "adult", capacity: 10, occupancy: 2, isActive: true },
  { id: "ward-med-m", nameEn: "Male Medical Ward", nameAr: "جناح الباطنة - رجال", departmentId: "dept-ward-surg", type: "medical", genderAllowed: "male", ageGroup: "adult", capacity: 20, occupancy: 5, isActive: true },
  { id: "ward-med-f", nameEn: "Female Medical Ward", nameAr: "جناح الباطنة - نساء", departmentId: "dept-ward-surg", type: "medical", genderAllowed: "female", ageGroup: "adult", capacity: 20, occupancy: 3, isActive: true },
  { id: "ward-peds", nameEn: "Pediatric Ward", nameAr: "جناح الأطفال", departmentId: "dept-ward-peds", type: "pediatric", genderAllowed: "both", ageGroup: "pediatric", capacity: 15, occupancy: 4, isActive: true },
  { id: "ward-surg", nameEn: "Surgical Ward", nameAr: "جناح الجراحة", departmentId: "dept-ward-surg", type: "surgical", genderAllowed: "both", ageGroup: "adult", capacity: 15, occupancy: 6, isActive: true },
  { id: "ward-isolation", nameEn: "Isolation Unit", nameAr: "وحدة العزل", departmentId: "dept-icu", type: "isolation", genderAllowed: "both", ageGroup: "all", capacity: 5, occupancy: 1, isActive: true },
];

export const INITIAL_MOCK_BEDS: HospitalBed[] = [
  // ICU Beds
  { id: "bed-icu-1", bedNumber: "ICU-01", roomNumber: "201", building: "Building A", floor: "2", wardId: "ward-icu", status: "occupied", type: "icu", genderRestriction: "none", isolationType: "none", hasMonitor: true, hasVentilator: true, hasOxygen: true, hasSuction: true, currentPatientId: "pat-icu-ahmed", createdAt: new Date().toISOString() },
  { id: "bed-icu-2", bedNumber: "ICU-02", roomNumber: "201", building: "Building A", floor: "2", wardId: "ward-icu", status: "available", type: "icu", genderRestriction: "none", isolationType: "none", hasMonitor: true, hasVentilator: true, hasOxygen: true, hasSuction: true, createdAt: new Date().toISOString() },
  
  // Medical Male Beds
  { id: "bed-med-m-1", bedNumber: "MM-101", roomNumber: "101", building: "Building B", floor: "1", wardId: "ward-med-m", status: "occupied", type: "standard", genderRestriction: "male", isolationType: "none", hasMonitor: true, hasVentilator: false, hasOxygen: true, hasSuction: true, currentPatientId: "pat-surg-khaled", createdAt: new Date().toISOString() },
  { id: "bed-med-m-2", bedNumber: "MM-102", roomNumber: "101", building: "Building B", floor: "1", wardId: "ward-med-m", status: "available", type: "standard", genderRestriction: "male", isolationType: "none", hasMonitor: false, hasVentilator: false, hasOxygen: true, hasSuction: true, createdAt: new Date().toISOString() },
  
  // Pediatric Beds
  { id: "bed-peds-1", bedNumber: "PED-301", roomNumber: "301", building: "Building C", floor: "3", wardId: "ward-peds", status: "occupied", type: "pediatric", genderRestriction: "none", isolationType: "none", hasMonitor: false, hasVentilator: false, hasOxygen: true, hasSuction: true, currentPatientId: "pat-peds-yousuf", createdAt: new Date().toISOString() },
  { id: "bed-peds-2", bedNumber: "PED-302", roomNumber: "301", building: "Building C", floor: "3", wardId: "ward-peds", status: "available", type: "pediatric", genderRestriction: "none", isolationType: "none", hasMonitor: false, hasVentilator: false, hasOxygen: true, hasSuction: true, createdAt: new Date().toISOString() },

  // Isolation Beds
  { id: "bed-iso-1", bedNumber: "ISO-01", roomNumber: "401", building: "Building A", floor: "4", wardId: "ward-isolation", status: "occupied", type: "isolation", genderRestriction: "none", isolationType: "airborne", hasMonitor: true, hasVentilator: true, hasOxygen: true, hasSuction: true, currentPatientId: "pat-icu-sarah", createdAt: new Date().toISOString() },
];

export const INITIAL_MOCK_PATIENTS: Patient[] = [
  {
    id: "pat-icu-ahmed",
    mrn: "MRN-2026-0001",
    nameEn: "Ahmed Mansour Aly",
    nameAr: "أحمد منصور علي",
    age: 45,
    gender: "male",
    phone: "+966501234567",
    status: "ward",
    insurance: "Bupa",
    dob: "1981-05-15",
    nationality: "Egyptian",
    nationalId: "281051512345",
    bloodGroup: "A+",
    allergies: ["Penicillin"],
    insuranceProvider: "Bupa",
    insurancePolicyNumber: "BP-9988-77",
    currentWorkflowStage: "nursing_care",
    workflowId: "wf-icu-001",
    departmentId: "dept-icu",
    wardId: "dept-icu",
    bedId: "bed-icu-1",
    roomId: "rm-icu-main",
    building: "Building A",
    floor: "2F",
    currentClinicalLocation: "Building A - 2F - ICU Main Room",
    consumables: [
      { id: "cons-1", patientId: "pat-icu-ahmed", itemId: "inv-6", itemNameEn: "Syringe 5mL with Needle", itemNameAr: "سرنجة 5 مل بالإبرة", qty: 3, unitPrice: 1.0, totalPrice: 3.0, date: new Date().toISOString(), status: "pending" },
      { id: "cons-2", patientId: "pat-icu-ahmed", itemId: "inv-9", itemNameEn: "IV Cannula 20G (Pink)", itemNameAr: "كانيولا وريدية 20G (وردي)", qty: 1, unitPrice: 8.0, totalPrice: 8.0, date: new Date().toISOString(), status: "pending" }
    ],
    vitals: { temp: "38.2", bp: "135/85", hr: "94", spo2: "97", timestamp: new Date().toISOString() },
    vitalsLog: [
      { id: "v-1", patientId: "pat-icu-ahmed", timestamp: new Date().toISOString(), temperature: 38.2, pulse: 94, respiratoryRate: 20, bloodPressure: "135/85", oxygenSaturation: 97, temp: 38.2, bp: "135/85", hr: 94, spo2: 97 }
    ],
    prescriptions: [
      { id: "rx-1", patientId: "pat-icu-ahmed", medication: "Paracetamol 500mg Tablets", dose: "1 tablet", qty: 20, status: "pending", date: new Date().toISOString() }
    ],
    clinicalRecords: [
      { id: "cr-1", patientId: "pat-icu-ahmed", date: new Date().toISOString(), noteType: "Nursing", content: "Patient admitted to ICU post-cardiac event. Hemodynamically monitored. Vitals stable but elevated temp." }
    ]
  },
  {
    id: "pat-er-fatima",
    mrn: "MRN-2026-0002",
    nameEn: "Fatima Al-Zahraa Mohamed",
    nameAr: "فاطمة الزهراء محمد",
    age: 29,
    gender: "female",
    phone: "+966507654321",
    status: "er",
    insurance: "Tawuniya",
    dob: "1997-09-10",
    nationality: "Saudi",
    nationalId: "1097091012",
    bloodGroup: "O+",
    allergies: ["Sulfa Drugs"],
    insuranceProvider: "Tawuniya",
    insurancePolicyNumber: "TW-4433-22",
    currentWorkflowStage: "triage",
    workflowId: "wf-er-002",
    departmentId: "dept-er",
    bedId: "bed-er-1",
    roomId: "rm-er-triage",
    building: "Building A",
    floor: "G",
    currentClinicalLocation: "Building A - G - ER Triage",
    consumables: [],
    vitals: { temp: "37.1", bp: "115/75", hr: "82", spo2: "99", timestamp: new Date().toISOString() },
    vitalsLog: [
      { id: "v-2", patientId: "pat-er-fatima", timestamp: new Date().toISOString(), temperature: 37.1, pulse: 82, respiratoryRate: 16, bloodPressure: "115/75", oxygenSaturation: 99, temp: 37.1, bp: "115/75", hr: 82, spo2: 99 }
    ],
    prescriptions: [],
    clinicalRecords: []
  },
  {
    id: "pat-icu-sarah",
    mrn: "MRN-2026-0003",
    nameEn: "Sarah Ali Soliman",
    nameAr: "سارة علي سليمان",
    age: 62,
    gender: "female",
    phone: "+966504545454",
    status: "ward",
    insurance: "Cash",
    dob: "1964-11-20",
    nationality: "Saudi",
    nationalId: "1064112044",
    bloodGroup: "B-",
    allergies: [],
    insuranceProvider: "Cash",
    insurancePolicyNumber: "CASH-001",
    currentWorkflowStage: "doctor_consultation",
    workflowId: "wf-icu-003",
    departmentId: "dept-icu",
    wardId: "dept-icu",
    bedId: "bed-icu-3",
    roomId: "rm-icu-iso",
    building: "Building A",
    floor: "2F",
    currentClinicalLocation: "Building A - 2F - ICU Isolation Room",
    consumables: [],
    vitals: { temp: "36.8", bp: "120/80", hr: "74", spo2: "98", timestamp: new Date().toISOString() },
    vitalsLog: [
      { id: "v-3", patientId: "pat-icu-sarah", timestamp: new Date().toISOString(), temperature: 36.8, pulse: 74, respiratoryRate: 18, bloodPressure: "120/80", oxygenSaturation: 98, temp: 36.8, bp: "120/80", hr: 74, spo2: 98 }
    ],
    prescriptions: [
      { id: "rx-2", patientId: "pat-icu-sarah", medication: "Amoxicillin 500mg Capsules", dose: "1 capsule TID", qty: 21, status: "pending", date: new Date().toISOString() }
    ],
    clinicalRecords: []
  },
  {
    id: "pat-peds-yousuf",
    mrn: "MRN-2026-0004",
    nameEn: "Yousuf Hassan Khedr",
    nameAr: "يوسف حسن خضر",
    age: 8,
    gender: "male",
    phone: "+966503332211",
    status: "ward",
    insurance: "Bupa",
    dob: "2018-02-12",
    nationality: "Saudi",
    nationalId: "1180212999",
    bloodGroup: "A-",
    allergies: [],
    insuranceProvider: "Bupa",
    insurancePolicyNumber: "BP-5566-77",
    currentWorkflowStage: "nursing_care",
    workflowId: "wf-peds-004",
    departmentId: "dept-ward-peds",
    wardId: "dept-ward-peds",
    bedId: "bed-peds-1",
    roomId: "rm-peds-101",
    building: "Building C",
    floor: "3F",
    currentClinicalLocation: "Building C - 3F - Room 101",
    consumables: [],
    vitals: { temp: "38.9", bp: "100/60", hr: "110", spo2: "96", timestamp: new Date().toISOString() },
    vitalsLog: [
      { id: "v-4", patientId: "pat-peds-yousuf", timestamp: new Date().toISOString(), temperature: 38.9, pulse: 110, respiratoryRate: 24, bloodPressure: "100/60", oxygenSaturation: 96, temp: 38.9, bp: "100/60", hr: 110, spo2: 96 }
    ],
    prescriptions: [],
    clinicalRecords: []
  },
  {
    id: "pat-surg-khaled",
    mrn: "MRN-2026-0005",
    nameEn: "Khaled Mahmoud Shaker",
    nameAr: "خالد محمود شاكر",
    age: 38,
    gender: "male",
    phone: "+966509988776",
    status: "ward",
    insurance: "MedNet",
    dob: "1988-07-22",
    nationality: "Jordanian",
    nationalId: "2880722112",
    bloodGroup: "AB+",
    allergies: ["Aspirin"],
    insuranceProvider: "MedNet",
    insurancePolicyNumber: "MN-1010-20",
    currentWorkflowStage: "nursing_care",
    workflowId: "wf-surg-005",
    departmentId: "dept-ward-surg",
    wardId: "dept-ward-surg",
    bedId: "bed-surg-1",
    roomId: "rm-surg-201",
    building: "Building C",
    floor: "2F",
    currentClinicalLocation: "Building C - 2F - Room 201",
    consumables: [],
    vitals: { temp: "36.5", bp: "110/70", hr: "68", spo2: "98", timestamp: new Date().toISOString() },
    vitalsLog: [
      { id: "v-5", patientId: "pat-surg-khaled", timestamp: new Date().toISOString(), temperature: 36.5, pulse: 68, respiratoryRate: 14, bloodPressure: "110/70", oxygenSaturation: 98, temp: 36.5, bp: "110/70", hr: 68, spo2: 98 }
    ],
    prescriptions: [],
    clinicalRecords: []
  },
  {
    id: "pat-opd-mona",
    mrn: "MRN-2026-0006",
    nameEn: "Mona Ibrahim Khalil",
    nameAr: "منى إبراهيم خليل",
    age: 51,
    gender: "female",
    phone: "+966501114477",
    status: "pharmacy",
    insurance: "Tawuniya",
    dob: "1975-01-05",
    nationality: "Saudi",
    nationalId: "1075010533",
    bloodGroup: "O-",
    allergies: [],
    insuranceProvider: "Tawuniya",
    insurancePolicyNumber: "TW-2020-30",
    currentWorkflowStage: "orders",
    workflowId: "wf-opd-006",
    departmentId: "dept-opd",
    consumables: [],
    vitals: { temp: "36.7", bp: "125/82", hr: "72", spo2: "99", timestamp: new Date().toISOString() },
    vitalsLog: [
      { id: "v-6", patientId: "pat-opd-mona", timestamp: new Date().toISOString(), temperature: 36.7, pulse: 72, respiratoryRate: 16, bloodPressure: "125/82", oxygenSaturation: 99, temp: 36.7, bp: "125/82", hr: 72, spo2: 99 }
    ],
    prescriptions: [
      { id: "rx-3", patientId: "pat-opd-mona", medication: "Salbutamol Inhaler (Ventolin)", dose: "2 puffs QID", qty: 2, status: "pending", date: new Date().toISOString() }
    ],
    clinicalRecords: []
  },
  {
    id: "pat-opd-yasser",
    mrn: "MRN-2026-0007",
    nameEn: "Yasser Al-Ghamdi",
    nameAr: "ياسر الغامدي",
    age: 57,
    gender: "male",
    phone: "+966502223344",
    status: "lab",
    insurance: "Bupa",
    dob: "1969-04-10",
    nationality: "Saudi",
    nationalId: "1069041055",
    bloodGroup: "AB-",
    allergies: [],
    insuranceProvider: "Bupa",
    insurancePolicyNumber: "BP-1212-34",
    currentWorkflowStage: "lab_rad_execution",
    workflowId: "wf-opd-007",
    departmentId: "dept-opd",
    consumables: [],
    vitals: { timestamp: new Date().toISOString() },
    vitalsLog: [],
    prescriptions: [],
    clinicalRecords: []
  }
];

export const INITIAL_MOCK_PRESCRIPTIONS: Prescription[] = [
  { id: "rx-1", patientId: "pat-icu-ahmed", medication: "Paracetamol 500mg Tablets", dose: "1 tablet", qty: 20, status: "pending", date: new Date().toISOString() },
  { id: "rx-2", patientId: "pat-icu-sarah", medication: "Amoxicillin 500mg Capsules", dose: "1 capsule TID", qty: 21, status: "pending", date: new Date().toISOString() },
  { id: "rx-3", patientId: "pat-opd-mona", medication: "Salbutamol Inhaler (Ventolin)", dose: "2 puffs QID", qty: 2, status: "pending", date: new Date().toISOString() }
];

export const INITIAL_MOCK_INVOICES: Invoice[] = [
  { id: "inv-inv-1", patientId: "pat-icu-ahmed", amount: 1540.0, status: "unpaid", date: new Date().toISOString().split('T')[0] },
  { id: "inv-inv-2", patientId: "pat-opd-mona", amount: 90.0, status: "paid", date: new Date().toISOString().split('T')[0] }
];

export const INITIAL_MOCK_MASTER_DATA: MasterDataEntry[] = [
  { id: "md-ins-1", category: "insurance", valueEn: "Cash", valueAr: "كاش", isOfficial: true, status: "approved", useCount: 10, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-ins-2", category: "insurance", valueEn: "Bupa", valueAr: "بوبا", isOfficial: true, status: "approved", useCount: 25, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-ins-3", category: "insurance", valueEn: "Tawuniya", valueAr: "التعاونية", isOfficial: true, status: "approved", useCount: 30, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-ins-4", category: "insurance", valueEn: "MedNet", valueAr: "ميد نت", isOfficial: true, status: "approved", useCount: 15, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-city-1", category: "city", valueEn: "Riyadh", valueAr: "الرياض", isOfficial: true, status: "approved", useCount: 100, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-city-2", category: "city", valueEn: "Jeddah", valueAr: "جدة", isOfficial: true, status: "approved", useCount: 80, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-city-3", category: "city", valueEn: "Dammam", valueAr: "الدمام", isOfficial: true, status: "approved", useCount: 40, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-nat-1", category: "nationality", valueEn: "Saudi", valueAr: "سعودي", isOfficial: true, status: "approved", useCount: 120, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-nat-2", category: "nationality", valueEn: "Egyptian", valueAr: "مصري", isOfficial: true, status: "approved", useCount: 50, createdBy: "System", date: "2026-01-01", time: "00:00:00" },
  { id: "md-nat-3", category: "nationality", valueEn: "Jordanian", valueAr: "أردني", isOfficial: true, status: "approved", useCount: 10, createdBy: "System", date: "2026-01-01", time: "00:00:00" }
];

export const INITIAL_MOCK_CPOE_ORDERS = [
  { id: "ord-1", patientId: "pat-opd-yasser", patientMRN: "MRN-2026-0007", orderType: "lab", itemName: "Complete Blood Count (CBC)", status: "pending", priority: "routine", timestamp: new Date().toISOString() },
  { id: "ord-2", patientId: "pat-icu-ahmed", patientMRN: "MRN-2026-0001", orderType: "radiology", itemName: "Chest X-Ray", status: "pending", priority: "urgent", timestamp: new Date().toISOString() }
];

export const INITIAL_MOCK_ER_QUEUE = [
  { id: "q-1", patientId: "pat-er-fatima", triageLevel: 2, chiefComplaintAr: "ألم شديد في الصدر وضيق تنفس", chiefComplaintEn: "Chest pain and dyspnea", waitingTimeMinutes: 5, checkedInTime: new Date().toISOString() }
];

export const INITIAL_MOCK_ADMISSION_REQUESTS = [
  { id: "req-1", patientId: "pat-er-fatima", requestDate: new Date().toISOString(), requestingDoctor: "Dr. Mohamed Elsayed", targetDepartment: "dept-icu", reasonAr: "مراقبة مستمرة لوظائف القلب", reasonEn: "Continuous cardiac monitoring" }
];
