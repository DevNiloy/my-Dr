import { NavLink, Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export default function DoctorLayout() {
  const [openSidebar, setOpenSidebar] = useState(false);

  const menuItems = [
    {
      title: 'Overview',
      path: '/dashboard/doctor/overview',
      icon: '📊'
    },
    {
      title: 'Availability',
      path: '/dashboard/doctor/availability',
      icon: '📅'
    },
    {
      title: 'Appointments',
      path: '/dashboard/doctor/appointments',
      icon: '🩺'
    },
    {
      title: 'Patients',
      path: '/dashboard/doctor/patients',
      icon: '👥'
    },
    // {
    //   title: 'Reports',
    //   path: '/dashboard/doctor/allreport',
    //   icon: '📂'
    // },
    // {
    //   title: 'Prescriptions',
    //   path: '/dashboard/doctor/prescriptions',
    //   icon: '💊'
    // },
    // {
    //   title: 'Telemedicine',
    //   path: '/dashboard/doctor/telemedicine',
    //   icon: '📹'
    // },
    {
      title: 'Earnings',
      path: '/dashboard/doctor/earning',
      icon: '💰'
    },
    {
      title: 'Profile',
      path: '/dashboard/doctor/profile',
      icon: '👨‍⚕️'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      {/* Mobile Overlay */}
      {openSidebar && (
        <div
          onClick={() => setOpenSidebar(false)}
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-72 bg-white shadow-xl border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          openSidebar
            ? 'translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-sky-600">
            Doctor Panel
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Healthcare Management System
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <SidebarItem key={index} item={item} />
          ))}
        </nav>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 bg-sky-50 rounded-2xl p-3">
            <img
              src="https://i.ibb.co.com/4pDNDk1/avatar.png"
              alt="doctor"
              className="w-12 h-12 rounded-full object-cover"
            />

            <div>
              <h2 className="font-semibold text-gray-800">
                Dr. John Doe
              </h2>
              <p className="text-sm text-gray-500">
                Cardiologist
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpenSidebar(true)}
              className="lg:hidden w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center"
            >
              <Menu size={22} />
            </button>

            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-800">
              Doctor Dashboard
            </h1>
            <p className="text-xs lg:text-sm text-gray-500">
                Manage appointments, reports & telemedicine
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
        {/* profile */}
            <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
              <img
                src="https://i.ibb.co.com/4pDNDk1/avatar.png"
                alt="doctor"
                className="w-10 h-10 rounded-full object-cover"
              />

              <div className="hidden md:block">
                <h2 className="text-sm font-semibold text-gray-800">
                  Dr. John Doe
                </h2>
                <p className="text-xs text-gray-500">
                  Senior Doctor
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Pages */}
        <main className="flex-1 p-3 lg:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl lg:rounded-3xl shadow-sm border border-gray-200 min-h-[calc(100vh-140px)] p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}





function SidebarItem({ item }:any) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 font-medium ${
          isActive
            ? 'bg-sky-500 text-white shadow-lg'
            : 'text-gray-700 hover:bg-sky-50 hover:text-sky-600'
        }`
      }
    >
      <span className="text-xl">{item.icon}</span>
      <span>{item.title}</span>
    </NavLink>
  );
}
