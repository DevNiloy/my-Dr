import { useAppSelector } from "../../redux/hooks"

 

export default function DoctorOverview() {

  const appointments = useAppSelector(state => state.appointments?.appointments || [])
  const patients = useAppSelector(state => state.patients.patients || [])
  const prescriptions = useAppSelector(state => state.prescriptions.prescriptions || [])

  const today = "2026-05-10"

  const todayAppointments = appointments.filter(a => a.date === today)

  const totalEarning = appointments
    .filter(a => a.status === "completed")
    .length * 500 // mock fee

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">
          Doctor Overview
        </h1>
        <p className="text-sm text-gray-500">
          Welcome back, Doctor 👨‍⚕️
        </p>
      </div>

      {/* STATS CARDS */}
      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-blue-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Today Appointments</p>
          <h2 className="text-2xl font-bold">
            {todayAppointments.length}
          </h2>
        </div>

        <div className="bg-green-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Total Patients</p>
          <h2 className="text-2xl font-bold">
            {patients.length}
          </h2>
        </div>

        <div className="bg-yellow-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Prescriptions</p>
          <h2 className="text-2xl font-bold">
            {prescriptions.length}
          </h2>
        </div>

        <div className="bg-purple-50 border rounded-2xl p-4">
          <p className="text-sm text-gray-600">Earnings</p>
          <h2 className="text-2xl font-bold">
            ${totalEarning}
          </h2>
        </div>

      </div>

      {/* TODAY APPOINTMENTS */}
      <div className="bg-white border rounded-2xl p-4">

        <h2 className="font-bold mb-3">
          Today Appointments
        </h2>

        {todayAppointments.length === 0 ? (
          <p className="text-sm text-gray-500">
            No appointments today
          </p>
        ) : (
          todayAppointments.map(app => (
            <div
              key={app.id}
              className="flex justify-between items-center border-b py-2"
            >

              <div>
                <p className="font-semibold">
                  {app.patientName}
                </p>
                <p className="text-sm text-gray-500">
                  {app.time} - {app.reason}
                </p>
              </div>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  app.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : app.status === "confirmed"
                    ? "bg-blue-100 text-blue-700"
                    : app.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {app.status}
              </span>

            </div>
          ))
        )}

      </div>

    </div>
  )
}