import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { adminApi } from '@/lib/api';

export default function EditUserModal({ user, onClose, onUpdated }: { user: any, onClose: () => void, onUpdated: () => void }) {
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    age: user.age || '',
    mobile: user.mobile || '',
    gender: user.gender || 'male',
    bloodGroup: user.bloodGroup || '',
    aadharNumber: user.aadharNumber || '',
    address: user.address || '',
    permanentAddress: user.permanentAddress || '',
    emergencyContact: {
      name: user.emergencyContact?.name || '',
      mobile: user.emergencyContact?.mobile || '',
      relationship: user.emergencyContact?.relationship || ''
    },
    adminNotes: user.adminNotes?.map((n: any) => n.content).join('\n') || '',
    isVerified: user.isVerified || false
  });
  
  const [isSaving, setIsSaving] = useState(false);

  // The actual update method needs to make a PUT request to the backend.
  // Since we just added PUT /api/admin/users/:id we might need to add it to adminApi first,
  // but we can just use authFetch or import { authFetch } from '@/lib/auth';
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { authFetch } = await import('@/lib/auth');
      
      const payload = {
        name: formData.name,
        email: formData.email,
        age: parseInt(formData.age.toString()) || undefined,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        aadharNumber: formData.aadharNumber,
        address: formData.address,
        permanentAddress: formData.permanentAddress,
        emergencyContact: formData.emergencyContact,
        isVerified: formData.isVerified,
        adminNotes: [{ content: formData.adminNotes }]
      };

      const res = await authFetch(`/api/admin/users/${user._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        onUpdated();
      } else {
        const errorData = await res.json();
        alert(`Failed to update user: ${errorData.message || 'Unknown error'}`);
      }
    } catch (e: any) {
      alert('Error updating user: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Edit User Details</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <input type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Mobile (Readonly)</label>
              <input type="text" disabled value={formData.mobile} className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm p-2 border" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">NGO Verification Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                <input type="text" value={formData.bloodGroup} onChange={e => setFormData({...formData, bloodGroup: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhar Number</label>
                <input type="text" value={formData.aadharNumber} onChange={e => setFormData({...formData, aadharNumber: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Address</label>
                <textarea rows={2} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Permanent Address</label>
                <textarea rows={2} value={formData.permanentAddress} onChange={e => setFormData({...formData, permanentAddress: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Name</label>
                <input type="text" value={formData.emergencyContact.name} onChange={e => setFormData({...formData, emergencyContact: {...formData.emergencyContact, name: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Mobile</label>
                <input type="text" value={formData.emergencyContact.mobile} onChange={e => setFormData({...formData, emergencyContact: {...formData.emergencyContact, mobile: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relationship</label>
                <input type="text" value={formData.emergencyContact.relationship} onChange={e => setFormData({...formData, emergencyContact: {...formData.emergencyContact, relationship: e.target.value}})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-3">Admin Settings</h3>
            <div className="flex items-center space-x-2 mb-4">
              <input type="checkbox" id="verified" checked={formData.isVerified} onChange={e => setFormData({...formData, isVerified: e.target.checked})} className="rounded border-gray-300" />
              <label htmlFor="verified" className="text-sm font-medium text-gray-700">Is Verified Account?</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Admin Notes</label>
              <textarea value={formData.adminNotes} onChange={e => setFormData({...formData, adminNotes: e.target.value})} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" placeholder="Internal notes about this user..." />
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
          <button onClick={onClose} className="px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button onClick={handleSave} disabled={isSaving} className="px-4 py-2 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
