import React, { useState } from 'react';
import { 
  Wrench, Calendar, Plus, Search, CheckCircle2, AlertTriangle, 
  Clock, Filter, Settings, FileText, CheckSquare, Hammer as Tool
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

interface Props {
  language: 'ar' | 'en';
}

const statusData = [
  { name: 'Pending', value: 12 },
  { name: 'In Progress', value: 8 },
  { name: 'Completed', value: 45 },
];

const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

const DUMMY_TASKS = [
  { id: 'WO-1001', asset: 'MRI Scanner (Siemens)', location: 'Radiology Dept', type: 'Preventive', priority: 'High', status: 'In Progress', assignedTo: 'Eng. Hisham', dueDate: '2024-03-15' },
  { id: 'WO-1002', asset: 'HVAC System', location: 'Building A, Floor 2', type: 'Corrective', priority: 'Critical', status: 'Pending', assignedTo: 'Unassigned', dueDate: '2024-03-10' },
  { id: 'WO-1003', asset: 'Patient Bed 402', location: 'Ward 4, Room 402', type: 'Repair', priority: 'Medium', status: 'Completed', assignedTo: 'Tech. Sameh', dueDate: '2024-03-01' },
  { id: 'WO-1004', asset: 'Defibrillator Unit A', location: 'ER, Resus 1', type: 'Calibration', priority: 'High', status: 'Pending', assignedTo: 'Eng. Hisham', dueDate: '2024-03-12' },
  { id: 'WO-1005', asset: 'Elevator 3', location: 'Main Lobby', type: 'Inspection', priority: 'Low', status: 'In Progress', assignedTo: 'External Vendor', dueDate: '2024-03-20' },
];

export const MaintenanceDashboard: React.FC<Props> = ({ language }) => {
  const isAr = language === 'ar';
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const filteredTasks = DUMMY_TASKS.filter(task => {
    const matchesSearch = task.asset.toLowerCase().includes(searchQuery.toLowerCase()) || task.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 flex flex-col h-full min-h-0 bg-slate-50" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2 sm:py-4 shrink-0 shadow-sm z-10 flex flex-row flex-wrap items-center justify-between gap-2 sm:gap-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md shadow-amber-200">
            <Wrench size={20} />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {isAr ? "الصيانة والمرافق" : "Maintenance & Facilities"}
            </h1>
            <p className="text-xs font-bold text-slate-500">
              {isAr ? "إدارة طلبات الصيانة والمرافق الطبية" : "Manage work orders and facility maintenance"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-amber-600 text-white text-[11px] font-black uppercase rounded-lg shadow-md hover:bg-amber-700 transition-all flex items-center gap-2">
            <Plus size={16} />
            {isAr ? "طلب صيانة جديد" : "New Work Order"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar space-y-6">
        
        {/* Top Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                <AlertTriangle size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{isAr ? "طلبات معلقة" : "Pending Orders"}</p>
                <h3 className="text-3xl font-black text-slate-800">12</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase">{isAr ? "قيد التنفيذ" : "In Progress"}</p>
                <h3 className="text-3xl font-black text-slate-800">8</h3>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 lg:col-span-2 flex items-center">
            <div className="w-1/2">
              <h3 className="text-sm font-bold text-slate-800 mb-2">{isAr ? "حالة طلبات الصيانة" : "Work Orders Status"}</h3>
              <p className="text-xs text-slate-500 mb-4">{isAr ? "إحصائيات هذا الشهر" : "Statistics for this month"}</p>
              <ul className="space-y-2">
                {statusData.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                      <span className="font-semibold text-slate-600">{item.name}</span>
                    </span>
                    <span className="font-bold text-slate-800">{item.value}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-1/2 h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Work Orders Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare size={18} className="text-amber-600" />
              {isAr ? "سجل طلبات الصيانة" : "Work Orders Log"}
            </h3>
            
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className={`absolute ${isAr ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
                <input 
                  type="text"
                  placeholder={isAr ? "بحث..." : "Search..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${isAr ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`}
                />
              </div>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full sm:w-auto py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="ALL">{isAr ? "الكل" : "All"}</option>
                <option value="Pending">{isAr ? "معلق" : "Pending"}</option>
                <option value="In Progress">{isAr ? "قيد التنفيذ" : "In Progress"}</option>
                <option value="Completed">{isAr ? "مكتمل" : "Completed"}</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left" dir={isAr ? 'rtl' : 'ltr'}>
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "رقم الطلب" : "WO ID"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الأصل/الموقع" : "Asset / Location"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "النوع" : "Type"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الأولوية" : "Priority"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "المكلف" : "Assigned To"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "تاريخ الاستحقاق" : "Due Date"}</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase">{isAr ? "الحالة" : "Status"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTasks.map(task => (
                  <tr key={task.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-amber-600">{task.id}</td>
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{task.asset}</p>
                      <p className="text-xs font-medium text-slate-500">{task.location}</p>
                    </td>
                    <td className="p-4 text-sm font-semibold text-slate-600">{task.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-black uppercase
                        ${task.priority === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                          task.priority === 'High' ? 'bg-orange-100 text-orange-700' : 
                          task.priority === 'Medium' ? 'bg-blue-100 text-blue-700' : 
                          'bg-slate-100 text-slate-700'}`}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-600">{task.assignedTo}</td>
                    <td className="p-4 text-sm font-medium text-slate-500">{task.dueDate}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-max
                        ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 
                          task.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                          'bg-amber-100 text-amber-700'}`}>
                        {task.status === 'Completed' && <CheckCircle2 size={10} />}
                        {task.status === 'In Progress' && <Clock size={10} />}
                        {task.status === 'Pending' && <AlertTriangle size={10} />}
                        {task.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500 font-bold">
                      {isAr ? "لم يتم العثور على طلبات مطابقة." : "No matching work orders found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;
