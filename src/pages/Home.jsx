import React from 'react';
import { Helmet } from 'react-helmet';
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
      <Helmet>
        <title>JB Dental Clinic - Your Smile, Our Priority</title>
        <meta name="description" content="Experience world-class dental care with cutting-edge technology at JB Dental Clinic. Book your appointment today!" />
      </Helmet>
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