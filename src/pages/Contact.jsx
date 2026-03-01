
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Award, Shield, Heart } from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import LazyImage from '@/components/LazyImage';

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Store in localStorage
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));

    toast({
      title: "Appointment Request Received!",
      description: "We'll contact you shortly to confirm your appointment at our Makindye clinic.",
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      service: '',
      message: ''
    });
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Clinic',
      content: 'Kampala, Makindye\nOpposite Climax Bar, Uganda'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: '+256 752 001269\n+256 772 365 268'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: 'info@jbdental.ug'
    },
    {
      icon: Clock,
      title: 'Opening Hours',
      content: 'Mon-Fri: 8:00 AM - 7:00 PM\nSat: 9:00 AM - 5:00 PM\nSun: Closed'
    }
  ];

  const trustBadges = [
    { icon: Award, text: 'Uganda Medical Board Certified' },
    { icon: Shield, text: 'Modern Sterilization' },
    { icon: Heart, text: 'Kampala Community Care' }
  ];

  const services = [
    'General Checkup',
    'Teeth Cleaning (Scaling)',
    'Cosmetic Dentistry',
    'Orthodontics (Braces)',
    'Dental Implants',
    'Root Canal Therapy',
    'Teeth Whitening',
    'Emergency Tooth Extraction',
    'Pediatric Dental Care'
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - JB Dental Clinic Kampala</title>
        <meta name="description" content="Visit JB Dental Clinic in Makindye, Kampala. Contact us for appointments or dental inquiries in Uganda." />
      </Helmet>
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
                      <p className="text-gray-400 whitespace-pre-line">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clinic Image Placeholder */}
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

            {/* Appointment Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  Book an Appointment
                </h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FD856] transition-colors"
                      placeholder="e.g. John Kintu"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FD856] transition-colors"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FD856] transition-colors"
                        placeholder="+256 700 000000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="date" className="block text-sm font-medium mb-2">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7FD856] transition-colors"
                      />
                    </div>
                    <div>
                      <label htmlFor="time" className="block text-sm font-medium mb-2">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7FD856] transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-2">
                      Service Type
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7FD856] transition-colors"
                    >
                      <option value="" className="bg-[#0F0F0F]">Select a service</option>
                      {services.map((service) => (
                        <option key={service} value={service} className="bg-[#0F0F0F]">
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Additional Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FD856] transition-colors resize-none"
                      placeholder="Any specific dental concerns?"
                    ></textarea>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold py-6 text-lg transition-all duration-300 hover:scale-105"
                  >
                    Submit Appointment Request
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
