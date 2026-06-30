
import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, HeartHandshake } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const FounderSection = () => {
  return (
    <section className="relative overflow-hidden bg-black/40 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      {/* Decorative Elements */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#7FD856]/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-20">
          
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
                   src="/images/hero-carousel-5.png" 
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
                 Clinical Leadership
               </span>
               <h2 className="mb-5 text-3xl font-bold leading-tight text-white sm:mb-6 md:text-4xl lg:text-5xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                 Built on Trust, <br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7FD856] to-emerald-400">Driven by Results</span>
               </h2>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-gray-300 sm:space-y-5 sm:text-lg">
               <p>
                 Our leadership team focuses on one promise: every patient receives clear guidance, safe treatment, and modern dental care delivered with genuine compassion.
               </p>
               <p>
                 We continuously improve our systems, training, and technology so families in Makindye and greater Kampala can access reliable, world-class dentistry close to home.
               </p>
            </div>

            {/* Credentials / Highlights */}
            <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-6">
               <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 transition-colors hover:border-[#7FD856]/30 sm:gap-4">
                  <div className="rounded-lg bg-[#7FD856]/10 p-2 text-[#7FD856]">
                    <GraduationCap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Expertise</h4>
                    <p className="text-sm text-gray-400">General, restorative, and advanced clinical dentistry</p>
                  </div>
               </div>

               <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 transition-colors hover:border-[#7FD856]/30 sm:gap-4">
                  <div className="rounded-lg bg-[#7FD856]/10 p-2 text-[#7FD856]">
                    <Award size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Excellence</h4>
                    <p className="text-sm text-gray-400">Modern equipment and evidence-based treatment standards</p>
                  </div>
               </div>

               <div className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-zinc-800/30 p-4 transition-colors hover:border-[#7FD856]/30 sm:col-span-2 sm:gap-4">
                  <div className="rounded-lg bg-[#7FD856]/10 p-2 text-[#7FD856]">
                    <HeartHandshake size={20} />
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
