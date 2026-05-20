import React, { useState } from "react";
import {
  Calendar,
  Clock,
  Monitor,
  MapPin,
  Search,
  Loader2,
  Eye,
  Video,
  X,
  CheckCircle2,
  FileText
} from "lucide-react";
import dayjs from "dayjs";
import { useGetDoctorAppointmentsQuery } from "../../redux/api/appointmentApi";
import PrescriptionModal from "../../cliniclayout/PrescriptionModal";
import ViewPrescriptionModal from "../../shared_components/ViewPrescriptionModal";

const DoctorAppointment: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("ALL"); // today, upcoming, cancelled, ALL
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isViewPrescriptionModalOpen, setIsViewPrescriptionModalOpen] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState<any>(null);
  const limit = 10;

  const { data, isLoading, isFetching } = useGetDoctorAppointmentsQuery({
    date: activeTab === "today" ? "today" : activeTab === "upcoming" ? "upcoming" : undefined,
    status: activeTab === "cancelled" ? "CANCELLED" : undefined,
    search: searchInput || undefined,
    page,
    limit,
  });

  const appointments = data?.data || [];
  const totalPages = data?.pages || 1;

  const handleOpenDetails = (app: any) => {
    setSelectedAppointment(app);
    setIsModalOpen(true);
  };

  const handleOpenPrescription = (app: any) => {
    setPrescriptionData({
      _id: app._id,
      patientId: app.patient?._id,
      doctorId: app.doctor?._id,
      patientName: `${app.patient?.firstName || ""} ${app.patient?.lastName || ""}`.trim(),
      doctorName: `${app.doctor?.firstName || ""} ${app.doctor?.lastName || ""}`.trim()
    });
    setIsPrescriptionModalOpen(true);
  };

  const handleClosePrescriptionModal = (showPreview?: boolean) => {
    setIsPrescriptionModalOpen(false);
    if (showPreview) {
      setIsViewPrescriptionModalOpen(true);
    }
  };

  const tabs = [
    { label: "Today", value: "today" },
    { label: "Upcoming", value: "upcoming" },
    { label: "Cancelled", value: "cancelled" },
    { label: "All", value: "ALL" },
  ];

  return (
    <div className="p-4 lg:p-8 space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div border-l-4 border-blue-600 pl-4>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Doctor Appointments</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage your consultations and patient records.</p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(1); }}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                activeTab === tab.value 
                ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-100" 
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-sky-300 transition-all">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by patient name..." 
            className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
           <div className="flex justify-center items-center py-24">
              <Loader2 className="animate-spin text-[#0EA5E9]" size={40} />
           </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <tr>
                  <th className="px-8 py-5">Patient Details</th>
                  <th className="px-8 py-5">Visit Type</th>
                  <th className="px-8 py-5">Schedule</th>
                  <th className="px-8 py-5">Admin Status</th>
                  <th className="px-8 py-5">Telemedicine</th>
                  <th className="px-8 py-5 text-center">Actions</th>
                  <th className="px-8 py-5 text-center">Rx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length > 0 ? (
                  appointments.map((app: any) => {
                    const patientName = app.patient ? `${app.patient.firstName || ''} ${app.patient.lastName || ''}`.trim() : "Unknown Patient";

                    return (
                      <tr key={app._id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{patientName}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">
                              PID: #{app._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-3 py-1.5 rounded-xl border ${
                            app.type === 'TELEMEDICINE' 
                            ? 'bg-blue-50 text-blue-600 border-blue-100' 
                            : 'bg-amber-50 text-amber-600 border-amber-100'
                          }`}>
                            {app.type === 'TELEMEDICINE' ? <Monitor size={12} /> : <MapPin size={12} />}
                            {app.type === 'TELEMEDICINE' ? 'Online' : 'In Person'}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                              <Clock size={14} className="text-[#0EA5E9]" /> {app.timeSlot}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium ml-5 mt-0.5">
                               {dayjs(app.appointmentDate).format('DD MMM YYYY')}
                            </span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-600`}>
                              <CheckCircle2 size={12}/>
                              Verified
                           </div>
                        </td>
                        <td className="px-8 py-6">
                            {app.type === 'TELEMEDICINE' ? (
                              app.meetLink ? (
                                <a 
                                   href={app.meetLink} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
                                >
                                   <Video size={14} /> Join Meeting
                                </a>
                              ) : (
                                <span className="text-[10px] text-slate-400 font-bold italic">Link Pending</span>
                              )
                           ) : (
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic opacity-50">In-Person</span>
                           )}
                        </td>
                        <td className="px-8 py-6 text-center">
                           <button 
                              onClick={() => handleOpenDetails(app)}
                              className="p-2.5 text-slate-400 hover:text-[#0EA5E9] hover:bg-sky-50 rounded-xl transition-all"
                              title="View Details"
                           >
                              <Eye size={20} />
                           </button>
                        </td>
                        <td className="px-8 py-6 text-center">
                           <button 
                              onClick={() => handleOpenPrescription(app)}
                              className="p-2.5 text-blue-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm"
                              title="Issue Prescription"
                           >
                              <FileText size={18} />
                           </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Calendar size={48} />
                        <p className="text-lg font-black uppercase tracking-widest italic">No Appointments Found</p>
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
        <div className="flex items-center justify-center gap-3 pt-4 pb-10">
           <button 
             onClick={() => setPage(p => Math.max(1, p - 1))} 
             disabled={page === 1}
             className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
           >
             Previous
           </button>
           <span className="font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
             <span className="text-[#0EA5E9]">{page}</span> / {totalPages}
           </span>
           <button 
             onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
             disabled={page === totalPages}
             className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
           >
             Next
           </button>
        </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 space-y-6">
              {/* Modal Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Appointment Details</h2>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">ID: #{selectedAppointment._id}</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-slate-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Patient Name</p>
                  <p className="font-bold text-slate-800">{selectedAppointment.patient?.firstName} {selectedAppointment.patient?.lastName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Appointment Type</p>
                  <p className="font-bold text-slate-800">{selectedAppointment.type === 'TELEMEDICINE' ? 'Online' : 'In Person'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                  <p className="font-bold text-slate-800">{dayjs(selectedAppointment.appointmentDate).format('DD MMMM, YYYY')}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Slot</p>
                  <p className="font-bold text-slate-800">{selectedAppointment.timeSlot}</p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Symptoms</p>
                  <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-2xl italic">
                    {selectedAppointment.symptoms || "No symptoms listed."}
                  </p>
                </div>
                <div className="col-span-2 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Status</p>
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    selectedAppointment.paymentStatus === 'PAID' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {selectedAppointment.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-lg shadow-slate-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isPrescriptionModalOpen && prescriptionData && (
        <PrescriptionModal 
          isOpen={isPrescriptionModalOpen}
          onClose={handleClosePrescriptionModal}
          appointmentData={prescriptionData}
        />
      )}

      {isViewPrescriptionModalOpen && prescriptionData && (
        <ViewPrescriptionModal 
          isOpen={isViewPrescriptionModalOpen}
          onClose={() => setIsViewPrescriptionModalOpen(false)}
          patientId={prescriptionData.patientId}
          showDownload={false}
        />
      )}
    </div>
  );
};

export default DoctorAppointment;