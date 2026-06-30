
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const TeamShowcase = () => {
  return (
    <section className="relative overflow-hidden bg-zinc-900/50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      {/* Decorative background glow */}
      <div className="absolute right-0 bottom-0 w-1/3 h-full bg-[#7FD856]/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          
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
                src="/images/hero-carousel-2.png"
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

            <h2 className="mb-5 text-3xl font-bold leading-tight text-white sm:mb-6 md:text-4xl lg:text-5xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Dedicated to Your <br />
              <span className="text-[#7FD856]">Perfect Smile</span>
            </h2>

            <p className="mb-4 text-base leading-relaxed text-gray-300 sm:mb-6 sm:text-lg">
              Our team combines specialist skill, empathy, and clear communication so you always understand your treatment options and next steps.
            </p>

            <p className="mb-6 leading-relaxed text-gray-400 sm:mb-8">
              From reception to clinical care, we are committed to a calm, professional experience built around your comfort and long-term oral health.
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
                  className="flex items-center gap-2.5 sm:gap-3"
                >
                  <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#7FD856]/20">
                    <CheckCircle2 size={13} className="text-[#7FD856]" />
                  </div>
                  <span className="text-sm text-gray-200 sm:text-base">{item}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 sm:mt-8">
              <Link to="/team">
                <Button
                  variant="outline"
                  className="w-full border-white/20 px-6 py-3 font-semibold text-white hover:bg-white hover:text-black sm:w-auto"
                >
                  Meet Full Team
                </Button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default TeamShowcase;
