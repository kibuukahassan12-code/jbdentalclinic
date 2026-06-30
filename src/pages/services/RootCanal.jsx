
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const RootCanal = () => {
  return (
    <ServiceDetailLayout
      title="Root Canal Treatment"
      path="/services/root-canal"
      description="Advanced endodontic therapy to save infected or damaged teeth. We use modern techniques to make the procedure comfortable and effective, dispelling the myth that root canals are painful."
      images={[
        {
          src: '/images/root-canal.png',
          alt: 'Medical illustration showing root canal procedure with endodontic file cleaning infected tooth pulp at JB Dental Clinic',
          objectPosition: 'center',
        },
        {
          src: '/images/root-canal.png',
          alt: '3D visualization of molar tooth anatomy highlighting root canals treated during endodontic therapy',
          objectPosition: 'center',
        },
      ]}
      procedure={[
        { title: "Diagnosis & Anesthesia", desc: "Confirming infection and ensuring the area is completely numb." },
        { title: "Cleaning", desc: "Removing infected pulp and bacteria from inside the tooth roots." },
        { title: "Filling & Sealing", desc: "Filling the cleaned canals with a biocompatible material to prevent reinfection." },
        { title: "Restoration", desc: "Placing a crown to strengthen the tooth and restore full function." }
      ]}
      benefits={[
        "Saves your natural tooth from extraction",
        "Relieves severe tooth pain immediately",
        "Prevents spread of infection",
        "Restores normal biting and chewing"
      ]}
      testimonial={{
        quote: "I was terrified of getting a root canal, but Dr. JB was so gentle I almost fell asleep. The pain was gone instantly.",
        author: "James P."
      }}
      whyChooseUs="We utilize rotary endodontics and digital imaging to perform root canals more quickly and comfortably than traditional methods. Our priority is your comfort and saving your natural tooth whenever possible."
    />
  );
};

export default RootCanal;
