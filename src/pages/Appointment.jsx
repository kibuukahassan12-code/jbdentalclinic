
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, Stethoscope } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateWhatsAppLink } from '@/lib/whatsappService';

const Appointment = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    service: '',
    message: ''
  });

  useEffect(() => {
    const serviceParam = searchParams.get('service');
    if (serviceParam) {
      setFormData(prev => ({
        ...prev,
        service: serviceParam
      }));
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Save to local storage (existing functionality)
    const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    appointments.push({
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('appointments', JSON.stringify(appointments));

    // Save to API database
    try {
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
    } catch {
      // API unavailable - localStorage fallback already saved
    }

    // Generate WhatsApp Link and Open it
    const whatsappUrl = generateWhatsAppLink(formData);
    window.open(whatsappUrl, '_blank');

    toast({
      title: "Appointment Request Started!",
      description: "Opening WhatsApp to send your booking details to our team...",
    });

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

  const services = [
    'Bridal Dentistry',
    'General Checkup',
    'Teeth Cleaning',
    'Cosmetic Dentistry',
    'Orthodontics (Braces)',
    'Dental Implants',
    'Root Canal Treatment',
    'Teeth Whitening',
    'Emergency Care',
    'Pediatric Dentistry',
    'Oral Surgery',
    'Dental Bridges',
    'Dental Crowns',
    'Gum Disease Treatment'
  ];

  const formFields = [
    { icon: User, name: 'name', label: 'Full Name', type: 'text', placeholder: 'e.g. John Kintu', required: true },
    { icon: Mail, name: 'email', label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
    { icon: Phone, name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+256 700 000000', required: true },
    { icon: Calendar, name: 'date', label: 'Preferred Date', type: 'date', required: false },
    { icon: Clock, name: 'time', label: 'Preferred Time', type: 'time', required: false },
  ];

  return (
    <>
      <Helmet>
        <title>Book Appointment - JB Dental Clinic Kampala</title>
        <meta name="description" content="Schedule your dental appointment at JB Dental Clinic Makindye. Quick and easy online booking for all dental services." />
      </Helmet>
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Book Your Appointment"
            subtitle="Visit us in Makindye, Kampala. Fill out the form below and we'll open WhatsApp to confirm your slot."
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-white/10 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formFields.map((field) => (
                  <div key={field.name} className={field.type === 'date' || field.type === 'time' ? '' : 'md:col-span-1'}>
                    <label htmlFor={field.name} className="flex items-center text-sm font-medium mb-2">
                      <field.icon className="text-[#7FD856] mr-2" size={18} />
                      {field.label} {field.required && <span className="text-[#7FD856] ml-1">*</span>}
                    </label>
                    <input
                      type={field.type}
                      id={field.name}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FD856] focus:ring-1 focus:ring-[#7FD856] transition-all"
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="service" className="flex items-center text-sm font-medium mb-2">
                  <Stethoscope className="text-[#7FD856] mr-2" size={18} />
                  Service Type
                </label>
                <select
                  id="service"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#7FD856] focus:ring-1 focus:ring-[#7FD856] transition-all"
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
                <label htmlFor="message" className="flex items-center text-sm font-medium mb-2">
                  <MessageSquare className="text-[#7FD856] mr-2" size={18} />
                  Additional Notes
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#7FD856] focus:ring-1 focus:ring-[#7FD856] transition-all resize-none"
                  placeholder="Any special requests? First time visiting?"
                ></textarea>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold py-6 text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#7FD856]/50"
              >
                Book Appointment via WhatsApp
              </Button>

              <p className="text-gray-400 text-sm text-center">
                By clicking "Book Appointment", you will be redirected to WhatsApp to send your details directly to our reception desk.
              </p>
            </form>
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
