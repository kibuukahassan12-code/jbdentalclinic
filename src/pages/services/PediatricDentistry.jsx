
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const PediatricDentistry = () => {
  return (
    <ServiceDetailLayout
      title="Pediatric Dentistry"
      description="Gentle, child-friendly dental care aimed at creating positive experiences for our youngest patients. We build trust and teach healthy habits that last a lifetime, from the first tooth to adolescence."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/67bb6ed8e3160aaa09a03dfe2cbbd59b.jpg",
          alt: "Child in dental chair with purple toothbrush"
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/24f6d3079d0c17f18e9054d050e44948.jpg",
          alt: "Pediatric dentist examining child with parent present"
        }
      ]}
      procedure={[
        { title: "Fun Introduction", desc: "Introducing tools and the chair in a non-threatening, playful way." },
        { title: "Gentle Exam", desc: "Checking for cavities and developmental issues with a soft touch." },
        { title: "Fluoride Treatment", desc: "Strengthening young enamel against decay." },
        { title: "Education", desc: "Teaching kids and parents proper brushing techniques." }
      ]}
      benefits={[
        "Creates a positive association with the dentist",
        "Prevents early childhood cavities",
        "Monitors proper jaw and tooth development",
        "Customized care for anxious children"
      ]}
      testimonial={{
        quote: "My son used to cry at the dentist. Here, he asks when we can go back! They are amazing with kids.",
        author: "Patricia S."
      }}
      whyChooseUs="Our team has a special way with children, using 'tell-show-do' techniques to eliminate fear. We create a safe, fun environment where kids feel empowered about their oral health."
    />
  );
};

export default PediatricDentistry;
