import React from 'react';
import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServicesGrid from '@/components/ServicesGrid';
import WhyChooseUs from '@/components/WhyChooseUs';
import TestimonialsCarousel from '@/components/TestimonialsCarousel';
import FounderSection from '@/components/FounderSection';
import TeamShowcase from '@/components/TeamShowcase';
import AppointmentCTA from '@/components/AppointmentCTA';

const Home = () => {
  return (
    <>
      <SEO
        useBrandOnly
        description="Quality dental care in Makindye, Kampala. General dentistry, implants, orthodontics, cosmetic dentistry and emergency care. Book via WhatsApp. Your smile, our priority."
      />
      <div className="overflow-x-hidden">
        <Hero />
        <AboutSection />
        <ServicesGrid />
        <WhyChooseUs />
        <TestimonialsCarousel />
        <FounderSection />
        <TeamShowcase />
        <AppointmentCTA />
      </div>
    </>
  );
};

export default Home;