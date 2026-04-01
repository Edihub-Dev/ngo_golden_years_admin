'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  SearchIcon, 
  PlusIcon, 
  Pencil, 
  Trash2,
  CameraIcon,
  DownloadIcon,
  CalendarIcon,
  RefreshCwIcon,
  CheckCircleIcon,
  X,
  StethoscopeIcon,
  BriefcaseIcon
} from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { AdminService } from '@/lib/api';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import RoleGuard from '@/components/admin/RoleGuard';

const ROLES = [
  { id: 'doctor', name: 'Doctor' },
  { id: 'nurse', name: 'Nurse' },
  { id: 'physiotherapist', name: 'Physiotherapist' },
  { id: 'caregiver', name: 'Caregiver' },
  { id: 'coordinator', name: 'Coordinator' },
  { id: 'driver', name: 'Driver' },
  { id: 'helper', name: 'Helper' }
];

const SERVICE_TYPES = [
  { id: 'doctor_visit', name: 'Doctor Visit' },
  { id: 'nurse_care', name: 'Nurse Care' },
  { id: 'physiotherapy', name: 'Physiotherapy' },
  { id: 'emergency_help', name: 'Emergency Help' }
];

export default function PractitionerManagement() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', startDate: '', endDate: '' });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<any>({ 
    name: '', mobile: '', email: '', role: 'caregiver', 
    experience: '', specialization: '', skills: '', photoUrl: '', services: [] as string[] 
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await AdminService.getStaff();
      if (res.success && res.data?.staff) {
        setStaff(res.data.staff || []);
      }
    } catch (error) {
      toast.error('Failed to load staff list');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ 
      name: '', mobile: '', email: '', role: 'caregiver', 
      experience: '', specialization: '', skills: '', photoUrl: '', services: [] 
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setFormData({
      ...member,
      experience: member.experience?.toString() || '',
      skills: Array.isArray(member.skills) ? member.skills.join(', ') : '',
      photoUrl: member.documents?.profileImage || member.photoUrl || '',
      services: member.services || []
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this staff member?')) return;
    try {
      const res = await AdminService.deleteStaff(id);
      if (res.success) {
        toast.success('Staff member removed successfully');
        fetchStaff();
      }
    } catch (err) {
      toast.error('Failed to remove staff');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        experience: parseInt(formData.experience) || 0,
        skills: formData.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s),
        documents: { profileImage: formData.photoUrl }
      };

      const res = isEditing 
        ? await AdminService.updateStaff(formData._id, payload)
        : await AdminService.addStaff(payload);

      if (res.success) {
        toast.success(`Staff Sync Successful`);
        setIsModalOpen(false);
        fetchStaff();
      } else {
        toast.error('Operation failed: ' + (res.error?.message || 'Server error'));
      }
    } catch (e: any) {
      toast.error('Error: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleService = (id: string) => {
    setFormData((prev: any) => ({
      ...prev,
      services: prev.services.includes(id) 
        ? prev.services.filter((s: string) => s !== id) 
        : [...prev.services, id]
    }));
  };

  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name?.toLowerCase().includes(filters.search.toLowerCase()) || s.mobile?.includes(filters.search);
    const date = new Date(s.createdAt);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;
    if (end) end.setHours(23, 59, 59, 999);

    const matchesStart = start ? date >= start : true;
    const matchesEnd = end ? date <= end : true;
    return matchesSearch && matchesStart && matchesEnd;
  });

  const downloadXLSX = () => {
    if (filteredStaff.length === 0) return toast.error('No data to export');
    
    const dataToExport = filteredStaff.map(s => ({
      'Name': s.name,
      'Mobile': s.mobile,
      'Role': s.role.toUpperCase(),
      'Experience (Yrs)': s.experience || 0,
      'Specialization': s.specialization || 'N/A',
      'Services Authorized': s.services?.join(', ') || 'NONE',
      'Status': s.isActive ? 'ACTIVE' : 'OFFLINE',
      'Onboarded Date': new Date(s.createdAt).toLocaleDateString()
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Practitioners");
    
    const fileName = `practitioner_registry_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(workbook, fileName);
    toast.success('Registry downloaded');
  };

  return (
    <RoleGuard allowedRoles={['admin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />
        
        <main className="flex-1 p-4 lg:p-8 flex flex-col h-screen overflow-hidden">
          {/* Page Header */}
          <div className="mb-6 lg:mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                Practitioner Registry
                <span className="text-[10px] font-black bg-indigo-100 text-indigo-600 px-3 py-1 rounded-xl tracking-widest uppercase">
                  {staff.length} Professionals
                </span>
              </h1>
              <p className="text-slate-400 font-bold text-sm mt-1">Manage eldercare specialists and field deployment team</p>
            </div>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <button 
                onClick={downloadXLSX}
                className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 rounded-2xl font-black text-xs tracking-tight border-2 border-slate-100 shadow-sm transition-all"
              >
                <DownloadIcon className="h-4 w-4 text-emerald-500" />
                XLSX
              </button>
              <button 
                onClick={openAddModal}
                className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-xs tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center uppercase"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Onboard Professional
              </button>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
              <input 
                type="text"
                placeholder="Search by name, role or ID..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-100 rounded-2xl text-xs font-bold shadow-sm outline-none focus:border-blue-500 transition-all placeholder:text-slate-300"
              />
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500" />
            </div>
            
            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border-2 border-slate-100 shadow-sm">
              <div className="flex flex-col items-center border-r border-slate-50 pr-3">
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
              onClick={fetchStaff}
              className="p-3.5 bg-white hover:bg-slate-50 text-blue-600 rounded-2xl border-2 border-slate-100 shadow-sm transition-all"
            >
              <RefreshCwIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Staff List */}
          <div className="flex-1 bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-y-auto custom-scrollbar">
            <ul className="divide-y divide-slate-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => <li key={i} className="p-8 lg:p-12 h-28 bg-slate-50/20 animate-pulse border-b" />)
              ) : filteredStaff.length === 0 ? (
                <div className="text-center py-24">
                  <UsersIcon className="h-10 w-10 text-slate-100 mx-auto mb-4" />
                  <h3 className="text-sm font-black text-slate-800">No Staff Recorded</h3>
                </div>
              ) : (
                filteredStaff.map((member) => (
                  <li key={member._id} className="p-6 lg:p-10 hover:bg-slate-50/50 group transition-all flex flex-col sm:flex-row items-center justify-between gap-6 lg:gap-10">
                    <div className="flex items-center space-x-6 lg:space-x-8 flex-1">
                      {member.documents?.profileImage ? (
                        <img src={member.documents.profileImage} alt={member.name} className="h-14 w-14 lg:h-18 lg:w-18 rounded-2xl object-cover border-4 border-white shadow-lg group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="h-14 w-14 lg:h-18 lg:w-18 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg group-hover:scale-105 transition-transform">
                           {member.name.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3 mb-1">
                          <p className="text-lg font-black text-slate-900 tracking-tight leading-none">{member.name}</p>
                          <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm ${
                            member.isActive ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                            <div className={`h-1 w-1 rounded-full ${member.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                            {member.isActive ? 'Active Duty' : 'Offline'}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <VerifiedShieldIcon className="h-3 w-3 text-blue-500" />
                            <span className="uppercase text-blue-600 font-black tracking-widest text-[9px]">{member.role}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BriefcaseIcon className="h-3 w-3 text-slate-400" />
                            <span>{member.experience > 0 ? `${member.experience} Yrs` : 'Junior'}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {member.services?.map((s: string) => (
                            <span key={s} className="px-2 py-0.5 bg-white border border-slate-100 text-[8px] rounded-lg text-slate-500 uppercase font-black tracking-tighter shadow-sm group-hover:border-blue-100 transition-colors">
                              {s.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="px-4 py-2.5 bg-white border border-slate-100 rounded-xl shadow-sm text-center min-w-[120px]">
                         <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Contact</p>
                         <p className="text-slate-900 font-black text-xs leading-none">{member.mobile}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => openEditModal(member)}
                          className="p-3 bg-white text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                          title="Sync Record"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(member._id)}
                          className="p-3 bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-slate-100 shadow-sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
        </main>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 lg:p-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] lg:rounded-[3rem] shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col border-4 border-white animate-in zoom-in-95 duration-400">
              
              <div className="p-6 lg:p-10 border-b bg-slate-50/50 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg">
                    <VerifiedShieldIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black text-slate-900 tracking-tight">Sync Professional</h2>
                    <p className="text-slate-400 font-bold text-xs mt-0.5">Staff Record Deployment</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-3 text-slate-300 hover:text-slate-600 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar space-y-8">
                <form id="staff-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Photo Management */}
                  <div className="md:col-span-2 flex items-center gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                     <div className="h-20 w-20 rounded-2xl bg-white border-2 border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-300 overflow-hidden shrink-0">
                        {formData.photoUrl ? (
                          <img src={formData.photoUrl} className="h-full w-full object-cover" />
                        ) : (
                          <CameraIcon className="w-8 h-8" />
                        )}
                     </div>
                     <div className="flex-1">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 pl-1">Photo Metadata Link</label>
                        <input 
                          type="text" 
                          placeholder="https://..." 
                          value={formData.photoUrl}
                          onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-blue-500 transition-all text-xs"
                        />
                     </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 outline-none focus:border-blue-500 transition-all text-xs" required />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Mobile Sync</label>
                    <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 outline-none focus:border-blue-500 transition-all text-xs" required />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Auth Email</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 outline-none text-xs" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Rank Role</label>
                    <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-800 outline-none uppercase text-[10px] tracking-widest cursor-pointer">
                      {ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Specialty</label>
                    <input type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none text-xs" placeholder="General Med" />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Exp (Years)</label>
                    <input type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none text-xs" />
                  </div>

                  <div className="md:col-span-2 space-y-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Skill Matrix</label>
                    <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full px-5 py-3.5 bg-white border border-slate-100 rounded-xl font-bold text-slate-900 outline-none text-xs" placeholder="Skills, Separated, By, Commas" />
                  </div>

                  <div className="md:col-span-2 pt-4">
                    <label className="block text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                       Service Authorized
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {SERVICE_TYPES.map(s => (
                        <div 
                          key={s.id}
                          onClick={() => toggleService(s.id)}
                          className={`cursor-pointer px-4 py-6 rounded-2xl border-2 text-center transition-all duration-300 flex items-center justify-center min-h-[70px] ${
                            formData.services.includes(s.id) 
                              ? "bg-blue-600 border-blue-600 text-white font-black shadow-lg" 
                              : "bg-white border-slate-50 text-slate-300 font-bold hover:bg-slate-50"
                          }`}
                        >
                          <p className="text-[9px] uppercase tracking-tighter leading-tight">{s.name}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-6 lg:p-10 bg-white border-t flex flex-col sm:flex-row gap-3 sticky bottom-0 z-10 shadow-3xl">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-4 bg-slate-50 text-slate-400 font-black rounded-2xl text-[10px] tracking-widest uppercase hover:bg-slate-100 transition-all border border-slate-200"
                >
                  Discard
                </button>
                <button 
                  form="staff-form"
                  type="submit"
                  disabled={isSaving}
                  className="flex-[2] py-4 bg-blue-600 text-white font-black rounded-2xl text-[10px] tracking-widest uppercase shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isSaving ? 'Syncing...' : 'Force Sync Record'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

function VerifiedShieldIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
