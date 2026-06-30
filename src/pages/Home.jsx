import React from 'react';
import SEO from '@/components/SEO';
import Hero from '@/components/Hero';
import Stories from '@/components/Stories';
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
        title="Dentist in Makindye Kampala"
        path="/"
        description="JB Dental Clinic in Makindye, Kampala offers general dentistry, braces, implants, cosmetic treatments, and emergency dental care. Book quickly via WhatsApp."
      />
      <div className="overflow-x-hidden">
        <Hero />
        <Stories />
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