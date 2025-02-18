const SkeletonLoader = ({ theme }) => {
    return (
      <div className={`flex mt-0 shadow-inner flex-col lg:flex-row min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-50' : 'bg-gray-50 text-gray-900'}`}>
        {/* Profile Section Skeleton */}
        <div className={` ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} sm:mt-5 ml-3 mb-4 rounded-xl p-2`}>
          <div className="animate-pulse">
            <div className="h-7 bg-gray-300 rounded  mb-4"></div>
            <div className="h-7 bg-gray-300 rounded  mb-4"></div>
            
          </div>
        </div>
  
    </div>
    );
  };
export default SkeletonLoader;