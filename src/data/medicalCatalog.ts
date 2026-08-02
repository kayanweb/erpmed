export interface CatalogItem {
  value: string;
  ar: string;
  en: string;
  category?: string;
  defaultDose?: string;
  defaultSig?: string;
  defaultSigAr?: string;
  defaultQty?: number;
}

export const LAB_CATALOG: CatalogItem[] = [
  // Hematology
  { value: "Complete Blood Count (CBC)", ar: "صورة دم كاملة (CBC)", en: "Complete Blood Count (CBC)", category: "Hematology" },
  { value: "Erythrocyte Sedimentation Rate (ESR)", ar: "سرعة ترسيب الدم (ESR)", en: "Erythrocyte Sedimentation Rate (ESR)", category: "Hematology" },
  { value: "Reticulocyte Count", ar: "عد الخلايا الشبكية (Reticulocytes)", en: "Reticulocyte Count", category: "Hematology" },
  { value: "Prothrombin Time (PT/INR)", ar: "زمن البروثرومبين والسيولة (PT/INR)", en: "Prothrombin Time (PT/INR)", category: "Hematology" },
  { value: "Partial Thromboplastin Time (PTT)", ar: "زمن التجلط الجزئي (PTT)", en: "Partial Thromboplastin Time (PTT)", category: "Hematology" },
  { value: "Blood Group & Rh Typing", ar: "فصيلة الدم وعامل الريسوس (ABO/Rh)", en: "Blood Group & Rh Typing", category: "Hematology" },
  { value: "Coombs Test (Direct)", ar: "فحص كومبس المباشر (Direct Coombs)", en: "Coombs Test (Direct)", category: "Hematology" },
  { value: "Coombs Test (Indirect)", ar: "فحص كومبس غير المباشر (Indirect Coombs)", en: "Coombs Test (Indirect)", category: "Hematology" },
  { value: "G6PD Enzyme Activity", ar: "إنزيم نقص الخميرة (G6PD)", en: "G6PD Enzyme Activity", category: "Hematology" },
  { value: "Hemoglobin Electrophoresis", ar: "فحص الهيموجلوبين الكهربائي", en: "Hemoglobin Electrophoresis", category: "Hematology" },

  // Chemistry & Kidney & Liver
  { value: "Electrolytes Panel (Na, K, Cl)", ar: "صوديوم وبوتاسيوم وكلوريد الدم (Electrolytes)", en: "Electrolytes Panel (Na, K, Cl)", category: "Chemistry" },
  { value: "Serum Sodium (Na)", ar: "صوديوم الدم (Na)", en: "Serum Sodium (Na)", category: "Chemistry" },
  { value: "Serum Potassium (K)", ar: "بوتاسيوم الدم (K)", en: "Serum Potassium (K)", category: "Chemistry" },
  { value: "Serum Calcium (Total & Ionized)", ar: "كالسيوم الدم الكلي والمتأين", en: "Serum Calcium (Total & Ionized)", category: "Chemistry" },
  { value: "Serum Magnesium", ar: "ماغنيسيوم الدم (Mg)", en: "Serum Magnesium", category: "Chemistry" },
  { value: "Serum Phosphorus", ar: "فسفور الدم (Phosphate)", en: "Serum Phosphorus", category: "Chemistry" },
  { value: "Kidney Function Tests (KFT) - Urea & Creatinine", ar: "وظائف الكلى (البولينا والكرياتينين)", en: "Kidney Function Tests (KFT)", category: "Renal" },
  { value: "Serum Creatinine", ar: "كرياتينين الدم (Creatinine)", en: "Serum Creatinine", category: "Renal" },
  { value: "Blood Urea Nitrogen (BUN)", ar: "نيتروجين يوريا الدم (BUN)", en: "Blood Urea Nitrogen (BUN)", category: "Renal" },
  { value: "Serum Uric Acid", ar: "حمض البوليك في الدم (Uric Acid)", en: "Serum Uric Acid", category: "Renal" },
  { value: "Liver Function Tests (LFT) - Complete", ar: "وظائف الكبد كاملة (LFT)", en: "Liver Function Tests (LFT)", category: "Hepatic" },
  { value: "Alanine Aminotransferase (ALT)", ar: "إنزيم الكبد (ALT/SGPT)", en: "Alanine Aminotransferase (ALT)", category: "Hepatic" },
  { value: "Aspartate Aminotransferase (AST)", ar: "إنزيم الكبد (AST/SGOT)", en: "Aspartate Aminotransferase (AST)", category: "Hepatic" },
  { value: "Alkaline Phosphatase (ALP)", ar: "إنزيم الفوسفاتاز القلوي (ALP)", en: "Alkaline Phosphatase (ALP)", category: "Hepatic" },
  { value: "Total & Direct Bilirubin", ar: "الصفراء الكلية والمباشرة (Bilirubin)", en: "Total & Direct Bilirubin", category: "Hepatic" },
  { value: "Serum Albumin", ar: "ألبومين الدم (Albumin)", en: "Serum Albumin", category: "Hepatic" },
  { value: "Total Protein", ar: "البروتين الكلي في الدم", en: "Total Protein", category: "Hepatic" },
  { value: "Gamma-Glutamyl Transferase (GGT)", ar: "إنزيم الكبد (GGT)", en: "Gamma-Glutamyl Transferase (GGT)", category: "Hepatic" },
  { value: "Serum Lactate Dehydrogenase (LDH)", ar: "خميرة اللاكتات (LDH)", en: "Serum Lactate Dehydrogenase (LDH)", category: "Hepatic" },
  { value: "Blood Ammonia Level", ar: "مستوى الأمونيا في الدم (Ammonia)", en: "Blood Ammonia Level", category: "Hepatic" },

  // Cardiac Biomarkers
  { value: "Cardiac Troponin I (STAT)", ar: "فحص إنزيمات القلب تروپونين I (STAT)", en: "Cardiac Troponin I (STAT)", category: "Cardiac" },
  { value: "High-Sensitivity Troponin T", ar: "تروبونين T عالي الحساسية", en: "High-Sensitivity Troponin T", category: "Cardiac" },
  { value: "CK-MB Mass", ar: "إنزيم عضلة القلب (CK-MB)", en: "CK-MB Mass", category: "Cardiac" },
  { value: "NT-proBNP (Heart Failure Marker)", ar: "مؤشر هبوط القلب (NT-proBNP)", en: "NT-proBNP (Heart Failure Marker)", category: "Cardiac" },
  { value: "Serum Myoglobin", ar: "ميوغلوبين الدم (Myoglobin)", en: "Serum Myoglobin", category: "Cardiac" },

  // Diabetes & Lipids
  { value: "HbA1c (Glycated Hemoglobin)", ar: "السكر التراكمي (HbA1c)", en: "HbA1c (Glycated Hemoglobin)", category: "Endocrine" },
  { value: "Fasting Blood Glucose (FBG)", ar: "سكر الدم الصائم (FBG)", en: "Fasting Blood Glucose (FBG)", category: "Endocrine" },
  { value: "Random Blood Glucose (RBG)", ar: "سكر الدم العشوائي (RBG)", en: "Random Blood Glucose (RBG)", category: "Endocrine" },
  { value: "Postprandial Blood Glucose (2h PP)", ar: "سكر الدم بعد الأكل بساعتين", en: "Postprandial Blood Glucose (2h PP)", category: "Endocrine" },
  { value: "Oral Glucose Tolerance Test (OGTT)", ar: "منحنى تحمل الجلوكوز (OGTT)", en: "Oral Glucose Tolerance Test (OGTT)", category: "Endocrine" },
  { value: "Lipid Profile (Chol, Trig, HDL, LDL)", ar: "تحليل دهون الدم الكامل (Lipid Profile)", en: "Lipid Profile (Chol, Trig, HDL, LDL)", category: "Lipids" },
  { value: "Serum Total Cholesterol", ar: "الكوليسترول الكلي (Cholesterol)", en: "Serum Total Cholesterol", category: "Lipids" },
  { value: "Serum Triglycerides", ar: "الدهون الثلاثية (Triglycerides)", en: "Serum Triglycerides", category: "Lipids" },
  { value: "HDL Cholesterol", ar: "الكوليسترول النافع (HDL)", en: "HDL Cholesterol", category: "Lipids" },
  { value: "LDL Cholesterol", ar: "الكوليسترول الضار (LDL)", en: "LDL Cholesterol", category: "Lipids" },

  // Thyroid & Hormones
  { value: "Thyroid Stimulating Hormone (TSH)", ar: "هرمون الغدة الدرقية (TSH)", en: "Thyroid Stimulating Hormone (TSH)", category: "Thyroid" },
  { value: "Free T4 (FT4)", ar: "هرمون الثايروكسين الحر (FT4)", en: "Free T4 (FT4)", category: "Thyroid" },
  { value: "Free T3 (FT3)", ar: "هرمون ثلاثي اليود الحر (FT3)", en: "Free T3 (FT3)", category: "Thyroid" },
  { value: "Serum Cortisol (AM/PM)", ar: "هرمون الكورتيزول صباحاً/مساءً", en: "Serum Cortisol (AM/PM)", category: "Hormones" },
  { value: "Serum Prolactin", ar: "هرمون الحليب (Prolactin)", en: "Serum Prolactin", category: "Hormones" },
  { value: "Follicle Stimulating Hormone (FSH)", ar: "هرمون تحفيز المبيض (FSH)", en: "Follicle Stimulating Hormone (FSH)", category: "Hormones" },
  { value: "Luteinizing Hormone (LH)", ar: "الهرمون الملوتن (LH)", en: "Luteinizing Hormone (LH)", category: "Hormones" },
  { value: "Serum Estradiol (E2)", ar: "هرمون الإستروجين (E2)", en: "Serum Estradiol (E2)", category: "Hormones" },
  { value: "Serum Progesterone", ar: "هرمون البروجسترون", en: "Serum Progesterone", category: "Hormones" },
  { value: "Total Testosterone", ar: "هرمون التستوستيرون الذكوري", en: "Total Testosterone", category: "Hormones" },
  { value: "Beta-hCG (Quantitative)", ar: "هرمون الحمل الرقمي (Beta-hCG)", en: "Beta-hCG (Quantitative)", category: "Hormones" },
  { value: "Vitamin D (25-Hydroxy)", ar: "فيتامين د (25-OH Vitamin D)", en: "Vitamin D (25-Hydroxy)", category: "Vitamins" },
  { value: "Vitamin B12 Level", ar: "فيتامين ب12 (Vitamin B12)", en: "Vitamin B12 Level", category: "Vitamins" },
  { value: "Serum Folate Level", ar: "مستوى حمض الفوليك بالدم", en: "Serum Folate Level", category: "Vitamins" },

  // Immunology & Tumor Markers
  { value: "C-Reactive Protein (CRP)", ar: "البروتين التفاعلي C (CRP)", en: "C-Reactive Protein (CRP)", category: "Immunology" },
  { value: "High-Sensitivity CRP (hs-CRP)", ar: "بروتين CRP عالي الحساسية", en: "High-Sensitivity CRP (hs-CRP)", category: "Immunology" },
  { value: "Antinuclear Antibodies (ANA) Screen", ar: "الأجسام المضادة للنواة (ANA)", en: "Antinuclear Antibodies (ANA) Screen", category: "Immunology" },
  { value: "Rheumatoid Factor (RF) Quantitative", ar: "عامل الروماتويد الكمي (RF)", en: "Rheumatoid Factor (RF) Quantitative", category: "Immunology" },
  { value: "Anti-dsDNA Antibodies", ar: "أجسام مضادة للـ DNA مزدوج السلسلة", en: "Anti-dsDNA Antibodies", category: "Immunology" },
  { value: "Complement C3 & C4 Levels", ar: "عوامل المتممة المناعية C3 و C4", en: "Complement C3 & C4 Levels", category: "Immunology" },
  { value: "Prostate-Specific Antigen (PSA) Total", ar: "مؤشر البروستاتا الكلي (PSA)", en: "Prostate-Specific Antigen (PSA) Total", category: "Tumor Markers" },
  { value: "Carcinoembryonic Antigen (CEA)", ar: "مؤشر أورام الجهاز الهضمي (CEA)", en: "Carcinoembryonic Antigen (CEA)", category: "Tumor Markers" },
  { value: "Cancer Antigen 125 (CA-125)", ar: "مؤشر أورام المبيض (CA-125)", en: "Cancer Antigen 125 (CA-125)", category: "Tumor Markers" },
  { value: "Cancer Antigen 19-9 (CA-19-9)", ar: "مؤشر أورام البنكرياس والمرارة", en: "Cancer Antigen 19-9 (CA-19-9)", category: "Tumor Markers" },
  { value: "Alpha-Fetoprotein (AFP) Tumor Marker", ar: "مؤشر أورام الكبد والأجنة (AFP)", en: "Alpha-Fetoprotein (AFP) Tumor Marker", category: "Tumor Markers" },

  // Infectious Diseases
  { value: "Hepatitis B Surface Antigen (HBsAg)", ar: "فيروس الكبد الوبائي ب (HBsAg)", en: "Hepatitis B Surface Antigen (HBsAg)", category: "Infectious" },
  { value: "Hepatitis C Virus Antibody (HCV Ab)", ar: "أجسام مضادة لفيروس سي (HCV)", en: "Hepatitis C Virus Antibody (HCV Ab)", category: "Infectious" },
  { value: "HIV 1/2 Antigen/Antibody Combo", ar: "تحليل نقص المناعة المكتسبة (HIV Combo)", en: "HIV 1/2 Antigen/Antibody Combo", category: "Infectious" },
  { value: "Syphilis Serology (VDRL/RPR)", ar: "فحص الزهري (VDRL/RPR)", en: "Syphilis Serology (VDRL/RPR)", category: "Infectious" },
  { value: "COVID-19 RT-PCR Test", ar: "مسحة فيروس كورونا (PCR)", en: "COVID-19 RT-PCR Test", category: "Infectious" },
  { value: "Influenza A & B Rapid Antigen", ar: "فحص الإنفلونزا السريع (أ & ب)", en: "Influenza A & B Rapid Antigen", category: "Infectious" },

  // Cultures & Microbiology
  { value: "Blood Culture & Sensitivity", ar: "مزرعة دم ومقاومة المضادات (Blood Culture)", en: "Blood Culture & Sensitivity", category: "Microbiology" },
  { value: "Urine Culture & Sensitivity", ar: "مزرعة بول عادية ومقاومة مضادات", en: "Urine Culture & Sensitivity", category: "Microbiology" },
  { value: "Sputum Culture & Sensitivity", ar: "مزرعة بلغم ومقاومة مضادات", en: "Sputum Culture & Sensitivity", category: "Microbiology" },
  { value: "Wound Culture & Sensitivity", ar: "مزرعة مسحة جرح ومقاومة مضادات", en: "Wound Culture & Sensitivity", category: "Microbiology" },
  { value: "Stool Culture & Pathogens", ar: "مزرعة براز للبحث عن ميكروبات نشطة", en: "Stool Culture & Pathogens", category: "Microbiology" },

  // Urine & Stool
  { value: "Urine Analysis (Routine & Microscopic)", ar: "تحليل البول الكامل المجهري (Urine)", en: "Urine Analysis (Routine & Microscopic)", category: "Urine/Stool" },
  { value: "Microalbuminuria Test", ar: "الزلال الدقيق في البول (Microalbumin)", en: "Microalbuminuria Test", category: "Urine/Stool" },
  { value: "24-Hour Urine Protein & Clearance", ar: "بروتين البول وتصفية الكرياتينين 24 ساعة", en: "24-Hour Urine Protein & Clearance", category: "Urine/Stool" },
  { value: "Stool Analysis (Routine)", ar: "تحليل البراز العادي المجهري (Stool)", en: "Stool Analysis (Routine)", category: "Urine/Stool" },
  { value: "Occult Blood in Stool (FOBT)", ar: "الدم الخفي في البراز (FOBT)", en: "Occult Blood in Stool (FOBT)", category: "Urine/Stool" },
  { value: "H. Pylori Stool Antigen Test", ar: "جرثومة المعدة في البراز (H. Pylori)", en: "H. Pylori Stool Antigen Test", category: "Urine/Stool" },

  // Gases
  { value: "Arterial Blood Gas (ABG)", ar: "غازات الدم الشرياني (ABG)", en: "Arterial Blood Gas (ABG)", category: "Gases" },
  { value: "Venous Blood Gas (VBG)", ar: "غازات الدم الوريدي (VBG)", en: "Venous Blood Gas (VBG)", category: "Gases" },
];

