// app/sitemap.js
export default function sitemap() {
    return [
      {
        url: 'https://trackode.in',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: 'https://trackode.in/dashboard',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://trackode.in/programming-quizzes',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: 'https://trackode.in/admin-dashboard',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      {
        url: 'https://trackode.in/premium-mock-tests',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      },
      // Add more pages as needed
    ];
  }