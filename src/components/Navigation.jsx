
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { CLINIC } from '@/lib/clinic-branding';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About', path: '/about' },
    { name: 'Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin' },
  ];

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (location.pathname.startsWith('/admin')) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.95 }}
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'top-0 bg-[#0F0F0F]/95 backdrop-blur-md shadow-lg' 
          : 'top-3 sm:top-4 lg:top-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={CLINIC.logoUrl}
              alt="JB Dental Clinic Logo" 
              className="h-16 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-white/[0.03] border border-white/10 backdrop-blur-md rounded-full px-5 py-2.5 space-x-1.5 shadow-xl">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'bg-[#7FD856] text-black shadow-md shadow-[#7FD856]/15' 
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href="https://wa.me/256752001269?text=Hey%20Doctor,%20I%20need%20to%20inquire..."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] font-bold transition-all duration-300 hover:scale-105 rounded-full px-6 py-2.5 text-xs">
                Book Appointment
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white hover:text-[#7FD856] transition-colors"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0F0F0F]/98 backdrop-blur-md"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block py-3 px-4 rounded-lg transition-all duration-300 ${
                    location.pathname === item.path 
                      ? 'bg-[#7FD856] text-black font-semibold' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <a
                href="https://wa.me/256752001269?text=Hey%20Doctor,%20I%20need%20to%20inquire..."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Button className="w-full bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold mt-4">
                  Book Appointment
                </Button>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
