
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setSelectedPatient } from '../../redux/feature/patient/patientSlice'

export default function PatientList() {
  const { patients, loading } = useAppSelector(state => state.patients)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleSelect = (id: string) => {
    const patient = patients.find(p => p.id === id)
    if (patient) {
      dispatch(setSelectedPatient(patient))
      navigate(`/dashboard/doctor/emr/${id}`)
    }
  }

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-3">
        <h1 className="text-2xl font-bold text-gray-800">
          Patients
        </h1>

        <input
          type="text"
          placeholder="Search patient..."
          className="border px-4 py-2 rounded-xl w-full lg:w-72 outline-none focus:ring-2 focus:ring-sky-400"
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading patients...</p>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {patients.map(patient => (
          <div
            key={patient.id}
            onClick={() => handleSelect(patient.id)}
            className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {/* Name */}
            <h2 className="text-lg font-semibold text-gray-800">
              {patient.name}
            </h2>

            {/* Info */}
            <div className="mt-3 space-y-1 text-sm text-gray-600">
              <p>Age: {patient.age}</p>
              <p>Gender: {patient.gender}</p>
              <p>Blood Group: {patient.bloodGroup}</p>
              <p>Phone: {patient.phone}</p>
              <p>Last Visit: {patient.lastVisit || 'N/A'}</p>
            </div>

            {/* Action */}
            <button
              onClick={() => handleSelect(patient.id)}
              className="mt-4 w-full bg-sky-500 hover:bg-sky-600 text-white py-2 rounded-xl transition"
            >
              View EMR
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}