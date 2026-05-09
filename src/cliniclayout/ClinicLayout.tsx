import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { 
  LayoutDashboard, 
  UserRound, 
  CalendarCheck, 
  Wallet, 
  Building2, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  Search
} from "lucide-react";

const ClinicLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Overview", path: "/clinic/overview" },
    { icon: <UserRound size={20} />, label: "Doctor Management", path: "/clinic/doctors" },
    { icon: <CalendarCheck size={20} />, label: "Appointment Monitor", path: "/clinic/appointments" },
    { icon: <Wallet size={20} />, label: "Financial Tracking", path: "/clinic/finance" },
    { icon: <Building2 size={20} />, label: "Departments", path: "/clinic/departments" },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0EA5E9] rounded-xl flex items-center justify-center text-white shadow-lg shadow-sky-100">
                <Building2 size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">
                Care<span className="text-[#0EA5E9]">Sync</span>
              </span>
            </div>
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 space-y-1.5">
            {menuItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) => `
                  flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200
                  ${isActive 
                    ? "bg-sky-50 text-[#0EA5E9] shadow-sm shadow-sky-50" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"}
                `}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Footer/Logout Area */}
          <div className="p-6 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 border-2 border-white shadow-sm flex items-center justify-center text-[#0EA5E9] font-bold">
                  A
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-slate-800 truncate">Admin Terminal</p>
                  <p className="text-[10px] text-slate-400 font-medium">super-admin@caresync.com</p>
                </div>
              </div>
            </div>
            <button className="w-full flex items-center gap-4 px-4 py-3.5 text-rose-500 font-bold hover:bg-rose-50 rounded-2xl transition-all">
              <LogOut size={20} />
              <span className="text-sm">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-10 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 lg:hidden text-slate-600 hover:bg-slate-50 rounded-xl"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="hidden md:flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-80">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none text-sm focus:ring-0 placeholder:text-slate-400 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6">
            {/* Notification */}
            <button className="p-2.5 text-slate-400 hover:text-[#0EA5E9] hover:bg-sky-50 rounded-xl transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            {/* Quick Actions (Desktop only) */}
            <div className="hidden sm:flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Global Account</p>
                <p className="text-sm font-bold text-slate-800 italic">Clinic Central</p>
              </div>
              <div className="w-10 h-10 bg-slate-800 rounded-xl shadow-lg flex items-center justify-center text-white font-black text-xs">
                CC
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClinicLayout;