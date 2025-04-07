// app/robots.js
export default function robots() {
    return {
      rules: {
        userAgent: '*',
        allow: '/',
      },
      sitemap: 'https://trackode.in/sitemap.xml',
    };
  }