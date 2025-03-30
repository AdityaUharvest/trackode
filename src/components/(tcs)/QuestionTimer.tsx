export function QuestionTimer({
    timeRemaining,
    onTimeUp
  }: {
    timeRemaining: number;
    onTimeUp: () => void;
  }) {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
  
    return (
      <div className="flex items-center">
        <span className="mr-2 text-gray-600">Time:</span>
        <span className={`font-mono font-medium ${
          timeRemaining < 60 ? 'text-red-600' : 'text-gray-800'
        }`}>
          {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
    );
  }