import React from 'react';
import SEO from '@/components/SEO';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Award, Shield, Heart, MessageCircle } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/LazyImage';

const WHATSAPP_URL = 'https://wa.me/256752001269?text=Hey%20Doctor,%20I%20need%20to%20inquire...';
const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=Makindye+Climax+Bar+Kampala+Uganda';

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Clinic',
      content: 'Kampala, Makindye\nOpposite Climax Bar, Uganda',
      href: MAPS_URL,
      label: 'Get directions',
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+256 752 001269',
      href: 'tel:+256752001269',
      label: null,
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@jbdental.ug',
      href: 'mailto:info@jbdental.ug',
      label: 'Email us',
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      content: 'Mon-Fri: 8:00 AM - 7:00 PM\nSat: 9:00 AM - 5:00 PM\nSun: Closed',
    },
  ];

  const trustBadges = [
    { icon: Award, text: 'Uganda Medical Board Certified' },
    { icon: Shield, text: 'Modern Sterilization' },
    { icon: Heart, text: 'Kampala Community Care' },
  ];

  return (
    <>
      <SEO
        title="Contact"
        path="/contact"
        description="Contact JB Dental Clinic in Makindye, Kampala. Address, phone +256 752 001269, email, opening hours. Visit us or book an appointment in Uganda."
      />
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Contact Us"
            subtitle="Visit our modern facility in Makindye, Kampala. We are ready to serve you."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h3 className="text-2xl font-bold mb-8" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Get In Touch
              </h3>

              <div className="space-y-6 mb-8">
                {contactInfo.map((info) => (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-[#7FD856]/10 rounded-lg flex items-center justify-center shrink-0">
                      <info.icon className="text-[#7FD856]" size={24} />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{info.title}</h4>
                      {info.href && info.label === null ? (
                        <a
                          href={info.href}
                          className="text-gray-400 hover:text-[#7FD856] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <>
                          <p className="text-gray-400 whitespace-pre-line">{info.content}</p>
                          {info.href && info.label && (
                            <a
                              href={info.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 text-[#7FD856] hover:text-[#6FC745] font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded"
                            >
                              {info.label} →
                            </a>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Get directions button */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#7FD856] hover:text-[#6FC745] font-semibold mb-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded"
              >
                <MapPin size={20} />
                Get directions on Google Maps
              </a>

              {/* Clinic Image */}
              <div className="rounded-2xl overflow-hidden border border-white/10 mb-8 h-64">
                <LazyImage
                  src="https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/4c4c000fdff3c2a18a77894ff494cdd9.jpg"
                  alt="JB Dental Clinic Building in Makindye"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {trustBadges.map((badge) => (
                  <div key={badge.text} className="bg-gradient-to-br from-[#7FD856]/10 to-transparent rounded-lg p-4 text-center border border-[#7FD856]/20">
                    <badge.icon className="text-[#7FD856] mx-auto mb-2" size={28} />
                    <p className="text-sm font-medium">{badge.text}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* WhatsApp CTA - replaced form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Clinic reception image - above Book an Appointment */}
              <div className="rounded-2xl overflow-hidden border border-white/10 aspect-video">
                <LazyImage
                  src="/images/jbdental-reception.png"
                  alt="JB Dental Clinic reception and waiting area in Makindye, Kampala"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 border border-white/10 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Book an Appointment
                </h3>
                <p className="text-gray-400 mb-6">
                  Chat with us on WhatsApp to book your visit, ask about services, or get a quick response. We'll confirm your slot and answer any questions.
                </p>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded-lg inline-block"
                >
                  <Button className="w-full bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold py-6 text-lg transition-all duration-300 hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-black">
                    <MessageCircle className="mr-3" size={24} />
                    Chat on WhatsApp to Book
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
