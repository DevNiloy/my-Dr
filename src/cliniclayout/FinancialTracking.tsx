import React, { useState } from "react";
import {
  ArrowDownLeft,
  Search,
  Download,
  CreditCard,
  History,
  TrendingUp,
  Monitor,
  MapPin,
  Loader2,
  Calendar,
  Filter,
} from "lucide-react";
import dayjs from "dayjs";
import {
  useGetAppointmentsQuery,
  useGetFinancialSummaryQuery,
} from "../redux/api/appointmentApi";

const FinancialTracking: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [page, setPage] = useState(1);
  const limit = 10;

  // Derive type filter for API
  let apiTypeParam: string | undefined;
  if (filterType === "Online") apiTypeParam = "TELEMEDICINE";
  if (filterType === "Stationary") apiTypeParam = "IN_PERSON";

  // Fetch live summary stats
  const { data: summaryData, isLoading: summaryLoading } = useGetFinancialSummaryQuery(undefined);

  // Fetch transaction list — only paid appointments for financial records
  const { data: txData, isLoading: txLoading } = useGetAppointmentsQuery({
    paymentStatus: "PAID",
    type: apiTypeParam,
    search: searchInput || undefined,
    page,
    limit,
  });

  const summary = summaryData?.data;
  const transactions = txData?.data || [];
  const totalPages = txData?.pages || 1;

  const formatAmount = (n: number) => `$${n.toLocaleString("en-IN")}`;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">

      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">
            Financial Tracking
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Monitor clinic revenue and doctor transaction history.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
          <Download size={18} />
          <span>Download Statement</span>
        </button>
      </div>

      {/* 2. Stats Cards */}
      {summaryLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm animate-pulse">
              <div className="h-4 bg-slate-100 rounded w-1/2 mb-4" />
              <div className="h-8 bg-slate-100 rounded w-3/4 mb-3" />
              <div className="h-3 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FinanceCard
            title="Gross Volume"
            amount={formatAmount(summary?.grossVolume || 0)}
            desc={`${summary?.totalPaidAppointments || 0} paid appointments`}
            icon={<History className="text-indigo-500" size={22} />}
            bg="bg-indigo-50"
          />
          <FinanceCard
            title="Clinic Commission (20%)"
            amount={formatAmount(summary?.clinicCommission || 0)}
            desc="Net Platform Profit"
            icon={<TrendingUp className="text-[#0EA5E9]" size={22} />}
            bg="bg-sky-50"
          />
          <FinanceCard
            title="Pending Settlement"
            amount={formatAmount(summary?.pendingSettlement || 0)}
            desc={`${summary?.totalPendingAppointments || 0} pending appointments`}
            icon={<CreditCard className="text-amber-500" size={22} />}
            bg="bg-amber-50"
          />
        </div>
      )}

      {/* 3. Transaction History Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Header with Search + Filter */}
        <div className="p-6 lg:p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <h3 className="text-lg font-black text-slate-800">Recent Transactions</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 min-w-[260px] focus-within:border-sky-300 transition-all">
              <Search size={15} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search by doctor or patient..."
                className="bg-transparent border-none text-xs font-medium focus:ring-0 w-full outline-none"
                value={searchInput}
                onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
              />
            </div>
            {/* Type Filter */}
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
              <Filter size={14} className="text-slate-400" />
              <select
                value={filterType}
                onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                className="border-none text-xs font-bold text-slate-600 focus:ring-0 outline-none cursor-pointer bg-transparent"
              >
                <option value="All">All Types</option>
                <option value="Online">Online (Telemedicine)</option>
                <option value="Stationary">Stationary (In-Person)</option>
              </select>
            </div>
          </div>
        </div>

        {txLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-[#0EA5E9]" size={36} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead className="bg-slate-50/60 text-[10px] font-black uppercase text-slate-400 tracking-[0.15em] border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Transaction ID</th>
                  <th className="px-8 py-5">Doctor & Patient</th>
                  <th className="px-8 py-5">Visit Info</th>
                  <th className="px-8 py-5">Total Paid</th>
                  <th className="px-8 py-5">Our 20%</th>
                  <th className="px-8 py-5">Payment Status</th>
                  <th className="px-8 py-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {transactions.length > 0 ? transactions.map((appt: any) => {
                  const fee = appt.doctor?.consultationFee || 0;
                  const commission = fee * 0.20;
                  const patientName = appt.patient
                    ? `${appt.patient.firstName || ""} ${appt.patient.lastName || ""}`.trim()
                    : "Unknown";
                  const doctorName = appt.doctor
                    ? `Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`
                    : "Unknown";
                  const isOnline = appt.type === "TELEMEDICINE";
                  const shortId = appt._id?.slice(-6).toUpperCase() || "------";

                  return (
                    <tr key={appt._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <span className="text-xs font-black text-slate-400 font-mono tracking-wider">
                          #TRX-{shortId}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800 tracking-tight">
                            Doc: {doctorName}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold tracking-tighter mt-0.5">
                            Pat: {patientName}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-2.5 py-1 rounded-lg border ${isOnline
                          ? "bg-sky-50 text-sky-600 border-sky-100"
                          : "bg-amber-50 text-amber-600 border-amber-100"
                          }`}>
                          {isOnline ? <Monitor size={11} /> : <MapPin size={11} />}
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-sm font-black text-slate-700 tracking-tighter">
                          ${fee.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-emerald-100 rounded text-emerald-600">
                            <ArrowDownLeft size={12} />
                          </div>
                          <span className="text-sm font-black text-emerald-600">
                            ${commission.toLocaleString("en-IN")}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1.5 rounded-xl ${appt.paymentStatus === "PAID"
                          ? "bg-emerald-50 text-emerald-600"
                          : appt.paymentStatus === "FAILED"
                            ? "bg-rose-50 text-rose-600"
                            : "bg-amber-50 text-amber-600"
                          }`}>
                          {appt.paymentStatus === "PAID" ? "✓ Paid" : appt.paymentStatus === "FAILED" ? "✕ Failed" : "⏳ Pending"}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-bold text-slate-400 tracking-tight">
                          {dayjs(appt.appointmentDate).format("DD MMM, YYYY")}
                        </span>
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={6} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Calendar size={44} />
                        <p className="text-base font-black uppercase tracking-widest italic">
                          No transactions found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pb-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
          >
            Previous
          </button>
          <span className="font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
            <span className="text-[#0EA5E9]">{page}</span> / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition-all shadow-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// --- Stat Card Component ---
const FinanceCard = ({
  title,
  amount,
  desc,
  icon,
  bg,
}: {
  title: string;
  amount: string;
  desc: string;
  icon: React.ReactNode;
  bg: string;
}) => (
  <div className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex items-start justify-between group hover:border-sky-200 hover:shadow-md transition-all duration-200">
    <div className="space-y-2">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h2 className="text-3xl font-black text-slate-800 tracking-tighter">{amount}</h2>
      <p className="text-[10px] text-slate-500 font-bold bg-slate-50 w-fit px-2 py-0.5 rounded-md">
        {desc}
      </p>
    </div>
    <div className={`p-4 ${bg} rounded-2xl shadow-inner`}>{icon}</div>
  </div>
);

export default FinancialTracking;