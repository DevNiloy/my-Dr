import React, { useState, useRef } from "react";
import { FileText, Upload, ImageIcon, Eye, Trash2, Edit, Loader2, X, File as FileIcon, Share2 } from "lucide-react";
import { toast } from "react-toastify";
import { 
  useGetReportsQuery, 
  useCreateReportMutation, 
  useUpdateReportMutation, 
  useDeleteReportMutation 
} from "../../redux/api/reportApi";
import dayjs from "dayjs";
import Swal from "sweetalert2";

export default function PatientReport() {
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, refetch } = useGetReportsQuery({ page, limit });
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();
  const [updateReport, { isLoading: isUpdating }] = useUpdateReportMutation();
  const [deleteReport, { isLoading: isDeleting }] = useDeleteReportMutation();

  const reports = data?.data || [];
  const totalPages = data?.pages || 1;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState<string | null>(null); // report ID
  
  // Form State
  const [testName, setTestName] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setTestName("");
    setSummary("");
    setSelectedFile(null);
    setEditMode(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleOpenModal = (report?: any) => {
    resetForm();
    if (report) {
      setEditMode(report._id);
      setTestName(report.testName);
      setSummary(report.summary || "");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!testName.trim()) {
      toast.error("Test Name is required");
      return;
    }

    if (!editMode && !selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("testName", testName);
    formData.append("summary", summary);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      if (editMode) {
        await updateReport({ id: editMode, formData }).unwrap();
        toast.success("Report updated successfully");
      } else {
        await createReport(formData).unwrap();
        toast.success("Report uploaded successfully");
        setPage(1); // Jump to first page
      }
      handleCloseModal();
      refetch();
    } catch (err: any) {
      toast.error(err.data?.message || "Something went wrong");
    }
  };



const handleDelete = async (id: string) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this report deletion!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#6b7280",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    setDeletingId(id);

    await deleteReport(id).unwrap();

    await Swal.fire({
      title: "Deleted!",
      text: "Report has been deleted successfully.",
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
    });

    refetch();

    // Adjust page if empty
    if (reports.length === 1 && page > 1) {
      setPage(page - 1);
    }
  } catch (err: any) {
    Swal.fire({
      title: "Error!",
      text: err.data?.message || "Failed to delete",
      icon: "error",
    });
  } finally {
    setDeletingId(null);
  }
};

  const isImage = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/i) != null;
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">My Reports</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Upload and securely manage your medical reports
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0EA5E9] hover:bg-sky-600 text-white px-6 py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all font-black shadow-lg shadow-sky-100 hover:-translate-y-0.5 active:scale-95"
        >
          <Upload size={18} />
          Upload Report
        </button>
      </div>

      {/* REPORT LIST */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-blue-500" size={40} />
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center shadow-sm">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#0EA5E9]">
            <FileIcon size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No reports found</h3>
          <p className="text-slate-500 mt-2">You haven't uploaded any medical reports yet.</p>
        </div>
      ) : (
        <div className="grid gap-5">
          {reports.map((report: any) => {
             const isImg = isImage(report.fileUrl);
             return (
              <div
                key={report._id}
                className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  {/* LEFT INFO */}
                  <div className="flex items-start gap-5">
                    <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                      {isImg ? (
                        <ImageIcon size={28} className="text-[#0EA5E9]" />
                      ) : (
                        <FileText size={28} className="text-rose-500" />
                      )}
                    </div>

                    <div>
                      <h2 className="text-lg font-black text-slate-800">
                        {report.testName}
                      </h2>
                      <p className="text-sm font-bold text-slate-500 mt-1">
                        Uploaded on {dayjs(report.createdAt).format('DD MMM YYYY, hh:mm A')}
                      </p>
                      {report.summary && (
                         <p className="text-sm font-medium text-slate-400 mt-2 line-clamp-2 pr-4">
                            {report.summary}
                         </p>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0">
                    <span
                      className={`px-4 py-2 rounded-xl text-xs font-black tracking-widest uppercase ${
                        isImg
                          ? "bg-sky-50 text-[#0EA5E9]"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {isImg ? "Image" : "Document"}
                    </span>

                    <button
                      onClick={() => handleOpenModal(report)}
                      className="bg-slate-50 hover:bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => handleDelete(report._id)}
                      disabled={deletingId === report._id || isDeleting}
                      className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm disabled:opacity-50"
                    >
                      {deletingId === report._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                    </button>

                    <button
                      onClick={() => {
                        const shareUrl = `${window.location.origin}/report/${report._id}`;
                        navigator.clipboard.writeText(shareUrl);
                        toast.success("Link copied!");
                      }}
                      className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm"
                      title="Share Report"
                    >
                      <Share2 size={16} />
                    </button>

                    <a
                      href={report.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0EA5E9] hover:bg-sky-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all font-bold text-sm"
                    >
                      <Eye size={16} />
                      View
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-6">
           <button 
             onClick={() => setPage(page - 1)} 
             disabled={page === 1}
             className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
           >
             Prev
           </button>
           <span className="font-bold text-slate-500">
             Page <span className="text-slate-800">{page}</span> of {totalPages}
           </span>
           <button 
             onClick={() => setPage(page + 1)} 
             disabled={page === totalPages}
             className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-all shadow-sm"
           >
             Next
           </button>
        </div>
      )}

      {/* UPLOAD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
            
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
               <h3 className="text-2xl font-black text-slate-800">
                  {editMode ? "Edit Report" : "Upload Report"}
               </h3>
               <button onClick={handleCloseModal} className="w-10 h-10 bg-slate-50 text-slate-500 rounded-full flex items-center justify-center hover:bg-slate-100 hover:text-slate-800 transition-colors">
                  <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Report / Test Name</label>
                 <input 
                   type="text" 
                   value={testName}
                   onChange={(e) => setTestName(e.target.value)}
                   required
                   className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all"
                   placeholder="e.g. Blood Test, X-Ray"
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Summary / Doctor's Note (Optional)</label>
                 <textarea 
                   value={summary}
                   onChange={(e) => setSummary(e.target.value)}
                   rows={3}
                   className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all resize-none"
                   placeholder="Any specific note about this test..."
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Select File</label>
                 <div className="relative relative border-2 border-dashed border-slate-200 rounded-3xl p-6 text-center hover:border-[#0EA5E9] transition-colors bg-slate-50 group">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      accept=".pdf,image/*"
                    />
                    <div className="pointer-events-none">
                       <Upload className="mx-auto text-slate-400 group-hover:text-[#0EA5E9] transition-colors mb-3" size={32} />
                       {selectedFile ? (
                          <span className="font-bold text-[#0EA5E9] block">{selectedFile.name}</span>
                       ) : (
                          <>
                            <span className="font-bold text-slate-600 block">Click or Drag to upload</span>
                            <span className="text-sm font-medium text-slate-400 block mt-1">PDF or Image (Max 10MB)</span>
                            {editMode && <span className="text-xs text-amber-500 block mt-2 font-bold bg-amber-50 rounded-lg p-2 inline-block">Leave empty to keep existing file</span>}
                          </>
                       )}
                    </div>
                 </div>
               </div>

               <div className="pt-4">
                 <button 
                   type="submit" 
                   disabled={isCreating || isUpdating}
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[15px] shadow-xl hover:-translate-y-0.5 hover:shadow-2xl transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
                 >
                   {isCreating || isUpdating ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                   {editMode ? "Save Changes" : "Upload to Vault"}
                 </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
