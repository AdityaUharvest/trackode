// components/StructuredData.js
import Script from 'next/script';

export default function StructuredData() {
  const baseUrl = "https://trackode.in";
  
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
            'alternateName': 'Trackode Coding',
            'url': baseUrl,
            'potentialAction': {
              '@type': 'SearchAction',
              'target': `${baseUrl}/search?q={search_term_string}`,
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
            '@type': 'EducationalOrganization',
            'name': 'Trackode',
            'url': baseUrl,
            'logo': `${baseUrl}/trackode.png`,
            'sameAs': [
              'https://twitter.com/trackode',
              'https://www.linkedin.com/company/trackode',
              'https://github.com/trackode'
            ],
            'description': 'Trackode is an AI-powered educational platform providing interactive quizzes and mock tests for developers and students preparing for technical careers.'
          })
        }}
      />
      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': baseUrl
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Programming Quizzes',
                'item': `${baseUrl}/programming-quizzes`
              },
              {
                '@type': 'ListItem',
                'position': 3,
                'name': 'Mock Tests',
                'item': `${baseUrl}/mocks`
              }
            ]
          })
        }}
      />
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            'mainEntity': [
              {
                '@type': 'Question',
                'name': 'What is Trackode?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Trackode is a platform where you can take free mock tests and AI-powered coding quizzes as part of your tech interview preparation.'
                }
              },
              {
                '@type': 'Question',
                'name': 'Are the quizzes free?',
                'acceptedAnswer': {
                  '@type': 'Answer',
                  'text': 'Yes, most of our programming quizzes and basic mock tests are free for everyone.'
                }
              }
            ]
          })
        }}
      />
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            'name': 'Trackode AI Platform',
            'operatingSystem': 'All',
            'applicationCategory': 'EducationalApplication',
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD'
            },
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': '4.8',
              'ratingCount': '1250'
            }
          })
        }}
      />
    </>
  );
}