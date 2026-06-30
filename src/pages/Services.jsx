
import React from 'react';
import SEO from '@/components/SEO';
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
      image: '/images/bridal-dentistry.jpg',
      isExclusive: true
    },
    {
      title: 'General Dentistry',
      slug: 'general-dentistry',
      description: 'Comprehensive oral health maintenance including routine examinations, cleanings, and preventative strategies to ensure your smile lasts a lifetime.',
      icon: Stethoscope,
      image: '/images/general-dentistry.jpg',
    },
    {
      title: 'Cosmetic Dentistry',
      slug: 'cosmetic-dentistry',
      description: 'Artistic restoration of your smile using veneers, bonding, and aesthetic contouring designed to enhance your natural beauty and confidence.',
      icon: Sparkles,
      image: '/images/cosmetic-dentistry.jpg',
    },
    {
      title: 'Orthodontics',
      slug: 'orthodontics',
      description: 'Straighten teeth and correct bite issues with modern solutions ranging from traditional braces to clear aligners for both adults and children.',
      icon: Smile,
      image: '/images/orthodontics.jpg',
    },
    {
      title: 'Dental Implants',
      slug: 'dental-implants',
      description: 'State-of-the-art replacement for missing teeth. Our titanium implants provide a strong, long-lasting foundation specifically designed to match your natural teeth.',
      icon: Anchor,
      image: '/images/dental-implants.jpg',
    },
    {
      title: 'Teeth Whitening',
      slug: 'teeth-whitening',
      description: 'Professional-grade whitening treatments that safely remove deep stains and discoloration, brightening your smile by several shades in just one visit.',
      icon: Zap,
      image: '/images/teeth-whitening.png',
    },
    {
      title: 'Emergency Dental Care',
      slug: 'emergency-dental',
      description: 'Immediate attention for dental emergencies including severe pain, broken teeth, or trauma. We prioritize urgent cases to relieve your pain fast.',
      icon: AlertCircle,
      image: '/images/emergency-dental.png',
    },
    {
      title: 'Root Canal Treatment',
      slug: 'root-canal',
      description: 'Advanced endodontic therapy to save infected or damaged teeth. We use modern techniques to make the procedure comfortable and effective.',
      icon: Activity,
      image: '/images/root-canal.png',
    },
    {
      title: 'Dental Bridges & Crowns',
      slug: 'dental-bridges', 
      description: 'Custom-crafted restorative solutions to repair damaged teeth or fill gaps, restoring both function and the natural appearance of your smile.',
      icon: Crown,
      image: '/images/dental-bridges-crowns.jpg',
    },
    {
      title: 'Gum Disease Treatment',
      slug: 'periodontics',
      description: 'Periodontal therapy to combat gum inflammation and disease. We help you maintain healthy gums which are the foundation of a healthy smile.',
      icon: ShieldPlus,
      image: '/images/periodontics.png',
    },
    {
      title: 'Pediatric Dentistry',
      slug: 'pediatric-dentistry',
      description: 'Gentle, child-friendly dental care aimed at creating positive experiences for our youngest patients, from their first tooth to adolescence.',
      icon: Baby,
      image: '/images/pediatric-dentistry.jpg',
    },
    {
      title: 'Tooth Extraction',
      slug: 'tooth-extraction',
      description: 'Safe and gentle removal of problematic teeth when necessary. We prioritize your comfort during extractions and provide excellent aftercare.',
      icon: Search,
      image: '/images/tooth-extraction.jpg',
    },
    {
      title: 'Dental Crowns', 
      slug: 'dental-crowns',
      description: 'High-quality caps to restore broken or worn-down teeth. Our crowns are custom-made to look and feel exactly like your natural teeth.',
      icon: Component,
      image: '/images/dental-crowns.png',
    },
  ];

  return (
    <>
      <SEO
        title="Our Services"
        path="/services"
        description="Dental services in Kampala: general dentistry, implants, orthodontics, cosmetic dentistry, bridal dentistry, root canal, teeth whitening, emergency care. Makindye."
      />
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
            className="relative overflow-hidden rounded-2xl p-12 text-center border border-[#7FD856]/20"
          >
            {/* Background Texture */}
            <div className="absolute inset-0 z-0">
              <LazyImage
                src="/images/cta-dental-bg.png"
                alt="Dental clinic treatment background"
                className="w-full h-full"
                objectFit="cover"
                objectPosition="center"
              />
              <div className="absolute inset-0 bg-[#0B0F0B]/40 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0F0F0F]/55 via-[#16311A]/25 to-[#0F0F0F]/55 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(127,216,86,0.10),transparent_65%)] pointer-events-none" />
            </div>

            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-4 text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Ready to Transform Your Smile?
              </h3>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                Schedule your consultation today and experience the difference of personalized, professional dental care in a warm and welcoming environment.
              </p>
              <a
                href="https://wa.me/256752001269?text=Hey%20Doctor,%20I%20need%20to%20inquire..."
                target="_blank"
                rel="noopener noreferrer"
                className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7FD856] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F0F0F] rounded-lg inline-block"
              >
                <Button className="bg-[#7FD856] text-black hover:bg-[#6FC745] font-semibold px-8 py-6 text-lg transition-all duration-300 hover:scale-105 shadow-[0_0_20px_rgba(127,216,86,0.3)]">
                  Book Your Appointment
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Services;
