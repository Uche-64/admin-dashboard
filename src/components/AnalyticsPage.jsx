// components/AnalyticsPage.jsx
import React from 'react';
import { TrendingUp, Users, ShoppingCart, DollarSign } from 'lucide-react';

const AnalyticsPage = () => {
  const metrics = [
    { label: 'Total Visits', value: '124,567', change: '+23%', icon: TrendingUp, color: 'text-blue-600' },
    { label: 'Unique Visitors', value: '89,234', change: '+15%', icon: Users, color: 'text-green-600' },
    { label: 'Total Orders', value: '15,234', change: '+8%', icon: ShoppingCart, color: 'text-purple-600' },
    { label: 'Conversion Rate', value: '3.24%', change: '-1.2%', icon: DollarSign, color: 'text-orange-600' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-gray-500 text-sm">{metric.label}</p>
                <Icon className={metric.color} size={24} />
              </div>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className={`text-sm mt-2 ${metric.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {metric.change} from last month
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Traffic Overview</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Traffic Chart Component</p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between pb-2 border-b">
                <div>
                  <p className="font-medium">Product {item}</p>
                  <p className="text-sm text-gray-500">Category {item}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${(Math.random() * 1000).toFixed(0)}</p>
                  <p className="text-sm text-green-500">+{Math.floor(Math.random() * 30)}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;