import { useParams } from "react-router-dom";
import { useMemo } from "react";
import {
  FileText,
  CalendarDays,
  UserRound,
  Download,
  ArrowLeft,
  Stethoscope,
  GraduationCap,
  Hospital,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Medicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: string;
  patientName: string;
  diagnosis: string;
  createdAt: string;
  doctorName: string;
  doctorEducation: string;
  hospital: string;
  medicines: Medicine[];
}

export default function PatientPrescriptionDetails() {
  const { id } = useParams();

  const prescriptions: Prescription[] = [
    {
      id: "1",
      patientName: "John Doe",
      diagnosis: "Fever & Viral Infection",
      createdAt: "2026-05-10",
      doctorName: "Dr. Sarah Ahmed",
      doctorEducation: "MBBS, FCPS (Medicine)",
      hospital: "City Medical Hospital",
      medicines: [
        {
          name: "Napa Extra",
          dosage: "500mg",
          frequency: "1+1+1",
          duration: "5 Days",
        },
        {
          name: "Seclo",
          dosage: "20mg",
          frequency: "1+0+1",
          duration: "7 Days",
        },
      ],
    },
  ];

  const prescription = useMemo(() => {
    return prescriptions.find((p) => p.id === id);
  }, [id]);

  if (!prescription) {
    return <div className="p-6 text-red-500">Prescription not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/patient/prescription"
            className="p-2 bg-gray-100 rounded-xl"
          >
            <ArrowLeft size={18} />
          </Link>

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Prescription Details
            </h1>
            <p className="text-sm text-gray-500">
              Full medical prescription information
            </p>
          </div>
        </div>

        {/* DOWNLOAD */}
        <button className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2">
          <Download size={18} />
          Download PDF
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white border rounded-3xl p-6 shadow-sm relative">
        {/* DOCTOR INFO (TOP RIGHT) */}
        <div className="absolute top-6 right-6 text-right bg-gray-50 border rounded-2xl p-4 w-64">
          <div className="flex items-center justify-end gap-2 text-gray-700 font-semibold">
            <Stethoscope size={16} />
            {prescription.doctorName}
          </div>

          <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mt-1">
            <GraduationCap size={14} />
            {prescription.doctorEducation}
          </div>

          <div className="flex items-center justify-end gap-2 text-sm text-gray-500 mt-1">
            <Hospital size={14} />
            {prescription.hospital}
          </div>
        </div>

        {/* PATIENT + DATE */}
        <div className="border-b pb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-blue-600" />
            Prescription Rx
          </h2>

          <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
            <span className="flex items-center gap-1">
              <UserRound size={14} />
              {prescription.patientName}
            </span>

            <span className="flex items-center gap-1">
              <CalendarDays size={14} />
              {prescription.createdAt}
            </span>
          </div>
        </div>

        {/* DIAGNOSIS */}
        <div className="mt-5 bg-gray-50 rounded-2xl p-4">
          <p className="text-sm text-gray-500">Diagnosis</p>

          <p className="font-semibold text-gray-800 mt-1">
            {prescription.diagnosis}
          </p>
        </div>

        {/* MEDICINES */}
        <div className="mt-6">
          <h3 className="font-bold mb-3">Medicines</h3>

          <div className="grid gap-3">
            {prescription.medicines.map((med, i) => (
              <div
                key={i}
                className="border rounded-2xl p-4 flex justify-between"
              >
                <div>
                  <h4 className="font-semibold">{med.name}</h4>
                  <p className="text-sm text-gray-500">
                    {med.dosage} • {med.frequency}
                  </p>
                </div>

                <div className="text-sm text-gray-500">{med.duration}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
