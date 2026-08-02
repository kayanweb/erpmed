import React from "react";
import EnterpriseTaskManager from "./EnterpriseTaskManager";

interface TaskCenterProps {
  userRole?: string;
  userId?: string;
  language?: "ar" | "en";
  onTaskSelect?: (task: any) => void;
}

export const TaskCenter: React.FC<TaskCenterProps> = ({ language = "ar" }) => {
  return <EnterpriseTaskManager language={language} />;
};

export default TaskCenter;
