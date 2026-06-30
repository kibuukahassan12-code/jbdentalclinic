import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_URL } from '@/lib/seo';

/**
 * JSON-LD LocalBusiness (Dentist) schema for Kampala – improves local SEO.
 */
const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dentist',
  name: 'JB Dental Clinic',
  description: 'Quality dental care in Makindye, Kampala. General dentistry, implants, orthodontics, cosmetic dentistry, and emergency care. Book via WhatsApp.',
  url: SITE_URL,
  telephone: '+256752001269',
  email: 'info@jbdental.ug',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Opposite Climax Bar, Makindye',
    addressLocality: 'Makindye',
    addressRegion: 'Kampala',
    addressCountry: 'UG',
  },
  geo: {
    '@type': 'GeoCoordinates',
    addressCountry: 'Uganda',
    addressRegion: 'Kampala',
    addressLocality: 'Makindye',
  },
  areaServed: [
    { '@type': 'City', name: 'Kampala' },
    { '@type': 'Country', name: 'Uganda' },
  ],
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:00',
      closes: '19:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: 'Saturday',
      opens: '09:00',
      closes: '17:00',
    },
  ],
  priceRange: '$$',
  image: `${SITE_URL}/images/jb-dental-logo.png`,
  sameAs: [],
};

const LocalBusinessSchema = () => (
  <Helmet>
    <script type="application/ld+json">
      {JSON.stringify(localBusinessSchema)}
    </script>
  </Helmet>
);

export default LocalBusinessSchema;
