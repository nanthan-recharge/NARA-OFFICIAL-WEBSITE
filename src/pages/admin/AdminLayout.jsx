import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useFirebaseAuth } from '../../contexts/FirebaseAuthContext';
import * as Icons from 'lucide-react';

const menuSections = [
  {
    label: 'MAIN',
    items: [
      { icon: Icons.LayoutDashboard, label: 'Dashboard', path: '/admin/master' },
      { icon: Icons.BarChart3, label: 'Analytics', path: '/admin/analytics' },
    ],
  },
  {
    label: 'CONTENT',
    items: [
      { icon: Icons.FileEdit, label: 'Content Manager', path: '/admin/content' },
      { icon: Icons.Newspaper, label: 'News', path: '/admin/news' },
      { icon: Icons.Image, label: 'Media Library', path: '/admin/media' },
      { icon: Icons.Megaphone, label: 'Media Press Kit', path: '/admin/media-press-kit' },
      { icon: Icons.Briefcase, label: 'Vacancies', path: '/admin/vacancies' },
    ],
  },
  {
    label: 'RESEARCH',
    items: [
      { icon: Icons.Microscope, label: 'Research Data', path: '/admin/research-data' },
      { icon: Icons.Upload, label: 'Upload Papers', path: '/admin/research-upload' },
      { icon: Icons.FlaskConical, label: 'Lab Results', path: '/admin/lab-results' },
    ],
  },
  {
    label: 'MARITIME',
    items: [
      { icon: Icons.Ship, label: 'Maritime', path: '/admin/maritime' },
      { icon: Icons.Fish, label: 'Fish Advisory', path: '/admin/fish-advisory' },
      { icon: Icons.Map, label: 'Bathymetry', path: '/admin/bathymetry' },
    ],
  },
  {
    label: 'MANAGEMENT',
    items: [
      { icon: Icons.Users, label: 'User Management', path: '/admin/users' },
      { icon: Icons.Building2, label: 'Divisions', path: '/admin/division-content' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { icon: Icons.Settings, label: 'Settings', path: '/admin/settings' },
    ],
  },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { profile, logout } = useFirebaseAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const displayName = profile?.displayName || profile?.email || 'Admin';
  const initials = displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-[72px]'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col flex-shrink-0`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          {sidebarOpen && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-[#003366] rounded-lg flex items-center justify-center">
                <Icons.Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-[#003366] text-sm">NARA Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg transition text-slate-400 hover:text-slate-600"
          >
            {sidebarOpen ? <Icons.ChevronLeft className="w-5 h-5" /> : <Icons.ChevronRight className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-5">
          {menuSections.map((section) => (
            <div key={section.label}>
              {sidebarOpen && (
                <p className="px-3 mb-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                  {section.label}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-sm ${
                        isActive
                          ? 'bg-[#003366] text-white shadow-sm'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                      } ${!sidebarOpen ? 'justify-center' : ''}`
                    }
                  >
                    <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
                    {sidebarOpen && <span className="font-medium">{item.label}</span>}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-500 hover:bg-red-50 hover:text-red-600 transition text-sm ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <Icons.LogOut className="w-[18px] h-[18px]" />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-800">Admin Panel</h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
              <Icons.Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 hover:bg-slate-100 rounded-lg transition"
              >
                <div className="w-8 h-8 bg-[#003366] rounded-full flex items-center justify-center">
                  {profile?.photoURL ? (
                    <img src={profile.photoURL} alt="" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-white">{initials}</span>
                  )}
                </div>
                <span className="text-sm font-medium text-slate-700 hidden sm:block">{displayName}</span>
                <Icons.ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800">{displayName}</p>
                    <p className="text-xs text-slate-500">{profile?.email}</p>
                    {profile?.role && (
                      <p className="text-xs text-[#0066CC] font-medium mt-1 capitalize">{profile.role.replace(/_/g, ' ')}</p>
                    )}
                  </div>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-2.5">
                    <Icons.User className="w-4 h-4 text-slate-400" />
                    Profile
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 transition flex items-center gap-2.5">
                    <Icons.Settings className="w-4 h-4 text-slate-400" />
                    Settings
                  </button>
                  <hr className="my-1.5 border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2.5"
                  >
                    <Icons.LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
