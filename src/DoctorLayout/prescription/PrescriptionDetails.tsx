import { useParams } from 'react-router-dom'
import { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useAppSelector } from '../../redux/hooks'

export default function PrescriptionDetails() {
  const { id } = useParams()
  const pdfRef = useRef<HTMLDivElement>(null)

  const prescription = useAppSelector(state =>
    state.prescriptions.prescriptions.find(p => p.id === id)
  )

  if (!prescription) {
    return (
      <div className="p-6 text-red-500">
        Prescription not found
      </div>
    )
  }

  const handleDownload = async () => {
    const element = pdfRef.current
    if (!element) return

    // 🔥 wait for DOM render stability
    await new Promise(resolve => setTimeout(resolve, 300))

    const canvas = await html2canvas(element, {
      scale: 2, // high quality PDF
      useCORS: true,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/png')

    const pdf = new jsPDF('p', 'mm', 'a4')

    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`rx-${prescription.patientName}.pdf`)
  }

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-gray-50 min-h-screen">

      {/* TOP BAR */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Prescription Details
        </h1>

        <button
          onClick={handleDownload}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
        >
          Download PDF
        </button>
      </div>

      {/* PRINT AREA */}
      <div
        ref={pdfRef}
        className="bg-white border rounded-2xl p-6 shadow-sm overflow-visible"
      >

        {/* HEADER */}
        <div className="text-center border-b pb-3">
          <h2 className="text-2xl font-bold">
            Medical Prescription (Rx)
          </h2>
          <p className="text-sm text-gray-500">
            Patient: {prescription.patientName}
          </p>
        </div>

        {/* PATIENT INFO */}
        <div className="mt-4 text-sm text-gray-600 space-y-1">
          <p>Age: {prescription.age}</p>
          <p>Gender: {prescription.gender}</p>
          <p>Date: {new Date(prescription.createdAt).toDateString()}</p>
        </div>

        {/* DIAGNOSIS */}
        <div className="mt-4">
          <h3 className="font-semibold">Diagnosis</h3>
          <p className="text-sm text-gray-700">
            {prescription.diagnosis}
          </p>
        </div>

        {/* MEDICINES */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Medicines</h3>

          <table className="w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Medicine</th>
                <th className="p-2 text-left">Dosage</th>
                <th className="p-2 text-left">Frequency</th>
                <th className="p-2 text-left">Duration</th>
              </tr>
            </thead>

            <tbody>
              {prescription.medicines.map((m, i) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{m.name}</td>
                  <td className="p-2">{m.dosage}</td>
                  <td className="p-2">{m.frequency}</td>
                  <td className="p-2">{m.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ADVICE */}
        <div className="mt-4 bg-yellow-50 border p-3 rounded-xl">
          <p className="font-semibold">Advice</p>
          <p className="text-sm">
            {prescription.advice}
          </p>
        </div>

        {/* SIGNATURE */}
        <div className="mt-10 text-right">
          <p className="border-t w-48 ml-auto"></p>
          <p className="text-xs text-gray-500">
            Doctor Signature
          </p>
        </div>

      </div>
    </div>
  )
}