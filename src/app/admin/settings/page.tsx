'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { cn } from "@/lib/utils";
import { CogIcon, BellIcon, ShieldCheckIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>({
    orgName: 'Golden Years Care Foundation',
    contactEmail: 'admin@goldenyearscare.org',
    supportPhone: '+91 1234567890',
    membershipFee: 1100,
    alerts: {
      serviceRequest: true,
      emergencySOS: true,
      weeklyReport: true
    },
    security: {
      sessionTimeout: 60,
      require2FA: false
    }
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { authFetch } = await import('@/lib/auth');
      const response = await authFetch('/api/admin/settings');
      const data = await response.json();
      if (response.ok && data.success) {
        setSettings(data.settings);
      } else {
        alert('Failed to load settings from server: ' + (data.message || 'Unknown error'));
      }
    } catch (error: any) {
      console.error('Failed to fetch settings:', error);
      alert('Network Error: Could not connect to settings API. Check backend connectivity.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { authFetch } = await import('@/lib/auth');
      const res = await authFetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Settings saved to database successfully!');
      } else {
        alert('Failed to save settings: ' + (data.message || 'Server error'));
      }
    } catch (err: any) {
      alert('Save failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className={cn('min-h-screen', 'bg-gray-50', 'flex')}>
      <AdminSidebar />
      
      <div className={cn('flex-1', 'p-8', 'max-w-full', 'overflow-x-hidden')}>
        <div className="mb-8">
          <h1 className={cn('text-2xl', 'font-bold', 'text-gray-900')}>Platform Settings</h1>
          <p className="text-gray-600">Configure global NGO platform configurations</p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden flex min-h-[500px]">
          {/* Settings Tabs */}
          <div className="w-64 bg-gray-50 border-r py-4 flex flex-col">
            <button 
              onClick={() => setActiveTab('general')}
              className={`text-left px-6 py-3 font-medium transition-colors flex items-center ${activeTab === 'general' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <BuildingOfficeIcon className="w-5 h-5 mr-3" />
              Organization
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`text-left px-6 py-3 font-medium transition-colors flex items-center ${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <BellIcon className="w-5 h-5 mr-3" />
              Notifications
            </button>
            <button 
              onClick={() => setActiveTab('security')}
              className={`text-left px-6 py-3 font-medium transition-colors flex items-center ${activeTab === 'security' ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <ShieldCheckIcon className="w-5 h-5 mr-3" />
              Security
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-8">
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-xl">
                <h2 className="text-lg font-semibold border-b pb-2">Organization Settings</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input type="text" value={settings.orgName} onChange={e => setSettings({...settings, orgName: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input type="email" value={settings.contactEmail} onChange={e => setSettings({...settings, contactEmail: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Phone</label>
                  <input type="text" value={settings.supportPhone} onChange={e => setSettings({...settings, supportPhone: e.target.value})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Membership Plan Fee (INR)</label>
                  <input type="number" value={settings.membershipFee} onChange={e => setSettings({...settings, membershipFee: parseInt(e.target.value)})} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6 max-w-xl">
                <h2 className="text-lg font-semibold border-b pb-2">Email & SMS Alerts</h2>
                <div className="space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={settings.alerts?.serviceRequest} onChange={e => setSettings({...settings, alerts: {...settings.alerts, serviceRequest: e.target.checked}})} className="rounded text-blue-600 h-5 w-5" />
                    <span className="text-gray-700">Email Admin on New Service Request</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={settings.alerts?.emergencySOS} onChange={e => setSettings({...settings, alerts: {...settings.alerts, emergencySOS: e.target.checked}})} className="rounded text-blue-600 h-5 w-5" />
                    <span className="text-gray-700">SMS Alerts for Emergency Help (SOS)</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" checked={settings.alerts?.weeklyReport} onChange={e => setSettings({...settings, alerts: {...settings.alerts, weeklyReport: e.target.checked}})} className="rounded text-blue-600 h-5 w-5" />
                    <span className="text-gray-700">Weekly Analytics Report</span>
                  </label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6 max-w-xl">
                <h2 className="text-lg font-semibold border-b pb-2">Security Configurations</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                  <input type="number" value={settings.security?.sessionTimeout} onChange={e => setSettings({...settings, security: {...settings.security, sessionTimeout: parseInt(e.target.value)}})} className="w-full border border-gray-300 rounded-md p-2" />
                </div>
                <div>
                  <label className="flex items-center space-x-3 mt-4 cursor-pointer">
                    <input type="checkbox" checked={settings.security?.require2FA} onChange={e => setSettings({...settings, security: {...settings.security, require2FA: e.target.checked}})} className="rounded text-blue-600 h-5 w-5" />
                    <span className="text-gray-700 font-medium">Require Two-Factor Auth for Admins</span>
                  </label>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t flex space-x-4">
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-blue-600/30 disabled:opacity-50 transition-all flex items-center"
              >
                {saving ? 'Syncing...' : 'Save Global Settings'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
