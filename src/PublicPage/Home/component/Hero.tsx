import React, { useState } from 'react';
import { 
  UserCircleIcon, 
  MapPinIcon, 
  CalendarDaysIcon, 
  ArrowRightCircleIcon 
} from '@heroicons/react/24/outline';

const Hero: React.FC = () => {
  // States for Tabs and Form
  const [activeTab, setActiveTab] = useState<'e-visit' | 'stationary'>('e-visit');
  const [isPrivate, setIsPrivate] = useState(true);

  return (
    <section className="relative min-h-[600px] bg-[#3B82F6] flex items-center justify-center p-6 lg:p-20 overflow-hidden">
      
      {/* Background Decorative Elements (Optional) */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className=" w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Mockup & Illustration */}
        <div className="relative flex justify-center">
          {/* Phone Mockup Representation */}
          <div className="relative w-[280px] h-[580px] bg-gradient-to-b from-purple-600 to-blue-500 rounded-[3rem] border-[8px] border-white shadow-2xl flex flex-col items-center p-6 text-white text-center">
            <div className="w-12 h-1 bg-white/30 rounded-full mb-8"></div>
            <div className="mb-4">
               {/* MyDr Logo Placeholder */}
               <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center mx-auto mb-2">
                 <span className="text-[10px]">MyDr</span>
               </div>
               <h2 className="text-xl font-bold italic">MyDr</h2>
            </div>
            <h3 className="text-lg font-semibold mt-10 uppercase tracking-wider">
              Zaloguj się do swojego <br /> 
              <span className="text-2xl font-extrabold">ZDROWIA</span>
            </h3>
            
            <div className="mt-auto w-full space-y-3 pb-10">
              <input className="w-full bg-white/20 rounded-md py-2 px-4 placeholder-white/70 outline-none border border-white/30" placeholder="Login" />
              <input className="w-full bg-white/20 rounded-md py-2 px-4 placeholder-white/70 outline-none border border-white/30" type="password" placeholder="Haslo" />
              <button className="w-full bg-blue-500 py-2 rounded-md font-bold text-sm shadow-lg">ZALOGUJ SIĘ</button>
              <button className="w-full bg-pink-500 py-2 rounded-md font-bold text-sm shadow-lg">ZAREJESTRUJ SIĘ</button>
            </div>
          </div>

          {/* Character Illustration Placeholder (Positioned) */}
          <div className="hidden md:block absolute -bottom-10 -right-20">
             {/* Note: Use your doctor/patient PNG images here */}
             <div className="w-[300px] h-[300px] bg-contain bg-no-repeat bg-bottom opacity-90" style={{backgroundImage: 'url("doctor_patient_illustration.png")'}}></div>
          </div>
        </div>

        {/* Right Side: Search Form */}
        <div className="flex flex-col">
          
          {/* Tab Headers */}
          <div className="flex gap-4 mb-0 ml-4 lg:ml-8">
            <button 
              onClick={() => setActiveTab('e-visit')}
              className={`px-6 py-4 rounded-t-2xl font-bold text-sm transition-all ${activeTab === 'e-visit' ? 'bg-white/10 text-white' : 'text-white/70'}`}
            >
              SCHEDULE <br /> AN E-VISIT
            </button>
            <button 
              onClick={() => setActiveTab('stationary')}
              className={`px-6 py-4 rounded-t-2xl font-bold text-sm transition-all ${activeTab === 'stationary' ? 'bg-white/20 text-white backdrop-blur-md' : 'text-white/70'}`}
            >
              SCHEDULE <br /> A STATIONARY VISIT
            </button>
          </div>

          {/* Main Form Container */}
          <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-3xl lg:rounded-tl-none p-8 lg:p-12 shadow-2xl relative">
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* Specialty Select */}
              <div className="relative group">
                <UserCircleIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/80" />
                <select className="w-full bg-white text-gray-700 rounded-full py-3 pl-12 pr-6 appearance-none focus:ring-4 focus:ring-blue-300 outline-none transition-all">
                  <option>Select specialty / doctor</option>
                  <option>Cardiologist</option>
                  <option>Dermatologist</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>

              {/* City Select */}
              <div className="relative">
                <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/80" />
                <select className="w-full bg-white text-gray-700 rounded-full py-3 pl-12 pr-6 appearance-none focus:ring-4 focus:ring-blue-300 outline-none transition-all">
                  <option>Select city</option>
                  <option>Dhaka</option>
                  <option>Chittagong</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Date Input */}
                <div className="relative w-full md:w-1/2">
                  <CalendarDaysIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/80" />
                  <input 
                    type="date" 
                    defaultValue="2026-03-28"
                    className="w-full bg-white text-gray-700 rounded-full py-3 pl-12 pr-6 focus:ring-4 focus:ring-blue-300 outline-none"
                  />
                </div>

                {/* Toggle Switch (Private/NFZ) */}
                <div className="flex items-center gap-3 text-white font-bold">
                  <span className={isPrivate ? 'opacity-100' : 'opacity-50'}>Private</span>
                  <button 
                    onClick={() => setIsPrivate(!isPrivate)}
                    className="w-14 h-7 bg-white/30 rounded-full relative p-1 transition-all"
                  >
                    <div className={`w-5 h-5 bg-pink-500 rounded-full transition-all transform ${!isPrivate ? 'translate-x-7' : 'translate-x-0'}`}></div>
                  </button>
                  <span className={!isPrivate ? 'opacity-100' : 'opacity-50'}>NFZ</span>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex justify-end pt-4">
                <button className="bg-pink-500 hover:bg-pink-600 text-white flex items-center gap-3 px-8 py-3 rounded-full font-bold text-lg shadow-xl transition-all transform hover:scale-105 active:scale-95">
                  SEARCH FOR VISITS
                  <ArrowRightCircleIcon className="h-7 w-7" />
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero ;