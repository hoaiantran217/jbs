const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const notification = new Notification({ ...req.body, sender: req.user.id });
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ message: 'Tạo thông báo thất bại', error: err.message });
  }
};

exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().populate('sender', 'name email');
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id).populate('sender', 'name email');
    if (!notification) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.id);
    if (!notification) return res.status(404).json({ message: 'Không tìm thấy thông báo' });
    res.json({ message: 'Đã xóa thông báo' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server' });
  }
}; 