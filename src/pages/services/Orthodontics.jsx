
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const Orthodontics = () => {
  return (
    <ServiceDetailLayout
      title="Orthodontics"
      path="/services/orthodontics"
      description="Straighten teeth and correct bite issues with modern solutions ranging from traditional braces to clear aligners for both adults and children. A straight smile is a healthier smile."
      images={[
        {
          src: "/images/orthodontics.jpg",
          alt: "Doctor and patient reviewing dental scan at JB Dental Clinic orthodontics consultation",
          objectPosition: "center"
        },
        {
          src: "https://images.unsplash.com/photo-1619987614890-4797e713fb03",
          alt: "Close-up of clear aligners being placed on a model of teeth"
        }
      ]}
      procedure={[
        { title: "Orthodontic Assessment", desc: "Photos, X-rays, and digital scans to analyze bite and alignment issues." },
        { title: "Treatment Planning", desc: "Choosing between braces or clear aligners based on your lifestyle and needs." },
        { title: "Active Treatment", desc: "Regular adjustments to gradually move teeth into their optimal positions." },
        { title: "Retention", desc: "Using retainers to maintain your new smile permanently after treatment." }
      ]}
      benefits={[
        "Improved bite function and chewing",
        "Easier cleaning and better gum health",
        "Reduced risk of jaw pain (TMJ)",
        "A beautifully aligned smile"
      ]}
      testimonial={{
        quote: "I thought I was too old for braces, but the clear aligners were invisible. Now my teeth are straight for the first time in 40 years.",
        author: "Grace N."
      }}
      whyChooseUs="We offer comprehensive orthodontic solutions tailored to all ages. Whether you need complex correction with traditional braces or discreet treatment with clear aligners, we guide you to the best choice for your lifestyle."
    />
  );
};

export default Orthodontics;
