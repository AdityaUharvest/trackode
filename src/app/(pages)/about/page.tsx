"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Target, Users, Code, BookOpen, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeContext';

const blogPosts = [
  {
    title: "How AI is Revolutionizing Technical Interview Preparation",
    excerpt: "Discover how personalized AI agents are helping developers bridge the gap between learning and landing their dream job.",
    date: "March 15, 2024",
    author: "Aditya Upadhyay",
    category: "Technology",
    image: "/tech-blog.jpg"
  },
  {
    title: "Mastering Data Structures with Adaptive Quizzes",
    excerpt: "Why fixed questionnaires are a thing of the past and how adaptive learning paths accelerate knowledge retention.",
    date: "March 10, 2024",
    author: "Trackode Team",
    category: "Education",
    image: "/edu-blog.jpg"
  },
  {
    title: "Top 10 Backend Concepts Every Junior Developer Should Know",
    excerpt: "A comprehensive guide to scaling services, understanding databases, and mastering the modern backend stack.",
    date: "March 5, 2024",
    author: "Aditya Upadhyay",
    category: "Career",
    image: "/career-blog.jpg"
  }
];

export default function AboutPage() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-white text-slate-900'} overflow-hidden`}>
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 lg:pt-32 lg:pb-24">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-indigo-500/10 text-indigo-500 text-sm font-bold tracking-widest uppercase mb-6 inline-block">
              Our Vision
            </span>
            <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 leading-[1.1]">
              Democratizing <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 italic">AI-Powered</span> Learning
            </h1>
            <p className="text-lg lg:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Trackode was born out of a simple idea: that every developer deserves a personalized mentor. We leverage cutting-edge AI to create adaptive learning paths that actually stick.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats/Featuer Section */}
      <section className="py-16 px-6 relative">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: <Target className="w-6 h-6" />, title: "Precision", desc: "AI-generated questions tailored to your weak points." },
            { icon: <Users className="w-6 h-6" />, title: "Community", desc: "Thousands of developers tracking their growth daily." },
            { icon: <Sparkles className="w-6 h-6" />, title: "Intelligence", desc: "Smart roadmaps that evolve with your progress." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className={`p-8 rounded-3xl border border-slate-200 dark:border-slate-800 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-slate-50/50'} backdrop-blur-xl`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <h2 className="text-4xl lg:text-5xl font-black mb-8">The <span className="text-indigo-500">Trackode</span> Story</h2>
            <div className="space-y-6 text-slate-500 dark:text-slate-400 leading-relaxed text-lg">
              <p>
                In a world where technology moves at light speed, traditional education often falls behind. We saw talented individuals struggling to stay current, overwhelmed by static tutorials and generic tests.
              </p>
              <p>
                Founded by <span className="text-slate-900 dark:text-white font-bold italic">Aditya Upadhyay</span>, Trackode started as a small tool to help college friends track their coding progress. Today, it has evolved into a comprehensive AI platform that powers thousands of quizzes and realistic mock examinations.
              </p>
              <div className="flex gap-4 pt-4">
                <a href="https://github.com/iamadityaupadhyay" className="hover:text-indigo-500 transition-colors"><Github /></a>
                <a href="https://twitter.com/iam_adiupadhyay" className="hover:text-indigo-500 transition-colors"><Twitter /></a>
                <a href="https://www.linkedin.com/in/iamadityaupadhyay/" className="hover:text-indigo-500 transition-colors"><Linkedin /></a>
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-3xl blur-2xl opacity-20" />
            <img 
              src="/brand-dark.png" 
              alt="Trackode Branding" 
              className="relative w-full max-w-md mx-auto rounded-3xl shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700"
            />
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-24 px-6 bg-slate-50/30 dark:bg-slate-900/30 border-y border-slate-100 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-indigo-500 font-bold uppercase tracking-widest text-sm mb-4 block">Knowledge Hub</span>
              <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Latest from the <span className="text-indigo-500 italic">Blog</span></h2>
            </div>
            <Link href="/" className="hidden md:flex items-center gap-2 group text-indigo-500 font-bold text-sm tracking-widest uppercase pb-2 border-b-2 border-indigo-500 hover:text-indigo-400 transition-colors">
              Explore All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts.map((post, idx) => (
              <motion.article
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className={`group flex flex-col rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white'} transition-all hover:shadow-2xl hover:shadow-indigo-500/10 transform hover:-translate-y-2`}
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-indigo-500 opacity-20 group-hover:opacity-10 transition-opacity z-10" />
                  <div className="absolute top-4 left-4 z-20">
                    <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-black uppercase tracking-widest text-indigo-600 shadow-sm">
                      {post.category}
                    </span>
                  </div>
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-slate-400 opacity-30" />
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="text-xs text-slate-400 mb-4 font-bold tracking-widest uppercase flex items-center gap-2">
                    {post.date} <span className="w-1 h-1 rounded-full bg-indigo-500" /> {post.author}
                  </div>
                  <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-indigo-500 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center gap-2 text-indigo-500 font-black text-xs tracking-widest uppercase group-hover:gap-4 transition-all">
                    Read More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600 blur-[100px] rounded-full opacity-20 -z-10 animate-pulse" />
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl lg:text-6xl font-black mb-8 leading-tight">Ready to Level Up Your <span className="text-indigo-500">Career?</span></h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-2xl mx-auto">
            Join thousands of developers who are using Trackode to master their skills and land their dream jobs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 lg:gap-6">
            <Link 
              href="/signup" 
              className="px-10 py-5 rounded-full bg-indigo-600 text-white font-black tracking-widest uppercase text-sm hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 active:scale-95"
            >
              Start for Free
            </Link>
            <Link 
              href="/pricing" 
              className="px-10 py-5 rounded-full border-2 border-slate-200 dark:border-slate-800 font-black tracking-widest uppercase text-sm hover:border-indigo-500 transition-all active:scale-95"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
