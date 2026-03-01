
import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Stethoscope, Sparkles, Activity, Hammer, Smile, Bus as Ambulance, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const ServicesGrid = () => {
  const shouldReduceMotion = useReducedMotion();

  const services = useMemo(() => [
    {
      icon: Stethoscope,
      title: 'General Dentistry',
      slug: 'general-dentistry',
      description: 'Comprehensive checkups, cleanings, and preventative care to keep your smile healthy and bright.',
    },
    {
      icon: Sparkles,
      title: 'Cosmetic Dentistry',
      slug: 'cosmetic-dentistry',
      description: 'Transform your smile with veneers, bonding, and aesthetic treatments designed for you.',
    },
    {
      icon: Activity,
      title: 'Orthodontics',
      slug: 'orthodontics',
      description: 'Straighten your teeth and correct bite issues with modern braces and clear aligners.',
    },
    {
      icon: Hammer,
      title: 'Dental Implants',
      slug: 'dental-implants',
      description: 'Permanent, natural-looking solutions for missing teeth that restore function and confidence.',
    },
    {
      icon: Smile,
      title: 'Teeth Whitening',
      slug: 'teeth-whitening',
      description: 'Professional whitening treatments to remove stains and brighten your smile safely.',
    },
    {
      icon: Ambulance,
      title: 'Emergency Care',
      slug: 'emergency-dental',
      description: 'Immediate attention for dental emergencies including toothaches, trauma, and infections.',
    },
  ], []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Our Premium Services" 
          subtitle="World-class dental treatments tailored to your unique needs using the latest technology."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: shouldReduceMotion ? 0 : index * 0.1 }}
              whileHover={{ y: shouldReduceMotion ? 0 : -5 }}
              className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-xl overflow-hidden border border-zinc-800 hover:border-[#7FD856]/50 transition-all duration-300 shadow-lg hover:shadow-[#7FD856]/10 flex flex-col p-6" // Added padding here
            >
              {/* Icon Section - now at the top */}
              <div className="mb-4 w-12 h-12 bg-zinc-900/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-zinc-700 group-hover:border-[#7FD856] group-hover:bg-[#7FD856] transition-all duration-300">
                <service.icon className="text-[#7FD856] group-hover:text-black transition-colors duration-300" size={24} />
              </div>

              {/* Content Section */}
              <div className="flex flex-col flex-grow">
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#7FD856] transition-colors duration-300 font-['Poppins']">
                  {service.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-sm mb-6 flex-grow">
                  {service.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <Link 
                    to={`/services/${service.slug}`} 
                    className="text-sm font-semibold text-white hover:text-[#7FD856] flex items-center gap-2 transition-colors"
                  >
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesGrid;
