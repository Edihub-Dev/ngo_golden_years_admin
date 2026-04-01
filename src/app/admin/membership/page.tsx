'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  SearchIcon,
  DownloadIcon,
  MailIcon,
  PhoneIcon,
  AwardIcon,
  CalendarIcon,
  FilterIcon,
  CreditCardIcon,
  RefreshCwIcon,
  ArrowUpRightIcon,
  ShieldCheckIcon
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RoleGuard from '@/components/admin/RoleGuard';
import { AdminService } from '@/lib/api';
import { AuthManager } from '@/lib/auth';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function MembershipPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setUserRole(AuthManager.getInstance().getUser()?.role || '');
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getMembers();
      if (res.success && res.data) {
        setUsers(res.data.users || []);
      } else {
        toast.error('Failed to load members');
      }
    } catch (err) {
      toast.error('Network error while loading members');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(search.toLowerCase()) ||
    user.mobile?.includes(search) ||
    user.email?.toLowerCase().includes(search.toLowerCase())
  );

  const downloadXLSX = () => {
    if (filteredUsers.length === 0) return toast.error('No data to export');
    
    const dataToExport = filteredUsers.map(u => ({
      'UID': u._id.slice(-8),
      'Member Name': u.name,
      'Contact Mobile': u.mobile,
      'Email': u.email || 'N/A',
      'Membership Plan': u.membership?.planId || 'BASIC_CARE',
      'Provisioned Date': new Date(u.membership?.startDate).toLocaleDateString(),
      'Expiry Deadline': new Date(u.membership?.expiryDate).toLocaleDateString(),
      'Current Status': u.membership?.isActive ? 'ACTIVE_DUTY' : 'EXPIRED',
      'Verified Status': u.isVerified ? 'VERIFIED' : 'PENDING'
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Active Members");
    
    const fileName = `membership_roster_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Roster downloaded');
  };

  return (
    <RoleGuard allowedRoles={['admin', 'subadmin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full min-h-screen">
          {/* Page Header */}
          <div className="mb-6 lg:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Active Memberships
                <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-3 py-1 rounded-xl tracking-widest uppercase">
                   {filteredUsers.length} Subscribers
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Manage premium subscribers and recurring tier deployments</p>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button 
                onClick={downloadXLSX}
                disabled={userRole !== 'admin'}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs tracking-tight border-2 border-slate-100 shadow-sm transition-all disabled:opacity-20"
              >
                <DownloadIcon className="h-4 w-4 text-indigo-500" />
                XLSX
              </button>
              <button 
                onClick={fetchMembers}
                className="p-3.5 bg-white hover:bg-slate-50 text-slate-400 rounded-2xl border-2 border-slate-100 shadow-sm transition-all"
              >
                <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin text-blue-600' : ''}`} />
              </button>
            </div>
          </div>

          {/* Real-time Search */}
          <div className="mb-8 relative group">
            <input 
              type="text"
              placeholder="Search priority roster..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-600" />
          </div>

          {/* Membership Roster Board */}
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Subscriber Identity</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Provisioned Plan</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Lifecycle Timeline</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {loading ? (
                    Array(3).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8 bg-slate-50/20" />
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-24 text-center">
                         <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-slate-100">
                            <AwardIcon className="h-6 w-6 text-slate-200" />
                         </div>
                         <h3 className="text-sm font-black text-slate-800">No Premium Members</h3>
                         <p className="text-slate-400 font-bold text-[10px]">Telemetry search returned 0 records.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user._id} className="hover:bg-slate-50/50 transition-all group">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-105 transition-transform">
                              {user.name?.charAt(0) || 'M'}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-black text-slate-900 leading-tight mb-1">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
                                 {user.mobile}
                                 {user.isVerified && <ShieldCheckIcon className="h-3 w-3 text-emerald-500" />}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                             <div className="p-2 bg-amber-50 rounded-lg">
                               <CreditCardIcon className="h-4 w-4 text-amber-600" />
                             </div>
                             <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{user.membership?.planId || 'Basic Care'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5"> 
                               <span className="w-10">Since:</span> 
                               <span className="text-slate-900">{new Date(user.membership?.startDate).toLocaleDateString()}</span>
                            </p>
                            <p className="text-[10px] font-black text-rose-400 uppercase flex items-center gap-1.5">
                               <span className="w-10">Expiry:</span>
                               <span className="text-rose-600">{new Date(user.membership?.expiryDate).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-black uppercase tracking-widest shadow-sm">
                            <div className="h-1 w-1 bg-emerald-500 rounded-full animate-pulse" />
                            Active Duty
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
               <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Portal Protocol Rev 2.1</p>
               <div className="flex items-center gap-2 text-blue-500 font-black text-[9px] uppercase tracking-widest cursor-pointer hover:text-blue-700 transition-colors">
                  Telemetry Logs <ArrowUpRightIcon className="h-3 w-3" />
               </div>
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
