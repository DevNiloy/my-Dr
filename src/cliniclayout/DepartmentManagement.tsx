import React, { useState } from "react";
import { 
  Building2, Plus, Users, ArrowRight, 
   Edit2, Trash2, Search, Activity
} from "lucide-react";

interface Department {
  id: string;
  name: string;
  head: string;
  doctorCount: number;
  status: "Active" | "Inactive";
}

const DepartmentManagement: React.FC = () => {
  const [departments] = useState<Department[]>([
    { id: "1", name: "Cardiology", head: "Dr. Niloy Rahman", doctorCount: 8, status: "Active" },
    { id: "2", name: "Neurology", head: "Dr. Sarah Jahan", doctorCount: 5, status: "Active" },
    { id: "3", name: "Orthopedics", head: "Dr. Ariful Islam", doctorCount: 4, status: "Active" },
    { id: "4", name: "Dental Care", head: "Dr. Sabuj Ahmed", doctorCount: 3, status: "Active" },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Departments</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Organize and manage your clinic specialized units.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0EA5E9] text-white rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 text-sm"
        >
          <Plus size={20} />
          <span>Create Department</span>
        </button>
      </div>

      {/* 2. Search & Stats Overlay */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-slate-200 shadow-sm focus-within:border-sky-300 transition-all">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search departments..." 
            className="bg-transparent border-none text-sm font-bold focus:ring-0 w-full"
          />
        </div>
        <div className="bg-sky-500 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-sky-100">
           <div className="flex items-center gap-3">
              <Building2 size={24} />
              <span className="text-sm font-bold uppercase tracking-widest">Total Units</span>
           </div>
           <span className="text-2xl font-black">{departments.length}</span>
        </div>
      </div>

      {/* 3. Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {departments.map((dept) => (
          <div key={dept.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-sky-200 transition-all group relative overflow-hidden">
            {/* Subtle Background Icon */}
            <Activity className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" size={160} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0EA5E9] group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-inner">
                <Building2 size={28} />
              </div>
              <div className="flex gap-1">
                <button className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                  <Edit2 size={16} />
                </button>
                <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{dept.name}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-6 flex items-center gap-1.5">
              <Users size={12} className="text-sky-400" /> {dept.doctorCount} Doctors Assigned
            </p>

            <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Head</p>
                <p className="text-sm font-bold text-slate-600">{dept.head}</p>
              </div>
              <button className="p-2 bg-slate-50 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-all">
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Add New Placeholder Card */}
        <button 
          onClick={() => setShowAddModal(true)}
          className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-sky-300 hover:bg-sky-50/30 transition-all group"
        >
          <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-sky-500 group-hover:text-sky-500 transition-all">
            <Plus size={24} />
          </div>
          <span className="text-sm font-black uppercase tracking-widest">Add New Unit</span>
        </button>
      </div>

      {/* 4. Add Modal (Responsive) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">New Department</h3>
            
            <form className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ophthalmology" 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 placeholder:text-slate-300" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Unit Head (Doctor)</label>
                <select className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 cursor-pointer">
                   <option>Select a doctor...</option>
                   <option>Dr. Niloy Rahman</option>
                   <option>Dr. Sarah Jahan</option>
                </select>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm transition-all active:scale-95">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-sm shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95">Create Unit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;