import React, { useState, useEffect } from "react";
import { 
  UserPlus, Search, Mail, Phone, MapPin,
  ShieldCheck, ShieldAlert, Trash2,  Filter, X,
  DollarSign, Loader2, Eye, Edit2
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  useGetDoctorsQuery, 
  useAddDoctorMutation, 
  useUpdateDoctorMutation,
  useSuspendDoctorMutation, 
  useDeleteDoctorMutation 
} from "../redux/api/doctorApi";
import { useGetDepartmentsQuery } from "../redux/api/departmentApi";
import Pagination from "../shared_components/Pagination";

const DoctorManagement: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  // RTK Queries & Mutations
  const { data: doctorRes, isLoading, isError } = useGetDoctorsQuery({ 
    search: debouncedSearch, 
    page: currentPage,
    limit: 10,
    department: selectedDepartment
  });
  
  const { data: deptRes } = useGetDepartmentsQuery({ limit: 100 });
  const allDepartments = deptRes?.data || [];
  
  const [addDoctor, { isLoading: isAdding }] = useAddDoctorMutation();
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation();
  const [suspendDoctor] = useSuspendDoctorMutation();
  const [deleteDoctorMutation] = useDeleteDoctorMutation();

  const doctors = doctorRes?.data || [];
  const meta = doctorRes?.meta || { totalPages: 1 };

  // Form states
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    consultationFee: "",
    department: "",
    specialization: "",
    qualifications: ""
  });

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      await suspendDoctor(id).unwrap();
      toast.success(currentStatus === "Active" ? "Doctor suspended" : "Doctor activated");
    } catch (error) {
      toast.error("Status toggle failed.");
    }
  };

  const deleteDoctor = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Profile?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete",
      background: "#FFFFFF",
      customClass: {
        title: "font-black text-slate-800",
        confirmButton: "rounded-xl font-bold",
        cancelButton: "rounded-xl font-bold"
      }
    });

    if (result.isConfirmed) {
      try {
        await deleteDoctorMutation(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "Specialist profile removed.",
          icon: "success",
          background: "#FFFFFF"
        });
      } catch (error) {
        toast.error("Failed to delete profile.");
      }
    }
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ firstName: "", lastName: "", email: "", phone: "", consultationFee: "", department: "", specialization: "", qualifications: "" });
    setShowAddModal(true);
  };

  const handleOpenEdit = (doc: any) => {
    setIsEditing(true);
    setSelectedDoctor(doc);
    setFormData({
      firstName: doc.docRaw.firstName,
      lastName: doc.docRaw.lastName,
      email: doc.docRaw.user?.email || "",
      phone: doc.docRaw.contactNumber,
      consultationFee: doc.docRaw.consultationFee,
      department: doc.docRaw.department?.name || "",
      specialization: doc.docRaw.specialization,
      qualifications: doc.docRaw.bio || ""
    });
    setShowAddModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDoctor({ id: selectedDoctor.id, ...formData }).unwrap();
        toast.success("Doctor profile updated successfully!");
      } else {
        await addDoctor(formData).unwrap();
        toast.success("Doctor added and invitation dispatched!");
      }
      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Operation failed.");
    }
  };

  const openDetails = (doc: any) => {
    setSelectedDoctor(doc);
    setShowDetailsModal(true);
  };

  const mappedDoctors = doctors.map((doc: any) => ({
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
    bio: doc.bio,
    docRaw: doc
  }));

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Doctor Management</h1>
          <p className="text-sm text-slate-500 font-medium">Manage specialist profiles and secure account access.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0EA5E9] text-white rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95 text-sm"
        >
          <UserPlus size={18} />
          <span>Add New Doctor</span>
        </button>
      </div>

      <div className="bg-white p-4 lg:p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-4 py-3.5 rounded-2xl border border-slate-100 focus-within:border-sky-200 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search doctors by name or specialization..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none font-bold"
          />
        </div>
        <div className="relative">
          <select 
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="pl-6 pr-10 py-3.5 border border-slate-100 bg-white rounded-2xl text-sm font-bold text-slate-500 appearance-none shadow-sm cursor-pointer focus:ring-2 focus:ring-sky-500 outline-none h-full"
          >
            <option value="">All Departments</option>
            {allDepartments.map((dept: any) => (
              <option key={dept._id} value={dept._id}>{dept.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
             <Filter size={16} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
            <span className="font-bold text-slate-400">Loading Directory...</span>
          </div>
        ) : isError ? (
           <div className="flex items-center justify-center h-[400px] text-rose-400 font-bold">Failed to connect to directory.</div>
        ) : (
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Specialist</th>
                  <th className="px-8 py-5">Assignment</th>
                  <th className="px-8 py-5">Security Status</th>
                  <th className="px-8 py-5">Financials</th>
                  <th className="px-8 py-5 text-center">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {mappedDoctors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-bold">No results found for your query.</td>
                  </tr>
                ) : (mappedDoctors).map((doc: any) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center font-black text-[#0EA5E9] text-base group-hover:scale-105 transition-all">
                          {doc.name.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800 text-[15px] tracking-tight">{doc.name}</span>
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">{doc.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-slate-700 uppercase">{doc.dept}</span>
                        <span className="text-[11px] text-[#0EA5E9] font-bold mt-0.5">{doc.specialist}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 ${
                        doc.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${doc.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className="text-[15px] font-black text-slate-800 tracking-tighter">৳{doc.fee}</p>
                      <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Visit Fee</p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openDetails(doc)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-sky-500 hover:bg-sky-50 transition-all shadow-sm">
                          <Eye size={18} />
                        </button>
                        <button onClick={() => handleOpenEdit(doc)} className="p-2.5 bg-slate-50 rounded-xl text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all shadow-sm">
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => toggleStatus(doc.id, doc.status)} 
                          className={`p-2.5 rounded-xl transition-all shadow-sm ${doc.status === 'Active' ? 'text-amber-600 bg-amber-50 hover:bg-amber-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                        >
                          {doc.status === 'Active' ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                        </button>
                        <button onClick={() => deleteDoctor(doc.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 hover:text-rose-600 transition-all shadow-sm">
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

      <Pagination 
        currentPage={currentPage}
        totalPages={meta.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Details Modal */}
      {showDetailsModal && selectedDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 animate-in zoom-in-95 overflow-hidden">
             <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-sky-50 rounded-[2rem] flex items-center justify-center text-sky-500 font-black text-3xl shadow-inner">
                      {selectedDoctor.name.charAt(0)}
                   </div>
                   <div>
                      <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedDoctor.name}</h3>
                      <p className="text-sky-500 font-black text-sm uppercase tracking-widest mt-1">{selectedDoctor.specialist}</p>
                   </div>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-400 transition-all">
                  <X size={24} />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-6">
                   <DetailItem label="Official Email" value={selectedDoctor.email} icon={<Mail size={16}/>} />
                   <DetailItem label="Contact Phone" value={selectedDoctor.phone} icon={<Phone size={16}/>} />
                   <DetailItem label="Department" value={selectedDoctor.dept} icon={<MapPin size={16}/>} />
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] space-y-4">
                   <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">Professional Qualifications</h4>
                   <p className="text-sm font-bold text-slate-600 leading-relaxed bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      {selectedDoctor.bio || "No qualification bio provided."}
                   </p>
                </div>
             </div>

             <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between relative z-10">
                <div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Consultation Fee</span>
                   <p className="text-2xl font-black text-[#0EA5E9] tracking-tighter">৳{selectedDoctor.fee}</p>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-200">
                  Close Profile
                </button>
             </div>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl p-8 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-8">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight text-center w-full">
                {isEditing ? "Edit Specialist Profile" : "Hire New Specialist"}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200"><X size={20}/></button>
            </div>
            
            <form className="space-y-6" onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputGroup 
                  label="First Name" 
                  value={formData.firstName} 
                  onChange={(e: any) => setFormData({...formData, firstName: e.target.value})} 
                  required 
                  placeholder="Muhammad" 
                />
                <InputGroup 
                  label="Last Name" 
                  value={formData.lastName} 
                  onChange={(e: any) => setFormData({...formData, lastName: e.target.value})} 
                  required 
                  placeholder="Ali" 
                />
                <InputGroup 
                  label="Email" 
                  type="email" 
                  value={formData.email} 
                  onChange={(e: any) => setFormData({...formData, email: e.target.value})} 
                  required 
                  placeholder="ali@clinic.com" 
                />
                <InputGroup 
                  label="Phone" 
                  value={formData.phone} 
                  onChange={(e: any) => setFormData({...formData, phone: e.target.value})} 
                  required 
                  placeholder="+880" 
                />
                <InputGroup 
                  label="Fee (৳)" 
                  type="number" 
                  value={formData.consultationFee} 
                  onChange={(e: any) => setFormData({...formData, consultationFee: e.target.value})} 
                  required 
                />
                <InputGroup 
                  label="Department" 
                  isSelect 
                  value={formData.department} 
                  onChange={(e: any) => setFormData({...formData, department: e.target.value})} 
                  options={allDepartments.map((d: any) => d.name)} 
                />
                <InputGroup 
                  label="Specialization" 
                  value={formData.specialization} 
                  onChange={(e: any) => setFormData({...formData, specialization: e.target.value})} 
                  required 
                  placeholder="Specialization..." 
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bio / Qualifications</label>
                <textarea 
                  value={formData.qualifications}
                  onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                  className="p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 min-h-[80px] focus:ring-2 focus:ring-sky-500" 
                  placeholder="Qualifications..."
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm shadow-sm active:scale-95">Cancel</button>
                <button type="submit" disabled={isAdding || isUpdating} className="flex-1 py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-sm shadow-lg shadow-sky-100 active:scale-95 flex items-center justify-center">
                  {isAdding || isUpdating ? <Loader2 className="animate-spin" /> : (isEditing ? "Update Profile" : "Dispatch Hire")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, icon }: any) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">{label}</span>
    <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
      <div className="text-sky-500">{icon}</div>
      <span className="font-bold text-slate-700 text-sm tracking-tight">{value}</span>
    </div>
  </div>
);

const InputGroup = ({ label, isSelect, options, onChange, value, ...props }: any) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
    {isSelect ? (
      <select value={value} onChange={onChange} className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 appearance-none shadow-sm cursor-pointer">
        {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    ) : (
      <input 
        {...props} 
        value={value}
        onChange={onChange}
        className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 shadow-sm" 
      />
    )}
  </div>
);

export default DoctorManagement;