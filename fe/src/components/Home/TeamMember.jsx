import React, { useState, useEffect } from 'react'
import { UsersIcon } from '@heroicons/react/24/outline'
import { UserCircleIcon } from '@heroicons/react/24/solid'
import axios from 'axios'

const TeamMember = () => {
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
const baseUrl = 'https://jbs-invest.onrender.com'
 useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/team-members/public`);
        setTeamMembers(response.data);
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  const getColorClass = (color) => {
    const colorMap = {
      blue: "bg-blue-600",
      green: "bg-green-600", 
      red: "bg-red-600",
      purple: "bg-purple-600",
      orange: "bg-orange-600",
      pink: "bg-pink-600"
    };
    return colorMap[color] || "bg-blue-600";
  };



  return (
    <div className="container mx-auto px-2 md:px-4 py-4">
        <div className=" rounded-xl p-2 md:p-8">
          <div className="flex items-center mb-6 justify-center">
           
            <h2 className="text-3xl font-bold text-gray-800 text-center">Đội ngũ lãnh đạo</h2>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải thông tin đội ngũ...</p>
            </div>
          ) : teamMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8">
              {teamMembers.map((member) => (
                <div key={member._id} className="bg-white rounded-xl p-4 md:p-6 shadow-md">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`flex-shrink-0 w-20 h-20 ${getColorClass(member.color)} rounded-full flex items-center justify-center`}>
                      {member.avatar ? (
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="w-20 h-20 text-white" />
                      )}
                    </div>
                    <div className='flex flex-col items-start justify-start gap-1'>
                      <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                      <p className={`text-sm italic md:text-base text-${member.color}-600`}>{member.position}</p>
                      <p className="text-sm md:text-base text-gray-600">{member.title}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{member.description}</p>
                  
                  {member.experience && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Kinh nghiệm:</span> {member.experience}
                      </p>
                    </div>
                  )}
                  
                  {member.achievements && member.achievements.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-800 mb-2">Thành tích:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {member.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Chưa có thông tin đội ngũ</p>
            </div>
          )}
        </div>
      </div>
    )
  }


export default TeamMember;