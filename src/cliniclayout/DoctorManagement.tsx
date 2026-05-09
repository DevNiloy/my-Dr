import React, { useState } from "react";
import { 
  UserPlus, Search, Mail, Phone, MapPin,
  ShieldCheck, ShieldAlert, Trash2,  Filter, X,
  DollarSign
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  dept: string;
  specialist: string;
  status: "Active" | "Suspended";
  fee: string;
}

const DoctorManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Initial Demo Data
  const [doctors, setDoctors] = useState<Doctor[]>([
    {
      id: "1",
      name: "Dr. Niloy Rahman",
      email: "niloy@caresync.com",
      phone: "01700000000",
      dept: "Cardiology",
      specialist: "Heart Surgeon",
      status: "Active",
      fee: "1200",
    }
  ]);

  // ১. Toggle Active/Suspend Function
  const toggleStatus = (id: string) => {
    setDoctors(prev => prev.map(doc => 
      doc.id === id 
        ? { ...doc, status: doc.status === "Active" ? "Suspended" : "Active" } 
        : doc
    ));
  };

  // ২. Delete Function
  const deleteDoctor = (id: string) => {
    if(window.confirm("Are you sure you want to remove this doctor?")) {
      setDoctors(prev => prev.filter(doc => doc.id !== id));
    }
  };

  // ৩. Filter Logic
  const filteredDoctors = doctors.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    doc.dept.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Doctor Management</h1>
          <p className="text-sm text-slate-500 font-medium">Manage profiles and account access.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0EA5E9] text-white rounded-2xl font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 text-sm"
        >
          <UserPlus size={18} />
          <span>Add New Doctor</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 lg:p-5 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100 focus-within:border-sky-200 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search doctors..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm focus:ring-0 w-full"
          />
        </div>
        <button className="px-5 py-3 border border-slate-100 bg-slate-50 rounded-xl text-sm font-bold text-slate-500 flex items-center gap-2">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Doctor Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="px-8 py-5">Basic Info</th>
                <th className="px-8 py-5">Expertise</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Financials</th>
                <th className="px-8 py-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDoctors.map(doc => (
                <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center font-black text-[#0EA5E9] text-sm">
                        {doc.name.split(' ')[1]?.charAt(0) || 'D'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm tracking-tight">{doc.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1 uppercase tracking-tighter">
                          <Mail size={10}/> {doc.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{doc.dept}</span>
                      <span className="text-[10px] text-[#0EA5E9] font-bold">{doc.specialist}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase flex items-center gap-1.5 w-fit ${
                      doc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${doc.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-black text-slate-800 tracking-tighter">৳{doc.fee}</p>
                    <p className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">Comm: 20%</p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => toggleStatus(doc.id)}
                        className={`p-2.5 rounded-xl transition-all ${doc.status === 'Active' ? 'text-amber-500 bg-amber-50' : 'text-emerald-500 bg-emerald-50'}`}
                        title={doc.status === 'Active' ? 'Suspend' : 'Activate'}
                      >
                        {doc.status === 'Active' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                      </button>
                      <button onClick={() => deleteDoctor(doc.id)} className="p-2.5 text-rose-400 bg-rose-50 rounded-xl hover:text-rose-600 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Expanded Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-6 lg:p-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add New Specialist</h3>
                <p className="text-sm text-slate-400 font-medium">Complete the details to send an invitation.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-400"><X size={20}/></button>
            </div>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup label="Full Name" placeholder="Dr. Muhammad Ali" icon={<UserPlus size={16}/>} />
                <InputGroup label="Official Email" type="email" placeholder="ali@clinic.com" icon={<Mail size={16}/>} />
                <InputGroup label="Contact Phone" placeholder="+880 1XXX XXX XXX" icon={<Phone size={16}/>} />
                <InputGroup label="Consultation Fee (৳)" type="number" placeholder="1000" icon={<DollarSign size={16}/>} />
                <InputGroup label="Primary Department" isSelect options={['Cardiology', 'Neurology', 'Dental', 'Medicine']} />
                <InputGroup label="Department Specialist" placeholder="e.g. Brain Surgeon" icon={<MapPin size={16}/>} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Qualification</label>
                <textarea 
                  className="p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 min-h-[80px]" 
                  placeholder="MBBS, FCPS, MD (USA)..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm transition-all active:scale-95">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-sm shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95">Send Signup Link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const InputGroup = ({ label, isSelect, options, icon, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0EA5E9] transition-colors">{icon}</div>}
      {isSelect ? (
        <select className="w-full p-4 pl-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 appearance-none">
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          {...props} 
          className={`w-full p-4 ${icon ? 'pl-11' : 'pl-4'} bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 placeholder:text-slate-300 placeholder:font-medium`} 
        />
      )}
    </div>
  </div>
);

export default DoctorManagement;