interface Section {
  name: string;
  label: string;
}

interface SectionProgressProps {
  sections: any[];
  currentSection: string;
  answers: Record<string, Record<string, number>>;
  onChangeSection: (section: string) => void;
  theme?: string;
}

export function SectionProgress({
  sections,
  currentSection,
  answers,
  onChangeSection,
  theme = 'light'
}: SectionProgressProps) {
  const isDark = theme === 'dark';

  return (
    <div className={`${isDark ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} p-4 rounded-md shadow-sm border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
      <h3 className="font-medium mb-4 text-sm uppercase tracking-wider opacity-70">Sections</h3>
      <div className="space-y-2">
        {sections.map(section => {
          const isSubmitted = section.submitted;
          const isCurrent = section.name === currentSection;
          const isUnlocked = section.unlocked;
          
          return (
            <button
              key={section.name}
              onClick={() => isUnlocked && !isSubmitted && onChangeSection(section.name)}
              disabled={isCurrent || !isUnlocked || isSubmitted}
              className={`w-full text-left p-3 rounded-md flex justify-between items-center transition-all ${
                isCurrent
                  ? isDark ? 'bg-indigo-900/40 text-indigo-300 ring-1 ring-indigo-500/50' : 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200'
                  : isSubmitted
                  ? isDark ? 'bg-green-900/20 text-green-400 opacity-60' : 'bg-green-50 text-green-600 opacity-60'
                  : !isUnlocked
                  ? 'opacity-40 cursor-not-allowed'
                  : isDark ? 'hover:bg-gray-700 border border-transparent' : 'hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`text-sm font-medium`}>{section.label}</span>
              </div>
              {isSubmitted && (
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'}`}>
                  Completed
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}