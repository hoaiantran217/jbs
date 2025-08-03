import { useEffect, useState } from "react";
import axios from "axios";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const BASE_URL = 'https://jbs-invest.onrender.com';
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/notifications`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setNotifications(res.data);
      } catch (err) {
        setError("Không thể tải danh sách thông báo");
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="p-4 w-full bg-white rounded-lg shadow-md min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Danh sách thông báo</h1>
      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Tiêu đề</th>
              <th className="border px-4 py-2">Nội dung</th>
              <th className="border px-4 py-2">Ngày gửi</th>
              <th className="border px-4 py-2">Người gửi</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((n) => (
              <tr key={n._id}>
                <td className="border px-4 py-2">{n.title}</td>
                <td className="border px-4 py-2">{n.content}</td>
                <td className="border px-4 py-2">{new Date(n.createdAt).toLocaleString()}</td>
                <td className="border px-4 py-2">{n.sender?.name || n.sender || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
} 