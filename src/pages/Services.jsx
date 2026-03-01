
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { 
  Stethoscope, 
  Sparkles, 
  Smile, 
  Anchor, 
  Zap, 
  AlertCircle, 
  Activity, 
  Crown, 
  ShieldPlus, 
  Baby, 
  Search, 
  Component,
  HeartHandshake
} from 'lucide-react';
import SectionHeader from '@/components/SectionHeader';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ServiceCard from '@/components/ServiceCard';
import LazyImage from '@/components/LazyImage';

const Services = () => {
  const services = [
    {
      title: 'Bridal Dentistry',
      slug: 'bridal-dentistry',
      description: 'The ONLY clinic offering exclusive bridal dentistry services. Custom-tailored packages to ensure your smile is picture-perfect for your special day.',
      icon: HeartHandshake,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/776bfc0dcf24115ca9ed882db6e0cb8a.jpg', // Updated image URL for Bridal Dentistry
      isExclusive: true
    },
    {
      title: 'General Dentistry',
      slug: 'general-dentistry',
      description: 'Comprehensive oral health maintenance including routine examinations, cleanings, and preventative strategies to ensure your smile lasts a lifetime.',
      icon: Stethoscope,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/d102fd6bad055a03990b7acf8334d4d8.jpg',
    },
    {
      title: 'Cosmetic Dentistry',
      slug: 'cosmetic-dentistry',
      description: 'Artistic restoration of your smile using veneers, bonding, and aesthetic contouring designed to enhance your natural beauty and confidence.',
      icon: Sparkles,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/bab1fc185cee524fbf9689bb7b5e1465.jpg', // Updated image URL for Cosmetic Dentistry
    },
    {
      title: 'Orthodontics',
      slug: 'orthodontics',
      description: 'Straighten teeth and correct bite issues with modern solutions ranging from traditional braces to clear aligners for both adults and children.',
      icon: Smile,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/d935e4efcee7619465be9fdf57a3e54c.jpg',
    },
    {
      title: 'Dental Implants',
      slug: 'dental-implants',
      description: 'State-of-the-art replacement for missing teeth. Our titanium implants provide a strong, long-lasting foundation specifically designed to match your natural teeth.',
      icon: Anchor,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/60e7d33b5b6f3de6d08cf3967051ea02.jpg',
    },
    {
      title: 'Teeth Whitening',
      slug: 'teeth-whitening',
      description: 'Professional-grade whitening treatments that safely remove deep stains and discoloration, brightening your smile by several shades in just one visit.',
      icon: Zap,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/db4daef523c8a222afb810753db60b03.jpg',
    },
    {
      title: 'Emergency Dental Care',
      slug: 'emergency-dental',
      description: 'Immediate attention for dental emergencies including severe pain, broken teeth, or trauma. We prioritize urgent cases to relieve your pain fast.',
      icon: AlertCircle,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/dd30df664e56d6e8792de1271b32d0c0.jpg',
    },
    {
      title: 'Root Canal Treatment',
      slug: 'root-canal',
      description: 'Advanced endodontic therapy to save infected or damaged teeth. We use modern techniques to make the procedure comfortable and effective.',
      icon: Activity,
      image: 'https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/1c621aa63f1ae70f8770c5aa174dd329.jpg',
    },
    {
      title: 'Dental Bridges & Crowns',
      slug: 'dental-bridges', 
      description: 'Custom-crafted restorative solutions to repair damaged teeth or fill gaps, restoring both function and the natural appearance of your smile.',
      icon: Crown,
      image: '',
    },
    {
      title: 'Gum Disease Treatment',
      slug: 'periodontics',
      description: 'Periodontal therapy to combat gum inflammation and disease. We help you maintain healthy gums which are the foundation of a healthy smile.',
      icon: ShieldPlus,
      image: '',
    },
    {
      title: 'Pediatric Dentistry',
      slug: 'pediatric-dentistry',
      description: 'Gentle, child-friendly dental care aimed at creating positive experiences for our youngest patients, from their first tooth to adolescence.',
      icon: Baby,
      image: '',
    },
    {
      title: 'Tooth Extraction',
      slug: 'tooth-extraction',
      description: 'Safe and gentle removal of problematic teeth when necessary. We prioritize your comfort during extractions and provide excellent aftercare.',
      icon: Search,
      image: '',
    },
    {
      title: 'Dental Crowns', 
      slug: 'dental-crowns',
      description: 'High-quality caps to restore broken or worn-down teeth. Our crowns are custom-made to look and feel exactly like your natural teeth.',
      icon: Component,
      image: '',
    },
  ];

  return (
    <>
      <Helmet>
        <title>Comprehensive Dental Services | JB Dental Clinic Kampala</title>
        <meta name="description" content="Explore our full range of dental services including exclusive bridal dentistry, implants, orthodontics, cosmetic dentistry, and emergency care in Kampala." />
      </Helmet>
      
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-[#0F0F0F]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="World-Class Dental Services"
            subtitle="Advanced dental solutions tailored to your unique needs with a touch of Ugandan hospitality"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                index={index}
                title={service.title}
                slug={service.slug}
                description={service.description}
                icon={service.icon}
                image={service.image}
                isExclusive={service.isExclusive}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl p-12 text-center"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 z-0">
               <LazyImage 
                 src="https://images.unsplash.com/photo-1558642843-d6351b0ccf51" 
                 alt="Background Pattern" 
                 className="w-full h-full opacity-10"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F] via-[#7FD856]/10 to-[#0F0F0F] pointer-events-none" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Ready to Transform Your Smile?
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Schedule your consultation today and experience the difference of personalized, professional dental care in a warm and welcoming environment.
              </p>
              <Link to="/appointment">
                <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(127,216,86,0.3)]">
                  Book Your Appointment
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Services;
