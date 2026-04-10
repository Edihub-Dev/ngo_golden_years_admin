'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCardIcon, 
  SearchIcon,
  DownloadIcon,
  CalendarIcon,
  CheckCircleIcon,
  ArrowUpRightIcon,
  FilterIcon,
  RefreshCwIcon,
  ClockIcon,
  BanknoteIcon,
  ArrowRightIcon
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminService } from '@/lib/api';
import { AuthManager } from '@/lib/auth';
import RoleGuard from '@/components/admin/RoleGuard';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('');
  const [filters, setFilters] = useState({ search: '', status: '', startDate: '', endDate: '' });
  const [selectedTxn, setSelectedTxn] = useState<any>(null);

  useEffect(() => {
    setUserRole(AuthManager.getInstance().getUser()?.role || '');
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getDonations(filters);
      if (res.success && res.data) {
        setPayments(res.data.donations || res.data);
      }
    } catch (err) {
      toast.error('Failed to load transaction telemetry');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const searchLower = filters.search.toLowerCase();
    const donor = payment.donorDetails || {};
    const matchesSearch = 
      payment.user?.name?.toLowerCase().includes(searchLower) ||
      donor.fullName?.toLowerCase().includes(searchLower) ||
      payment.payment?.paymentId?.toLowerCase().includes(searchLower) ||
      donor.fathersName?.toLowerCase().includes(searchLower) ||
      donor.pan?.toLowerCase().includes(searchLower) ||
      payment.cause?.toLowerCase().includes(searchLower);
    
    const matchesStatus = filters.status ? payment.payment?.status === filters.status : true;

    const date = new Date(payment.payment?.paidAt || payment.createdAt);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    const matchesStart = start ? date >= start : true;
    const matchesEnd = end ? date <= end : true;
    
    return matchesSearch && matchesStatus && matchesStart && matchesEnd;
  });

  const downloadXLSX = () => {
    if (filteredPayments.length === 0) return toast.error('No transactions to export');
    
    const dataToExport = filteredPayments.map(p => ({
      'Transaction ID': p.payment?.paymentId || 'N/A',
      'Donor Name': p.donorDetails?.fullName || p.user?.name,
      'Father\'s Name': p.donorDetails?.fathersName || 'N/A',
      'Mobile': p.donorDetails?.phone || p.user?.mobile,
      'Email': p.donorDetails?.email || p.user?.email,
      'PAN': p.donorDetails?.pan || 'N/A',
      'Cause': p.cause || 'N/A',
      'Amount (INR)': p.amount,
      'Status': p.payment?.status?.toUpperCase(),
      'Timestamp': new Date(p.payment?.paidAt || p.createdAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donations");
    
    const fileName = `donation_ledger_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Ledger downloaded');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'failed': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'subadmin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full min-h-screen">
          {/* Page Title & Controls */}
          <div className="mb-6 lg:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Donation Registry
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-xl tracking-widest uppercase">
                  {filteredPayments.length} Entries
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Exclusively monitor donation transactions</p>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button 
                onClick={downloadXLSX}
                disabled={userRole !== 'admin'}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs tracking-tight border-2 border-slate-100 shadow-sm transition-all disabled:opacity-20"
              >
                <DownloadIcon className="h-4 w-4 text-emerald-500" />
                DONATION XLSX
              </button>
              <button 
                onClick={fetchPayments}
                className="p-3.5 bg-white hover:bg-slate-50 text-blue-600 rounded-2xl border-2 border-slate-100 shadow-sm transition-all"
              >
                <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Global Financial Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2 relative group">
              <input 
                type="text"
                placeholder="Search by donor, PAN, Father's name..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500" />
            </div>

            <select 
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border-2 border-slate-100 shadow-sm">
              <div className="flex flex-col items-center border-r border-slate-50 pr-3">
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 self-start ml-1">From</span>
                 <input type="date" value={filters.startDate} onChange={(e) => setFilters({...filters, startDate: e.target.value})} className="text-[10px] font-black text-slate-800 outline-none bg-transparent" />
              </div>
              <div className="flex flex-col items-center">
                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 self-start ml-1">To</span>
                 <input type="date" value={filters.endDate} onChange={(e) => setFilters({...filters, endDate: e.target.value})} className="text-[10px] font-black text-slate-800 outline-none bg-transparent" />
              </div>
            </div>
          </div>

          {/* Financial Overview Board */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Donations (Paid)</p>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none tracking-tight">
                ₹{filteredPayments.filter(p => p.payment?.status === 'paid').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()}
              </h3>
              <div className="text-[8px] text-emerald-500 font-black mt-3 flex items-center gap-1.5 uppercase">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
              </div>
            </div>
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Records</p>
              <h3 className="text-2xl lg:text-3xl font-black text-blue-600 leading-none tracking-tight">
                {filteredPayments.length} <span className="text-xs font-bold text-slate-300">ENTRIES</span>
              </h3>
              <p className="text-[8px] text-slate-300 font-bold mt-3 uppercase tracking-widest">Global History</p>
            </div>
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Pending Donations</p>
              <h3 className="text-2xl lg:text-3xl font-black text-amber-600 leading-none tracking-tight">
                ₹{filteredPayments.filter(p => p.payment?.status === 'pending').reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()} <span className="text-xs font-bold text-slate-300">OWED</span>
              </h3>
              <p className="text-[8px] text-amber-300 font-bold mt-3 uppercase tracking-widest">Awaiting Deposit</p>
            </div>
          </div>

          {/* Ledger Transaction Board */}
          <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-xl shadow-slate-300/30 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Donor Profile</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Impact Cause</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 font-medium">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-8 py-8 bg-slate-50/10" />
                      </tr>
                    ))
                  ) : filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-32 text-center">
                        <ClockIcon className="h-10 w-10 text-slate-100 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-900 tracking-tight">Zero-State Ledger</h3>
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-slate-50/50 transition-all group border-l-4 border-l-transparent hover:border-l-blue-600">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-black text-xs">
                              {(payment.donorDetails?.fullName || payment.user?.name || 'U').charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900 leading-tight">{payment.donorDetails?.fullName || payment.user?.name}</p>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                 {payment.payment?.paymentId || 'No ID'} • {new Date(payment.payment?.paidAt || payment.createdAt).toLocaleDateString()}
                               </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="space-y-1">
                            <p className="text-xs font-black text-slate-900 leading-none capitalize">
                               {payment.cause} Fund
                            </p>
                            {payment.donorDetails?.fathersName && (
                               <p className="text-[10px] text-slate-400 font-bold">F/n: {payment.donorDetails.fathersName}</p>
                            )}
                            {payment.donorDetails?.pan && (
                               <p className="text-[10px] text-slate-400 font-bold">PAN: {payment.donorDetails.pan}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-1.5 text-slate-900 font-black">
                            <span className="text-xl tracking-tighter">₹{payment.amount?.toLocaleString()}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end gap-2">
                             <span className={`inline-flex items-center px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all ${getStatusColor(payment.payment?.status)}`}>
                                {payment.payment?.status}
                             </span>
                             <button 
                               onClick={() => setSelectedTxn(payment)}
                               className="text-blue-500 hover:text-blue-700 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer ring-0 outline-none"
                             >
                               See Dossier <ArrowRightIcon className="h-2.5 w-2.5" />
                             </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dossier Modal */}
          {selectedTxn && (
            <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
               <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-400">
                  <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                      <div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Donor Dossier</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Ref: {selectedTxn.payment?.paymentId || 'N/A'}</p>
                      </div>
                      <button onClick={() => setSelectedTxn(null)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-600 transition-all font-black text-sm">
                        CLOSE
                      </button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1.5">Full Name</label>
                           <p className="text-lg font-black text-slate-900">{selectedTxn.donorDetails?.fullName || selectedTxn.user?.name}</p>
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1.5">Father's Name</label>
                           <p className="text-lg font-black text-slate-900">{selectedTxn.donorDetails?.fathersName || 'N/A'}</p>
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1.5">Email Address</label>
                           <p className="text-lg font-black text-slate-900">{selectedTxn.donorDetails?.email || selectedTxn.user?.email}</p>
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1.5">Mobile Contact</label>
                           <p className="text-lg font-black text-slate-900">{selectedTxn.donorDetails?.phone || selectedTxn.user?.mobile}</p>
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1.5">PAN Card</label>
                           <p className="text-lg font-black text-slate-900 tracking-widest">{selectedTxn.donorDetails?.pan || 'N/A'}</p>
                        </div>
                        <div>
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1.5">Donation Cause</label>
                           <p className="text-lg font-black text-[#00b749] uppercase">{selectedTxn.cause} Project</p>
                        </div>
                        <div className="col-span-1 md:col-span-2">
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1.5">Donor Residence</label>
                           <p className="text-lg font-black text-slate-900 italic leading-relaxed">
                              {selectedTxn.donorDetails?.address || 'N/A'}
                           </p>
                        </div>
                     </div>

                     <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center justify-between">
                        <div>
                           <label className="text-[9px] font-black text-slate-300 uppercase tracking-widest block mb-1">Impact Contribution</label>
                           <p className="text-4xl font-black text-slate-900 tracking-tighter">₹{selectedTxn.amount?.toLocaleString()}</p>
                        </div>
                        <div className={`px-6 py-3 rounded-2xl border-2 font-black text-xs uppercase tracking-widest ${getStatusColor(selectedTxn.payment?.status)}`}>
                           {selectedTxn.payment?.status}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  );
}

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
