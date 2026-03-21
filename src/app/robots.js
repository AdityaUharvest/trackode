// app/robots.js
export default function robots() {
    return {
      rules: [
        {
          userAgent: '*',
          allow: '/',
          disallow: [
            '/admin-dashboard',
            '/admin-dashboard/*',
            '/dashboard',
            '/dashboard/*',
            '/api/*',
            '/settings',
            '/settings/*',
          ],
        },
      ],
      sitemap: 'https://trackode.in/sitemap.xml',
    };
  }