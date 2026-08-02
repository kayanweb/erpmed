import React from "react";
import RISComprehensiveDashboard from "./RISComprehensiveDashboard";

interface RadiologyDashboardProps {
  language?: "ar" | "en";
  [key: string]: any;
}

const RadiologyDashboard: React.FC<RadiologyDashboardProps> = ({ language = "ar" }) => {
  return <RISComprehensiveDashboard language={language} />;
};

export default RadiologyDashboard;
