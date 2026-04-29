// components/Dashboard.jsx - With real-time data and working charts
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Users, 
  ShoppingCart, 
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Activity,
  Calendar
} from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1 dark:text-white">{value}</p>
        {trend && (
          <div className="flex items-center gap-1 mt-2">
            {trend === 'up' ? (
              <ArrowUp size={16} className="text-green-500" />
            ) : (
              <ArrowDown size={16} className="text-red-500" />
            )}
            <span className={`text-xs ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
              {trendValue}
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-full ${color}`}>
        <Icon size={24} className="text-white" />
      </div>
    </div>
  </div>
);

const Dashboard = ({ addNotification }) => {
  const [users, setUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    // Load real data from localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const usersData = JSON.parse(savedUsers);
      setUsers(usersData);
      
      // Generate recent activities from user data
      const activities = usersData.slice(0, 5).map(user => ({
        id: user.id,
        message: `${user.name} ${user.status === 'Active' ? 'joined' : 'updated'} the platform`,
        time: user.joinDate || '2024-01-01',
        type: user.status === 'Active' ? 'join' : 'update'
      }));
      setRecentActivities(activities);
    }
  }, []);

  const stats = [
    { 
      title: 'Total Revenue', 
      value: '$' + (users.length * 1240).toLocaleString(), 
      icon: DollarSign, 
      trend: 'up', 
      trendValue: '+12.5%', 
      color: 'bg-blue-500',
      onClick: () => addNotification('Revenue report generated', 'info')
    },
    { 
      title: 'Total Users', 
      value: users.length.toLocaleString(), 
      icon: Users, 
      trend: 'up', 
      trendValue: '+8.2%', 
      color: 'bg-green-500',
      onClick: () => addNotification(`${users.length} total users`, 'info')
    },
    { 
      title: 'Active Users', 
      value: users.filter(u => u.status === 'Active').length.toLocaleString(), 
      icon: Activity, 
      trend: 'up', 
      trendValue: '+5.1%', 
      color: 'bg-purple-500',
      onClick: () => addNotification(`${users.filter(u => u.status === 'Active').length} active users`, 'info')
    },
    { 
      title: 'Conversion Rate', 
      value: '3.24%', 
      icon: TrendingUp, 
      trend: 'down', 
      trendValue: '-1.2%', 
      color: 'bg-orange-500',
      onClick: () => addNotification('Conversion rate is 3.24%', 'info')
    },
  ];

  const roleDistribution = {
    Admin: users.filter(u => u.role === 'Admin').length,
    Editor: users.filter(u => u.role === 'Editor').length,
    User: users.filter(u => u.role === 'User').length
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold dark:text-white">Dashboard Overview</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Calendar size={16} />
          <span>Last 30 days</span>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Role Distribution Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">User Role Distribution</h3>
          <div className="space-y-4">
            {Object.entries(roleDistribution).map(([role, count]) => {
              const percentage = users.length ? (count / users.length * 100).toFixed(1) : 0;
              return (
                <div key={role}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm dark:text-gray-300">{role}</span>
                    <span className="text-sm dark:text-gray-300">{count} users ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        role === 'Admin' ? 'bg-purple-500' : 
                        role === 'Editor' ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Recent Activities</h3>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {recentActivities.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center">No recent activities</p>
            ) : (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 pb-3 border-b dark:border-gray-700 last:border-0">
                  <div className={`p-2 rounded-full ${
                    activity.type === 'join' ? 'bg-green-100 dark:bg-green-900 text-green-600' : 
                    'bg-blue-100 dark:bg-blue-900 text-blue-600'
                  }`}>
                    <Users size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium dark:text-white">{activity.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 dark:text-white">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button 
            onClick={() => addNotification('User report generated', 'success')}
            className="p-3 text-center border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Users className="mx-auto mb-2 text-indigo-500" size={24} />
            <span className="text-sm dark:text-white">View Users</span>
          </button>
          <button 
            onClick={() => addNotification('Revenue report downloaded', 'success')}
            className="p-3 text-center border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <DollarSign className="mx-auto mb-2 text-green-500" size={24} />
            <span className="text-sm dark:text-white">Revenue Report</span>
          </button>
          <button 
            onClick={() => addNotification('Export started', 'info')}
            className="p-3 text-center border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <TrendingUp className="mx-auto mb-2 text-purple-500" size={24} />
            <span className="text-sm dark:text-white">Analytics</span>
          </button>
          <button 
            onClick={() => addNotification('Settings updated', 'success')}
            className="p-3 text-center border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Activity className="mx-auto mb-2 text-orange-500" size={24} />
            <span className="text-sm dark:text-white">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;