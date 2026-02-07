import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { reportsService, circulationService } from '../../services/libraryService';

const LibraryAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [overdueItems, setOverdueItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, overdueResponse] = await Promise.all([
        reportsService.getDashboardStats(),
        circulationService.getOverdueItems()
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
      if (overdueResponse.success) {
        setOverdueItems(overdueResponse.data.slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, onClick }) => (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer hover:shadow-xl transition' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ icon: Icon, label, onClick, color }) => (
    <button
      onClick={onClick}
      className={`${color} text-white rounded-lg p-6 hover:opacity-90 transition flex flex-col items-center justify-center gap-3 shadow-md hover:shadow-xl`}
    >
      <Icon className="w-12 h-12" />
      <span className="font-semibold">{label}</span>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Icons.Loader2 className="w-8 h-8 animate-spin text-cyan-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Library Dashboard</h1>
          <p className="text-gray-600">Welcome to NARA Library Management System</p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Icons.BookOpen}
            label="Total Items"
            value={stats?.totalItems || 0}
            color="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            icon={Icons.Users}
            label="Active Patrons"
            value={stats?.totalPatrons || 0}
            color="bg-gradient-to-br from-green-500 to-green-600"
          />
          <StatCard
            icon={Icons.TrendingUp}
            label="Active Loans"
            value={stats?.activeLoans || 0}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
            onClick={() => navigate('/admin/library/circulation')}
          />
          <StatCard
            icon={Icons.AlertCircle}
            label="Overdue Items"
            value={stats?.overdueItems || 0}
            color="bg-gradient-to-br from-red-500 to-red-600"
            onClick={() => navigate('/admin/library/circulation')}
          />
        </div>

        {/* Today's Activity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icons.Activity className="w-5 h-5 text-cyan-600" />
              Today's Activity
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Checkouts</span>
                <span className="text-2xl font-bold text-green-600">{stats?.todayCheckouts || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Returns</span>
                <span className="text-2xl font-bold text-blue-600">{stats?.todayCheckins || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Holds</span>
                <span className="text-2xl font-bold text-purple-600">{stats?.pendingHolds || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Icons.DollarSign className="w-5 h-5 text-cyan-600" />
              Financial Summary
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Unpaid Fines</span>
                <span className="text-2xl font-bold text-red-600">
                  LKR {stats?.unpaidFines?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-4">
                <p>Outstanding fines from overdue items</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAction
              icon={Icons.LogIn}
              label="Check Out"
              onClick={() => navigate('/admin/library/circulation')}
              color="bg-gradient-to-br from-green-500 to-green-600"
            />
            <QuickAction
              icon={Icons.LogOut}
              label="Check In"
              onClick={() => navigate('/admin/library/circulation')}
              color="bg-gradient-to-br from-blue-500 to-blue-600"
            />
            <QuickAction
              icon={Icons.Plus}
              label="Add Item"
              onClick={() => navigate('/admin/library/cataloguing')}
              color="bg-gradient-to-br from-purple-500 to-purple-600"
            />
            <QuickAction
              icon={Icons.UserPlus}
              label="Add Patron"
              onClick={() => navigate('/admin/library/patrons')}
              color="bg-gradient-to-br from-cyan-500 to-cyan-600"
            />
          </div>
        </div>

        {/* Overdue Items Alert */}
        {overdueItems.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Icons.AlertTriangle className="w-5 h-5 text-red-600" />
                Overdue Items Requiring Attention
              </h2>
              <button
                onClick={() => navigate('/admin/library/circulation')}
                className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
              >
                View All →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patron</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days Overdue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {overdueItems.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{item.patron_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{item.title}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {new Date(item.due_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                          {item.days_overdue} days
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div
            onClick={() => navigate('/admin/library/cataloguing')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition"
          >
            <Icons.Book className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Cataloguing</h3>
            <p className="text-gray-600 text-sm">Manage bibliographic records and collection</p>
          </div>

          <div
            onClick={() => navigate('/admin/library/acquisitions')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition"
          >
            <Icons.ShoppingCart className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Acquisitions</h3>
            <p className="text-gray-600 text-sm">Track orders and manage suppliers</p>
          </div>

          <div
            onClick={() => navigate('/admin/library/reports')}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-xl transition"
          >
            <Icons.BarChart3 className="w-12 h-12 text-cyan-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Reports</h3>
            <p className="text-gray-600 text-sm">View analytics and generate reports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LibraryAdminDashboard;

