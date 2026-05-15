import { Wallet, TrendingUp, ArrowUpRight, Search, Filter, Download, MoreVertical, Loader2, CalendarDays, User } from "lucide-react";
import { useGetMyEarningsQuery } from "../../redux/api/financeApi";
import dayjs from "dayjs";

export default function Earning() {
  const { data: earningData, isLoading } = useGetMyEarningsQuery({});
  const earnings = earningData?.data;
  const history = earnings?.history || [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Accessing Financial Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-8 space-y-10 animate-in fade-in duration-700">
      {/* 1. HEADER & GLOBAL STATS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900 p-10 rounded-[3rem] text-white relative overflow-hidden shadow-2xl shadow-slate-200">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -mr-32 -mt-32" />
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-md">
                  <Wallet size={20} className="text-blue-400" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Financial Ledger</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-tight mb-2">Earnings <span className="text-blue-400">Management</span></h1>
          <p className="text-slate-400 font-medium max-w-md">Track your consultation revenue and managed payouts in real-time.</p>
        </div>

        <div className="flex flex-col items-end relative group">
           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Balance</p>
           <h2 className="text-5xl font-black tracking-tighter text-blue-400">
                ${earnings?.totalEarnings.toLocaleString() || '0'}
           </h2>
           <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mt-2 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
               <TrendingUp size={14} /> +14.2% this month
           </div>
        </div>
      </div>

      {/* 2. SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard title="Platform Revenue" val={`$${(earnings?.totalEarnings * 0.8).toFixed(2)}`} icon={<Wallet size={20} />} color="text-emerald-600" bg="bg-emerald-50" sub="80% Net Income" />
        <SummaryCard title="Commission Paid" val={`$${(earnings?.totalEarnings * 0.2).toFixed(2)}`} icon={<ArrowUpRight size={20} />} color="text-blue-600" bg="bg-blue-50" sub="20% Platform Fee" />
        <SummaryCard title="Active Consults" val={history.length} icon={<TrendingUp size={20} />} color="text-indigo-600" bg="bg-indigo-50" sub="Total Transactions" />
        <SummaryCard title="Avg per Patient" val={`$${history.length > 0 ? (earnings?.totalEarnings / history.length).toFixed(1) : '0'}`} icon={<TrendingUp size={20} />} color="text-slate-900" bg="bg-slate-50" sub="Standard Session" />
      </div>

      {/* 3. TRANSACTION HISTORY */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Recent Transactions</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Detailed breakdown of payments</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
              <div className="relative group min-w-[240px]">
                  <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                      type="text" 
                      placeholder="Search patient or transaction..." 
                      className="w-full bg-slate-50 border-none px-12 py-3 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all outline-none"
                  />
              </div>
              <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-slate-900 hover:text-white transition-all border border-slate-100">
                  <Filter size={18} />
              </button>
              <button className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2">
                  <Download size={16} /> Export
              </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-widest">
              <tr>
                <th className="px-8 py-5">Recipient</th>
                <th className="px-8 py-5">Internal ID</th>
                <th className="px-8 py-5">Consultation Time</th>
                <th className="px-8 py-5">Gross Amount</th>
                <th className="px-8 py-5">Session Status</th>
                <th className="px-8 py-5 text-center">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {history.map((f: any) => (
                <tr key={f._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                            <User size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800">{f.patient?.firstName} {f.patient?.lastName}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{f.patient?.contactNumber}</p>
                        </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-slate-600 font-mono">#{f.transactionId?.slice(-8).toUpperCase()}</td>
                  <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-sm font-black text-slate-700">
                          <CalendarDays size={14} className="text-slate-300" />
                          {dayjs(f.paymentDate).format('DD MMM, YYYY')}
                      </div>
                  </td>
                  <td className="px-8 py-6">
                      <span className="text-lg font-black text-slate-900">${f.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        f.status === 'PAID' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {f.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button className="p-3 text-slate-300 hover:text-blue-600 transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {history.length === 0 && (
              <div className="py-24 flex flex-col items-center justify-center text-center opacity-30">
                  <Wallet size={48} className="mb-4 text-slate-300" />
                  <p className="font-bold text-slate-500">No transaction records found</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
}

const SummaryCard = ({ title, val, icon, color, bg, sub }: any) => (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all group">
        <div className="flex justify-between items-start mb-6">
            <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center shadow-inner`}>
                {icon}
            </div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{sub}</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h4 className="text-3xl font-black text-slate-800 tracking-tight">{val}</h4>
    </div>
);