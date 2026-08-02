import React from "react";
import { 
  User, Calendar, CreditCard, ShieldAlert, 
  MapPin, Clock, Stethoscope, AlertCircle,
  Siren, Info
} from "lucide-react";
import { useHIS } from "../context/HISContext";
import { Patient } from "../types";

interface PatientBannerProps {
  patientId: string;
  language: "ar" | "en";
}

export default function PatientBanner({ patientId, language }: PatientBannerProps) {
  const { patients = [], encounters = [] } = useHIS();
  const isAr = language === "ar";
  
  const patient = patients.find(p => p.id === patientId);
  if (!patient) return null;

  const activeEncounter = encounters.find(e => e.patientId === patientId && e.status === "open");

  const getTriageColor = (level?: number) => {
    switch (level) {
      case 1: return "bg-red-600 text-white";
      case 2: return "bg-orange-500 text-white";
      case 3: return "bg-yellow-400 text-black";
      case 4: return "bg-green-500 text-white";
      case 5: return "bg-blue-500 text-white";
      default: return "bg-slate-200 text-slate-700";
    }
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm overflow-hidden" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-full px-4 py-2 flex flex-wrap items-center gap-6">
        {/* Basic Info */}
        <div className="flex items-center gap-3 pr-6 border-r border-slate-200">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500">
            <User size={24} />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              {isAr ? patient.nameAr : patient.nameEn}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 uppercase tracking-wider">
                {patient.gender === 'male' ? (isAr ? 'ذكر' : 'Male') : (isAr ? 'أنثى' : 'Female')}
              </span>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span className="font-mono text-primary-600 font-bold">{patient.mrn}</span>
              <span>•</span>
              <span>{patient.age} {isAr ? 'سنة' : 'YRS'}</span>
              <span>•</span>
              <span>{patient.dob}</span>
            </div>
          </div>
        </div>

        {/* Visit Details */}
        <div className="flex flex-wrap items-center gap-6 flex-1">
          {activeEncounter ? (
            <>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{isAr ? 'رقم الزيارة' : 'Visit #'}</span>
                <span className="text-xs font-mono font-bold text-slate-700">{activeEncounter.id}</span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{isAr ? 'القسم' : 'Department'}</span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <MapPin size={12} className="text-primary-500" />
                  {activeEncounter.deptName}
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{isAr ? 'الطبيب' : 'Doctor'}</span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <Stethoscope size={12} className="text-primary-500" />
                  {activeEncounter.doctorName}
                </div>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">{isAr ? 'الوقت المنقضي' : 'Length of Stay'}</span>
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <Clock size={12} className="text-primary-500" />
                  {Math.floor((Date.now() - new Date(activeEncounter.startTime).getTime()) / 60000)}m
                </div>
              </div>
              {activeEncounter.triageLevel && (
                <div className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase ${getTriageColor(activeEncounter.triageLevel)}`}>
                  {isAr ? 'المستوى' : 'Level'} {activeEncounter.triageLevel}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <Siren size={14} />
              {isAr ? 'لا توجد زيارة نشطة حالياً' : 'No Active Encounter'}
            </div>
          )}
        </div>

        {/* Clinical Highlights */}
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            {patient.clinicalData?.allergies?.length ? (
              <div className="p-1.5 rounded-full bg-red-100 text-red-600 ring-2 ring-white" title={patient.clinicalData.allergies.join(', ')}>
                <ShieldAlert size={16} />
              </div>
            ) : null}
            {patient.clinicalData?.isolationRequired && (
              <div className="p-1.5 rounded-full bg-purple-100 text-purple-600 ring-2 ring-white" title="Isolation Required">
                <AlertCircle size={16} />
              </div>
            )}
            {patient.clinicalData?.codeStatus === 'dnr' && (
              <div className="p-1.5 rounded-full bg-slate-800 text-white ring-2 ring-white" title="DNR">
                <span className="text-[8px] font-bold">DNR</span>
              </div>
            )}
          </div>
          
          <div className="px-3 py-1 rounded-md bg-blue-50 border border-blue-100 text-blue-700 text-[10px] font-bold uppercase">
            {patient.financialClass || 'CASH'}
          </div>
        </div>
      </div>
    </div>
  );
}
