import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSendOtpMutation, useVerifyOtpAndRegisterMutation } from '../../redux/feature/auth/authApi';
import { setCredentials } from '../../redux/feature/auth/authSlice';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, Mail, Lock, ShieldCheck, User, Calendar, Phone, MapPin, Droplet } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    contactNumber: '',
    gender: 'MALE',
    address: '',
    bloodGroup: '',
    email: '',
    password: ''
  });
  
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1); // 1: Info, 2: OTP
  
  const [sendOtp, { isLoading: isSending }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpAndRegisterMutation();
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendOtp({ email: formData.email }).unwrap();
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to send OTP.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await verifyOtp({ ...formData, otp }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      toast.success('Registration successful!');
      navigate('/dashboard/patient');
    } catch (err: any) {
      toast.error(err.data?.message || 'Invalid OTP code.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl p-8 animate-in fade-in zoom-in-95 duration-500 border border-slate-100">
        
        {step === 1 ? (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Create Account</h2>
              <p className="text-slate-500 font-medium mt-2">Sign up for comprehensive health monitoring</p>
            </div>

            <form onSubmit={handleSendOtp} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">First Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300" placeholder="John" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Last Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Date of Birth</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300" placeholder="+8801XXXXXXXXX" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Gender</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select name="gender" value={formData.gender} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all">
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Blood Group</label>
                <div className="relative">
                  <Droplet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all">
                    <option value="">Select</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Full Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300" placeholder="123 Street Name, City" />
                </div>
              </div>
              
              <div className="md:col-span-2 border-t border-slate-100 my-2"></div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} required className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300" placeholder="patient@example.com" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Secure Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required minLength={6} className="w-full pl-11 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all placeholder:font-medium placeholder:text-slate-300" placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="md:col-span-2 pt-4">
                <button type="submit" disabled={isSending} className="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-sky-100 hover:-translate-y-0.5 hover:shadow-sky-200 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
                  {isSending ? <Loader2 size={20} className="animate-spin" /> : "Request Verification OTP"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail size={32} />
              </div>
              <h2 className="text-3xl font-black text-slate-800 tracking-tight">Verify Email</h2>
              <p className="text-slate-500 font-medium mt-2">Enter the 6-digit code sent to <br/><span className="text-slate-700 font-bold">{formData.email}</span></p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Passcode</label>
                <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-black text-center tracking-[1rem] text-slate-700 text-2xl focus:bg-white focus:ring-2 focus:ring-[#0EA5E9] focus:outline-none transition-all" placeholder="------" />
              </div>

              <button type="submit" disabled={isVerifying || otp.length < 6} className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-black text-[15px] shadow-lg shadow-emerald-100 hover:-translate-y-0.5 hover:shadow-emerald-200 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2">
                {isVerifying ? <Loader2 size={20} className="animate-spin" /> : "Complete Verification"}
              </button>
              
              <button type="button" className="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors" onClick={() => setStep(1)}>
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
