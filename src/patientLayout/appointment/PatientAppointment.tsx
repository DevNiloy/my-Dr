import { Link } from "react-router-dom";
import { Video, CalendarDays, Clock3 } from "lucide-react";

interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  date: string;
  time: string;
  status: "upcoming" | "completed" | "cancelled";
  zoomLink: string;
}

export default function PatientAppointment() {
  const appointments: Appointment[] = [
    {
      id: "1",
      doctorName: "Dr. John Doe",
      specialization: "Cardiologist",
      date: "12 May 2026",
      time: "10:00 AM",
      status: "upcoming",
      zoomLink: "https://zoom.us/",
    },
    {
      id: "2",
      doctorName: "Dr. Sarah Smith",
      specialization: "Neurologist",
      date: "08 May 2026",
      time: "02:30 PM",
      status: "completed",
      zoomLink: "https://zoom.us/",
    },
    {
      id: "3",
      doctorName: "Dr. David",
      specialization: "Dermatologist",
      date: "05 May 2026",
      time: "11:00 AM",
      status: "cancelled",
      zoomLink: "https://zoom.us/",
    },
  ];

  return (
    <div className="space-y-6">
      {/* TOPBAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage your upcoming consultations
          </p>
        </div>

        {/* BOOK BUTTON */}
        <Link
          to="/appointment"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-medium transition-all text-center"
        >
          Book Appointment
        </Link>
      </div>

      {/* APPOINTMENTS */}
      <div className="grid gap-5">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* LEFT */}
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {app.doctorName}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {app.specialization}
                </p>
              </div>

              {/* STATUS */}
              <div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    app.status === "upcoming"
                      ? "bg-blue-100 text-blue-700"
                      : app.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            </div>

            {/* INFO */}
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                <CalendarDays size={20} className="text-blue-600" />

                <div>
                  <p className="text-xs text-gray-500">Appointment Date</p>

                  <h3 className="font-semibold text-gray-800">{app.date}</h3>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
                <Clock3 size={20} className="text-green-600" />

                <div>
                  <p className="text-xs text-gray-500">Appointment Time</p>

                  <h3 className="font-semibold text-gray-800">{app.time}</h3>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={app.zoomLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all ${
                  app.status === "cancelled"
                    ? "bg-gray-200 text-gray-500 pointer-events-none"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                <Video size={18} />
                Join Zoom Call
              </a>

              <button
                className={`px-5 py-3 rounded-2xl font-medium ${
                  app.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : app.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {app.status === "completed"
                  ? "Consultation Completed"
                  : app.status === "cancelled"
                    ? "Appointment Cancelled"
                    : "Upcoming Consultation"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
