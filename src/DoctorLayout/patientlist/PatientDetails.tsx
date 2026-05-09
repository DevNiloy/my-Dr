import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAppSelector } from '../../redux/hooks'

export default function PatientDetails() {
  const { id } = useParams()
  const navigate = useNavigate()

  const patient = useAppSelector(state =>
    state.patients.patients.find(p => p.id === id)
  )

  if (!patient) {
    return (
      <div className="p-6 text-red-500">
        Patient not found
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate(-1)}
        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">
          {patient.name}
        </h1>

        <div className="mt-2 text-sm text-gray-600 space-y-1">
          <p>Age: {patient.age}</p>
          <p>Gender: {patient.gender}</p>
          <p>Blood Group: {patient.bloodGroup}</p>
          <p>Phone: {patient.phone}</p>
          <p>Address: {patient.address}</p>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-4">

        <div className="bg-sky-50 border rounded-2xl p-4">
          <h2 className="font-semibold text-gray-700">Reports</h2>
          <p className="text-3xl font-bold">12</p>
        </div>

        <div className="bg-green-50 border rounded-2xl p-4">
          <h2 className="font-semibold text-gray-700">Prescriptions</h2>
          <p className="text-3xl font-bold">5</p>
        </div>

        <div className="bg-yellow-50 border rounded-2xl p-4">
          <h2 className="font-semibold text-gray-700">Last Visit</h2>
          <p className="text-sm mt-1">
            {patient.lastVisit || 'No record'}
          </p>
        </div>

      </div>

      {/* ACTION BUTTONS */}
      <div className="flex flex-wrap gap-3">

        <Link
          to={`/dashboard/doctor/reports/${patient.id}`}
          className="bg-sky-500 text-white px-4 py-2 rounded-xl"
        >
          View Reports
        </Link>

        <Link
          to={`/dashboard/doctor/prescriptions/${patient.id}`}
          className="bg-green-500 text-white px-4 py-2 rounded-xl"
        >
          View Prescriptions
        </Link>

        <Link
          to={`/dashboard/doctor/prescription/create/${patient.id}`}
          className="bg-purple-500 text-white px-4 py-2 rounded-xl"
        >
          Add Prescription
        </Link>

      </div>

    </div>
  )
}