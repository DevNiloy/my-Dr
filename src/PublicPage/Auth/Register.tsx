import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSendOtpMutation, useVerifyOtpAndRegisterMutation } from '../../redux/feature/auth/authApi';
import { setCredentials } from '../../redux/feature/auth/authSlice';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, Mail, Lock, User, Calendar, Phone, MapPin, Droplet } from 'lucide-react';

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
    <div className="relative min-h-screen bg-gradient-to-tr from-[#314cd4] via-[#743eb8] to-[#ab3aac] flex flex-col items-center justify-center p-4 py-12 font-sans selection:bg-pink-300">
      
      {/* Language Selector Top Right */}
      <div className="absolute top-6 right-6 flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/30 shadow-md z-10">
        <div className="flex space-x-1.5 items-center">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/40 flex flex-col">
            <div className="bg-white h-1/2 w-full"></div>
            <div className="bg-[#DC143C] h-1/2 w-full"></div>
          </div>
          <div className="w-7 h-7 rounded-full overflow-hidden border-2 border-white flex items-center justify-center bg-[#00247D] relative">
            <div className="absolute w-full h-1 bg-white rotate-45"></div>
            <div className="absolute w-full h-1 bg-white -rotate-45"></div>
            <div className="absolute w-full h-1 bg-[#CF142B] rotate-45 scale-y-75"></div>
            <div className="absolute w-full h-1 bg-[#CF142B] -rotate-45 scale-y-75"></div>
            <div className="absolute w-full h-1.5 bg-white top-1/2 -translate-y-1/2"></div>
            <div className="absolute w-1.5 h-full bg-white left-1/2 -translate-x-1/2"></div>
            <div className="absolute w-full h-0.5 bg-[#CF142B] top-1/2 -translate-y-1/2"></div>
            <div className="absolute w-0.5 h-full bg-[#CF142B] left-1/2 -translate-x-1/2"></div>
          </div>
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/40 flex flex-col">
            <div className="bg-[#0057B7] h-1/2 w-full"></div>
            <div className="bg-[#FFD700] h-1/2 w-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="w-full max-w-2xl flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="relative w-16 h-16 flex items-center justify-center border-2 border-white rounded-full">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.75">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0c0-1.2-.26-2.35-.73-3.4M8.25 10.5a3.75 3.75 0 1 1 7.5 0v3.75a3.75 3.75 0 1 1-7.5 0V10.5Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75v-3.75" />
              <circle cx="12" cy="10.5" r="1.5" fill="currentColor"/>
            </svg>
            <span className="absolute bottom-1 right-2 text-[8px] font-bold bg-white text-[#743eb8] rounded-full w-3 h-3 flex items-center justify-center">®</span>
          </div>
          <h1 className="text-white text-4xl font-normal tracking-wide italic mt-2 font-serif">
            My<span className="font-bold not-italic ml-0.5">Dr</span>
          </h1>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* First Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <User size={16} />
              </div>
              <input 
                type="text" 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]" 
                placeholder="First Name" 
              />
            </div>

            {/* Last Name */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <User size={16} />
              </div>
              <input 
                type="text" 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]" 
                placeholder="Last Name" 
              />
            </div>

            {/* Date of Birth */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <Calendar size={16} />
              </div>
              <input 
                type="date" 
                name="dateOfBirth" 
                value={formData.dateOfBirth} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 font-medium shadow-inner text-[15px]" 
              />
            </div>

            {/* Contact Number */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <Phone size={16} />
              </div>
              <input 
                type="tel" 
                name="contactNumber" 
                value={formData.contactNumber} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]" 
                placeholder="Contact Number" 
              />
            </div>

            {/* Gender */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <User size={16} />
              </div>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 font-medium shadow-inner text-[15px] appearance-none"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            {/* Blood Group */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <Droplet size={16} />
              </div>
              <select 
                name="bloodGroup" 
                value={formData.bloodGroup} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 font-medium shadow-inner text-[15px] appearance-none"
              >
                <option value="">Blood Group</option>
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

            {/* Full Address */}
            <div className="relative md:col-span-2">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <MapPin size={16} />
              </div>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]" 
                placeholder="Full Address" 
              />
            </div>

            {/* Email Address */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <Mail size={16} />
              </div>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
                className="w-full pl-14 pr-12 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]" 
                placeholder="Login or e-mail" 
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600 bg-teal-50 p-1 rounded-sm border border-teal-200 text-[10px] font-bold scale-90">
                ✉
              </div>
            </div>

            {/* Secure Password */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
                <Lock size={16} />
              </div>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                value={formData.password} 
                onChange={handleInputChange} 
                required 
                minLength={6} 
                className="w-full pl-14 pr-12 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]" 
                placeholder="Password" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Submit Button Step 1 */}
            <div className="md:col-span-2 pt-4">
              <button 
                type="submit" 
                disabled={isSending} 
                className="w-full py-3.5 bg-[#3B82F6] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm tracking-wider uppercase rounded-full shadow-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isSending ? <Loader2 size={18} className="animate-spin" /> : "Request Verification OTP"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="w-full max-w-[420px] space-y-6">
            <div className="text-center mb-2">
              <p className="text-white/90 text-sm font-medium">
                Enter the 6-digit code sent to <br />
                <span className="text-white font-bold underline">{formData.email}</span>
              </p>
            </div>

            {/* OTP Verification Input */}
            <div className="relative">
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                maxLength={6} 
                className="w-full px-4 py-3 bg-white text-gray-700 rounded-full font-black text-center tracking-[0.75rem] text-2xl focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-inner" 
                placeholder="------" 
              />
            </div>

            {/* Actions for Step 2 */}
            <div className="space-y-3">
              <button 
                type="submit" 
                disabled={isVerifying || otp.length < 6} 
                className="w-full py-3.5 bg-[#EC4899] hover:bg-pink-600 active:bg-pink-700 text-white font-semibold text-sm tracking-wider uppercase rounded-full shadow-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {isVerifying ? <Loader2 size={18} className="animate-spin" /> : "Complete Verification"}
              </button>
              
              <button 
                type="button" 
                className="w-full py-2 text-xs font-medium text-white/80 hover:text-white underline transition-colors" 
                onClick={() => setStep(1)}
              >
                Back to Registration
              </button>
            </div>
          </form>
        )}

        {/* Dynamic Footer Route Swap */}
        <div className="mt-8 text-center text-sm text-white/80">
          Already have an account?{' '}
          <Link to="/login" className="text-white underline font-medium hover:text-white/95">
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;