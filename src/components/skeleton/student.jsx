export default function SkeletonLoader({ theme }) {
    return (
      <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'} p-8`}>
        <div className="mx-auto">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-48"></div>
            </div>
            <div className="animate-pulse">
              <div className="h-10 w-10 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
  
          {/* Tabs Skeleton */}
          <div className="animate-pulse">
            <div className="h-12 bg-gray-300 rounded-lg w-64 mb-6"></div>
          </div>
  
          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-32 bg-gray-300 rounded-lg"></div>
              </div>
            ))}
          </div>
  
          {/* Recent Activity Skeleton */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-48 mb-4"></div>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gray-300"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
