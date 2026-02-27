
import React from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { Calendar, Clock, User } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';

const WHATSAPP_URL = 'https://wa.me/256752001269?text=Hey%20Doctor,%20I%20need%20to%20inquire...';

const Appointment = () => {
  return (
    <>
      <SEO
        title="Book Appointment"
        path="/appointment"
        description="Book a dental appointment at JB Dental Clinic, Makindye Kampala, via WhatsApp. Quick confirmation. Open Mon–Sat."
      />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Book Your Appointment"
            subtitle="Chat with us on WhatsApp to book your visit. We'll confirm your slot quickly."
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl text-center"
          >
            <p className="text-gray-300 text-lg mb-8">
              Click below to open a chat with JB Dental Clinic on WhatsApp. Send your name, preferred date and time, and we'll confirm your appointment.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold py-6 px-10 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#7FD856]/50">
                Book Appointment via WhatsApp
              </Button>
            </a>
          </motion.div>

          {/* Information Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <div className="bg-gradient-to-br from-[#7FD856]/10 to-transparent rounded-xl p-6 border border-[#7FD856]/20 text-center">
              <Calendar className="text-[#7FD856] mx-auto mb-3" size={32} />
              <h4 className="font-semibold mb-2">Open 6 Days/Week</h4>
              <p className="text-gray-400 text-sm">Mon-Fri 8am-7pm, Sat 9am-5pm</p>
            </div>
            <div className="bg-gradient-to-br from-[#7FD856]/10 to-transparent rounded-xl p-6 border border-[#7FD856]/20 text-center">
              <Clock className="text-[#7FD856] mx-auto mb-3" size={32} />
              <h4 className="font-semibold mb-2">Fast Booking</h4>
              <p className="text-gray-400 text-sm">Confirmation within hours</p>
            </div>
            <div className="bg-gradient-to-br from-[#7FD856]/10 to-transparent rounded-xl p-6 border border-[#7FD856]/20 text-center">
              <User className="text-[#7FD856] mx-auto mb-3" size={32} />
              <h4 className="font-semibold mb-2">Expert Care</h4>
              <p className="text-gray-400 text-sm">Experienced Ugandan dentists</p>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Appointment;
