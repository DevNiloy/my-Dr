import React, { useState } from "react";
import {
  Calendar, Clock, Monitor, MapPin, Search,
  Filter, Loader2,
  ShieldAlert, ShieldCheck, ShieldX, Wallet, FileText
} from "lucide-react";
import {
  useGetAppointmentsQuery
} from "../redux/api/appointmentApi";
import dayjs from "dayjs";
import PrescriptionModal from "./PrescriptionModal";
import ViewPrescriptionModal from "../shared_components/ViewPrescriptionModal";

const AppointmentMonitor: React.FC = () => {
  const [filterType, setFilterType] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [isViewPrescriptionModalOpen, setIsViewPrescriptionModalOpen] = useState(false);
  const [selectedAppointmentData, setSelectedAppointmentData] = useState<any>(null);
  const limit = 10;

  // Map filter dropdown to backend enum
  let apiTypeParam: string | undefined;
  if (filterType === "Online") apiTypeParam = "TELEMEDICINE";
  if (filterType === "Stationary") apiTypeParam = "IN_PERSON";

  const { data, isLoading } = useGetAppointmentsQuery({
    status: activeTab !== "ALL" ? activeTab : undefined,
    type: apiTypeParam,
    search: searchInput || undefined,
    page,
    limit,
  });

  const appointments = data?.data || [];
  const totalPages = data?.pages || 1;

  const handleOpenPrescriptionModal = (app: any) => {
    setSelectedAppointmentData({
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
    { label: "All Records", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
  ];

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Header + Tab Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight">Appointment Monitor</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Live tracking and appointment history.</p>
        </div>

        <div className="flex items-center gap-1.5 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-x-auto flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => { setActiveTab(tab.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === tab.value
                ? "bg-[#0EA5E9] text-white shadow-md shadow-sky-100"
                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Search + Type Filter Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm focus-within:border-sky-300 transition-all">
          <Search size={17} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by patient or doctor name..."
            className="bg-transparent border-none text-sm focus:ring-0 w-full outline-none"
            value={searchInput}
            onChange={(e) => { setSearchInput(e.target.value); setPage(1); }}
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(""); setPage(1); }}
              className="text-slate-300 hover:text-slate-500 transition-colors text-xs font-bold shrink-0"
            >
              ✕ Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm min-w-[200px]">
          <Filter size={15} className="text-slate-400 shrink-0" />
          <select
            value={filterType}
            onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
            className="border-none text-xs font-bold text-slate-600 focus:ring-0 outline-none cursor-pointer bg-transparent w-full"
          >
            <option value="All">All Types</option>
            <option value="Online">Online (Telemedicine)</option>
            <option value="Stationary">In-Person (Stationary)</option>
          </select>
        </div>
      </div>

      {/* Appointment Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-[#0EA5E9]" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead className="bg-slate-50/60 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                <tr>
                  <th className="px-6 py-5">Patient</th>
                  <th className="px-6 py-5">Doctor</th>
                  <th className="px-6 py-5">Visit Type</th>
                  <th className="px-6 py-5">Schedule</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Fee / 20%</th>
                  <th className="px-6 py-5">Verification</th>
                  <th className="px-6 py-5 text-center">Rx</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {appointments.length > 0 ? (
                  appointments.map((app: any) => {
                    const fee = app.doctor?.consultationFee || 0;
                    const commission = (fee * 0.20).toFixed(0);
                    const patientName = app.patient
                      ? `${app.patient.firstName || ""} ${app.patient.lastName || ""}`.trim()
                      : "Unknown Patient";
                    const doctorName = app.doctor
                      ? `Dr. ${app.doctor.firstName} ${app.doctor.lastName}`
                      : "Unknown Doctor";
                    const isAdminApproved = app.adminApprovalStatus === "APPROVED";
                    const isAdminRejected = app.adminApprovalStatus === "REJECTED";
                    const isPaid = app.paymentStatus === "PAID";

                    return (
                      <tr key={app._id} className="hover:bg-slate-50/40 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-sm">{patientName || "Anonymous"}</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                              #{app._id.slice(-6).toUpperCase()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#0EA5E9] shrink-0" />
                            <span className="text-sm font-semibold text-slate-600">{doctorName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl border ${app.type === "TELEMEDICINE"
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}>
                            {app.type === "TELEMEDICINE" ? <Monitor size={11} /> : <MapPin size={11} />}
                            {app.type === "TELEMEDICINE" ? "Online" : "In Person"}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-700 flex items-center gap-1.5">
                              <Clock size={13} className="text-[#0EA5E9]" />
                              {app.timeSlot}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium ml-[18px] mt-0.5">
                              {dayjs(app.appointmentDate).format("DD MMM YYYY")}
                            </span>
                          </div>
                        </td>
                         {/* Status Column */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col gap-1.5">
                             <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl ${isPaid
                                ? "bg-emerald-50 text-emerald-600"
                                : app.paymentStatus === "FAILED"
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-amber-50 text-amber-600"
                                }`}>
                                <Wallet size={11} />
                                {app.paymentStatus || "PENDING"}
                              </span>
                              <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl bg-slate-100 text-slate-500`}>
                                {app.status}
                              </span>
                          </div>
                        </td>
                        {/* Fee & Commission */}
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-800">${commission}</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic mt-0.5">
                              Fee: ${fee}
                            </span>
                          </div>
                        </td>
                        {/* Admin Verification (View Only) */}
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-black uppercase px-2.5 py-1 rounded-xl ${isAdminApproved
                            ? "bg-emerald-50 text-emerald-600"
                            : isAdminRejected
                              ? "bg-rose-50 text-rose-600"
                              : "bg-slate-100 text-slate-500"
                            }`}>
                            {isAdminApproved && <ShieldCheck size={11} />}
                            {isAdminRejected && <ShieldX size={11} />}
                            {!isAdminApproved && !isAdminRejected && <ShieldAlert size={11} />}
                            {app.adminApprovalStatus || "PENDING"}
                          </span>
                        </td>
                        {/* Prescription Action */}
                        <td className="px-6 py-5">
                          <div className="flex justify-center">
                            <button
                               onClick={() => handleOpenPrescriptionModal(app)}
                               className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                               title="Issue Prescription"
                            >
                               <FileText size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3 opacity-20">
                        <Calendar size={48} />
                        <p className="text-lg font-black uppercase tracking-widest italic">
                          No Appointments Found
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

      {isPrescriptionModalOpen && selectedAppointmentData && (
        <PrescriptionModal 
          isOpen={isPrescriptionModalOpen}
          onClose={handleClosePrescriptionModal}
          appointmentData={selectedAppointmentData}
        />
      )}

      {isViewPrescriptionModalOpen && selectedAppointmentData && (
        <ViewPrescriptionModal 
          isOpen={isViewPrescriptionModalOpen}
          onClose={() => setIsViewPrescriptionModalOpen(false)}
          patientId={selectedAppointmentData.patientId}
          showDownload={false}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2 pb-10">
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

export default AppointmentMonitor;