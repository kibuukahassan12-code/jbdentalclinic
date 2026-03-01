
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const EmergencyDental = () => {
  return (
    <ServiceDetailLayout
      title="Emergency Dental Care"
      description="Immediate attention for dental emergencies including severe pain, broken teeth, or trauma. We prioritize urgent cases to relieve your pain fast and save your teeth."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/e06623f28f171cd4d4b180adf49e7625.jpg",
          alt: "Close-up of a patient with a bright smile during a dental examination with a dentist wearing blue gloves using dental instruments."
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/3614a7f3e5636d0ce3b9a9a287495ebd.jpg",
          alt: "Patient in a dental chair wearing blue protective bib with a dentist in blue gloves performing a dental procedure, showing professional emergency dental care treatment."
        }
      ]}
      procedure={[
        { title: "Rapid Triage", desc: "Quick assessment to identify the source of pain or trauma." },
        { title: "Pain Management", desc: "Immediate relief through medication or local anesthesia." },
        { title: "Stabilization", desc: "Temporary or permanent treatment to fix the urgent issue." }
      ]}
      benefits={[
        "Same-day appointments for urgent cases",
        "Immediate pain relief",
        "Higher chance of saving injured teeth",
        "Peace of mind when you need it most"
      ]}
      testimonial={{
        quote: "I woke up with terrible tooth pain on a Sunday. JB Dental got me in right away and fixed the problem. Lifesavers!",
        author: "Anita M."
      }}
      whyChooseUs="We understand that dental emergencies are stressful and painful. Our team is trained to handle trauma and acute pain with compassion and efficiency, getting you back to comfort as quickly as possible."
    />
  );
};

export default EmergencyDental;
