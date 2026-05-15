import { Users, CalendarDays, ClipboardList, Wallet, ArrowUpRight, Loader2, Sparkles, Clock, MapPin } from "lucide-react";
import { useGetDoctorDashboardStatsQuery } from "../../redux/api/doctorApi";
import dayjs from "dayjs";

export default function DoctorOverview() {
  const { data: statsData, isLoading } = useGetDoctorDashboardStatsQuery({});
  const stats = statsData?.data;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Synchronizing Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-10 animate-in fade-in duration-700">
      {/* 1. WELCOME HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-[100px] -mr-32 -mt-32 opacity-50" />
         <div className="relative">
            <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 px-3 py-1 rounded-full flex items-center gap-2">
                    <Sparkles className="text-blue-600" size={14} />
                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Medical Dashboard</span>
                </div>
            </div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-tight">
              Welcome Back, <span className="text-blue-600">Doctor</span>
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              You have {stats?.todayAppointments} appointments scheduled for today.
            </p>
         </div>
         <div className="bg-slate-50 px-6 py-4 rounded-2xl border border-slate-100 flex items-center gap-4 relative">
             <div className="text-right">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                 <p className="text-sm font-bold text-slate-700">All services active</p>
             </div>
             <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                 <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping" />
             </div>
         </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Today's Bookings" 
            value={stats?.todayAppointments || '0'} 
            icon={<CalendarDays size={22} />} 
            color="bg-blue-500 shadow-blue-100" 
            sub="Active Slots"
        />
        <StatCard 
            title="Total Patients" 
            value={stats?.totalPatients || '0'} 
            icon={<Users size={22} />} 
            color="bg-indigo-500 shadow-indigo-100" 
            sub="Unique Visits"
        />
        <StatCard 
            title="Prescriptions" 
            value={stats?.totalPrescriptions || '0'} 
            icon={<ClipboardList size={22} />} 
            color="bg-emerald-500 shadow-emerald-100" 
            sub="Issued Rx"
        />
        <StatCard 
            title="Total Earnings" 
            value={`$${stats?.totalEarnings || '0'}`} 
            icon={<Wallet size={22} />} 
            color="bg-slate-900 shadow-slate-200" 
            sub="Verified Income"
        />
      </div>

      {/* 3. TODAY'S SCHEDULE */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                    <Clock className="text-blue-600" size={20} />
                    Appointment Schedule
                </h2>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Upcoming confirmed slots</p>
            </div>
            <button className="text-xs font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 hover:bg-blue-600 hover:text-white transition-all">
                Full Calendar
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {stats?.recentAppointments?.length > 0 ? (
              stats.recentAppointments.map((app: any) => (
                <div key={app._id} className="p-8 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                   <div className="flex items-center gap-6">
                       <div className="w-14 h-14 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-500 transition-all shadow-sm">
                           <Users size={24} />
                       </div>
                       <div>
                           <p className="text-sm font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                               {app.patient?.firstName} {app.patient?.lastName}
                           </p>
                           <div className="flex items-center gap-3 text-xs font-medium text-slate-400 mt-1">
                               <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-full">
                                   <Clock size={12} /> {app.timeSlot}
                               </span>
                               <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded-full">
                                   <CalendarDays size={12} /> {dayjs(app.appointmentDate).format('DD MMM')}
                               </span>
                           </div>
                       </div>
                   </div>
                   <div className="flex items-center gap-3">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            app.type === 'TELEMEDICINE' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        }`}>
                            {app.type}
                        </span>
                        <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all border border-slate-100 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500">
                            <ArrowUpRight size={18} />
                        </button>
                   </div>
                </div>
              ))
            ) : (
                <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
                    <CalendarDays size={48} className="mb-4 text-slate-200" />
                    <p className="text-sm font-bold text-slate-400">No appointments scheduled for today</p>
                </div>
            )}
          </div>
        </div>

        {/* SIDE BAR / ACTIONS */}
        <div className="space-y-6">
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-indigo-200">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mb-16 -mr-16 group-hover:scale-150 transition-transform duration-700" />
                <h3 className="text-xl font-black tracking-tight mb-2">Telemedicine</h3>
                <p className="text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                    Start a video consultation with patients immediately or view session history.
                </p>
                <button className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                    Launch Meet <ArrowUpRight size={16} />
                </button>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <h3 className="font-black text-slate-800 tracking-tight mb-6">Quick Insights</h3>
                <div className="space-y-6">
                    <InsightRow label="Upcoming Week" val="12 Appts" icon={<CalendarDays size={16} />} />
                    <InsightRow label="Account Status" val="Verified" icon={<MapPin size={16} />} color="text-emerald-500" />
                    <InsightRow label="Last Payout" val="$1,200" icon={<Wallet size={16} />} />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ title, value, icon, color, sub }: any) => (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-7 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
        <div className="absolute top-0 right-0 mt-4 mr-4 opacity-5 group-hover:opacity-10 transition-opacity">
            {icon}
        </div>
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
            {icon}
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
            <span className="text-[10px] font-bold text-slate-400">{sub}</span>
        </div>
    </div>
);

const InsightRow = ({ label, val, icon, color = "text-slate-400" }: any) => (
    <div className="flex items-center justify-between group cursor-default">
        <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center ${color}`}>
                {icon}
            </div>
            <span className="text-sm font-bold text-slate-600">{label}</span>
        </div>
        <span className="text-sm font-black text-slate-800">{val}</span>
    </div>
);