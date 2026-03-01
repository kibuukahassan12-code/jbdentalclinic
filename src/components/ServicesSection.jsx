
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Stethoscope, Sparkles, Smile, Bone, Activity, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';

const ServicesSection = () => {
  const shouldReduceMotion = useReducedMotion();

  const services = useMemo(() => [
    {
      icon: Stethoscope,
      title: 'General Dentistry',
      description: 'Regular checkups and cleanings to maintain optimal oral health for the whole family.',
    },
    {
      icon: Sparkles,
      title: 'Cosmetic Dentistry',
      description: 'Enhance your smile with our professional whitening, veneers, and bonding services.',
    },
    {
      icon: Smile,
      title: 'Orthodontics',
      description: 'Modern braces and aligners to straighten teeth for both children and adults.',
    },
    {
      icon: Bone,
      title: 'Dental Implants',
      description: 'Restore missing teeth with durable, natural-looking implants tailored to you.',
    },
    {
      icon: Activity,
      title: 'Root Canal Treatment',
      description: 'Painless procedures to treat infected teeth and save your natural smile.',
    },
    {
      icon: Zap,
      title: 'Teeth Whitening',
      description: 'Safe and effective whitening treatments for a brighter, more confident smile.',
    },
  ], []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0F0F0F] to-black/50">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="Our Services"
          subtitle="Comprehensive dental care solutions tailored to the needs of our Ugandan patients"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }}
              className="group bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 border-l-4 border-[#7FD856] hover:shadow-2xl hover:shadow-[#7FD856]/20 transition-all duration-300 hover:scale-105"
            >
              <div className="w-16 h-16 bg-[#7FD856]/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#7FD856]/20 transition-colors">
                <service.icon className="text-[#7FD856]" size={32} />
              </div>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {service.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
                {service.description}
              </p>
              <Link to="/services" className="text-[#7FD856] font-semibold hover:underline inline-flex items-center group/link">
                Learn More
                <span className="ml-2 group-hover/link:translate-x-1 transition-transform">→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
