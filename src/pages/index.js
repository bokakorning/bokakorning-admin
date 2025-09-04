import React, { useState } from 'react';
import { Users, BookOpen, Calendar, CheckCircle, XCircle, Plus, Bell, Eye } from 'lucide-react';

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState('20th Aug');

  const statsCards = [
    { title: 'Total Students', value: '325', icon: Users, color: 'bg-blue-100' },
    { title: 'Total Instructors', value: '46', icon: Users, color: 'bg-blue-100' },
    { title: 'Active Bookings', value: '200', icon: Calendar, color: 'bg-blue-100' },
    { title: 'Completed Lessons', value: '150', icon: CheckCircle, color: 'bg-blue-100' },
    { title: 'Cancelled Lessons', value: '50', icon: XCircle, color: 'bg-blue-100' }
  ];

  const bookingsData = [
    { date: '11th Aug', percentage: 80 },
    { date: '12th Aug', percentage: 40 },
    { date: '13th Aug', percentage: 70 },
    { date: '14th Aug', percentage: 60 },
    { date: '15th Aug', percentage: 80 },
    { date: '16th Aug', percentage: 45 },
    { date: '17th Aug', percentage: 70 },
    { date: '18th Aug', percentage: 55 },
    { date: '19th Aug', percentage: 85 },
    { date: '20th Aug', percentage: 65 }
  ];

  const upcomingLessons = [
    {
      id: 1,
      studentName: 'Sarah Johnson',
      instructorName: 'Mike Wilson',
      date: '20th August',
      time: '2:00 PM',
      studentAvatar: '👩‍🎓',
      instructorAvatar: '👨‍🏫'
    },
    {
      id: 2,
      studentName: 'Alex Chen',
      instructorName: 'Lisa Brown',
      date: '20th August',
      time: '2:00 PM',
      studentAvatar: '👨‍🎓',
      instructorAvatar: '👩‍🏫'
    },
    {
      id: 3,
      studentName: 'Emma Davis',
      instructorName: 'John Smith',
      date: '20th August',
      time: '3:00 PM',
      studentAvatar: '👩‍🎓',
      instructorAvatar: '👨‍🏫'
    }
  ];

  const topInstructors = [
    { name: 'Ron Title', rating: '4.8', avatar: '👨‍🏫' },
    { name: 'Lisa Chen', rating: '4.8', avatar: '👩‍🏫' },
    { name: 'Mike Johnson', rating: '4.8', avatar: '👨‍🏫' },
    { name: 'Sarah Wilson', rating: '4.8', avatar: '👩‍🏫' }
  ];

  const recentActivity = [
    { text: 'Student X booked lesson with Instructor Y', avatar: '👩‍🎓', time: '2 min ago' },
    { text: 'Instructor X cancelled a lesson', avatar: '👨‍🏫', time: '5 min ago' },
    { text: 'Payment received from Student X', avatar: '👩‍🎓', time: '10 min ago' }
  ];

  const quickActions = [
    { title: 'Add Student', icon: Plus, color: 'bg-blue-100 hover:bg-blue-200' },
    { title: 'Add Instructor', icon: Plus, color: 'bg-blue-100 hover:bg-blue-200' },
    { title: 'Create Booking', icon: Plus, color: 'bg-blue-100 hover:bg-blue-200' },
    { title: 'Send Notification', icon: Bell, color: 'bg-blue-100 hover:bg-blue-200' }
  ];

  return (
    <div className="min-h-screen p-6 " >
      <div className="max-w-7xl mx-auto space-y-6 overflow-y-scroll h-screen scrollbar-hide pb-32">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statsCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className={`bg-[#4EB0CF4D] rounded-[20px] p-4.5 shadow-sm`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-600 mb-2">{card.title}</h3>
                    <p className="text-2xl font-bold text-gray-800">{card.value}</p>
                  </div>
                  <IconComponent className="h-6 w-6 text-gray-600" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bookings This Week */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings This Week</h3>
            <div className="space-y-3">
              {bookingsData.map((booking, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-16">{booking.date}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-300 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${booking.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Lessons */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Upcoming Lessons</h3>
              <button className="flex items-center text-sm text-gray-600 hover:text-gray-800">
                <span className="mr-1">View</span>
                <Eye className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {upcomingLessons.map((lesson) => (
                <div key={lesson.id} className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-xs text-gray-600">Student</p>
                        <div className="flex items-center space-x-2">
                          {/* <span className="text-xl">{lesson.studentAvatar}</span> */}
                          <img src='./man.jpg' className='w-9 h-full object-cover rounded-full' />
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Instructor</p>
                        <div className="flex items-center space-x-2">
                          <img src='./man.jpg' className='w-9 h-full object-cover rounded-full' />
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Date: {lesson.date}</p>
                      <p className="text-xs text-gray-600">Time: {lesson.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Instructors */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Instructors</h3>
            <div className="space-y-3">
              {topInstructors.map((instructor, index) => (
                <div key={index} className="bg-blue-50 rounded-xl p-3 flex items-center space-x-3">
                  <img src='./man.jpg' className='w-9 h-full object-cover rounded-full' />
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{instructor.name}</p>
                    <p className="text-sm text-gray-600">Avg. Rating: {instructor.rating} ⭐</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity Feed */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity Feed</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="bg-blue-50 rounded-xl p-4 flex items-center space-x-3">
                  <img src='./man.jpg' className='w-10 h-full object-cover rounded-full' />
                  <div className="flex-1">
                    <p className="text-sm text-gray-800 italic">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-6 mt-8">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <button
                    key={index}
                    className={`${action.color} cursor-pointer rounded-xl p-4 flex flex-col items-center space-y-2 transition-colors duration-200`}
                  >
                    <IconComponent className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-800">{action.title}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;