export const RAD_CATALOG: CatalogItem[] = [
  // X-Rays
  { value: "Bedside Chest X-Ray (STAT)", ar: "أشعة سينية على الصدر بالسرير (عاجل)", en: "Bedside Chest X-Ray (STAT)", category: "X-Ray" },
  { value: "Chest X-Ray PA/Lateral View", ar: "أشعة سينية على الصدر أمامي جانبي", en: "Chest X-Ray PA/Lateral View", category: "X-Ray" },
  { value: "KUB Plain X-Ray (Kidneys, Ureters, Bladder)", ar: "أشعة سينية عادية على المسالك البولية KUB", en: "KUB Plain X-Ray", category: "X-Ray" },
  { value: "Lumbar Spine X-Ray AP/Lateral", ar: "أشعة سينية على الفقرات القطنية", en: "Lumbar Spine X-Ray AP/Lateral", category: "X-Ray" },
  { value: "Cervical Spine X-Ray AP/Lateral", ar: "أشعة سينية على الفقرات العنقية", en: "Cervical Spine X-Ray AP/Lateral", category: "X-Ray" },
  { value: "Pelvis AP Plain X-Ray", ar: "أشعة سينية عادية على الحوض والمفاصل", en: "Pelvis AP Plain X-Ray", category: "X-Ray" },
  { value: "Knee Joint Plain X-Ray AP/Lateral", ar: "أشعة سينية عادية على مفصل الركبة", en: "Knee Joint Plain X-Ray AP/Lateral", category: "X-Ray" },
  { value: "Shoulder Joint Plain X-Ray AP/Lateral", ar: "أشعة سينية عادية على مفصل الكتف", en: "Shoulder Joint Plain X-Ray AP/Lateral", category: "X-Ray" },

  // Ultrasound
  { value: "FAST Ultrasound (Trauma)", ar: "أشعة تليفزيونية سريعة للإصابات والنزيف (FAST)", en: "FAST Ultrasound (Trauma)", category: "Ultrasound" },
  { value: "Ultrasound Abdomen & Pelvis (Complete)", ar: "أشعة تليفزيونية للبطن والحوض كاملة (سونار)", en: "Ultrasound Abdomen & Pelvis", category: "Ultrasound" },
  { value: "Ultrasound Abdomen (Upper)", ar: "أشعة تليفزيونية لأعضاء البطن العلوية", en: "Ultrasound Abdomen (Upper)", category: "Ultrasound" },
  { value: "Ultrasound Pelvis (Transabdominal)", ar: "أشعة تليفزيونية للحوض والمثانة", en: "Ultrasound Pelvis (Transabdominal)", category: "Ultrasound" },
  { value: "Ultrasound Thyroid and Neck", ar: "أشعة تليفزيونية على الغدة الدرقية والرقبة", en: "Ultrasound Thyroid and Neck", category: "Ultrasound" },
  { value: "Ultrasound Breast (Bilateral)", ar: "أشعة تليفزيونية على الثديين", en: "Ultrasound Breast (Bilateral)", category: "Ultrasound" },
  { value: "Ultrasound Scrotum & Testes", ar: "أشعة تليفزيونية ودوبلر على الخصيتين", en: "Ultrasound Scrotum & Testes", category: "Ultrasound" },
  { value: "Carotid Doppler Duplex Study", ar: "دوبلر ملون على شرايين الرقبة السباتية", en: "Carotid Doppler Duplex Study", category: "Ultrasound" },
  { value: "Venous Duplex Lower Extremity (DVT Rule-out)", ar: "دوبلر ملون لأوردة الساقين لاستبعاد الجلطة DVT", en: "Venous Duplex Lower Extremity", category: "Ultrasound" },
  { value: "Arterial Duplex Lower Extremity", ar: "دوبلر ملون لشرايين الأطراف السفلية", en: "Arterial Duplex Lower Extremity", category: "Ultrasound" },
  { value: "Obstetric Ultrasound (Fetal Evaluation)", ar: "أشعة تليفزيونية لمتابعة الحمل والتقييم الحيوي للجنين", en: "Obstetric Ultrasound", category: "Ultrasound" },

  // CT Scans
  { value: "CT Brain (Stroke Protocol)", ar: "أشعة مقطعية للمخ عاجل (بروتوكول الجلطة السريعة)", en: "CT Brain (Stroke Protocol)", category: "CT" },
  { value: "CT Brain without Contrast", ar: "أشعة مقطعية على المخ بدون صبغة", en: "CT Brain without Contrast", category: "CT" },
  { value: "CT Brain with Contrast", ar: "أشعة مقطعية على المخ بالصبغة", en: "CT Brain with Contrast", category: "CT" },
  { value: "CT Chest without Contrast", ar: "أشعة مقطعية على الصدر بدون صبغة (HRCT)", en: "CT Chest without Contrast", category: "CT" },
  { value: "CT Chest with Contrast", ar: "أشعة مقطعية على الصدر بالصبغة الوريدية", en: "CT Chest with Contrast", category: "CT" },
  { value: "CT Abdomen & Pelvis with Contrast", ar: "أشعة مقطعية على البطن والحوض بالصبغة الثلاثية", en: "CT Abdomen & Pelvis with Contrast", category: "CT" },
  { value: "CT Abdomen & Pelvis without Contrast", ar: "أشعة مقطعية على البطن والحوض بدون صبغة", en: "CT Abdomen & Pelvis without Contrast", category: "CT" },
  { value: "CT Pulmonary Angiography (PE Protocol)", ar: "أشعة مقطعية لشرايين الرئة لاستبعاد الجلطة الرئوية", en: "CT Pulmonary Angiography", category: "CT" },
  { value: "CT Coronary Angiography", ar: "أشعة مقطعية لشرايين القلب والتاجية", en: "CT Coronary Angiography", category: "CT" },
  { value: "CT Spine (Cervical/Lumbar)", ar: "أشعة مقطعية للعمود الفقري مع مراجعة الفقرات", en: "CT Spine (Cervical/Lumbar)", category: "CT" },
  { value: "CT Paranasal Sinuses (PNS)", ar: "أشعة مقطعية للجيوب الأنفية والوجه", en: "CT Paranasal Sinuses (PNS)", category: "CT" },

  // MRI Scans
  { value: "MRI Brain without Contrast", ar: "رنين مغناطيسي للمخ والجمجمة بدون صبغة", en: "MRI Brain without Contrast", category: "MRI" },
  { value: "MRI Brain with Contrast", ar: "رنين مغناطيسي للمخ والجمجمة بالصبغة", en: "MRI Brain with Contrast", category: "MRI" },
  { value: "MRI Lumbar Spine AP/Lateral", ar: "رنين مغناطيسي للعمود الفقري القطني العجزي", en: "MRI Lumbar Spine", category: "MRI" },
  { value: "MRI Cervical Spine AP/Lateral", ar: "رنين مغناطيسي للفقرات العنقية للحبل الشوكي", en: "MRI Cervical Spine", category: "MRI" },
  { value: "MRI Knee Joint AP/Lateral", ar: "رنين مغناطيسي لمفصل الركبة (الأربطة والغضاريف)", en: "MRI Knee Joint", category: "MRI" },
  { value: "MRI Shoulder Joint AP/Lateral", ar: "رنين مغناطيسي لمفصل الكتف الكفة المدورة", en: "MRI Shoulder Joint", category: "MRI" },
  { value: "Magnetic Resonance Cholangiopancreatography (MRCP)", ar: "تصوير رنين مغناطيسي للقنوات المرارية والبنكرياسية", en: "MRCP", category: "MRI" },
  { value: "MRA Brain (Angiography)", ar: "تصوير رنين مغناطيسي لشرايين المخ المغذية دون صبغة", en: "MRA Brain (Angiography)", category: "MRI" },

  // Specialized
  { value: "Mammography Screening (Bilateral)", ar: "أشعة ماموجرام للثديين للكشف المبكر", en: "Mammography Screening", category: "Specialized" },
  { value: "DXA Bone Mineral Densitometry (BMD)", ar: "أشعة قياس كثافة العظام وهشاشتها (دكسا)", en: "DXA Bone Densitometry", category: "Specialized" },
  { value: "PET/CT Whole Body (Oncology Evaluation)", ar: "أشعة مقطعية بإصدار البوزيترون لكامل الجسم (تتبع الأورام)", en: "PET/CT Whole Body", category: "Specialized" },
];

