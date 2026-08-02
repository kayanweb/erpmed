import { format } from "date-fns";

export function safeFormatDate(
  dateVal: string | number | Date | null | undefined,
  formatStr: string = "HH:mm",
  fallback: string = "--:--"
): string {
  if (!dateVal) return fallback;

  // If dateVal is a simple time string like "09:00" or "14:30:00"
  if (typeof dateVal === "string") {
    const trimmed = dateVal.trim();
    if (/^\d{1,2}:\d{2}(:\d{2})?$/.test(trimmed)) {
      return trimmed.length > 5 ? trimmed.substring(0, 5) : trimmed;
    }
  }

  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) {
      return typeof dateVal === "string" ? dateVal : fallback;
    }
    return format(d, formatStr);
  } catch {
    return fallback;
  }
}
