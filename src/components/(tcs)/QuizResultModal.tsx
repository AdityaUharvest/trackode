import { Modal } from "../ui/Modal";

export function QuizResultModal({
  isOpen,
  onClose,
  quizId
}: {
  isOpen: boolean;
  onClose: () => void;
  quizId: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-2">Quiz Submitted Successfully!</h3>
        <p className="text-gray-600 mb-6">
          Your answers have been recorded. You can view your results when they become available.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Finish
          </button>
        </div>
      </div>
    </Modal>
  );
}