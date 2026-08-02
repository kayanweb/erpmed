import React from "react";
import { Link } from "lucide-react";
import { resolveEntityClick } from "../lib/entityRouter";
import { EntityShape } from "../types";

export function GlobalEntityLink({ 
  entity,
  entityId, 
  entityName, 
  entityType, 
  isAr,
  className,
  language = "en",
  userRole,
  children
}: { 
  entity?: EntityShape;
  entityId?: string; 
  entityName?: string; 
  entityType?: string;
  isAr?: boolean;
  className?: string;
  language?: "ar" | "en";
  userRole?: string;
  children?: React.ReactNode;
}) {
  const isArabic = isAr !== undefined ? isAr : language === "ar";
  const lang = isArabic ? "ar" : "en";

  const resolvedEntity: EntityShape = entity || {
    type: entityType || "unknown",
    id: entityId || "unknown",
    name: entityName
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    resolveEntityClick(resolvedEntity, lang, userRole);
  };

  const displayName = resolvedEntity.name || resolvedEntity.id;

  return (
    <span 
      onClick={handleClick}
      className={`cursor-pointer hover:opacity-80 transition group inline-block ${className || 'font-bold text-indigo-600 hover:text-indigo-800'}`}
      title={isArabic ? `عرض تفاصيل ${displayName}` : `View ${displayName} Details`}
    >
      {children ? children : (
        <span className="inline-flex items-center gap-1">
          {displayName}
          <Link className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </span>
      )}
    </span>
  );
}


