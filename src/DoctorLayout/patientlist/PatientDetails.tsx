import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Droplets, 
  Calendar as CalendarIcon, 
  User, 
  FileText, 
  Plus, 
  ExternalLink, 
  FileCheck, 
  ClipboardList,
  Loader2,
  X,
  Stethoscope,
  Pill,
//   ShieldCheck
} from 'lucide-react';
import { useGetPatientByIdQuery } from '../../redux/api/patientApi';
import { useGetReportsQuery } from '../../redux/api/reportApi';
import { useGetPatientPrescriptionsQuery } from '../../redux/api/prescriptionApi';
import { useGetDoctorMeQuery } from '../../redux/api/doctorApi';
import dayjs from 'dayjs';
import PrescriptionModal from '../../cliniclayout/PrescriptionModal';
import ViewPrescriptionModal from '../../shared_components/ViewPrescriptionModal';

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isViewPrescriptionModalOpen, setIsViewPrescriptionModalOpen] = useState(false);
  
  // Queries
  const { data: patientData, isLoading: isPatientLoading } = useGetPatientByIdQuery(id!);
  const { data: reportsData } = useGetReportsQuery({ patientId: id });
  const { data: prescriptionsData, isLoading: isPrescriptionsLoading } = useGetPatientPrescriptionsQuery(id!);
  const { data: doctorMeData } = useGetDoctorMeQuery({});

  const patient = patientData?.data;
  const reports = reportsData?.data || [];
  const prescriptions = prescriptionsData?.data || [];
  const doctorMe = doctorMeData?.data;

  const handleClosePrescriptionModal = (showPreview?: boolean) => {
    setIsPrescriptionModalOpen(false);
    if (showPreview) {
      setIsViewPrescriptionModalOpen(true);
    }
  };

  if (isPatientLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-40 space-y-4">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching EMR Records...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
            <X className="text-rose-400" size={32} />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Patient Not Found</h2>
        <button onClick={() => navigate(-1)} className="mt-6 text-blue-600 font-bold flex items-center gap-2">
            <ArrowLeft size={18} /> Back to List
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
      
      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                {patient.firstName} {patient.lastName}
              </h1>
              <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                #{patient._id.slice(-6)}
              </span>
            </div>
            <p className="text-slate-400 font-medium">Full Medical History & Records</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
            <button
              onClick={() => setIsViewPrescriptionModalOpen(true)}
              className="px-6 py-4 bg-white text-slate-700 border border-slate-200 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all shadow-sm"
            >
              <FileText size={18} />
              Browse Records
            </button>
            <button
              onClick={() => setIsPrescriptionModalOpen(true)}
              className="px-6 py-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              <Plus size={18} strokeWidth={3} />
              Issue New Rx
            </button>
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <FileText size={24} />
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Reports</p>
                <p className="text-2xl font-black text-slate-800">{reports.length}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
                <FileCheck size={24} />
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Prescriptions</p>
                <p className="text-2xl font-black text-slate-800">{prescriptions.length}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
                <CalendarIcon size={24} />
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Last Visit</p>
                <p className="text-sm font-bold text-slate-800">{reports.length > 0 ? dayjs(reports[0].createdAt).format('DD MMM YYYY') : 'None'}</p>
            </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
                <Droplets size={24} />
            </div>
            <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Blood Type</p>
                <p className="text-2xl font-black text-slate-800">{patient.bloodGroup || 'N/A'}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PERSONAL INFO */}
        <div className="lg:col-span-4 space-y-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 space-y-8">
                <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                    <User size={20} className="text-blue-500" />
                    Personal Information
                </h3>

                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><CalendarIcon size={16} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Date of Birth</p>
                            <p className="text-sm font-bold text-slate-700">{dayjs(patient.dateOfBirth).format('MMMM DD, YYYY')}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Droplets size={16} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gender</p>
                            <p className="text-sm font-bold text-slate-700 capitalize">{patient.gender}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Phone size={16} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Contact Information</p>
                            <p className="text-sm font-bold text-slate-700">{patient.contactNumber}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><MapPin size={16} /></div>
                        <div>
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Primary Address</p>
                            <p className="text-sm font-bold text-slate-700">{patient.address || 'Not Provided'}</p>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-50">
                    <div className="bg-slate-50 p-6 rounded-3xl">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Security Note</p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed">
                            Medical data is encrypted and only visible to authorized healthcare professionals.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* RIGHT COLUMN: RECORDS */}
        <div className="lg:col-span-8 space-y-8">
            
            {/* PRESCRIPTIONS SECTION */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                        <ClipboardList size={22} className="text-emerald-500" />
                        Medical Prescriptions
                    </h3>
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{prescriptions.length} Records</span>
                </div>
                
                <div className="p-6 space-y-6">
                    {isPrescriptionsLoading ? (
                        <div className="py-10 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
                    ) : prescriptions.length > 0 ? (
                        prescriptions.map((px: any) => (
                            <div key={px._id} className="p-8 bg-slate-50/50 rounded-[2rem] border border-slate-100 hover:border-emerald-200 hover:bg-white transition-all group">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                                          <CalendarIcon size={12} />
                                          {dayjs(px.createdAt).format('DD MMMM YYYY')}
                                        </div>
                                        <h4 className="font-black text-slate-800 text-xl group-hover:text-emerald-600 transition-colors tracking-tight">Prescription #{px._id.slice(-6).toUpperCase()}</h4>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <button 
                                          onClick={() => setIsViewPrescriptionModalOpen(true)}
                                          className="p-3 bg-white text-emerald-600 rounded-[1.2rem] shadow-sm hover:scale-110 transition-transform border border-emerald-50"
                                       >
                                          <ExternalLink size={18} />
                                       </button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm shadow-slate-100/50">
                                    <h5 className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                      <Stethoscope size={14} className="text-emerald-500" /> Diagnosis
                                    </h5>
                                    <p className="text-sm text-slate-700 font-bold italic line-clamp-2">"{px.diagnosis}"</p>
                                  </div>

                                  {px.medicines && px.medicines.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                      {px.medicines.slice(0, 3).map((med: any, i: number) => (
                                        <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase border border-emerald-100 flex items-center gap-1.5 shadow-sm">
                                          <Pill size={12} />
                                          {med.name}
                                        </span>
                                      ))}
                                      {px.medicines.length > 3 && (
                                        <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-[10px] font-black uppercase border border-slate-200">
                                          +{px.medicines.length - 3} More
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-300 grayscale opacity-40">
                            <ClipboardList size={40} className="mb-4" />
                            <p className="font-black text-[10px] uppercase tracking-widest">No previous prescriptions recorded</p>
                        </div>
                    )}
                </div>
            </div>

            {/* REPORTS SECTION */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
                        <FileText size={22} className="text-blue-500" />
                        Clinical Reports
                    </h3>
                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">{reports.length} Records</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Name</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {reports.map((report: any) => (
                                <tr key={report._id} className="hover:bg-blue-50/50 transition-colors group">
                                    <td className="px-8 py-6">
                                        <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-sm">{report.testName}</p>
                                        <p className="text-[10px] text-slate-400 font-medium truncate max-w-[200px] mt-0.5">{report.summary || 'No summary available'}</p>
                                    </td>
                                    <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                        {dayjs(report.createdAt).format('DD MMM, YYYY')}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <a href={report.fileUrl} target="_blank" className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-blue-100">
                                            <ExternalLink size={14} /> View Report
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reports.length === 0 && (
                        <div className="py-20 flex flex-col items-center justify-center text-slate-200 grayscale opacity-30">
                            <FileCheck size={48} />
                            <p className="mt-4 font-black text-[10px] uppercase tracking-widest">No clinical reports uploaded</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* NEW PREMIUM PRESCRIPTION MODAL */}
      {isPrescriptionModalOpen && doctorMe && (
        <PrescriptionModal 
          isOpen={isPrescriptionModalOpen}
          onClose={handleClosePrescriptionModal}
          appointmentData={{
            _id: "DIRECT_ISSUE", 
            patientId: id!,
            doctorId: doctorMe._id,
            patientName: `${patient.firstName} ${patient.lastName}`,
            doctorName: `${doctorMe.firstName} ${doctorMe.lastName}`
          }}
        />
      )}

      {/* VIEW MODAL (For Review/PDF) */}
      {isViewPrescriptionModalOpen && (
        <ViewPrescriptionModal 
          isOpen={isViewPrescriptionModalOpen}
          onClose={() => setIsViewPrescriptionModalOpen(false)}
          patientId={id!}
          showDownload={false}
        />
      )}
    </div>
  );
}