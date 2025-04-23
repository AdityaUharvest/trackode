import { Modal } from "../ui/Modal";
import { useTheme } from "../ThemeContext";
import { AlertTriangle, Loader2 } from "lucide-react";
export function SubmitConfirmationModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  title, 
  message, 
  isSubmitting,
  isTimeUp = false
}:any) {
  const { theme } = useTheme();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className={`w-full max-w-md rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <h3 className={`text-xl font-bold mb-4 ${isTimeUp ? 'text-red-500' : ''}`}>
            {isTimeUp && <AlertTriangle className="inline-block mr-2 mb-1" size={20} />}
            {title}
          </h3>
          <p className="mb-6">{message}</p>
          <div className="flex justify-end gap-4">
            {!isTimeUp && (
              <button
                onClick={onClose}
                disabled={isSubmitting}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
              >
                Cancel
              </button>
            )}
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className={`px-4 py-2 rounded ${
                isTimeUp 
                ? theme === 'dark' ? 'bg-red-600 hover:bg-red-500' : 'bg-red-500 hover:bg-red-600' 
                : theme === 'dark' ? 'bg-blue-600 hover:bg-blue-500' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Submitting...</span>
                </div>
              ) : (
                isTimeUp ? 'Continue' : 'Submit'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}