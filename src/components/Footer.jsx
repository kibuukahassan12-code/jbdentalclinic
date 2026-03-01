
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react';

const Footer = () => {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Team', path: '/team' },
    { name: 'Appointment', path: '/appointment' },
  ];

  const services = [
    'General Dentistry',
    'Cosmetic Dentistry',
    'Orthodontics',
    'Dental Implants',
    'Root Canal',
    'Teeth Whitening',
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
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
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-[#7FD856] hover:text-black transition-all duration-300"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-[#7FD856] transition-colors duration-300 text-sm"
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
                    className="text-gray-400 hover:text-[#7FD856] transition-colors duration-300 text-sm"
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
                <span className="text-gray-400">Kampala, Makindye, opposite Climax Bar, Uganda</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone size={18} className="text-[#7FD856] shrink-0" />
                <span className="text-gray-400">+256 752 001269</span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail size={18} className="text-[#7FD856] shrink-0" />
                <span className="text-gray-400">info@jbdental.ug</span>
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
              <a href="#" className="text-gray-400 hover:text-[#7FD856] transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-[#7FD856] transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
