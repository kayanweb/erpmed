import { subscribeToClinicalData, saveDataPermanently } from "./realTimeService";

export interface MasterDataItem {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  category?: string;
  type?: string;
}

const MASTER_DATA_COLLECTION = "hospital_master_data";

export async function addMasterDataItem(data: Omit<MasterDataItem, "id">) {
  const masterId = `md-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const newItem: MasterDataItem = {
    ...data,
    id: masterId
  };
  return await saveDataPermanently(MASTER_DATA_COLLECTION, newItem);
}

export function syncMasterData(type: string, onData: (items: MasterDataItem[]) => void) {
  return subscribeToClinicalData<MasterDataItem>(
    MASTER_DATA_COLLECTION,
    (items) => {
      let filtered = items.filter(item => !type || item.type === type);
      // Fallback to seeded data if empty
      if (filtered.length === 0) {
        if (type === "medication") filtered = SEEDED_MEDICATIONS;
        else if (type === "lab") filtered = SEEDED_LABS;
        else if (type === "radiology") filtered = SEEDED_RADS;
      }
      // Sort alphabetically
      const sorted = [...filtered].sort((a, b) => (a.nameEn || "").localeCompare(b.nameEn || ""));
      onData(sorted);
    },
    (err) => {
      console.warn("Master data sync error, using static fallback:", err);
      let fallback: MasterDataItem[] = [];
      if (type === "medication") fallback = SEEDED_MEDICATIONS;
      else if (type === "lab") fallback = SEEDED_LABS;
      else if (type === "radiology") fallback = SEEDED_RADS;
      onData(fallback);
    }
  );
}

// Pre-seeded local data for prototype if Firestore is empty
export const SEEDED_MEDICATIONS: MasterDataItem[] = [
  { id: "m1", code: "PARA-1G", nameAr: "باراسيتامول 1 جم", nameEn: "Paracetamol 1g", type: "medication" },
  { id: "m2", code: "AMOX-500", nameAr: "أموكسيسيلين 500 ملجم", nameEn: "Amoxicillin 500mg", type: "medication" },
  { id: "m3", code: "CEFT-2G", nameAr: "سيفترياكسون 2 جم", nameEn: "Ceftriaxone 2g", type: "medication" },
];

export const SEEDED_LABS: MasterDataItem[] = [
  { id: "l1", code: "CBC", nameAr: "صورة دم كاملة", nameEn: "Complete Blood Count (CBC)", type: "lab" },
  { id: "l2", code: "LFT", nameAr: "وظائف كبد", nameEn: "Liver Function Test (LFT)", type: "lab" },
  { id: "l3", code: "KFT", nameAr: "وظائف كلى", nameEn: "Kidney Function Test (KFT)", type: "lab" },
];

export const SEEDED_RADS: MasterDataItem[] = [
  { id: "r1", code: "XR-CHEST", nameAr: "أشعة صدر", nameEn: "X-Ray Chest PA/Lat", type: "radiology" },
  { id: "r2", code: "CT-BRAIN", nameAr: "أشعة مقطعية للمخ", nameEn: "CT Brain Without Contrast", type: "radiology" },
];
