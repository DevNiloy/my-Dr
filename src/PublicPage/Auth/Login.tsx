import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/feature/auth/authApi';
import { setCredentials } from '../../redux/feature/auth/authSlice';
import { toast } from 'react-toastify';
import { Eye, EyeOff, Loader2, Mail, Lock } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ token: res.token, user: res.user }));
      toast.success('Successfully logged in!');
      
      // Role base routing
      switch (res.user.role) {
        case 'CLINIC_ADMIN':
          navigate('/clinic/overview');
          break;
        case 'DOCTOR':
          navigate('/dashboard/doctor/overview');
          break;
        case 'PATIENT':
          navigate('/dashboard/patient');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-[2rem] shadow-xl p-8 animate-in fade-in zoom-in-95 duration-500 border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0EA5E9]/10 text-[#0EA5E9] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={32} />
          </div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 font-medium mt-2">Enter your securely processed credentials</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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
                placeholder="admin@gmail.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest pl-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
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
            disabled={isLoading}
            className="w-full py-4 bg-[#0EA5E9] text-white rounded-2xl font-black text-[15px] shadow-lg shadow-sky-100 hover:-translate-y-0.5 hover:shadow-sky-200 transition-all active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Secure Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-bold text-slate-500">
          Don't have an account? <Link to="/register" className="text-[#0EA5E9] hover:underline">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
