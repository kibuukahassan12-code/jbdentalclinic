
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const DentalBridges = () => {
  return (
    <ServiceDetailLayout
      title="Dental Bridges"
      description="Custom-crafted restorative solutions to repair damaged teeth or fill gaps, restoring both function and the natural appearance of your smile. Bridges bridge the gap created by one or more missing teeth."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f694f62d7dc88245fdea51aceebd1aad.jpg",
          alt: "Close-up side view of a dental bridge prosthetic with high-quality ceramic finish"
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/f32d68120a89b0a4df176ae140ba06cc.png",
          alt: "Top-down view of a dental bridge model demonstrating fit and structure"
        }
      ]}
      procedure={[
        { title: "Abutment Prep", desc: "Preparing the adjacent teeth to support the bridge." },
        { title: "Impression", desc: "Creating a precise model for the lab to craft your bridge." },
        { title: "Fitting", desc: "Checking the fit, bite, and color match of the new bridge." },
        { title: "Bonding", desc: "Permanently cementing the bridge in place." }
      ]}
      benefits={[
        "Restores your ability to chew and speak properly",
        "Maintains the shape of your face",
        "Prevents remaining teeth from drifting out of position",
        "A fixed, non-removable solution"
      ]}
      testimonial={{
        quote: "I was missing a tooth on the side and hated it. The bridge looks so natural, I forget it's not my original teeth.",
        author: "Esther L."
      }}
      whyChooseUs="Our bridges are crafted from high-grade ceramics that offer superior strength and aesthetics. We ensure precise fits that restore your bite's integrity and blend seamlessly with your natural smile."
    />
  );
};

export default DentalBridges;
