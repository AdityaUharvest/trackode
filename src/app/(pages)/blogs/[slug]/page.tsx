import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Calendar, User, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';
import connectDB from '@/lib/util';
import Blog from '@/app/model/Blog';
import Script from 'next/script';

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface IBlog {
  _id: any;
  title: string;
  slug: string;
  description: string;
  content: string;
  author?: string;
  category?: string;
  image?: string;
  published: boolean;
  createdAt?: Date;
  date?: string | Date;
}

export async function generateStaticParams() {
  await connectDB();
  const blogs = await (Blog as any).find({ published: true }).select('slug').lean();
  return (blogs as any[]).map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  await connectDB();
  const resolvedParams = await params;
  const post = await (Blog as any).findOne({ slug: resolvedParams.slug, published: true }).lean() as IBlog | null;

  if (!post) {
    return {
      title: 'Post Not Found | Trackode Blog',
    };
  }

  const siteUrl = 'https://trackode.in';
  const postUrl = `${siteUrl}/blogs/${post.slug}`;

  return {
    title: `${post.title} | Trackode Insights`,
    description: post.description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: postUrl,
      type: 'article',
      publishedTime: post.createdAt?.toISOString(),
      authors: [post.author || 'Trackode Team'],
      siteName: 'Trackode',
      images: [
        {
          url: post.image || `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.image || `${siteUrl}/og-image.png`],
    },
    keywords: [post.category || 'Technology', 'Trackode blog', post.slug, 'coding articles'],
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  await connectDB();
  const resolvedParams = await params;
  const post = await (Blog as any).findOne({ slug: resolvedParams.slug, published: true }).lean() as IBlog | null;

  if (!post) {
    notFound();
  }

  // Article JSON-LD Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": post.image || "https://trackode.in/og-image.png",
    "datePublished": post.createdAt?.toISOString(),
    "author": {
      "@type": "Person",
      "name": post.author || "Aditya Upadhyay",
      "url": "https://trackode.in/profile/iamadityaupadhyay"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Trackode",
      "logo": {
        "@type": "ImageObject",
        "url": "https://trackode.in/trackode.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://trackode.in/blogs/${post.slug}`
    }
  };

  return (
    <article className="min-h-screen bg-white dark:bg-[#0f172a] py-24 px-6 relative">
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="max-w-3xl mx-auto">
        {/* Back Link */}
        <Link href="/blogs" className="inline-flex items-center gap-2 text-indigo-500 font-bold uppercase tracking-widest text-xs mb-10 hover:gap-4 transition-all">
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Link>
        
        {/* Post Meta */}
        <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px] mb-8">
            <span className="flex items-center gap-2 animate-fade-in"><Calendar className="w-3 h-3 text-indigo-500" /> {new Date(post.createdAt || post.date || "").toLocaleDateString()}</span>
            <span className="flex items-center gap-2"><User className="w-3 h-3 text-purple-500" /> By {post.author}</span>
            <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-pink-500" /> 5 Min Read</span>
        </div>

        <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-8 leading-[1.1] text-slate-900 dark:text-white">
          {post.title}
        </h1>

        <p className="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 italic mb-12 border-l-4 border-indigo-500 pl-8 leading-relaxed font-medium">
          {post.description}
        </p>

        {/* Content with beautiful typography */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-indigo-500 font-medium leading-relaxed"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Call to action within blog post */}
        <div className="my-16 p-8 lg:p-12 rounded-[2.5rem] bg-indigo-500 text-white text-center shadow-2xl shadow-indigo-500/30">
           <h3 className="text-3xl font-black mb-6">Want to try a personalized mock test?</h3>
           <p className="mb-10 opacity-90 font-medium">Clear your TCS NQT and Ninja interviews with confidence using our realistic AI environment.</p>
           <Link href="/signup" className="px-10 py-5 bg-white text-indigo-600 rounded-full font-black tracking-widest uppercase text-sm hover:scale-105 transition-transform inline-block">
             Start Test for Free
           </Link>
        </div>

        {/* Share Section */}
        <div className="mt-20 border-t border-slate-100 dark:border-slate-800 pt-12">
           <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Spread the Word</h4>
              <div className="flex items-center gap-4">
                 <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all"><Facebook className="w-4 h-4" /></button>
                 <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all"><Twitter className="w-4 h-4" /></button>
                 <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all"><Linkedin className="w-4 h-4" /></button>
                 <button className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white transition-all"><Share2 className="w-4 h-4" /></button>
              </div>
           </div>
        </div>
      </div>
    </article>
  );
}
