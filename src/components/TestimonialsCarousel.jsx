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
    treatment: 'Orthodontic Review',
    period: 'March 2026',
    text: "I used to be terrified of the dentist, but the team at JB Dental changed that completely. They are so gentle and explain everything clearly. My smile has never looked better!",
  },
  {
    id: 2,
    name: 'David Musoke',
    rating: 5,
    treatment: 'Root Canal Treatment',
    period: 'February 2026',
    text: "World-class facility right here in Kampala. I went in for a root canal and was surprised by how painless the procedure was. Highly recommended for anyone needing specialized care.",
  },
  {
    id: 3,
    name: 'Grace Namukasa',
    rating: 5,
    treatment: 'Cosmetic Dentistry',
    period: 'January 2026',
    text: "The cosmetic dentistry results are amazing. I got veneers done and it has completely transformed my confidence. Professional, clean, and worth every shilling.",
  },
  {
    id: 4,
    name: 'Michael Okello',
    rating: 5,
    treatment: 'Pediatric Dental Check-up',
    period: 'December 2025',
    text: "Brought my children for their first dental check-up. The pediatric team made them feel so comfortable—no tears! Now they actually look forward to visiting the dentist.",
  },
  {
    id: 5,
    name: 'Rita Nalwadda',
    rating: 5,
    treatment: 'Emergency Dental Care',
    period: 'November 2025',
    text: "Emergency appointment on a Saturday—they squeezed me in and fixed my broken tooth the same day. Grateful for such responsive care in Makindye.",
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
    <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#7FD856] rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <SectionHeader 
          title="What Our Patients Say" 
          subtitle="Don't just take our word for it. Here is what our community has to say about their experience."
        />

        <div className="relative mt-10 rounded-2xl border border-zinc-800 bg-zinc-900/80 p-5 shadow-2xl backdrop-blur-md sm:mt-12 sm:p-8 md:p-12">
           <div className="absolute left-4 top-4 text-[#7FD856]/20 sm:left-8 sm:top-6">
             <Quote size={40} className="sm:h-16 sm:w-16" />
           </div>

           <div className="relative flex min-h-[280px] items-center justify-center sm:min-h-[220px]">
             <AnimatePresence mode='wait'>
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4 }}
                  className="text-center w-full"
                >
                  <div className="mb-4 flex justify-center gap-1 sm:mb-6">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="fill-[#7FD856] text-[#7FD856]" size={20} />
                    ))}
                  </div>
                  <p className="mb-5 text-base italic leading-relaxed text-gray-200 sm:mb-6 sm:text-lg md:text-xl">
                    "{testimonials[currentIndex].text}"
                  </p>
                  <h4 className="text-lg font-bold text-[#7FD856] sm:text-xl" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="mt-2 text-sm text-gray-400">
                    {testimonials[currentIndex].treatment} • {testimonials[currentIndex].period}
                  </p>
                </motion.div>
             </AnimatePresence>
           </div>

           {/* Navigation Buttons */}
           <div className="mt-6 flex justify-center gap-3 sm:mt-8 sm:gap-4">
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