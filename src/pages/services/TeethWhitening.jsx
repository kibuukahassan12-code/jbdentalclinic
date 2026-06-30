
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const TeethWhitening = () => {
  return (
    <ServiceDetailLayout
      title="Teeth Whitening"
      path="/services/teeth-whitening"
      description="Professional-grade whitening treatments that safely remove deep stains and discoloration, brightening your smile by several shades in just one visit. Safe, effective, and instant results."
      images={[
        {
          src: '/images/teeth-whitening.png',
          alt: 'Patient smiling with bright white teeth during a professional dental examination at JB Dental Clinic',
        },
        {
          src: '/images/teeth-whitening.png',
          alt: 'Close-up of a healthy, whitened smile during a teeth whitening consultation at JB Dental Clinic',
        },
      ]}
      procedure={[
        { title: "Shade Assessment", desc: "Recording your current tooth shade to measure progress." },
        { title: "Preparation", desc: "Protecting gums and lips to ensure the whitening gel only touches your teeth." },
        { title: "Whitening Application", desc: "Applying professional-strength gel, activated by a special light for maximum effect." }
      ]}
      benefits={[
        "Immediate, noticeable results",
        "Safe for enamel and gums",
        "Removes stubborn coffee and tea stains",
        "Boosts confidence instantly"
      ]}
      testimonial={{
        quote: "My wedding was coming up and my teeth were yellow. One session later, they were bright white! The photos looked amazing.",
        author: "Rebecca T."
      }}
      whyChooseUs="Unlike store-bought kits, our professional whitening is customized to minimize sensitivity while maximizing results. We use top-tier whitening agents that are clinically proven to be safe and effective."
    />
  );
};

export default TeethWhitening;
