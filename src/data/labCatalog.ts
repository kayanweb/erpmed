export interface TestCatalogItem {
  id: string;
  nameAr: string;
  nameEn: string;
  department: "Biochemistry" | "Hematology" | "Microbiology" | "Immunology" | "Pathology" | "Genetics" | "Hormones";
  price: number;
  tat: string; // Turnaround time
  tubeColor: "Purple (EDTA)" | "Red (Serum)" | "Blue (Citrate)" | "Green (Heparin)" | "Yellow (Gel)" | "Urine Cup" | "Stool Cup" | "Swab" | "Pink" | "Grey";
  parameters: { name: string; unit: string; min: number; max: number }[];
}

export const DEFAULT_CATALOG: TestCatalogItem[] = [
  // Hematology
  {
    id: "cbc",
    nameAr: "صورة دم كاملة (CBC)",
    nameEn: "Complete Blood Count (CBC)",
    department: "Hematology",
    price: 150,
    tat: "2 Hours",
    tubeColor: "Purple (EDTA)",
    parameters: [
      { name: "WBC (White Blood Cells)", unit: "10^9/L", min: 4.0, max: 11.0 },
      { name: "RBC (Red Blood Cells)", unit: "10^12/L", min: 4.5, max: 5.9 },
      { name: "Hemoglobin (Hb)", unit: "g/dL", min: 13.5, max: 17.5 },
      { name: "Hematocrit (HCT)", unit: "%", min: 41.0, max: 50.0 },
      { name: "Platelets (PLT)", unit: "10^9/L", min: 150, max: 450 }
    ]
  },
  {
    id: "esr",
    nameAr: "سرعة ترسب الدم (ESR)",
    nameEn: "Erythrocyte Sedimentation Rate (ESR)",
    department: "Hematology",
    price: 80,
    tat: "2 Hours",
    tubeColor: "Purple (EDTA)",
    parameters: [
      { name: "ESR", unit: "mm/hr", min: 0, max: 15 }
    ]
  },
  {
    id: "coagulation",
    nameAr: "ملف التخثر (PT/PTT/INR)",
    nameEn: "Coagulation Profile (PT/PTT/INR)",
    department: "Hematology",
    price: 120,
    tat: "2 Hours",
    tubeColor: "Blue (Citrate)",
    parameters: [
      { name: "PT", unit: "sec", min: 11.0, max: 13.5 },
      { name: "aPTT", unit: "sec", min: 25.0, max: 35.0 },
      { name: "INR", unit: "ratio", min: 0.8, max: 1.1 }
    ]
  },
  // Biochemistry
  {
    id: "lipid",
    nameAr: "ملف الدهون الكامل (Lipid Profile)",
    nameEn: "Lipid Profile",
    department: "Biochemistry",
    price: 250,
    tat: "4 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Total Cholesterol", unit: "mg/dL", min: 100, max: 200 },
      { name: "Triglycerides", unit: "mg/dL", min: 30, max: 150 },
      { name: "HDL Cholesterol", unit: "mg/dL", min: 40, max: 60 },
      { name: "LDL Cholesterol", unit: "mg/dL", min: 50, max: 130 }
    ]
  },
  {
    id: "kidney",
    nameAr: "وظائف الكلى (Kidney Panel)",
    nameEn: "Kidney Function Test (KFT)",
    department: "Biochemistry",
    price: 180,
    tat: "3 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Urea", unit: "mg/dL", min: 15.0, max: 45.0 },
      { name: "Creatinine", unit: "mg/dL", min: 0.6, max: 1.2 },
      { name: "Sodium (Na+)", unit: "mEq/L", min: 135, max: 145 },
      { name: "Potassium (K+)", unit: "mEq/L", min: 3.5, max: 5.1 }
    ]
  },
  {
    id: "liver",
    nameAr: "وظائف الكبد (Liver Panel)",
    nameEn: "Liver Function Test (LFT)",
    department: "Biochemistry",
    price: 220,
    tat: "3 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "ALT", unit: "U/L", min: 7, max: 56 },
      { name: "AST", unit: "U/L", min: 10, max: 40 },
      { name: "Total Bilirubin", unit: "mg/dL", min: 0.2, max: 1.2 },
      { name: "Albumin", unit: "g/dL", min: 3.5, max: 5.0 }
    ]
  },
  {
    id: "glucose_f",
    nameAr: "سكر صائم (FBS)",
    nameEn: "Fasting Blood Sugar (FBS)",
    department: "Biochemistry",
    price: 50,
    tat: "2 Hours",
    tubeColor: "Grey",
    parameters: [
      { name: "Fasting Glucose", unit: "mg/dL", min: 70, max: 99 }
    ]
  },
  {
    id: "glucose_r",
    nameAr: "سكر عشوائي (RBS)",
    nameEn: "Random Blood Sugar (RBS)",
    department: "Biochemistry",
    price: 50,
    tat: "2 Hours",
    tubeColor: "Grey",
    parameters: [
      { name: "Random Glucose", unit: "mg/dL", min: 70, max: 140 }
    ]
  },
  {
    id: "electrolytes",
    nameAr: "الأملاح (Electrolytes)",
    nameEn: "Electrolyte Panel",
    department: "Biochemistry",
    price: 150,
    tat: "2 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Sodium", unit: "mEq/L", min: 135, max: 145 },
      { name: "Potassium", unit: "mEq/L", min: 3.5, max: 5.1 },
      { name: "Chloride", unit: "mEq/L", min: 98, max: 107 },
      { name: "Bicarbonate", unit: "mEq/L", min: 22, max: 29 }
    ]
  },
  {
    id: "cardiac_enzymes",
    nameAr: "إنزيمات القلب (Cardiac Enzymes)",
    nameEn: "Cardiac Panel (Troponin/CK-MB)",
    department: "Biochemistry",
    price: 400,
    tat: "1 Hour",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Troponin I", unit: "ng/mL", min: 0, max: 0.04 },
      { name: "CK-MB", unit: "U/L", min: 0, max: 25 },
      { name: "Myoglobin", unit: "ng/mL", min: 0, max: 85 }
    ]
  },
  // Hormones
  {
    id: "hba1c",
    nameAr: "السكر التراكمي (HbA1c)",
    nameEn: "Glycated Hemoglobin (HbA1c)",
    department: "Hormones",
    price: 160,
    tat: "4 Hours",
    tubeColor: "Purple (EDTA)",
    parameters: [
      { name: "HbA1c Level", unit: "%", min: 4.0, max: 5.6 }
    ]
  },
  {
    id: "tft",
    nameAr: "وظائف الغدة الدرقية (TFT)",
    nameEn: "Thyroid Function Test (TFT)",
    department: "Hormones",
    price: 300,
    tat: "6 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "TSH", unit: "mIU/L", min: 0.4, max: 4.0 },
      { name: "Free T3", unit: "pg/mL", min: 2.3, max: 4.2 },
      { name: "Free T4", unit: "ng/dL", min: 0.9, max: 1.7 }
    ]
  },
  {
    id: "vit_d",
    nameAr: "فيتامين د (Vitamin D)",
    nameEn: "Vitamin D (25-OH)",
    department: "Hormones",
    price: 280,
    tat: "8 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Vitamin D3", unit: "ng/mL", min: 30, max: 100 }
    ]
  },
  {
    id: "vit_b12",
    nameAr: "فيتامين ب12 (Vitamin B12)",
    nameEn: "Vitamin B12",
    department: "Hormones",
    price: 250,
    tat: "8 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Vitamin B12", unit: "pg/mL", min: 200, max: 900 }
    ]
  },
  {
    id: "iron_panel",
    nameAr: "مخزون الحديد (Iron Panel)",
    nameEn: "Iron Panel (Ferritin/TIBC)",
    department: "Hormones",
    price: 220,
    tat: "4 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Iron", unit: "mcg/dL", min: 65, max: 176 },
      { name: "TIBC", unit: "mcg/dL", min: 250, max: 450 },
      { name: "Ferritin", unit: "ng/mL", min: 12, max: 300 }
    ]
  },
  {
    id: "bhcg",
    nameAr: "تحليل الحمل الرقمي (B-hCG)",
    nameEn: "Quantitative hCG",
    department: "Hormones",
    price: 150,
    tat: "2 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Beta hCG", unit: "mIU/mL", min: 0, max: 5 }
    ]
  },
  {
    id: "testosterone",
    nameAr: "هرمون التستوستيرون",
    nameEn: "Testosterone (Total & Free)",
    department: "Hormones",
    price: 300,
    tat: "6 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Total Testosterone", unit: "ng/dL", min: 240, max: 950 },
      { name: "Free Testosterone", unit: "pg/mL", min: 5, max: 21 }
    ]
  },
  // Immunology
  {
    id: "crp",
    nameAr: "بروتين سي التفاعلي (CRP)",
    nameEn: "C-Reactive Protein (CRP)",
    department: "Immunology",
    price: 100,
    tat: "2 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "CRP", unit: "mg/L", min: 0, max: 5.0 }
    ]
  },
  {
    id: "procalcitonin",
    nameAr: "بروكالسيتونين (Procalcitonin)",
    nameEn: "Procalcitonin (PCT)",
    department: "Immunology",
    price: 350,
    tat: "2 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "Procalcitonin", unit: "ng/mL", min: 0, max: 0.15 }
    ]
  },
  {
    id: "rheumatoid_factor",
    nameAr: "عامل الروماتويد (RF)",
    nameEn: "Rheumatoid Factor (RF)",
    department: "Immunology",
    price: 150,
    tat: "4 Hours",
    tubeColor: "Yellow (Gel)",
    parameters: [
      { name: "RF", unit: "IU/mL", min: 0, max: 14 }
    ]
  },
  // Microbiology
  {
    id: "urine_analysis",
    nameAr: "تحليل بول شامل (Urinalysis)",
    nameEn: "Urinalysis (U/A)",
    department: "Microbiology",
    price: 60,
    tat: "1 Hour",
    tubeColor: "Urine Cup",
    parameters: [
      { name: "pH", unit: "pH", min: 4.5, max: 8.0 },
      { name: "Specific Gravity", unit: "SG", min: 1.005, max: 1.030 },
      { name: "WBC", unit: "HPF", min: 0, max: 5 },
      { name: "RBC", unit: "HPF", min: 0, max: 2 }
    ]
  },
  {
    id: "urine_culture",
    nameAr: "مزرعة بول (Urine Culture)",
    nameEn: "Urine Culture & Sensitivity",
    department: "Microbiology",
    price: 200,
    tat: "72 Hours",
    tubeColor: "Urine Cup",
    parameters: [
      { name: "Colony Count", unit: "CFU/mL", min: 0, max: 10000 }
    ]
  },
  {
    id: "stool_analysis",
    nameAr: "تحليل براز (Stool Analysis)",
    nameEn: "Stool Routine & Microscopy",
    department: "Microbiology",
    price: 70,
    tat: "2 Hours",
    tubeColor: "Stool Cup",
    parameters: [
      { name: "Ova & Parasites", unit: "-", min: 0, max: 0 },
      { name: "Pus Cells", unit: "HPF", min: 0, max: 5 },
      { name: "Occult Blood", unit: "-", min: 0, max: 0 }
    ]
  },
  {
    id: "blood_culture",
    nameAr: "مزرعة دم (Blood Culture)",
    nameEn: "Blood Culture & Sensitivity",
    department: "Microbiology",
    price: 350,
    tat: "5 Days",
    tubeColor: "Pink",
    parameters: [
      { name: "Growth", unit: "-", min: 0, max: 0 }
    ]
  }
];
