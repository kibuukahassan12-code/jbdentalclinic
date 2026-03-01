
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Quote, ArrowRight } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const ServiceDetailLayout = ({
  title,
  description,
  images = [],
  procedure = [],
  benefits = [],
  testimonial,
  whyChooseUs
}) => {
  return (
    <>
      <Helmet>
        <title>{title} - JB Dental Clinic Kampala</title>
        <meta name="description" content={description} />
      </Helmet>

      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Back Link */}
          <Link 
            to="/services" 
            className="inline-flex items-center text-[#7FD856] hover:text-[#6FC745] mb-8 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Services
          </Link>

          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-['Poppins']">{title}</h1>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {description}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={`/appointment?service=${encodeURIComponent(title)}`}>
                  <Button className="w-full sm:w-auto bg-[#7FD856] text-black hover:bg-[#6FC745] text-lg py-6 px-8 rounded-xl shadow-[0_0_20px_rgba(127,216,86,0.3)] hover:scale-105 transition-all">
                    Book Appointment Now
                  </Button>
                </Link>
                <Link to="/contact">
                   <Button variant="outline" className="w-full sm:w-auto border-white/20 hover:bg-white/10 text-lg py-6 px-8 rounded-xl">
                    Ask a Question
                  </Button>
                </Link>
              </div>
            </motion.div>

            {/* Hero Images Stack - Modified Layout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-6 items-center justify-center"
            >
              {images[0] && (
                <div className="w-[70%] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <LazyImage 
                    src={images[0].src} 
                    alt={images[0].alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    style={{ objectPosition: images[0].objectPosition || 'center' }}
                  />
                </div>
              )}
              {images[1] && (
                <div className="w-[70%] aspect-video rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                  <LazyImage 
                    src={images[1].src} 
                    alt={images[1].alt}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                    style={{ objectPosition: images[1].objectPosition || 'center' }}
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Procedure & Benefits */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
            {/* Procedure Steps */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-8 flex items-center">
                <span className="w-2 h-8 bg-[#7FD856] rounded-full mr-4"></span>
                The Procedure
              </h2>
              <div className="space-y-6">
                {procedure.map((step, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-6 p-6 rounded-xl bg-white/5 border border-white/10 hover:border-[#7FD856]/30 transition-colors"
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#7FD856]/20 flex items-center justify-center text-[#7FD856] font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{step.title}</h3>
                      <p className="text-gray-400">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Benefits List */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Benefits</h2>
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0F0F0F] p-8 rounded-2xl border border-white/10">
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle2 className="w-5 h-5 text-[#7FD856] flex-shrink-0 mt-1" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Why Choose Us & Testimonial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-[#7FD856] text-black"
            >
              <h3 className="text-2xl font-bold mb-4">Why Choose JB Dental?</h3>
              <p className="leading-relaxed font-medium opacity-90">
                {whyChooseUs}
              </p>
              <Link to="/appointment" className="inline-flex items-center mt-6 font-bold hover:translate-x-2 transition-transform">
                Book Consultation <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>

            {testimonial && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 relative"
              >
                <Quote className="absolute top-6 left-6 text-[#7FD856]/20 w-16 h-16" />
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <p className="text-xl italic text-gray-300 mb-6 text-center">
                    "{testimonial.quote}"
                  </p>
                  <p className="text-[#7FD856] font-bold text-center">— {testimonial.author}</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="text-center bg-gradient-to-r from-[#7FD856]/10 via-transparent to-[#7FD856]/10 rounded-3xl p-12 border border-[#7FD856]/20">
            <h2 className="text-3xl font-bold mb-6">Ready to Improve Your Smile?</h2>
            <Link to={`/appointment?service=${encodeURIComponent(title)}`}>
              <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] text-lg py-6 px-10 rounded-xl shadow-[0_0_20px_rgba(127,216,86,0.3)] hover:scale-105 transition-all">
                Book Your {title} Appointment
              </Button>
            </Link>
          </div>

        </div>
      </div>
    </>
  );
};

export default ServiceDetailLayout;
