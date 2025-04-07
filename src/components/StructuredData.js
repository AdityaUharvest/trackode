// components/StructuredData.js
import Script from 'next/script';

export default function StructuredData() {
  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Trackode',
            'url': 'https://trackode.in',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://trackode.in/search?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            'name': 'Trackode',
            'url': 'https://trackode.in',
            'logo': 'https://trackode.in/trackode.png'
          })
        }}
      />
    </>
  );
}