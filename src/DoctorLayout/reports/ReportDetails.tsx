import { useParams, useNavigate } from 'react-router-dom'


export default function ReportDetails() {

  const mockReports = [
  {
    id: 'r1',
    patientId: 'p1',
    patientName: 'John Doe',
    title: 'Blood Test Report',
    type: 'lab',
    fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: '2026-05-01'
  },
  {
    id: 'r2',
    patientId: 'p1',
    patientName: 'John Doe',
    title: 'X-Ray Report',
    type: 'imaging',
    fileUrl: 'https://www.africau.edu/images/default/sample.pdf',
    createdAt: '2026-05-03'
  }
]
  const { reportid } = useParams()
  const navigate = useNavigate()

  const report = mockReports.find(r => r.id === reportid)

  if (!report) {
    return (
      <div className="p-6 text-red-500">
        Report not found
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h1 className="text-xl font-bold">
          Report Details
        </h1>

        <button
          onClick={() => navigate(-1)}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl hover:bg-gray-700"
        >
          ← Back
        </button>

      </div>

      {/* CARD */}
      <div className="bg-white border rounded-2xl p-6 shadow-sm">

        <h2 className="text-lg font-semibold">
          {report.title}
        </h2>

        <div className="mt-3 space-y-1 text-sm text-gray-600">

          <p>
            <span className="font-medium">Patient:</span> {report.patientName}
          </p>

          <p>
            <span className="font-medium">Type:</span> {report.type}
          </p>

          <p>
            <span className="font-medium">Date:</span> {report.createdAt}
          </p>

        </div>

        {/* ACTION */}
        <div className="mt-5 flex gap-3">

          <a
            href={report.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700"
          >
            Open Report
          </a>

        </div>

      </div>
    </div>
  )
}