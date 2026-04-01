'use client';

import { useState, useEffect } from 'react';
import { 
  Trash2Icon, 
  MailIcon, 
  PhoneIcon, 
  MessageSquareIcon, 
  ArchiveIcon, 
  ChevronRightIcon,
  DownloadIcon,
  CalendarIcon,
  RefreshCwIcon,
  SearchIcon,
  X,
  MessageCircleIcon
} from 'lucide-react';
import { AdminService } from '@/lib/api';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RoleGuard from '@/components/admin/RoleGuard';
import { AuthManager } from '@/lib/auth';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'read' | 'archived';
  createdAt: string;
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    setUser(AuthManager.getInstance().getUser());
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getInquiries();
      if (res.success && res.data?.inquiries) {
        setInquiries(res.data.inquiries);
      } else {
        toast.error('Failed to load inquiries');
      }
    } catch (err) {
      toast.error('Network error while loading inquiries');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await AdminService.updateInquiry(id, status);
      if (res.success) {
        setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: status as any } : inq));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: status as any } : null);
        }
        toast.success(`Marked as ${status}`);
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry forever?')) return;
    try {
      const res = await AdminService.deleteInquiry(id);
      if (res.success) {
        setInquiries(prev => prev.filter(i => i._id !== id));
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
        toast.success('Inquiry deleted successfully');
      }
    } catch (err) {
      toast.error('Failed to delete inquiry');
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    const q = filters.search.toLowerCase();
    const isSearchMatch = i.name.toLowerCase().includes(q) || i.email.toLowerCase().includes(q) || i.phone.includes(q);
    
    const date = new Date(i.createdAt);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    const isStartMatch = start ? date >= start : true;
    const isEndMatch = end ? date <= end : true;

    return isSearchMatch && isStartMatch && isEndMatch;
  });

  const downloadXLSX = () => {
    if (filteredInquiries.length === 0) return toast.error('No data to export');
    
    const dataToExport = filteredInquiries.map(i => ({
      'Date': new Date(i.createdAt).toLocaleString(),
      'Name': i.name,
      'Email': i.email,
      'Phone': i.phone,
      'Status': i.status.toUpperCase(),
      'Message': i.message
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inquiries");
    
    const fileName = `public_inquiries_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Inquiries downloaded in XLSX format');
  };

  return (
    <RoleGuard allowedRoles={['admin', 'subadmin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-8 overflow-hidden flex flex-col h-screen">
          {/* Header with Filters */}
          <div className="mb-6 lg:mb-10 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Public Inquiries
                <span className="text-[10px] font-black bg-amber-100 text-amber-600 px-3 py-1 rounded-xl tracking-widest uppercase">
                  {filteredInquiries.length} Messages
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Manage platform support and contact requests</p>
            </div>

            <div className="flex flex-wrap items-center gap-2 lg:gap-3">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border-2 border-slate-100 shadow-sm">
                <div className="flex flex-col items-center border-r border-slate-100 pr-3">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 self-start ml-1">From</span>
                  <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                    className="text-[10px] font-black text-slate-800 outline-none cursor-pointer bg-transparent"
                  />
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5 self-start ml-1">To</span>
                  <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                    className="text-[10px] font-black text-slate-800 outline-none cursor-pointer bg-transparent"
                  />
                </div>
              </div>

              <button 
                onClick={downloadXLSX}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs tracking-tight border-2 border-slate-100 shadow-sm transition-all"
              >
                <DownloadIcon className="h-4 w-4 text-emerald-500" />
                XLSX
              </button>
              <button 
                onClick={fetchInquiries}
                className="p-3.5 bg-white hover:bg-slate-50 text-blue-600 rounded-2xl border-2 border-slate-100 shadow-sm transition-all"
              >
                <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 min-h-0 overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0 custom-scrollbar">
            {/* List Section */}
            <div className="lg:col-span-4 flex flex-col gap-4 min-h-[300px] lg:h-full overflow-hidden">
              <div className="relative group">
                <input 
                  type="text"
                  placeholder="Search..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold shadow-sm focus:border-blue-500 outline-none transition-all placeholder:text-slate-300"
                />
                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500" />
              </div>

              <div className="flex-1 lg:overflow-y-auto pr-1 custom-scrollbar space-y-3 pb-4">
                {loading ? (
                  Array(4).fill(0).map((_, i) => (
                    <div key={i} className="h-24 bg-white/50 border-2 border-slate-50 rounded-2xl animate-pulse" />
                  ))
                ) : filteredInquiries.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 p-8">
                     <MessageSquareIcon className="h-8 w-8 text-slate-100 mx-auto mb-4" />
                     <h3 className="text-sm font-black text-slate-800">No results</h3>
                  </div>
                ) : (
                  filteredInquiries.map((inquiry) => (
                    <button 
                      key={inquiry._id}
                      onClick={() => {
                        setSelectedInquiry(inquiry);
                        if (inquiry.status === 'new') updateStatus(inquiry._id, 'read');
                        // Scroll to top on mobile when selecting
                        if (window.innerWidth < 1024) {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                      className={`p-6 rounded-3xl text-left transition-all duration-300 border-2 group relative overflow-hidden flex flex-col gap-2 ${
                        selectedInquiry?._id === inquiry._id 
                          ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20' 
                          : 'bg-white border-white hover:border-slate-100 shadow-sm'
                      }`}
                    >
                      {inquiry.status === 'new' && (
                        <div className="absolute top-3 right-3 h-2 w-2 bg-emerald-400 rounded-full ring-4 ring-emerald-500/10" />
                      )}
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${selectedInquiry?._id === inquiry._id ? 'text-white/60' : 'text-slate-400'}`}>
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                      <h3 className={`font-black text-sm tracking-tight leading-none ${selectedInquiry?._id === inquiry._id ? 'text-white' : 'text-slate-900'}`}>{inquiry.name}</h3>
                      <p className={`text-[11px] font-bold leading-relaxed line-clamp-1 ${selectedInquiry?._id === inquiry._id ? 'text-blue-100/80' : 'text-slate-400'}`}>{inquiry.message}</p>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-8 flex flex-col h-full bg-white rounded-3xl lg:rounded-[3rem] border-2 border-slate-50 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              {selectedInquiry ? (
                <div className="flex flex-col h-full">
                  
                  {/* Profile Header */}
                  <div className="p-6 lg:p-10 bg-slate-50/50 border-b-2 border-slate-100/50">
                    <div className="flex flex-col sm:flex-row sm:items-start lg:items-center gap-6">
                      <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                        {selectedInquiry.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{selectedInquiry.name}</h2>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                            selectedInquiry.status === 'archived' 
                              ? 'bg-amber-100 text-amber-700' 
                              : 'bg-emerald-100 text-emerald-700'
                          }`}>
                            {selectedInquiry.status}
                          </span>
                        </div>
                        <p className="text-slate-400 font-bold text-[11px] flex items-center gap-2">
                          <CalendarIcon className="h-3.5 w-3.5" />
                          Received on {new Date(selectedInquiry.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <button 
                        onClick={() => handleDelete(selectedInquiry._id)}
                        disabled={user?.role !== 'admin'}
                        className="p-4 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all border border-slate-100 shadow-sm self-start sm:self-auto disabled:opacity-20"
                      >
                        <Trash2Icon className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                      <a href={`mailto:${selectedInquiry.email}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-blue-500 transition-colors group">
                        <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                          <MailIcon className="h-5 w-5 text-blue-600 group-hover:text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Email</p>
                          <p className="text-xs font-black text-slate-800 truncate">{selectedInquiry.email}</p>
                        </div>
                      </a>
                      <a href={`tel:${selectedInquiry.phone}`} className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-emerald-500 transition-colors group">
                        <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
                          <PhoneIcon className="h-5 w-5 text-emerald-600 group-hover:text-white" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">Phone</p>
                          <p className="text-xs font-black text-slate-800 truncate">{selectedInquiry.phone}</p>
                        </div>
                      </a>
                    </div>
                  </div>

                  {/* Message Body Content */}
                  <div className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] pl-1">
                        MESSAGE BODY
                      </h3>
                      <div className="bg-slate-50/80 p-8 lg:p-12 rounded-[2.5rem] border border-slate-100 shadow-inner">
                        <p className="text-slate-600 text-sm lg:text-base leading-relaxed font-bold tracking-tight whitespace-pre-wrap break-words">
                          {selectedInquiry.message}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Controls */}
                  <div className="p-6 lg:p-10 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <button 
                      onClick={() => updateStatus(selectedInquiry._id, 'archived')}
                      disabled={selectedInquiry.status === 'archived'}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-50 text-slate-500 rounded-2xl font-black text-xs tracking-widest hover:bg-slate-100 transition-all border border-slate-200 disabled:opacity-30"
                    >
                      <ArchiveIcon className="h-4 w-4" />
                      {selectedInquiry.status === 'archived' ? 'ARCHIVED' : 'ARCHIVE'}
                    </button>
                    <a 
                      href={`mailto:${selectedInquiry.email}?subject=Response from Golden Care`}
                      className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs tracking-widest shadow-lg shadow-blue-600/20 transition-all"
                    >
                      SEND RESPONSE
                      <ChevronRightIcon className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center p-10 text-center">
                  <div className="max-w-xs">
                    <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mx-auto mb-6">
                      <MailIcon className="h-10 w-10" />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 tracking-tight">Select an Inquiry</h3>
                    <p className="text-slate-400 font-bold text-xs mt-2">Choose a message from the list to view its full details.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
