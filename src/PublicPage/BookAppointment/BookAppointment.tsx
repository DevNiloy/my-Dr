import { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Calendar, 
  CreditCard, 
  Stethoscope, 
  Lock,
  Search,
  X,
  // Filter
} from "lucide-react";
import { useGetAppointmentsQuery } from "../../redux/api/appointmentApi";
import { useGetPatientMeQuery } from "../../redux/api/patientApi";
import { useGetDoctorsQuery } from "../../redux/api/doctorApi";
import { useGetDepartmentsQuery } from "../../redux/api/departmentApi";
import { useCreateCheckoutSessionMutation } from "../../redux/api/paymentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";

export default function BookAppointment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAppSelector((state) => state.auth);

  // If unauthenticated, they can still view doctors, but let's prompt login
  const { data: patientData } = useGetPatientMeQuery({}, { skip: !token });
  const patientId = patientData?.data?._id;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSpec, setSelectedSpec] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Initialize from query params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const qSearch = params.get('search');
    const qDept = params.get('department');
    const qDate = params.get('availableDate');

    if (qSearch) setSearchTerm(qSearch);
    if (qDept) setSelectedDept(qDept);
    if (qDate) setFilterDate(qDate);
  }, [location.search]);

  const { data: deptData } = useGetDepartmentsQuery({ limit: 100 });
  const { data: doctorData } = useGetDoctorsQuery({ 
    search: searchTerm, 
    department: selectedDept, 
    specialization: selectedSpec,
    availableDate: filterDate
  });

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [consultationType, setConsultationType] = useState<"IN_PERSON" | "TELEMEDICINE">("IN_PERSON");

  // Extract unique specializations for the filter
  const specializations = useMemo(() => {
    const specs = new Set<string>();
    doctorData?.data?.forEach((d: any) => {
      if (d.specialization) specs.add(d.specialization);
    });
    return Array.from(specs);
  }, [doctorData]);

  const handleDoctorSelect = (doctor: any) => {
     setSelectedDoctor(doctor);
     if (filterDate && !appointmentDate) {
       setAppointmentDate(filterDate);
     }
  };

  const { data: bookedData, isFetching: isCheckingBooked } = useGetAppointmentsQuery(
    { doctorId: selectedDoctor?._id, date: appointmentDate },
    { skip: !selectedDoctor || !appointmentDate }
  );

  const [createCheckout, { isLoading: isRedirecting }] = useCreateCheckoutSessionMutation();

  const doctors = doctorData?.data || [];
  const departments = deptData?.data || [];
  const bookedSlots = bookedData?.data?.map((a: any) => a.timeSlot) || [];

  const doctorDayInfo = useMemo(() => {
    if (!selectedDoctor || !appointmentDate) return null;
    const dayOfWeek = dayjs(appointmentDate).format('dddd');
    return selectedDoctor.availability?.weeklySchedule?.find(
      (s: any) => s.day === dayOfWeek
    );
  }, [selectedDoctor, appointmentDate]);

  const availableSlots = useMemo(() => {
    if (!doctorDayInfo || !doctorDayInfo.isActive) return [];
    const isOffDay = selectedDoctor.availability?.offDays?.includes(appointmentDate);
    if (isOffDay) return [];

    const slots = [];
    let current = dayjs(`2000-01-01 ${doctorDayInfo.startTime}`);
    const end = dayjs(`2000-01-01 ${doctorDayInfo.endTime}`);
    const duration = selectedDoctor.availability?.slotDurationMinutes || 30;

    while (current.isBefore(end) || current.isSame(end)) {
      const slotTime = current.format("HH:mm");
      if (!bookedSlots.includes(slotTime)) {
        slots.push(slotTime);
      }
      current = current.add(duration, "minute");
    }
    return slots;
  }, [doctorDayInfo, bookedSlots, appointmentDate, selectedDoctor]);

  const handleBooking = async () => {
    if (!token || !patientId) {
      toast.info("Please login to complete your booking.");
      navigate("/login", { state: { from: location } });
      return;
    }

    if (!selectedDoctor || !appointmentDate || !timeSlot) {
      toast.error("Please fill all required selections.");
      return;
    }

    if (!selectedDoctor.isStripeConnected) {
      toast.error("This doctor hasn't connected Stripe yet. Booking is currently unavailable.");
      return;
    }

    try {
      const payload = {
        doctorId: selectedDoctor._id,
        patientId,
        appointmentDate,
        timeSlot,
        type: consultationType,
        symptoms
      };

      toast.info("Preparing checkout...", { autoClose: 1500 });
      const checkoutRes = await createCheckout(payload).unwrap();

      if (checkoutRes.success && checkoutRes.url) {
        window.location.href = checkoutRes.url;
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Booking failed. Please try again.");
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedDept("");
    setSelectedSpec("");
    setFilterDate("");
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-700">

        <div className="lg:col-span-12">
          {!token && (
            <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-[2rem] flex items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <Lock size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-amber-900 tracking-tight text-lg">You are browsing as a guest</h3>
                  <p className="text-amber-700 text-sm font-medium">To complete an appointment booking, you'll need to sign into your patient account.</p>
                </div>
              </div>
              <button onClick={() => navigate("/login")} className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-black rounded-xl transition-colors shadow-lg shadow-amber-200">
                Sign In
              </button>
            </div>
          )}

          <div className="bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <div className="flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <Stethoscope size={28} className="text-blue-500" /> Specialist Directory
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Select a doctor to view their schedule</p>
                </div>
                {(searchTerm || selectedDept || selectedSpec || filterDate) && (
                   <button onClick={clearFilters} className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 hover:bg-rose-50 px-4 py-2 rounded-full transition-colors">
                     <X size={14} /> Clear Filters
                   </button>
                )}
              </div>

              {/* Advanced Filter Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50/50 rounded-[2.5rem] border border-slate-50">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Search Name</label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="text"
                      placeholder="Doctor name..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-14 p-4 bg-white border-none rounded-2xl font-bold text-slate-700 placeholder:text-slate-300 focus:ring-2 focus:ring-blue-100 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Department</label>
                  <select
                    value={selectedDept}
                    onChange={e => setSelectedDept(e.target.value)}
                    className="w-full p-4 bg-white border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Departments</option>
                    {departments.map((dept: any) => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Specialization</label>
                  <select
                    value={selectedSpec}
                    onChange={e => setSelectedSpec(e.target.value)}
                    className="w-full p-4 bg-white border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map((spec: any) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-4">Available Date</label>
                  <input
                    type="date"
                    min={dayjs().format('YYYY-MM-DD')}
                    value={filterDate}
                    onChange={e => setFilterDate(e.target.value)}
                    className="w-full p-4 bg-white border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                  />
                </div>
              </div>
            </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {doctors.map((doctor: any) => (
                <div
                  key={doctor._id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 group flex flex-col gap-4 ${selectedDoctor?._id === doctor._id
                    ? "border-blue-500 bg-blue-50/50 shadow-xl shadow-blue-100/30"
                    : "border-slate-50 hover:border-blue-200 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">👨‍⚕️</div>
                    {selectedDoctor?._id === doctor._id && <div className="p-2 bg-blue-600 text-white rounded-full"><CheckCircle2 size={12} /></div>}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 tracking-tighter text-lg leading-tight">{doctor.firstName} {doctor.lastName}</h4>
                    <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mt-1">{doctor.specialization}</p>
                  </div>

                  <div className={`mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${doctor.isStripeConnected ? 'text-emerald-500' : 'text-slate-300'}`}>
                    <CreditCard size={12} /> {doctor.isStripeConnected ? 'Payments Enabled' : 'Payments (Offline)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedDoctor && (
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in slide-in-from-top-4 duration-1000">

            {/* WEEKLY SCHEDULE PANEL */}
            <div className="lg:col-span-1 bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                <Calendar size={20} className="text-indigo-500" /> Weekly Hours
              </h3>
              <div className="space-y-3">
                {selectedDoctor.availability?.weeklySchedule?.map((s: any) => (
                  <div key={s.day} className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${s.isActive ? 'bg-slate-50 border-slate-100' : 'bg-rose-50 border-rose-100 opacity-50'}`}>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{s.day}</span>
                    <span className={`text-[10px] font-bold ${s.isActive ? 'text-blue-600' : 'text-rose-400'}`}>
                      {s.isActive ? `${s.startTime}-${s.endTime}` : 'CLOSED'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Off Days List */}
              {selectedDoctor.availability?.offDays?.length > 0 && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Public Holidays / Closures</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedDoctor.availability.offDays.map((d: string) => (
                      <span key={d} className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black tracking-tighter">{d}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BOOKING DETAILS */}
            <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-10 focus-within:border-blue-400 transition-colors">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Pick Date</label>
                  <input
                    type="date"
                    min={dayjs().format('YYYY-MM-DD')}
                    value={appointmentDate}
                    onChange={e => { setAppointmentDate(e.target.value); setTimeSlot(""); }}
                    className="w-full p-5 bg-slate-50 border-none rounded-2xl font-bold text-slate-700 focus:ring-2 focus:ring-blue-500 shadow-inner"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block flex items-center justify-between">
                    Select Time {isCheckingBooked && <Loader2 size={12} className="animate-spin text-blue-500" />}
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot: string) => (
                        <button
                          key={slot}
                          onClick={() => setTimeSlot(slot)}
                          className={`py-3 rounded-xl font-black text-[10px] transition-all ${timeSlot === slot ? "bg-blue-600 text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}
                        >
                          {slot}
                        </button>
                      ))
                    ) : (
                      <div className="col-span-full p-6 border-2 border-dashed border-slate-100 rounded-3xl text-center text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {appointmentDate ? "No slots available" : "Select date first"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Consultation Type Selector */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 block">Consultation Type</label>
                <div className="flex gap-4">
                  <button
                    onClick={() => setConsultationType("IN_PERSON")}
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-[1.5rem] font-bold transition-all border-2 ${consultationType === "IN_PERSON" ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md" : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${consultationType === "IN_PERSON" ? "bg-blue-500" : "bg-slate-300"}`} />
                    In-Person Visit
                  </button>
                  <button
                    onClick={() => setConsultationType("TELEMEDICINE")}
                    type="button"
                    className={`flex-1 flex items-center justify-center gap-3 p-5 rounded-[1.5rem] font-bold transition-all border-2 ${consultationType === "TELEMEDICINE" ? "border-blue-500 bg-blue-50 text-blue-700 shadow-md" : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200"}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${consultationType === "TELEMEDICINE" ? "bg-blue-500" : "bg-slate-300"}`} />
                    Telemedicine (Video Call)
                  </button>
                </div>
              </div>

              <textarea
                rows={4}
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Briefly describe your symptoms..."
                className="w-full p-6 bg-slate-50 border-none rounded-[2rem] font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 resize-none shadow-inner outline-none"
              />
            </div>

            {/* PAYMENT SUMMARY */}
            <div className="lg:col-span-1 flex flex-col gap-6">
              <div className="bg-slate-900 rounded-[3rem] p-8 text-white flex flex-col justify-between shadow-2xl relative overflow-hidden grow">
                <div className="absolute top-0 right-0 p-16 -mr-12 -mt-12 bg-white/5 rounded-full blur-xl" />

                <div className="space-y-8">
                  <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Checkout Summary</h4>

                  <SummarySmall label="Doctor" value={`${selectedDoctor.firstName} ${selectedDoctor.lastName}`} />
                  <SummarySmall label="Schedule" value={appointmentDate && timeSlot ? `${dayjs(appointmentDate).format('DD MMM')}, ${timeSlot}` : '--'} />

                  <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Fee</span>
                      <span className="text-xl font-black tracking-tight">${selectedDoctor.consultationFee}</span>
                    </div>
                    {!selectedDoctor.isStripeConnected && (
                      <div className="flex items-center gap-2 text-rose-400 text-[9px] font-bold">
                        <AlertCircle size={10} /> Stripe disconnected
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={isRedirecting || !timeSlot || !selectedDoctor.isStripeConnected}
                  className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-8 z-10"
                >
                  {isRedirecting ? <Loader2 className="animate-spin" size={18} /> : <CreditCard size={18} />}
                  {!token ? 'Sign-in to Book' : isRedirecting ? 'Stripe Pay...' : 'Pay & Confirm'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const SummarySmall = ({ label, value }: any) => (
  <div className="space-y-1">
    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
    <p className="font-bold text-sm tracking-tight">{value}</p>
  </div>
);
