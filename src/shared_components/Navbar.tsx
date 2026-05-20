import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { name: 'HOW IT WORKS', href: '#' },
    { name: 'ABOUT US', href: '#' },
    { name: 'MOBILE APP', href: '#' },
    { name: 'CLINIC ZONE', href: '#' },
  ];

  return (
    <nav className="bg-[#3B82F6] px-4 py-3 md:px-10">
      <div className="flex items-center justify-between">
        
        {/* Logo Section */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">MyDr</span>
          </div>
          <span className="text-white font-bold text-xl italic tracking-tight">MyDr</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white text-xs font-bold hover:text-blue-100 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right Side: Sign In & Country */}
        <div className="hidden lg:flex items-center gap-4">
          <Link to="/login" className="bg-white text-[#3B82F6] px-8 py-2 rounded-full font-bold text-sm hover:bg-gray-100 transition-all shadow-md">
            SIGN IN
          </Link>
          
          {/* Static Country Flag (No Dropdown) */}
          <div className="w-9 h-9 rounded-full border-2 border-white overflow-hidden flex items-center justify-center bg-white">
             <img 
              src="https://flagcdn.com/gb.svg" 
              alt="UK Flag" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Mobile Burger Menu Button */}
        <div className="lg:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white">
            {mobileMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 space-y-4">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="block text-white font-bold text-sm">
              {link.name}
            </a>
          ))}
          <div className="pt-4 border-t border-blue-400 flex flex-col gap-4">
            <button 
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
              className="bg-white text-[#3B82F6] w-full py-3 rounded-full font-bold"
            >
              SIGN IN
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;