'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  MagnifyingGlassIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { cn } from "../../../lib/utils";

import EditUserModal from '@/components/admin/EditUserModal';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { adminApi } = await import('@/lib/api');
      const response = await adminApi.getUsers();
      if (response.success && response.data) {
        setUsers((response.data as any).users || []);
      } else {
        console.error('Failed to parse users:', response);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const [activeTab, setActiveTab] = useState<'all' | 'members'>('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.mobile?.includes(searchTerm) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || (activeTab === 'members' && user.membership && user.membership.isActive);
    return matchesSearch && matchesTab;
  });

  if (loading) {
// <snip>... Keep loading...
    return (
      <div className={cn('min-h-screen', 'bg-gray-50', 'flex', 'items-center', 'justify-center')}>
        <div className="text-center">
          <div className={cn('animate-spin', 'rounded-full', 'h-12', 'w-12', 'border-b-2', 'border-blue-600', 'mx-auto')}></div>
          <p className={cn('mt-4', 'text-gray-600')}>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50', 'flex')}>
      <AdminSidebar />
      
      {/* Main Content */}
      <div className={cn('flex-1', 'p-8', 'max-w-full', 'overflow-x-hidden')}>
        <div className="mb-8">
          <h1 className={cn('text-2xl', 'font-bold', 'text-gray-900')}>Users Management</h1>
          <p className="text-gray-600">View and manage all registered users</p>
        </div>

        {/* Search Bar & Tabs */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="w-full sm:w-1/2 relative">
            <div className={cn('absolute', 'inset-y-0', 'left-0', 'pl-3', 'flex', 'items-center', 'pointer-events-none')}>
              <MagnifyingGlassIcon className={cn('h-5', 'w-5', 'text-gray-400')} />
            </div>
            <input
              type="text"
              className={cn('block', 'w-full', 'pl-10', 'pr-3', 'py-2', 'border', 'border-gray-300', 'rounded-md', 'leading-5', 'bg-white', 'placeholder-gray-500', 'focus:outline-none', 'focus:ring-1', 'focus:ring-blue-500', 'focus:border-blue-500', 'sm:text-sm')}
              placeholder="Search users by name, mobile, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-white rounded-md shadow-sm border border-gray-200">
            <button
               onClick={() => setActiveTab('all')}
               className={`px-4 py-2 text-sm font-medium rounded-l-md ${activeTab === 'all' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              All Users
            </button>
            <button
               onClick={() => setActiveTab('members')}
               className={`px-4 py-2 text-sm font-medium rounded-r-md border-l border-gray-200 ${activeTab === 'members' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              Members Only
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className={cn('bg-white', 'shadow', 'overflow-hidden', 'sm:rounded-md')}>
          <div className={cn('px-4', 'py-5', 'sm:px-6')}>
            <h3 className={cn('text-lg', 'leading-6', 'font-medium', 'text-gray-900')}>
              {activeTab === 'members' ? 'Verified NGO Members' : 'All Users'} ({filteredUsers.length})
            </h3>
          </div>
          <ul className={cn('divide-y', 'divide-gray-200')}>
            {filteredUsers.map((user: any) => (
              <li key={user._id}>
                <div className={cn('px-4', 'py-4', 'sm:px-6', 'flex', 'items-center', 'justify-between')}>
                  <div className={cn('flex', 'items-center')}>
                    <div className={cn('shrink-0', 'h-10', 'w-10')}>
                      <div className={cn('h-10', 'w-10', 'rounded-full', 'bg-gray-300', 'flex', 'items-center', 'justify-center')}>
                        <span className={cn('text-sm', 'font-medium', 'text-gray-700')}>
                          {user.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className={cn('flex', 'items-center')}>
                        <p className={cn('text-sm', 'font-medium', 'text-gray-900')}>{user.name}</p>
                        <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {user.role || 'user'}
                        </span>
                        {user.isVerified && (
                          <span className={cn('ml-2', 'px-2', 'inline-flex', 'text-xs', 'leading-5', 'font-semibold', 'rounded-full', 'bg-blue-100', 'text-blue-800')}>
                            Verified
                          </span>
                        )}
                        {user.membership?.plan === 'annual_1100' && user.membership?.isActive && (
                          <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800 border border-yellow-300 shadow-sm">
                            🎗️ Member
                          </span>
                        )}
                      </div>
                      <div className={cn('flex', 'flex-wrap', 'items-center', 'mt-1', 'text-sm', 'text-gray-500', 'gap-x-4')}>
                        <span>{user.mobile}</span>
                        <span>{user.email}</span>
                        <span>Age: {user.age}</span>
                        {user.gender && <span className="capitalize">{user.gender}</span>}
                        {user.bloodGroup && <span className="text-red-600 font-medium">Bld: {user.bloodGroup}</span>}
                        {user.aadharNumber && <span>Aadhar: {user.aadharNumber}</span>}
                      </div>
                      <div className={cn('text-sm', 'text-gray-500', 'mt-1')}>
                        {user.address}
                      </div>
                    </div>
                  </div>
                  <div className={cn('flex', 'items-center', 'space-x-2')}>
                    <button className={cn('p-2', 'text-gray-400', 'hover:text-blue-600')}>
                      <EyeIcon className={cn('h-5', 'w-5')} />
                    </button>
                    <button 
                      className={cn('p-2', 'text-gray-400', 'hover:text-green-600')}
                      onClick={() => setEditingUser(user)}
                    >
                      <PencilIcon className={cn('h-5', 'w-5')} />
                    </button>
                    <button className={cn('p-2', 'text-gray-400', 'hover:text-red-600')}>
                      <TrashIcon className={cn('h-5', 'w-5')} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {filteredUsers.length === 0 && (
            <div className={cn('text-center', 'py-12')}>
              <UsersIcon className={cn('h-12', 'w-12', 'text-gray-400', 'mx-auto', 'mb-4')} />
              <p className="text-gray-500">No users found</p>
            </div>
          )}
        </div>
      </div>
      
      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)} 
          onUpdated={() => {
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}
