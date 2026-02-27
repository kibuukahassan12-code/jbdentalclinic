
import React from 'react';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, centered = true }) => {
  return (
    <motion.div
      className={`mb-12 ${centered ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className={`flex items-center ${centered ? 'justify-center' : ''} mb-4`}>
        <div className="h-1 w-16 bg-[#7FD856] rounded-full"></div>
      </div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-lg max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
