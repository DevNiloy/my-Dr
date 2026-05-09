import React from "react";
import { 
  ArrowUpRight, 
 
  Users, 
  DollarSign, 
  CalendarCheck, 
  Activity,
  TrendingUp,
  MoreVertical
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

// ডামি চার্ট ডাটা
const chartData = [
  { name: "Sat", appointments: 40 },
  { name: "Sun", appointments: 30 },
  { name: "Mon", appointments: 65 },
  { name: "Tue", appointments: 45 },
  { name: "Wed", appointments: 90 },
  { name: "Thu", appointments: 70 },
  { name: "Fri", appointments: 50 },
];

const ClinicOverview: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* 1. Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Clinic Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Real-time performance metrics for your medical center.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-[#0EA5E9] text-white rounded-xl text-sm font-bold shadow-lg shadow-sky-100 hover:bg-sky-600 transition-all">
            View Live Logs
          </button>
        </div>
      </div>

      {/* 2. Main Stat Cards (Responsive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Transactions" value="৳4,50,000" trend="+12.5%" icon={<DollarSign size={20}/>} isUp={true} color="text-emerald-500" />
        <StatCard title="Net Commission" value="৳90,000" trend="+8.2%" icon={<Activity size={20}/>} isUp={true} color="text-[#0EA5E9]" />
        <StatCard title="Active Doctors" value="24" trend="Live Now" icon={<Users size={20}/>} isUp={true} color="text-indigo-500" />
        <StatCard title="Patient Bookings" value="1,280" trend="-2.4%" icon={<CalendarCheck size={20}/>} isUp={false} color="text-rose-500" />
      </div>

      {/* 3. Middle Section: Chart & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Growth Chart Area */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <TrendingUp size={20} className="text-[#0EA5E9]" /> Appointment Growth
              </h3>
              <p className="text-xs text-slate-400 font-medium">Weekly appointment volume vs cancellations</p>
            </div>
            <select className="bg-slate-50 border-none rounded-lg text-xs font-bold text-slate-500 focus:ring-0 cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="flex-1 min-h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                />
                <Area type="monotone" dataKey="appointments" stroke="#0EA5E9" strokeWidth={3} fillOpacity={1} fill="url(#colorApp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Departments (পেজ যাতে খালি না লাগে) */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Top Departments</h3>
          <div className="space-y-6">
            <DeptProgress label="Cardiology" value={85} color="bg-indigo-500" />
            <DeptProgress label="Neurology" value={65} color="bg-[#0EA5E9]" />
            <DeptProgress label="Orthopedics" value={45} color="bg-rose-500" />
            <DeptProgress label="Dental Care" value={30} color="bg-amber-500" />
            <div className="pt-4 mt-6 border-t border-slate-50">
               <div className="flex items-center justify-between text-sm font-bold text-slate-400">
                  <span>Total Patients</span>
                  <span className="text-slate-800">1.2k+</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Live Activity Logs */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Activity</h3>
            <p className="text-sm text-slate-400 font-medium">Real-time status of appointments and doctors</p>
          </div>
          <button className="text-sm font-bold text-[#0EA5E9] hover:underline">View All Logs</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Details</th>
                <th className="px-8 py-4">Time</th>
                <th className="px-8 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <ActivityRow status="Appointment" detail="Patient #1209 booked with Dr. Niloy Rahman" time="2 mins ago" />
              <ActivityRow status="Payment" detail="Received platform fee ৳200 from Dr. Sabuj" time="15 mins ago" />
              <ActivityRow status="New Doctor" detail="Dr. Anisur Rahman joined the Cardiology team" time="1 hour ago" />
              <ActivityRow status="Cancellation" detail="Patient #1102 cancelled appointment" time="3 hours ago" />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Helper Stat Card
const StatCard = ({ title, value, trend, icon, isUp, color }: any) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm group hover:border-[#0EA5E9] transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-slate-50 ${color} shadow-inner`}>
        {icon}
      </div>
      <button className="text-slate-300 hover:text-slate-600 transition-colors">
        <MoreVertical size={18} />
      </button>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <div className="flex items-baseline gap-2 mt-1">
      <h4 className="text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
      <span className={`text-[10px] font-black ${isUp ? 'text-emerald-500' : 'text-rose-500'}`}>
        {trend}
      </span>
    </div>
  </div>
);

// Helper Department Progress
const DeptProgress = ({ label, value, color }: any) => (
  <div className="space-y-2">
    <div className="flex justify-between text-xs font-bold tracking-tight">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-400">{value}%</span>
    </div>
    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${value}%` }} />
    </div>
  </div>
);

// Helper Activity Row
const ActivityRow = ({ status, detail, time }: any) => (
  <tr className="hover:bg-slate-50/50 transition-colors group">
    <td className="px-8 py-5">
      <span className="px-3 py-1 bg-sky-50 text-[#0EA5E9] text-[10px] font-black uppercase rounded-lg">
        {status}
      </span>
    </td>
    <td className="px-8 py-5 text-sm font-bold text-slate-600">{detail}</td>
    <td className="px-8 py-5 text-xs font-medium text-slate-400">{time}</td>
    <td className="px-8 py-5 text-center text-slate-300 group-hover:text-[#0EA5E9] cursor-pointer">
       <ArrowUpRight size={18} />
    </td>
  </tr>
);

export default ClinicOverview;