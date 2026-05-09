import { createBrowserRouter, Navigate } from "react-router-dom";
import ParenLayout from "../layout/ParenLayout";
import HomePage from "../PublicPage/Home/HomePage";
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

export const router = createBrowserRouter([{
    path:'/',
    element:<ParenLayout/>,
    children:([
        {
            path:'/',
            element:<HomePage/>
        },
    ]),
    
},
{
    path: '/clinic',
    element: <ClinicLayout />, // এই লেআউটে সাইডবার এবং টপবার থাকবে
    children: [
      {
        index: true, 
        element: <Navigate to="overview" replace /> // /clinic এ গেলে অটোমেটিক ওভারভিউতে নিয়ে যাবে
      },
      {
        path: 'overview', // ১. Overview Statistics
        element: <ClinicOverview />
      },
      {
        path: 'doctors', // ২. Doctor Management
        element: <DoctorManagement />
      },
      {
        path: 'appointments', // ৩. Appointment Monitoring
        element: <AppointmentMonitor />
      },
      {
        path: 'finance', // ৪. Financial Tracking
        element: <FinancialTracking />
      },
      {
        path: 'departments', // ৫. Department Management
        element: <DepartmentManagement />
      }
    ]
  },

  {
    path:'/dashboard/doctor',
    element:<DoctorLayout/>,
    children:[
      {
        index:true,
        element:<Navigate to="overview" replace></Navigate>
      },
      {
        path:'overview',
        element:<DoctorOverview/>
      },
      {
        path:'availability',
        element:<DoctorAvailability/>//offdays, slots, 
      },

      {
        path:'appointments',
        element:<DoctorAppointment/>
      },
      {
        path:'patients',
        element:<PatientList/> //done
      },
      {
        path:'emr/:id',
        element:<PatientDetails/> //done
      },
      {
        path:'allreport',
        element:<AllReports/>
      },
      {
        path:'reports/:patientid',
        element:<ReportList/>//done
      },
      {
        path:'patient/reports/:reportid',
        element:<ReportDetails/> //done
      },
      {
        path:'prescriptions/:id',
        element:<AllPrescription/> //done
      },
      {
        path:'prescription/create/:patientid', //done
        element:<CreatePrescription/>
      },
      {
        path:'prescription/:id', //done
        element:<PrescriptionDetails/>
      },
      {
        path:'telemedicine',
        element:<AllCall/>
      },
      {
        path:'earning',
        element:<Earning/>
      },
      {
        path:'profile',
        element:<Profile/>
      }
    ]
  }




])