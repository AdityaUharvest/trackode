import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import connectDB from '@/lib/util';
import MockTest from '@/app/model/MoockTest';
import MockQuestion from '@/app/model/MockQuestions';
import {
  Clock, BookOpen, Target, ChevronRight, Play
} from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';
import mongoose from 'mongoose';

interface Props {
  params: Promise<{ shareCode: string }>;
}

/**
 * Types for the MockTest model result
 */
interface IMockTestLean {
  _id: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  durationMinutes: number;
  difficulty?: string;
  totalMarks?: number;
  instructions?: string;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB();
  const { shareCode } = await params;
  const mock = await MockTest.findOne({ shareCode }).lean() as IMockTestLean | null;
  if (!mock) return { title: 'Assessment' };

  return {
    title: `${mock.title} | Trackode`,
    description: mock.description || `Assessment simulation.`,
  };
}

export default async function MockDetailPage({ params }: Props) {
  await connectDB();
  const { shareCode } = await params;
  const mock = await MockTest.findOne({ shareCode }).lean() as IMockTestLean | null;

  if (!mock) {
    notFound();
  }

  const questionCount = await MockQuestion.countDocuments({ mockTestId: mock._id });
  const totalMarks = mock.totalMarks ?? questionCount;
  const difficulty = mock.difficulty || 'Intermediate';

  const instructions: string[] = (mock.instructions || '')
    .split('.')
    .map((s: string) => s.trim())
    .filter(Boolean);

  const steps = instructions.length > 0 ? instructions : [
    'Your quiz will be automatically submitted after 4 warnings',
    'Maintain a stable internet connection',
    'Do not switch browser tabs or minimize the window',
    'Submit before the timer reaches zero',
    'Results available immediately after completion'
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 font-sans selection:bg-indigo-100 transition-colors">
      <Script
        id="schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Course',
            name: mock.title,
            description: mock.description || `Assessment simulation.`,
            provider: { '@type': 'Organization', name: 'Trackode' },
          }),
        }}
      />

      {/* Nav */}
      <div className="border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-xs text-gray-400 font-medium uppercase tracking-tight">
            <Link href="/" className="hover:text-gray-900 transition-colors">Trackode</Link>
            <ChevronRight className="w-2.5 h-2.5 opacity-30" />
            <Link href="/mocks" className="hover:text-gray-900 transition-colors">Catalog</Link>
          </nav>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          <div className="lg:col-span-8 space-y-10">

            {/* Header Content */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800">
                  Proctored
                </span>
                <span className="px-1.5 py-0.5 rounded text-[11px] font-bold bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700">
                  {difficulty}
                </span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-gray-50 tracking-tight leading-tight uppercase">
                {mock.title}
              </h1>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-50 dark:border-gray-800">
                {[
                  { label: 'Duration', value: `${mock.durationMinutes}m`, icon: <Clock className="w-3.5 h-3.5" /> },
                  { label: 'Questions', value: questionCount, icon: <BookOpen className="w-3.5 h-3.5" /> },
                  { label: 'Score', value: totalMarks, icon: <Target className="w-3.5 h-3.5" /> }
                ].map((stat, i) => (
                  <div key={i} className="space-y-0.5">
                    <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400 tracking-wider uppercase">
                      {stat.icon} {stat.label}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps Content */}
            <div className="space-y-6 pt-4 border-t border-gray-50 dark:border-gray-800">
              <h3 className="text-base font-bold text-gray-900 dark:text-gray-50 uppercase tracking-tight">Examination Protocol</h3>
              <div className="space-y-3">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-sm font-bold text-gray-400">{i + 1}</span>
                    <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed font-medium">{step.trim()}.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 h-fit sticky top-8">
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-5 shadow-sm space-y-6">
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 uppercase">Assessment</h4>
                <p className="text-sm text-gray-500 leading-relaxed font-bold uppercase">Certificate issued instantly.</p>
              </div>

              <Link
                href={`/assessment/${shareCode}`}
                className="w-full p-3 h-11 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold text-sm transition-colors shadow-md shadow-indigo-500/10 uppercase tracking-widest"
              >
                <Play className="w-3.5 h-3.5 fill-white" /> Start Simulation
              </Link>

              <div className="pt-4 border-t border-gray-50 dark:border-gray-800 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase">
                  <span className="text-gray-400">Language</span>
                  <span className="text-gray-900 dark:text-gray-100">Standard EN</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase">
                  <span className="text-gray-400">Attempts</span>
                  <span className="text-gray-900 dark:text-gray-100">1</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase">
                  <span className="text-gray-400">Environment</span>
                  <span className="text-indigo-600 dark:text-indigo-400">Proctored</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}