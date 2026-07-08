interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-[#5A4032]">
          🗑 {title}
        </h2>

        <p className="mt-4 text-gray-600">
          {message}
        </p>

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onCancel}
            className="px-5 py-2 rounded-xl border hover:bg-gray-100"
          >
            {cancelText}
          </button>

          <button
            onClick={onConfirm}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}