import { useParams } from "react-router-dom";
import { 
  FileText, ShieldCheck, Loader2, AlertCircle, 
  Download, Calendar, ClipboardList, Stethoscope
} from "lucide-react";
import { useGetPatientPrescriptionsQuery } from "../../redux/api/prescriptionApi";
import dayjs from "dayjs";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function PublicPrescription() {
  const { patientId } = useParams();
  const { data, isLoading, isError } = useGetPatientPrescriptionsQuery(patientId || "", {
    skip: !patientId
  });

  const prescriptions = data?.data || [];

  const handleDownloadPDF = async (pxId: string) => {
    const element = document.getElementById(`prescription-${pxId}`);
    if (!element) return;

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
      pdf.save(`Prescription-Shared-${pxId.slice(-6).toUpperCase()}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-blue-100 animate-bounce mb-8">
            <FileText className="text-white" size={32} />
        </div>
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-black text-slate-800 uppercase tracking-widest">Verifying Digital ID</h2>
        <p className="text-slate-400 font-bold mt-2">Retrieving authorized medical records...</p>
      </div>
    );
  }

  if (isError || prescriptions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[2.5rem] flex items-center justify-center mb-8">
            <AlertCircle size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Records Not Found</h2>
        <p className="text-slate-500 font-medium max-w-sm mt-4 leading-relaxed">
          The requested medical record link may have expired or the Patient ID is invalid. 
          Please contact our healthcare facility for a valid access link.
        </p>
        <div className="mt-10 p-6 bg-slate-50 rounded-[2rem] border border-slate-100 italic text-slate-400 font-bold text-xs uppercase tracking-widest">
            Identity verification failed for token: {patientId?.slice(0, 8)}...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 animate-in fade-in duration-1000">
      {/* Public Header */}
      <nav className="bg-white border-b border-slate-100 px-6 py-6 sticky top-0 z-50 shadow-sm backdrop-blur-md bg-white/80">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                <ShieldCheck size={24} />
              </div>
              <div>
                 <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] block leading-none mb-1">My-DR Network</span>
                 <h1 className="text-lg font-black text-slate-900 tracking-tighter leading-none">Verified Medical Records</h1>
              </div>
           </div>
           <div className="px-5 py-2.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-100 shadow-sm">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Public Verified Data
           </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
           <h2 className="text-4xl font-black text-slate-900 tracking-tight">Clinical Prescription List</h2>
           <p className="text-slate-500 font-medium">Digital records issued and verified by our medical network.</p>
        </div>

        {prescriptions.map((px: any) => (
          <div key={px._id} className="bg-white rounded-[3.5rem] border border-slate-200 shadow-xl shadow-slate-100 overflow-hidden relative group transition-all hover:shadow-2xl hover:shadow-blue-100/50">
             
             {/* Header */}
             <div className="p-10 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white relative z-10">
                <div className="flex items-center gap-6">
                   <div className="w-20 h-20 bg-slate-50 border-2 border-slate-100 rounded-[2rem] flex items-center justify-center text-4xl shrink-0 group-hover:scale-110 transition-transform duration-500">🩺</div>
                   <div>
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2 px-3 py-1 bg-blue-50 rounded-full inline-block">Authorized Practitioner</p>
                      <h3 className="text-3xl font-black text-slate-900 leading-tight">
                        Dr. {px.doctor?.firstName} {px.doctor?.lastName}
                      </h3>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 italic">{px.doctor?.specialization}</p>
                   </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                   <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Issue Date</span>
                      <span className="text-xl font-black text-slate-800 tracking-tight">{dayjs(px.createdAt).format("DD MMMM, YYYY")}</span>
                   </div>
                   <button 
                      onClick={() => handleDownloadPDF(px._id)}
                      className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 active:scale-95"
                   >
                      <Download size={18} />
                      Save as PDF
                   </button>
                </div>
             </div>

             {/* Layout Grid */}
             <div className="p-10 grid md:grid-cols-12 gap-12 relative z-10">
                <div className="md:col-span-12 lg:col-span-5 space-y-8">
                   <div className="space-y-4">
                      <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
                        <span className="w-10 h-1 bg-blue-500 rounded-full" />
                        Diagnosis Details
                      </h4>
                      <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                         <p className="text-lg font-bold text-slate-700 italic leading-relaxed">
                            "{px.diagnosis}"
                         </p>
                      </div>
                   </div>

                   <div className="p-8 bg-blue-50/50 rounded-[2.5rem] border border-blue-50">
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Stethoscope size={14} /> Medical Analysis
                      </p>
                      <p className="text-xs font-bold text-blue-600/70 leading-relaxed italic">
                        This digital record is encrypted and verified under patient identity protocols. 
                        Unauthorized reproduction is strictly prohibited.
                      </p>
                   </div>
                </div>

                <div className="md:col-span-12 lg:col-span-7 space-y-8">
                   <h4 className="flex items-center gap-3 text-[11px] font-black text-slate-900 uppercase tracking-[0.3em]">
                      <span className="w-10 h-1 bg-emerald-500 rounded-full" />
                      Medicinal Dosage (Rx)
                   </h4>
                   <div className="grid gap-4">
                      {px.medicines?.map((med: any, idx: number) => (
                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between p-8 bg-white border border-slate-100 rounded-[2rem] gap-6 hover:border-blue-200 transition-all shadow-sm">
                           <div className="flex items-center gap-6">
                              <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-sm font-black group-hover:bg-blue-600 group-hover:text-white transition-all">
                                {idx + 1}
                              </div>
                              <div>
                                <span className="text-xl font-black text-slate-900 uppercase tracking-tight">{med.name}</span>
                                <p className="text-xs font-bold text-slate-400 uppercase mt-1 tracking-widest">{med.dosage}</p>
                              </div>
                           </div>
                           <div className="flex gap-3">
                              <span className="px-5 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest">{med.frequency}</span>
                              <span className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100">{med.duration}</span>
                            </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Clinical Advice */}
             {(px.advice || px.nextVisitDate) && (
                <div className="px-10 py-10 bg-slate-50/50 border-t border-slate-100 flex flex-col lg:flex-row justify-between items-start gap-10">
                   <div className="flex-1">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 flex items-center gap-2">
                        <ClipboardList size={16} /> Clinical Instructions
                      </span>
                      <p className="text-base text-slate-600 font-bold leading-relaxed pr-10">{px.advice || "No specific advice recorded."}</p>
                   </div>
                   {px.nextVisitDate && (
                      <div className="flex items-center gap-6 bg-white px-10 py-6 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-50 shrink-0 transform border-t-8 border-blue-600">
                         <div className="w-14 h-14 bg-blue-50 rounded-[1.2rem] flex items-center justify-center text-blue-600">
                            <Calendar size={28} />
                          </div>
                         <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block leading-none mb-2">Follow-up Date</span>
                            <span className="text-2xl font-black text-slate-900 tracking-tight">{dayjs(px.nextVisitDate).format("DD MMM, YYYY")}</span>
                         </div>
                      </div>
                   )}
                </div>
             )}

             {/* Hidden Template for PDF */}
             <div 
                id={`prescription-${px._id}`} 
                className="fixed -left-[9999px] top-0 p-12 w-[210mm] shadow-none"
                style={{ backgroundColor: '#ffffff', borderTop: '20px solid #2563eb' }}
              >
                  <div className="flex justify-between items-start mb-20 px-8">
                    <div>
                      <h1 className="text-6xl font-black tracking-tight mb-2" style={{ color: '#0f172a' }}>Digital Rx</h1>
                      <p className="text-xs font-black uppercase tracking-[0.5em] ml-2" style={{ color: '#3b82f6' }}>Verified Medical Record</p>
                    </div>
                    <div className="text-right">
                       <p className="text-3xl font-black uppercase tracking-tight" style={{ color: '#1e293b' }}>My-DR Network</p>
                       <p className="text-xs font-bold uppercase mt-1" style={{ color: '#94a3b8' }}>Ref ID: {px._id.toUpperCase()}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-16 mb-20 px-8">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Medical Specialist</p>
                      <p className="text-4xl font-black leading-none" style={{ color: '#0f172a' }}>Dr. {px.doctor?.firstName} {px.doctor?.lastName}</p>
                      <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: '#2563eb' }}>{px.doctor?.specialization}</p>
                    </div>
                    <div className="text-right">
                      <div className="p-10 rounded-[3rem] border inline-block min-w-[300px]" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                        <p className="text-[10px] font-black uppercase tracking-widest mb-3" style={{ color: '#94a3b8' }}>Patient Registry Document</p>
                        <p className="text-3xl font-black leading-none mb-3 capitalize" style={{ color: '#0f172a' }}>{px.patient?.firstName} {px.patient?.lastName}</p>
                        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>Authorized: {dayjs(px.createdAt).format("DD MMMM YYYY")}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-20 px-8">
                     <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-6" style={{ color: '#0f172a' }}>
                           <span className="w-16 h-1" style={{ backgroundColor: '#2563eb' }} /> Diagnosis Report
                        </h2>
                        <div className="p-12 rounded-[3.5rem] border" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                           <p className="text-2xl font-bold italic leading-relaxed" style={{ color: '#334155' }}>"{px.diagnosis}"</p>
                        </div>
                     </div>

                     <div className="space-y-8">
                        <h2 className="text-xs font-black uppercase tracking-[0.4em] flex items-center gap-6" style={{ color: '#0f172a' }}>
                           <span className="w-16 h-1" style={{ backgroundColor: '#059669' }} /> Medicinal Schedule
                        </h2>
                        <div className="rounded-[3rem] overflow-hidden border-2" style={{ borderColor: '#f8fafc' }}>
                           <table className="w-full">
                              <thead>
                                 <tr style={{ backgroundColor: '#f8fafc' }}>
                                    <th className="px-12 py-8 text-left text-xs font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Drug Name / Dosage</th>
                                    <th className="px-12 py-8 text-left text-xs font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Regimen</th>
                                    <th className="px-12 py-8 text-right text-xs font-black uppercase tracking-widest" style={{ color: '#94a3b8' }}>Span</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y-2" style={{ borderColor: '#f8fafc' }}>
                                 {px.medicines?.map((med: any, i: number) => (
                                    <tr key={i}>
                                       <td className="px-12 py-10">
                                          <p className="text-2xl font-black uppercase" style={{ color: '#1e293b' }}>{med.name}</p>
                                          <p className="text-xs font-bold uppercase mt-1" style={{ color: '#94a3b8' }}>{med.dosage}</p>
                                       </td>
                                       <td className="px-12 py-10 text-lg font-bold" style={{ color: '#475569' }}>{med.frequency}</td>
                                       <td className="px-12 py-10 text-right text-xl font-black uppercase" style={{ color: '#2563eb' }}>{med.duration}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>

                  <div className="mt-40 pt-16 border-t-2 flex justify-between items-end px-8" style={{ borderColor: '#f1f5f9' }}>
                     <div>
                        <div className="px-10 py-10 rounded-[2.5rem] border inline-block text-center mr-10 opacity-40" style={{ backgroundColor: '#f8fafc', borderColor: '#f1f5f9' }}>
                           <ShieldCheck size={32} className="mx-auto mb-2" style={{ color: '#94a3b8' }} />
                           <p className="text-[10px] font-black uppercase tracking-widest leading-tight" style={{ color: '#94a3b8' }}>Secure<br/>System</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="w-72 h-px mb-8 ml-auto" style={{ backgroundColor: '#e2e8f0' }} />
                        <p className="text-2xl font-black mb-1" style={{ color: '#0f172a' }}>Dr. {px.doctor?.firstName} {px.doctor?.lastName}</p>
                        <p className="text-[11px] font-black tracking-[0.4em] uppercase italic" style={{ color: '#94a3b8' }}>Authorized Medical Identity</p>
                     </div>
                  </div>
              </div>
          </div>
        ))}
      </main>

      {/* Footer Branding */}
      <footer className="text-center py-20 px-6 border-t border-slate-100 bg-white">
         <div className="max-w-xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-slate-50 rounded-[1.5rem] flex items-center justify-center mx-auto text-slate-300">
               <FileText size={32} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Access Your Own Medical History</h3>
            <p className="text-slate-400 font-medium">Join thousands of patients managing their health digitally with 100% security and privacy.</p>
            <button className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all">
               Get Started for Free
            </button>
         </div>
      </footer>
    </div>
  );
}
