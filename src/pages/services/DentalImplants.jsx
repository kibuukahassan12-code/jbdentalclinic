
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const DentalImplants = () => {
  return (
    <ServiceDetailLayout
      title="Dental Implants"
      path="/services/dental-implants"
      description="State-of-the-art replacement for missing teeth. Our titanium implants provide a strong, long-lasting foundation specifically designed to match your natural teeth in both function and appearance."
      images={[
        {
          src: "/images/dental-implants.jpg",
          alt: "3D illustration of dental implants with titanium screws and porcelain crowns being placed into the jawbone",
          objectPosition: "center"
        },
        {
          src: "/images/dental-implants.jpg",
          alt: "Close-up 3D view showing dental implant components including crown, abutment and titanium screw"
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
