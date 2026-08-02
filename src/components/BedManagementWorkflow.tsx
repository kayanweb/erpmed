import React, { useState, useMemo } from 'react';
import { useHIS } from '../context/HISContext';
import { Patient, HospitalBed, HISAdmissionRecord } from '../types';
import { 
  Bed, 
  MapPin, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Monitor,
  Wind,
  ShieldAlert,
  Info,
  Activity,
  DoorOpen,
  UserX,
  Stethoscope,
  Shield,
  Droplets,
  HeartPulse
} from 'lucide-react';

interface BedManagementWorkflowProps {
  patient: Patient;
  onClose: () => void;
}

const BedManagementWorkflow: React.FC<BedManagementWorkflowProps> = ({ patient, onClose }) => {
  const { wards, beds, assignBed, updatePatient, language, currentUser } = useHIS();
  const isAr = language === 'ar';

  const [selectedWardId, setSelectedWardId] = useState<string>('');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState<string>('');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  
  // 1. Consume Real Admission Request Data from Patient Object
  const adReq = patient.clinicalData?.admissionRequest;

  const clinicalRequest = useMemo(() => ({
    requestDate: adReq?.timestamp || new Date().toISOString(),
    requestingDoctor: adReq?.requestingDoctorName || (isAr ? "د. مناوب" : "On-call Physician"),
    admissionReason: adReq?.reason || (isAr ? "تنويم عاجل للتقييم" : "Urgent admission for evaluation"),
    priority: adReq?.priority || "urgent",
    requestedDept: adReq?.requestedDeptName || (isAr ? "القسم السريري" : "Clinical Dept"),
    levelOfCare: adReq?.priority === 'stat' ? "Critical Care" : "General Ward",
    requirements: adReq?.requirements || {
      oxygen: false,
      isolation: false,
      ventilator: false,
      monitor: false
    }
  }), [adReq, isAr]);

  // Wards
  const clinicalWards = useMemo(() => wards.filter(w => w.isActive), [wards]);
  const selectedWard = useMemo(() => clinicalWards.find(w => w.id === selectedWardId), [clinicalWards, selectedWardId]);

  // Rooms inside selected ward
  const wardBeds = useMemo(() => {
    if (!selectedWardId) return [];
    return beds.filter(b => b.wardId === selectedWardId);
  }, [beds, selectedWardId]);

  const rooms = useMemo(() => {
    const grouped = wardBeds.reduce((acc, bed) => {
      if (!acc[bed.roomNumber]) acc[bed.roomNumber] = [];
      acc[bed.roomNumber].push(bed);
      return acc;
    }, {} as Record<string, HospitalBed[]>);
    
    return Object.entries(grouped).map(([roomNumber, roomBeds]) => ({
      roomNumber,
      beds: roomBeds,
      totalBeds: roomBeds.length,
      availableBeds: roomBeds.filter(b => b.status === 'available').length
    })).sort((a, b) => a.roomNumber.localeCompare(b.roomNumber));
  }, [wardBeds]);

  // Beds inside selected room
  const selectedRoomBeds = useMemo(() => {
    if (!selectedRoomNumber) return [];
    return wardBeds.filter(b => b.roomNumber === selectedRoomNumber).sort((a, b) => a.bedNumber.localeCompare(b.bedNumber));
  }, [wardBeds, selectedRoomNumber]);

  const selectedBed = useMemo(() => selectedRoomBeds.find(b => b.id === selectedBedId), [selectedRoomBeds, selectedBedId]);

  // 3. Clinical Decision Support (Validation)
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (!selectedWard) return errors;

    // Gender Check
    if (selectedWard.genderAllowed !== 'both' && selectedWard.genderAllowed !== patient.gender) {
      errors.push(isAr ? `تعارض الجنس: الجناح مخصص لـ (${selectedWard.genderAllowed === 'male' ? 'الرجال' : 'النساء'})` : `Gender Mismatch: Ward restricted to (${selectedWard.genderAllowed})`);
    }

    // Age Check
    if (selectedWard.ageGroup === 'pediatric' && patient.age > 14) {
      errors.push(isAr ? "تعارض العمر: الجناح مخصص للأطفال (المريض بالغ)" : "Age Mismatch: Ward is pediatric (Patient is adult)");
    }
    
    if (selectedWard.ageGroup === 'adult' && patient.age <= 14) {
        errors.push(isAr ? "تعارض العمر: الجناح مخصص للبالغين (المريض طفل)" : "Age Mismatch: Ward is adult (Patient is pediatric)");
    }

    // Bed Restriction Check
    if (selectedBed) {
      if (selectedBed.genderRestriction && selectedBed.genderRestriction !== 'none' && selectedBed.genderRestriction !== patient.gender) {
          errors.push(isAr ? "تعارض الجنس: السرير مخصص لجنس آخر" : "Gender Mismatch: Bed restricted to another gender");
      }

      // Requirement Mismatch
      if (clinicalRequest.requirements.oxygen && !selectedBed.hasOxygen) {
        errors.push(isAr ? "نقص تجهيزات: السرير لا يوفر أكسجين" : "Equipment Missing: Bed lacks Oxygen");
      }
      if (clinicalRequest.requirements.ventilator && !selectedBed.hasVentilator) {
        errors.push(isAr ? "نقص تجهيزات: السرير لا يوفر جهاز تنفس صناعي" : "Equipment Missing: Bed lacks Ventilator");
      }
      if (clinicalRequest.requirements.monitor && !selectedBed.hasMonitor) {
          errors.push(isAr ? "نقص تجهيزات: السرير لا يوفر شاشة مراقبة" : "Equipment Missing: Bed lacks Monitor");
      }
      if (clinicalRequest.requirements.isolation && (!selectedBed.isolationType || selectedBed.isolationType === 'none')) {
          errors.push(isAr ? "عزل غير متوفر: المريض يحتاج عزل والسرير قياسي" : "Isolation Missing: Patient requires isolation, bed is standard");
      }
    }

    return errors;
  }, [selectedWard, selectedBed, patient, isAr, clinicalRequest]);

  const handleAssign = () => {
    if (!selectedWardId || !selectedBedId || validationErrors.length > 0) return;

    const admission: HISAdmissionRecord = {
      id: `ADM-${Date.now()}`,
      patientId: patient.id,
      mrn: patient.mrn,
      admissionDate: new Date().toISOString(),
      admissionType: (clinicalRequest.priority === 'stat' ? 'emergency' : 'elective') as any, 
      attendingPhysicianId: currentUser?.id || 'doc-1',
      wardId: selectedWardId,
      roomId: selectedBed?.roomNumber || 'Unknown',
      bedId: selectedBedId,
      status: 'active',
      diagnosisEn: clinicalRequest.admissionReason,
      diagnosisAr: clinicalRequest.admissionReason,
      source: 'er',
      notes: `Admission Request [${adReq?.requestId || 'N/A'}] Processed by ${currentUser?.nameEn}`
    };

    assignBed(admission);
    
    // Clear the pending request from patient state
    updatePatient(patient.id, {
      status: 'ward',
      clinicalData: {
        ...patient.clinicalData,
        admissionRequest: null
      }
    });

    onClose();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-emerald-500 border-emerald-600 text-white';
      case 'occupied': return 'bg-rose-500 border-rose-600 text-white';
      case 'cleaning': return 'bg-amber-500 border-amber-600 text-white';
      case 'reserved': return 'bg-indigo-500 border-indigo-600 text-white';
      case 'maintenance': return 'bg-slate-500 border-slate-600 text-white';
      default: return 'bg-slate-200 border-slate-300 text-slate-700';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden font-sans" dir={isAr ? 'rtl' : 'ltr'}>
      {/* 1. Patient Summary & Admission Request (Compact Density) */}
      <div className="bg-[#0a0f1c] text-slate-200 p-4 shrink-0 shadow-lg border-b border-slate-800 z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-inner border border-indigo-500">
              <User size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h2 className="text-lg font-black text-white tracking-tight">{isAr ? patient.nameAr : patient.nameEn}</h2>
                <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${patient.gender === 'male' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' : 'bg-pink-500/20 text-pink-300 border border-pink-500/30'}`}>
                  {isAr ? (patient.gender === 'male' ? "ذكر" : "أنثى") : patient.gender}
                </span>
                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded text-[9px] font-black uppercase">
                  {clinicalRequest.priority}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                <span>MRN: <span className="text-white">{patient.mrn}</span></span>
                <span>•</span>
                <span>{patient.age} {isAr ? "سنة" : "YRS"}</span>
                <span>•</span>
                <span>{isAr ? "فصيلة الدم:" : "BLOOD:"} <span className="text-rose-400">{patient.bloodGroup || 'O+'}</span></span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-right">
             <div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "الطبيب المعالج" : "ATTENDING"}</div>
                <div className="text-xs font-bold text-white flex items-center gap-1 justify-end"><Stethoscope size={12} className="text-indigo-400"/> {clinicalRequest.requestingDoctor}</div>
             </div>
             <div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "التأمين" : "INSURANCE"}</div>
                <div className="text-xs font-bold text-white flex items-center gap-1 justify-end"><Shield size={12} className="text-emerald-400"/> {patient.insuranceProvider || 'Cash / Self Pay'}</div>
             </div>
             <div>
                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{isAr ? "القسم السريري" : "CLINICAL DEPT"}</div>
                <div className="text-xs font-bold text-white">{clinicalRequest.requestedDept}</div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
           <div className="col-span-7">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{isAr ? "التشخيص الأولي / سبب التنويم" : "PROVISIONAL DIAGNOSIS"}</div>
              <div className="text-xs font-bold text-slate-200 line-clamp-1">{clinicalRequest.admissionReason}</div>
           </div>
           <div className="col-span-5 flex items-center justify-end gap-2">
              <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-2">{isAr ? "المتطلبات السريرية:" : "CLINICAL REQ:"}</div>
              {clinicalRequest.requirements.oxygen && <span className="px-2 py-0.5 bg-blue-900/50 text-blue-300 border border-blue-800/50 rounded text-[9px] font-black flex items-center gap-1"><Wind size={10} /> O2</span>}
              {clinicalRequest.requirements.ventilator && <span className="px-2 py-0.5 bg-rose-900/50 text-rose-300 border border-rose-800/50 rounded text-[9px] font-black flex items-center gap-1"><HeartPulse size={10} /> VENT</span>}
              {clinicalRequest.requirements.monitor && <span className="px-2 py-0.5 bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 rounded text-[9px] font-black flex items-center gap-1"><Monitor size={10} /> MON</span>}
              {clinicalRequest.requirements.isolation && <span className="px-2 py-0.5 bg-amber-900/50 text-amber-300 border border-amber-800/50 rounded text-[9px] font-black flex items-center gap-1"><ShieldAlert size={10} /> ISO</span>}
              {(!clinicalRequest.requirements.oxygen && !clinicalRequest.requirements.ventilator && !clinicalRequest.requirements.monitor && !clinicalRequest.requirements.isolation) && (
                  <span className="text-[10px] font-bold text-slate-500">{isAr ? "سرير قياسي" : "Standard Bed"}</span>
              )}
           </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden bg-slate-100">
        {/* Step 1: Ward Selection */}
        <div className="w-72 border-l rtl:border-l-0 rtl:border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar shrink-0 flex flex-col">
          <div className="p-3 bg-slate-50 border-b border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500 sticky top-0 z-10 flex items-center justify-between">
            <span>1. {isAr ? "اختيار الجناح" : "SELECT WARD"}</span>
            <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{clinicalWards.length}</span>
          </div>
          <div className="p-2 space-y-1">
            {clinicalWards.map(ward => {
              const occPct = (ward.occupancy / ward.capacity) * 100;
              const isSelected = selectedWardId === ward.id;
              const isFull = ward.occupancy >= ward.capacity;
              return (
              <button
                key={ward.id}
                onClick={() => {
                  setSelectedWardId(ward.id);
                  setSelectedRoomNumber('');
                  setSelectedBedId('');
                }}
                className={`w-full p-3 rounded-lg border text-right transition-all group relative overflow-hidden flex flex-col gap-2 ${
                  isSelected 
                    ? "border-indigo-500 bg-indigo-50" 
                    : "border-transparent hover:bg-slate-50 hover:border-slate-200"
                }`}
              >
                {isSelected && <div className="absolute top-0 right-0 w-1 h-full bg-indigo-600"></div>}
                
                <div className="flex justify-between items-start w-full">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded-sm font-black uppercase ${
                    ward.type === 'icu' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {ward.type}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] font-bold">
                    <span className={occPct >= 90 ? 'text-rose-600' : 'text-slate-600'}>{ward.occupancy}</span>
                    <span className="text-slate-400">/ {ward.capacity}</span>
                  </div>
                </div>
                
                <div className="text-xs font-black text-slate-800 line-clamp-1 w-full text-start">{isAr ? ward.nameAr : ward.nameEn}</div>
                
                <div className="w-full flex items-center justify-between text-[9px] font-bold text-slate-500">
                  <span className="uppercase tracking-tighter flex items-center gap-1">
                     {ward.genderAllowed === 'both' ? <User size={10} /> : (ward.genderAllowed === 'male' ? <User size={10} className="text-blue-500" /> : <User size={10} className="text-pink-500" />)}
                     {ward.genderAllowed === 'both' ? 'MIX' : ward.genderAllowed.toUpperCase()}
                  </span>
                  <span className="text-slate-400">{ward.ageGroup.toUpperCase()}</span>
                </div>

                <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden mt-1">
                   <div className={`h-full ${occPct >= 90 ? 'bg-rose-500' : (occPct >= 75 ? 'bg-amber-500' : 'bg-emerald-500')}`} style={{ width: `${Math.min(occPct, 100)}%` }} />
                </div>
              </button>
            )})}
          </div>
        </div>

        {/* Step 2: Room Selection */}
        <div className="w-64 border-l rtl:border-l-0 rtl:border-r border-slate-200 bg-slate-50 overflow-y-auto custom-scrollbar shrink-0 flex flex-col">
          <div className="p-3 bg-slate-100 border-b border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-500 sticky top-0 z-10 flex items-center justify-between">
            <span>2. {isAr ? "اختيار الغرفة" : "SELECT ROOM"}</span>
            {selectedWardId && <span className="bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{rooms.length}</span>}
          </div>
          
          {!selectedWardId ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
               <MapPin size={24} className="mb-2 opacity-50" />
               <p className="text-[10px] font-bold uppercase">{isAr ? "اختر جناحاً لعرض الغرف" : "Select a ward to view rooms"}</p>
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
               <DoorOpen size={24} className="mb-2 opacity-50" />
               <p className="text-[10px] font-bold uppercase">{isAr ? "لا توجد غرف" : "No rooms found"}</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {rooms.map(room => {
                const isSelected = selectedRoomNumber === room.roomNumber;
                return (
                <button
                  key={room.roomNumber}
                  onClick={() => {
                    setSelectedRoomNumber(room.roomNumber);
                    setSelectedBedId('');
                  }}
                  className={`w-full p-3 rounded-lg border text-right transition-all flex items-center justify-between group ${
                    isSelected 
                      ? "border-indigo-300 bg-white shadow-sm" 
                      : "border-transparent hover:bg-white hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <DoorOpen size={14} className={isSelected ? "text-indigo-600" : "text-slate-400"} />
                    <span className={`text-sm font-black ${isSelected ? "text-indigo-900" : "text-slate-700"}`}>{room.roomNumber}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`text-[9px] font-black ${room.availableBeds > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {room.availableBeds} {isAr ? 'متاح' : 'AVAIL'}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400">{room.totalBeds} BEDS TOTAL</span>
                  </div>
                </button>
              )})}
            </div>
          )}
        </div>

        {/* Step 3: Bed Selection (Map View) */}
        <div className="flex-1 overflow-y-auto bg-slate-100 flex flex-col custom-scrollbar">
          <div className="p-3 bg-slate-100 border-b border-slate-200 sticky top-0 z-10 flex items-center justify-between">
             <span className="font-black text-[10px] uppercase tracking-widest text-slate-500">3. {isAr ? "اختيار السرير (خريطة الغرفة)" : "SELECT BED (MAP)"}</span>
             
             {/* Legend */}
             <div className="flex items-center gap-3">
               {[
                 { status: 'available', label: 'AVAIL', color: 'bg-emerald-500' },
                 { status: 'occupied', label: 'OCC', color: 'bg-rose-500' },
                 { status: 'cleaning', label: 'CLEAN', color: 'bg-amber-500' },
                 { status: 'reserved', label: 'RSV', color: 'bg-indigo-500' },
               ].map(l => (
                 <div key={l.status} className="flex items-center gap-1 text-[8px] font-black uppercase text-slate-500">
                    <div className={`w-2 h-2 rounded-sm ${l.color}`} />
                    {l.label}
                 </div>
               ))}
             </div>
          </div>

          <div className="flex-1 p-6">
            {!selectedRoomNumber ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <Bed size={32} className="mb-3 opacity-50" />
                <p className="text-xs font-black uppercase tracking-widest">{isAr ? "اختر غرفة لعرض الأسرة" : "Select a room to view bed map"}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 auto-rows-max">
                {selectedRoomBeds.map((bed) => {
                  const isAvailable = bed.status === 'available';
                  const isSelected = selectedBedId === bed.id;
                  
                  return (
                  <button
                    key={bed.id}
                    disabled={!isAvailable}
                    onClick={() => setSelectedBedId(bed.id)}
                    className={`relative p-4 rounded-xl border-2 text-start transition-all flex flex-col h-32 ${
                      isSelected 
                        ? "border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200 ring-offset-2" 
                        : isAvailable 
                          ? "border-emerald-200 bg-white hover:border-emerald-400 shadow-sm cursor-pointer" 
                          : "border-slate-200 bg-slate-50 opacity-75 cursor-not-allowed"
                    }`}
                  >
                    <div className="flex items-start justify-between w-full mb-auto">
                       <div className="flex items-center gap-2">
                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shadow-inner ${getStatusColor(bed.status)}`}>
                           <Bed size={16} />
                         </div>
                         <div>
                            <div className="text-sm font-black text-slate-800">{bed.bedNumber}</div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{bed.status}</div>
                         </div>
                       </div>
                       {isSelected && <CheckCircle2 className="text-indigo-600" size={20} />}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {bed.hasOxygen && <div title="Oxygen" className="p-1 border border-blue-200 bg-blue-50 text-blue-600 rounded"><Wind size={12} /></div>}
                      {bed.hasMonitor && <div title="Monitor" className="p-1 border border-emerald-200 bg-emerald-50 text-emerald-600 rounded"><Monitor size={12} /></div>}
                      {bed.hasVentilator && <div title="Ventilator" className="p-1 border border-rose-200 bg-rose-50 text-rose-600 rounded"><HeartPulse size={12} /></div>}
                      {bed.isolationType && bed.isolationType !== 'none' && <div title="Isolation" className="p-1 border border-amber-200 bg-amber-50 text-amber-600 rounded"><ShieldAlert size={12} /></div>}
                      {bed.genderRestriction && bed.genderRestriction !== 'none' && (
                         <div className="p-1 border border-slate-200 bg-slate-100 text-slate-600 rounded flex items-center text-[8px] font-black uppercase">
                           <UserX size={10} className="mr-0.5" />
                           {bed.genderRestriction.substring(0,1)}
                         </div>
                      )}
                    </div>
                  </button>
                )})}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer: Clinical Decision Support & Confirmation */}
      <div className="bg-white p-4 border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] shrink-0 z-20 flex flex-col md:flex-row md:items-end justify-between gap-4">
         <div className="flex-1">
            {validationErrors.length > 0 ? (
              <div className="flex items-start gap-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                 <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                 <div>
                   <p className="text-[10px] font-black text-rose-800 uppercase tracking-widest mb-1">{isAr ? "منع التنويم - تعارض سريري (CDS)" : "Admission Blocked - CDS Alert"}</p>
                   <ul className="space-y-0.5">
                     {validationErrors.map((err, i) => (
                       <li key={i} className="text-[10px] font-bold text-rose-700 leading-tight flex items-start gap-1">
                          <span className="text-rose-400 mt-0.5">•</span>
                          {err}
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>
            ) : selectedBed ? (
              <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                 <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={16} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black text-indigo-800 uppercase tracking-widest">{isAr ? "ملخص القرار الإداري" : "Final Admission Summary"}</p>
                   <p className="text-xs font-bold text-indigo-900 mt-0.5">
                     {isAr ? "تنويم في:" : "Admitting to:"} 
                     <span className="font-black mx-1">{selectedWard?.nameEn}</span> 
                     &rarr; Room <span className="font-black mx-1">{selectedRoomNumber}</span>
                     &rarr; Bed <span className="font-black mx-1">{selectedBed.bedNumber}</span>
                   </p>
                 </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-500">
                 <Info className="w-5 h-5 opacity-50 shrink-0" />
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest">{isAr ? "الإجراء مطلوب" : "Action Required"}</p>
                   <p className="text-[10px] font-bold leading-tight mt-0.5">{isAr ? "أكمل اختيار الجناح، الغرفة، والسرير لتفعيل زر التأكيد." : "Complete Ward, Room, and Bed selection to proceed."}</p>
                 </div>
              </div>
            )}
         </div>

         <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-100 hover:bg-slate-200 border border-transparent rounded-lg transition-all"
            >
              {isAr ? "إلغاء" : "Cancel"}
            </button>
            <button
              disabled={!selectedBedId || validationErrors.length > 0}
              onClick={handleAssign}
              className="px-8 py-2.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={14} />
              {isAr ? "تأكيد التنويم" : "Confirm Admission"}
            </button>
         </div>
      </div>
    </div>
  );
};

export default BedManagementWorkflow;

