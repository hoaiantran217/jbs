export default function ConfirmModal({ open, onClose, onConfirm, message, confirmText = "Xác nhận" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 min-w-[320px]">
        <div className="mb-4">{message}</div>
        <div className="flex justify-end gap-2">
          <button className="px-4 py-2 rounded bg-gray-200" onClick={onClose}>Huỷ</button>
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onConfirm}>{confirmText}</button>
        </div>
      </div>
    </div>
  );
} 