import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Download, Eye, CalendarDays, UserRound } from "lucide-react";

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
  medicines: Medicine[];
}

export default function PatientPrescription() {
  const [dateFilter, setDateFilter] = useState<string>("");

  const prescriptions: Prescription[] = [
    {
      id: "1",
      patientName: "John Doe",
      diagnosis: "Fever & Viral Infection",
      createdAt: "2026-05-10",
      medicines: [
        {
          name: "Napa Extra",
          dosage: "500mg",
          frequency: "1+1+1",
          duration: "5 Days",
        },
      ],
    },
    {
      id: "2",
      patientName: "John Doe",
      diagnosis: "Gastric Problem",
      createdAt: "2026-05-06",
      medicines: [
        {
          name: "Pantonix",
          dosage: "40mg",
          frequency: "1+0+1",
          duration: "14 Days",
        },
      ],
    },
    {
      id: "3",
      patientName: "John Doe",
      diagnosis: "Cold & Flu",
      createdAt: "2026-05-06",
      medicines: [
        {
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "1 at night",
          duration: "5 Days",
        },
      ],
    },
  ];

  const filtered = useMemo(() => {
    if (!dateFilter) return prescriptions;
    return prescriptions.filter((p) => p.createdAt === dateFilter);
  }, [dateFilter]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Prescriptions</h1>

          <p className="text-sm text-gray-500 mt-1">
            Filter by date and view prescriptions
          </p>
        </div>

        {/* FILTER */}
        <div className="flex items-center gap-3">
          <CalendarDays className="text-gray-500" />

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 rounded-2xl px-4 py-2 text-sm"
          />

          {dateFilter && (
            <button
              onClick={() => setDateFilter("")}
              className="text-sm text-red-500"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* LIST */}
      <div className="grid gap-5">
        {filtered.map((rx) => (
          <div
            key={rx.id}
            className="bg-white border rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            {/* TOP */}
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                  <FileText className="text-blue-600" />
                </div>

                <div>
                  <h2 className="font-bold text-lg">Prescription Rx</h2>

                  <div className="flex gap-3 text-sm text-gray-500 mt-1">
                    <span className="flex items-center gap-1">
                      <UserRound size={14} />
                      {rx.patientName}
                    </span>

                    <span className="flex items-center gap-1">
                      <CalendarDays size={14} />
                      {rx.createdAt}
                    </span>
                  </div>
                </div>
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                Active
              </span>
            </div>

            {/* DIAGNOSIS */}
            <div className="mt-4 bg-gray-50 p-3 rounded-2xl">
              <p className="text-sm text-gray-500">Diagnosis</p>
              <p className="font-semibold">{rx.diagnosis}</p>
            </div>

            {/* ACTIONS */}
            <div className="mt-5 flex gap-3">
              <Link
                to={`/dashboard/patient/prescription/${rx.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2"
              >
                <Eye size={16} />
                View
              </Link>

              <button className="bg-gray-900 text-white px-4 py-2 rounded-2xl flex items-center gap-2">
                <Download size={16} />
                Download
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-10">
            No prescriptions found for selected date
          </div>
        )}
      </div>
    </div>
  );
}
