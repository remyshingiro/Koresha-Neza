import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Globe, 
  Shield, 
  LogOut, 
  Trash2, 
  Save, 
  Building,
  Mail,
  Smartphone,
  Lock,
  Key
} from 'lucide-react';
import { useMachines } from '../context/MachineContext'; 

const Settings = () => {
  const { resetData } = useMachines();
  
  // 1. STATE TO TRACK WHICH TAB IS OPEN
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'notifications', 'security'
  
  const [formData, setFormData] = useState({
    coopName: 'Koresha Neza Cooperative',
    location: 'Musanze, Rwanda',
    language: 'English',
    emailAlerts: true,
    smsAlerts: false,
    maintenanceAlerts: true
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your cooperative preferences and account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR (Navigation) */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl text-left transition-all ${
              activeTab === 'general' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Building size={20} /> General Profile
          </button>

          <button 
            onClick={() => setActiveTab('notifications')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl text-left transition-all ${
              activeTab === 'notifications' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Bell size={20} /> Notifications
          </button>

          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl text-left transition-all ${
              activeTab === 'security' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Shield size={20} /> Security
          </button>
        </div>

        {/* RIGHT CONTENT AREA */}
        <div className="md:col-span-3 space-y-6">
          
          {/* === TAB 1: GENERAL === */}
          {activeTab === 'general' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">General Information</h2>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cooperative Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.coopName} onChange={(e) => setFormData({...formData, coopName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-xl"
                      value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select className="w-full px-4 py-2 border rounded-xl bg-white"
                      value={formData.language} onChange={(e) => setFormData({...formData, language: e.target.value})}>
                      <option>English</option>
                      <option>Kinyarwanda</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
                
                {/* Danger Zone moved inside General */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <p className="font-bold text-gray-900">Factory Reset</p>
                      <p className="text-xs text-red-500">Deletes ALL machines & history.</p>
                    </div>
                    <button type="button" onClick={resetData} className="px-4 py-2 bg-white text-red-600 border border-red-200 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                      <Trash2 size={16} /> Reset
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Save Changes</button>
                  {isSaved && <span className="text-green-600 font-bold animate-pulse">Saved!</span>}
                </div>
              </form>
            </div>
          )}

          {/* === TAB 2: NOTIFICATIONS === */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
              <div className="space-y-4">
                
                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Mail size={20} /></div>
                    <div>
                      <h3 className="font-bold text-gray-900">Email Alerts</h3>
                      <p className="text-sm text-gray-500">Receive weekly summary reports.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={formData.emailAlerts} onChange={() => setFormData({...formData, emailAlerts: !formData.emailAlerts})} className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><Smartphone size={20} /></div>
                    <div>
                      <h3 className="font-bold text-gray-900">SMS Alerts</h3>
                      <p className="text-sm text-gray-500">Get text messages for critical failures.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={formData.smsAlerts} onChange={() => setFormData({...formData, smsAlerts: !formData.smsAlerts})} className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Bell size={20} /></div>
                    <div>
                      <h3 className="font-bold text-gray-900">Maintenance Reminders</h3>
                      <p className="text-sm text-gray-500">Notify when machines hit service hours.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={formData.maintenanceAlerts} onChange={() => setFormData({...formData, maintenanceAlerts: !formData.maintenanceAlerts})} className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* === TAB 3: SECURITY === */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security Settings</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 border rounded-xl" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <div className="relative">
                      <Key className="absolute left-3 top-3 text-gray-400" size={18} />
                      <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 border rounded-xl" />
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">
                  Update Password
                </button>
                
                <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-sm flex gap-3 items-start">
                  <Shield className="shrink-0 mt-0.5" size={18} />
                  <p>To enable Two-Factor Authentication (2FA), please contact the system administrator or upgrade your Firebase plan.</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Settings;