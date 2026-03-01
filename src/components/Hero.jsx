
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <LazyImage
          src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/bef0b21f8bc0901824dc23ae3b409144.png"
          alt="Two African dentists in white coats and blue gloves providing dental treatment to a patient in a dental chair with modern equipment visible"
          className="w-full h-full"
          placeholderColor="bg-[#0F0F0F]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/80 z-10"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "'Poppins', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            JB Dental Clinic
          </motion.h1>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto"
            style={{ fontFamily: "'Inter', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Excellence in Dental Care for Kampala
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link to="/appointment">
              <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#7FD856]/50">
                Book Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-black font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105"
              >
                Our Services
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        <ChevronDown className="text-white" size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
