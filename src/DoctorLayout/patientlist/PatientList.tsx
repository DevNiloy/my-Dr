import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  User, 
  Phone, 
  ChevronRight, 
  Loader2, 
  Users,
  Droplets,
  CalendarCheck
} from 'lucide-react';
import { useGetMyPatientsQuery } from '../../redux/api/doctorApi';

export default function PatientList() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data, isLoading } = useGetMyPatientsQuery({ search: searchTerm });
  const patients = data?.data || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Users className="text-blue-600" size={32} />
            My Patients
          </h1>
          <p className="text-slate-500 font-medium mt-1">Manage and view your patient history</p>
        </div>

        <div className="relative group w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-[2rem] font-bold text-slate-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none shadow-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading Patients...</p>
        </div>
      ) : patients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {patients.map((patient: any) => (
            <div
              key={patient._id}
              onClick={() => navigate(`/dashboard/doctor/emr/${patient._id}`)}
              className="group bg-white rounded-[2.5rem] p-6 border-2 border-slate-50 hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 cursor-pointer relative overflow-hidden"
            >
              {/* Decorative Background Element */}
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />

              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
                  <User size={30} />
                </div>
                <div className="flex flex-col items-end">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-1">
                        Active
                    </span>
                    <button className="p-2 text-slate-300 group-hover:text-blue-500 transition-colors">
                        <ChevronRight size={20} />
                    </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
                    {patient.firstName} {patient.lastName}
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        <Droplets size={14} className="text-rose-500" />
                        {patient.bloodGroup || 'N/A'}
                    </span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full" />
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                        {patient.gender}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50 space-y-3">
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                        <Phone size={14} />
                    </div>
                    <span className="text-xs font-bold">{patient.contactNumber}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                        <CalendarCheck size={14} />
                    </div>
                    <span className="text-xs font-bold">Age: {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} years</span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="w-full py-4 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all duration-300 shadow-sm"
                >
                  View Full EMR Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border-2 border-dashed border-slate-100 py-20 flex flex-col items-center justify-center text-center px-6">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Users className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-black text-slate-800">No Patients Found</h3>
          <p className="text-slate-400 font-medium max-w-xs mt-2">
            No patients match your search criteria or you haven't seen any patients yet.
          </p>
        </div>
      )}
    </div>
  );
}