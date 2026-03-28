// src/components/MobileApp.tsx
import React from 'react';
 
import { ShieldCheckIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

// Mockup Data Structure (from image_7.png)
const guarantees = [
  {
    id: 1,
    icon: ShieldCheckIcon,
    text: "Guarantee of the security of your data",
    bgColor: "bg-white",
  },
  {
    id: 2,
    icon: CalendarDaysIcon,
    text: "Visit cancelation and rescheduling free of charge",
    bgColor: "bg-white",
  },
  {
    id: 3,
    icon: ClockIcon,
    text: "Service available 24 hours a day, 7 days a week",
    bgColor: "bg-white",
  },
];

const MobileApp: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-400 via-blue-600 to-purple-700 text-white py-16 px-6 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-20 items-center">
        
        {/* Left Side: Mockups & Guarantees (Combined from image_7.png and image_8.png) */}
        <div className="relative flex justify-center items-center h-[500px] md:h-[600px]">
          {/* Hands holding tablet with doctor video call visual (image_8.png enhancement) */}
          <div className="relative z-10 w-full max-w-[340px] md:max-w-[380px] drop-shadow-2xl">
             {/* Replace with your specific mockup image path */}
             <img 
               src="https://mydr.pl/welcome/img/mobile-phones.be4eaf31.svg" 
               alt="Hands holding tablet with doctor video call" 
               className="w-full h-auto rounded-xl shadow-2xl transition-all duration-300 transform group-hover:scale-105"
             />
             {/* Center marker logic-flow point representation (image_7.png context) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-purple-500 rounded-full border-[3px] border-white shadow-xl z-20"></div>
          </div>

          {/* Guarantee Mockups placement representing image_7.png context (hidden on mobile, show on md+) */}
          <div className="absolute inset-0 opacity-10 scale-105 md:opacity-10 md:scale-100 pointer-events-none transform -translate-y-6">
             {/* Representation of ISO Home building placement with dotted flow */}
             <div className="w-20 h-20 bg-blue-100 rounded-lg absolute bottom-10 left-10"></div>
             {/* Subtle dotted curve representation */}
             <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 200 100" strokeDasharray="5 5" fill="none">
                 <path d="M15 85 C 50 15, 150 15, 185 85" stroke="gray" strokeWidth="1" />
              </svg>
               {/* ISO Hospital on bottom-right */}
              <div className="w-20 h-20 bg-blue-200 rounded-lg absolute bottom-10 right-10 flex items-center justify-center text-blue-500 font-bold">+</div>
          </div>
        </div>

        {/* Right Side: Header, App Stores, & Feature List (image_8.png text, image_7.png list) */}
        <div className="flex flex-col space-y-10 pl-0 md:pl-10">
          
          {/* Main App Download Header & Descriptive Text (from image_8.png) */}
          <div className="space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-center md:text-left leading-snug">
              DOWNLOAD THE APP <br /> 
              AND SIGN IN TO YOUR <span className="font-extrabold text-pink-300">HEALTH</span>
            </h2>
            <p className="text-gray-100 max-w-xl mx-auto md:mx-0 text-center md:text-left leading-relaxed">
              Unlock full access to your medical data, e-prescriptions, and appointment history. 
              Manage your health conveniently from your mobile device.
            </p>
          </div>

          {/* App Store Links Section (from image_8.png) */}
          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center md:justify-start pt-6 border-t border-white/20">
             <div className="flex flex-col items-center gap-2">
                 {/* Apple Logo placeholder representation */}
                 <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold"></span>
                 </div>
                 <span className="text-xs text-center">FREE application for <br /> iOS devices</span>
                 <a href="#" className="flex items-center gap-3 bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition-all transform hover:scale-105">
                    Download on the <span className="font-bold">App Store</span>
                 </a>
             </div>
             
             <div className="flex flex-col items-center gap-2 pt-6 sm:pt-0">
                 {/* Android Logo placeholder representation */}
                  <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">A</span>
                  </div>
                 <span className="text-xs text-center">FREE application for <br /> Android devices</span>
                 <a href="#" className="flex items-center gap-3 bg-white text-blue-700 px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-100 transition-all transform hover:scale-105">
                    GET IT ON <span className="font-bold">Google Play</span>
                 </a>
             </div>
          </div>

          {/* Guarantee Mockup Feature List Section (from image_7.png logic placement) */}
          <div className="pt-10 border-t border-white/20">
            <h3 className="text-2xl font-bold tracking-tight mb-8">You are in good hands</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 lg:gap-12">
              {guarantees.map((item) => (
                <div key={item.id} className="flex items-start gap-5 group">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-3xl ${item.bgColor} flex items-center justify-center p-3 border border-purple-200 shadow-inner group-hover:scale-110 transition-all`}>
                    <item.icon className={`h-7 w-7 text-purple-600`} />
                  </div>
                  <p className="text-gray-100 font-semibold leading-snug pt-1 group-hover:text-pink-300 transition-colors">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default MobileApp;