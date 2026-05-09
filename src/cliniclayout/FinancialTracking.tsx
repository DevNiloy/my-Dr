import React from "react";
import { 
   
  ArrowDownLeft, 
 
  Search, 
  Download, 
 
  CreditCard,
  History,
  TrendingUp
} from "lucide-react";

interface Transaction {
  id: string;
  doctorName: string;
  patientName: string;
  totalAmount: number;
  clinicCommission: number; // 20%
  date: string;
  method: "Direct-to-Doctor";
  type: "Online" | "Offline";
}

const FinancialTracking: React.FC = () => {
  // const [ setSearchQuery] = useState("");

  // ডামি ট্রানজ্যাকশন ডাটা
  const transactions: Transaction[] = [
    { id: "TRX-901", doctorName: "Dr. Niloy Rahman", patientName: "Anisur Rahman", totalAmount: 1200, clinicCommission: 240, date: "06 May, 2026", method: "Direct-to-Doctor", type: "Online" },
    { id: "TRX-902", doctorName: "Dr. Sabuj", patientName: "Karim Uddin", totalAmount: 800, clinicCommission: 160, date: "06 May, 2026", method: "Direct-to-Doctor", type: "Offline" },
    { id: "TRX-903", doctorName: "Dr. Sarah", patientName: "Sumaiya Akter", totalAmount: 1500, clinicCommission: 300, date: "05 May, 2026", method: "Direct-to-Doctor", type: "Online" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Header & Summary Cards */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight text-responsive">Financial Tracking</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor clinic revenue and doctor transaction history.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={18} />
          <span>Download Statement</span>
        </button>
      </div>

      {/* 2. Top Stats - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinanceCard 
          title="Gross Volume" 
          amount="৳4,50,000" 
          desc="Direct to Doctors" 
          icon={<History className="text-indigo-500" />} 
          bg="bg-indigo-50"
        />
        <FinanceCard 
          title="Clinic Commission (20%)" 
          amount="৳90,000" 
          desc="Net Platform Profit" 
          icon={<TrendingUp className="text-[#0EA5E9]" />} 
          bg="bg-sky-50"
        />
        <FinanceCard 
          title="Pending Settlement" 
          amount="৳12,400" 
          desc="Uncollected Commission" 
          icon={<CreditCard className="text-amber-500" />} 
          bg="bg-amber-50"
        />
      </div>

      {/* 3. Transaction History Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden mt-8">
        <div className="p-6 lg:p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="text-lg font-black text-slate-800">Recent Transactions</h3>
          <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 min-w-[300px]">
            <Search size={16} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Filter by Doctor or Patient..." 
              className="bg-transparent border-none text-xs font-bold focus:ring-0 w-full"
              // onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-slate-50/50 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em]">
              <tr>
                <th className="px-8 py-5">Transaction ID</th>
                <th className="px-8 py-5">Doctor & Patient</th>
                <th className="px-8 py-5">Visit Info</th>
                <th className="px-8 py-5">Total Paid</th>
                <th className="px-8 py-5">Our 20%</th>
                <th className="px-8 py-5">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="text-xs font-black text-slate-400 font-mono">#{trx.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-800 tracking-tight">Doc: {trx.doctorName}</span>
                      <span className="text-[10px] text-slate-400 font-bold tracking-tighter">Pat: {trx.patientName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${
                      trx.type === 'Online' ? 'bg-sky-50 text-sky-600 border-sky-100' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {trx.type}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-slate-700 tracking-tighter">৳{trx.totalAmount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="p-1 bg-emerald-100 rounded text-emerald-600"><ArrowDownLeft size={12}/></div>
                      <span className="text-sm font-black text-emerald-600">৳{trx.clinicCommission}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-bold text-slate-400 tracking-tight">{trx.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- Helper Stat Card Component ---
const FinanceCard = ({ title, amount, desc, icon, bg }: any) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex items-start justify-between group hover:border-sky-300 transition-all">
    <div className="space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{amount}</h2>
      <p className="text-[10px] text-slate-500 font-bold bg-slate-50 w-fit px-2 py-0.5 rounded-md">{desc}</p>
    </div>
    <div className={`p-4 ${bg} rounded-2xl shadow-inner`}>
      {icon}
    </div>
  </div>
);

export default FinancialTracking;