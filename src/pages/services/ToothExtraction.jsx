
import React from 'react';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';

const ToothExtraction = () => {
  return (
    <ServiceDetailLayout
      title="Tooth Extraction"
      description="Safe and gentle removal of problematic teeth, including wisdom teeth. While we strive to save every tooth, sometimes extraction is necessary for the overall health of your mouth."
      images={[
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/fc7a926062baa6a3e9e5d391b0184212.jpg",
          alt: "A smiling female patient sitting in a modern dental chair in a bright, welcoming dental clinic with professional lighting overhead, stone accent wall, and white cabinetry in the background. The patient appears happy and comfortable during a dental visit."
        },
        {
          src: "https://horizons-cdn.hostinger.com/389eff78-3123-445d-bf00-9ef97ab253ec/53ecb766675732051fc42a6d8f8b0165.jpg",
          alt: "3D medical illustration showing a tooth extraction procedure with a dental forceps extracting a tooth from the jawbone, displaying the anatomical structure of the tooth root and surrounding bone tissue in detail"
        }
      ]}
      procedure={[
        { title: "X-Ray Analysis", desc: "Determining the root position and surrounding bone structure." },
        { title: "Numbing", desc: "Ensuring the area is completely anesthetized for a painless procedure." },
        { title: "Extraction", desc: "Carefully removing the tooth with minimal trauma to surrounding tissue." },
        { title: "Recovery Plan", desc: "Providing detailed aftercare instructions for quick healing." }
      ]}
      benefits={[
        "Eliminates source of severe infection",
        "Creates space for orthodontic treatment",
        "Resolves wisdom tooth pain and crowding",
        "Quick relief from non-restorable teeth"
      ]}
      testimonial={{
        quote: "I needed my wisdom teeth out and was so nervous. The procedure was over before I knew it, and recovery was smooth.",
        author: "Timothy B."
      }}
      whyChooseUs="We prioritize preservation, but when extraction is needed, we do it with the utmost care. Our gentle techniques and sedation options ensure that even surgical extractions are as comfortable as possible."
    />
  );
};

export default ToothExtraction;
