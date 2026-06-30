
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const Periodontics = () => {
  return (
    <ServiceDetailLayout
      title="Gum Disease Treatment"
      path="/services/periodontics"
      description="Periodontal therapy to combat gum inflammation and disease. We help you maintain healthy gums which are the foundation of a healthy smile, treating everything from gingivitis to advanced periodontitis."
      images={[
        {
          src: '/images/periodontics.png',
          alt: 'Close-up intraoral view showing severe gum disease with inflamed gums and visible plaque buildup at JB Dental Clinic',
        },
        {
          src: '/images/periodontics.png',
          alt: 'Clinical view of advanced periodontal disease with swollen gums requiring professional gum disease treatment',
        },
      ]}
      procedure={[
        { title: "Evaluation", desc: "Measuring gum pocket depths to assess disease severity." },
        { title: "Scaling & Root Planing", desc: "Deep cleaning below the gumline to remove bacteria and tartar." },
        { title: "Maintenance", desc: "Regular follow-ups to ensure gums heal and stay healthy." }
      ]}
      benefits={[
        "Stops gum bleeding and soreness",
        "Prevents tooth loss caused by gum disease",
        "Reduces bad breath",
        "Improves overall systemic health"
      ]}
      testimonial={{
        quote: "I didn't realize how bad my gums were until I came here. The treatment was thorough and my mouth feels so much healthier now.",
        author: "Robert K."
      }}
      whyChooseUs="Our approach to periodontics is holistic and gentle. We focus on non-surgical therapies whenever possible and educate you on home care techniques that are crucial for long-term gum health."
    />
  );
};

export default Periodontics;
