import React, { useState, useEffect } from "react";
import { 
  Building2, Plus, Users, ArrowRight, 
   Edit2, Trash2, Search, Activity, Eye, X, Loader2
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { 
  useGetDepartmentsQuery, 
  useAddDepartmentMutation, 
  useUpdateDepartmentMutation, 
  useDeleteDepartmentMutation 
} from "../redux/api/departmentApi";
import { useGetDoctorsQuery } from "../redux/api/doctorApi";
import Pagination from "../shared_components/Pagination";

const DepartmentManagement: React.FC = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  // Debouncing search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // RTK Queries & Mutations
  const { data: deptData, isLoading, isError, refetch: refetchDepts } = useGetDepartmentsQuery({ 
    search: debouncedSearch, 
    page: currentPage, 
    limit: 6 
  });
  const { data: doctorRes } = useGetDoctorsQuery({ limit: 100 });
  const [addDept, { isLoading: isAdding }] = useAddDepartmentMutation();
  const [updateDept, { isLoading: isUpdating }] = useUpdateDepartmentMutation();
  const [deleteDept] = useDeleteDepartmentMutation();

  const departments = deptData?.data || [];
  const meta = deptData?.meta || { totalPages: 1 };
  const doctors = doctorRes?.data || [];

  // Re-fetch when showAddModal closes or on specific events if tag invalidation is flaky
  useEffect(() => {
    if (!showAddModal && !showDetailsModal) {
      refetchDepts();
    }
  }, [showAddModal, showDetailsModal, refetchDepts]);

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({ name: "", description: "" });
    setShowAddModal(true);
  };

  const handleOpenEdit = (dept: any) => {
    setIsEditing(true);
    setFormData({ 
      name: dept.name, 
      description: dept.description || ""
    });
    setSelectedDept(dept);
    setShowAddModal(true);
  };

  const handleOpenDetails = (dept: any) => {
    setSelectedDept(dept);
    setShowDetailsModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateDept({ id: selectedDept._id, ...formData }).unwrap();
        toast.success("Department updated successfully!");
      } else {
        await addDept(formData).unwrap();
        toast.success("Department created successfully!");
      }
      setShowAddModal(false);
    } catch (error: any) {
      toast.error(error.data?.message || "Operation failed.");
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Department?",
      text: "This will remove the unit from the system!",
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
        await deleteDept(id).unwrap();
        Swal.fire({
          title: "Deleted!",
          text: "The department has been removed.",
          icon: "success",
          background: "#FFFFFF"
        });
      } catch (error) {
        toast.error("Failed to delete department.");
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Departments</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Organize and manage your clinic specialized units.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-sm font-bold focus:ring-0 w-full"
          />
        </div>
        <div className="bg-sky-500 p-4 rounded-2xl flex items-center justify-between text-white shadow-lg shadow-sky-100">
           <div className="flex items-center gap-3">
              <Building2 size={24} />
              <span className="text-sm font-bold uppercase tracking-widest">Total Units</span>
           </div>
           <span className="text-2xl font-black">{meta.total || departments.length}</span>
        </div>
      </div>

      {/* 3. Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading ? (
           <div className="col-span-full flex h-60 items-center justify-center">
             <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
           </div>
        ) : departments.length === 0 ? (
          <div className="col-span-full h-60 flex items-center justify-center bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 text-slate-400 font-bold">
             No departments found.
          </div>
        ) : departments.map((dept: any) => (
          <div key={dept._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:border-sky-200 transition-all group relative overflow-hidden">
            <Activity className="absolute -right-4 -bottom-4 text-slate-50 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity" size={160} />
            
            <div className="flex justify-between items-start mb-6">
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0EA5E9] group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shadow-inner">
                <Building2 size={28} />
              </div>
              <div className="flex gap-1 z-10">
                <button onClick={() => handleOpenDetails(dept)} className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                  <Eye size={18} />
                </button>
                <button onClick={() => handleOpenEdit(dept)} className="p-2 text-slate-300 hover:text-sky-500 hover:bg-sky-50 rounded-xl transition-all">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(dept._id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">{dept.name}</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter mb-6 flex items-center gap-1.5">
              <Users size={12} className="text-sky-400" /> {dept.doctorCount || 0} Doctors Assigned
            </p>

            <div className="pt-6 border-t border-slate-50 flex flex-col gap-3">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Practitioners</p>
                <div className="flex flex-wrap gap-1.5">
                   {dept.doctors && dept.doctors.length > 0 ? dept.doctors.slice(0, 3).map((doc: any) => (
                      <span key={doc._id} className="px-2.5 py-1 bg-slate-50 text-slate-600 text-[10px] font-black rounded-lg border border-slate-100 shadow-sm group-hover:bg-white transition-all">
                         {doc.firstName} {doc.lastName}
                      </span>
                   )) : <span className="text-[10px] text-slate-300 font-bold italic pl-1">No staff assigned</span>}
                   {dept.doctors && dept.doctors.length > 3 && (
                      <span className="text-[10px] text-sky-500 font-black pl-1">+{dept.doctors.length - 3} More</span>
                   )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {!isLoading && (
          <button 
            onClick={handleOpenAdd}
            className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 text-slate-400 hover:border-sky-300 hover:bg-sky-50/30 transition-all group min-h-[250px]"
          >
            <div className="w-12 h-12 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-sky-500 group-hover:text-sky-500 transition-all">
              <Plus size={24} />
            </div>
            <span className="text-sm font-black uppercase tracking-widest">Add New Unit</span>
          </button>
        )}
      </div>

      {/* Pagination */}
      <Pagination 
        currentPage={currentPage}
        totalPages={meta.totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 lg:p-10 animate-in zoom-in-95">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">
              {isEditing ? "Edit Department" : "New Department"}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Department Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Ophthalmology" 
                  required
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 placeholder:text-slate-300 shadow-sm" 
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description / Details</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Unit details, special equipment, floor number..." 
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 placeholder:text-slate-300 shadow-sm min-h-[100px]" 
                />
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm transition-all active:scale-95">Cancel</button>
                <button type="submit" disabled={isAdding || isUpdating} className="flex-1 py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-sm shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center">
                  {isAdding || isUpdating ? <Loader2 className="animate-spin" /> : (isEditing ? "Update Unit" : "Create Unit")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedDept && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowDetailsModal(false)} />
          <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl p-10 lg:p-14 animate-in zoom-in-95 overflow-hidden">
            <Building2 className="absolute -right-10 -top-10 text-slate-50 opacity-10" size={200} />
            <div className="flex justify-between items-start mb-10 relative">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-sky-50 rounded-[2rem] flex items-center justify-center text-sky-500">
                  <Building2 size={40} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedDept.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-full">Unit Active</span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">{selectedDept.doctorCount || 0} Staff Members</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setShowDetailsModal(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative">
               <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Unit Staff</h4>
                    <div className="flex flex-col gap-2">
                       {selectedDept.doctors && selectedDept.doctors.length > 0 ? selectedDept.doctors.map((doc: any) => (
                          <div key={doc._id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100 shadow-sm">
                             <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 font-black text-xs">
                                {doc.firstName.charAt(0)}
                             </div>
                             <span className="text-sm font-bold text-slate-700">{doc.firstName} {doc.lastName}</span>
                          </div>
                       )) : (
                          <p className="text-sm font-bold text-slate-400 italic">No specialist staff assigned to this unit.</p>
                       )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</h4>
                    <p className="text-sm font-bold text-slate-600 italic bg-white p-3 rounded-xl border border-slate-50 shadow-sm leading-relaxed">
                       {selectedDept.description || "No unit description provided."}
                    </p>
                  </div>
               </div>
               
               <div className="bg-slate-50 p-6 rounded-[2rem]">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Unit Statistics</h4>
                  <div className="space-y-4">
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-bold">Total Doctors</span>
                        <span className="text-sm font-black text-sky-500">{selectedDept.doctorCount || 0}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-bold">Patient Capacity</span>
                        <span className="text-sm font-black text-slate-700">High</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-bold">Efficiency</span>
                        <span className="text-sm font-black text-emerald-500">98%</span>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-12 pt-10 border-t border-slate-100 flex gap-4 relative">
               <button 
                 onClick={() => setShowDetailsModal(false)}
                 className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm active:scale-95 transition-all"
               >
                 Close Report
               </button>
               <button 
                onClick={() => { setShowDetailsModal(false); handleOpenEdit(selectedDept); }}
                className="flex-1 py-4 bg-sky-500 text-white rounded-2xl font-black text-sm shadow-lg shadow-sky-100 active:scale-95 transition-all"
               >
                 Edit Configuration
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentManagement;