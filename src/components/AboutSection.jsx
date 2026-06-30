
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const AboutSection = () => {
  const stats = [
    { icon: Calendar, number: '10+', label: 'Years in Kampala' },
    { icon: Users, number: '5,000+', label: 'Happy Patients' },
    { icon: Building2, number: '1', label: 'Premium Facility' },
  ];

  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 items-center gap-8 sm:gap-12 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="group relative h-[320px] overflow-hidden rounded-2xl sm:h-[420px] lg:h-[500px]"
          >
            <LazyImage
              src="/images/cta-dental-bg.png"
              alt="JB Dental Clinic reception area in Makindye, Kampala"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <div className="h-1 w-16 bg-[#7FD856] rounded-full"></div>
            </div>
            <h2 className="mb-4 text-3xl font-bold sm:mb-6 sm:text-4xl md:text-5xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
              About JB Dental Clinic
            </h2>
            <p className="text-gray-400 leading-relaxed mb-6" style={{ fontFamily: "'Inter', sans-serif" }}>
              Since opening our doors in Makindye, JB Dental Clinic has been dedicated to providing exceptional dental care to the Kampala community. 
              Our state-of-the-art facility combines international standards with local hospitality.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Our team of experienced Ugandan professionals is committed to your oral health, offering personalized 
              treatment plans that address your unique needs.
            </p>

            {/* Stats */}
            <div className="mb-8 grid grid-cols-3 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-[#7FD856]/10 sm:h-12 sm:w-12">
                    <stat.icon className="text-[#7FD856]" size={20} />
                  </div>
                  <div className="mb-1 text-xl font-bold text-[#7FD856] sm:text-2xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-gray-400 sm:text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="https://wa.me/256752001269?text=Hey%20Doctor,%20I%20need%20to%20inquire..."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full bg-[#7FD856] px-6 py-5 text-base font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-[#6FC745] sm:w-auto sm:px-8 sm:py-6 sm:text-lg">
                  Book Appointment
                </Button>
              </a>
              <Link to="/services">
                <Button
                  variant="outline"
                  className="w-full border-white/20 px-6 py-5 text-base font-semibold text-white transition-all duration-300 hover:bg-white hover:text-black sm:w-auto sm:px-8 sm:py-6 sm:text-lg"
                >
                  View Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
