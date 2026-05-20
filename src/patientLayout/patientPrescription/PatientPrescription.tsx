import { useMemo, useState } from "react";
import { FileText, Eye, CalendarDays, Loader2, ClipboardList, ShieldCheck, Stethoscope } from "lucide-react";
import { useGetPrescriptionsQuery } from "../../redux/api/prescriptionApi";
import dayjs from "dayjs";
import ViewPrescriptionModal from "../../shared_components/ViewPrescriptionModal";

export default function PatientPrescription() {
  const [dateFilter, setDateFilter] = useState<string>("");
  const { data, isLoading } = useGetPrescriptionsQuery({});
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const prescriptions = data?.data || [];

  const filtered = useMemo(() => {
    if (!dateFilter) return prescriptions;
    return prescriptions.filter((p: any) => dayjs(p.createdAt).format('YYYY-MM-DD') === dateFilter);
  }, [dateFilter, prescriptions]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 animate-in fade-in">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Medical prescriptions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 -mr-8 -mt-8 bg-blue-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <ClipboardList className="text-blue-600" size={32} />
            Medical History
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Browse and download your professional digital prescriptions.
          </p>
        </div>

        {/* FILTER Logic */}
        <div className="relative z-10 flex items-center gap-4 bg-white p-2 rounded-[1.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3 px-4 py-2">
            <CalendarDays className="text-blue-400" size={18} />
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
              className="px-4 py-2 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* LISTING Area */}
      <div className="grid gap-8">
        {filtered.length > 0 ? (
          filtered.map((rx: any) => (
            <div
              key={rx._id}
              className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all group relative overflow-hidden"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[1.5rem] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    <FileText size={30} strokeWidth={2.5} />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                       <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                          <ShieldCheck size={12} /> Verified
                       </span>
                       <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{dayjs(rx.createdAt).format('DD MMMM, YYYY')}</span>
                    </div>
                    <h2 className="font-black text-2xl text-slate-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase">
                        Prescription #{rx._id.slice(-6).toUpperCase()}
                    </h2>
                    <p className="text-sm font-bold text-slate-400">Issued by Dr. {rx.doctor?.firstName} {rx.doctor?.lastName}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setSelectedPatientId(rx.patient?._id || rx.patient);
                    setIsModalOpen(true);
                  }}
                  className="flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95 whitespace-nowrap"
                >
                  <Eye size={18} />
                  View & Download PDF
                </button>
              </div>

              {/* Quick Summary Box */}
              <div className="mt-8 bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 grid md:grid-cols-2 gap-6 items-center">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Stethoscope size={14} className="text-blue-500" />
                       Primary Diagnosis
                   </p>
                   <p className="text-slate-700 font-bold italic line-clamp-1">
                     "{rx.diagnosis || "No specific diagnosis recorded."}"
                   </p>
                </div>
                <div className="flex flex-wrap gap-2 md:justify-end">
                   {rx.medicines?.slice(0, 3).map((m: any, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[9px] font-black text-slate-500 uppercase">
                        {m.name}
                      </span>
                   ))}
                   {rx.medicines?.length > 3 && (
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl text-[9px] font-black uppercase">
                        +{rx.medicines.length - 3} more
                      </span>
                   )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 py-32 flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <FileText className="text-slate-200" size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Access Denied or No Records</h3>
            <p className="text-slate-400 font-medium max-w-xs mt-2 mx-auto italic">
              Record history is currently unavailable.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && selectedPatientId && (
        <ViewPrescriptionModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          patientId={selectedPatientId}
          showDownload={true}
        />
      )}
    </div>
  );
}
