import { useMemo, useState } from "react";
import { FileText, Download, Eye, CalendarDays, Loader2, ClipboardList } from "lucide-react";
import { useGetPrescriptionsQuery } from "../../redux/api/prescriptionApi";
import dayjs from "dayjs";

export default function PatientPrescription() {
  const [dateFilter, setDateFilter] = useState<string>("");
  const { data, isLoading } = useGetPrescriptionsQuery({});
  const prescriptions = data?.data || [];

  const filtered = useMemo(() => {
    if (!dateFilter) return prescriptions;
    return prescriptions.filter((p: any) => dayjs(p.createdAt).format('YYYY-MM-DD') === dateFilter);
  }, [dateFilter, prescriptions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Medical Prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={32} />
            My Prescriptions
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Access your medical history and digitial prescriptions
          </p>
        </div>

        {/* FILTER Logic */}
        <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-[1.5rem] border border-slate-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <CalendarDays className="text-slate-400" size={18} />
            <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="bg-transparent border-none outline-none font-bold text-slate-700 text-sm"
            />
          </div>
          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="px-4 py-2 bg-white text-rose-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* LISTING Area */}
      <div className="grid gap-6">
        {filtered.length > 0 ? (
          filtered.map((rx: any) => (
            <div
              key={rx._id}
              className="bg-white border-2 border-slate-50 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 hover:border-blue-100 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 relative">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-blue-100 group-hover:scale-110 transition-transform">
                    <FileText size={28} />
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-black text-2xl text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase leading-tight">
                        {rx.title}
                    </h2>

                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2 text-slate-400 font-bold bg-slate-50 px-3 py-1 rounded-full text-xs">
                        <CalendarDays size={14} />
                        {dayjs(rx.createdAt).format('DD MMMM YYYY')}
                      </div>
                      <div className="flex items-center gap-2 text-slate-400 font-bold bg-slate-50 px-3 py-1 rounded-full text-xs">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        By Dr. {rx.doctor?.firstName} {rx.doctor?.lastName}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {rx.fileUrl && (
                    <a 
                      href={rx.fileUrl} 
                      target="_blank" 
                      className="px-6 py-4 bg-slate-50 text-slate-800 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 hover:text-white transition-all shadow-sm"
                    >
                      <Eye size={18} /> View Document
                    </a>
                  )}
                  <a 
                    href={rx.fileUrl} 
                    download
                    className="p-4 bg-blue-600 text-white rounded-[1.5rem] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Download size={20} />
                  </a>
                </div>
              </div>

              {/* DESCRIPTION Box */}
              <div className="mt-8 bg-blue-50/30 p-6 rounded-[2rem] border border-blue-50">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                    <ClipboardList size={14} />
                    Medicinal Advice & Analysis
                </p>
                <p className="text-slate-600 font-medium italic leading-relaxed">
                  "{rx.description}"
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 py-24 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-slate-200" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">No Prescriptions Available</h3>
            <p className="text-slate-400 font-medium max-w-xs mt-2 mx-auto">
              You don't have any medical prescriptions recorded in the system yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
