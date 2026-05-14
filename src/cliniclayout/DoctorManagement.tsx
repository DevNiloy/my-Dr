import React, { useState, useEffect } from "react";
import { 
  UserPlus, Search, Mail, Phone, MapPin,
  ShieldCheck, ShieldAlert, Trash2,  Filter, X,
  DollarSign, Loader2
} from "lucide-react";

interface Doctor {
  id: string;
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dept: string;
  specialist: string;
  status: "Active" | "Suspended";
  fee: string;
  user: any;
  department: any;
  contactNumber: string;
  consultationFee: number;
}

const DoctorManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consultationFee: "",
    department: "Cardiology",
    specialization: "",
    qualifications: ""
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
  };

  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const url = new URL("http://localhost:5555/api/doctors");
      if (searchQuery) url.searchParams.append("search", searchQuery);

      const res = await fetch(url.toString(), {
        headers: getAuthHeaders()
      });
      const resData = await res.json();
      
      if (resData.success) {
        const mapped = resData.data.map((doc: any) => ({
          _id: doc._id,
          id: doc._id,
          name: `${doc.firstName} ${doc.lastName}`.trim() || "Doctor",
          email: doc.user?.email || "No Email",
          phone: doc.contactNumber || "N/A",
          dept: doc.department?.name || "General",
          specialist: doc.specialization || "General",
          status: doc.user?.isActive ? "Active" : "Suspended",
          fee: doc.consultationFee?.toString() || "0",
          user: doc.user,
        }));
        setDoctors(mapped);
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchDoctors();
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      setDoctors(prev => prev.map(doc => 
        doc.id === id 
          ? { ...doc, status: currentStatus === "Active" ? "Suspended" : "Active" } 
          : doc
      ));

      const res = await fetch(`http://localhost:5000/api/doctors/${id}/suspend`, {
        method: "PUT",
        headers: getAuthHeaders()
      });
      if (!res.ok) {
        window.alert("Failed to toggle status");
        fetchDoctors();
      }
    } catch (error) {
      window.alert("Error connecting to server");
      fetchDoctors();
    }
  };

  const deleteDoctor = async (id: string) => {
    if(window.confirm("Are you sure you want to completely remove this doctor? This cannot be undone.")) {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/${id}`, {
          method: "DELETE",
          headers: getAuthHeaders()
        });
        if (res.ok) {
          setDoctors(prev => prev.filter(doc => doc.id !== id));
        } else {
          window.alert("Failed to delete doctor");
        }
      } catch (error) {
        window.alert("Error deleting doctor");
      }
    }
  };

  const handleAddDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/doctors", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setFormData({ firstName: "", lastName: "", email: "", phone: "", consultationFee: "", department: "Cardiology", specialization: "", qualifications: "" });
        fetchDoctors();
        window.alert("Doctor successfully added! An email has been sent with their credentials.");
      } else {
        window.alert(data.message || "Failed to add doctor");
      }
    } catch (error) {
      window.alert("Network error while trying to add doctor");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

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
            placeholder="Search doctors by name or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none"
          />
        </div>
        <button className="px-5 py-3 border border-slate-100 bg-slate-50 rounded-xl text-sm font-bold text-slate-500 flex items-center gap-2">
          <Filter size={18} /> Filter
        </button>
      </div>

      {/* Doctor Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex w-full h-full min-h-[400px] items-center justify-center">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin" />
          </div>
        ) : (
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
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-10 text-center text-slate-400 font-medium">No doctors found.</td>
                  </tr>
                ) : doctors.map(doc => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-sky-50 flex items-center justify-center font-black text-[#0EA5E9] text-sm">
                          {doc.name.split(' ')[0]?.charAt(0) || 'D'}
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
                          onClick={() => toggleStatus(doc.id, doc.status)}
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
        )}
      </div>

      {/* Modal - Expanded Form */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-6 lg:p-10 animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add New Specialist</h3>
                <p className="text-sm text-slate-400 font-medium">Complete the details to send an invitation with auto-generated credentials.</p>
              </div>
              <button disabled={isSubmitting} onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200"><X size={20}/></button>
            </div>
            
            <form className="space-y-6" onSubmit={handleAddDoctor}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="First Name" 
                  value={formData.firstName} 
                  onChange={(e: any) => handleInputChange("firstName", e.target.value)} 
                  required 
                  placeholder="Muhammad" 
                  icon={<UserPlus size={16}/>} 
                />
                <InputGroup 
                  label="Last Name" 
                  value={formData.lastName} 
                  onChange={(e: any) => handleInputChange("lastName", e.target.value)} 
                  required 
                  placeholder="Ali" 
                  icon={<UserPlus size={16}/>} 
                />
                <InputGroup 
                  label="Official Email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e: any) => handleInputChange("email", e.target.value)} 
                  required 
                  placeholder="ali@clinic.com" 
                  icon={<Mail size={16}/>} 
                />
                <InputGroup 
                  label="Contact Phone" 
                  value={formData.phone} 
                  onChange={(e: any) => handleInputChange("phone", e.target.value)} 
                  required 
                  placeholder="+880 1XXX XXX XXX" 
                  icon={<Phone size={16}/>} 
                />
                <InputGroup 
                  label="Consultation Fee (৳)" 
                  type="number" 
                  value={formData.consultationFee} 
                  onChange={(e: any) => handleInputChange("consultationFee", e.target.value)} 
                  required 
                  placeholder="1000" 
                  icon={<DollarSign size={16}/>} 
                />
                <InputGroup 
                  label="Primary Department" 
                  isSelect 
                  value={formData.department} 
                  onChange={(e: any) => handleInputChange("department", e.target.value)} 
                  options={['Cardiology', 'Neurology', 'Dental', 'Medicine', 'Orthopedics']} 
                />
                <InputGroup 
                  label="Department Specialist" 
                  value={formData.specialization} 
                  onChange={(e: any) => handleInputChange("specialization", e.target.value)} 
                  required 
                  placeholder="e.g. Brain Surgeon" 
                  icon={<MapPin size={16}/>} 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Qualification</label>
                <textarea 
                  value={formData.qualifications}
                  onChange={(e) => handleInputChange("qualifications", e.target.value)}
                  className="p-4 bg-slate-50 border-none rounded-2xl font-bold outline-none text-slate-700 focus:ring-2 focus:ring-sky-500 min-h-[80px]" 
                  placeholder="MBBS, FCPS, MD (USA)..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" disabled={isSubmitting} onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm transition-all active:scale-95 disabled:opacity-50">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-4 bg-[#0EA5E9] text-white flex items-center justify-center rounded-2xl font-black text-sm shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Signup Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-components ---

const InputGroup = ({ label, isSelect, options, icon, onChange, value, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative group">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0EA5E9] transition-colors">{icon}</div>}
      {isSelect ? (
        <select value={value} onChange={onChange} className="w-full p-4 pl-4 outline-none bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 appearance-none">
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          {...props} 
          value={value}
          onChange={onChange}
          className={`w-full outline-none p-4 ${icon ? 'pl-11' : 'pl-4'} bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 placeholder:text-slate-300 placeholder:font-medium`} 
        />
      )}
    </div>
  </div>
);

export default DoctorManagement;