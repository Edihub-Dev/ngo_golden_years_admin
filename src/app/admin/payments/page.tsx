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
  const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '' });

  useEffect(() => {
    setUserRole(AuthManager.getInstance().getUser()?.role || '');
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getRequests();
      if (res.success && res.data) {
        const paidOnly = (res.data.requests || res.data).filter((r: any) => r.payment?.status === 'paid');
        setPayments(paidOnly);
      }
    } catch (err) {
      toast.error('Failed to load transaction telemetry');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = 
      payment.user?.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      payment.payment?.paymentId?.toLowerCase().includes(filters.search.toLowerCase());
    
    const date = new Date(payment.payment?.paidAt || payment.createdAt);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    const matchesStart = start ? date >= start : true;
    const matchesEnd = end ? date <= end : true;
    
    return matchesSearch && matchesStart && matchesEnd;
  });

  const downloadXLSX = () => {
    if (filteredPayments.length === 0) return toast.error('No transactions to export');
    
    const dataToExport = filteredPayments.map(p => ({
      'Transaction ID': p.payment?.paymentId || 'N/A',
      'Payer Name': p.user?.name,
      'Mobile': p.user?.mobile,
      'Amount (INR)': p.payment?.amount,
      'Platform Fee': 'PAID',
      'Transaction Status': 'SUCCESSFUL',
      'Timestamp': new Date(p.payment?.paidAt).toLocaleString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");
    
    const fileName = `financial_ledger_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Ledger downloaded');
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
                Financial Registry
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-xl tracking-widest uppercase">
                  {filteredPayments.length} Clearances
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Monitor revenue gateways and transaction data</p>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button 
                onClick={downloadXLSX}
                disabled={userRole !== 'admin'}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs tracking-tight border-2 border-slate-100 shadow-sm transition-all disabled:opacity-20"
              >
                <DownloadIcon className="h-4 w-4 text-emerald-500" />
                LEDGER XLSX
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
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
              <input 
                type="text"
                placeholder="Search by payer or Transaction ID..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500" />
            </div>
            
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
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Revenue</p>
              <h3 className="text-2xl lg:text-3xl font-black text-slate-900 leading-none tracking-tight">
                ₹{filteredPayments.reduce((acc, curr) => acc + (curr.payment?.amount || 0), 0).toLocaleString()}
              </h3>
              <div className="text-[8px] text-emerald-500 font-black mt-3 flex items-center gap-1.5 uppercase">
                <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry Sync
              </div>
            </div>
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Clearances</p>
              <h3 className="text-2xl lg:text-3xl font-black text-blue-600 leading-none tracking-tight">
                {filteredPayments.length} <span className="text-xs font-bold text-slate-300">TXNS</span>
              </h3>
              <p className="text-[8px] text-slate-300 font-bold mt-3 uppercase tracking-widest">100% Success Rate</p>
            </div>
            <div className="bg-white p-6 lg:p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/30">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Unique Payers</p>
              <h3 className="text-2xl lg:text-3xl font-black text-indigo-600 leading-none tracking-tight">
                {new Set(filteredPayments.map(p => p.user?._id)).size} <span className="text-xs font-bold text-slate-300">ENTITIES</span>
              </h3>
              <p className="text-[8px] text-indigo-300 font-bold mt-3 uppercase tracking-widest">Verified Accounts</p>
            </div>
          </div>

          {/* Ledger Transaction Board */}
          <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-xl shadow-slate-300/30 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction Relay</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Payer Profile</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Verification</th>
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
                            <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm border border-indigo-100 transition-transform group-hover:scale-105">
                              <CreditCardIcon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900 leading-tight">{payment.payment?.paymentId || 'Pending'}</p>
                              <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">
                                {new Date(payment.payment?.paidAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-black text-xs">
                              {payment.user?.name?.charAt(0) || 'U'}
                            </div>
                            <div>
                              <p className="text-xs font-black text-slate-900 leading-none mb-1">{payment.user?.name}</p>
                              <p className="text-slate-400 text-[10px] font-bold">{payment.user?.mobile}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-1.5 text-slate-900">
                            <span className="text-xl font-black tracking-tighter">₹{payment.payment?.amount?.toLocaleString()}</span>
                          </div>
                          <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest mt-0.5">Verified Balance</p>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex flex-col items-end gap-2">
                             <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest border border-slate-800 shadow-sm">
                                Signed <VerifiedIcon className="h-2.5 w-2.5 text-emerald-400 ml-1" />
                             </span>
                             <div className="text-blue-500 hover:text-blue-700 font-black text-[9px] uppercase tracking-widest flex items-center gap-1.5 cursor-pointer">
                               Receipt <ArrowRightIcon className="h-2.5 w-2.5" />
                             </div>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
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
