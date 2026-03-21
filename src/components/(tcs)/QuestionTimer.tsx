interface QuestionTimerProps {
  timeRemaining: number;
  onTimeUp: () => void;
  theme?: string;
}

export function QuestionTimer({
  timeRemaining,
  onTimeUp,
  theme = 'light'
}: QuestionTimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const isDark = theme === 'dark';

  return (
    <div className={`flex items-center px-4 py-2 rounded-md ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
      <span className={`mr-2 text-xs uppercase tracking-wider font-semibold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Time Left</span>
      <span className={`font-mono text-base font-bold w-[60px] text-center ${
        timeRemaining < 60 
          ? 'text-red-500 animate-pulse' 
          : isDark ? 'text-indigo-400' : 'text-indigo-600'
      }`}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
}