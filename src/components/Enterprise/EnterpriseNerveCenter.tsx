import React, { useState, useEffect, useRef } from 'react';
import { EventBus, DomainEvent } from '../../core/events/EventBus';
import { initializeEnterpriseServices } from '../../core/services/EnterpriseServices';
import { PatientAggregate } from '../../core/domain/PatientAggregate';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Server, Database, Stethoscope, BedDouble, 
  Syringe, CreditCard, Ambulance, Zap, Clock, User,
  Play, RotateCcw, MapPin
} from 'lucide-react';

let servicesInitialized = false;

interface Props {
  language?: 'ar' | 'en';
}

export default function EnterpriseNerveCenter({ language = 'ar' }: Props) {
  const isAr = language === 'ar';
  
  const [events, setEvents] = useState<DomainEvent[]>([]);
  const [patient, setPatient] = useState<PatientAggregate | null>(null);
  
  const eventsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!servicesInitialized) {
      initializeEnterpriseServices();
      servicesInitialized = true;
    }

    const handleNewEvent = (event: DomainEvent) => {
      setEvents(prev => [...prev, event]);
      
      setPatient(prevPatient => {
        if (!prevPatient) return null;
        if (event.payload.patientId === prevPatient.id) {
          const updatedPatient = Object.assign(new PatientAggregate(prevPatient.id, prevPatient.mrn, prevPatient.name), prevPatient);
          updatedPatient.applyEvents([event]);
          return updatedPatient;
        }
        return prevPatient;
      });
    };

    EventBus.on('*', handleNewEvent);

    return () => {
      EventBus.removeListener('*', handleNewEvent);
    };
  }, []);

  useEffect(() => {
    eventsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  const startJourney = () => {
    EventBus.clearHistory();
    setEvents([]);
    
    const newPatient = new PatientAggregate('PT-1001', 'MRN-5592', isAr ? 'أحمد محمد' : 'Ahmed Mohamed');
    setPatient(newPatient);

    const correlationId = `SAGA-${Date.now()}`;

    EventBus.publish({
      id: Math.random().toString(36).substr(2, 9),
      type: 'PATIENT_ARRIVED_ER',
      timestamp: new Date().toISOString(),
      source: 'ER_Reception_Terminal',
      correlationId: correlationId,
      payload: {
        patientId: newPatient.id,
        severity: 'CRITICAL',
        pathway: 'STROKE'
      }
    });
  };

  const getServiceColor = (source: string) => {
    if (source.includes('Bed')) return 'text-blue-500 bg-blue-50 border-blue-200';
    if (source.includes('Lab')) return 'text-purple-500 bg-purple-50 border-purple-200';
    if (source.includes('Pharma')) return 'text-emerald-500 bg-emerald-50 border-emerald-200';
    if (source.includes('Billing')) return 'text-amber-500 bg-amber-50 border-amber-200';
    if (source.includes('Reception')) return 'text-indigo-500 bg-indigo-50 border-indigo-200';
    return 'text-slate-500 bg-slate-50 border-slate-200';
  };

  const getServiceIcon = (source: string) => {
    if (source.includes('Bed')) return <BedDouble size={16} />;
    if (source.includes('Lab')) return <Activity size={16} />;
    if (source.includes('Pharma')) return <Syringe size={16} />;
    if (source.includes('Billing')) return <CreditCard size={16} />;
    return <Stethoscope size={16} />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300 font-mono text-sm" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Database className="text-indigo-500" />
          <div>
            <h1 className="text-white font-bold text-base">{isAr ? "مركز تحكم المؤسسة (Event-Driven)" : "Enterprise Nerve Center (Event-Driven)"}</h1>
            <p className="text-xs text-slate-500">Real-time Kafka/Event Bus Simulation</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={startJourney}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 font-bold transition shadow-lg shadow-indigo-500/20"
          >
            <Zap size={16} className="fill-current" />
            {isAr ? "محاكاة: وصول مريض طوارئ حرج" : "Simulate: Critical ER Arrival"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        
        <div className="w-1/2 flex flex-col border-r border-slate-800 bg-slate-950/50">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
            <Server size={14} />
            {isAr ? "مجرى الأحداث (Event Stream)" : "Event Stream"}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            <AnimatePresence>
              {events.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                  <Activity size={48} className="mb-4" />
                  <p>{isAr ? "في انتظار الأحداث..." : "Waiting for events..."}</p>
                </div>
              )}
              {events.map((evt, idx) => (
                <motion.div 
                  key={evt.id}
                  initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg border ${getServiceColor(evt.source)} shadow-sm relative overflow-hidden`}
                >
                  <motion.div 
                    initial={{ left: '-100%' }}
                    animate={{ left: '100%' }}
                    transition={{ duration: 1, ease: 'linear' }}
                    className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                  />
                  
                  <div className="flex justify-between items-start mb-2 relative z-10">
                    <div className="flex items-center gap-2 font-bold">
                      {getServiceIcon(evt.source)}
                      <span>{evt.type}</span>
                    </div>
                    <span className="text-[10px] opacity-70 flex items-center gap-1">
                      <Clock size={10} />
                      {new Date(evt.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="text-xs opacity-90 relative z-10 flex justify-between items-end">
                    <div>
                      <span className="font-bold opacity-70">Source:</span> {evt.source}
                    </div>
                    <div className="text-right">
                      {evt.payload && (
                        <pre className="text-[10px] mt-1 bg-black/10 p-1.5 rounded inline-block text-left whitespace-pre-wrap max-w-xs">
                          {JSON.stringify(evt.payload, null, 2)}
                        </pre>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              <div ref={eventsEndRef} />
            </AnimatePresence>
          </div>
        </div>

        <div className="w-1/2 flex flex-col">
          <div className="p-3 border-b border-slate-800 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-950/50">
            <User size={14} />
            {isAr ? "الحالة المجمعة للمريض (Patient Aggregate)" : "Patient Aggregate State"}
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
            {patient ? (
              <div className="space-y-6">
                
                <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-xl">
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-white">{patient.name}</h2>
                        <div className="text-slate-400 text-xs">MRN: {patient.mrn}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {patient.state}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Current Location</div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <MapPin size={14} className="text-indigo-400" />
                        {patient.currentLocation || 'Unknown'} 
                        {patient.assignedBed && <span className="text-indigo-400">({patient.assignedBed})</span>}
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Active Orders</div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <Activity size={14} className="text-purple-400" />
                        {patient.activeOrders.length > 0 ? patient.activeOrders.length : 'None'} pending
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Billing Folio</div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <CreditCard size={14} className="text-amber-400" />
                        {patient.currentFolioId || 'Not Opened'}
                      </div>
                    </div>
                    <div className="bg-slate-900 rounded-lg p-3 border border-slate-700/50">
                      <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Charges</div>
                      <div className="font-bold text-white flex items-center gap-2">
                        <CreditCard size={14} className="text-emerald-400" />
                        ${events.filter(e => e.type === 'CHARGE_ADDED').reduce((acc, curr) => acc + (curr.payload.amount || 0), 0)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Microservices Live Status</h3>
                  
                  <div className={`p-4 rounded-xl border transition-colors ${events.some(e => e.type === 'BED_ALLOCATED') ? 'bg-blue-900/20 border-blue-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-white">
                      <BedDouble className={events.some(e => e.type === 'BED_ALLOCATED') ? 'text-blue-400' : 'text-slate-500'} size={16} />
                      Bed Management Service
                    </div>
                    <div className="text-xs text-slate-400">
                      {events.some(e => e.type === 'BED_ALLOCATED') 
                        ? `Allocated ${patient.assignedBed} in ${patient.currentLocation}`
                        : 'Awaiting allocation request...'}
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-colors ${events.some(e => e.type === 'LAB_ORDER_CREATED') ? 'bg-purple-900/20 border-purple-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-white">
                      <Activity className={events.some(e => e.type === 'LAB_ORDER_CREATED') ? 'text-purple-400' : 'text-slate-500'} size={16} />
                      Laboratory Service
                    </div>
                    <div className="text-xs text-slate-400">
                      {events.some(e => e.type === 'LAB_ORDER_CREATED') 
                        ? `Processing ${patient.activeOrders.length} orders...`
                        : 'Awaiting orders...'}
                    </div>
                  </div>

                  <div className={`p-4 rounded-xl border transition-colors ${events.some(e => e.type === 'CHARGE_ADDED') ? 'bg-amber-900/20 border-amber-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold text-white">
                      <CreditCard className={events.some(e => e.type === 'CHARGE_ADDED') ? 'text-amber-400' : 'text-slate-500'} size={16} />
                      Billing & RCM Service
                    </div>
                    <div className="text-xs text-slate-400">
                      {events.some(e => e.type === 'CHARGE_ADDED') 
                        ? `Capturing charges for Folio: ${patient.currentFolioId}`
                        : 'Awaiting billable events...'}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                <User size={64} className="mb-4" />
                <p>{isAr ? "لم يتم بدء أي مسار" : "No active journey started"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
