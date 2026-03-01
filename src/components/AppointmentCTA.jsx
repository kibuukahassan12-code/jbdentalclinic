import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CalendarCheck } from 'lucide-react';

const AppointmentCTA = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 to-black z-0"></div>
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 z-0"></div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l from-[#7FD856]/10 to-transparent z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          
          <div className="flex-1 text-center lg:text-left">
             <motion.h2 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6 }}
               className="text-4xl md:text-5xl font-bold text-white mb-6"
               style={{ fontFamily: "'Poppins', sans-serif" }}
             >
               Ready to Transform <br/>
               <span className="text-[#7FD856]">Your Smile?</span>
             </motion.h2>
             
             <motion.p 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.6, delay: 0.1 }}
               className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto lg:mx-0"
             >
               Don't wait for dental problems to worsen. Schedule your visit today and experience the JB Dental difference. New patients are always welcome!
             </motion.p>
             
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
             >
                <Link to="/appointment">
                  <Button className="bg-[#7FD856] text-black hover:bg-[#6ed344] font-bold py-8 px-10 text-xl rounded-full shadow-lg shadow-[#7FD856]/20 transition-all hover:scale-105">
                    <CalendarCheck className="mr-3" size={28}/>
                    Book Your Appointment
                  </Button>
                </Link>
             </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block relative"
          >
             {/* Abstract visual element */}
             <div className="w-80 h-80 border-4 border-[#7FD856]/30 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border-4 border-dashed border-[#7FD856]/20 rounded-full animate-spin-slow" style={{ animationDuration: '20s' }}></div>
                <div className="w-60 h-60 bg-[#7FD856]/10 rounded-full backdrop-blur-sm flex items-center justify-center">
                   <CalendarCheck className="text-[#7FD856]" size={100} strokeWidth={1} />
                </div>
             </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default AppointmentCTA;