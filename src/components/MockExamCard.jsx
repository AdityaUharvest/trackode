import { useRouter } from "next/navigation";
import Image from "next/image";
import React from "react";

const MockExamCard = ({ exam, theme }) => {
  const router = useRouter();
  
  const handleCardClick = () => {
    router.push(`/free-mocks/${exam.id}`);
    console.log(exam.id);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="relative group cursor-pointer rounded-2xl overflow-hidden backdrop-blur-sm bg-gradient-to-br "
    >
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Optimized image container */}
      <div className="relative h-32 overflow-hidden">
        <Image
          src={exam.image}
          alt={exam.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          priority={false}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t to-transparent" />
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </div>
      
      {/* Content section */}
      <div className="p-5 relative z-10">
        <h3 className="text-lg font-bold mb-2 dark:text-white text-gray-800 dark:group-hover:text-violet-200 group-hover:text-gray-700 transition-colors duration-300 leading-tight">
          {exam.name}
        </h3>
        <p className="text-sm dark:text-violet-200/80 text-gray-800 dark:group-hover:text-violet-100 transition-colors duration-300 line-clamp-2">
          {exam.description}
        </p>
        
        {/* Glow effect on hover */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      {/* Sexy "New" badge */}
      <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-violet-500 to-blue-500 text-white shadow-lg shadow-violet-500/30 group-hover:shadow-violet-500/50 transition-all duration-300 group-hover:scale-110">
        <span className="relative z-10">NEW</span>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      {/* Corner accent */}
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-violet-500/20 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
};
export default MockExamCard;