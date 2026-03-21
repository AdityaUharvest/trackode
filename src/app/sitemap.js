import connectDB from "@/lib/util";
import Quiz from "@/app/model/Quiz";
import MockTest from "@/app/model/MoockTest";
import Blog from "@/app/model/Blog";

export default async function sitemap() {
  const baseUrl = "https://trackode.in";

  try {
    await connectDB();
    
    // Fetch dynamic items
    const [quizzes, mocks, blogs] = await Promise.all([
      Quiz.find({ public: { $ne: false } }).select('_id updated').lean(),
      MockTest.find({ public: { $ne: false } }).select('shareCode updatedAt').lean(),
      Blog.find({ published: true }).select('slug updatedAt').lean()
    ]);

    const blogUrls = blogs.map((post) => ({
      url: `${baseUrl}/blogs/${post.slug}`,
      lastModified: post.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const roadmaps = [
      'c', 'cpp', 'java', 'python', 'javascript', 'typescript', 'go', 'rust', 'kotlin', 'php', 'ruby', 'sql'
    ];

    const roadmapUrls = roadmaps.map((tech) => ({
      url: `${baseUrl}/roadmap/${tech}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

    const quizUrls = quizzes.map((q) => ({
      url: `${baseUrl}/quizzes/${q._id}`,
      lastModified: q.updated || new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    }));

    const mockUrls = mocks.map((m) => ({
      url: `${baseUrl}/mocks/${m.shareCode}`,
      lastModified: m.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      },
      {
        url: `${baseUrl}/programming-quizzes`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/mocks`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${baseUrl}/blogs`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
    ];

    return [...staticPages, ...roadmapUrls, ...quizUrls, ...mockUrls, ...blogUrls];
  } catch (error) {
    console.error('Sitemap error:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0,
      }
    ];
  }
}