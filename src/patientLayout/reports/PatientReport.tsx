import { useRef, useState } from "react";
import { FileText, Upload, ExternalLink, ImageIcon, Eye } from "lucide-react";

interface Report {
  id: string;
  title: string;
  type: string;
  date: string;
  fileUrl: string;
}

export default function PatientReport() {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      title: "Blood Test Report",
      type: "PDF",
      date: "10 May 2026",
      fileUrl:
        "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
    {
      id: "2",
      title: "X-Ray Chest",
      type: "Image",
      date: "05 May 2026",
      fileUrl:
        "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=1200",
    },
  ]);

  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setUploading(true);

    const newReport: Report = {
      id: Date.now().toString(),
      title: file.name,
      type: file.type.includes("pdf") ? "PDF" : "Image",
      date: new Date().toLocaleDateString(),
      fileUrl: URL.createObjectURL(file),
    };

    setTimeout(() => {
      setReports((prev) => [newReport, ...prev]);
      setUploading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">My Reports</h1>

          <p className="text-sm text-gray-500 mt-1">
            Upload and manage your medical reports
          </p>
        </div>

        {/* UPLOAD */}
        <div>
          <input
            type="file"
            hidden
            ref={fileRef}
            accept=".pdf,image/*"
            onChange={handleUpload}
          />

          <button
            onClick={() => fileRef.current?.click()}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 transition-all font-medium"
          >
            <Upload size={18} />
            Upload Report
          </button>
        </div>
      </div>

      {/* LOADING */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-2xl p-4">
          Uploading report...
        </div>
      )}

      {/* REPORT LIST */}
      <div className="grid gap-5">
        {reports.map((report) => (
          <div
            key={report.id}
            className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              {/* LEFT */}
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                  {report.type === "PDF" ? (
                    <FileText size={28} className="text-red-500" />
                  ) : (
                    <ImageIcon size={28} className="text-blue-600" />
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-800">
                    {report.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Uploaded on {report.date}
                  </p>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex flex-wrap items-center gap-3">
                {/* TYPE */}
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    report.type === "PDF"
                      ? "bg-red-100 text-red-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {report.type}
                </span>

                {/* VIEW */}
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-2xl flex items-center gap-2 transition-all"
                >
                  <Eye size={18} />
                  View
                </a>

                {/* OPEN */}
                <a
                  href={report.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-2xl flex items-center gap-2 transition-all"
                >
                  <ExternalLink size={18} />
                  Open
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
