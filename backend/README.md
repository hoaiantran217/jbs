# Zuna Invest Backend API

## Authentication

- `POST /api/auth/register` — Đăng ký user mới
- `POST /api/auth/login` — Đăng nhập, trả về JWT

## User

- `GET /api/user` — Lấy danh sách user (admin)
- `GET /api/user/profile` — Lấy thông tin user hiện tại
- `PUT /api/user/:id` — Sửa thông tin user (admin)
- `DELETE /api/user/:id` — Xóa user (admin)
- `PATCH /api/user/:id/active` — Khóa/mở user (admin)

## Investment Packages

- `GET /api/packages` — Lấy danh sách gói đầu tư
- `POST /api/packages` — Tạo gói đầu tư (admin)
- `PUT /api/packages/:id` — Sửa gói đầu tư (admin)
- `DELETE /api/packages/:id` — Xóa gói đầu tư (admin)

## Transactions

- `GET /api/transactions` — Lấy tất cả giao dịch (admin)
- `GET /api/transactions/me` — Lấy giao dịch của user hiện tại
- `POST /api/transactions` — Tạo giao dịch (nạp/rút/đầu tư)
- `PATCH /api/transactions/:id/approve` — Duyệt giao dịch (admin)

## Auth Middleware

- Các route cần token: gửi header `Authorization: Bearer <token>`
- Các route admin cần user có role `admin`

## Ghi chú

- Các API khác như Posts, Notifications, Investments cần bổ sung nếu muốn sử dụng.
- Đảm bảo file `.env` có biến `MONGO_URI`, `JWT_SECRET`, `PORT`.
