
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const GeneralDentistry = () => {
  return (
    <ServiceDetailLayout
      title="General Dentistry"
      description="Comprehensive oral health maintenance including routine examinations, cleanings, and preventative strategies to ensure your smile lasts a lifetime. We focus on early detection and patient education to prevent issues before they start."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/9f6fb95078e83831e0f057a6d4f9ee43.jpg",
          alt: "Patient in dental chair with dentist preparing for examination",
          objectPosition: "center 20%" // Adjusted to prominently display the patient's face
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f2ce305ac0650582f77782441dd41f5a.jpg",
          alt: "Happy patient smiling in dental chair with light and equipment visible",
          objectPosition: "center"
        }
      ]}
      procedure={[
        { title: "Initial Examination", desc: "A thorough check-up of your teeth, gums, and mouth using advanced imaging technology." },
        { title: "Professional Cleaning", desc: "Removal of plaque and tartar buildup that regular brushing can't reach." },
        { title: "Personalized Plan", desc: "Developing a tailored oral hygiene plan based on your specific needs." }
      ]}
      benefits={[
        "Prevention of cavities and gum disease",
        "Early detection of oral health issues",
        "Fresher breath and cleaner teeth",
        "Long-term cost savings on major treatments"
      ]}
      testimonial={{
        quote: "Dr. JB and his team make regular check-ups something I actually look forward to. Professional, clean, and very thorough.",
        author: "Sarah K."
      }}
      whyChooseUs="At JB Dental Clinic, general dentistry is the foundation of everything we do. We believe that a healthy smile starts with consistent, high-quality maintenance. Our team uses the latest diagnostic tools to catch problems early, saving you time, discomfort, and money in the long run."
    />
  );
};

export default GeneralDentistry;
