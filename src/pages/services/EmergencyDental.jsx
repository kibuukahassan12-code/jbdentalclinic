
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const EmergencyDental = () => {
  return (
    <ServiceDetailLayout
      title="Emergency Dental Care"
      path="/services/emergency-dental"
      description="Immediate attention for dental emergencies including severe pain, broken teeth, or trauma. We prioritize urgent cases to relieve your pain fast and save your teeth."
      images={[
        {
          src: '/images/emergency-dental.png',
          alt: 'Dentist examining a patient with jaw pain during an emergency dental visit at JB Dental Clinic',
        },
        {
          src: '/images/emergency-dental.png',
          alt: 'Patient receiving urgent dental care in the JB Dental Clinic treatment room with X-ray on screen',
        },
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
