import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Akello',
    rating: 5,
    text: "I used to be terrified of the dentist, but the team at JB Dental changed that completely. They are so gentle and explain everything clearly. My smile has never looked better!",
  },
  {
    id: 2,
    name: 'David Musoke',
    rating: 5,
    text: "World-class facility right here in Kampala. I went in for a root canal and was surprised by how painless the procedure was. Highly recommended for anyone needing specialized care.",
  },
  {
    id: 3,
    name: 'Grace Namukasa',
    rating: 5,
    text: "The cosmetic dentistry results are amazing. I got veneers done and it has completely transformed my confidence. Professional, clean, and worth every shilling.",
  },
];

const TestimonialsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7FD856] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader 
          title="What Our Patients Say" 
          subtitle="Don't just take our word for it. Here is what our community has to say about their experience."
        />

        <div className="relative mt-12 bg-zinc-900/80 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-zinc-800 shadow-2xl">
           <div className="absolute top-6 left-8 text-[#7FD856]/20">
             <Quote size={64} />
           </div>

           <div className="relative h-[250px] sm:h-[200px] flex items-center justify-center">
             <AnimatePresence mode='wait'>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center w-full"
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="fill-[#7FD856] text-[#7FD856]" size={20} />
                    ))}
                  </div>
                  <p className="text-lg md:text-xl text-gray-200 italic mb-6 leading-relaxed font-light">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <h4 className="text-xl font-bold text-[#7FD856]" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {testimonials[currentIndex].name}
                  </h4>
                </motion.div>
             </AnimatePresence>
           </div>

           {/* Navigation Buttons */}
           <div className="flex justify-center gap-4 mt-8">
             <Button
               variant="outline"
               size="icon"
               onClick={prevSlide}
               className="rounded-full border-zinc-700 hover:bg-[#7FD856] hover:text-black hover:border-[#7FD856] transition-all"
             >
               <ChevronLeft size={20} />
             </Button>
             <Button
               variant="outline"
               size="icon"
               onClick={nextSlide}
               className="rounded-full border-zinc-700 hover:bg-[#7FD856] hover:text-black hover:border-[#7FD856] transition-all"
             >
               <ChevronRight size={20} />
             </Button>
           </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;