import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserRound, 
  CalendarCheck, 
  Wallet, 
  Building2, 
  LogOut, 
  Menu, 
  X, 
  // Bell,
  Search,
  User as UserIcon
} from "lucide-react";
import { useGetMeQuery } from "../redux/api/userApi";
import NotificationDropdown from "../components/NotificationDropdown";

const ClinicLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { data: userData } = useGetMeQuery({});
  const user = userData?.data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/clinic/overview" },
    { icon: <UserRound size={20} />, label: "Doctor Management", path: "/clinic/doctors" },
    { icon: <CalendarCheck size={20} />, label: "Appointment Monitor", path: "/clinic/appointments" },
    { icon: <Wallet size={20} />, label: "Financial Tracking", path: "/clinic/finance" },
    { icon: <Building2 size={20} />, label: "Departments", path: "/clinic/departments" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-[70] w-72 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="flex-1 flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-xl shadow-slate-200">
                <Building2 size={22} />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-800 uppercase italic">
                PYTO<span className="text-blue-600">MART.PL</span>
              </span>
            </div>
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 text-sm
                  ${isActive 
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer/Logout Area */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-white shadow-md flex items-center justify-center text-white font-black text-xs">
                  {user?.role?.slice(0, 2).toUpperCase() || "AD"}
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Administrator</p>
                  <p className="text-xs font-bold text-slate-800 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-4 py-4 text-rose-500 font-bold hover:bg-rose-100 rounded-2xl transition-all text-sm group"
            >
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform text-rose-400" />
              <span>Sign Out Hub</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top Header - Fixed */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 lg:hidden text-slate-600 hover:bg-slate-50 rounded-xl border border-slate-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-3 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 w-96 group focus-within:ring-2 focus-within:ring-slate-900/5 focus-within:bg-white transition-all shadow-inner">
              <Search size={18} className="text-slate-400 group-focus-within:text-slate-900" />
              <input 
                type="text" 
                placeholder="Search analytics, doctors, sessions..." 
                className="bg-transparent border-none text-xs font-bold focus:ring-0 placeholder:text-slate-400 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            <NotificationDropdown />

            {/* Quick Actions (Desktop only) */}
            <div className="hidden sm:flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Security Node</p>
                <p className="text-xs font-bold text-slate-800 italic mt-1 leading-none">{user?.role}</p>
              </div>
              <div className="w-11 h-11 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-slate-400 font-black transition-all hover:bg-slate-50 select-none">
                 <UserIcon size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth bg-[#FBFDFF]">
          <div className="max-w-[1600px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClinicLayout;