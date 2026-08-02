import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, DollarSign, Activity, AlertCircle, Building2, Bed, Stethoscope, ChevronRight, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { firestoreService } from '../lib/firestoreService';

// We won't use complex recharts in this step to save time, but we'll build a highly functional C-Suite dashboard
// with KPIs, mock tracking, and unique enterprise styling.

interface ExecutiveKPI {
  id: string;
  category: 'Financial' | 'Clinical' | 'Operational';
  metric: string;
  value: string;
  target: string;
  status: 'On Target' | 'Warning' | 'Critical';
  trend: '+12%' | '-5%' | '+2%';
}

export default function ExecutivePortalDashboard({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';
  const [kpis, setKpis] = useState<ExecutiveKPI[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKPIs = async () => {
    setLoading(true);
    try {
      const data = await firestoreService.getAll<ExecutiveKPI>('executive_kpis');
      if (data.length === 0) {
        const defaultKPIs: Omit<ExecutiveKPI, 'id'>[] = [
          { category: 'Financial', metric: 'Monthly Revenue', value: '$4.2M', target: '$4.0M', status: 'On Target', trend: '+12%' },
          { category: 'Financial', metric: 'Operating Margin', value: '14.2%', target: '15.0%', status: 'Warning', trend: '-5%' },
          { category: 'Clinical', metric: 'Readmission Rate (30d)', value: '8.4%', target: '10.0%', status: 'On Target', trend: '+2%' },
          { category: 'Clinical', metric: 'ALOS (Avg Length of Stay)', value: '4.2 Days', target: '4.0 Days', status: 'Warning', trend: '+12%' },
          { category: 'Operational', metric: 'Bed Occupancy', value: '92%', target: '85%', status: 'Critical', trend: '+12%' },
          { category: 'Operational', metric: 'ER Wait Time', value: '45 mins', target: '30 mins', status: 'Critical', trend: '+12%' },
        ];
        for (const k of defaultKPIs) await firestoreService.add('executive_kpis', k);
        const newData = await firestoreService.getAll<ExecutiveKPI>('executive_kpis');
        setKpis(newData);
      } else {
        setKpis(data);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchKPIs();
  }, []);

  const financial = kpis.filter(k => k.category === 'Financial');
  const clinical = kpis.filter(k => k.category === 'Clinical');
  const operational = kpis.filter(k => k.category === 'Operational');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Target': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Warning': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Critical': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50" dir={isAr ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-6 sm:p-8 flex justify-between items-center z-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{isAr ? 'بوابة الإدارة التنفيذية' : 'Executive Command Center'}</h1>
          <p className="text-slate-500 font-medium mt-1">{isAr ? 'نظرة شاملة على أداء المستشفى' : 'Hospital Performance & Strategic Overview'}</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors">
          <Download className="w-4 h-4" />
          {isAr ? 'تقرير الأداء' : 'Export Report'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-10">
        
        {/* Top High-Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">+2.4%</span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isAr ? 'إجمالي الإيرادات (الشهر)' : 'Total Revenue (MTD)'}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">$8.4M</h3>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                <Bed className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-md">Critical</span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isAr ? 'إشغال الأسرة' : 'Bed Occupancy'}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">94%</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">-1.2%</span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isAr ? 'معدل إعادة التنويم' : 'Readmission Rate'}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">8.2%</h3>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                <Users className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-md">+5.4%</span>
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{isAr ? 'رضا المرضى' : 'Patient Satisfaction'}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-2">4.6/5</h3>
          </div>
        </div>

        {/* Detailed KPI Grids */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Financial */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              {isAr ? 'الأداء المالي' : 'Financial Performance'}
            </h2>
            {financial.map(kpi => (
              <div key={kpi.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-slate-700">{kpi.metric}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(kpi.status)}`}>
                    {kpi.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
                    <div className="text-xs text-slate-500 font-medium">Target: {kpi.target}</div>
                  </div>
                  <div className={`text-sm font-bold ${kpi.trend.startsWith('+') ? (kpi.status === 'Critical' ? 'text-rose-600' : 'text-emerald-600') : 'text-amber-600'}`}>
                    {kpi.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-indigo-600" />
              {isAr ? 'الأداء السريري' : 'Clinical Outcomes'}
            </h2>
            {clinical.map(kpi => (
              <div key={kpi.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-slate-700">{kpi.metric}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(kpi.status)}`}>
                    {kpi.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
                    <div className="text-xs text-slate-500 font-medium">Target: {kpi.target}</div>
                  </div>
                  <div className={`text-sm font-bold ${kpi.trend.startsWith('+') ? (kpi.status === 'Critical' ? 'text-rose-600' : 'text-emerald-600') : 'text-amber-600'}`}>
                    {kpi.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Operational */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              {isAr ? 'الأداء التشغيلي' : 'Operational Efficiency'}
            </h2>
            {operational.map(kpi => (
              <div key={kpi.id} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-bold text-slate-700">{kpi.metric}</span>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md border ${getStatusColor(kpi.status)}`}>
                    {kpi.status}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <div className="text-2xl font-black text-slate-900">{kpi.value}</div>
                    <div className="text-xs text-slate-500 font-medium">Target: {kpi.target}</div>
                  </div>
                  <div className={`text-sm font-bold ${kpi.trend.startsWith('+') ? (kpi.status === 'Critical' ? 'text-rose-600' : 'text-emerald-600') : 'text-amber-600'}`}>
                    {kpi.trend}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
