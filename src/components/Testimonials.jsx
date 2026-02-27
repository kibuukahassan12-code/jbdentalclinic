
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      name: 'Grace Nankya',
      title: 'Business Owner',
      image: 'https://images.unsplash.com/photo-1674775372047-27fb6492c9a2',
      rating: 5,
      text: 'Dr. Kamau transformed my smile completely! I used to be shy about my teeth, but JB Dental Clinic in Makindye gave me my confidence back.',
      company: 'Kampala'
    },
    {
      name: 'Moses Ochieng',
      title: 'IT Specialist',
      image: 'https://images.unsplash.com/photo-1660732205495-f65510d8180e',
      rating: 5,
      text: 'Best dental experience I\'ve ever had in Uganda. The equipment is modern and the staff is very professional. Highly recommend.',
      company: 'Entebbe'
    },
    {
      name: 'Sarah Akello',
      title: 'Teacher',
      image: 'https://images.unsplash.com/photo-1679136287096-cb864ebf9b10',
      rating: 5,
      text: 'My children love coming here for their checkups. Dr. Sarah is so patient with them. It\'s great to have such a quality clinic in our neighborhood.',
      company: 'Makindye'
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black/50 to-[#0F0F0F]">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          title="What Our Patients Say"
          subtitle="Feedback from our happy patients in Uganda"
        />

        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 relative"
            >
              <Quote className="absolute top-8 right-8 text-[#7FD856]/20" size={64} />
              
              <div className="flex items-center mb-8">
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="w-20 h-20 rounded-full object-cover mr-6 border-4 border-[#7FD856]/20"
                />
                <div>
                  <h4 className="text-xl font-bold mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-gray-400 mb-2">{testimonials[currentIndex].title}</p>
                  <div className="flex space-x-1">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="text-[#7FD856] fill-[#7FD856]" size={18} />
                    ))}
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-lg leading-relaxed mb-8 relative z-10" style={{ fontFamily: "'Inter', sans-serif" }}>
                "{testimonials[currentIndex].text}"
              </p>

              <div className="w-auto inline-block px-4 py-2 bg-[#7FD856]/10 rounded-full">
                <span className="text-[#7FD856] font-bold text-sm">
                  {testimonials[currentIndex].company}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white/5 hover:bg-[#7FD856]/20 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#7FD856]/40"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="text-white" size={24} />
            </button>

            {/* Dots */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex ? 'bg-[#7FD856] w-8' : 'bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white/5 hover:bg-[#7FD856]/20 rounded-full flex items-center justify-center transition-all duration-300 border border-white/10 hover:border-[#7FD856]/40"
              aria-label="Next testimonial"
            >
              <ChevronRight className="text-white" size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
