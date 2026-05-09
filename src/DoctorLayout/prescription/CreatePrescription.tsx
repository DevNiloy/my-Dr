import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch } from '../../redux/hooks'
import { addPrescription } from '../../redux/feature/patient/prescriptionSlice'
 

export default function CreatePrescription() {
  const { patientid } = useParams()
  const dispatch = useAppDispatch()

  const [diagnosis, setDiagnosis] = useState('')
  const [advice, setAdvice] = useState('')

  const [medicines, setMedicines] = useState([
    { name: '', dosage: '', frequency: '', duration: '' }
  ])

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const updated = [...medicines]
    updated[index][field as keyof typeof updated[0]] = value
    setMedicines(updated)
  }

  const addMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '' }])
  }

  const handleSubmit = () => {
    const prescription = {
      id: Date.now().toString(),
      patientId: patientid!,
      patientName: 'Selected Patient',
      age: 0,
      gender: '',
      diagnosis,
      medicines,
      advice,
      createdAt: new Date().toISOString()
    }

    dispatch(addPrescription(prescription))
    alert('Prescription saved')
  }

  return (
    <div className="p-4 lg:p-6 space-y-6">

      <h1 className="text-2xl font-bold">Create Prescription (Rx)</h1>

      {/* Diagnosis */}
      <input
        className="border p-2 w-full rounded-xl"
        placeholder="Diagnosis"
        value={diagnosis}
        onChange={e => setDiagnosis(e.target.value)}
      />

      {/* Medicines */}
      <div className="space-y-3">
        {medicines.map((med, i) => (
          <div key={i} className="grid md:grid-cols-4 gap-2">
            <input
              placeholder="Medicine"
              className="border p-2 rounded-xl"
              value={med.name}
              onChange={e => handleMedicineChange(i, 'name', e.target.value)}
            />
            <input
              placeholder="Dosage"
              className="border p-2 rounded-xl"
              value={med.dosage}
              onChange={e => handleMedicineChange(i, 'dosage', e.target.value)}
            />
            <input
              placeholder="Frequency"
              className="border p-2 rounded-xl"
              value={med.frequency}
              onChange={e => handleMedicineChange(i, 'frequency', e.target.value)}
            />
            <input
              placeholder="Duration"
              className="border p-2 rounded-xl"
              value={med.duration}
              onChange={e => handleMedicineChange(i, 'duration', e.target.value)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={addMedicine}
        className="bg-gray-800 text-white px-4 py-2 rounded-xl"
      >
        + Add Medicine
      </button>

      {/* Advice */}
      <textarea
        className="border p-2 w-full rounded-xl"
        placeholder="Advice to patient"
        value={advice}
        onChange={e => setAdvice(e.target.value)}
      />

      {/* Save */}
      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-6 py-2 rounded-xl"
      >
        Save Prescription
      </button>

    </div>
  )
}