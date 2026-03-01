
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const TeethWhitening = () => {
  return (
    <ServiceDetailLayout
      title="Teeth Whitening"
      description="Professional-grade whitening treatments that safely remove deep stains and discoloration, brightening your smile by several shades in just one visit. Safe, effective, and instant results."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/ff5644f5472a53e867dba2ace9f47099.jpg",
          alt: "Portrait of a woman with a bright white smile and confident expression, showcasing the results of professional teeth whitening."
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/cfcd38d074ea775e1119e56eb78cc83c.jpg",
          alt: "Close-up view of a radiant smile showing healthy, whitened teeth and gums, demonstrating professional dental aesthetic results."
        }
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
