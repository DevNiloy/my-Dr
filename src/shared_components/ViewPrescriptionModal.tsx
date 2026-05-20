import React, { useState } from "react";
import { 
  X, FileText, Calendar, Loader2, Download,
  ShieldCheck, AlertCircle, RefreshCcw, Share2, Check
} from "lucide-react";
import { useGetPatientPrescriptionsQuery } from "../redux/api/prescriptionApi";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

interface ViewPrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  showDownload?: boolean;
}

const ViewPrescriptionModal: React.FC<ViewPrescriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  patientId,
  showDownload = true 
}) => {
  const { data, isLoading, isFetching, refetch } = useGetPatientPrescriptionsQuery(patientId, {
    skip: !patientId || !isOpen,
    refetchOnMountOrArgChange: true
  });

  const [isCopying, setIsCopying] = useState(false);
  const prescriptions = data?.data || [];
  const isRefreshing = isFetching && !isLoading;

  // Use the actual patient ID from the records if available (Source of Truth)
  const canonicalPatientId = prescriptions.length > 0 && prescriptions[0].patient?._id 
    ? prescriptions[0].patient._id 
    : patientId;

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/public/prescriptions/${canonicalPatientId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopying(true);
      toast.success("Public Share Link copied to clipboard!");
      setTimeout(() => setIsCopying(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link.");
    }
  };

  const handleDownloadPDF = async (pxId: string) => {
    if (!showDownload) return;
    
    const element = document.getElementById(`prescription-${pxId}`);
    if (!element) {
      toast.error("Download template not found.");
      return;
    }

    const downloadToast = toast.loading("Generating professional PDF...");

    try {
      // Ensure element is visible for canvas capture
      const originalStyle = element.style.display;
      element.style.display = 'block';

      const canvas = await html2canvas(element, {
        scale: 3, // Higher resolution
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        windowWidth: 800, // Fixed width for consistent rendering
      });

      element.style.display = originalStyle;

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / pdfWidth;
      const finalHeight = canvasHeight / ratio;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, finalHeight);
      pdf.save(`Prescription-${pxId.slice(-6).toUpperCase()}.pdf`);
      
      toast.update(downloadToast, { 
        render: "Prescription downloaded successfully!", 
        type: "success", 
        isLoading: false, 
        autoClose: 3000 
      });
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.update(downloadToast, { 
        render: "Failed to generate PDF. Please try again.", 
        type: "error", 
        isLoading: false, 
        autoClose: 3000 
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[95vh] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-white relative">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-100 animate-pulse-slow">
              <FileText size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 tracking-tight">Prescription History</h2>
              <div className="flex items-center gap-2 mt-1">
                {isLoading || isRefreshing ? (
                   <span className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest">
                      <Loader2 size={12} className="animate-spin" /> Fetching Records...
                   </span>
                ) : (
                   <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2 py-0.5 bg-slate-50 rounded-full border border-slate-100">
                      {prescriptions.length} Records Verified for Patient
                   </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-[1.2rem] text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100 active:scale-95"
            >
                {isCopying ? <Check size={16} /> : <Share2 size={16} />}
                {isCopying ? "Link Copied" : "Share Record"}
            </button>
            <button 
                onClick={() => refetch()}
                className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                title="Refresh Records"
            >
                <RefreshCcw size={20} className={isRefreshing ? "animate-spin" : ""} />
            </button>
            <button 
                onClick={onClose}
                className="p-3 bg-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-all shadow-inner"
            >
                <X size={24} />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-slate-50/10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-blue-50 rounded-full animate-spin border-t-blue-500" />
                <FileText className="absolute inset-0 m-auto text-blue-200" size={24} />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-slate-800 uppercase tracking-widest">Loading Digital Records</p>
                <p className="text-xs text-slate-400 mt-2 font-medium italic">Establishing secure connection...</p>
              </div>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-24 space-y-8 animate-in fade-in duration-500">
              <div className="relative mx-auto w-32 h-32 flex items-center justify-center group">
                 <div className="absolute inset-0 bg-slate-100/50 rounded-[2.5rem] scale-90 group-hover:scale-100 transition-transform duration-500" />
                 <AlertCircle size={64} className="text-slate-200 relative z-10 group-hover:text-blue-200 transition-colors duration-500" />
              </div>
              <div className="space-y-3 max-w-sm mx-auto">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-tight">Records Unavailable</h3>
                <p className="text-slate-400 font-medium leading-relaxed italic">
                   "We couldn't locate any digital prescriptions registered for this identity."
                </p>
                <div className="pt-6 flex flex-col gap-3">
                   <button 
                      onClick={() => refetch()}
                      className="px-8 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-700 transition-all flex items-center gap-3 mx-auto shadow-2xl shadow-blue-200 active:scale-95"
                   >
                      <RefreshCcw size={16} /> Force Sync Records
                   </button>
                   <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">Patient ID: {patientId}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-12 pb-10">
              {prescriptions.map((px: any) => (
                <div key={px._id} className="relative animate-in slide-in-from-bottom-4 duration-500">
                  {/* Visual Card */}
                  <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/30 transition-all duration-500 overflow-hidden ring-1 ring-slate-100">
                    
                    {/* Card Header */}
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white shrink-0">
                      <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-3xl shrink-0 group-hover:scale-110 transition-transform">🩺</div>
                        <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1 italic">Authorized Medical Specialist</p>
                          <h3 className="text-2xl font-black text-slate-800 leading-tight">
                             Dr. {px.doctor?.firstName} {px.doctor?.lastName}
                          </h3>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{px.doctor?.specialization}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-5">
                         <div className="text-right flex flex-col items-end pr-5 border-r border-slate-100">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Authorization Date</span>
                            <span className="text-base font-black text-slate-800">{dayjs(px.createdAt).format("DD MMM, YYYY")}</span>
                         </div>
                         
                         {showDownload && (
                           <button 
                              onClick={() => handleDownloadPDF(px._id)}
                              className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 active:scale-90"
                              title="Download PDF"
                           >
                              <Download size={22} />
                           </button>
                         )}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-10 grid md:grid-cols-12 gap-12">
                      <div className="md:col-span-5 space-y-6">
                         <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
                            <span className="w-8 h-1 bg-blue-500 rounded-full" />
                            Primary Diagnosis
                         </h4>
                         <div className="bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-100 shadow-inner">
                            <p className="text-base font-bold text-slate-700 leading-relaxed italic">
                               "{px.diagnosis}"
                            </p>
                         </div>
                      </div>

                      <div className="md:col-span-7 space-y-6">
                         <h4 className="flex items-center gap-3 text-[10px] font-black text-slate-800 uppercase tracking-[0.3em]">
                            <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                            Medicinal Regimen (Rx)
                         </h4>
                         <div className="grid gap-3">
                            {px.medicines?.map((med: any, idx: number) => (
                              <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl gap-5 hover:border-blue-200 hover:bg-blue-50/10 transition-all group/med">
                                 <div className="flex items-center gap-5">
                                    <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center text-xs font-black group-hover/med:bg-blue-500 group-hover/med:text-white transition-all">
                                      {idx + 1}
                                    </div>
                                    <div>
                                      <span className="text-base font-black text-slate-800 group-hover/med:text-blue-600 transition-colors uppercase">{med.name}</span>
                                      <p className="text-[10px] font-black text-slate-400 uppercase mt-0.5">{med.dosage}</p>
                                    </div>
                                 </div>
                                 <div className="flex gap-2">
                                    <span className="px-4 py-1.5 bg-slate-100 rounded-xl text-[9px] font-black text-slate-500 uppercase tracking-widest">{med.frequency}</span>
                                    <span className="px-4 py-1.5 bg-blue-600 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">{med.duration}</span>
                                  </div>
                              </div>
                            ))}
                         </div>
                      </div>
                    </div>

                    {/* Footer Info */}
                    {(px.advice || px.nextVisitDate) && (
                      <div className="px-10 py-8 bg-slate-50/30 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                         {px.advice ? (
                            <div className="flex-1">
                               <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Clinical Advice & Instructions</span>
                               <p className="text-sm text-slate-600 font-bold leading-relaxed">{px.advice}</p>
                            </div>
                         ) : <div></div>}
                         {px.nextVisitDate && (
                            <div className="flex items-center gap-5 bg-white px-8 py-5 rounded-[2.2rem] border border-blue-100 shadow-sm shrink-0">
                               <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-inner">
                                  <Calendar size={24} />
                                </div>
                               <div>
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1.5">Next Recommended Visit</span>
                                  <span className="text-base font-black text-slate-800">{dayjs(px.nextVisitDate).format("DD MMM, YYYY")}</span>
                               </div>
                            </div>
                         )}
                      </div>
                    )}

                    {/* HIDDEN PRINTABLE VERSION */}
                    <div 
                      id={`prescription-${px._id}`} 
                      className="fixed -left-[9999px] top-0 p-12 w-[210mm] shadow-none"
                      style={{ backgroundColor: '#ffffff', borderTop: '20px solid #2563eb' }}
                    >
                       <div className="flex justify-between items-start mb-16 px-4">
                        <div>
                          <h1 className="text-5xl font-black tracking-tighter mb-1 select-none" style={{ color: '#0f172a' }}>Rx PRESECRIPTION</h1>
                          <p className="text-[11px] font-black uppercase tracking-[0.4em] ml-1" style={{ color: '#3b82f6' }}>Unified Medical Network</p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="text-3xl font-black uppercase tracking-tighter" style={{ color: '#1e293b' }}>My-DR System</p>
                          <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>SERIES ID: {px._id.slice(-12).toUpperCase()}</p>
                        </div>
                      </div>
  
                      <div className="grid grid-cols-2 gap-12 mb-16 px-4">
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                              <div className="w-1 h-12 rounded-full" style={{ backgroundColor: '#3b82f6' }} />
                              <div>
                                  <p className="text-[10px] font-black uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>Medical Practitioner</p>
                                  <p className="text-3xl font-black leading-none mb-2" style={{ color: '#0f172a' }}>Dr. {px.doctor?.firstName} {px.doctor?.lastName}</p>
                                  <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: '#2563eb' }}>{px.doctor?.specialization}</p>
                              </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="p-8 rounded-[2.5rem] border inline-block min-w-[250px]" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: '#94a3b8' }}>Patient Records For</p>
                            <p className="text-2xl font-black leading-none mb-2 capitalize" style={{ color: '#0f172a' }}>{px.patient?.firstName} {px.patient?.lastName}</p>
                            <p className="text-[11px] font-black uppercase tracking-widest italic" style={{ color: '#94a3b8' }}>Authorized Date: {dayjs(px.createdAt).format("DD MMMM YYYY")}</p>
                          </div>
                        </div>
                      </div>
  
                      <div className="space-y-16 px-4">
                        <div>
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-4" style={{ color: '#0f172a' }}>
                              <span className="w-12 h-0.5" style={{ backgroundColor: '#2563eb' }} /> Diagnosis Summary
                          </h2>
                          <div className="p-10 rounded-[3rem] border" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                              <p className="text-xl font-bold italic leading-relaxed" style={{ color: '#334155' }}>"{px.diagnosis}"</p>
                          </div>
                        </div>
  
                        <div>
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-8 flex items-center gap-4" style={{ color: '#0f172a' }}>
                              <span className="w-12 h-0.5" style={{ backgroundColor: '#059669' }} /> Prescribed Medication Regimen
                          </h2>
                          <div className="rounded-[2.5rem] overflow-hidden border-2 shadow-sm" style={{ borderColor: '#f8fafc' }}>
                            <table className="w-full border-collapse">
                              <thead>
                                <tr style={{ backgroundColor: '#f8fafc' }}>
                                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Drug Name / Dosage</th>
                                  <th className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Dosage Schedule</th>
                                  <th className="px-10 py-6 text-right text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Total Duration</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y-2 text-sm" style={{ borderColor: '#f8fafc' }}>
                                {px.medicines?.map((med: any, i: number) => (
                                  <tr key={i}>
                                    <td className="px-10 py-8">
                                       <p className="font-black text-lg uppercase" style={{ color: '#1e293b' }}>{med.name}</p>
                                       <p className="text-[10px] font-bold uppercase" style={{ color: '#94a3b8' }}>{med.dosage}</p>
                                    </td>
                                    <td className="px-10 py-8 font-bold uppercase" style={{ color: '#64748b' }}>{med.frequency}</td>
                                    <td className="px-10 py-8 font-black text-right uppercase tracking-widest text-base" style={{ color: '#2563eb' }}>{med.duration}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
  
                        <div className="grid grid-cols-12 gap-12">
                          <div className="col-span-8">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] mb-6 flex items-center gap-4" style={{ color: '#0f172a' }}>
                                <span className="w-12 h-0.5" style={{ backgroundColor: '#94a3b8' }} /> Professional Advice
                            </h2>
                            <div className="p-8 rounded-[2.5rem] border shadow-inner" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                              <p className="text-base font-bold leading-relaxed" style={{ color: '#475569' }}>{px.advice || "No specific advice recorded."}</p>
                            </div>
                          </div>
                          {px.nextVisitDate && (
                            <div className="col-span-4">
                              <div className="p-10 rounded-[3rem] shadow-2xl text-center transform -rotate-1 border-4 border-white" style={{ backgroundColor: '#2563eb', color: '#ffffff' }}>
                                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80 italic">Repeat Consult Date</p>
                                <p className="text-2xl font-black">{dayjs(px.nextVisitDate).format("DD MMM YYYY")}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
  
                      <div className="mt-40 pt-12 border-t flex justify-between items-end px-4" style={{ borderColor: '#f1f5f9' }}>
                        <div className="flex flex-col items-center opacity-30">
                           <span className="text-[8px] font-black uppercase tracking-[0.4em] mb-4" style={{ color: '#94a3b8' }}>VERIFICATION TAG: {px._id.slice(-12)}</span>
                           <div className="px-6 py-6 rounded-3xl flex flex-col items-center justify-center text-[10px] font-black text-center leading-tight" style={{ backgroundColor: '#f1f5f9', color: '#94a3b8' }}>
                              <ShieldCheck size={24} className="mb-2" />
                              SECURE<br/>IDENTITY
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="w-64 h-px mb-6 ml-auto" style={{ backgroundColor: '#e2e8f0' }} />
                           <p className="text-xl font-black mb-1" style={{ color: '#0f172a' }}>Dr. {px.doctor?.firstName} {px.doctor?.lastName}</p>
                           <p className="text-[10px] font-black tracking-[0.3em] uppercase italic" style={{ color: '#94a3b8' }}>Authorized Medical Professional</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-10 border-t border-slate-100 flex justify-center bg-white shrink-0">
           <button 
              onClick={onClose}
              className="px-24 py-4 bg-slate-900 text-white rounded-[2rem] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-slate-200 active:scale-95"
           >
              Dismiss
           </button>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #f1f5f9; 
          border-radius: 10px; 
          border: 3px solid white;
          box-shadow: inset 0 0 10px rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e2e8f0; }
        
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ViewPrescriptionModal;
