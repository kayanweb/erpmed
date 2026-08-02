export interface RegistrationField {
  key: string;
  labelAr: string;
  labelEn: string;
  type: "text" | "number" | "date" | "select";
  required: boolean;
  enabled: boolean;
  options?: string[];
  colSpan?: number; // columns layout span (e.g. 1, 2, 3 or 4)
  section: "personal" | "contact" | "relative" | "payment" | "other" | "custom";
}

export const defaultRegistrationFields: RegistrationField[] = [
  { key: "mrn", labelAr: "رقم الملف الطبي MRN", labelEn: "MRN", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "enName1", labelAr: "الاسم الأول (إنجليزي)", labelEn: "English First Name", type: "text", required: true, enabled: true, colSpan: 1, section: "personal" },
  { key: "enName2", labelAr: "الاسم الثاني (إنجليزي)", labelEn: "English Second Name", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "enName3", labelAr: "الاسم الثالث (إنجليزي)", labelEn: "English Third Name", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "enName4", labelAr: "الاسم الرابع (إنجليزي)", labelEn: "English Fourth Name", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "arName1", labelAr: "الاسم الأول (عربي)", labelEn: "Arabic First Name", type: "text", required: true, enabled: true, colSpan: 1, section: "personal" },
  { key: "arName2", labelAr: "الاسم الثاني (عربي)", labelEn: "Arabic Second Name", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "arName3", labelAr: "الاسم الثالث (عربي)", labelEn: "Arabic Third Name", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "arName4", labelAr: "الاسم الرابع (عربي)", labelEn: "Arabic Fourth Name", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "sex", labelAr: "الجنس", labelEn: "Sex", type: "select", required: true, enabled: true, options: ["FEMALE", "MALE"], colSpan: 1, section: "personal" },
  { key: "dob", labelAr: "تاريخ الميلاد", labelEn: "D. OF BIRTH", type: "date", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "age", labelAr: "العمر", labelEn: "AGE", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "nationality", labelAr: "الجنسية", labelEn: "NATIONALITY", type: "select", required: false, enabled: true, options: ["EGYPTIAN", "SAUDI", "EMIRATI", "KUWAITI", "QATARI", "BAHRAINI", "OMANI", "SYRIAN", "JORDANIAN", "LEBANESE", "PALESTINIAN", "IRAQI", "YEMENI", "SUDANESE", "LIBYAN", "TUNISIAN", "ALGERIAN", "MOROCCAN", "AMERICAN", "BRITISH", "CANADIAN", "AUSTRALIAN", "FRENCH", "GERMAN", "ITALIAN", "SPANISH", "OTHER"], colSpan: 1, section: "personal" },
  { key: "governorate", labelAr: "المحافظة", labelEn: "GOVERNORATE", type: "select", required: false, enabled: true, options: ["Cairo", "Giza", "Alexandria", "Qalyubia", "Dakahlia", "Red Sea", "Beheira", "Fayoum", "Gharbia", "Ismailia", "Menofia", "Minya", "Qena", "Sohag", "Luxor", "Aswan", "Port Said", "Suez", "Sharqia", "South Sinai", "North Sinai", "Matrouh", "Beni Suef", "Kafr El Sheikh", "New Valley", "Assiut", "Damietta", "OTHER"], colSpan: 1, section: "contact" },
  { key: "city", labelAr: "المدينة", labelEn: "CITY", type: "select", required: false, enabled: true, options: ["Nasr City", "Maadi", "Heliopolis", "Dokki", "6th of October", "Sheikh Zayed", "New Cairo", "Rehab", "Madinaty", "Shorouk", "Obour", "Badr", "10th of Ramadan", "OTHER"], colSpan: 1, section: "contact" },
  { key: "idType", labelAr: "نوع الهوية", labelEn: "ID TYPE", type: "select", required: false, enabled: true, options: ["National ID", "Passport"], colSpan: 1, section: "personal" },
  { key: "idNo", labelAr: "رقم الهوية", labelEn: "ID NO.", type: "text", required: false, enabled: true, colSpan: 1, section: "personal" },
  { key: "phone", labelAr: "الهاتف", labelEn: "PHONE", type: "text", required: true, enabled: true, colSpan: 1, section: "contact" },
  { key: "mobile", labelAr: "الجوال", labelEn: "MOBILE", type: "text", required: false, enabled: true, colSpan: 1, section: "contact" },
  { key: "bPhone", labelAr: "هاتف العمل", labelEn: "B. PHONE", type: "text", required: false, enabled: true, colSpan: 1, section: "contact" },
  { key: "address", labelAr: "العنوان بالكامل", labelEn: "ADDRESS", type: "text", required: false, enabled: true, colSpan: 1, section: "contact" },
  { key: "relativeName", labelAr: "اسم القريب", labelEn: "Relative Name", type: "text", required: false, enabled: true, colSpan: 1, section: "relative" },
  { key: "relatives", labelAr: "صلة القرابة", labelEn: "RELATIVES", type: "select", required: false, enabled: true, options: ["Father", "Mother", "Spouse", "Child", "Brother", "Sister"], colSpan: 1, section: "relative" },
  { key: "relativePhone", labelAr: "هاتف القريب", labelEn: "Relative Phone", type: "text", required: false, enabled: true, colSpan: 1, section: "relative" },
  { key: "relativeAddress", labelAr: "عنوان القريب", labelEn: "Relative Address", type: "text", required: false, enabled: true, colSpan: 2, section: "relative" },
  { key: "category", labelAr: "فئة المريض", labelEn: "CATEGORY", type: "select", required: false, enabled: true, options: ["Cash", "Insurance", "Contractor"], colSpan: 1, section: "payment" },
  { key: "company", labelAr: "الشركة المتعاقدة", labelEn: "Company", type: "select", required: false, enabled: true, options: ["Bupa", "Tawuniya", "AXA", "MetLife", "Globemed"], colSpan: 1, section: "payment" },
  { key: "paymentType", labelAr: "طريقة الدفع", labelEn: "PAYMENT TYPE", type: "select", required: false, enabled: true, options: ["Cash", "Credit", "Insurance Approval"], colSpan: 1, section: "payment" },
  { key: "hPhone", labelAr: "الهاتف المنزلي", labelEn: "H. PHONE", type: "text", required: false, enabled: true, colSpan: 1, section: "contact" },
  { key: "religion", labelAr: "الديانة", labelEn: "RELIGION", type: "select", required: false, enabled: true, options: ["Islam", "Christianity", "Other"], colSpan: 1, section: "other" },
  { key: "country", labelAr: "الدولة", labelEn: "country", type: "select", required: false, enabled: true, options: ["Egypt", "Saudi Arabia", "UAE", "Jordan", "Other"], colSpan: 1, section: "contact" },
  { key: "area", labelAr: "المنطقة", labelEn: "Area", type: "select", required: false, enabled: true, options: ["Area 1", "Area 2", "Area 3"], colSpan: 1, section: "contact" },
  { key: "directedTo", labelAr: "موجه إلى", labelEn: "Directed To", type: "select", required: false, enabled: true, options: ["OPD", "ER", "Inpatient", "Daycare"], colSpan: 1, section: "other" },
  { key: "socialStatus", labelAr: "الحالة الاجتماعية", labelEn: "Social status", type: "select", required: false, enabled: true, options: ["Single", "Married", "Divorced", "Widowed"], colSpan: 1, section: "other" },
  { key: "baheyaSponsors", labelAr: "رعاة بهية", labelEn: "Baheya Sponsors", type: "select", required: false, enabled: true, options: ["Yes", "No"], colSpan: 1, section: "other" },
  { key: "bloodGroup", labelAr: "فصيلة الدم", labelEn: "Blood Group", type: "select", required: false, enabled: true, options: ["A+", "O+", "B+", "AB+", "A-", "O-", "B-", "AB-"], colSpan: 1, section: "other" },
  { key: "knowThrough", labelAr: "كيف عرفت الخدمات", labelEn: "How did you know us", type: "select", required: false, enabled: true, options: ["Social Media", "Friends", "TV", "Web Search", "Referral"], colSpan: 1, section: "other" },
  { key: "other", labelAr: "ملاحظات أخرى", labelEn: "Other Notes", type: "text", required: false, enabled: true, colSpan: 1, section: "other" }
];
