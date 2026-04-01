'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  SearchIcon,
  EyeIcon,
  Edit2Icon,
  Trash2Icon,
  ShieldCheckIcon,
  AwardIcon,
  DownloadIcon,
  CalendarIcon,
  X,
  CheckCircleIcon,
  SaveIcon,
  SmartphoneIcon,
  MailIcon,
  MapPinIcon,
  HeartIcon,
  UserCheckIcon,
  ContactIcon
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Pagination from '@/components/admin/Pagination';
import RoleGuard from '@/components/admin/RoleGuard';
import { AdminService } from '@/lib/api';
import { AuthManager } from '@/lib/auth';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ search: '', status: 'all', startDate: '', endDate: '' });
  
  // Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setCurrentUser(AuthManager.getInstance().getUser());
    fetchUsers();
  }, [pagination.page, filters]);

  const fetchUsers = async () => {
    setLoading(true);
    const params = {
      page: pagination.page,
      search: filters.search,
      status: filters.status === 'verified' ? 'verified' : '',
      startDate: filters.startDate,
      endDate: filters.endDate
    };

    const res = await AdminService.getUsers(params);
    if (res.success && res.data) {
      setUsers(res.data.users || []);
      if (res.data.pagination) {
        setPagination(prev => ({
          ...prev,
          pages: res.data.pagination.pages,
          total: res.data.pagination.total
        }));
      }
    } else {
      toast.error('Failed to load users');
    }
    setLoading(false);
  };

  const handleEdit = (user: any) => {
    const baseUser = {
      ...user,
      emergencyContact: user.emergencyContact || { name: '', mobile: '', relationship: '' },
      medicalHistory: user.medicalHistory || []
    };
    setEditingUser(baseUser);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await AdminService.deleteUser(id);
      if (res.success) {
        toast.success('User deleted successfully');
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to delete user');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await AdminService.updateUser(editingUser._id, editingUser);
      if (res.success) {
        toast.success('User Profile Synced Successfully');
        setIsEditModalOpen(false);
        fetchUsers();
      }
    } catch (err) {
      toast.error('Failed to update user profile');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadXLSX = () => {
    if (users.length === 0) return toast.error('No data to export');
    
    const dataToExport = users.map(u => ({
      'UID': u._id.slice(-8),
      'Name': u.name,
      'Mobile': u.mobile,
      'Email': u.email || 'N/A',
      'Age': u.age || 'N/A',
      'Gender': u.gender || 'N/A',
      'Blood Group': u.bloodGroup || 'N/A',
      'Address': u.address || 'N/A',
      'Role': u.role.toUpperCase(),
      'Verified': u.isVerified ? 'YES' : 'NO',
      'Emergency Contact': u.emergencyContact?.name ? `${u.emergencyContact.name} (${u.emergencyContact.mobile})` : 'N/A',
      'Joined Date': new Date(u.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");
    
    const fileName = `users_directory_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Excel registry downloaded');
  };

  return (
    <RoleGuard allowedRoles={['admin', 'subadmin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full min-h-screen">
          {/* Header Area */}
          <div className="mb-6 lg:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                User Management
                <span className="text-xs font-bold bg-blue-100 text-blue-600 px-3 py-1 rounded-xl tracking-normal">
                  {pagination.total} Records
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Manage global platform participant profiles</p>
            </div>

            <button 
              onClick={downloadXLSX}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs tracking-tight border-2 border-slate-100 shadow-sm transition-all"
            >
              <DownloadIcon className="h-4 w-4 text-emerald-500" />
              EXPORT XLSX
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
              <input 
                type="text"
                placeholder="Search by name, phone or email..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500" />
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border-2 border-slate-100 shadow-sm">
              <div className="flex flex-col items-center border-r border-slate-50 pr-3">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 self-start ml-1">Start Date</span>
                <input 
                  type="date" 
                  value={filters.startDate}
                  onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                  className="text-[10px] font-black text-slate-800 outline-none cursor-pointer bg-transparent"
                />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 self-start ml-1">End Date</span>
                <input 
                  type="date" 
                  value={filters.endDate}
                  onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                  className="text-[10px] font-black text-slate-800 outline-none cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Auth Status</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Connection</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8 bg-slate-50/20" />
                      </tr>
                    ))
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-24 text-center">
                        <UserIcon className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-900">No Participants Found</h3>
                        <p className="text-slate-400 font-bold text-xs">Try refined search terms.</p>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50/50 transition-all group border-l-4 border-l-transparent hover:border-l-blue-600">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg border transition-transform group-hover:scale-105 shadow-sm
                              ${user.role === 'admin' ? 'bg-blue-600 text-white border-blue-700 shadow-blue-100' : 
                                user.role === 'subadmin' ? 'bg-indigo-500 text-white border-indigo-600 shadow-indigo-100' : 
                                'bg-slate-100 text-slate-500 border-slate-200'}`}>
                              {user.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 leading-tight mb-1">{user.name}</p>
                              <span className="text-[10px] font-bold text-slate-400 px-2 py-0.5 bg-slate-50 rounded-lg border border-slate-200">ID: {user._id.slice(-8)}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border
                            ${user.role === 'admin' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                              user.role === 'subadmin' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                              'bg-slate-50 text-slate-500 border-slate-100'}`}>
                            {user.role || 'USER'}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-2">
                             <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                               user.isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                             }`}>
                                {user.isVerified ? 'Verified' : 'Pending'}
                             </span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <div className="space-y-1">
                            <p className="text-slate-700 font-black text-xs flex items-center gap-2">
                              {user.mobile}
                            </p>
                            <p className="text-slate-400 font-bold text-[10px] truncate max-w-[150px]">
                              {user.email || 'No Email'}
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(user)}
                              className="p-3 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            {currentUser?.role === 'admin' && (
                              <>
                                <button 
                                  onClick={() => handleEdit(user)}
                                  className="p-3 bg-white text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                                >
                                  <Edit2Icon className="h-4 w-4" />
                                </button>
                                <button 
                                  onClick={() => handleDelete(user._id)}
                                  className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                                >
                                  <Trash2Icon className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100">
              <Pagination 
                current={pagination.page}
                total={pagination.pages}
                onPageChange={(page) => setPagination(prev => ({ ...prev, page }))}
              />
            </div>
          </div>
        </main>
      </div>

      {/* EXTENDED EDIT MODAL (BIDIRECTIONAL) */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-300">
          <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-hidden border-4 border-white flex flex-col animate-in zoom-in-95 duration-400">
            
            {/* Modal Header */}
            <div className="p-6 lg:p-10 border-b bg-slate-50/50 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                  {editingUser.name?.charAt(0)}
                </div>
                <div>
                  <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Sync User Profile</h2>
                  <p className="text-slate-400 font-bold text-xs mt-0.5">UID: {editingUser._id.slice(-8)}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-3 text-slate-300 hover:text-slate-600 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar space-y-10">
              <form id="extended-user-form" onSubmit={handleUpdate} className="space-y-10">
                
                {/* Identity Matrix */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
                    <UserCheckIcon className="h-4 w-4" /> Identity & Access
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                       <input 
                         type="text" 
                         disabled={currentUser?.role !== 'admin'}
                         value={editingUser.name || ''} 
                         onChange={e => setEditingUser({...editingUser, name: e.target.value})}
                         className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:border-blue-500 transition-all text-sm disabled:cursor-not-allowed"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Sync Mobile</label>
                       <input 
                         type="text" 
                         disabled={currentUser?.role !== 'admin'}
                         value={editingUser.mobile || ''} 
                         onChange={e => setEditingUser({...editingUser, mobile: e.target.value})}
                         className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:border-blue-500 transition-all text-sm disabled:cursor-not-allowed"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Auth Email</label>
                       <input 
                         type="email" 
                         disabled={currentUser?.role !== 'admin'}
                         value={editingUser.email || ''} 
                         onChange={e => setEditingUser({...editingUser, email: e.target.value})}
                         className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-900 outline-none focus:border-blue-500 transition-all text-sm disabled:cursor-not-allowed"
                       />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Role</label>
                         <select 
                           disabled={currentUser?.role !== 'admin'}
                           value={editingUser.role || 'user'}
                           onChange={e => setEditingUser({...editingUser, role: e.target.value})}
                           className="w-full px-5 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-black text-slate-800 outline-none text-[10px] tracking-widest uppercase cursor-pointer disabled:cursor-not-allowed"
                         >
                           <option value="user">USER</option>
                           <option value="subadmin">SUBADMIN</option>
                           <option value="admin">ADMIN</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Verification</label>
                        <button 
                          type="button"
                          disabled={currentUser?.role !== 'admin'}
                          onClick={() => setEditingUser({...editingUser, isVerified: !editingUser.isVerified})}
                          className={`w-full px-5 py-3.5 border-2 rounded-2xl font-black text-[10px] tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                            editingUser.isVerified ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'
                          }`}
                        >
                          {editingUser.isVerified ? 'VERIFIED' : 'PENDING'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical & Personal */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
                    <HeartIcon className="h-4 w-4" /> Personal & Medical
                  </h4>
                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Age</label>
                       <input type="number" disabled={currentUser?.role !== 'admin'} value={editingUser.age || ''} onChange={e => setEditingUser({...editingUser, age: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 outline-none text-sm disabled:cursor-not-allowed" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Gender</label>
                       <select disabled={currentUser?.role !== 'admin'} value={editingUser.gender || ''} onChange={e => setEditingUser({...editingUser, gender: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 outline-none text-xs uppercase tracking-tighter disabled:cursor-not-allowed">
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Blood</label>
                       <input type="text" disabled={currentUser?.role !== 'admin'} value={editingUser.bloodGroup || ''} onChange={e => setEditingUser({...editingUser, bloodGroup: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 outline-none text-sm disabled:cursor-not-allowed" placeholder="O+ve" />
                    </div>
                  </div>
                </div>

                {/* Location & SOS */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] flex items-center gap-3">
                    <MapPinIcon className="h-4 w-4" /> Residential Details
                  </h4>
                  <div className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Address Tracking</label>
                       <input type="text" disabled={currentUser?.role !== 'admin'} value={editingUser.address || ''} onChange={e => setEditingUser({...editingUser, address: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-bold text-slate-800 outline-none text-sm disabled:cursor-not-allowed" placeholder="Current Location" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Aadhar UID Reference</label>
                       <input type="text" disabled={currentUser?.role !== 'admin'} value={editingUser.aadharNumber || ''} onChange={e => setEditingUser({...editingUser, aadharNumber: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl font-black text-slate-900 outline-none text-sm placeholder:text-slate-200 disabled:cursor-not-allowed" placeholder="0000 0000 0000" />
                    </div>
                  </div>
                </div>

                {/* SOS Configuration */}
                <div className="bg-rose-50/50 p-6 lg:p-8 rounded-[2rem] border-2 border-rose-100/50 space-y-6">
                   <h4 className="text-[9px] font-black text-rose-400 uppercase tracking-[0.4em] flex items-center gap-3">
                      <ContactIcon className="h-4 w-4" /> SOS LOCKDOWN CONTACT
                   </h4>
                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-rose-300 uppercase">Contact Name</label>
                         <input type="text" disabled={currentUser?.role !== 'admin'} value={editingUser.emergencyContact?.name || ''} onChange={e => setEditingUser({...editingUser, emergencyContact: {...editingUser.emergencyContact, name: e.target.value}})} className="w-full px-4 py-2.5 bg-white border border-rose-100 rounded-xl font-bold text-slate-900 text-xs outline-none disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-rose-300 uppercase">SOS Phone</label>
                         <input type="text" disabled={currentUser?.role !== 'admin'} value={editingUser.emergencyContact?.mobile || ''} onChange={e => setEditingUser({...editingUser, emergencyContact: {...editingUser.emergencyContact, mobile: e.target.value}})} className="w-full px-4 py-2.5 bg-white border border-rose-100 rounded-xl font-bold text-slate-900 text-xs outline-none disabled:cursor-not-allowed" />
                      </div>
                      <div className="space-y-1.5">
                         <label className="text-[8px] font-black text-rose-300 uppercase">Relation</label>
                         <input type="text" disabled={currentUser?.role !== 'admin'} value={editingUser.emergencyContact?.relationship || ''} onChange={e => setEditingUser({...editingUser, emergencyContact: {...editingUser.emergencyContact, relationship: e.target.value}})} className="w-full px-4 py-2.5 bg-white border border-rose-100 rounded-xl font-bold text-slate-900 text-xs outline-none disabled:cursor-not-allowed" />
                      </div>
                   </div>
                </div>

              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 lg:p-10 bg-white border-t-2 border-slate-50 flex flex-col sm:flex-row gap-3 sticky bottom-0 z-10">
              {currentUser?.role === 'admin' ? (
                <>
                  <button 
                    onClick={() => setIsEditModalOpen(false)}
                    className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all border border-slate-200"
                  >
                    Discard
                  </button>
                  <button 
                    form="extended-user-form"
                    type="submit"
                    disabled={isSaving}
                    className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] tracking-widest uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    <SaveIcon className="h-4 w-4" />
                    {isSaving ? 'Synchronizing...' : 'Force Sync Profile'}
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-full py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Close Discovery Mode
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </RoleGuard>
  );
}
