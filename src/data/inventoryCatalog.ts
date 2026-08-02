
export interface InventoryItem {
  id: string;
  nameEn: string;
  nameAr: string;
  category: "Consumable" | "Drug" | "Surgical";
  stock: number;
  unit: string;
  price: number;
}

export const INVENTORY_CATALOG: InventoryItem[] = [
  { id: "INV-001", nameEn: "Syringe 5ml", nameAr: "سرنجة 5 مل", category: "Consumable", stock: 1500, unit: "Pcs", price: 5.50 },
  { id: "INV-002", nameEn: "Syringe 3ml", nameAr: "سرنجة 3 مل", category: "Consumable", stock: 2000, unit: "Pcs", price: 4.50 },
  { id: "INV-003", nameEn: "IV Cannula 20G (Pink)", nameAr: "كانيولا 20 ج وردي", category: "Consumable", stock: 450, unit: "Pcs", price: 25.00 },
  { id: "INV-004", nameEn: "IV Cannula 22G (Blue)", nameAr: "كانيولا 22 ج أزرق", category: "Consumable", stock: 600, unit: "Pcs", price: 25.00 },
  { id: "INV-005", nameEn: "Sterile Gauze 10x10", nameAr: "شاش معقم 10*10", category: "Consumable", stock: 1200, unit: "Pack", price: 15.00 },
  { id: "INV-006", nameEn: "Adhesive Bandage", nameAr: "بلاستر جروح", category: "Consumable", stock: 5000, unit: "Pcs", price: 1.50 },
  { id: "INV-007", nameEn: "Foley Catheter Fr16", nameAr: "قسطرة بول مقاس 16", category: "Consumable", stock: 85, unit: "Pcs", price: 75.00 },
  { id: "INV-008", nameEn: "Urine Bag 2000ml", nameAr: "كيس جمع بول 2000 مل", category: "Consumable", stock: 300, unit: "Pcs", price: 35.00 },
  { id: "INV-009", nameEn: "Face Mask (3-Ply)", nameAr: "كمامة طبية", category: "Consumable", stock: 10000, unit: "Box", price: 45.00 },
  { id: "INV-010", nameEn: "Surgical Gloves Size 7.5", nameAr: "قفازات جراحية مقاس 7.5", category: "Consumable", stock: 400, unit: "Pair", price: 12.00 },
];
