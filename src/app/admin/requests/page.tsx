'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  ClipboardListIcon, 
  SearchIcon, 
  DownloadIcon, 
  CalendarIcon, 
  RefreshCwIcon,
  CheckCircle2Icon,
  ClockIcon,
  AlertCircleIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  FilterIcon,
  UserCheckIcon,
  ChevronRightIcon,
  Trash2Icon
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminService } from '@/lib/api';
import { AuthManager } from '@/lib/auth';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import RoleGuard from '@/components/admin/RoleGuard';
import { cn } from '@/lib/utils';

const STATUS_CONFIG: any = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  assigned: { label: 'Assigned', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  in_progress: { label: 'In Progress', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  completed: { label: 'Completed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  cancelled: { label: 'Cancelled', color: 'bg-slate-100 text-slate-700 border-slate-200' },
  rejected: { label: 'Rejected', color: 'bg-rose-100 text-rose-700 border-rose-200' },
};

export default function ServiceRequestsPage() {
  const searchParams = useSearchParams();
  const [requests, setRequests] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState({ 
    search: searchParams.get('search') || '', 
    status: '', 
    startDate: '', 
    endDate: '' 
  });
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    setUser(AuthManager.getInstance().getUser());
    fetchRequests();
    fetchStaff();
  }, [filters.status, filters.search, filters.startDate, filters.endDate]); // Re-fetch on filter change

  const fetchRequests = async () => {
    try {
      const res = await AdminService.getRequests(filters);
      if (res.success) {
        setRequests(res.data.requests || []);
      }
    } catch (error) {
      toast.error('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStaff = async () => {
    try {
      const res = await AdminService.getStaff();
      if (res.success) setStaff(res.data.staff || []);
    } catch (err) {}
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const res = await AdminService.updateRequestStatus(id, status);
      if (res.success) {
        toast.success(`Request marked as ${status}`);
        fetchRequests();
      }
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this service request? This action cannot be undone.')) return;
    try {
      const res = await AdminService.deleteRequest(id);
      if (res.success) {
        toast.success('Service request deleted locally');
        fetchRequests();
      }
    } catch (err) {
      toast.error('Failed to delete request');
    }
  };

  const handleAssignStaff = async (staffId: string) => {
    if (!selectedRequest) return;
    try {
      const res = await AdminService.assignStaffToRequest(selectedRequest._id, staffId);
      if (res.success) {
        toast.success('Staff assigned successfully');
        setIsAssignModalOpen(false);
        fetchRequests();
      }
    } catch (err: any) {
      toast.error(err.message || 'Assignment failed');
    }
  };

  const downloadXLSX = () => {
    if (requests.length === 0) return toast.error('No data to export');
    const data = requests.map(r => ({
      ID: r._id,
      User: r.user?.name,
      Mobile: r.user?.mobile,
      Service: r.customServiceName || r.serviceType.replace('_', ' '),
      Status: r.status.toUpperCase(),
      Requested_Date: new Date(r.requestedDate).toLocaleDateString(),
      Amount: r.payment?.amount || 0,
      Assigned_Staff: r.assignedStaff?.map((a: any) => a.staff?.name).join(', ') || 'N/A'
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "ServiceRequests");
    XLSX.writeFile(wb, `service_requests_${new Date().toISOString().split('T')[0]}.xlsx`);
    toast.success('Report exported');
  };

  const filteredCount = requests.length;

  return (
    <RoleGuard allowedRoles={['admin', 'subadmin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full">
          {/* Header */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Service Lifecycle
                <span className="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-xl tracking-widest uppercase">
                  {filteredCount} Orders
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Manage eldercare service requests and staff assignment</p>
            </div>
            <div className="flex gap-3">
              <button onClick={downloadXLSX} className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs tracking-tight border-2 border-slate-100 shadow-sm transition-all">
                <DownloadIcon className="h-4 w-4 text-emerald-500" />
                REPORT XLSX
              </button>
              <button onClick={fetchRequests} className="p-3.5 bg-white hover:bg-slate-50 text-blue-600 rounded-2xl border-2 border-slate-100 shadow-sm transition-all">
                <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2 relative">
              <input 
                type="text" 
                placeholder="Search by user or service..." 
                value={filters.search}
                onChange={e => setFilters({...filters, search: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-blue-500 transition-all"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
            </div>
            <select 
              value={filters.status}
              onChange={e => setFilters({...filters, status: e.target.value})}
              className="px-5 py-4 bg-white border-2 border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-700 outline-none cursor-pointer"
            >
              <option value="">All Statuses</option>
              {Object.keys(STATUS_CONFIG).map(s => <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>)}
            </select>
            <div className="bg-white px-4 py-2 rounded-2xl border-2 border-slate-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <CalendarIcon className="h-3.5 w-3.5 text-slate-300 mr-2" />
                  <input 
                    type="date" 
                    value={filters.startDate}
                    onChange={e => setFilters({...filters, startDate: e.target.value})}
                    className="text-[9px] font-black text-slate-800 outline-none bg-transparent uppercase" 
                  />
                </div>
                <div className="h-4 w-px bg-slate-100 mx-2" />
                <div className="flex items-center">
                  <input 
                    type="date" 
                    value={filters.endDate}
                    onChange={e => setFilters({...filters, endDate: e.target.value})}
                    className="text-[9px] font-black text-slate-800 outline-none bg-transparent uppercase text-right" 
                  />
                </div>
            </div>
          </div>

          {/* Grid of Requests */}
          <div className="grid grid-cols-1 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => <div key={i} className="h-40 bg-white rounded-3xl animate-pulse" />)
            ) : requests.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
                <ClipboardListIcon className="h-12 w-12 text-slate-100 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-900">No Orders Found</h3>
              </div>
            ) : (
              requests.map(request => (
                <div key={request._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <button 
                             onClick={() => handleDelete(request._id)}
                             disabled={user?.role !== 'admin'}
                             className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all disabled:opacity-20"
                             title="Purge Record"
                          >
                             <Trash2Icon className="h-4 w-4" />
                          </button>
                          <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Order ID: #{request._id.toUpperCase()}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${STATUS_CONFIG[request.status]?.color || ''}`}>
                          {STATUS_CONFIG[request.status]?.label || request.status}
                        </span>
                      </div>
                      
                      <div className="flex items-start gap-5">
                        <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100 text-blue-600 shadow-sm">
                          <ClipboardListIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-black text-slate-900 leading-tight mb-1">
                            {request.customServiceName || request.serviceType.replace('_', ' ').toUpperCase()}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 lowercase">
                              <UserIcon className="h-3 w-3" /> {request.user?.name || 'Unknown User'}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                              <CalendarIcon className="h-3 w-3" /> {new Date(request.requestedDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs font-black text-blue-600 uppercase tracking-tighter">
                               ₹{request.payment?.amount || 0}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-4 pt-6 border-t border-slate-50">
                        <div className="flex items-center gap-2">
                           <MapPinIcon className="h-3.5 w-3.5 text-slate-300" />
                           <span className="text-[10px] font-bold text-slate-500 truncate max-w-xs">{request.address?.street}, {request.address?.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <PhoneIcon className="h-3.5 w-3.5 text-slate-300" />
                           <span className="text-[10px] font-bold text-slate-500">{request.user?.mobile}</span>
                        </div>
                        {(request.serviceType === 'emergency_help' || request.serviceType === 'emergency') && request.address?.coordinates?.lat && (
                          <a 
                            href={`https://www.google.com/maps?q=${request.address.coordinates.lat},${request.address.coordinates.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-lg group/map border border-red-100 hover:bg-red-100 transition-colors"
                          >
                             <MapPinIcon className="h-3.5 w-3.5 animate-bounce" />
                             <span className="text-[9px] font-black uppercase">View Live Location</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col justify-center gap-3 min-w-[240px]">
                      {/* Status Control Dropdown */}
                      <div className="relative group/status">
                        <select 
                          value={request.status}
                          onChange={(e) => handleUpdateStatus(request._id, e.target.value)}
                          className={cn(
                            "w-full px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest outline-none border-2 cursor-pointer transition-all",
                            STATUS_CONFIG[request.status]?.color || "bg-white border-slate-100"
                          )}
                        >
                          {Object.keys(STATUS_CONFIG).map(s => (
                            <option key={s} value={s} className="bg-white text-slate-900">{STATUS_CONFIG[s].label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <button 
                        onClick={() => { setSelectedRequest(request); setIsAssignModalOpen(true); }}
                        className={cn(
                          "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border-2",
                          request.assignedStaff?.length > 0
                            ? "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            : "bg-white border-slate-100 text-slate-700 hover:bg-slate-50"
                        )}
                      >
                        <UserCheckIcon className="h-4 w-4" />
                        {request.assignedStaff?.length > 0 
                          ? `Update Caregiver`
                          : "Assign Professional"}
                      </button>

                      {/* Explicit Action Buttons for common flows */}
                      {request.status === 'pending' && (
                        <button 
                          onClick={() => handleUpdateStatus(request._id, 'assigned')}
                          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                        >
                          Quick Approve
                        </button>
                      )}

                      {request.assignedStaff?.length > 0 && (
                        <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Professional</p>
                          <div className="flex items-center gap-2">
                             <div className="h-5 w-5 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black">
                                {request.assignedStaff[0].staff?.name?.charAt(0) || '?'}
                             </div>
                             <p className="text-[10px] font-black text-slate-700 truncate">{request.assignedStaff[0].staff?.name || 'Assigned'}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Assignment Modal */}
        {isAssignModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
             <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-400">
                <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
                    <div>
                      <h2 className="text-xl font-black text-slate-900">Deploy Professional</h2>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Assign staff to order #{selectedRequest?._id.slice(-6)}</p>
                    </div>
                    <button onClick={() => setIsAssignModalOpen(false)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-300 hover:text-slate-600 transition-all">
                      <ClockIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                   {staff.filter(s => s.isActive && s.services.includes(selectedRequest?.serviceType)).length === 0 ? (
                     <div className="text-center py-10">
                        <AlertCircleIcon className="h-10 w-10 text-rose-100 mx-auto mb-3" />
                        <p className="text-sm font-black text-slate-400">No compatible staff online</p>
                     </div>
                   ) : (
                    staff.filter(s => s.isActive && s.services.includes(selectedRequest?.serviceType)).map(member => (
                      <div key={member._id} className="p-5 bg-white border-2 border-slate-50 rounded-2xl hover:border-blue-200 transition-all flex items-center justify-between group">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg">
                              {member.name.charAt(0)}
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-900">{member.name}</p>
                               <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{member.role} • {member.experience} Yrs Exp</p>
                            </div>
                         </div>
                         <button 
                            onClick={() => handleAssignStaff(member._id)}
                            className="p-3 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl transition-all"
                         >
                            <ChevronRightIcon className="h-5 w-5" />
                         </button>
                      </div>
                    ))
                   )}
                </div>
             </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
