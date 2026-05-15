import {
  CalendarDays, 
  Clock3, 
  Loader2,
  Calendar,
  Video,
  ShieldCheck,
  ShieldAlert
} from "lucide-react";
import { useGetAppointmentsQuery } from "../../redux/api/appointmentApi";
import { useGetPatientMeQuery } from "../../redux/api/patientApi";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

export default function PatientAppointment() {
  const navigate = useNavigate();
  const { data: patientData, isLoading: isPatientLoading } = useGetPatientMeQuery({});
  const patientId = patientData?.data?._id;

  const { data: appointmentData, isLoading: isAppLoading } = useGetAppointmentsQuery(
    { patientId },
    { skip: !patientId }
  );

  const appointments = appointmentData?.data || [];

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
            <p className="text-sm text-slate-500 font-medium mt-1">View your medical appointments and history.</p>
         </div>

         <button
           onClick={() => navigate('/appointment')}
           className="relative z-10 flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 active:scale-95 transition-all text-sm"
         >
           <Calendar size={18} />
           <span>New Appointment</span>
         </button>
      </div>

      {/* LIST VIEW */}
      <div className="grid gap-6">
        {appointments.length === 0 ? (
           <div className="bg-white border-2 border-dashed border-slate-100 rounded-[3rem] p-16 text-center space-y-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                 <CalendarDays size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">No Appointments Found</h3>
              <button 
                onClick={() => navigate('/appointment')}
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
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-3xl flex items-center justify-center text-3xl shrink-0">👨‍⚕️</div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 leading-tight">Dr. {app.doctor.firstName} {app.doctor.lastName}</h2>
                    <p className="text-[10px] font-black uppercase text-slate-400 mt-1 tracking-widest leading-none">{app.doctor.specialization}</p>
                    
                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 mt-3">
                       <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border flex items-center gap-1.5 ${
                          app.adminApprovalStatus === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                          app.adminApprovalStatus === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" :
                          "bg-amber-50 text-amber-600 border-amber-100"
                       }`}>
                          {app.adminApprovalStatus === "APPROVED" ? <ShieldCheck size={12}/> : <ShieldAlert size={12}/>}
                          Admin: {app.adminApprovalStatus || 'Pending'}
                       </span>

                       {app.type === "TELEMEDICINE" && app.adminApprovalStatus === "APPROVED" && app.meetLink && (
                          <a 
                             href={app.meetLink} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="flex items-center gap-2 px-4 py-1.5 bg-[#0EA5E9] text-white rounded-full text-[9px] font-black uppercase tracking-[0.1em] shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all"
                          >
                             <Video size={12} /> Join Call
                          </a>
                       )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap lg:flex-nowrap gap-4 items-center">
                  <InfoBadge icon={<CalendarDays size={14}/>} label="DATE" value={dayjs(app.appointmentDate).format('DD MMM, YYYY')} />
                  <InfoBadge icon={<Clock3 size={14}/>} label="TIME" value={app.timeSlot} />
                  
                  <div className="flex flex-col gap-2">
                    <span className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.1em] text-center border ${
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
            </div>
          ))
        )}
      </div>
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
