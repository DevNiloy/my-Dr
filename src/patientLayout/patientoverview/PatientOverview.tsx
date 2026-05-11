import { useAppSelector } from "../../redux/hooks";
import { Calendar, FileText, Activity, Clock } from "lucide-react";

export default function PatientOverview() {
  const appointments = useAppSelector(
    (state) => state.appointments?.appointments || [],
  );

  const prescriptions = useAppSelector(
    (state) => state.prescriptions?.prescriptions || [],
  );

  //@ts-ignore
  const reports = useAppSelector((state) => state.reports?.reports || []);

  const today = "2026-05-11";

  const todayAppointments = appointments.filter((a: any) => a.date === today);

  const upcomingAppointments = appointments.filter(
    (a: any) => a.status === "upcoming",
  );

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Patient Overview</h1>
        <p className="text-sm text-gray-500">Your health summary at a glance</p>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-blue-600">
            <Calendar size={18} />
            <p className="text-sm text-gray-600">Today Visits</p>
          </div>
          <h2 className="text-2xl font-bold mt-1">
            {todayAppointments.length}
          </h2>
        </div>

        <div className="bg-green-50 border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-green-600">
            <Clock size={18} />
            <p className="text-sm text-gray-600">Upcoming</p>
          </div>
          <h2 className="text-2xl font-bold mt-1">
            {upcomingAppointments.length}
          </h2>
        </div>

        <div className="bg-yellow-50 border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-yellow-600">
            <FileText size={18} />
            <p className="text-sm text-gray-600">Prescriptions</p>
          </div>
          <h2 className="text-2xl font-bold mt-1">{prescriptions.length}</h2>
        </div>

        <div className="bg-purple-50 border rounded-2xl p-4">
          <div className="flex items-center gap-2 text-purple-600">
            <Activity size={18} />
            <p className="text-sm text-gray-600">Reports</p>
          </div>
          <h2 className="text-2xl font-bold mt-1">{reports.length}</h2>
        </div>
      </div>

      {/* TODAY APPOINTMENTS */}
      <div className="bg-white border rounded-2xl p-5">
        <h2 className="font-bold text-gray-800 mb-4">Today Appointments</h2>

        {todayAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">No appointments today</p>
        ) : (
          <div className="space-y-3">
            {todayAppointments.map((a: any) => (
              <div
                key={a.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-semibold">{a.doctorName}</p>
                  <p className="text-sm text-gray-500">
                    {a.time} • {a.reason}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    a.status === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : a.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
