// components/SettingsPage.jsx - With working localStorage persistence
import React, { useState, useEffect } from 'react';
import { Save, Bell, Lock, Palette, Globe, Volume2, VolumeX, Mail, Shield } from 'lucide-react';

const SettingsPage = ({ darkMode, setDarkMode, addNotification }) => {
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: true,
    twoFactorAuth: false,
    language: 'English',
    theme: 'Light',
    soundEnabled: true,
    emailNotifications: true,
    pushNotifications: false
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleToggle = (setting) => {
    setSettings(prev => {
      const newSettings = { ...prev, [setting]: !prev[setting] };
      return newSettings;
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    localStorage.setItem('appSettings', JSON.stringify(settings));
    localStorage.setItem('darkMode', settings.theme === 'Dark' ? 'true' : 'false');
    setDarkMode(settings.theme === 'Dark');
    addNotification('Settings saved successfully!', 'success');
  };

  const handleReset = () => {
    const defaultSettings = {
      notifications: true,
      emailAlerts: true,
      twoFactorAuth: false,
      language: 'English',
      theme: 'Light',
      soundEnabled: true,
      emailNotifications: true,
      pushNotifications: false
    };
    setSettings(defaultSettings);
    addNotification('Settings reset to default', 'info');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 dark:text-white">Settings</h2>
      
      <div className="max-w-2xl space-y-6">
        {/* Appearance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette size={24} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold dark:text-white">Appearance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Theme</label>
              <select
                name="theme"
                value={settings.theme}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System Default</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-2">Language</label>
              <select
                name="language"
                value={settings.language}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              >
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
                <option>German</option>
                <option>Chinese</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={24} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold dark:text-white">Notifications</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-700 dark:text-gray-300">Browser Notifications</span>
                <p className="text-xs text-gray-500">Show notifications in your browser</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => handleToggle('notifications')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <div className={`toggle-bg w-12 h-6 rounded-full transition-colors ${settings.notifications ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              </div>
            </label>
            
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-700 dark:text-gray-300">Email Alerts</span>
                <p className="text-xs text-gray-500">Receive email notifications</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.emailAlerts}
                  onChange={() => handleToggle('emailAlerts')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <div className={`toggle-bg w-12 h-6 rounded-full transition-colors ${settings.emailAlerts ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              </div>
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-gray-700 dark:text-gray-300">Sound Effects</span>
                <p className="text-xs text-gray-500">Play sounds for notifications</p>
              </div>
              <div className="relative inline-block w-12 align-middle select-none">
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={() => handleToggle('soundEnabled')}
                  className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <div className={`toggle-bg w-12 h-6 rounded-full transition-colors ${settings.soundEnabled ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
              </div>
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock size={24} className="text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-lg font-semibold dark:text-white">Security</h3>
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <span className="text-gray-700 dark:text-gray-300">Two-Factor Authentication</span>
              <p className="text-xs text-gray-500">Add an extra layer of security</p>
            </div>
            <div className="relative inline-block w-12 align-middle select-none">
              <input
                type="checkbox"
                checked={settings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
                className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
              />
              <div className={`toggle-bg w-12 h-6 rounded-full transition-colors ${settings.twoFactorAuth ? 'bg-indigo-600' : 'bg-gray-300'}`}></div>
            </div>
          </label>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Save size={18} />
            Save Changes
          </button>
          <button 
            onClick={handleReset}
            className="px-6 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Reset to Default
          </button>
        </div>
      </div>

      <style>{`
        .toggle-checkbox:checked {
          right: 0;
          border-color: #4f46e5;
        }
        .toggle-checkbox:checked + .toggle-bg {
          background-color: #4f46e5;
        }
        .toggle-checkbox {
          right: 0;
          transition: all 0.3s;
        }
        .toggle-checkbox:checked {
          right: auto;
          left: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default SettingsPage;