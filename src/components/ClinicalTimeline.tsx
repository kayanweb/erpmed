import React from 'react';
import { 
  FileText, Activity, Beaker, Pill, Zap, Clock, User, ChevronRight, 
  HeartPulse, FlaskConical, Scan, CheckCircle2
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineEvent {
  id: string;
  type: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  timestamp: string;
  author: string;
  role: string;
  color: string;
  icon: string;
  data?: any;
}

interface ClinicalTimelineProps {
  events: TimelineEvent[];
  language: 'ar' | 'en';
  onEventClick?: (event: TimelineEvent) => void;
}

export const ClinicalTimeline: React.FC<ClinicalTimelineProps> = ({ events, language, onEventClick }) => {
  const isAr = language === 'ar';

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return <FileText size={18} />;
      case 'Activity': return <Activity size={18} />;
      case 'Beaker': return <Beaker size={18} />;
      case 'Pill': return <Pill size={18} />;
      case 'Zap': return <Zap size={18} />;
      case 'HeartPulse': return <HeartPulse size={18} />;
      case 'FlaskConical': return <FlaskConical size={18} />;
      case 'Scan': return <Scan size={18} />;
      default: return <Clock size={18} />;
    }
  };

  const getColorClass = (color: string) => {
    switch (color) {
      case 'rose': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'amber': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'emerald': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'indigo': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'purple': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'blue': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
      {events.map((event, index) => (
        <motion.div 
          key={event.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="relative pl-12 group"
        >
          {/* Dot / Icon */}
          <div className={`absolute left-0 top-0 w-10 h-10 rounded-xl flex items-center justify-center border-2 z-10 transition-all group-hover:scale-110 ${getColorClass(event.color)}`}>
            {getIcon(event.icon)}
          </div>

          <div 
            onClick={() => onEventClick?.(event)}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {event.timestamp}
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${getColorClass(event.color)}`}>
                  {event.type}
                </span>
                <ChevronRight size={14} className="text-slate-300" />
              </div>
            </div>

            <h4 className="text-sm font-black text-slate-800 mb-1">
              {isAr ? event.titleAr : event.titleEn}
            </h4>
            <p className="text-xs font-medium text-slate-500 leading-relaxed line-clamp-2">
              {isAr ? event.descAr : event.descEn}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <User size={12} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-700 leading-none">{event.author}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{event.role}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
