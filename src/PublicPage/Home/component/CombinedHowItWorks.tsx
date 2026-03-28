import React from 'react';
import { 
  ShoppingCartIcon, 
  ClipboardDocumentCheckIcon, 
  BeakerIcon, 
  FolderIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

const CombinedHowItWorks: React.FC = () => {
  // Features Data (extracted from the combined concept)
  const features = [
    { 
      id: 1, 
      icon: ShoppingCartIcon, 
      label: 'Extend your e-prescription', 
      iconColor: 'text-purple-700', 
      bgColor: 'bg-purple-100' 
    },
    { 
      id: 2, 
      icon: ClipboardDocumentCheckIcon, 
      label: 'Make an online appointment', 
      iconColor: 'text-purple-700', 
      bgColor: 'bg-purple-100' 
    },
    { 
      id: 3, 
      icon: BeakerIcon, 
      label: 'Check your laboratory tests results', 
      iconColor: 'text-purple-700', 
      bgColor: 'bg-purple-100' 
    },
    { 
      id: 4, 
      icon: FolderIcon, 
      label: 'View your medical history', 
      iconColor: 'text-purple-700', 
      bgColor: 'bg-purple-100' 
    },
  ];

  return (
    <section className="bg-gray-50 py-16 px-6 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Step 1: Header Section with Text (image_2.png) */}
        <div className="text-center mb-16 lg:mb-20">
          <h2 className="text-3xl font-extrabold text-blue-600 tracking-tight sm:text-4xl">
            HOW IT WORKS
          </h2>
          <p className="mt-5 max-w-3xl mx-auto text-gray-600 leading-relaxed text-lg">
            MyDr is a service that combines a doctor's search engine with full access to your medical data. An online patient account, by which you have access to all your medical data. Make an appointment, get an e-prescription or medical leave without leaving your home.
          </p>
        </div>

        {/* Step 2: Main Flow (Combined Visuals) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Side: Visual Integration */}
          <div className="relative flex justify-center h-[400px] lg:h-[450px]">
            {/* Background ISO representation (subtle overlay of building/dotted flow from image_2.png) */}
            <div className="absolute inset-0 opacity-10 scale-105 pointer-events-none transform -translate-y-6">
              {/* Note: In your actual app, you'd use your specific ISO graphics here */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-blue-100 rounded-full blur-3xl"></div>
              {/* Subtle dotted curve representation */}
              <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" viewBox="0 0 200 100" strokeDasharray="5 5" fill="none">
                 <path d="M15 85 C 50 15, 150 15, 185 85" stroke="gray" strokeWidth="1" />
              </svg>
            </div>

            {/* Step 3: Central Tablet Visual (Enhanced Placement from image_3.png) */}
            <div className="relative z-10 w-full max-w-[340px] lg:max-w-[380px] self-end md:self-center">
              {/* Replace with your own image path for the hands holding tablet */}
              <img 
                src="/assets/hands_tablet_doctor_video_call.png" 
                alt="Hands holding tablet with doctor video call" 
                className="w-full h-auto drop-shadow-2xl rounded-xl transition-all duration-300 transform group-hover:scale-105"
              />
              {/* Context Marker (small logic-flow point from image_2.png concept) */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 bg-purple-500 rounded-full border-[3px] border-white shadow-xl z-20"></div>
            </div>
          </div>

          {/* Step 4: Feature List & Call to Action Button */}
          <div className="space-y-10 lg:pl-10">
            {features.map((feature) => (
              <div key={feature.id} className="flex items-start gap-6 group">
                {/* Purple Icon Container */}
                <div className={`flex-shrink-0 w-16 h-16 rounded-[1.25rem] ${feature.bgColor} flex items-center justify-center p-4 border border-purple-200 shadow-inner group-hover:scale-110 group-hover:border-purple-300 transition-all`}>
                  <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
                </div>
                {/* Text Label */}
                <p className="text-gray-700 font-semibold text-lg leading-snug pt-1 group-hover:text-blue-600 transition-colors">
                  {feature.label}
                </p>
              </div>
            ))}

            {/* Call to Action Button */}
            <div className="pt-10">
              <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl transition-all duration-200 transform hover:scale-105 active:scale-95 group">
                MAKE AN APPOINTMENT
                <ArrowRightIcon className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default CombinedHowItWorks;