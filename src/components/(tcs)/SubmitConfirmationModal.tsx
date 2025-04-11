import { Modal } from "../ui/Modal";

export function SubmitConfirmationModal({
  isOpen,
  onClose,
  onSubmit,
  title,
  message,
  isSubmitting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  message: string;
  isSubmitting: boolean;

}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            disabled={isSubmitting}
          >
           {isSubmitting?"Submitting":"Submit"} 
          </button>
        </div>
      </div>
    </Modal>
  );
}