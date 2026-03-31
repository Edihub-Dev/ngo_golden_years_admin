'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { 
  UserGroupIcon, 
  MagnifyingGlassIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  CameraIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { cn } from "@/lib/utils";

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

export default function AdminStaff() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', mobile: '', email: '', role: 'caregiver', 
    experience: '', specialization: '', skills: '', photoUrl: '', services: [] as string[] 
  });

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const { authFetch } = await import('@/lib/auth');
      const response = await authFetch('/api/admin/staff');
      const data = await response.json();
      if (response.ok && data.success) {
        setStaff(data.staff || []);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStaff = async () => {
    try {
      const { authFetch } = await import('@/lib/auth');
      const payload = {
        ...formData,
        experience: parseInt(formData.experience) || 0,
        skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
        profileImage: formData.photoUrl
      };
      
      const res = await authFetch('/api/admin/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Staff added successfully!');
        setShowAddModal(false);
        setFormData({ 
          name: '', mobile: '', email: '', role: 'caregiver', 
          experience: '', specialization: '', skills: '', photoUrl: '', services: [] 
        });
        fetchStaff();
      } else {
        alert('Failed: ' + (data.message || 'Unknown error'));
      }
    } catch (e: any) {
      alert('Error: ' + e.message);
    }
  };

  const toggleService = (id: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(id) 
        ? prev.services.filter(s => s !== id) 
        : [...prev.services, id]
    }));
  };

  const filteredStaff = staff.filter(s =>
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.mobile?.includes(searchTerm)
  );

  return (
    <div className={cn('min-h-screen', 'bg-gray-50', 'flex')}>
      <AdminSidebar />
      
      <div className={cn('flex-1', 'p-8', 'max-w-full', 'overflow-x-hidden')}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className={cn('text-2xl', 'font-bold', 'text-gray-900')}>Staff Management</h1>
            <p className="text-gray-600">Register and manage NGO caregivers and doctors</p>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 shadow-md transition-all"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add New Staff
          </button>
        </div>

        <div className="mb-6 relative">
          <MagnifyingGlassIcon className={cn('absolute', 'h-5', 'w-5', 'text-gray-400', 'left-3', 'top-3')} />
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={cn('bg-white', 'shadow-sm', 'border', 'border-gray-100', 'rounded-xl', 'overflow-hidden')}>
          <ul className="divide-y divide-gray-100">
            {filteredStaff.map((member: any) => (
              <li key={member._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {member.documents?.profileImage ? (
                    <img src={member.documents.profileImage} alt={member.name} className="h-12 w-12 rounded-full object-cover border" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                       {member.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">
                      {member.mobile} • <span className="uppercase font-bold text-blue-600">{member.role}</span>
                      {member.experience > 0 && ` • ${member.experience} Yrs Exp`}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {member.services?.map((s: string) => (
                        <span key={s} className="px-1.5 py-0.5 bg-gray-100 text-[10px] rounded text-gray-600 uppercase font-medium">
                          {s.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                   <div className="text-right mr-4 hidden md:block">
                      <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Status</p>
                      <span className={cn(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        member.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      )}>
                        {member.isActive ? 'Active' : 'Offline'}
                      </span>
                   </div>
                   <button className="p-2 text-gray-400 hover:text-blue-600">
                      <PencilIcon className="w-5 h-5" />
                   </button>
                </div>
              </li>
            ))}
          </ul>
          {filteredStaff.length === 0 && !loading && (
             <div className="text-center py-16">
                <UserGroupIcon className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No staff matching your search</p>
             </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Add NGO Staff Member</h2>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 flex justify-center">
                 <div className="relative group cursor-pointer">
                    <div className="h-24 w-24 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 overflow-hidden">
                       {formData.photoUrl ? (
                         <img src={formData.photoUrl} className="h-full w-full object-cover" />
                       ) : (
                         <>
                           <CameraIcon className="w-8 h-8 mb-1" />
                           <span className="text-[10px]">Photo URL</span>
                         </>
                       )}
                    </div>
                    <input 
                      type="text" 
                      placeholder="Paste Photo URL here" 
                      value={formData.photoUrl}
                      onChange={e => setFormData({...formData, photoUrl: e.target.value})}
                      className="mt-2 w-full text-xs border rounded p-1"
                    />
                 </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Mobile Number *</label>
                <input type="text" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" required />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border rounded-lg p-2 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Role *</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full border rounded-lg p-2 outline-none capitalize">
                  {ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Specialization (e.g. Heart Surgeon)</label>
                <input type="text" value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} className="w-full border rounded-lg p-2 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Experience (Years)</label>
                <input type="number" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} className="w-full border rounded-lg p-2 outline-none" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Skills (Comma separated)</label>
                <input type="text" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} className="w-full border rounded-lg p-2 outline-none" placeholder="E.g. Nursing, ICU, CPR" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-4">Assigned Services</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {SERVICE_TYPES.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => toggleService(s.id)}
                      className={cn(
                        "cursor-pointer p-3 rounded-xl border text-center transition-all",
                        formData.services.includes(s.id) ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:border-blue-200"
                      )}
                    >
                      <p className="text-[10px] font-bold uppercase">{s.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 flex justify-end space-x-3 rounded-b-2xl">
              <button 
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-xl bg-white font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddStaff}
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition-all"
              >
                Register Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
