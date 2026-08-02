import { EntityShape, EntityType } from "../types";
import { toast } from "sonner";

export function resolveEntityClick(
  entity: EntityShape, 
  language: "ar" | "en",
  userRole?: string
) {
  if (!entity) return;
  const isAr = language === "ar";
  
  const displayName = entity.name || entity.id;
  
  // Centralized Smart Cross-Navigation Engine
  switch (entity.type) {
    case EntityType.PATIENT:
    case "patient":
    case "PATIENT":
      window.dispatchEvent(new CustomEvent("openPatientChart", { 
        detail: { patientId: entity.id, patientName: entity.name || displayName } 
      }));
      break;

    case EntityType.NOTIFICATION:
    case "notification":
      if (entity.context?.entity) {
        resolveEntityClick(entity.context.entity, language, userRole);
      } else {
        window.dispatchEvent(new CustomEvent("openGenericModal", {
          detail: {
            entityId: entity.id,
            entityName: displayName,
            type: "notification",
            titleAr: `إشعار: ${displayName}`,
            titleEn: `Notification: ${displayName}`
          }
        }));
      }
      break;

    default:
      // Dispatch openGenericModal for any entity type (Doctor, Case, Order, Lab, Radiology, Bed, Invoice, Medication, Task, Device, etc.)
      window.dispatchEvent(new CustomEvent("openGenericModal", {
        detail: {
          entityId: entity.id,
          entityName: displayName,
          entityNameAr: entity.name,
          type: String(entity.type).toLowerCase(),
          titleAr: `تفاصيل ${displayName}`,
          titleEn: `Details: ${displayName}`,
          context: entity.context
        }
      }));
      toast.info(isAr ? `جاري فتح تفاصيل: ${displayName}` : `Opening ${displayName} details...`);
      break;
  }
}

