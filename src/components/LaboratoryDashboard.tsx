import React from "react";
import LISComprehensiveDashboard from "./LISComprehensiveDashboard";

interface LaboratoryDashboardProps {
  language?: "ar" | "en";
  [key: string]: any;
}

const LaboratoryDashboard: React.FC<LaboratoryDashboardProps> = ({ language = "ar" }) => {
  return <LISComprehensiveDashboard language={language} />;
};

export default LaboratoryDashboard;
