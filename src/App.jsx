// App.jsx - Enhanced with state management and localStorage
import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingCart, 
  Settings, 
  BarChart3, 
  Menu, 
  X,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Moon,
  Sun
} from 'lucide-react';

// Components
import Dashboard from './components/Dashboard';
import UsersPage from './components/UsersPage';
import ProductsPage from './components/ProductsPage';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load saved data from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode) {
      setDarkMode(savedDarkMode === 'true');
    }
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addNotification = (message, type = 'info') => {
    const newNotification = {
      id: Date.now(),
      message,
      type,
      time: new Date().toLocaleTimeString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'products', label: 'Products', icon: ShoppingCart },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <Dashboard addNotification={addNotification} />;
      case 'users':
        return <UsersPage addNotification={addNotification} />;
      case 'products':
        return <ProductsPage addNotification={addNotification} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'settings':
        return <SettingsPage darkMode={darkMode} setDarkMode={setDarkMode} addNotification={addNotification} />;
      default:
        return <Dashboard addNotification={addNotification} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-900">
        {/* Sidebar */}
        <aside 
          className={`${
            sidebarOpen ? 'w-64' : 'w-20'
          } bg-gradient-to-b from-indigo-900 to-indigo-800 dark:from-gray-900 dark:to-gray-800 text-white transition-all duration-300 fixed h-full z-20`}
        >
          <div className="flex items-center justify-between p-4 border-b border-indigo-700 dark:border-gray-700">
            {sidebarOpen && (
              <h1 className="text-xl font-bold">Admin Hub</h1>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-lg hover:bg-indigo-700 dark:hover:bg-gray-700 transition-colors"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          
          <nav className="mt-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    activeTab === item.id
                      ? 'bg-indigo-700 dark:bg-gray-700 border-r-4 border-white'
                      : 'hover:bg-indigo-700 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon size={20} />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} bg-gray-50 dark:bg-gray-950`}>
          {/* Header */}
          <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                >
                  {darkMode ? <Sun size={20} className="text-yellow-500" /> : <Moon size={20} />}
                </button>
                <div className="relative">
                  <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                      <div className="p-3 border-b dark:border-gray-700">
                        <h3 className="font-semibold">Notifications</h3>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <p className="p-4 text-center text-gray-500">No notifications</p>
                        ) : (
                          notifications.map(notif => (
                            <div key={notif.id} className="p-3 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                              <p className="text-sm">{notif.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="Admin"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden md:block">
                    <p className="text-sm font-medium dark:text-white">John Doe</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                  <ChevronDown size={16} className="hidden md:block dark:text-gray-400" />
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;