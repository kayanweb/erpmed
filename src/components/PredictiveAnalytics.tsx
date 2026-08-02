import React, { useState } from 'react';
import { 
  TrendingUp, BrainCircuit, BarChart4, AlertTriangle, 
  Activity, Users, Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  language: 'ar' | 'en';
}

const data = [
  { name: 'Mon', actual: 400, predicted: 410 },
  { name: 'Tue', actual: 430, predicted: 420 },
  { name: 'Wed', actual: 448, predicted: 450 },
  { name: 'Thu', actual: null, predicted: 480 },
  { name: 'Fri', actual: null, predicted: 520 },
  { name: 'Sat', actual: null, predicted: 390 },
  { name: 'Sun', actual: null, predicted: 350 },
];

export const PredictiveAnalytics: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  
  return (
    <div className={`p-6 w-full space-y-6 ${isAr ? 'text-right' : 'text-left'}`} dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-6 shadow-xl text-white flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap ">
          <div className="p-3 bg-indigo-500/20 rounded-xl">
            <BrainCircuit className="w-5 h-5 sm:w-8 sm:h-8 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black">{isAr ? "التحليلات التنبؤية بالذكاء الاصطناعي" : "Predictive Analytics (AI)"}</h1>
            <p className="text-indigo-100 text-sm mt-1">
              {isAr ? "توقع أعداد المرضى، مخاطر إعادة التنويم، والطلب على الموارد" : "Forecast patient volumes, readmission risks, and resource demand"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-xl"><Users className="w-6 h-6 text-blue-600"/></div>
            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">+15% expected</span>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">{isAr ? "توقع زيارات الطوارئ (غداً)" : "ER Volume Forecast (Tomorrow)"}</h3>
          <p className="text-3xl font-black text-slate-800">185</p>
          <p className="text-sm text-slate-500 mt-2">{isAr ? "بناءً على التوجهات التاريخية والطقس" : "Based on historical trends & weather"}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-rose-50 rounded-xl"><AlertTriangle className="w-6 h-6 text-rose-600"/></div>
            <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded text-xs font-bold">High Alert</span>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">{isAr ? "مخاطر إعادة التنويم (30 يوم)" : "30-Day Readmission Risk"}</h3>
          <p className="text-3xl font-black text-slate-800">12.4%</p>
          <p className="text-sm text-slate-500 mt-2">{isAr ? "معدل الخطر للمرضى الحاليين" : "Risk score for currently admitted patients"}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 rounded-xl"><Activity className="w-6 h-6 text-emerald-600"/></div>
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">{isAr ? "توقع نقص الموارد" : "Resource Shortage Prediction"}</h3>
          <p className="text-3xl font-black text-slate-800">ICU Beds</p>
          <p className="text-sm text-slate-500 mt-2">{isAr ? "احتمال 85% للوصول للطاقة القصوى يوم الجمعة" : "85% probability of reaching max capacity on Friday"}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-lg text-slate-800 mb-6 flex items-center gap-2">
          <BarChart4 className="w-5 h-5 text-indigo-600" />
          {isAr ? "توقعات أعداد المراجعين لمدة 7 أيام" : "7-Day Patient Volume Forecast"}
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="actual" stroke="#4f46e5" fillOpacity={1} fill="url(#colorActual)" name="Actual" />
              <Area type="monotone" dataKey="predicted" stroke="#94a3b8" strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" name="Predicted" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
