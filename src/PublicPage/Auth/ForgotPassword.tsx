import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Loader2, 
  Mail, 
  Lock, 
  KeyRound, 
  ChevronRight, 
  ChevronLeft,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  useSendForgotPasswordOtpMutation, 
  useVerifyForgotPasswordOtpMutation, 
  useResetPasswordMutation 
} from "../../redux/feature/auth/authApi";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [sendOtp, { isLoading: isSending }] = useSendForgotPasswordOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyForgotPasswordOtpMutation();
  const [resetPass, { isLoading: isResetting }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp({ email }).unwrap();
      toast.success('Security code sent to your email.');
      setStep(2);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to send security code.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp({ email, otp }).unwrap();
      toast.success('Identity verified safely.');
      setStep(3);
    } catch (err: any) {
      toast.error(err.data?.message || 'Invalid security code.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      await resetPass({ email, otp, newPassword }).unwrap();
      toast.success('Password updated successfully. Please login.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to update password.');
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <form onSubmit={handleSendOtp} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Enter Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSending}
              className="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-sky-100 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {isSending ? <Loader2 size={20} className="animate-spin" /> : "Dispatch Security Code"}
              {!isSending && <ChevronRight size={18} />}
            </button>
          </form>
        );
      case 2:
        return (
          <form onSubmit={handleVerifyOtp} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">6-Digit Security Code</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-center text-2xl tracking-[10px] text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:text-slate-200"
                  placeholder="000000"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isVerifying}
              className="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-sky-100 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {isVerifying ? <Loader2 size={20} className="animate-spin" /> : "Verify Identity"}
              {!isVerifying && <ShieldCheck size={18} />}
            </button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-400 font-bold text-xs flex items-center justify-center gap-1 hover:text-slate-600 transition-colors">
              <ChevronLeft size={14} /> Back to email
            </button>
          </form>
        );
      case 3:
        return (
          <form onSubmit={handleResetPassword} className="space-y-6 animate-in slide-in-from-right-4 duration-500">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isResetting}
              className="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-sky-100 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              {isResetting ? <Loader2 size={20} className="animate-spin" /> : "Update Credentials"}
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 p-10 animate-in fade-in zoom-in-95 duration-500 border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0EA5E9] to-indigo-500" />
        
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-3xl flex items-center justify-center mx-auto mb-6 relative group transition-transform hover:scale-105">
            <KeyRound size={40} className="relative z-10" />
            <div className="absolute inset-0 bg-[#0EA5E9]/5 blur-xl group-hover:blur-2xl transition-all rounded-full" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Identity Recovery</h2>
          <p className="text-slate-500 font-medium mt-2 text-sm px-4">
            {step === 1 && "Confirm your identity to securely reset your credentials."}
            {step === 2 && "Verification code dispatched. Please input above."}
            {step === 3 && "Verified! Please establish your new security credentials."}
          </p>
        </div>

        {renderStep()}

        <div className="mt-10 pt-8 border-t border-slate-50 text-center">
            <Link to="/login" className="text-slate-400 font-bold text-sm hover:text-[#0EA5E9] transition-colors flex items-center justify-center gap-2">
                <ChevronLeft size={16} /> Remembered? Login here
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
