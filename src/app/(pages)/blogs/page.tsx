import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Newspaper, ArrowRight, Calendar, User, Tag, Ghost } from 'lucide-react';
import connectDB from '@/lib/util';
import Blog from '@/app/model/Blog';

export const revalidate = 3600; // revalidate every hour

export const metadata: Metadata = {
  title: 'Insights & Technical Articles | Trackode AI Blog',
  description: 'Master technical interviews, AI-powered learning, and career growth with our latest tech articles. Expert guidance for software developers and students.',
  keywords: ['coding blog', 'technical interviews', 'TCS NQT preparation', 'AI education', 'programming tips', 'Trackode blogs'],
  openGraph: {
    title: 'Trackode Official Blog - Career & Code',
    description: 'Expert strategies for software developers and students preparing for the modern tech industry.',
    url: 'https://trackode.in/blogs',
    type: 'website',
  }
};

export default async function BlogListingPage() {
  await connectDB();
  const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header section with glassmorphism */}
        <div className="relative mb-20 p-12 lg:p-20 text-center rounded-[3rem] border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-3xl overflow-hidden shadow-sm">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10" />
          <Newspaper className="w-16 h-16 text-indigo-500 mx-auto mb-6" />
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-6">
            Explore the <span className="text-indigo-500 italic">Future</span> of Learning
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Expert insights, career strategies, and technical deep dives to help you master the skills that matter.
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((post: any, idx) => (
              <Link key={idx} href={`/blogs/${post.slug}`} className="group flex">
                <article className="flex flex-col w-full rounded-[2.5rem] p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-2xl hover:shadow-indigo-500/20 hover:-translate-y-2">
                  <div className="relative h-56 rounded-[2rem] bg-slate-100 dark:bg-slate-800 overflow-hidden mb-6">
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 opacity-20 group-hover:opacity-40 transition-opacity" />
                     <div className="absolute top-6 left-6 z-10">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-slate-950/90 backdrop-blur text-[10px] font-black uppercase tracking-widest text-indigo-600 shadow-sm border border-white/50">
                        <Tag className="w-2.5 h-2.5" />
                        {post.category}
                      </span>
                     </div>
                  </div>
                  
                  <div className="px-4 pb-4 flex flex-col flex-1">
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(post.createdAt || post.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                    </div>
                    
                    <h2 className="text-xl font-bold mb-4 leading-tight text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                      {post.title}
                    </h2>
                    
                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-8 leading-relaxed font-medium">
                      {post.description}
                    </p>
                    
                    <div className="mt-auto flex items-center gap-2 text-indigo-500 font-black text-xs tracking-widest uppercase transition-all group-hover:gap-4">
                      Read Post <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-20 text-center border border-slate-200 dark:border-slate-800">
             <Ghost className="w-16 h-16 text-slate-300 mx-auto mb-6" />
             <h3 className="text-2xl font-black mb-4 tracking-tight">Writing meaningful content...</h3>
             <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">We haven&apos;t published any articles yet. Please check back soon for our first release!</p>
          </div>
        )}
      </div>
    </div>
  );
}
