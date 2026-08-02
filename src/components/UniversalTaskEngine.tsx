import React from "react";
import EnterpriseTaskManager from "./EnterpriseTaskManager";

interface Props { language?: "ar" | "en"; onClose?: () => void; }

export default function UniversalTaskEngine({ language = "ar", onClose }: Props) {
  return <EnterpriseTaskManager language={language} onClose={onClose} />;
}
