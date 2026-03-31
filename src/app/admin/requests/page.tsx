'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DocumentTextIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  CheckIcon,
  CheckCircleIcon,
  XMarkIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Link from 'next/link';
import { AuthManager } from '@/lib/auth';
import { apiClient } from '@/lib/api';
import { cn } from "../../../lib/utils";

interface ServiceRequest {
  _id: string;
  user: {
    _id: string;
    name: string;
    mobile: string;
  };
  serviceType: string;
  customServiceName?: string;
  description: string;
  urgency: string;
  status: string;
  address?: {
    coordinates?: {
      lat: number;
      lng: number;
    }
  };
  createdAt: string;
}

export default function AdminRequests() {
  const router = useRouter();
  const authManager = AuthManager.getInstance();
  
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    authManager.setRouter(router);
    
    // Check admin authentication
    const authState = authManager.requireAdmin();
    if (!authState.isAuthenticated) {
      return; // Will redirect
    }
    
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.get<any>('/api/admin/requests');
      
      if (response.success && response.data) {
        // Handle unwrapping the backend pagination/requests object
        const fetchedData = response.data.requests ? response.data.requests : response.data;
        setRequests(fetchedData || []);
      } else {
        throw new Error(response.error?.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  // Memoized filtered requests for performance
  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = 
        request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.serviceType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchTerm, statusFilter]);

  const handleAction = async (requestId: string, action: string) => {
    if (actionLoading) return;
    
    try {
      setActionLoading(requestId);
      
      const response = await apiClient.put(`/api/admin/requests/${requestId}/status`, { 
        status: action 
      });
      
      if (response.success) {
        // Refresh requests list
        await fetchRequests();
      } else {
        throw new Error(response.error?.message || `Failed to ${action} request`);
      }
    } catch (error) {
      console.error(`Failed to ${action} request:`, error);
      const errorMessage = error instanceof Error ? error.message : `Failed to ${action} request`;
      alert(errorMessage);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600', 'mx-auto')}></div>
          <p className={cn('mt-4', 'text-gray-600')}>Loading service requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center max-w-md mx-auto p-6">
          <DocumentTextIcon className={cn('h-12', 'w-12', 'text-red-600', 'mx-auto', 'mb-4')} />
          <h2 className={cn('text-xl', 'font-semibold', 'text-gray-900', 'mb-2')}>Error Loading Requests</h2>
          <p className={cn('text-gray-600', 'mb-6')}>{error}</p>
          <button
            onClick={fetchRequests}
            className={cn('px-4', 'py-2', 'bg-blue-600', 'text-white', 'rounded-lg', 'hover:bg-blue-700')}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50', 'flex')}>
      <AdminSidebar />
      
      {/* Main Content */}
      <div className={cn('flex-1', 'p-8')}>
        <div className={cn('mb-8')}>
          <h1 className={cn('text-2xl', 'font-bold', 'text-gray-900')}>Service Requests</h1>
          <p className="text-gray-600">View and manage all service requests</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className={cn('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'leading-5', 'bg-white', 'placeholder-gray-500', 'focus:outline-none', 'focus:placeholder-gray-400', 'focus:ring-1', 'focus:ring-blue-500', 'focus:border-blue-500', 'sm:text-sm')}
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="sm:w-48">
            <select
              className={cn('block', 'w-full', 'pl-3', 'pr-10', 'py-2', 'text-base', 'border-gray-300', 'focus:outline-none', 'focus:ring-blue-500', 'focus:border-blue-500', 'sm:text-sm', 'rounded-md')}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className={cn('bg-white', 'shadow', 'overflow-hidden', 'sm:rounded-md')}>
          <div className={cn('px-4', 'py-5', 'sm:px-6')}>
            <h3 className={cn('text-lg', 'leading-6', 'font-medium', 'text-gray-900')}>
              All Requests ({filteredRequests.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Urgency
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {request.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{request.user?.name}</div>
                          <div className="text-sm text-gray-500">{request.user?.mobile}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 capitalize">
                        {request.serviceType === 'custom' 
                          ? (request.customServiceName || 'Custom Request')
                          : (request.serviceType?.replace('_', ' ') || 'Unknown')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {request.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getUrgencyColor(request.urgency)}`}>
                        {request.urgency || 'medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className={cn('flex', 'items-center', 'space-x-2')}>
                        {/* View Location */}
                        {request.address?.coordinates?.lat && request.address?.coordinates?.lng && (
                          <a 
                            href={`https://maps.google.com/?q=${request.address.coordinates.lat},${request.address.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn('p-2', 'text-orange-600', 'hover:text-orange-900')}
                            title="View Live Location"
                          >
                            <MapPinIcon className={cn('h-5', 'w-5')} />
                          </a>
                        )}

                        <button 
                          className={cn('p-2', 'text-blue-600', 'hover:text-blue-900', 'disabled:opacity-50')}
                          disabled={actionLoading === request._id}
                        >
                          <EyeIcon className={cn('h-5', 'w-5')} />
                        </button>
                        {/* Mark as In Progress */}
                        {request.status === 'pending' && (
                          <button 
                            className={cn('p-2', 'text-green-600', 'hover:text-green-900', 'disabled:opacity-50')}
                            title="Mark as In Progress"
                            disabled={actionLoading === request._id}
                            onClick={() => handleAction(request._id, 'in_progress')}
                          >
                            <CheckIcon className={cn('h-5', 'w-5')} />
                          </button>
                        )}
                        
                        {/* Mark as Completed */}
                        {request.status === 'in_progress' && (
                          <button 
                            className={cn('p-2', 'text-emerald-600', 'hover:text-emerald-900', 'disabled:opacity-50')}
                            title="Mark as Completed"
                            disabled={actionLoading === request._id}
                            onClick={() => handleAction(request._id, 'completed')}
                          >
                            <CheckCircleIcon className={cn('h-5', 'w-5')} />
                          </button>
                        )}

                        {/* Cancel Request */}
                        {request.status !== 'completed' && request.status !== 'cancelled' && (
                          <button 
                            className={cn('p-2', 'text-red-600', 'hover:text-red-900', 'disabled:opacity-50')}
                            title="Cancel Request"
                            disabled={actionLoading === request._id}
                            onClick={() => handleAction(request._id, 'cancelled')}
                          >
                            <XMarkIcon className={cn('h-5', 'w-5')} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredRequests.length === 0 && (
            <div className={cn('text-center', 'py-12')}>
              <DocumentTextIcon className={cn('h-12', 'w-12', 'text-gray-400', 'mx-auto', 'mb-4')} />
              <p className="text-gray-500">No service requests found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
