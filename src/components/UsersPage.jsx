// components/UsersPage.jsx - Fully functional with CRUD operations
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Mail, Phone, MapPin, CheckCircle, XCircle, Download, Trash2 as TrashAll } from 'lucide-react';
import UserForm from './UserForm';

const UsersPage = ({ addNotification }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [users, setUsers] = useState([]);

  // Load users from localStorage
  useEffect(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Default users
      const defaultUsers = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active', phone: '+1 234 567 890', location: 'New York', joinDate: '2024-01-15' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'User', status: 'Active', phone: '+1 234 567 891', location: 'Los Angeles', joinDate: '2024-02-20' },
        { id: 3, name: 'Carol White', email: 'carol@example.com', role: 'Editor', status: 'Inactive', phone: '+1 234 567 892', location: 'Chicago', joinDate: '2024-01-10' },
        { id: 4, name: 'David Brown', email: 'david@example.com', role: 'User', status: 'Active', phone: '+1 234 567 893', location: 'Houston', joinDate: '2024-03-05' },
        { id: 5, name: 'Emma Wilson', email: 'emma@example.com', role: 'Admin', status: 'Active', phone: '+1 234 567 894', location: 'Phoenix', joinDate: '2024-01-25' },
      ];
      setUsers(defaultUsers);
      localStorage.setItem('users', JSON.stringify(defaultUsers));
    }
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  const handleAddUser = (userData) => {
    const newUser = {
      id: Date.now(),
      ...userData,
      joinDate: new Date().toISOString().split('T')[0]
    };
    setUsers([...users, newUser]);
    addNotification(`User ${userData.name} added successfully!`, 'success');
    setShowForm(false);
  };

  const handleEditUser = (userData) => {
    setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...userData } : user));
    addNotification(`User ${userData.name} updated successfully!`, 'success');
    setEditingUser(null);
    setShowForm(false);
  };

  const handleDeleteUser = (id) => {
    const userToDelete = users.find(u => u.id === id);
    if (window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      setUsers(users.filter(user => user.id !== id));
      addNotification(`User ${userToDelete.name} deleted!`, 'warning');
    }
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    if (window.confirm(`Delete ${selectedUsers.length} selected users?`)) {
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      addNotification(`${selectedUsers.length} users deleted!`, 'warning');
      setSelectedUsers([]);
    }
  };

  const handleToggleStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Active' ? 'Inactive' : 'Active' }
        : user
    ));
    const user = users.find(u => u.id === id);
    addNotification(`User ${user.name} is now ${user.status === 'Active' ? 'Inactive' : 'Active'}`, 'info');
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(u => u.id));
    }
  };

  const handleSelectUser = (id) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Role', 'Status', 'Phone', 'Location', 'Join Date'];
    const csvData = filteredUsers.map(user => [
      user.name, user.email, user.role, user.status, user.phone, user.location, user.joinDate
    ]);
    const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification('Users exported to CSV!', 'success');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'Admin': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
      case 'Editor': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'Active').length,
    admins: users.filter(u => u.role === 'Admin').length
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Users Management</h2>
        <div className="flex gap-3">
          {selectedUsers.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <TrashAll size={18} />
              Delete ({selectedUsers.length})
            </button>
          )}
          <button
            onClick={exportToCSV}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Download size={18} />
            Export CSV
          </button>
          <button
            onClick={() => {
              setEditingUser(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus size={18} />
            Add User
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Users</p>
          <p className="text-2xl font-bold dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Active Users</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.active}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Administrators</p>
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.admins}</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="User">User</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden relative">
            <div className="absolute top-3 left-3">
              <input
                type="checkbox"
                checked={selectedUsers.includes(user.id)}
                onChange={() => handleSelectUser(user.id)}
                className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg dark:text-white">{user.name}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.role}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(user.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                  >
                    {user.status === 'Active' ? 
                      <CheckCircle size={18} className="text-green-500" /> : 
                      <XCircle size={18} className="text-red-500" />
                    }
                  </button>
                  <button
                    onClick={() => {
                      setEditingUser(user);
                      setShowForm(true);
                    }}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit size={18} className="text-blue-500" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                  >
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <MapPin size={16} />
                  <span>{user.location}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                  {user.status}
                </span>
                <span className={`px-2 py-1 text-xs rounded-full ${getRoleColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                Joined: {user.joinDate}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">No users found</p>
        </div>
      )}

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onClose={() => {
            setShowForm(false);
            setEditingUser(null);
          }}
          onSubmit={editingUser ? handleEditUser : handleAddUser}
        />
      )}
    </div>
  );
};

export default UsersPage;