export const PROC_CATALOG: CatalogItem[] = [
  // Cardiology
  { value: "ECG 12-Lead", ar: "رسم قلب كهربائي 12 قناة (ECG)", en: "ECG 12-Lead", category: "Cardiology" },
  { value: "Transthoracic Echocardiography (TTE)", ar: "أشعة تليفزيونية للقلب (إيكو TTE)", en: "Echocardiography (TTE)", category: "Cardiology" },
  { value: "Stress ECG (Treadmill Test)", ar: "رسم قلب بالمجهود المشاية الكهربائية", en: "Stress ECG (Treadmill Test)", category: "Cardiology" },
  { value: "Holter Monitor 24-Hour (ECG Recording)", ar: "تسجيل ضربات القلب هولتر لمدة 24 ساعة", en: "Holter Monitor 24-Hour", category: "Cardiology" },

  // Airway & Pulmonary
  { value: "Endotracheal Intubation", ar: "تركيب الأنبوب الرغامي ومجرى التنفس عاجل", en: "Endotracheal Intubation", category: "Pulmonary" },
  { value: "Mechanical Ventilation Setup & Initiation", ar: "توصيل المريض وتجهيز جهاز التنفس الصناعي", en: "Mechanical Ventilation Initiation", category: "Pulmonary" },
  { value: "Nebulizer Therapy (Salbutamol/Atrovent)", ar: "جلسة استنشاق بخار موسع للشعب الهوائية", en: "Nebulizer Therapy", category: "Pulmonary" },
  { value: "Oxygen Therapy Administration", ar: "توصيل الأوكسجين العلاجي (أنفي/قناع)", en: "Oxygen Therapy Administration", category: "Pulmonary" },
  { value: "High-Flow Nasal Cannula (HFNC) Setup", ar: "تجهيز جهاز ضخ الأوكسجين عالي التدفق (HFNC)", en: "High-Flow Nasal Cannula Setup", category: "Pulmonary" },
  { value: "Pleural Tap / Thoracentesis (Bedside)", ar: "بزل السائل البلوري من الرئة بالسرير", en: "Pleural Tap / Thoracentesis", category: "Pulmonary" },

  // Vascular & Access
  { value: "Central Venous Line Insertion (CV Line)", ar: "تركيب قسطرة وريدية مركزية (CV Line)", en: "Central Venous Line Insertion", category: "Vascular" },
  { value: "Arterial Line Insertion", ar: "تركيب قسطرة شريانية للضغط وغازات الدم", en: "Arterial Line Insertion", category: "Vascular" },
  { value: "PICC Line Placement (Peripherally Inserted)", ar: "تركيب قسطرة وريدية مركزية طرفية PICC", en: "PICC Line Placement", category: "Vascular" },
  { value: "Peripheral IV Line Insertion", ar: "تركيب كانيولا وريدية طرفية", en: "Peripheral IV Line Insertion", category: "Vascular" },

  // General & Nursing Care
  { value: "Urinary Catheterization (Foley Catheter)", ar: "تركيب قسطرة بولية فولي (foley catheter)", en: "Urinary Catheterization", category: "Nursing" },
  { value: "Nasogastric Tube (NGT) Insertion", ar: "تركيب أنبوب تغذية عن طريق الأنف (رايل NGT)", en: "Nasogastric Tube Insertion", category: "Nursing" },
  { value: "Surgical Wound Dressing (Complex)", ar: "غيار معقم على جرح جراحي كبير معقد", en: "Surgical Wound Dressing (Complex)", category: "Nursing" },
  { value: "Simple Dressing Change & Suture Removal", ar: "غيار بسيط وفك الغرز الجراحية", en: "Simple Dressing Change & Suture Removal", category: "Nursing" },
  { value: "Blood & Blood Product Transfusion (STAT)", ar: "إعطاء ونقل الدم ومشتقاته مع المتابعة", en: "Blood & Product Transfusion", category: "Nursing" },
  { value: "Pressure Injury Care & Stage Dressing", ar: "العناية بقرح الفراش والغيار الطبي عليها", en: "Pressure Injury Care", category: "Nursing" },
  { value: "Bladder Irrigation (Continuous)", ar: "غسيل مستمر للمثانة البولية", en: "Bladder Irrigation (Continuous)", category: "Nursing" },

  // Gastro & Neuro
  { value: "Upper Gastrointestinal Endoscopy (EGD)", ar: "منظار هضمي علوي للمعدة والاثني عشر", en: "Upper GI Endoscopy (EGD)", category: "Gastro" },
  { value: "Colonoscopy (Diagnostic & Biopsy)", ar: "منظار القولون التشخيصي وأخذ العينات", en: "Colonoscopy", category: "Gastro" },
  { value: "Paracentesis (Abdominal Tap)", ar: "بزل البطن الطبي لسحب السوائل بالسرير", en: "Paracentesis (Abdominal Tap)", category: "Gastro" },
  { value: "Diagnostic Lumbar Puncture (LP)", ar: "بزل السائل النخاعي التشخيصي (LP)", en: "Diagnostic Lumbar Puncture", category: "Neuro" },

  // Consultations & Specialties
  { value: "Consultation: Cardiology Specialty", ar: "طلب استشارة طبيب أمراض القلب", en: "Consultation: Cardiology", category: "Consultation" },
  { value: "Consultation: Intensive Care Unit (ICU)", ar: "طلب استشارة طبيب العناية المركزة", en: "Consultation: ICU", category: "Consultation" },
  { value: "Consultation: General Surgery", ar: "طلب استشارة طبيب الجراحة العامة", en: "Consultation: General Surgery", category: "Consultation" },
  { value: "Consultation: Nephrology & Dialysis", ar: "طلب استشارة طبيب الكلى وأمراضها", en: "Consultation: Nephrology", category: "Consultation" },
  { value: "Consultation: Infectious Diseases", ar: "طلب استشارة طبيب الأمراض المعدية", en: "Consultation: Infectious Diseases", category: "Consultation" },
  { value: "Consultation: Endocrinology & Diabetes", ar: "طلب استشارة طبيب الغدد الصماء والسكر", en: "Consultation: Endocrinology", category: "Consultation" },
  { value: "Consultation: Neurology Department", ar: "طلب استشارة طبيب أمراض المخ والأعصاب", en: "Consultation: Neurology", category: "Consultation" },

  // Rehab & Services
  { value: "Physical Therapy: Orthopedic Session", ar: "جلسة علاج طبيعي لتأهيل العظام والمفاصل", en: "Physical Therapy: Orthopedic", category: "Rehabilitation" },
  { value: "Physical Therapy: Chest & Airway Clearance", ar: "جلسة علاج طبيعي لتنظيف الصدر والرئتين", en: "Physical Therapy: Chest", category: "Rehabilitation" },
  { value: "Acute Hemodialysis Session (ICU/Ward)", ar: "جلسة غسيل كلوي دموي طارئ", en: "Acute Hemodialysis Session", category: "Rehabilitation" },
  { value: "Clinical Nutrition Diet Setup", ar: "تحديد الوجبة وطلب تعديل التغذية العلاجية", en: "Clinical Nutrition Setup", category: "Rehabilitation" },
];

