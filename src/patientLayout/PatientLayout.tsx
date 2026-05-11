import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Wallet,
  User,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  title: string;
  path: string;
  //@ts-ignore
  icon: JSX.Element;
}

export default function PatientLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

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
      icon: <User size={20} />,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-72 bg-white border-r border-gray-200 shadow-xl flex flex-col transition-transform duration-300 ${
          openSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* LOGO */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Patient Panel</h1>

            <p className="text-sm text-gray-500 mt-1">Healthcare Management</p>
          </div>

          <button onClick={() => setOpenSidebar(false)} className="lg:hidden">
            <X size={22} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <SidebarItem
              key={index}
              item={item}
              closeSidebar={() => setOpenSidebar(false)}
            />
          ))}
        </nav>

        {/* PROFILE CARD */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-3">
            <img
              src="https://i.pravatar.cc/100"
              alt="patient"
              className="w-12 h-12 rounded-full object-cover border"
            />

            <div>
              <h2 className="font-semibold text-gray-800">John Doe</h2>

              <p className="text-sm text-gray-500">Patient Account</p>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* TOPBAR */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenSidebar(true)}
              className="lg:hidden w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
                Patient Dashboard
              </h1>

              <p className="text-xs lg:text-sm text-gray-500">
                Manage appointments, reports & prescriptions
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
              <img
                src="https://i.pravatar.cc/100"
                alt="patient"
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="hidden md:block">
                <h2 className="text-sm font-semibold text-gray-800">
                  John Doe
                </h2>

                <p className="text-xs text-gray-500">Patient</p>
              </div>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-3 lg:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 min-h-[calc(100vh-140px)] p-4 lg:p-6">
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
        `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${
          isActive
            ? "bg-blue-600 text-white shadow-lg"
            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
        }`
      }
    >
      <span>{item.icon}</span>

      <span>{item.title}</span>
    </NavLink>
  );
}
