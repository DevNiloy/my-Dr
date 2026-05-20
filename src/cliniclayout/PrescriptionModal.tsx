import React, { useState } from "react";
import { 
  X, Plus, Trash2, FileText, Pill, 
  Stethoscope, Calendar, Save, Loader2,
  ShieldCheck
} from "lucide-react";
import { useCreatePrescriptionMutation } from "../redux/api/prescriptionApi";
import { toast } from "react-toastify";
import dayjs from "dayjs";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: (showPreview?: boolean) => void;
  appointmentData: {
    _id: string;
    patientId: string;
    doctorId: string;
    patientName: string;
    doctorName: string;
  };
}

const PrescriptionModal: React.FC<PrescriptionModalProps> = ({ 
  isOpen, 
  onClose, 
  appointmentData 
}) => {
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [nextVisitDate, setNextVisitDate] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", duration: "" }
  ]);
  const [showSuccess, setShowSuccess] = useState(false);
  const title = "Diagnosis & Prescription";

  const [createPrescription, { isLoading }] = useCreatePrescriptionMutation();

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
  };

  const handleRemoveMedicine = (index: number) => {
    if (medicines.length > 1) {
      setMedicines(medicines.filter((_, i) => i !== index));
    }
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const updatedMedicines = [...medicines];
    (updatedMedicines[index] as any)[field] = value;
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!diagnosis) {
      toast.error("Please enter a diagnosis");
      return;
    }
    
    const hasEmptyMedicine = medicines.some(m => !m.name || !m.dosage || !m.frequency || !m.duration);
    if (hasEmptyMedicine) {
      toast.error("Please fill all medicine details or remove empty ones.");
      return;
    }

    try {
      const isDirectIssue = appointmentData._id === "DIRECT_ISSUE" || !appointmentData._id;
      
      await createPrescription({
        appointment: isDirectIssue ? undefined : appointmentData._id,
        patient: appointmentData.patientId,
        doctor: appointmentData.doctorId,
        title,
        diagnosis,
        medicines,
        advice,
        nextVisitDate: nextVisitDate || undefined
      }).unwrap();
      
      toast.success("Prescription created successfully!");
      setShowSuccess(true);
    } catch (err: any) {
      toast.error(err.data?.message || "Failed to create prescription");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Generate Prescription (Rx)</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                For: <span className="text-blue-600">{appointmentData.patientName}</span> • Dr. {appointmentData.doctorName}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onClose()}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {showSuccess ? (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-8 animate-in zoom-in-95 duration-500">
            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-100 mb-4 scale-110">
              <ShieldCheck size={48} strokeWidth={2.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Prescription Issued!</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto">
                Successfully recorded for <span className="text-blue-600 font-bold">{appointmentData.patientName}</span>. 
                The patient has been notified and can view it in their dashboard.
              </p>
            </div>
            
            <div className="flex items-center gap-4 pt-4">
              <button 
                onClick={() => onClose()}
                className="px-10 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all font-bold"
              >
                Return to Dashboard
              </button>
              <button 
                onClick={() => onClose(true)}
                className="px-12 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-sm hover:bg-emerald-700 transition-all shadow-2xl shadow-emerald-100 flex items-center gap-3 animate-bounce"
              >
                <FileText size={20} />
                Preview Record
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              
              {/* Diagnosis Section */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                  <Stethoscope size={16} className="text-blue-500" />
                  1. Primary Diagnosis
                </h3>
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Diagnosis / Detailed Note</label>
                   <textarea 
                      required
                      placeholder="e.g. Acute Viral Fever..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none min-h-[100px] resize-none"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                   />
                </div>
              </div>

              {/* Medicines Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                    <Pill size={16} className="text-blue-500" />
                    2. Medicines & Dosage
                  </h3>
                  <button 
                    type="button"
                    onClick={handleAddMedicine}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black hover:bg-emerald-100 transition-all"
                  >
                    <Plus size={14} /> Add Drug
                  </button>
                </div>

                <div className="space-y-4">
                  {medicines.map((med, index) => (
                    <div key={index} className="group relative bg-slate-50 border border-slate-100 rounded-3xl p-6 transition-all hover:bg-white hover:border-blue-200 hover:shadow-lg hover:shadow-blue-50/50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-1 space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Drug Name</label>
                           <input 
                              type="text" 
                              placeholder="e.g. Paracetamol 500mg"
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                              value={med.name}
                              onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Dosage</label>
                           <input 
                              type="text" 
                              placeholder="e.g. 1 Tablet"
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                              value={med.dosage}
                              onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Frequency</label>
                           <input 
                              type="text" 
                              placeholder="e.g. 1-0-1 (After Meal)"
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                              value={med.frequency}
                              onChange={(e) => handleMedicineChange(index, "frequency", e.target.value)}
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Duration</label>
                           <input 
                              type="text" 
                              placeholder="e.g. 5 Days"
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:border-blue-500 outline-none"
                              value={med.duration}
                              onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                           />
                        </div>
                      </div>
                      
                      {medicines.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => handleRemoveMedicine(index)}
                          className="absolute -top-3 -right-3 w-8 h-8 bg-white border border-rose-100 text-rose-500 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Advice Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                      <Stethoscope size={16} className="text-blue-500" />
                      3. Advice / Instructions
                   </h3>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Patient Advice</label>
                      <textarea 
                         placeholder="e.g. Drink plenty of water..."
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none min-h-[120px] resize-none"
                         value={advice}
                         onChange={(e) => setAdvice(e.target.value)}
                      />
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="flex items-center gap-2 text-sm font-black text-slate-800 uppercase tracking-widest">
                      <Calendar size={16} className="text-blue-500" />
                      4. Follow-up Details
                   </h3>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Next Visit Date (Optional)</label>
                      <input 
                         type="date"
                         min={dayjs().format("YYYY-MM-DD")}
                         className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm focus:border-blue-500 focus:bg-white transition-all outline-none"
                         value={nextVisitDate}
                         onChange={(e) => setNextVisitDate(e.target.value)}
                      />
                   </div>
                   <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest flex items-center gap-2">
                        <FileText size={12} /> Pro Tip
                      </p>
                      <p className="text-xs text-blue-500 mt-1 font-medium leading-relaxed">
                        Patients will receive an instant notification and a downloadable PDF once you save this prescription.
                      </p>
                   </div>
                </div>
              </div>
            </form>

            {/* Footer */}
            <div className="p-8 border-t border-slate-100 flex justify-end bg-slate-50/50">
              <div className="flex items-center gap-4">
                 <button 
                    type="button"
                    onClick={() => onClose()}
                    className="px-8 py-3.5 text-slate-500 font-black text-sm hover:text-slate-800 transition-colors"
                    disabled={isLoading}
                 >
                    Discard
                 </button>
                 <button 
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-10 py-3.5 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all flex items-center gap-3 shadow-xl shadow-blue-100 disabled:opacity-50"
                 >
                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isLoading ? "Saving..." : "Issue Prescription"}
                 </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 10px; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default PrescriptionModal;
