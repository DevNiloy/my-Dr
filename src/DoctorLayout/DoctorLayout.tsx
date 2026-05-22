import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useGetDoctorMeQuery } from '../redux/api/doctorApi';
import NotificationDropdown from '../components/NotificationDropdown';

export default function DoctorLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();
  const { data: doctorData } = useGetDoctorMeQuery({});
  const doctor = doctorData?.data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { title: 'Overview', path: '/dashboard/doctor/overview', icon: '📊' },
    { title: 'Availability', path: '/dashboard/doctor/availability', icon: '📅' },
    { title: 'Appointments', path: '/dashboard/doctor/appointments', icon: '🩺' },
    { title: 'Patients', path: '/dashboard/doctor/patients', icon: '👥' },
    { title: 'Earnings', path: '/dashboard/doctor/earning', icon: '💰' },
    { title: 'Profile', path: '/dashboard/doctor/profile', icon: '👨‍⚕️' }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Overlay */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:relative top-0 left-0 z-[70] h-full w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          openSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-8 border-b border-slate-100">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center text-white">
                <span className="font-black text-xl">D</span>
             </div>
             <div>
                <h1 className="text-lg font-black text-slate-800 leading-none">DoctorPanel</h1>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">PYTOMART.PL</p>
             </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </nav>

        {/* Bottom User Area */}
        <div className="p-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
             <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                {doctor?.profilePic ? (
                  <img src={doctor.profilePic} alt="doctor" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-slate-300" />
                )}
             </div>
             <div className="overflow-hidden">
               <h2 className="font-bold text-sm text-slate-800 truncate">Dr. {doctor?.firstName}</h2>
               <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5">{doctor?.user?.role}</p>
             </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all text-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout Account</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar - Fixed */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpenSidebar(true)}
              className="lg:hidden w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Dashboard</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Welcome back, Dr. {doctor?.lastName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            
            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Logged as</p>
                    <p className="text-xs font-bold text-slate-700 mt-1 italic">{doctor?.user?.email}</p>
                </div>
            </div>
            
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                {doctor?.profilePic ? (
                  <img src={doctor.profilePic} alt="doctor" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-slate-300" />
                )}
            </div>
          </div>
        </header>

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ item }: any) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 font-bold text-sm ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
            : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
        }`
      }
    >
      <span className="text-xl">{item.icon}</span>
      <span>{item.title}</span>
    </NavLink>
  );
}