export const MED_CATALOG: CatalogItem[] = [
  // Cardiovascular & Hypertension
  { value: "Aspirin 81 mg", ar: "أسبرين أطفال 81 ملغ (Aspirin)", en: "Aspirin 81 mg", category: "Cardiovascular", defaultDose: "81 mg", defaultSig: "1 Tab - Once Daily - After Breakfast", defaultSigAr: "قرص واحد يومياً بعد الإفطار", defaultQty: 30 },
  { value: "Aspirin 100 mg", ar: "أسبرين حماية 100 ملغ (Aspirin)", en: "Aspirin 100 mg", category: "Cardiovascular", defaultDose: "100 mg", defaultSig: "1 Tab - Once Daily - After Breakfast", defaultSigAr: "قرص واحد يومياً بعد الإفطار", defaultQty: 30 },
  { value: "Clopidogrel 75 mg", ar: "بلا فيكس 75 ملغ (Plavix)", en: "Clopidogrel 75 mg", category: "Cardiovascular", defaultDose: "75 mg", defaultSig: "1 Tab - Once Daily - With Water", defaultSigAr: "قرص واحد يومياً مع كوب ماء", defaultQty: 28 },
  { value: "Atorvastatin 20 mg", ar: "ليپيتور 20 ملغ لخفض الكوليسترول (Lipitor)", en: "Atorvastatin 20 mg", category: "Cardiovascular", defaultDose: "20 mg", defaultSig: "1 Tab - Once Daily - At Bedtime", defaultSigAr: "قرص واحد يومياً مساءً قبل النوم", defaultQty: 30 },
  { value: "Atorvastatin 40 mg", ar: "ليپيتور 40 ملغ عالي القوة (Lipitor)", en: "Atorvastatin 40 mg", category: "Cardiovascular", defaultDose: "40 mg", defaultSig: "1 Tab - Once Daily - At Bedtime", defaultSigAr: "قرص واحد يومياً مساءً قبل النوم", defaultQty: 30 },
  { value: "Rosuvastatin 10 mg", ar: "كريستور 10 ملغ (Crestor)", en: "Rosuvastatin 10 mg", category: "Cardiovascular", defaultDose: "10 mg", defaultSig: "1 Tab - Once Daily - At Bedtime", defaultSigAr: "قرص واحد يومياً مساءً قبل النوم", defaultQty: 28 },
  { value: "Rosuvastatin 20 mg", ar: "كريستور 20 ملغ (Crestor)", en: "Rosuvastatin 20 mg", category: "Cardiovascular", defaultDose: "20 mg", defaultSig: "1 Tab - Once Daily - At Bedtime", defaultSigAr: "قرص واحد يومياً مساءً قبل النوم", defaultQty: 28 },
  { value: "Amlodipine 5 mg", ar: "نورفاسك 5 ملغ لضغط الدم (Norvasc)", en: "Amlodipine 5 mg", category: "Cardiovascular", defaultDose: "5 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 30 },
  { value: "Amlodipine 10 mg", ar: "نورفاسك 10 ملغ لعلاج الضغط (Norvasc)", en: "Amlodipine 10 mg", category: "Cardiovascular", defaultDose: "10 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 30 },
  { value: "Lisinopril 10 mg", ar: "زيستريل 10 ملغ للضغط والقلب (Zestril)", en: "Lisinopril 10 mg", category: "Cardiovascular", defaultDose: "10 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 30 },
  { value: "Lisinopril 20 mg", ar: "زيستريل 20 ملغ لعلاج الضغط (Zestril)", en: "Lisinopril 20 mg", category: "Cardiovascular", defaultDose: "20 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 30 },
  { value: "Valsartan 80 mg", ar: "ديوفان 80 ملغ لحماية القلب (Diovan)", en: "Valsartan 80 mg", category: "Cardiovascular", defaultDose: "80 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 28 },
  { value: "Valsartan 160 mg", ar: "ديوفان 160 ملغ خافض ضغط (Diovan)", en: "Valsartan 160 mg", category: "Cardiovascular", defaultDose: "160 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 28 },
  { value: "Bisoprolol 5 mg", ar: "كونكور 5 ملغ لتنظيم النبض والضغط (Concor)", en: "Bisoprolol 5 mg", category: "Cardiovascular", defaultDose: "5 mg", defaultSig: "1 Tab - Once Daily - Before Breakfast", defaultSigAr: "قرص واحد يومياً صباحاً قبل الفطور", defaultQty: 30 },
  { value: "Bisoprolol 2.5 mg", ar: "كونكور 2.5 ملغ (Concor)", en: "Bisoprolol 2.5 mg", category: "Cardiovascular", defaultDose: "2.5 mg", defaultSig: "1 Tab - Once Daily - Before Breakfast", defaultSigAr: "قرص واحد يومياً صباحاً قبل الفطور", defaultQty: 30 },
  { value: "Furosemide 40 mg", ar: "لازيكس 40 ملغ مدر للبول (Lasix)", en: "Furosemide 40 mg", category: "Cardiovascular", defaultDose: "40 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً مبكراً", defaultQty: 30 },
  { value: "Furosemide 20mg IV Injection", ar: "أمبول لازيكس 20 ملغ وريدي (Lasix STAT)", en: "Furosemide 20mg IV Injection", category: "Cardiovascular", defaultDose: "20 mg IV", defaultSig: "Once STAT slowly", defaultSigAr: "حقنة وريدية عاجلة ببطء", defaultQty: 1 },
  { value: "Enoxaparin 40 mg SC Injection", ar: "حقنة كليكسان 40 ملغ مضاد للجلطة (Clexane)", en: "Enoxaparin 40 mg SC Injection", category: "Anticoagulants", defaultDose: "40 mg SC", defaultSig: "Once daily subcutaneous injection", defaultSigAr: "حقنة واحدة تحت الجلد يومياً", defaultQty: 7 },
  { value: "Enoxaparin 60 mg SC Injection", ar: "حقنة كليكسان 60 ملغ للسيولة (Clexane)", en: "Enoxaparin 60 mg SC Injection", category: "Anticoagulants", defaultDose: "60 mg SC", defaultSig: "Once daily subcutaneous injection", defaultSigAr: "حقنة واحدة تحت الجلد يومياً", defaultQty: 7 },
  { value: "Heparin Sodium 5000 IU Injection", ar: "هيبارين صوديوم 5000 وحدة دولية", en: "Heparin Sodium 5000 IU Injection", category: "Anticoagulants", defaultDose: "5000 IU IV", defaultSig: "Every 12 hours as IV bolus", defaultSigAr: "حقنة وريدية كل 12 ساعة", defaultQty: 2 },
  { value: "Apixaban 5 mg", ar: "إليكويس 5 ملغ حبوب سيولة (Eliquis)", en: "Apixaban 5 mg", category: "Anticoagulants", defaultDose: "5 mg", defaultSig: "1 Tab - Twice Daily - With or Without Food", defaultSigAr: "قرص واحد كل 12 ساعة مع أو بدون طعام", defaultQty: 56 },
  { value: "Rivaroxaban 15 mg", ar: "إكساريلتو 15 ملغ للسيولة (Xarelto)", en: "Rivaroxaban 15 mg", category: "Anticoagulants", defaultDose: "15 mg", defaultSig: "1 Tab - Once Daily - With Food", defaultSigAr: "قرص واحد يومياً مع وجبة الطعام الرئيسية", defaultQty: 28 },

  // Diabetes
  { value: "Metformin 500 mg", ar: "جلوكوفاج 500 ملغ منظم السكر (Glucophage)", en: "Metformin 500 mg", category: "Diabetes", defaultDose: "500 mg", defaultSig: "1 Tab - Twice Daily - With Meals", defaultSigAr: "قرص مرتين يومياً مع الأكل", defaultQty: 60 },
  { value: "Metformin 1000 mg (XR)", ar: "جلوكوفاج 1000 ملغ طويل المفعول (Glucophage XR)", en: "Metformin 1000 mg", category: "Diabetes", defaultDose: "1000 mg", defaultSig: "1 Tab - Once Daily - With Dinner", defaultSigAr: "قرص واحد يومياً مع العشاء", defaultQty: 30 },
  { value: "Sitagliptin 100 mg", ar: "جانيوفيا 100 ملغ لعلاج السكري (Januvia)", en: "Sitagliptin 100 mg", category: "Diabetes", defaultDose: "100 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 28 },
  { value: "Empagliflozin 10 mg", ar: "جاردينس 10 ملغ لحماية القلب والكلى (Jardiance)", en: "Empagliflozin 10 mg", category: "Diabetes", defaultDose: "10 mg", defaultSig: "1 Tab - Once Daily - In the Morning", defaultSigAr: "قرص واحد يومياً صباحاً", defaultQty: 30 },
  { value: "Insulin Glargine 100 U/ml SC", ar: "قلم أنسولين لانتوس المائي طويل المفعول (Lantos)", en: "Insulin Glargine 100 U/ml SC", category: "Diabetes", defaultDose: "20 Units SC", defaultSig: "Once daily at bedtime (9:00 PM)", defaultSigAr: "حقن 20 وحدة تحت الجلد يومياً الساعة 9 مساءً", defaultQty: 1 },
  { value: "Insulin Aspart (NovoRapid) SC", ar: "قلم أنسولين نوفورابيد سريع المفعول (NovoRapid)", en: "Insulin Aspart (NovoRapid) SC", category: "Diabetes", defaultDose: "8 Units SC", defaultSig: "Three times daily before main meals", defaultSigAr: "حقن 8 وحدات تحت الجلد قبل الوجبات الثلاث بـ 15 دقيقة", defaultQty: 1 },

  // Antibiotics & Infectious
  { value: "Amoxicillin/Clavulanate 1 g", ar: "أوجمنتين 1 غرام مضاد حيوي (Augmentin)", en: "Amoxicillin/Clavulanate 1 g", category: "Antibiotics", defaultDose: "1 g", defaultSig: "1 Tab - Every 12 Hours - After Meals", defaultSigAr: "قرص واحد كل 12 ساعة بعد الأكل لمدة 7 أيام", defaultQty: 14 },
  { value: "Azithromycin 500 mg", ar: "زيزروماكس 500 ملغ (Zithromax)", en: "Azithromycin 500 mg", category: "Antibiotics", defaultDose: "500 mg", defaultSig: "1 Tab - Once Daily - 1h Before or 2h After Meal", defaultSigAr: "قرص واحد يومياً على معدة فارغة لمدة 3 أيام", defaultQty: 3 },
  { value: "Ceftriaxone 1 g IV", ar: "حقنة سيف ترياكسون 1 غرام وريدي عاجل", en: "Ceftriaxone 1 g IV", category: "Antibiotics", defaultDose: "1 g IV", defaultSig: "Once daily after skin sensitivity test", defaultSigAr: "حقنة وريدية واحدة يومياً بعد فحص الحساسية", defaultQty: 5 },
  { value: "Ciprofloxacin 500 mg", ar: "سيبرو 500 ملغ للمسالك البولية (Cipro)", en: "Ciprofloxacin 500 mg", category: "Antibiotics", defaultDose: "500 mg", defaultSig: "1 Tab - Every 12 Hours - With water", defaultSigAr: "قرص واحد كل 12 ساعة مع كوب ماء", defaultQty: 10 },
  { value: "Metronidazole 500 mg", ar: "فلاجيل 500 ملغ مطهر معوي ومضاد (Flagyl)", en: "Metronidazole 500 mg", category: "Antibiotics", defaultDose: "500 mg", defaultSig: "1 Tab - Every 8 Hours - After Meals", defaultSigAr: "قرص واحد كل 8 ساعات بعد الأكل لمدة 7 أيام", defaultQty: 21 },
  { value: "Meropenem 1 g IV", ar: "ميرونيم 1 غرام حقنة عضل/وريد (Meronem)", en: "Meropenem 1 g IV", category: "Antibiotics", defaultDose: "1 g IV", defaultSig: "Every 8 hours by slow IV infusion", defaultSigAr: "حقنة وريدية بطيئة كل 8 ساعات لمجرى الدم", defaultQty: 9 },

  // Gastrointestinal
  { value: "Pantoprazole 40 mg", ar: "كونترولوك 40 ملغ لحماية المعدة (Controloc)", en: "Pantoprazole 40 mg", category: "Gastrointestinal", defaultDose: "40 mg", defaultSig: "1 Tab - Once Daily - 30 min Before Breakfast", defaultSigAr: "قرص واحد يومياً قبل الإفطار بنصف ساعة", defaultQty: 28 },
  { value: "Esomeprazole 40 mg", ar: "نيكسيوم 40 ملغ لعلاج الارتجاع (Nexium)", en: "Esomeprazole 40 mg", category: "Gastrointestinal", defaultDose: "40 mg", defaultSig: "1 Tab - Once Daily - 30 min Before Breakfast", defaultSigAr: "قرص واحد يومياً قبل الإفطار بنصف ساعة", defaultQty: 28 },
  { value: "Hyoscine Butylbromide 10 mg", ar: "بوسكوبان 10 ملغ للمغص والتقلصات (Buscopan)", en: "Hyoscine Butylbromide 10 mg", category: "Gastrointestinal", defaultDose: "10 mg", defaultSig: "1-2 Tabs - Every 8 Hours - When needed for spasm", defaultSigAr: "قرص أو قرصين عند اللزوم كل 8 ساعات للمغص", defaultQty: 20 },
  { value: "Ondansetron 4 mg (e.g. Zofran)", ar: "زوفران 4 ملغ لمنع الغثيان والاستفراغ (Zofran)", en: "Ondansetron 4 mg", category: "Gastrointestinal", defaultDose: "4 mg", defaultSig: "1 Tab - Every 8 Hours - 30 mins before food", defaultSigAr: "قرص واحد كل 8 ساعات للغثيان والاستفراغ", defaultQty: 10 },
  { value: "Lactulose Syrup", ar: "شراب لاكتولوز لعلاج الإمساك (Lactulose)", en: "Lactulose Syrup", category: "Gastrointestinal", defaultDose: "15 ml", defaultSig: "15 ml - Once or Twice Daily - Oral", defaultSigAr: "15 مل معلقة كبيرة مرتين يومياً للإمساك", defaultQty: 1 },

  // Analgesics & Pain & Anti-inflammatory
  { value: "Paracetamol 500 mg", ar: "بانادول 500 ملغ مسكن آمن (Panadol)", en: "Paracetamol 500 mg", category: "Analgesics", defaultDose: "500 mg", defaultSig: "1-2 Tabs - Every 6 Hours - As needed for Pain/Fever", defaultSigAr: "قرص أو قرصين عند اللزوم كل 6 ساعات للحرارة أو الألم", defaultQty: 24 },
  { value: "Paracetamol 1 g IV Infusion", ar: "فيفادول 1 غرام محلول وريدي مسكن خافض حرارة", en: "Paracetamol 1 g IV Infusion", category: "Analgesics", defaultDose: "1 g IV", defaultSig: "Every 6 hours IV infusion over 15 mins STAT", defaultSigAr: "محلول وريدي كل 6 ساعات عند اللزوم", defaultQty: 5 },
  { value: "Ibuprofen 400 mg", ar: "بروفين 400 ملغ مضاد للالتهاب ومسكن (Brufen)", en: "Ibuprofen 400 mg", category: "Analgesics", defaultDose: "400 mg", defaultSig: "1 Tab - Every 8 Hours - Strictly After Meals", defaultSigAr: "قرص واحد كل 8 ساعات بعد الأكل مباشرة لمنع قرحة المعدة", defaultQty: 20 },
  { value: "Diclofenac Sodium 75 mg IM Injection", ar: "أمبول فولتارين 75 ملغ حقن عضل مسكن للألم", en: "Diclofenac Sodium 75 mg IM", category: "Analgesics", defaultDose: "75 mg IM", defaultSig: "Once daily deep IM injection for acute pain", defaultSigAr: "حقنة عضلية واحدة عند اللزوم للألم الحاد", defaultQty: 3 },
  { value: "Tramadol 50 mg", ar: "ترامادول 50 ملغ مسكن مركزي قوي (Tramadol)", en: "Tramadol 50 mg", category: "Analgesics", defaultDose: "50 mg", defaultSig: "1 Tab - Every 12 Hours - For severe pain as instructed", defaultSigAr: "قرص واحد كل 12 ساعة للألم الشديد تحت إشراف طبي", defaultQty: 10 },

  // Respiratory & Steroids & Allergy
  { value: "Ventolin Inhaler 100 mcg", ar: "بخاخ فنتولين الأزرق الموسع للشعب (Ventolin)", en: "Ventolin Inhaler 100 mcg", category: "Respiratory", defaultDose: "2 Puffs", defaultSig: "2 Puffs - Every 4-6 Hours - As needed for shortness", defaultSigAr: "بختين بالفم عند اللزوم وضيق التنفس كل 4 ساعات", defaultQty: 1 },
  { value: "Symbicort Inhaler 160/4.5 mcg", ar: "بخاخ سمبيكورت الوقائي والعلاجي (Symbicort)", en: "Symbicort Inhaler 160/4.5 mcg", category: "Respiratory", defaultDose: "160 mcg", defaultSig: "2 Puffs - Twice Daily - Mouth wash after use", defaultSigAr: "بختين بالفم مرتين يومياً مع غسل الفم جيداً بالماء", defaultQty: 1 },
  { value: "Prednisolone 5 mg", ar: "بريدنيزولون 5 ملغ حبوب كورتيزون", en: "Prednisolone 5 mg", category: "Steroids", defaultDose: "5 mg", defaultSig: "4 Tabs - Once Daily - In the morning with breakfast", defaultSigAr: "أربعة أقراص (20 ملغ) صباحاً مع وجبة الفطور", defaultQty: 30 },
  { value: "Dexamethasone 4 mg/ml IV/IM", ar: "ديكساميثازون أمبول 4 ملغ كورتيزون سريع", en: "Dexamethasone 4 mg/ml IV/IM", category: "Steroids", defaultDose: "4 mg IV/IM", defaultSig: "Once daily STAT slowly", defaultSigAr: "حقنة وريدية أو عضلية واحدة يومياً ببطء", defaultQty: 5 },
  { value: "Cetirizine 10 mg", ar: "زيرتيك 10 ملغ مضاد حساسية وحكة (Zyrtec)", en: "Cetirizine 10 mg", category: "Allergy", defaultDose: "10 mg", defaultSig: "1 Tab - Once Daily - At bedtime (non-sedating)", defaultSigAr: "قرص واحد يومياً مساءً قبل النوم للحساسية", defaultQty: 20 },
];
