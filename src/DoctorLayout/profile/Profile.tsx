import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Edit3,
  ShieldCheck,
  Hospital,
  Users,
  Loader2,
  X,
  Camera,
  AlertCircle,
  Save,
  CheckCircle,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import {
  useGetDoctorMeQuery,
  useUpdateDoctorMeMutation,
} from "../../redux/api/doctorApi";
import { useGetStripeStatusQuery } from "../../redux/api/paymentApi";
import { useUploadProfilePicMutation } from "../../redux/api/userApi";
import { toast } from "react-toastify";

export default function Profile() {
  const { data: doctorData, isLoading: isFetching } = useGetDoctorMeQuery({});
  const { data: stripeData } = useGetStripeStatusQuery({});
  const [updateProfile, { isLoading: isUpdating }] = useUpdateDoctorMeMutation();
  const [uploadPic, { isLoading: isUploading }] = useUploadProfilePicMutation();

  const [editModal, setEditModal] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    specialization: "",
    bio: "",
    consultationFee: 0,
    experienceYears: 0,
  });

  useEffect(() => {
    if (doctorData?.data) {
      const d = doctorData.data;
      setFormData({
        firstName: d.firstName || "",
        lastName: d.lastName || "",
        contactNumber: d.contactNumber || "",
        specialization: d.specialization || "",
        bio: d.bio || "",
        consultationFee: d.consultationFee || 0,
        experienceYears: d.experienceYears || 0,
      });
    }
  }, [doctorData]);

  const handleSave = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      setEditModal(false);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to update profile");
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
    } catch (err: any) {
      toast.error(err.data?.message || "Upload failed");
    }
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const doctor = doctorData?.data;

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header Section - Clean & Direct */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
          <div className="relative group">
            <div className="w-28 h-28 lg:w-32 lg:h-32 bg-slate-50 rounded-full border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
               {doctor?.profilePic ? (
                 <img src={doctor.profilePic} alt="Profile" className="w-full h-full object-cover" />
               ) : (
                 <User size={56} className="text-slate-300" />
               )}
               {isUploading && (
                 <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <Loader2 size={24} className="animate-spin text-blue-600" />
                 </div>
               )}
            </div>
            <label className="absolute bottom-1 right-1 p-2.5 bg-white border border-slate-100 text-slate-600 rounded-full shadow-lg hover:bg-slate-50 transition-all cursor-pointer">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                Dr. {doctor?.firstName} {doctor?.lastName}
              </h1>
              <ShieldCheck size={20} className="text-blue-500" />
            </div>
            <p className="text-slate-500 font-semibold mb-3 flex items-center justify-center md:justify-start gap-2">
               <span className="text-blue-600 px-2.5 py-0.5 bg-blue-50 rounded-md text-xs font-bold uppercase tracking-wider">
                  {doctor?.specialization}
               </span>
               <span className="text-slate-300">•</span>
               <span className="text-sm">{doctor?.experienceYears} Years Experience</span>
            </p>
            <div className="flex items-center justify-center md:justify-start gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest">Active Practitioner</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setEditModal(true)}
          className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
        >
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Professional Info */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white border border-slate-200 rounded-3xl p-8">
                <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2 border-b border-slate-50 pb-4">
                    <AlertCircle size={18} className="text-slate-400" />
                    Professional Biography
                </h3>
                <p className="text-slate-600 leading-relaxed font-medium">
                  {doctor?.bio || "No professional biography has been provided yet. Keeping your profile updated helps patients understand your expertise and approach to care."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-between group">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Consultation Fee</p>
                        <h4 className="text-3xl font-bold text-slate-900 tracking-tight">${doctor?.consultationFee}</h4>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Wallet size={20} />
                    </div>
                </div>
                <div className="bg-white border border-slate-200 rounded-3xl p-8 flex items-center justify-between group">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Patients Treated</p>
                        <h4 className="text-3xl font-bold text-slate-900 tracking-tight">1.2k+</h4>
                    </div>
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                        <Users size={20} />
                    </div>
                </div>
            </div>
        </div>

        {/* 3. Identity Details & Status */}
        <div className="space-y-8">
            <div className="bg-slate-50 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-3">Contact Information</h3>
                
                <div className="space-y-5">
                    <ContactRow icon={<Mail size={16} />} label="Email" val={doctor?.user?.email} />
                    <ContactRow icon={<Phone size={16} />} label="Phone" val={doctor?.contactNumber} />
                    <ContactRow icon={<Hospital size={16} />} label="Department" val={doctor?.department?.name || "N/A"} />
                </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 space-y-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-slate-50 pb-3">Account Security</h3>
                <div className="space-y-4">
                  {stripeData?.data?.isStripeAccountVerified ? (
                    <div className="flex items-center gap-3 text-emerald-600 p-3 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <CheckCircle size={18} />
                      <span className="text-xs font-bold">Stripe Verified Merchant</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 text-rose-600 p-3 bg-rose-50 rounded-2xl border border-rose-100">
                      <AlertTriangle size={18} />
                      <span className="text-xs font-bold">Incomplete Onboarding</span>
                    </div>
                  )}
                </div>
            </div>
        </div>
      </div>

      {/* 4. MODAL - Clean & Minimalist */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Update Profile</h2>
              <button onClick={() => setEditModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <MinimalInput label="First Name" value={formData.firstName} onChange={(v: string) => setFormData({...formData, firstName: v})} />
                <MinimalInput label="Last Name" value={formData.lastName} onChange={(v: string) => setFormData({...formData, lastName: v})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <MinimalInput label="Phone Number" value={formData.contactNumber} onChange={(v: string) => setFormData({...formData, contactNumber: v})} />
                <MinimalInput label="Specialization" value={formData.specialization} onChange={(v: string) => setFormData({...formData, specialization: v})} />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <MinimalInput label="Fee ($)" type="number" value={formData.consultationFee.toString()} onChange={(v: string) => setFormData({...formData, consultationFee: Number(v)})} />
                <MinimalInput label="Experience (Years)" type="number" value={formData.experienceYears.toString()} onChange={(v: string) => setFormData({...formData, experienceYears: Number(v)})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase">Professional Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={4}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
                  placeholder="Tell patients about your background..."
                />
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-4">
              <button onClick={() => setEditModal(false)} className="flex-1 py-3 font-bold text-slate-500 hover:text-slate-700 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={isUpdating} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                {isUpdating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const ContactRow = ({ icon, label, val }: any) => (
    <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-700 truncate max-w-[150px]">{val}</p>
        </div>
    </div>
);

const MinimalInput = ({ label, value, onChange, type = "text" }: any) => (
    <div className="space-y-2">
        <label className="text-xs font-bold text-slate-500 uppercase">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all outline-none"
        />
    </div>
);
