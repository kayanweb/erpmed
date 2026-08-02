import React from "react";
import { Brain, Activity, HeartPulse, UserCheck, Stethoscope, AlertCircle, FileText, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { EntityText } from "./EntityText";
import { EntityType } from "../types";
import { GlobalEntityLink } from "./GlobalEntityLink";

const sepsisData = [
  { hour: "-12h", risk: 10 },
  { hour: "-8h", risk: 15 },
  { hour: "-4h", risk: 22 },
  { hour: "Now", risk: 65 },
];

export default function AIClinicalDecisionSupport({ language, userRole = "doctor", onClose }: { language: "ar" | "en", userRole?: string, onClose?: () => void }) {
  const isAr = language === "ar";
  return (
    <div className="p-6 bg-slate-50 min-h-full font-sans" dir={isAr ? "rtl" : "ltr"}>
      <div className="flex items-center gap-2 sm:gap-4 flex-wrap  mb-8">
        <button 
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 transition-all shadow-sm group shrink-0"
        >
           <Plus className="w-6 h-6 rotate-45 group-hover:scale-110 transition-transform" />
        </button>
        <div className="bg-purple-600 p-4 rounded-2xl text-white shadow-lg shadow-purple-200 shrink-0">
          <Brain className="w-5 h-5 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900">
            {isAr ? "نظام دعم القرار السريري (AI CDSS)" : "AI Clinical Decision Support System"}
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            {isAr ? "تحليل البيانات الضخمة للتنبؤ بالمخاطر وتوجيه الأطباء" : "Big Data Analytics for Risk Prediction & Clinical Guidance"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="text-rose-500" />
              {isAr ? "التنبؤ المبكر بتسمم الدم (Sepsis Prediction)" : "Early Sepsis Prediction Model"}
            </h2>
            <span className="bg-rose-100 text-rose-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">CRITICAL RISK ALERT</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sepsisData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="hour" fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} stroke="#64748b" tickLine={false} axisLine={false} />
                  <Line type="monotone" dataKey="risk" stroke="#e11d48" strokeWidth={4} dot={{ r: 6, fill: '#e11d48' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="w-full md:w-1/2 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-500 mb-1">
                  Patient: <GlobalEntityLink entity={{ type: EntityType.PATIENT, id: "MR-99281", name: "MR-99281 (ICU Bed 4)" }} className="font-bold text-slate-900 hover:text-indigo-600" userRole={userRole} />
                </p>
                <p className="text-sm font-medium text-slate-800">AI analysis detects a 65% rising probability of sepsis onset within the next 4 hours.</p>
                <div className="mt-3 text-xs text-slate-500 flex flex-wrap gap-2">
                  <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded">Elevated Lactate</span>
                  <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded">Tachycardia</span>
                  <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Hypotension Trend</span>
                </div>
              </div>
              <button className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-rose-200">
                {isAr ? "تفعيل بروتوكول Sepsis" : "Activate Sepsis Protocol"}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-lg p-6 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2 mb-6">
            <FileText className="text-indigo-400" />
            {isAr ? "المعالجة اللغوية للملاحظات (NLP)" : "NLP Clinical Notes"}
          </h2>
          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl backdrop-blur-md border border-white/10">
              <p className="text-sm italic text-slate-300">
                <EntityText 
                  text='"Patient complains of severe chest pain radiating to left arm. History of hypertension."'
                  entities={[
                    { type: 'symptom', id: 'sym-01', name: 'chest pain' },
                    { type: 'condition', id: 'cond-01', name: 'hypertension' }
                  ]}
                  isAr={isAr}
                  userRole={userRole}
                />
              </p>
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs font-bold text-indigo-300 mb-2">AI Extracted Entities:</p>
                <div className="flex flex-wrap gap-2">
                  <GlobalEntityLink entity={{ type: 'symptom', id: 'sym-01', name: 'Chest Pain' }} className="bg-rose-500/20 text-rose-300 text-xs px-2 py-1 rounded border border-rose-500/30 hover:bg-rose-500/40" userRole={userRole} />
                  <GlobalEntityLink entity={{ type: 'condition', id: 'cond-01', name: 'Hypertension' }} className="bg-blue-500/20 text-blue-300 text-xs px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-500/40" userRole={userRole} />
                </div>
              </div>
            </div>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold py-2 rounded-xl border border-white/10 transition-all">
              {isAr ? "ترميز تلقائي للتشخيص (ICD-10)" : "Auto-Code ICD-10"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <HeartPulse className="text-emerald-500" />
            {isAr ? "تحليل مخاطر إعادة التنويم" : "Readmission Risk Prediction"}
          </h2>
          <div className="space-y-3">
            {[
              { id: "PT-01", risk: "High", score: 82, factor: "Medication Non-adherence" },
              { id: "PT-02", risk: "Medium", score: 45, factor: "Lack of family support" },
              { id: "PT-03", risk: "Low", score: 12, factor: "Stable vitals post-op" }
            ].map((p, i) => (
              <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50">
                <div>
                  <GlobalEntityLink entity={{ type: EntityType.PATIENT, id: p.id, name: p.id }} className="font-bold text-slate-700 hover:text-indigo-600" userRole={userRole} />
                  <p className="text-xs text-slate-500 mt-1">{p.factor}</p>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-bold ${p.risk === 'High' ? 'text-rose-600' : p.risk === 'Medium' ? 'text-amber-600' : 'text-emerald-600'}`}>{p.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Stethoscope className="text-blue-500" />
            {isAr ? "مساعد الذكاء الاصطناعي للأشعة" : "Radiology AI Copilot"}
          </h2>
          <div className="flex gap-4">
            <div className="w-1/3 bg-slate-200 rounded-xl flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/20"></div>
              <div className="absolute top-2 right-2 w-4 h-4 rounded-full border-2 border-rose-500 animate-ping"></div>
              <Activity className="w-10 h-10 text-slate-400 opacity-50" />
            </div>
            <div className="w-2/3">
              <h3 className="font-bold text-slate-800 text-sm">Chest X-Ray Analysis Complete</h3>
              <p className="text-xs text-slate-600 mt-2">AI detected anomalous opacities in the lower left lobe with 94% confidence. Suspicion of early-stage pneumonia.</p>
              <GlobalEntityLink 
                entity={{ type: "imaging", id: "IMG-9912", name: "View Annotated Scan →" }} 
                className="mt-3 inline-block text-sm text-blue-600 font-bold hover:underline" 
                userRole={userRole}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

