interface Section {
  name: string;
  label: string;
}

interface SectionProgressProps {
  sections: Section[];
  currentSection: string;
  answers: Record<string, Record<string, number>>;
  onChangeSection: (section: string) => void;
}

export function SectionProgress({
  sections,
  currentSection,
  answers,
  onChangeSection
}: SectionProgressProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-medium mb-3">Sections</h3>
      <ul className="space-y-2">
        {sections.map(section => {
          const answeredCount = Object.keys(answers[section.name] || {}).length;
          const isCurrent = section.name === currentSection;
          const isCompleted = answeredCount > 0 && section.name !== currentSection;
          
          return (
            <li key={section.name}>
              <button
                onClick={() => onChangeSection(section.name)}
                disabled={isCurrent}
                className={`w-full text-left p-2 rounded flex justify-between items-center ${
                  isCurrent
                    ? 'bg-indigo-100 text-indigo-800'
                    : isCompleted
                    ? 'bg-green-50 text-green-800'
                    : 'hover:bg-gray-50'
                }`}
              >
                <span>{section.label}</span>
                {isCompleted && (
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    Completed
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}