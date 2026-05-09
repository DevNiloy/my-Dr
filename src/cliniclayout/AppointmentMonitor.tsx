import React, { useState } from "react";
import { 
  Calendar, Clock, Monitor, MapPin, Search, 
  CheckCircle2, XCircle, MoreVertical, Filter,  
} from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  type: "Online" | "Stationary";
  time: string;
  date: string;
  status: "Active" | "Upcoming" | "Completed" | "Cancelled";
  amount: number;
}

const AppointmentMonitor: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<string>("Active");

  // ডামি ডাটা - স্টেট ম্যানেজমেন্টের জন্য
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: "1", patientName: "Anisur Rahman", doctorName: "Dr. Niloy", type: "Online", time: "10:30 AM", date: "2026-05-06", status: "Active", amount: 1200 },
    { id: "2", patientName: "Karim Uddin", doctorName: "Dr. Sabuj", type: "Stationary", time: "11:45 AM", date: "2026-05-06", status: "Upcoming", amount: 800 },
    { id: "3", patientName: "Sumaiya Akter", doctorName: "Dr. Sarah", type: "Online", time: "02:15 PM", date: "2026-05-06", status: "Cancelled", amount: 1500 },
    { id: "4", patientName: "Rahim Ali", doctorName: "Dr. Niloy", type: "Stationary", time: "04:00 PM", date: "2026-05-07", status: "Upcoming", amount: 1000 },
  ]);

  // ফিল্টারিং লজিক
  const filteredData = appointments.filter(app => {
    const typeMatch = filterType === "All" || app.type === filterType;
    const tabMatch = app.status === activeTab;
    return typeMatch && tabMatch;
  });

  // স্ট্যাটাস পরিবর্তন করার ফাংশন (যেমন: Cancel করা)
  const updateStatus = (id: string, newStatus: any) => {
    setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. Header & Summary Stats */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Appointment Monitor</h1>
          <p className="text-sm text-slate-500 font-medium">Live tracking of online and offline consultations.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
          {["Active", "Upcoming", "Completed", "Cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                activeTab === tab 
                ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-100" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Filters & View Toggle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-sky-300 transition-all">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search by patient or doctor..." className="bg-transparent border-none text-sm focus:ring-0 w-full" />
          </div>
          
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
            <Filter size={16} className="text-slate-400" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border-none text-xs font-bold text-slate-600 focus:ring-0 cursor-pointer bg-transparent"
            >
              <option value="All">All Types</option>
              <option value="Online">Online Only</option>
              <option value="Stationary">Stationary Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. Appointment List (Responsive Table) */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="px-8 py-5">Patient Details</th>
                <th className="px-8 py-5">Assigned Doctor</th>
                <th className="px-8 py-5">Visit Type</th>
                <th className="px-8 py-5">Schedule</th>
                <th className="px-8 py-5">Commission (20%)</th>
                <th className="px-8 py-5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.length > 0 ? filteredData.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-800 text-sm tracking-tight">{app.patientName}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">PID: #REF-{app.id}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-sky-400" />
                      <span className="text-sm font-bold text-slate-600">{app.doctorName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border ${
                      app.type === 'Online' 
                      ? 'bg-blue-50 text-blue-600 border-blue-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {app.type === 'Online' ? <Monitor size={12} /> : <MapPin size={12} />}
                      {app.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                        <Clock size={14} className="text-slate-300" /> {app.time}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium ml-5">{app.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-slate-800 tracking-tighter">৳{(app.amount * 0.20).toFixed(0)}</span>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Fee: ৳{app.amount}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-center items-center gap-3">
                      {app.status === 'Active' && (
                        <button 
                          onClick={() => updateStatus(app.id, 'Completed')}
                          className="p-2.5 text-emerald-500 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-all"
                          title="Mark as Completed"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                      )}
                      {app.status !== 'Cancelled' && (
                        <button 
                          onClick={() => updateStatus(app.id, 'Cancelled')}
                          className="p-2.5 text-rose-500 bg-rose-50 rounded-xl hover:bg-rose-100 transition-all"
                          title="Cancel Appointment"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button className="p-2.5 text-slate-400 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <Calendar size={48} />
                      <p className="text-lg font-black uppercase tracking-widest italic">No {activeTab} Appointments Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AppointmentMonitor;