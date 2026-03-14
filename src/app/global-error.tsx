'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('Unhandled global error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <p className="mb-3 rounded-full border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-xs uppercase tracking-wide text-rose-300">
            Something went wrong
          </p>

          <h1 className="mb-4 text-3xl font-bold sm:text-4xl">
            Unexpected application error
          </h1>

          <p className="mb-8 max-w-xl text-sm text-slate-300 sm:text-base">
            We are trying from our end, Sorry for the inconvenience. Please try again later or contact support if the issue persists.
          </p>

          {error?.digest && (
            <p className="mb-8 text-xs text-slate-400">Reference: {error.digest}</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="rounded-lg bg-indigo-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-600"
            >
              Try again
            </button>

            <Link
              href="/"
              className="rounded-lg border border-slate-700 px-5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-slate-900"
            >
              Go to home
            </Link>
          </div>
        </main>
      </body>
    </html>
  );
}
