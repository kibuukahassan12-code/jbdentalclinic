
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import LazyImage from '@/components/LazyImage';

const TeamShowcase = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute right-0 bottom-0 w-1/3 h-full bg-[#7FD856]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative group"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-[#7FD856]/20 to-transparent rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 group-hover:border-[#7FD856]/30 transition-all duration-500">
              <LazyImage
                src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/9f9841477ad13c65f51a140f74192a6e.jpg"
                alt="The professional dental team at JB Dental Clinic"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>
          </motion.div>

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7FD856]/10 text-[#7FD856] text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7FD856] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7FD856]"></span>
              </span>
              Meet Our Team
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Dedicated to Your <br />
              <span className="text-[#7FD856]">Perfect Smile</span>
            </h2>

            <p className="text-gray-300 text-lg leading-relaxed mb-6 font-light">
              Welcome to JB Dental Clinic. We are more than just a dental practice; we are a family of passionate professionals committed to redefining your dental experience. 
            </p>

            <p className="text-gray-400 leading-relaxed mb-8">
              Our diverse team brings together years of international experience and local expertise. We believe that exceptional care starts with listening. From the moment you walk through our doors, our goal is to make you feel comfortable, understood, and confident in your treatment plan. We combine cutting-edge technology with a gentle, human touch to ensure the best possible outcomes for you and your loved ones.
            </p>

            <div className="space-y-4">
              {[
                "Highly Qualified & Experienced Professionals",
                "Patient-Centered, Gentle Approach",
                "Continuous Training in Modern Dentistry"
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (index * 0.1) }}
                  className="flex items-center gap-3"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#7FD856]/20 flex items-center justify-center">
                    <CheckCircle2 size={14} className="text-[#7FD856]" />
                  </div>
                  <span className="text-gray-200">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TeamShowcase;
