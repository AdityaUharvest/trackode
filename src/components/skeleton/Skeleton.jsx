const SkeletonLoader = ({ theme }) => {
    return (
      <div className={`flex mt-0 shadow-inner flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-800 text-gray-50' : 'bg-gray-400 text-gray-900'}`}>
        {/* Profile Section Skeleton */}
        <div className={`lg:w-1/3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} sm:mt-5 ml-3 mb-4 rounded-xl p-2`}>
          <div className="animate-pulse">
            <div className="h-52 bg-gray-400 rounded  mb-4"></div>
            <div className="h-32 bg-gray-400 rounded  mb-4"></div>
            <div className="h-32 bg-gray-400 rounded  mb-4"></div>
          </div>
        </div>
  
        {/* Dashboard Content Skeleton */}
        <div className={`lg:w-3/4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} sm:mt-5 mr-3 mb-4 rounded-xl p-2 flex flex-col`}>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-400 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-20 bg-gray-400 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="h-64 bg-gray-400 rounded"></div>
              <div className="h-64 bg-gray-400 rounded"></div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="h-48 bg-gray-400 rounded"></div>
              <div className="lg:col-span-2 h-48 bg-gray-400 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
export default SkeletonLoader;