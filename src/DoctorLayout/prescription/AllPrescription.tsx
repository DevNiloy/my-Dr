import { Link } from "react-router-dom"
import { useAppSelector } from "../../redux/hooks"

 

export default function AllPrescription() {
  const { prescriptions } = useAppSelector(state => state.prescriptions)

  return (
    <div className="p-4 lg:p-6 space-y-4">

      <h1 className="text-2xl font-bold">All Prescriptions (Rx)</h1>

      {prescriptions.map(p => (
        <Link  to={`/dashboard/doctor/prescription/${p.id}`}>
        <div key={p.id} className="border rounded-2xl p-4 bg-white">

          <h2 className="font-bold text-lg">
            {p.patientName}
          </h2>

          <p className="text-sm text-gray-600">
            Diagnosis: {p.diagnosis}
          </p>

          <div className="mt-2">
            <h3 className="font-semibold">Medicines:</h3>
            {p.medicines.map((m, i) => (
              <p key={i} className="text-sm text-gray-600">
                {m.name} - {m.dosage} - {m.frequency} - {m.duration}
              </p>
            ))}
          </div>

          <p className="text-sm mt-2">
            Advice: {p.advice}
          </p>

        </div></Link>
      ))}

    </div>
  )
}