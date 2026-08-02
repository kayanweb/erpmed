export const LAB_CATEGORIES = [
  "Hematology", "Chemistry", "Immunology", "Microbiology", "Urinalysis", "Coagulation", "Endocrinology", "Genetics", "Toxicology", "Pathology"
];

export const RADIOLOGY_CATEGORIES = [
  "X-Ray", "MRI", "CT Scan", "Ultrasound", "Nuclear Medicine", "Fluoroscopy", "Mammography", "PET Scan", "Angiography", "DEXA"
];

// Generate 2000 unique lab tests programmatically
export const LAB_TESTS = Array.from({ length: 2000 }, (_, i) => {
  const category = LAB_CATEGORIES[i % LAB_CATEGORIES.length];
  return {
    id: `LAB-${10000 + i}`,
    nameEn: `${category} Panel Test Suite ${i + 1}`,
    nameAr: `تحليل ${category} الشامل ${i + 1}`,
    category: category,
    code: `CPT-${80000 + (i % 1000)}`,
    turnaroundTime: `${(i % 48) + 1}h`,
    price: ((i % 50) + 1) * 10
  };
});

// Generate 500 unique radiology exams programmatically
export const RADIOLOGY_EXAMS = Array.from({ length: 500 }, (_, i) => {
  const category = RADIOLOGY_CATEGORIES[i % RADIOLOGY_CATEGORIES.length];
  const regions = ["Head", "Chest", "Abdomen", "Pelvis", "Spine", "Extremity"];
  const region = regions[i % regions.length];
  return {
    id: `RAD-${50000 + i}`,
    nameEn: `${category} of ${region} - Protocol ${i + 1}`,
    nameAr: `أشعة ${category} على ${region} - بروتوكول ${i + 1}`,
    category: category,
    region: region,
    code: `CPT-${70000 + (i % 1000)}`,
    duration: `${(i % 60) + 15} mins`,
    price: ((i % 100) + 5) * 20
  };
});
