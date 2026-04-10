'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  UsersIcon,
  PlusIcon,
  EditIcon,
  Trash2Icon,
  ArrowUpIcon,
  ArrowDownIcon,
  XIcon
} from 'lucide-react';
import RoleGuard from '@/components/admin/RoleGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';

interface Founder {
  _id: string;
  name: string;
  role: string;
  description?: string;
  initial: string;
  image?: string;
  order: number;
  isActive: boolean;
}

export default function FoundersManagement() {
  const [founders, setFounders] = useState<Founder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFounder, setEditingFounder] = useState<Founder | null>(null);
  const [formData, setFormData] = useState({ name: '', role: '', description: '', initial: '', image: '' });

  useEffect(() => {
    fetchFounders();
  }, []);

  const fetchFounders = async () => {
    try {
      setLoading(true);
      // Fetch all founders (admin route or public route)
      const res = await apiClient.get<any>('/api/founders/all');
      if (res.success && res.data) {
        setFounders(res.data);
      }
    } catch (error) {
      toast.error('Failed to load governing body members');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (founder?: Founder) => {
    if (founder) {
      setEditingFounder(founder);
      setFormData({ name: founder.name, role: founder.role, description: founder.description || '', initial: founder.initial || '', image: founder.image || '' });
    } else {
      setEditingFounder(null);
      setFormData({ name: '', role: '', description: '', initial: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role) {
      toast.error('Name and Role are required');
      return;
    }

    try {
      if (editingFounder) {
        await apiClient.put(`/api/founders/${editingFounder._id}`, formData);
        toast.success('Updated successfully');
      } else {
        await apiClient.post('/api/founders', formData);
        toast.success('Added successfully');
      }
      setIsModalOpen(false);
      fetchFounders();
    } catch (error) {
      toast.error('Failed to save data');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this member?')) return;
    try {
      await apiClient.delete(`/api/founders/${id}`);
      toast.success('Member deleted');
      fetchFounders();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const handleReorder = async (currentIndex: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === founders.length - 1)
    ) return;

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const newFounders = [...founders];

    // Swap order values
    const currentOrder = newFounders[currentIndex].order;
    const targetOrder = newFounders[targetIndex].order;

    newFounders[currentIndex].order = targetOrder;
    newFounders[targetIndex].order = currentOrder;

    // Optional: Sort frontend right away for immediate feedback
    newFounders.sort((a, b) => a.order - b.order);
    setFounders(newFounders);

    // Sync to backend batch
    try {
      await apiClient.put('/api/founders/reorder/batch', {
        items: newFounders.map(f => ({ id: f._id, order: f.order }))
      });
      toast.success('Order updated');
    } catch (error) {
      toast.error('Failed to update order');
      fetchFounders(); // revert if failed
    }
  };

  return (
    <RoleGuard allowedRoles={['admin', 'subadmin']}>
      <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
        <AdminSidebar />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full min-h-screen">
          <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none mb-3">
                Governing Body
              </h1>
              {/* <p className="text-slate-400 font-bold text-sm tracking-tight">
              Manage founders and leadership team for the About page
            </p> */}
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-blue-600 rounded-2xl text-white text-sm font-black hover:bg-blue-700 transition-all flex items-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95"
            >
              <PlusIcon className="h-5 w-5" />
              ADD MEMBER
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <div className="h-12 w-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-400 font-bold text-sm">Loading governing body...</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl overflow-hidden">
              <div className="overflow-x-auto p-4 lg:p-8">
                <table className="w-full text-left border-separate border-spacing-y-4">
                  <thead>
                    <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-4">
                      <th className="pb-2 px-6">Member</th>
                      <th className="pb-2 px-6">Role</th>
                      <th className="pb-2 px-6 text-center">Order</th>
                      <th className="pb-2 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-4">
                    {founders.map((founder, index) => (
                      <tr key={founder._id} className="group hover:bg-slate-50 transition-all rounded-2xl overflow-hidden border border-transparent hover:border-slate-100">
                        <td className="py-4 px-6 rounded-l-2xl">
                          <div className="flex items-center gap-4">
                            {founder.image ? (
                              <img src={founder.image} alt={founder.name} className="h-12 w-12 bg-slate-100 rounded-full object-cover" />
                            ) : (
                              <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-black text-xl">
                                {founder.initial || founder.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-black text-slate-900">{founder.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            {founder.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleReorder(index, 'up')}
                              disabled={index === 0}
                              className={`p-2 rounded-xl transition-all ${index === 0 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-200 active:scale-95'}`}
                            >
                              <ArrowUpIcon className="h-5 w-5" />
                            </button>
                            <span className="text-sm font-black text-slate-700 w-6 text-center">{index + 1}</span>
                            <button
                              onClick={() => handleReorder(index, 'down')}
                              disabled={index === founders.length - 1}
                              className={`p-2 rounded-xl transition-all ${index === founders.length - 1 ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:bg-slate-200 active:scale-95'}`}
                            >
                              <ArrowDownIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                        <td className="py-4 px-6 rounded-r-2xl text-right">
                          <div className="flex items-center justify-end gap-2 text-slate-400">
                            <button
                              onClick={() => handleOpenModal(founder)}
                              className="p-2 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                              title="Edit Member"
                            >
                              <EditIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(founder._id)}
                              className="p-2 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                              title="Delete Member"
                            >
                              <Trash2Icon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {founders.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-10 text-center text-slate-400 font-bold text-sm">
                          No governing body members found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 p-8 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 transition-colors"
                  title="Close Modal"
                >
                  <XIcon className="h-6 w-6" />
                </button>

                <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-8">
                  {editingFounder ? 'Edit Member' : 'Add New Member'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Mr. Surjeet Kumar"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Role</label>
                    <input
                      type="text"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      placeholder="e.g. Settlor / Founder Trustee"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Description / Bio</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Write a brief description or bio about the founder..."
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all min-h-[120px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Initials (Optional)</label>
                    <input
                      type="text"
                      maxLength={2}
                      value={formData.initial}
                      onChange={(e) => setFormData({ ...formData, initial: e.target.value.toUpperCase() })}
                      placeholder="e.g. S"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                    <p className="text-[10px] font-bold text-slate-400 mt-2">Leave blank to auto-generate from the first letter of the name.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Image URL (Optional)</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="e.g. https://example.com/photo.jpg"
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-6 py-4 rounded-2xl text-slate-500 font-bold text-sm hover:bg-slate-50 transition-all active:scale-95"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-4 bg-blue-600 rounded-2xl text-white text-sm font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 active:scale-95"
                    >
                      {editingFounder ? 'Save Changes' : 'Add Member'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </RoleGuard>
  );
}
