import { useState, useEffect } from "react";
import { User, Mail, Phone, Award, MapPin, Edit3, X, Loader2, Calendar, Camera } from "lucide-react";
import { useGetPatientMeQuery, useUpdatePatientMutation } from "../../redux/api/patientApi";
import { useGetAppointmentsQuery } from "../../redux/api/appointmentApi";
import { useUploadProfilePicMutation } from "../../redux/api/userApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function PatientProfile() {
  const { data: patientData, isLoading, refetch } = useGetPatientMeQuery({});
  const patient = patientData?.data;

  const { data: appointmentsData } = useGetAppointmentsQuery({ patientId: patient?._id }, { skip: !patient?._id });
  const appointmentsCount = appointmentsData?.data?.length || 0;

  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [uploadPic, { isLoading: isUploading }] = useUploadProfilePicMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bloodGroup: "",
    address: "",
    dateOfBirth: "",
    gender: "",
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        firstName: patient.firstName || "",
        lastName: patient.lastName || "",
        phone: patient.contactNumber || "",
        bloodGroup: patient.bloodGroup || "",
        address: patient.address || "",
        dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : "",
        gender: patient.gender || "",
      });
    }
  }, [patient]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patient) return;
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        contactNumber: formData.phone,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      };
      await updatePatient({ id: 'me', data: payload }).unwrap();
      toast.success("Profile updated successfully");
      setIsModalOpen(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePic", file);

    try {
      await uploadPic(formData).unwrap();
      toast.success("Profile picture updated!");
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || "Upload failed");
    }
  };

  if (isLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="font-bold tracking-widest uppercase text-xs">Loading Profile...</p>
      </div>
    );
  }

  // Calculate age securely
  const calculatedAge = patient?.dateOfBirth 
    ? dayjs().diff(dayjs(patient.dateOfBirth), 'year') 
    : '--';

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* HEADER */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
         
         <div className="flex items-center gap-6 relative z-10">
            <div className="relative group/pic">
                <div className="w-20 h-20 rounded-3xl bg-slate-50 border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                    {patient?.profilePic ? (
                        <img src={patient.profilePic} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <User size={32} className="text-slate-300" />
                    )}
                    {isUploading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-blue-600" />
                        </div>
                    )}
                </div>
                <label className="absolute -bottom-2 -right-2 p-2 bg-white border border-slate-100 rounded-xl shadow-md cursor-pointer hover:bg-slate-50 transition-all">
                    <Camera size={14} className="text-slate-600" />
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
            </div>

            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Patient Profile</h1>
                <p className="text-sm text-slate-500 font-medium mt-1">Manage your personal information securely</p>
            </div>
         </div>

         <button
           onClick={() => setIsModalOpen(true)}
           className="relative z-10 flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-2xl hover:bg-slate-800 hover:-translate-y-1 active:scale-95 transition-all text-sm"
         >
           <Edit3 size={18} />
           <span>Edit Profile</span>
         </button>
      </div>

      {/* DASHBOARD WIDGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INFO CARD */}
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-100 p-10 shadow-2xl shadow-slate-200/40 relative">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8 border-b pb-4 border-slate-100">Personal Data</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-8">
            <ProfileItem icon={<User size={18} />} label="Full Name" value={`${patient?.firstName} ${patient?.lastName}`} />
            <ProfileItem icon={<Mail size={18} />} label="Email Address" value={patient?.user?.email} />
            <ProfileItem icon={<Phone size={18} />} label="Phone Number" value={patient?.contactNumber} />
            <ProfileItem icon={<MapPin size={18} />} label="Home Address" value={patient?.address || "Not provided"} />
            <ProfileItem icon={<Calendar size={18} />} label="Date of Birth" value={patient?.dateOfBirth ? dayjs(patient.dateOfBirth).format('MMM DD, YYYY') : '--'} />
            <ProfileItem icon={<Award size={18} />} label="Blood & Age" value={`${patient?.bloodGroup || '--'} | ${calculatedAge} years`} />
          </div>
        </div>

        {/* STATS & QUICK LINKS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-16 -mr-10 -mt-10 bg-white/10 rounded-full blur-2xl" />
             <p className="text-[10px] font-black uppercase text-blue-200 tracking-widest relative z-10">Total Appointments</p>
             <h2 className="text-5xl font-black mt-2 tracking-tighter relative z-10">{appointmentsCount}</h2>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-[2.5rem] p-8">
             <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Medical History</p>
             <h2 className="text-3xl font-black text-emerald-700 mt-2 tracking-tighter">{patient?.medicalHistory?.length || 0} Records</h2>
          </div>
        </div>

      </div>

      {/* EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => !isUpdating && setIsModalOpen(false)} />
          
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl relative z-10 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800">Update Profile</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-500 hover:text-slate-800 shadow-sm border border-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1">
               <form id="editForm" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">First Name</label>
                    <input required name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">Last Name</label>
                    <input required name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">Contact Number</label>
                    <input required name="phone" value={formData.phone} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">Date of Birth</label>
                    <input type="date" required name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none">
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">Gender</label>
                    <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none">
                      <option value="OTHER">Other</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 block">Full Address</label>
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none" />
                  </div>

               </form>
            </div>

            <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-4">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 font-black text-slate-500 hover:bg-slate-50 rounded-2xl transition">Cancel</button>
              <button form="editForm" type="submit" disabled={isUpdating} className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black shadow-lg shadow-blue-200 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50">
                {isUpdating && <Loader2 size={16} className="animate-spin" />}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const ProfileItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | undefined }) => (
  <div className="flex items-start gap-4">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center shadow-sm">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="font-bold text-slate-800 text-lg tracking-tight mt-0.5">{value || '--'}</p>
    </div>
  </div>
);
