
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const RootCanal = () => {
  return (
    <ServiceDetailLayout
      title="Root Canal Treatment"
      description="Advanced endodontic therapy to save infected or damaged teeth. We use modern techniques to make the procedure comfortable and effective, dispelling the myth that root canals are painful."
      images={[
        {
          src: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800",
          alt: "3D medical illustration showing a tooth cross-section with endodontic instruments (files) inserted into the root canal, displaying the internal anatomy of the tooth with the pulp chamber and root canal system highlighted in red and blue."
        },
        {
          src: "https://images.unsplash.com/photo-1606811841689-23db3c3298c0?w=800",
          alt: "3D illustration of a tooth showing the internal root canal structure with the pulp highlighted in orange/red against a blue translucent tooth outline, demonstrating the anatomy that requires root canal treatment."
        }
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
