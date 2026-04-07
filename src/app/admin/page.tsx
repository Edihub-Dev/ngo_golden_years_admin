'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  UsersIcon, 
  ClipboardListIcon, 
  UserPlusIcon, 
  IndianRupeeIcon,
  AlertTriangleIcon,
  ActivityIcon,
  ChevronRightIcon,
  ClockIcon,
  UserCheckIcon,
  MapPinIcon,
  MessageSquareIcon,
  AccessibilityIcon
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import RoleGuard from '@/components/admin/RoleGuard';
import { AdminService } from '@/lib/api';
import { AuthManager } from '@/lib/auth';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setUser(AuthManager.getInstance().getUser());
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await AdminService.getAnalytics() as any;
      if (response && response.success) {
        setAnalytics(response.analytics || response.data?.analytics || response.data);
      }
    } catch (error) {
      toast.error('Failed to sync real-time telemetry');
    } finally {
      setLoading(false);
    }
  };

  const navigateToRequest = (id: string) => {
    router.push(`/admin/requests?search=${id}`);
  };

  if (loading) {
    return (
//... skipping many lines for brevity in instruction block, will use multi-replace or careful single replace ...
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="h-24 w-24 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          <ActivityIcon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-blue-600 animate-pulse" />
        </div>
        <p className="mt-6 text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">Initializing Command Center...</p>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={['admin', 'subadmin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* Top Header */}
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
                Mission Overview
              </h1>
              <p className="text-slate-400 font-bold text-sm tracking-tight flex items-center gap-2">
                Real-time operational intelligence for <span className="text-blue-600">NGO Foundation</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={fetchAnalytics}
                className="px-6 py-3 bg-white border-2 border-slate-100 rounded-2xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
              >
                <ClockIcon className="h-4 w-4" />
                SYNC DATA
              </button>
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-12">
            {/* Total Users */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 text-slate-50 transition-transform group-hover:scale-110">
                 <UsersIcon className="h-24 w-24" />
               </div>
               <div className="relative z-10">
                 <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-indigo-100 shadow-lg">
                   <UsersIcon className="h-6 w-6" />
                 </div>
                 <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Global Participants</h3>
                 <p className="text-4xl font-black text-slate-900 leading-none mb-3">{analytics?.users?.total || 0}</p>
                 <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                       +{analytics?.users?.newThisMonth || 0} New
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">this billing cycle</span>
                 </div>
               </div>
            </div>

            {/* Service Requests */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 text-slate-50 transition-transform group-hover:scale-110">
                 <ClipboardListIcon className="h-24 w-24" />
               </div>
               <div className="relative z-10">
                 <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-6 shadow-amber-100 shadow-lg">
                   <ClipboardListIcon className="h-6 w-6" />
                 </div>
                 <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Care Orders</h3>
                 <p className="text-4xl font-black text-slate-900 leading-none mb-3">{analytics?.requests?.total || 0}</p>
                 <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-lg whitespace-nowrap",
                      (analytics?.requests?.pending || 0) > 0 ? "bg-rose-50 text-rose-500" : "bg-emerald-50 text-emerald-500"
                    )}>
                       {analytics?.requests?.pending || 0} Pending
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">awaiting assignment</span>
                 </div>
               </div>
            </div>

            {/* Staff Registry */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 text-slate-50 transition-transform group-hover:scale-110">
                 <UserCheckIcon className="h-24 w-24" />
               </div>
               <div className="relative z-10">
                 <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 shadow-purple-100 shadow-lg">
                   <UserCheckIcon className="h-6 w-6" />
                 </div>
                 <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Professionals</h3>
                 <p className="text-4xl font-black text-slate-900 leading-none mb-3">{analytics?.staff?.total || 0}</p>
                 <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                       {analytics?.staff?.available || 0} Active
                    </span>
                    <span className="text-[10px] font-bold text-slate-300">in current rotation</span>
                 </div>
               </div>
            </div>

            {/* Financial Telemetry (Admin Only) */}
            {user?.role === 'admin' && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group animate-in zoom-in-95 duration-500">
                 <div className="absolute top-0 right-0 p-8 text-slate-50 transition-transform group-hover:scale-110">
                   <IndianRupeeIcon className="h-24 w-24" />
                 </div>
                 <div className="relative z-10">
                   <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-emerald-100 shadow-lg">
                     <IndianRupeeIcon className="h-6 w-6" />
                   </div>
                   <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Platform Revenue</h3>
                   <p className="text-4xl font-black text-slate-900 leading-none mb-3">
                     ₹{(analytics?.revenue?.total || 0).toLocaleString()}
                   </p>
                   <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                      <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                         +₹{analytics?.revenue?.thisMonth || 0}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">current cycle surplus</span>
                   </div>
                 </div>
              </div>
            )}

            {/* Inquiries Monitor (Subadmin Only) */}
            {user?.role === 'subadmin' && (
              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden group animate-in zoom-in-95 duration-500">
                 <div className="absolute top-0 right-0 p-8 text-slate-50 transition-transform group-hover:scale-110">
                   <MessageSquareIcon className="h-24 w-24" />
                 </div>
                 <div className="relative z-10">
                   <div className="h-12 w-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-6 shadow-sky-100 shadow-lg">
                     <MessageSquareIcon className="h-6 w-6" />
                   </div>
                   <h3 className="text-slate-400 font-black text-[10px] uppercase tracking-widest mb-1">Citizen Inquiries</h3>
                   <p className="text-4xl font-black text-slate-900 leading-none mb-3">
                     {analytics?.inquiries?.total || 0}
                   </p>
                   <div className="pt-3 border-t border-slate-50 flex items-center gap-2">
                      <span className="text-[10px] font-black text-sky-500 bg-sky-50 px-2 py-0.5 rounded-lg whitespace-nowrap">
                         {analytics?.inquiries?.new || 0} New
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">awaiting response</span>
                   </div>
                 </div>
              </div>
            )}
          </div>

          {/* Operational Breakdown */}
          <div className="mb-12">
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] mb-6 flex items-center gap-2 px-1">
              Operational Sync Breakdown
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-blue-200 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <ActivityIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Doctor Visits</p>
                  <p className="text-xl font-black text-slate-900">{analytics?.services?.doctor_visit || 0}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-emerald-200 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                   <UserCheckIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Nursing Care</p>
                  <p className="text-xl font-black text-slate-900">{analytics?.services?.nurse_care || 0}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-indigo-200 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <AccessibilityIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Physiotherapy</p>
                  <p className="text-xl font-black text-slate-900">{analytics?.services?.physiotherapy || 0}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5 group hover:border-rose-200 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <AlertTriangleIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Emergency SOS</p>
                  <p className="text-xl font-black text-slate-900">{analytics?.services?.emergency_help || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Matrix */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
             {/* Critical Emergency Monitoring */}
             <div className="xl:col-span-1 space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] flex items-center gap-2">
                      <AlertTriangleIcon className="h-4 w-4 text-rose-500" />
                      SOS Monitoring
                   </h2>
                   <span className="px-3 py-1 bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black animate-pulse">
                      {analytics?.emergencyRequests?.count || 0} ACTIVE
                   </span>
                </div>

                <div className="space-y-4">
                   {analytics?.emergencyRequests?.requests?.length > 0 ? (
                     analytics.emergencyRequests.requests.map((alert: any, idx: number) => (
                       <button 
                         key={idx} 
                         onClick={() => navigateToRequest(alert._id)}
                         className="w-full text-left p-6 bg-white border-2 border-rose-50 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-rose-200 transition-all hover:shadow-lg hover:shadow-rose-100/50"
                       >
                          <div className="absolute right-0 top-0 p-4 opacity-5">
                             <AlertTriangleIcon className="h-12 w-12 text-rose-500" />
                          </div>
                          <div className="flex items-start gap-4">
                             <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-black">
                                {alert.user?.name?.charAt(0) || 'U'}
                             </div>
                             <div className="flex-1">
                                <p className="text-sm font-black text-slate-900 mb-1">{alert.user?.name}</p>
                                <p className="text-[10px] font-bold text-slate-500 leading-relaxed mb-4">{alert.description || 'Emergency telemetry signal triggered'}</p>
                                <div className="flex items-center gap-3">
                                   <span className="text-[9px] font-black text-rose-400 flex items-center gap-1">
                                      <ClockIcon className="h-3 w-3" />
                                      {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                   </span>
                                   <span className="text-[9px] font-black text-blue-600 flex items-center gap-1 hover:underline">
                                      <MapPinIcon className="h-3 w-3" />
                                      TRACK LIVE
                                   </span>
                                </div>
                             </div>
                          </div>
                       </button>
                     ))
                   ) : (
                    <div className="py-20 text-center bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[3rem]">
                       <div className="h-16 w-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl shadow-emerald-100">
                          <UserCheckIcon className="h-8 w-8" />
                       </div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No active crises</p>
                    </div>
                   )}
                </div>
             </div>

             {/* Recent Registry Additions & Transactions */}
             <div className="xl:col-span-2 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden flex flex-col">
                <div className="p-10 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                   <div>
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">Deployment Registry</h2>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Global service request lifecycle</p>
                   </div>
                   <button className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900">
                      <ChevronRightIcon className="h-5 w-5" />
                   </button>
                </div>
                
                <div className="flex-1 overflow-x-auto p-4 lg:p-8">
                   <table className="w-full text-left border-separate border-spacing-y-4">
                      <thead>
                         <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest pl-4">
                            <th className="pb-2 px-4">Participant</th>
                            <th className="pb-2 px-4">Service Scope</th>
                            <th className="pb-2 px-4">Operation Status</th>
                            <th className="pb-2 px-4 text-right">Registered</th>
                         </tr>
                      </thead>
                      <tbody className="space-y-4">
                        {(analytics?.recentRequests || []).slice(0, 6).map((r: any) => (
                           <tr 
                             key={r._id} 
                             onClick={() => navigateToRequest(r._id)}
                             className="group hover:bg-white transition-all rounded-2xl overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-slate-200/50"
                           >
                              <td className="py-5 px-6 rounded-l-[1.5rem] group-hover:bg-white border-y border-l border-slate-50 group-hover:border-slate-100">
                                 <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center font-black">
                                       {r.user?.name?.charAt(0)}
                                    </div>
                                    <div>
                                       <p className="text-xs font-black text-slate-900">{r.user?.name}</p>
                                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{r.user?.mobile}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="py-5 px-6 group-hover:bg-white border-y border-slate-50 group-hover:border-slate-100">
                                 <span className="text-[10px] font-black text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 uppercase tracking-tight">
                                   {r.serviceType?.replace('_', ' ')}
                                 </span>
                              </td>
                              <td className="py-5 px-6 group-hover:bg-white border-y border-slate-50 group-hover:border-slate-100">
                                 <span className={cn(
                                   "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border",
                                   r.status === 'completed' ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                                   r.status === 'pending' ? 'bg-amber-50 text-amber-500 border-amber-100' :
                                   r.status === 'assigned' ? 'bg-blue-50 text-blue-500 border-blue-100' :
                                   'bg-slate-50 text-slate-500 border-slate-100'
                                 )}>
                                   {r.status}
                                 </span>
                              </td>
                              <td className="py-5 px-6 rounded-r-[1.5rem] group-hover:bg-white border-y border-r border-slate-50 group-hover:border-slate-100 text-right">
                                 <p className="text-xs font-black text-slate-900">{new Date(r.createdAt).toLocaleDateString()}</p>
                                 <p className="text-[9px] font-bold text-slate-400 uppercase">{new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              </td>
                           </tr>
                        ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
