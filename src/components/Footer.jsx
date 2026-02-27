
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/team' },
    { name: 'Contact', path: '/contact' },
    { name: 'Book Appointment', path: '/appointment' },
  ];

  const services = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Dental Implants',
    'Root Canal',
    'Teeth Whitening',
  ];


  return (
    <footer className="bg-black/50 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <img 
              src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f51b96d62e1c9d03d4878cf068f6e99e.png" 
              alt="JB Dental Clinic Logo" 
              className="h-16 w-auto object-contain"
            />
            <p className="text-gray-400 text-sm leading-relaxed">
              Providing exceptional dental care to the Kampala community with state-of-the-art technology and a patient-focused approach in Makindye.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#7FD856] transition-colors duration-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Our Services</h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    to="/services"
                    className="text-gray-400 hover:text-[#7FD856] transition-colors duration-300 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin size={18} className="text-[#7FD856] mt-0.5 shrink-0" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Makindye+Climax+Bar+Kampala+Uganda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-[#7FD856] transition-colors"
                >
                  Kampala, Makindye, opposite Climax Bar, Uganda
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} className="text-[#7FD856] shrink-0" />
                <a
                  href="tel:+256752001269"
                  className="text-gray-400 hover:text-[#7FD856] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
                >
                  +256 752 001269
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} className="text-[#7FD856] shrink-0" />
                <a href="mailto:info@jbdental.ug" className="text-gray-400 hover:text-[#7FD856] transition-colors">
                  info@jbdental.ug
                </a>
              </li>
              <li className="flex items-start space-x-3 text-sm">
                <Clock size={18} className="text-[#7FD856] mt-0.5 shrink-0" />
                <div className="text-gray-400">
                  <p>Mon-Fri: 8:00 AM - 7:00 PM</p>
                  <p>Sat: 9:00 AM - 5:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2026 JB Dental Clinic Kampala. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-[#7FD856] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-[#7FD856] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
