import React from 'react';
import { ArrowRightCircleIcon, MapPinIcon } from '@heroicons/react/24/solid';

const MapSection: React.FC = () => {
  return (
    <div className="relative w-full bg-white overflow-hidden py-24">
      {/* Background Slanted Blue Shape */}
      <div 
        className="absolute inset-0 bg-[#3B82F6] transform -skew-y-3 origin-top-left scale-110"
        style={{ height: '115%' }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
        {/* Left Side: Text and Register Button */}
        <div className="text-white space-y-8 order-2 lg:order-1">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight uppercase tracking-tight">
            The Best Specialists <br /> At Your Service
          </h2>
          <p className="text-blue-50 text-lg max-w-md opacity-90 leading-relaxed">
            Find the right doctor for your needs and schedule an appointment in seconds. 
            Access our verified network of medical experts across the country.
          </p>
          
          <button className="flex items-center gap-3 bg-[#F43F5E] hover:bg-[#E11D48] text-white px-10 py-4 rounded-full font-bold text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95 group">
            REGISTER
            <ArrowRightCircleIcon className="h-7 w-7 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Right Side: Image based Map with Pins */}
        <div className="relative flex justify-center items-center order-1 lg:order-2">
          <div className="relative w-full max-w-md lg:max-w-lg">
            
            {/* Poland SVG Image from provided URL */}
            <img 
              src="https://mydr.pl/welcome/img/map.cb1a7c03.svg" 
              alt="Poland Map" 
              className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)] filter brightness-110"
            />

            {/* Pulsating Map Pins (Manually positioned to fit the map) */}
            <div className="absolute top-[35%] left-[48%]">
              <AnimatedPin city="Warsaw" />
            </div>
            <div className="absolute top-[65%] left-[35%]">
              <AnimatedPin city="Wrocław" delay="0.5s" />
            </div>
            <div className="absolute top-[75%] left-[55%]">
              <AnimatedPin city="Kraków" delay="1s" />
            </div>
            <div className="absolute top-[20%] left-[30%]">
              <AnimatedPin city="Szczecin" delay="1.5s" />
            </div>
            <div className="absolute top-[15%] left-[65%]">
              <AnimatedPin city="Gdańsk" delay="0.8s" />
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

// Animated Pin Component with Tooltip
const AnimatedPin = ({ delay = '0s', city = 'Specialist' }: { delay?: string; city?: string }) => (
  <div className="relative group cursor-pointer" style={{ animationDelay: delay }}>
    {/* Ripple/Pulse Effect */}
    <div className="absolute -inset-3 bg-white/40 rounded-full animate-ping pointer-events-none"></div>
    
    {/* Pin Icon */}
    <div className="relative bg-white p-1 rounded-full shadow-lg transition-transform group-hover:scale-125 border border-purple-100">
      <MapPinIcon className="w-6 h-6 text-[#A855F7]" />
    </div>

    {/* Tooltip on Hover */}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-white text-gray-800 text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap z-50 pointer-events-none border border-gray-100">
      {city} Network
    </div>
  </div>
);

export default MapSection;