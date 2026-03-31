'use client';

import { useState, useEffect } from 'react';
import { 
  ChatBubbleBottomCenterTextIcon, 
  TrashIcon, 
  CheckCircleIcon,
  EnvelopeIcon,
  PhoneIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';

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
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get<any>('/api/admin/inquiries');
      if (res.success && res.data?.inquiries) {
        setInquiries(res.data.inquiries);
      }
    } catch (err) {
      console.error('Failed to fetch inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await apiClient.patch<any>(`/api/admin/inquiries/${id}/status`, { status });
      if (res.success) {
        setInquiries(prev => prev.map(inq => inq._id === id ? { ...inq, status: status as any } : inq));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(prev => prev ? { ...prev, status: status as any } : null);
        }
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const res = await apiClient.delete<any>(`/api/admin/inquiries/${id}`);
      if (res.success) {
        setInquiries(prev => prev.filter(inq => inq._id !== id));
        if (selectedInquiry?._id === id) setSelectedInquiry(null);
      }
    } catch (err) {
      alert('Failed to delete inquiry');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Public Inquiries</h1>
          <p className="text-gray-500 font-medium">Manage messages from the contact page</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* List */}
        <div className="lg:col-span-1 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center p-12">
              <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <ChatBubbleBottomCenterTextIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">No inquiries found</p>
            </div>
          ) : (
            inquiries.map((inquiry) => (
              <div 
                key={inquiry._id}
                onClick={() => {
                  setSelectedInquiry(inquiry);
                  if (inquiry.status === 'new') updateStatus(inquiry._id, 'read');
                }}
                className={`p-5 rounded-3xl cursor-pointer transition-all border-2 ${
                  selectedInquiry?._id === inquiry._id 
                    ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-600/20' 
                    : 'bg-white border-gray-100 hover:border-blue-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <p className={`font-black text-sm uppercase tracking-widest ${selectedInquiry?._id === inquiry._id ? 'text-white/70' : 'text-gray-400'}`}>
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                  {inquiry.status === 'new' && (
                    <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                <h3 className={`font-black text-lg ${selectedInquiry?._id === inquiry._id ? 'text-white' : 'text-gray-900'}`}>{inquiry.name}</h3>
                <p className={`text-xs truncate ${selectedInquiry?._id === inquiry._id ? 'text-white/80' : 'text-gray-500'}`}>{inquiry.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-2">
          {selectedInquiry ? (
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
              {/* Header */}
              <div className="p-8 border-b border-gray-50 bg-gray-50/50">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-gray-200/50 font-black text-xl">
                      {selectedInquiry.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">{selectedInquiry.name}</h2>
                      <p className="text-gray-500">Sent an inquiry on {new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => deleteInquiry(selectedInquiry._id)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-colors"
                    >
                      <TrashIcon className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                    <EnvelopeIcon className="h-5 w-5 text-blue-500" />
                    <p className="text-sm font-bold text-gray-700">{selectedInquiry.email}</p>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100">
                    <PhoneIcon className="h-5 w-5 text-emerald-500" />
                    <p className="text-sm font-bold text-gray-700">{selectedInquiry.phone}</p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="p-8 flex-1">
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Message Body</p>
                <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100 min-h-[200px]">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedInquiry.message}</p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-3">
                <button 
                  onClick={() => updateStatus(selectedInquiry._id, 'archived')}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-all"
                >
                  Archive Message
                </button>
                <a 
                  href={`mailto:${selectedInquiry.email}`}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-600/20"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 p-12 text-center">
              <div>
                <ChatBubbleBottomCenterTextIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900 mb-2">Select an inquiry</h3>
                <p className="text-gray-400 max-w-xs mx-auto font-medium">Choose a message from the list to view full contact details and contents.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
