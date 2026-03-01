
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const DentalCrowns = () => {
  return (
    <ServiceDetailLayout
      title="Dental Crowns"
      description="Custom-crafted caps that cover damaged teeth to restore their shape, size, strength, and appearance. We use high-quality materials that mimic the look and feel of natural enamel."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/8112f43c77132fba291669b2313eb14a.jpg",
          alt: "Close-up product view of dental crown prosthetics"
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/b66b11b6a26d22cf9a2da4abcde36ad4.jpg",
          alt: "Educational diagram showing types of crowns"
        }
      ]}
      procedure={[
        { title: "Preparation", desc: "Reshaping the tooth to accommodate the crown." },
        { title: "Impression", desc: "Taking a precise mold or digital scan of the prepared tooth." },
        { title: "Temporary Crown", desc: "Placing a temporary cap while your custom crown is being crafted." },
        { title: "Final Bonding", desc: "Cementing the permanent crown for a lasting fit." }
      ]}
      benefits={[
        "Protects weak or cracked teeth",
        "Restores broken or worn-down teeth",
        "Improves aesthetics of misshapen teeth",
        "Long-lasting and durable"
      ]}
      testimonial={{
        quote: "My front tooth was chipped for years. The crown matches my other teeth perfectly—no one can tell it's not real!",
        author: "Samantha W."
      }}
      whyChooseUs="We offer a variety of crown materials, including zirconia and porcelain-fused-to-metal, ensuring we find the perfect balance between aesthetics and durability for your specific situation."
    />
  );
};

export default DentalCrowns;
