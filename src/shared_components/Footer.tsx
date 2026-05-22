import React from "react";
import logo from '../../public/logo.png'
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#3B82F6] text-white py-12 px-6 lg:px-20">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Logo and Contact */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              {/* MyDr Logo */}
              {/* <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center p-1">
                <img
                  src="/logo-white-stetho.svg"
                  alt="MyDr"
                  className="w-full h-full"
                />
              </div>
              <span className="text-3xl font-bold italic tracking-tighter">
                MyDr
              </span> */}
              <div className="border rounded-2xl border-white bg-white">
                          <img src={logo} alt="" className="w-54 h-16" />
                        </div>
            </div>

            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="p-2 border border-white/30 rounded-md group-hover:bg-white/10 transition">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  />
                </svg>
              </div>
              <a
                href="mailto:arkadiuszgalka@protonmail.com"
                className="hover:underline font-medium"
              >
                arkadiuszgalka@protonmail.com
              </a>
            </div>

            {/* <p className="hover:underline cursor-pointer opacity-90 transition hover:opacity-100">
              Polityka prywatności
            </p> */}
          </div>

          {/* Column 2: Empty Spacer for matching layout */}
          <div className="hidden lg:block"></div><p></p>

          {/* Column 3: For Doctors */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-wider">
              For Doctors
            </h3>
            <div className="space-y-4">
              <p className="text-sm opacity-90 leading-relaxed">
                Free program <br />
                for running a medical facility
              </p>
              {/* MyDr EDM Button */}
              {/* <button className="bg-white/95 text-blue-600 px-6 py-3 rounded-full flex items-center gap-2 shadow-lg hover:bg-white transition-all transform active:scale-95 group">
                <div className="w-6 h-6 border border-blue-400 rounded-full flex items-center justify-center p-0.5">
                  <img
                    src="/blue-stetho.svg"
                    alt="EDM"
                    className="w-full h-full"
                  />
                </div>
                <span className="font-bold italic">
                  MyDr<span className="text-blue-400">EDM</span>
                </span>
              </button> */}
            </div>
          </div>

          {/* Column 4: Links */}
          {/* <div className="space-y-6">
            <h3 className="text-xl font-bold uppercase tracking-wider">See Also</h3>
            <ul className="space-y-3">
              {['www.dr100.pl', 'www.zdrowastrona.pl', 'www.lekseniora.pl', 'www.edm.mydr.pl'].map((link) => (
                <li key={link}>
                  <a href={`https://${link}`} className="hover:underline opacity-90 hover:opacity-100 transition block text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/20 text-xs opacity-80 text-center md:text-left leading-loose">
          Copyright © 2022 PYTOMAT.PL 
        </div>
      </div>
    </footer>
  );
};

export default Footer;
