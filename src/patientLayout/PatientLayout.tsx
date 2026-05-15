import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  User as UserIcon,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { useGetPatientMeQuery } from "../redux/api/patientApi";
import NotificationDropdown from "../components/NotificationDropdown";

interface MenuItem {
  title: string;
  path: string;
  //@ts-ignore
  icon: JSX.Element;
}

export default function PatientLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const navigate = useNavigate();
  const { data: patientData } = useGetPatientMeQuery({});
  const patient = patientData?.data;

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuItems: MenuItem[] = [
    {
      title: "Overview",
      path: "/dashboard/patient",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Appointments",
      path: "/dashboard/patient/appointments",
      icon: <CalendarDays size={20} />,
    },
    {
      title: "Reports",
      path: "/dashboard/patient/report",
      icon: <Users size={20} />,
    },
    {
      title: "Prescriptions",
      path: "/dashboard/patient/prescription",
      icon: <Wallet size={20} />,
    },
    {
      title: "Profile",
      path: "/dashboard/patient/profile",
      icon: <UserIcon size={20} />,
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:relative top-0 left-0 z-[70] h-full w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO */}
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center text-white">
                <span className="font-black text-xl">P</span>
             </div>
             <div>
                <h1 className="text-lg font-black text-slate-800 leading-none">PatientPortal</h1>
                <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">My Health</p>
             </div>
          </div>

          <button onClick={() => setOpenSidebar(false)} className="lg:hidden text-slate-400">
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              closeSidebar={() => setOpenSidebar(false)}
            />
          ))}
        </nav>

        {/* BOTTOM USER CARD */}
        <div className="p-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-3 border border-slate-100">
             <div className="w-11 h-11 rounded-xl bg-white border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm relative group overflow-hidden">
                {patient?.profilePic ? (
                  <img src={patient.profilePic} alt="patient" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-slate-300" />
                )}
             </div>
             <div className="overflow-hidden">
               <h2 className="font-bold text-sm text-slate-800 truncate">{patient?.firstName} {patient?.lastName}</h2>
               <p className="text-[10px] font-bold text-slate-400 truncate uppercase mt-0.5 italic">{patient?.user?.role}</p>
             </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all text-sm group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span>Logout Portal</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOPBAR - FIXED */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setOpenSidebar(true)}
              className="lg:hidden w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">Health Dashboard</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Welcome back, {patient?.firstName}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />

            <div className="hidden md:flex items-center gap-3 pr-4 border-r border-slate-100">
                <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Security ID</p>
                    <p className="text-xs font-bold text-slate-700 mt-1 italic">{patient?.user?.email}</p>
                </div>
            </div>
            
            <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 overflow-hidden flex items-center justify-center shadow-sm">
                {patient?.profilePic ? (
                  <img src={patient.profilePic} alt="patient" className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={20} className="text-slate-300" />
                )}
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

interface SidebarItemProps {
  item: MenuItem;
  closeSidebar: () => void;
}

function SidebarItem({ item, closeSidebar }: SidebarItemProps) {
  return (
    <NavLink
      to={item.path}
      onClick={closeSidebar}
      end={item.path === "/dashboard/patient"}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-300 font-bold text-sm ${
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200"
            : "text-slate-500 hover:bg-slate-50 hover:text-indigo-600"
        }`
      }
    >
      <span>{item.icon}</span>
      <span>{item.title}</span>
    </NavLink>
  );
}
