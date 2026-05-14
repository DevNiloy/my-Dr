import { useState, useEffect } from "react";
import {
  User,
  Phone,
  Mail,
  Edit3,
  ShieldCheck,
  Award,
  Hospital,
  Users,
  CalendarCheck,
  Star,
  Loader2,
  X,
  Camera,
  Briefcase,
  AlertCircle,
  Save,
  CreditCard,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  useGetDoctorMeQuery,
  useUpdateDoctorMeMutation,
} from "../../redux/api/doctorApi";
import { useGetStripeStatusQuery } from "../../redux/api/paymentApi";
import { toast } from "react-toastify";

export default function Profile() {
  const { data: doctorData, isLoading: isFetching } = useGetDoctorMeQuery({});
  const { data: stripeData } = useGetStripeStatusQuery({});
  const [updateProfile, { isLoading: isUpdating }] =
    useUpdateDoctorMeMutation();

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

  if (isFetching) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
        <p className="font-bold tracking-widest uppercase text-xs">
          Loading Profile...
        </p>
      </div>
    );
  }

  const doctor = doctorData?.data;

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-10 animate-in fade-in duration-1000">
      {/* 1. HERO SECTION */}
      <div className="relative">
        {/* Decorative Background */}
        <div className="h-48 lg:h-64 bg-gradient-to-r from-[#0EA5E9] to-indigo-600 rounded-[2.5rem] shadow-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        </div>

        {/* Profile Info Overlay */}
        <div className="px-6 lg:px-12 -mt-20 lg:-mt-24 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8">
              <div className="relative group">
                <div className="w-32 h-32 lg:w-44 lg:h-44 bg-white p-2 rounded-[2.5rem] shadow-2xl">
                  <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center text-[#0EA5E9] overflow-hidden group-hover:scale-95 transition-transform duration-500">
                    <User
                      size={64}
                      className="group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>
                <button className="absolute bottom-2 right-2 p-3 bg-white text-slate-600 rounded-2xl shadow-xl hover:bg-[#0EA5E9] hover:text-white transition-all transform active:scale-90 border border-slate-50">
                  <Camera size={18} />
                </button>
              </div>

              <div className="mb-2">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-3xl lg:text-5xl font-black text-slate-800 tracking-tight">
                    Dr. {doctor?.firstName} {doctor?.lastName}
                  </h1>
                  <ShieldCheck size={28} className="text-sky-500" />
                </div>
                <div className="flex flex-wrap items-center gap-4 text-slate-500 font-bold">
                  <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg text-xs tracking-wider uppercase border border-slate-100">
                    <Award size={14} className="text-[#0EA5E9]" />{" "}
                    {doctor?.specialization}
                  </span>
                  <span className="flex items-center gap-1.5 text-sm uppercase tracking-widest text-[10px]">
                    <Briefcase size={14} /> {doctor?.experienceYears} Years Exp.
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setEditModal(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-2xl hover:bg-slate-800 hover:-translate-y-1 transition-all active:scale-95 text-sm mb-2"
            >
              <Edit3 size={18} />
              <span>Edit Account</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* 2. CONTACT & DETAILS */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8">
            <h3 className="font-black text-slate-800 uppercase text-[12px] tracking-[0.2em] mb-4">
              Identity & Contact
            </h3>

            <div className="space-y-6">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-sky-50 text-sky-500 rounded-2xl">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Digital Address
                  </p>
                  <p className="font-bold text-slate-700">
                    {doctor?.user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Verified Contact
                  </p>
                  <p className="font-bold text-slate-700">
                    {doctor?.contactNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
                  <Hospital size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Current Posting
                  </p>
                  <p className="font-bold text-slate-700">
                    {doctor?.department?.name || "City General Hospital"}
                  </p>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center justify-between text-center px-4">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Fee
                </p>
                <p className="text-xl font-black text-slate-800">
                  ৳{doctor?.consultationFee}
                </p>
              </div>
              <div className="w-px h-8 bg-slate-100" />
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  Clinic
                </p>
                <p className="text-[10px] items-center gap-1 flex font-black text-emerald-500 uppercase">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />{" "}
                  Live
                </p>
              </div>
            </div>

            {/* Stripe Status Section */}
            <div className="h-px bg-slate-100" />

            <div className="space-y-4">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Payment Status
              </p>
              {stripeData?.data?.isStripeAccountVerified ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
                  <CheckCircle
                    size={20}
                    className="text-emerald-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-black text-emerald-900 text-sm">
                      Stripe Verified ✓
                    </p>
                    <p className="text-xs text-emerald-700 font-medium">
                      You're public and accepting payments
                    </p>
                  </div>
                </div>
              ) : stripeData?.data?.stripeOnboardingComplete ? (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <Clock
                    size={20}
                    className="text-amber-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-black text-amber-900 text-sm">
                      Pending Verification
                    </p>
                    <p className="text-xs text-amber-700 font-medium">
                      Stripe is reviewing your account...
                    </p>
                  </div>
                </div>
              ) : stripeData?.data?.stripeAccountId ? (
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle
                    size={20}
                    className="text-blue-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-black text-blue-900 text-sm">
                      Onboarding Started
                    </p>
                    <p className="text-xs text-blue-700 font-medium">
                      Complete your Stripe setup
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertTriangle
                    size={20}
                    className="text-red-600 mt-0.5 flex-shrink-0"
                  />
                  <div>
                    <p className="font-black text-red-900 text-sm">
                      Not Set Up
                    </p>
                    <p className="text-xs text-red-700 font-medium">
                      Go to Availability to set up Stripe
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. BIO & ACHIEVEMENTS */}
        <div className="lg:col-span-8 space-y-8">
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
            <h3 className="font-black text-slate-800 uppercase text-[12px] tracking-[0.2em] mb-6 flex items-center gap-2">
              Professional Bio
            </h3>
            <p className="text-slate-600 font-medium leading-relaxed lg:text-lg">
              {doctor?.bio ||
                "No professional biography provided. Add your medical background, research interests, and patient care philosophy to help patients understand your expertise."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Users size={24} />}
              label="Total Patients"
              value="1.2k+"
              color="bg-indigo-50 text-indigo-600"
            />
            <StatCard
              icon={<CalendarCheck size={24} />}
              label="Appointments"
              value="840"
              color="bg-sky-50 text-sky-600"
            />
            <StatCard
              icon={<Star size={24} />}
              label="Avg. Rating"
              value="4.9"
              color="bg-amber-50 text-amber-600"
            />
          </div>
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setEditModal(false)}
          />

          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in slide-in-from-bottom-5 duration-500">
            {/* Modal Header */}
            <div className="bg-slate-50 p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800">
                  Edit Profile
                </h2>
                <p className="text-sm text-slate-500 font-medium tracking-tight">
                  Update your public professional identity.
                </p>
              </div>
              <button
                onClick={() => setEditModal(false)}
                className="p-3 bg-white text-slate-400 hover:text-slate-600 rounded-2xl shadow-sm transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="First Name"
                  value={formData.firstName}
                  onChange={(v: string) =>
                    setFormData({ ...formData, firstName: v })
                  }
                  placeholder="e.g. John"
                />
                <InputGroup
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(v: string) =>
                    setFormData({ ...formData, lastName: v })
                  }
                  placeholder="e.g. Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Phone Number"
                  value={formData.contactNumber}
                  onChange={(v: string) =>
                    setFormData({ ...formData, contactNumber: v })
                  }
                  placeholder="+880..."
                />
                <InputGroup
                  label="Specialization"
                  value={formData.specialization}
                  onChange={(v: string) =>
                    setFormData({ ...formData, specialization: v })
                  }
                  placeholder="e.g. Cardiologist"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <InputGroup
                  label="Fee (BDT)"
                  type="number"
                  value={formData.consultationFee.toString()}
                  onChange={(v: string) =>
                    setFormData({ ...formData, consultationFee: Number(v) })
                  }
                />
                <InputGroup
                  label="Experience (Years)"
                  type="number"
                  value={formData.experienceYears.toString()}
                  onChange={(v: string) =>
                    setFormData({ ...formData, experienceYears: Number(v) })
                  }
                />
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
                  Professional Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows={4}
                  className="w-full p-4 bg-slate-50 border-none rounded-2xl font-medium text-slate-700 focus:ring-2 focus:ring-sky-500 transition-all resize-none"
                  placeholder="Tell patients about your background..."
                />
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 text-amber-700">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-xs font-semibold">
                  Email address cannot be changed from the profile settings for
                  security reasons. Contact admin for assistance.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
              <button
                onClick={() => setEditModal(false)}
                className="flex-1 py-4 bg-white text-slate-600 rounded-2xl font-black shadow-sm border border-slate-100 hover:bg-slate-100 transition-all active:scale-95"
              >
                Cancel Changes
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="flex-[2] py-4 bg-[#0EA5E9] text-white rounded-2xl font-black shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Save size={20} />
                )}
                {isUpdating ? "Updating Profile..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-50 shadow-lg shadow-slate-100/50 text-center space-y-2">
    <div
      className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${color}`}
    >
      {icon}
    </div>
    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
      {label}
    </p>
    <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
  </div>
);

const InputGroup = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: any) => (
  <div>
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-sky-500 transition-all"
      placeholder={placeholder}
    />
  </div>
);
