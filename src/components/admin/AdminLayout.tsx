import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X, Bell, User, Settings, LogOut } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user, logout } = useAdminAuth();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      logout();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Left: Menu Button + Logo */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </button>
                
                <div className="flex items-center">
                  <img
                    src="/images/logo.webp"
                    alt="Harmony Farm Sanctuary"
                    className="h-8 w-8 rounded-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2310B981"/><text x="50" y="58" text-anchor="middle" fill="white" font-size="36" font-family="Arial">H</text></svg>';
                    }}
                  />
                  <div className="ml-3 hidden sm:block">
                    <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                    <p className="text-sm text-gray-500">Harmony Farm Sanctuary</p>
                  </div>
                </div>
              </div>

              {/* Right: Notifications + User Menu */}
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors relative"
                  >
                    <Bell className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                      <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">New volunteer application from Sarah Johnson</p>
                          <p className="text-xs text-gray-500 mt-1">2 minutes ago</p>
                        </div>
                        <div className="p-3 border-b border-gray-100 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">Blog post "Winter Care Tips" published</p>
                          <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                        </div>
                        <div className="p-3 hover:bg-gray-50">
                          <p className="text-sm text-gray-900">Monthly donation report is ready</p>
                          <p className="text-xs text-gray-500 mt-1">3 hours ago</p>
                        </div>
                      </div>
                      <div className="p-3 border-t border-gray-200">
                        <button className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                          View all notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                  </div>
                  
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="h-10 w-10 rounded-full border-2 border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" fill="%2310B981"/><text x="50" y="58" text-anchor="middle" fill="white" font-size="24" font-family="Arial">${user.firstName[0]}${user.lastName[0]}</text></svg>`;
                      }}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user?.firstName[0]}{user?.lastName[0]}
                      </span>
                    </div>
                  )}

                  {/* User Dropdown */}
                  <div className="relative group">
                    <button className="p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors">
                      <User className="h-5 w-5" />
                    </button>
                    
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <div className="p-2">
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                          <User className="h-4 w-4 mr-3" />
                          Profile Settings
                        </button>
                        <button className="w-full flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
                          <Settings className="h-4 w-4 mr-3" />
                          Admin Settings
                        </button>
                        <hr className="my-2 border-gray-200" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-3 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Click outside to close notifications */}
      {notificationsOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setNotificationsOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;