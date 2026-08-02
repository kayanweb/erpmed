import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  User, 
  Activity, 
  Stethoscope, 
  FileText, 
  Beaker, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { PatientActivity } from "../types";
import { syncPatientTimeline } from "../lib/workflowService";
import { format } from "date-fns";
import { safeFormatDate } from "../lib/dateUtils";

interface PatientTimelineProps {
  workflowId: string;
}

export const PatientTimeline: React.FC<PatientTimelineProps> = ({ workflowId }) => {
  const [activities, setActivities] = useState<PatientActivity[]>([]);

  useEffect(() => {
    if (!workflowId) return;
    const unsubscribe = syncPatientTimeline(workflowId, (data) => {
      setActivities(data);
    });
    return () => unsubscribe();
  }, [workflowId]);

  const getIcon = (type: string) => {
    switch (type) {
      case "REGISTRATION": return <User className="w-4 h-4" />;
      case "TRANSITION": return <Activity className="w-4 h-4" />;
      case "ORDER": return <FileText className="w-4 h-4" />;
      case "RESULT": return <CheckCircle2 className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "REGISTRATION": return "bg-blue-100 text-blue-600 border-blue-200";
      case "TRANSITION": return "bg-purple-100 text-purple-600 border-purple-200";
      case "ORDER": return "bg-amber-100 text-amber-600 border-amber-200";
      case "RESULT": return "bg-green-100 text-green-600 border-green-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <Clock className="w-5 h-5 sm:w-8 sm:h-8 mb-2 opacity-20" />
        <p className="text-sm">لا يوجد نشاط مسجل لهذه الزيارة</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Vertical Line */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-200 ml-[-0.5px]" />

      <div className="space-y-6">
        <AnimatePresence initial={false}>
          {activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative flex gap-4"
            >
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border shadow-sm ${getColor(activity.type)}`}>
                {getIcon(activity.type)}
              </div>

              <div className="flex-1 pt-0.5">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h4 className="text-sm font-semibold text-slate-900 leading-none">
                    {activity.messageAr}
                  </h4>
                  <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                    {safeFormatDate(activity.timestamp, "HH:mm")}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1">{activity.messageEn}</p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <User className="w-3 h-3" />
                  <span>{activity.staffName}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
