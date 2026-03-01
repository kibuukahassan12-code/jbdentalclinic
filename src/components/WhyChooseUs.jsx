import React from 'react';
import { motion } from 'framer-motion';
import { Microscope, Users, Heart, Wallet } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const features = [
  {
    icon: Microscope,
    title: 'Modern Equipment',
    description: 'We utilize state-of-the-art dental technology to ensure precise diagnoses and comfortable treatments.',
  },
  {
    icon: Users,
    title: 'Experienced Team',
    description: 'Our dentists are highly qualified professionals with years of experience in various dental specialties.',
  },
  {
    icon: Heart,
    title: 'Patient-Centered Care',
    description: 'We prioritize your comfort and listen to your concerns to create a personalized treatment plan.',
  },
  {
    icon: Wallet,
    title: 'Affordable Pricing',
    description: 'Premium dental care shouldn’t break the bank. We offer competitive pricing and flexible payment options.',
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-zinc-900">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          title="Why Choose JB Dental" 
          subtitle="Experience the difference of a clinic that puts your health and comfort first."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 bg-[#7FD856]/20 rounded-full animate-pulse"></div>
                <div className="relative flex items-center justify-center w-full h-full bg-zinc-800 rounded-full border border-[#7FD856]/30">
                  <feature.icon className="text-[#7FD856]" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;