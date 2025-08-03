export default function TransactionDetailModal({ open, onClose, transaction }) {
  if (!open || !transaction) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 min-w-[350px] max-w-[90vw]">
        <h2 className="text-xl font-bold mb-4">Chi tiết giao dịch</h2>
        <div className="mb-2"><b>User:</b> {transaction.user?.name || transaction.user}</div>
        <div className="mb-2"><b>Loại:</b> {transaction.type}</div>
        <div className="mb-2"><b>Số tiền:</b> {transaction.amount}</div>
        <div className="mb-2"><b>Trạng thái:</b> {transaction.status}</div>
        <div className="mb-2"><b>Gói đầu tư:</b> {transaction.package?.name || "-"}</div>
        <div className="mb-2"><b>Ghi chú:</b> {transaction.note}</div>
        <div className="mb-2"><b>Ngày tạo:</b> {new Date(transaction.createdAt).toLocaleString()}</div>
        
        {transaction.proofImage && (
          <div className="mb-4">
            <b>Hình ảnh xác thực:</b><br/>
            <div className="mt-2">
              <img
                src={transaction.proofImage}
                alt="Proof Image"
                className="max-w-full max-h-64 rounded border"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden text-center py-8 text-gray-500 border rounded">
                <div>Không thể hiển thị hình ảnh</div>
                <a 
                  href={transaction.proofImage} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Xem hình ảnh
                </a>
              </div>
            </div>
          </div>
        )}
        
        {transaction.bankInfo && (
          <div className="mb-2">
            <b>Thông tin nhận tiền:</b><br/>
            Ngân hàng: {transaction.bankInfo.bankName}<br/>
            Số TK: {transaction.bankInfo.accountNumber}<br/>
            Chủ TK: {transaction.bankInfo.accountName}
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onClose}>Đóng</button>
        </div>
      </div>
    </div>
  );
} 