import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/20 py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Skeleton */}
        <Skeleton className="h-[432px] lg:h-[480px] rounded-[3rem] mb-20" />
        
        {/* Blog Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col w-full rounded-[2.5rem] p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm h-[480px]">
               <Skeleton className="h-56 rounded-[2rem] bg-slate-100 dark:bg-slate-800 mb-6" />
               <div className="px-4 pb-4 space-y-4">
                  <div className="flex gap-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="mt-8">
                    <Skeleton className="h-4 w-24" />
                  </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
