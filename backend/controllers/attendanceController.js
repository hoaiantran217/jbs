const Attendance = require('../models/Attendance');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Điểm danh hàng ngày
const checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt về 00:00:00

    // Kiểm tra xem đã điểm danh hôm nay chưa
    const existingAttendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (existingAttendance) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã điểm danh hôm nay rồi!'
      });
    }

    // Xác định số tiền nhận được
    const dayOfWeek = today.getDay(); // 0 = Chủ nhật, 6 = Thứ 7
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const amount = isWeekend ? 10000 : 5000; // 10k cho cuối tuần, 5k cho ngày thường

    // Tạo bản ghi điểm danh
    const attendance = new Attendance({
      user: userId,
      date: today,
      amount: amount,
      isWeekend: isWeekend
    });

    await attendance.save();

    // Cập nhật balance của user
    const user = await User.findById(userId);
    user.balance += amount;
    user.withdrawable += amount;
    await user.save();

    // Tạo transaction record
    const transaction = new Transaction({
      user: userId,
      type: 'deposit',
      amount: amount,
      status: 'approved',
      note: `Điểm danh ${isWeekend ? 'cuối tuần' : 'hàng ngày'} - ${amount.toLocaleString('vi-VN')} VNĐ`
    });

    await transaction.save();

    res.json({
      success: true,
      message: `Điểm danh thành công! Bạn nhận được ${amount.toLocaleString('vi-VN')} VNĐ`,
      data: {
        amount: amount,
        isWeekend: isWeekend,
        newBalance: user.balance
      }
    });

  } catch (error) {
    console.error('Lỗi điểm danh:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi điểm danh'
    });
  }
};

// Lấy lịch sử điểm danh
const getAttendanceHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const attendances = await Attendance.find({ user: userId })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'name email');

    const total = await Attendance.countDocuments({ user: userId });

    res.json({
      success: true,
      data: {
        attendances,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });

  } catch (error) {
    console.error('Lỗi lấy lịch sử điểm danh:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy lịch sử điểm danh'
    });
  }
};

// Kiểm tra trạng thái điểm danh hôm nay
const getTodayStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayAttendance = await Attendance.findOne({
      user: userId,
      date: {
        $gte: today,
        $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    const dayOfWeek = today.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const todayAmount = isWeekend ? 10000 : 5000;

    res.json({
      success: true,
      data: {
        hasCheckedIn: !!todayAttendance,
        todayAmount: todayAmount,
        isWeekend: isWeekend,
        dayName: ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek]
      }
    });

  } catch (error) {
    console.error('Lỗi kiểm tra trạng thái điểm danh:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi kiểm tra trạng thái điểm danh'
    });
  }
};

// Lấy thống kê điểm danh
const getAttendanceStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      dateFilter = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    const attendances = await Attendance.find({
      user: userId,
      ...dateFilter
    });

    const totalAmount = attendances.reduce((sum, att) => sum + att.amount, 0);
    const weekendCount = attendances.filter(att => att.isWeekend).length;
    const weekdayCount = attendances.length - weekendCount;

    res.json({
      success: true,
      data: {
        totalDays: attendances.length,
        totalAmount: totalAmount,
        weekendCount: weekendCount,
        weekdayCount: weekdayCount,
        averagePerDay: attendances.length > 0 ? Math.round(totalAmount / attendances.length) : 0
      }
    });

  } catch (error) {
    console.error('Lỗi lấy thống kê điểm danh:', error);
    res.status(500).json({
      success: false,
      message: 'Có lỗi xảy ra khi lấy thống kê điểm danh'
    });
  }
};

module.exports = {
  checkIn,
  getAttendanceHistory,
  getTodayStatus,
  getAttendanceStats
};