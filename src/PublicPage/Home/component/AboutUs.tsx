import React from 'react';
import { motion } from 'framer-motion';

const AboutUs: React.FC = () => {
  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Background Slanted Shape - matching image_473606.jpg layout */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -left-20 top-0 w-1/2 h-full bg-gray-50 transform -skew-x-12 z-0" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        
        {/* Left Side: Creative Illustration / Image */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://mydr.pl/welcome/img/about-high-res.a8d81f61.png" // image_473606.jpg reference
              alt="Medical Information Leader" 
              className="w-full h-auto object-cover"
            />
          </div>
          {/* Decorative elements matching the sketch style in image_10 */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 opacity-20">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-blue-500">
              <circle cx="50" cy="50" r="40" strokeWidth="2" strokeDasharray="4 4" />
            </svg>
          </div>
        </motion.div>

        {/* Right Side: Content */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-500 p-2 rounded-full">
               <img src="/assets/logo-white.svg" alt="MyDr" className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-400 uppercase tracking-widest">
              Who are we
            </h2>
          </div>

          <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
            <p>
              We are the leader on the medical information market in Poland. 
              For over a dozen years we have been providing doctors, pharmacists and patients 
              with comprehensive data on all medicinal products available on the Polish market.
            </p>
            <p>
              We also keep you informed about the latest developments in the healthcare sector 
              and interesting solutions used in medicine. Our offer also includes modern products 
              in the field of new technologies, such as medical mobile applications or a program 
              for running a medical clinic.
            </p>
          </div>

          <div className="pt-6">
            <button className="border-2 border-blue-500 text-blue-500 px-8 py-3 rounded-full font-bold hover:bg-blue-500 hover:text-white transition-all duration-300 transform active:scale-95">
              LEARN MORE
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;