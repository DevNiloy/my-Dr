import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../redux/feature/auth/authApi';
import { setCredentials } from '../../redux/feature/auth/authSlice';
import { toast } from 'react-toastify';
import { User, Lock } from 'lucide-react'; // Swapped Mail for User to match screenshot icon

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Retained state logic
  
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
    <div className="relative min-h-screen bg-gradient-to-tr from-[#314cd4] via-[#743eb8] to-[#ab3aac] flex flex-col items-center justify-center p-4 font-sans selection:bg-pink-300">
      
      {/* Language Selector Top Right */}
      <div className="absolute top-6 right-6 flex items-center bg-white/20 backdrop-blur-md rounded-full px-2 py-1.5 border border-white/30 shadow-md">
        <div className="flex space-x-1.5 items-center">
          {/* Polish Flag Circle */}
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/40 flex flex-col">
            <div className="bg-white h-1/2 w-full"></div>
            <div className="bg-[#DC143C] h-1/2 w-full"></div>
          </div>
          {/* UK Flag Circle */}
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
          {/* Ukraine Flag Circle */}
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/40 flex flex-col">
            <div className="bg-[#0057B7] h-1/2 w-full"></div>
            <div className="bg-[#FFD700] h-1/2 w-full"></div>
          </div>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="w-full max-w-[420px] flex flex-col items-center">
        
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 select-none">
          <div className="relative w-16 h-16 flex items-center justify-center border-2 border-white rounded-full">
            {/* Stethoscope Silhouette representation */}
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

        {/* Input Form Fields */}
        <form onSubmit={handleLogin} className="w-full space-y-4">
          
          {/* Login / Email Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
              <User size={16} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="w-full pl-14 pr-12 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]"
              placeholder="Login or e-mail"
            />
            {/* End Envelope Badge */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-600 bg-teal-50 p-1 rounded-sm border border-teal-200 text-[10px] font-bold scale-90">
              ✉
            </div>
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-gray-200/80 p-1.5 rounded-full text-gray-500">
              <Lock size={16} />
            </div>
            <input 
              type={showPassword ? "text" : "password"} // Functional logic preserved
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="w-full pl-14 pr-4 py-3 bg-white text-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300 placeholder-gray-400 font-medium shadow-inner text-[15px]"
              placeholder="Password"
            />
            {/* Optional invisible button area to allow toggling standard usability */}
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 w-5 h-5 cursor-default"
              tabIndex={-1}
            />
          </div>

          {/* Recover Password link */}
          <div className="text-center pt-1 pb-4">
            <span className="text-white/80 text-xs">Forgot password? </span>
            <Link to="/forgot-password" className="text-white text-xs underline font-medium hover:text-white/95">
              Recover password
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            {/* LOG IN Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-3.5 bg-[#3B82F6] hover:bg-blue-600 active:bg-blue-700 text-white font-semibold text-sm tracking-wider uppercase rounded-full shadow-lg transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? "Processing..." : "LOG IN"}
            </button>

            {/* REGISTER Link modeled as button */}
            <Link 
              to="/register" 
              className="w-full py-3.5 bg-[#EC4899] hover:bg-pink-600 active:bg-pink-700 text-white font-semibold text-sm tracking-wider uppercase rounded-full shadow-lg transition-colors block text-center"
            >
              REGISTER
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;