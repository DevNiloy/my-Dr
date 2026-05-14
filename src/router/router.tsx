import { createBrowserRouter, Navigate } from "react-router-dom";
import ParenLayout from "../layout/ParenLayout";
import HomePage from "../PublicPage/Home/HomePage";
import Login from "../PublicPage/Auth/Login";
import Register from "../PublicPage/Auth/Register";
import ProtectedRoute from "../shared_components/ProtectedRoute";

import ClinicLayout from "../cliniclayout/ClinicLayout";
import ClinicOverview from "../cliniclayout/ClinicOverview";
import DoctorManagement from "../cliniclayout/DoctorManagement";
import AppointmentMonitor from "../cliniclayout/AppointmentMonitor";
import FinancialTracking from "../cliniclayout/FinancialTracking";
import DepartmentManagement from "../cliniclayout/DepartmentManagement";
import DoctorLayout from "../DoctorLayout/DoctorLayout";
import DoctorOverview from "../DoctorLayout/overview/DoctorOverview";

import DoctorAppointment from "../DoctorLayout/appointments/DoctorAppointment";
import PatientList from "../DoctorLayout/patientlist/PatientList";
import PatientDetails from "../DoctorLayout/patientlist/PatientDetails";
import AllReports from "../DoctorLayout/reports/AllReports";
import ReportList from "../DoctorLayout/reports/ReportList";
import ReportDetails from "../DoctorLayout/reports/ReportDetails";
import AllPrescription from "../DoctorLayout/prescription/AllPrescription";
import CreatePrescription from "../DoctorLayout/prescription/CreatePrescription";
import PrescriptionDetails from "../DoctorLayout/prescription/PrescriptionDetails";
import AllCall from "../DoctorLayout/telemedicine/AllCall";
import Earning from "../DoctorLayout/earning/Earning";
import Profile from "../DoctorLayout/profile/Profile";
import DoctorAvailability from "../DoctorLayout/availability/DoctorAvailability";
import PatientLayout from "../patientLayout/PatientLayout";
import PatientOverview from "../patientLayout/patientoverview/PatientOverview";
import PatientAppointment from "../patientLayout/appointment/PatientAppointment";
import PatientReport from "../patientLayout/reports/PatientReport";
import PatientPrescription from "../patientLayout/patientPrescription/PatientPrescription";
import PatientPrescripitonDetails from "../patientLayout/patientPrescription/PatientPrescripitonDetails";
import PatientProfile from "../patientLayout/profile/PatientProfile";
import BookAppointment from "../PublicPage/BookAppointment/BookAppointment";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <ParenLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "appointment", element: <BookAppointment /> },
    ],
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/unauthorized",
    element: <div className="min-h-screen flex items-center justify-center font-black text-slate-400 text-3xl">403 Unauthorized</div>
  },

  // PROTECTED CLINIC ADMIN ROUTES
  {
    element: <ProtectedRoute allowedRoles={["CLINIC_ADMIN"]} />,
    children: [
      {
        path: "/clinic",
        element: <ClinicLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: <ClinicOverview /> },
          { path: "doctors", element: <DoctorManagement /> },
          { path: "appointments", element: <AppointmentMonitor /> },
          { path: "finance", element: <FinancialTracking /> },
          { path: "departments", element: <DepartmentManagement /> },
        ],
      }
    ]
  },

  // PROTECTED DOCTOR ROUTES
  {
    element: <ProtectedRoute allowedRoles={["DOCTOR"]} />,
    children: [
      {
        path: "/dashboard/doctor",
        element: <DoctorLayout />,
        children: [
          { index: true, element: <Navigate to="overview" replace /> },
          { path: "overview", element: <DoctorOverview /> },
          { path: "availability", element: <DoctorAvailability /> },
          { path: "appointments", element: <DoctorAppointment /> },
          { path: "patients", element: <PatientList /> },
          { path: "emr/:id", element: <PatientDetails /> },
          { path: "allreport", element: <AllReports /> },
          { path: "reports/:patientid", element: <ReportList /> },
          { path: "patient/reports/:reportid", element: <ReportDetails /> },
          { path: "prescriptions/:id", element: <AllPrescription /> },
          { path: "prescription/create/:patientid", element: <CreatePrescription /> },
          { path: "prescription/:id", element: <PrescriptionDetails /> },
          { path: "telemedicine", element: <AllCall /> },
          { path: "earning", element: <Earning /> },
          { path: "profile", element: <Profile /> },
        ],
      }
    ]
  },

  // PROTECTED PATIENT ROUTES
  {
    element: <ProtectedRoute allowedRoles={["PATIENT"]} />,
    children: [
      {
        path: "/dashboard/patient",
        element: <PatientLayout />,
        children: [
          { index: true, element: <PatientOverview /> },
          { path: "appointments", element: <PatientAppointment /> },
          { path: "report", element: <PatientReport /> },
          { path: "prescription", element: <PatientPrescription /> },
          { path: "prescription/:id", element: <PatientPrescripitonDetails /> },
          { path: "profile", element: <PatientProfile /> },
        ],
      }
    ]
  },
]);
