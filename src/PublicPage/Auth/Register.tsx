import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSendOtpMutation, useVerifyOtpAndRegisterMutation } from '../../redux/feature/auth/authApi';
import { setCredentials } from '../../redux/feature/auth/authSlice';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck } from 'lucide-react';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: Email/Pass, 2: OTP
  
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpAndRegisterMutation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp({ email }).unwrap();
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ email, password, otp }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      toast.success('Registration successful!');
      navigate('/dashboard/patient'); // Default self-registration role is PATIENT
    } catch (err: any) {
      toast.error(err.data?.message || 'Invalid OTP code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 animate-in fade-in zoom-in-95 duration-500 border border-slate-100">
        
        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h2>
              <p className="text-slate-500 font-medium mt-2">Sign up for comprehensive health monitoring</p>
            </div>

            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                    placeholder="patient@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300"
                    placeholder="••••••••"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSending}
                className="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-sky-100 hover:-translate-y-0.5 hover:shadow-sky-200 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isSending ? <Loader2 size={20} className="animate-spin" /> : "Request Verification OTP"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Verify Email</h2>
              <p className="text-slate-500 font-medium mt-2">Enter the 6-digit code sent to <br/><span className="text-slate-700 font-bold">{email}</span></p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Passcode</label>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  maxLength={6}
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-center tracking-[1rem] text-slate-700 text-2xl focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all"
                  placeholder="------"
                />
              </div>

              <button 
                type="submit" 
                disabled={isVerifying || otp.length < 6}
                className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-[15px] shadow-lg shadow-emerald-100 hover:-translate-y-0.5 hover:shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
              >
                {isVerifying ? <Loader2 size={20} className="animate-spin" /> : "Complete Verification"}
              </button>
              
              <button 
                type="button"
                className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setStep(1)}
              >
                Back to Registration
              </button>
            </form>
          </>
        )}

        <div className="mt-8 text-center text-sm font-bold text-slate-500">
          Already have an account? <Link to="/login" className="text-[#0EA5E9] hover:underline">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
