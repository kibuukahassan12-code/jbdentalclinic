
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Users, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const AboutSection = () => {
  const stats = [
    { icon: Calendar, number: '10+', label: 'Years in Kampala' },
    { icon: Users, number: '5,000+', label: 'Happy Patients' },
    { icon: Building2, number: '1', label: 'Premium Facility' },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative rounded-2xl overflow-hidden h-[500px] group"
          >
            <LazyImage
              src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/9037cc5d69411495fae23d2383d60e5a.jpg"
              alt="Professional JB Dental Clinic reception area with green neon branding, modern shelving with ambient lighting, reception desk with dark wood and white finishes, and green accent ceiling lighting"
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
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
            <div className="grid grid-cols-3 gap-4 mb-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-[#7FD856]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="text-[#7FD856]" size={24} />
                  </div>
                  <div className="text-2xl font-bold text-[#7FD856] mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {stat.number}
                  </div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>

            <Link to="/appointment">
              <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105">
                Book Appointment
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
