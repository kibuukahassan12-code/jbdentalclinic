
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const Periodontics = () => {
  return (
    <ServiceDetailLayout
      title="Gum Disease Treatment"
      description="Periodontal therapy to combat gum inflammation and disease. We help you maintain healthy gums which are the foundation of a healthy smile, treating everything from gingivitis to advanced periodontitis."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/e5f303cc0976e59d4d9f5d4dadd5a739.jpg",
          alt: "Close-up intraoral view showing severe gum disease with inflamed dark gums and visible tooth damage."
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/e70ce134873ec196739c20ec57e2bdaf.jpg",
          alt: "Intraoral view showing advanced gum disease with missing teeth and severe gum inflammation."
        }
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
