
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const DentalImplants = () => {
  return (
    <ServiceDetailLayout
      title="Dental Implants"
      description="State-of-the-art replacement for missing teeth. Our titanium implants provide a strong, long-lasting foundation specifically designed to match your natural teeth in both function and appearance."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/1ba84fe64f8ab58fcdc975aae03196a1.jpg",
          alt: "Detailed 3D medical illustration of dental implants showing white porcelain crowns at the top and a cross-section below displaying three titanium dental implants inserted into jawbone with pink gum tissue, demonstrating the complete dental implant structure and placement.",
          objectPosition: "center"
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/692c5da77c244cce652ea800c8075eec.jpg",
          alt: "3D illustration of dental implants showing white porcelain crowns on titanium implant screws with visible threading against a pink gum tissue background, demonstrating the complete implant structure and integration with natural teeth."
        }
      ]}
      procedure={[
        { title: "Consultation & CT Scan", desc: "3D imaging to assess bone density and plan precise implant placement." },
        { title: "Implant Placement", desc: "Surgical placement of the titanium post into the jawbone under local anesthesia." },
        { title: "Osseointegration", desc: "Healing period where the implant fuses with the bone to create a strong root." },
        { title: "Crown Attachment", desc: "Placing the custom-made crown onto the implant for a natural finish." }
      ]}
      benefits={[
        "Permanent solution for missing teeth",
        "Prevents bone loss in the jaw",
        "Functions exactly like natural teeth",
        "No impact on surrounding healthy teeth"
      ]}
      testimonial={{
        quote: "The implant procedure was much easier than I expected. Now I can eat steak and apples again without any worry!",
        author: "David L."
      }}
      whyChooseUs="We use only premium implant systems with proven success rates. Our clinic is equipped with 3D CBCT technology for precise planning, minimizing recovery time and ensuring the longevity of your investment."
    />
  );
};

export default DentalImplants;
