import React from "react";
import EnterpriseTaskManager from "./EnterpriseTaskManager";

export default function TasksDashboard({ language = "ar" }: { language?: "ar" | "en" }) {
  return <EnterpriseTaskManager language={language} />;
}
