import { Calendar, FileText, Activity, Clock, ShieldCheck, Heart, ArrowRight, Loader2, ClipboardList, Thermometer } from "lucide-react";
import { useGetPatientDashboardStatsQuery } from "../../redux/api/patientApi";
import dayjs from "dayjs";

export default function PatientOverview() {
  const { data: statsData, isLoading } = useGetPatientDashboardStatsQuery({});
  const stats = statsData?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Medical Profile...</p>
      </div>
    );
  }

  const nextApp = stats?.nextAppointment;

  return (
    <div className="p-4 lg:p-8 space-y-10 animate-in fade-in duration-700">
      {/* 1. HEALTH SUMMARY HEADER */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -mr-16 -mt-16" />
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-blue-500/20 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 border border-white/10">
                        <ShieldCheck size={14} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Secure Profile</span>
                    </div>
                </div>
                <h1 className="text-4xl font-black tracking-tight mb-4 leading-tight">
                    Your Health, <br/><span className="text-blue-400">Our Priority.</span>
                </h1>
                <p className="text-slate-400 font-medium max-w-md mb-8 leading-relaxed">
                    Welcome back to your dashboard. Stay updated with your recent checkups and medical records.
                </p>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 shadow-inner">
                            <Heart size={20} className="text-rose-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Health Score</p>
                            <p className="text-sm font-black">94% Optimal</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* UPCOMING APPOINTMENT MINI CARD */}
        <div className="bg-white border-2 border-slate-50 rounded-[3rem] p-8 shadow-sm flex flex-col justify-between group hover:border-blue-100 transition-all">
            <div>
                <div className="flex justify-between items-start mb-6">
                    <div className="w-14 h-14 bg-blue-50 rounded-[1.5rem] flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                        <Calendar size={24} />
                    </div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-3 py-1 rounded-lg">Next Visit</span>
                </div>
                {nextApp ? (
                    <>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight mb-1">
                            Dr. {nextApp.doctor?.firstName} {nextApp.doctor?.lastName}
                        </h3>
                        <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                            <Clock size={14} /> {nextApp.timeSlot} | {dayjs(nextApp.appointmentDate).format('DD MMMM')}
                        </p>
                    </>
                ) : (
                    <p className="text-slate-400 font-bold">No upcoming appointments</p>
                )}
            </div>
            <button className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
                Manage Booking <ArrowRight size={16} />
            </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard label="Total Visits" value={stats?.totalAppointments || '0'} icon={<Thermometer size={22} />} color="text-blue-600" bg="bg-blue-50" />
        <MetricCard label="Prescriptions" value={stats?.totalPrescriptions || '0'} icon={<ClipboardList size={22} />} color="text-emerald-600" bg="bg-emerald-50" />
        <MetricCard label="Medical Reports" value={stats?.totalReports || '0'} icon={<FileText size={22} />} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      {/* 3. RECENT ACTIVITY LIST */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status of your latest consults</p>
          </div>
          <button className="text-xs font-black text-blue-600 uppercase tracking-widest hover:underline">View History</button>
        </div>
        
        <div className="divide-y divide-slate-50">
            {stats?.recentAppointments?.length > 0 ? (
                stats.recentAppointments.map((app: any) => (
                    <div key={app._id} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50 transition-all group">
                        <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shadow-sm group-hover:text-blue-500 transition-colors">
                                <Activity size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-black text-slate-800 uppercase tracking-tight">Doctor Checkup</p>
                                <p className="text-xs font-bold text-slate-400 mt-0.5">Dr. {app.doctor?.firstName} {app.doctor?.lastName} • {dayjs(app.appointmentDate).format('MMM DD, YYYY')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                app.status === 'CONFIRMED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                app.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                'bg-rose-50 text-rose-600 border-rose-100'
                            }`}>
                                {app.status}
                            </span>
                            <ArrowRight size={18} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                ))
            ) : (
                <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                    <Activity size={48} className="mb-4 text-slate-300" />
                    <p className="font-bold text-slate-500">No recent activity detected</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

const MetricCard = ({ label, value, icon, color, bg }: any) => (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm flex items-center justify-between group hover:shadow-xl transition-all">
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
            <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
        </div>
        <div className={`w-14 h-14 ${bg} ${color} rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
    </div>
);
