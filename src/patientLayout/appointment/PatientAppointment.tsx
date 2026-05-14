import { useState, useMemo } from "react";
import { 
  Video, 
  CalendarDays, 
  Clock3, 
  Plus, 
  Search, 
  Stethoscope, 
  X, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Calendar,
  CreditCard,
  ChevronRight
} from "lucide-react";
import { 
  useGetAppointmentsQuery, 
  useCreateAppointmentMutation 
} from "../../redux/api/appointmentApi";
import { useGetPatientMeQuery } from "../../redux/api/patientApi";
import { useGetDoctorsQuery } from "../../redux/api/doctorApi";
import { useCreateCheckoutSessionMutation } from "../../redux/api/paymentApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function PatientAppointment() {
  const { data: patientData, isLoading: isPatientLoading } = useGetPatientMeQuery({});
  const patientId = patientData?.data?._id;

  const { data: appointmentData, isLoading: isAppLoading } = useGetAppointmentsQuery(
    { patientId },
    { skip: !patientId }
  );

  const [isBookingMode, setIsBookingMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: doctorData } = useGetDoctorsQuery({ search: searchTerm });
  
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [symptoms, setSymptoms] = useState("");

  const { data: bookedData, isFetching: isCheckingBooked } = useGetAppointmentsQuery(
    { doctorId: selectedDoctor?._id, date: appointmentDate },
    { skip: !selectedDoctor || !appointmentDate }
  );

  const [createAppointment, { isLoading: isBooking }] = useCreateAppointmentMutation();
  const [createCheckout, { isLoading: isRedirecting }] = useCreateCheckoutSessionMutation();

  const appointments = appointmentData?.data || [];
  const doctors = doctorData?.data || [];
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
        type: symptoms.toLowerCase().includes("video") ? "TELEMEDICINE" : "IN_PERSON",
        symptoms
      };

      // 1. Create Appointment (Status will be PENDING)
      const res = await createAppointment(payload).unwrap();
      
      if (res.success) {
        toast.info("Appointment created. Redirecting to payment...");
        // 2. Create Checkout Session
        const checkoutRes = await createCheckout({ appointmentId: res.data._id }).unwrap();
        if (checkoutRes.success && checkoutRes.url) {
          window.location.href = checkoutRes.url;
        }
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Booking failed. Please try again.");
    }
  };

  const resetForm = () => {
    setSelectedDoctor(null);
    setAppointmentDate("");
    setTimeSlot("");
    setSymptoms("");
  };

  if (isPatientLoading || isAppLoading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="font-bold tracking-widest uppercase text-xs">Synchronizing your medical record...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      
      {/* HEADER */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden relative group">
         <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
         
         <div className="relative z-10">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Consultations</h1>
            <p className="text-sm text-slate-500 font-medium mt-1">Book and pay for your medical appointments securely.</p>
         </div>

         {!isBookingMode ? (
           <button
             onClick={() => setIsBookingMode(true)}
             className="relative z-10 flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all text-sm"
           >
             <Calendar size={18} />
             <span>New Appointment</span>
           </button>
         ) : (
           <button
             onClick={() => { setIsBookingMode(false); resetForm(); }}
             className="relative z-10 flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 text-slate-600 rounded-[1.5rem] font-black hover:bg-slate-200 transition-all text-sm"
           >
             <X size={18} />
             <span>Exit Booking</span>
           </button>
         )}
      </div>

      {!isBookingMode ? (
        /* LIST VIEW */
        <div className="grid gap-6">
          {appointments.length === 0 ? (
             <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-16 text-center space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                   <CalendarDays size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">No Appointments Found</h3>
                <button 
                  onClick={() => setIsBookingMode(true)}
                  className="px-8 py-3 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-all"
                >
                  Start Booking
                </button>
             </div>
          ) : (
            appointments.map((app: any) => (
              <div
                key={app._id}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center text-3xl">👨‍⚕️</div>
                    <div>
                      <h2 className="text-2xl font-black text-slate-800">Dr. {app.doctor.firstName} {app.doctor.lastName}</h2>
                      <p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest">{app.doctor.specialization}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <InfoBadge icon={<CalendarDays size={14}/>} label="DATE" value={dayjs(app.appointmentDate).format('DD MMM, YYYY')} />
                    <InfoBadge icon={<Clock3 size={14}/>} label="TIME" value={app.timeSlot} />
                    
                    <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${
                        app.status === "PENDING" ? "bg-amber-100 text-amber-600 border border-amber-200" :
                        app.status === "CONFIRMED" ? "bg-blue-100 text-blue-600 border border-blue-200" :
                        app.status === "COMPLETED" ? "bg-emerald-100 text-emerald-600 border border-emerald-200" :
                        "bg-rose-100 text-rose-600 border border-rose-200"
                     }`}>
                        {app.status}
                     </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* BOOKING VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in slide-in-from-bottom-5 duration-700">
          
          <div className="lg:col-span-12">
            <div className="bg-white p-8 lg:p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                       <Stethoscope size={28} className="text-blue-500" /> Specialist Directory
                    </h2>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Select a doctor to view their schedule</p>
                  </div>
                  <input 
                    type="text" 
                    placeholder="Search specialists..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full md:w-[350px] p-5 bg-slate-50 border-none rounded-[2rem] font-bold text-slate-700 placeholder:text-slate-300 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all"
                  />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {doctors.map((doctor: any) => (
                    <div 
                      key={doctor._id}
                      onClick={() => setSelectedDoctor(doctor)}
                      className={`p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-300 group flex flex-col gap-4 ${
                        selectedDoctor?._id === doctor._id 
                        ? "border-blue-500 bg-blue-50/50 shadow-xl shadow-blue-100/30" 
                        : "border-slate-50 hover:border-blue-200 hover:bg-slate-50"
                      }`}
                    >
                       <div className="flex justify-between items-start">
                          <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-3xl shadow-sm group-hover:scale-110 transition-transform">👨‍⚕️</div>
                          {selectedDoctor?._id === doctor._id && <div className="p-2 bg-blue-600 text-white rounded-full"><CheckCircle2 size={12}/></div>}
                       </div>
                       <div>
                          <h4 className="font-black text-slate-800 tracking-tighter text-lg leading-tight">{doctor.firstName} {doctor.lastName}</h4>
                          <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mt-1">{doctor.specialization}</p>
                       </div>
                       
                       {/* Connection Indicator */}
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
                             availableSlots.map(slot => (
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

                  <textarea 
                    rows={4}
                    value={symptoms}
                    onChange={e => setSymptoms(e.target.value)}
                    placeholder="Briefly describe your symptoms..."
                    className="w-full p-6 bg-slate-50 border-none rounded-[2rem] font-medium text-slate-700 focus:ring-2 focus:ring-blue-500 resize-none shadow-inner"
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
                             <span className="text-xl font-black tracking-tight">৳{selectedDoctor.consultationFee}</span>
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
                      disabled={isBooking || isRedirecting || !timeSlot || !selectedDoctor.isStripeConnected}
                      className="w-full py-5 bg-white text-slate-900 rounded-[1.5rem] font-black shadow-xl hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 mt-8 z-10"
                    >
                      {isBooking || isRedirecting ? <Loader2 className="animate-spin" size={18}/> : <CreditCard size={18}/>}
                      {isBooking ? 'Finalizing...' : isRedirecting ? 'Stripe Pay...' : 'Pay & Confirm'}
                    </button>
                  </div>
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

const InfoBadge = ({ icon, label, value }: any) => (
  <div className="px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3">
     <div className="text-blue-500">{icon}</div>
     <div>
        <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter leading-none">{label}</p>
        <p className="text-xs font-black text-slate-700 tracking-tight">{value}</p>
     </div>
  </div>
);

const SummarySmall = ({ label, value }: any) => (
  <div className="space-y-1">
     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
     <p className="font-bold text-sm tracking-tight">{value}</p>
  </div>
);
