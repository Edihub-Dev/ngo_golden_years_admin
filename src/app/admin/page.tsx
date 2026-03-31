'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import AdminSidebar from '@/components/admin/AdminSidebar';

 type AdminUserSummary = {
   name?: string;
 };

 type AdminServiceRequestSummary = {
   _id: string;
   user?: AdminUserSummary;
   serviceType?: string;
   status?: string;
   createdAt: string;
 };

 type AdminEmergencyRequestSummary = {
   user?: AdminUserSummary;
   description?: string;
   createdAt: string;
 };

 type AdminDashboardAnalytics = {
   users?: {
     total?: number;
     newThisMonth?: number;
   };
   requests?: {
     total?: number;
     pending?: number;
   };
   staff?: {
     total?: number;
     available?: number;
   };
   revenue?: {
     total?: number;
     thisMonth?: number;
   };
   recentRequests?: AdminServiceRequestSummary[];
   emergencyRequests?: {
     count: number;
     requests: AdminEmergencyRequestSummary[];
   };
 };

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminDashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard analytics
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { adminApi } = await import('@/lib/api');
      const response = await adminApi.getDashboard();
      if (response.success && response.data) {
        setAnalytics((response.data as any).analytics || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome to the ElderCare admin dashboard</p>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.users?.total || 0}</p>
                <p className="text-sm text-green-600">+{analytics?.users?.newThisMonth || 0} this month</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Service Requests</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.requests?.total || 0}</p>
                <p className="text-sm text-yellow-600">{analytics?.requests?.pending || 0} pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Staff Members</p>
                <p className="text-2xl font-bold text-gray-900">{analytics?.staff?.total || 0}</p>
                <p className="text-sm text-green-600">{analytics?.staff?.available || 0} available</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{analytics?.revenue?.total || 0}</p>
                <p className="text-sm text-green-600">+{analytics?.revenue?.thisMonth || 0} this month</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Emergency Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Service Requests */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Service Requests</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analytics?.recentRequests?.slice(0, 5).map((request) => (
                    <tr key={request._id}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.user?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {request.serviceType?.replace('_', ' ') || 'Unknown'}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.status === 'completed' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          request.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Emergency Alerts */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Alerts</h3>
            <div className="space-y-4">
              {analytics?.emergencyRequests?.requests?.slice(0, 3).map((alert: AdminEmergencyRequestSummary, index: number) => (
                <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4">
                  <div className="flex">
                    <div className="shrink-0">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-800">
                        <span className="font-medium">{alert.user?.name}</span> triggered SOS
                      </p>
                      <p className="text-sm text-red-700 mt-1">
                        {alert.description || 'Emergency assistance required'}
                      </p>
                      <p className="text-xs text-red-600 mt-2">
                        {new Date(alert.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {(!analytics?.emergencyRequests?.requests || analytics.emergencyRequests.requests.length === 0) && (
                <div className="text-center py-8">
                  <ExclamationTriangleIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No emergency alerts at this time</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
