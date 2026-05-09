import { useParams, Link, useNavigate } from 'react-router-dom'
import { mockReports } from '../../../public/mockReports'

export default function ReportList() {
  const { patientid } = useParams()
  const navigate = useNavigate()

  const reports = mockReports.filter(
    r => r.patientId === patientid
  )

  return (
    <div className="p-4 lg:p-6 space-y-4">

      {/* HEADER + BACK BUTTON */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold">
          Patient Reports
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700"
        >
          ← Back
        </button>

      </div>

      {/* CONTENT */}
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found</p>
      ) : (
        reports.map(r => (
          <Link
            key={r.id}
            to={`/dashboard/doctor/patient/reports/${r.id}`}
            className="block border rounded-2xl p-4 bg-white hover:shadow-md transition"
          >

            <h2 className="font-bold">{r.title}</h2>

            <p className="text-sm text-gray-500">
              Type: {r.type}
            </p>

            <p className="text-sm text-gray-500">
              Date: {r.createdAt}
            </p>

          </Link>
        ))
      )}

    </div>
  )
}