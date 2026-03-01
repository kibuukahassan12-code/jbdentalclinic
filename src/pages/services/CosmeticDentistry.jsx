
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const CosmeticDentistry = () => {
  return (
    <ServiceDetailLayout
      title="Cosmetic Dentistry"
      description="Artistic restoration of your smile using veneers, bonding, and aesthetic contouring designed to enhance your natural beauty and confidence. We combine art and science to create the smile you've always dreamed of."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/03feac7fdbbdb9e2645e5076353f627f.jpg",
          alt: "Close-up of a person's beautiful smile with bright white teeth, showing cosmetic dentistry results, with hands framing the teeth.",
          objectPosition: "center"
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/bfa95d69342c0660acb7f078c712e585.jpg",
          alt: "Two dentists in blue scrubs performing a procedure in a modern, colorful clinic",
          objectPosition: "center"
        }
      ]}
      procedure={[
        { title: "Smile Analysis", desc: "We evaluate your facial structure and smile aesthetics to design a custom plan." },
        { title: "Mock-up & Preview", desc: "Digital or physical previews allow you to see the potential results before we begin." },
        { title: "Transformation", desc: "Executing the procedure (veneers, bonding, etc.) with precision and artistry." }
      ]}
      benefits={[
        "Enhanced self-confidence and self-esteem",
        "Correction of chips, cracks, and gaps",
        "A younger, more vibrant appearance",
        "Long-lasting, stain-resistant results"
      ]}
      testimonial={{
        quote: "I never used to smile in photos. After my cosmetic treatment at JB Dental, I can't stop smiling! It changed my life.",
        author: "Michael O."
      }}
      whyChooseUs="Cosmetic dentistry requires an artistic eye. Dr. JB Mubiru is renowned for his attention to detail and ability to create natural-looking smiles that complement your unique facial features, rather than looking 'fake' or overdone."
    />
  );
};

export default CosmeticDentistry;
