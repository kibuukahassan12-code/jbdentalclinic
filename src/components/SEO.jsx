import React from 'react';
import { Helmet } from 'react-helmet';
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from '@/lib/seo';

/**
 * Reusable SEO component: title, description, canonical, Open Graph, Twitter Card.
 * Use on every page for consistent, local-friendly meta.
 */
const SEO = ({
  title,
  description,
  path = '',
  image = DEFAULT_OG_IMAGE,
  imageAlt,
  noindex = false,
  useBrandOnly = false,
}) => {
  const fullTitle = useBrandOnly || !title
    ? `${SITE_NAME} – Kampala`
    : `${title} | ${SITE_NAME} Kampala`;
  const canonical = path ? `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}` : `${SITE_URL}/`;
  const ogImage = image.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt || fullTitle} />
      <meta property="og:locale" content="en_UG" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
    </Helmet>
  );
};

export default SEO;
