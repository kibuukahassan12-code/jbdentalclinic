
import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, HeartHandshake } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const FounderSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/40 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#7FD856]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Image Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-1 lg:order-1"
          >
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 group hover:border-[#7FD856]/50 transition-all duration-500">
              <div className="aspect-[4/5] relative">
                 <LazyImage 
                   src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/d65d15850a56132b973fd6d4ed7a5ba5.jpg" 
                   alt="Dr. JB Mubiru, Founder & CEO of JB Dental Clinic" 
                   className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none"></div>
              </div>
              
              {/* Floating Name Card on Image */}
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-zinc-900/90 backdrop-blur-md rounded-xl border border-zinc-700 shadow-xl z-20">
                 <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>Dr. JB Mubiru</h3>
                 <p className="text-[#7FD856] text-sm font-medium tracking-wide">FOUNDER & CEO</p>
              </div>
            </div>
            
            {/* Background Accent */}
            <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#7FD856]/20 rounded-2xl -z-10"></div>
          </motion.div>

          {/* Content Column */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-2"
          >
            <div className="mb-6">
               <span className="inline-block px-4 py-1.5 rounded-full bg-[#7FD856]/10 text-[#7FD856] font-semibold text-sm mb-4 border border-[#7FD856]/20">
                 Visionary Leadership
               </span>
               <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                 Building a Legacy of <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7FD856] to-emerald-400">Excellence in Dentistry</span>
               </h2>
            </div>

            <div className="space-y-6 text-gray-300 leading-relaxed font-light text-lg">
               <p>
                 "At JB Dental Clinic, our mission goes beyond treating teeth; it's about restoring confidence and enhancing the quality of life for every patient we serve. My journey in dentistry has always been driven by a singular passion: to merge compassionate care with the precision of modern technology."
               </p>
               <p>
                 With over a decade of experience in the field, Dr. JB Mubiru founded this clinic to create a space where patients feel heard, valued, and safe. We believe that world-class dental care should be accessible, and we are committed to staying at the forefront of dental innovation to ensure the best possible outcomes for our community.
               </p>
            </div>

            {/* Credentials / Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
               <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-[#7FD856]/30 transition-colors">
                  <div className="p-2 bg-[#7FD856]/10 rounded-lg text-[#7FD856]">
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Expertise</h4>
                    <p className="text-sm text-gray-400">Advanced Clinical Dentistry & Oral Surgery</p>
                  </div>
               </div>

               <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-[#7FD856]/30 transition-colors">
                  <div className="p-2 bg-[#7FD856]/10 rounded-lg text-[#7FD856]">
                    <Award size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Excellence</h4>
                    <p className="text-sm text-gray-400">Certified in Modern Dental Technologies</p>
                  </div>
               </div>

               <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/30 border border-zinc-800 hover:border-[#7FD856]/30 transition-colors sm:col-span-2">
                  <div className="p-2 bg-[#7FD856]/10 rounded-lg text-[#7FD856]">
                    <HeartHandshake size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Philosophy</h4>
                    <p className="text-sm text-gray-400">Patient-centered approach focused on comfort, integrity, and long-term oral health.</p>
                  </div>
               </div>
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
