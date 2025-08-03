import React, { useState, useEffect } from 'react';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AttendanceCard = () => {
  const [todayStatus, setTodayStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodayStatus();
  }, []);

  const fetchTodayStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/attendance/today-status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodayStatus(response.data.data);
    } catch (error) {
      console.error('Lỗi lấy trạng thái điểm danh:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  if (!todayStatus) {
    return null;
  }

  return (
    <Link to="/attendance" className="block">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-4 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 w-full">
        <div className="flex items-start md:items-center md:flex-row flex-col md:justify-between">
          <div className="flex flex-row items-center space-x-2">
            <CalendarDaysIcon className="w-6 h-6 text-white" />
            <h3 className="font-semibold text-xs md:text-lg">Điểm danh hằng ngày</h3>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AttendanceCard;