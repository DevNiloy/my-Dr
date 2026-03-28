import React from 'react';
import { 
  ArrowRightIcon, 
  ShoppingCartIcon, 
  UserGroupIcon, 
  BeakerIcon, 
  ClipboardDocumentIcon 
} from '@heroicons/react/24/outline';

const FeatureSection: React.FC = () => {
  const features = [
    {
      icon: <ShoppingCartIcon className="w-6 h-6" />,
      text: "Extend your e-prescription",
    },
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      text: "Make an online appointment",
    },
    {
      icon: <BeakerIcon className="w-6 h-6" />,
      text: "Check your laboratory tests results",
    },
    {
      icon: <ClipboardDocumentIcon className="w-6 h-6" />,
      text: "View your medical history",
    },
  ];

  return (
    <section className="bg-white py-16 px-6 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        
        {/* Left Side: Tablet Mockup */}
        <div className="w-full lg:w-3/5 relative">
          <div className="relative z-10 drop-shadow-2xl transform hover:scale-[1.02] transition-transform duration-500">
            {/* Tablet Mockup Image */}
            <img 
              src="https://mydr.pl/welcome/img/remote-tablet.645aa153.png" 
              alt="Doctor Consultation" 
              className="w-full h-auto rounded-3xl border-[12px] border-white shadow-xl"
            />
          </div>
          {/* Background decorative blob */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10"></div>
        </div>

        {/* Right Side: Feature List */}
        <div className="w-full lg:w-2/5 flex flex-col space-y-8">
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-4 group cursor-pointer"
              >
                {/* Icon with Gradient Border/Text look */}
                <div className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center text-pink-500 bg-white border border-pink-100 shadow-sm group-hover:bg-pink-500 group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                
                <span className="text-gray-700 font-semibold text-lg group-hover:text-blue-600 transition-colors">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-10 rounded-full flex items-center gap-3 shadow-lg shadow-blue-200 transform transition active:scale-95 group">
              MAKE AN APPOINTMENT
              <div className="bg-white rounded-full p-1 group-hover:translate-x-1 transition-transform">
                <ArrowRightIcon className="w-4 h-4 text-blue-500" />
              </div>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;