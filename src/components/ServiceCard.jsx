
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import LazyImage from '@/components/LazyImage';

const ServiceCard = ({ title, description, icon: Icon, image, slug, index, isExclusive = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className={`group relative overflow-hidden rounded-2xl border ${isExclusive ? 'border-[#C19A6B] bg-gradient-to-b from-[#C19A6B]/5 to-transparent' : 'border-white/10 bg-white/5'} hover:border-[#7FD856]/50 transition-colors duration-500`}
    >
      {/* Exclusive Badge */}
      {isExclusive && (
        <div className="absolute top-4 right-4 z-20 flex items-center bg-[#C19A6B] text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          <Star size={12} className="mr-1 fill-black" /> EXCLUSIVE
        </div>
      )}

      {/* Image Section */}
      <div className="h-48 overflow-hidden relative bg-zinc-900 border-b border-white/10">
        {image ? (
          <>
            <LazyImage 
              src={image} 
              alt={title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Subtle gradient overlay to blend image bottom with card body */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/50 via-transparent to-transparent pointer-events-none"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-t from-zinc-900 to-zinc-800/50 flex items-center justify-center">
             <Icon size={48} className="text-gray-600 opacity-20" />
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-6 relative z-10">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg backdrop-blur-sm -mt-10 relative z-20 ${isExclusive ? 'bg-[#C19A6B] text-black' : 'bg-[#7FD856] text-black'}`}>
          <Icon size={24} />
        </div>
        
        <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#7FD856] transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-400 mb-6 text-sm leading-relaxed line-clamp-3">
          {description}
        </p>
        
        <div className="flex gap-2">
          <Link 
            to={`/services/${slug}`}
            className="flex-1 inline-flex items-center justify-center text-sm font-semibold text-white bg-white/5 hover:bg-white/10 py-3 rounded-lg transition-all"
          >
            Learn More
          </Link>
          <Link 
            to={`/appointment?service=${encodeURIComponent(title)}`}
            className={`flex-1 inline-flex items-center justify-center text-sm font-semibold text-black py-3 rounded-lg transition-all hover:scale-105 ${isExclusive ? 'bg-[#C19A6B] hover:bg-[#D4AF80]' : 'bg-[#7FD856] hover:bg-[#6FC745]'}`}
          >
            Book Now
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ServiceCard;
