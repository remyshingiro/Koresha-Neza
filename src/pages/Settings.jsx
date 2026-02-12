import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Building, Mail, 
  Save, Camera, Trash2, Smartphone, Lock, Key, LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMachines } from '../context/MachineContext';
import { getAuth, updateProfile } from 'firebase/auth'; // Import Firebase Auth
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const { resetData } = useMachines();
  const auth = getAuth(); 

  // --- STATE ---
  const [activeTab, setActiveTab] = useState('profile'); // Default to Profile
  const [isLoading, setIsLoading] = useState(false);

  // 1. Manager Profile State
  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
    phone: '',
    photoURL: ''
  });

  // 2. Cooperative Data State (Your existing code)
  const [coopForm, setCoopForm] = useState({
    coopName: 'Koresha Neza Cooperative',
    location: 'Musanze, Rwanda',
    language: 'English',
  });

  // 3. Preferences State
  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    smsAlerts: false,
    maintenanceAlerts: true
  });

  // --- EFFECT: SYNC USER DATA ---
  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName || 'Manager',
        email: user.email || '',
        phone: '+250 788 123 456', // Placeholder as Firebase Auth doesn't always store phone by default
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=random`
      });
    }
  }, [user]);

  // --- HANDLERS ---

  // A. Save Personal Profile (Firebase)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profileForm.displayName,
          photoURL: profileForm.photoURL
        });
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile.");
    } finally {
      setIsLoading(false);
    }
  };

  // B. Generate Random Avatar
  const handleAvatarChange = () => {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    const newAvatar = `https://ui-avatars.com/api/?name=${profileForm.displayName}&background=${randomColor}&color=fff`;
    setProfileForm({ ...profileForm, photoURL: newAvatar });
    toast("New avatar generated! Click Save to keep it.", { icon: '🎨' });
  };

  // C. Save Coop Settings (Mock)
  const handleSaveCoop = (e) => {
    e.preventDefault();
    toast.success("Cooperative details saved!");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your personal profile and cooperative preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* LEFT SIDEBAR (Navigation) */}
        <div className="space-y-2">
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl text-left transition-all ${
              activeTab === 'profile' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <User size={20} /> My Profile
          </button>

          <button 
            onClick={() => setActiveTab('cooperative')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-bold rounded-xl text-left transition-all ${
              activeTab === 'cooperative' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Building size={20} /> Cooperative
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
          
          {/* === TAB 1: MY PROFILE (NEW) === */}
          {activeTab === 'profile' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Profile</h2>
              
              <form onSubmit={handleSaveProfile} className="space-y-6">
                
                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative group cursor-pointer" onClick={handleAvatarChange}>
                    <img 
                      src={profileForm.photoURL} 
                      alt="Profile" 
                      className="w-20 h-20 rounded-full border-4 border-gray-50 shadow-sm object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="text-white" size={20} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Profile Photo</h3>
                    <button type="button" onClick={handleAvatarChange} className="text-sm text-blue-600 font-bold hover:underline">
                      Generate New Random
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={profileForm.displayName}
                      onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      disabled
                      className="w-full px-4 py-2 border rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      value={profileForm.email}
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center">
                   <button type="button" onClick={logout} className="text-red-500 font-bold text-sm hover:underline flex items-center gap-1">
                     <LogOut size={16} /> Sign Out
                   </button>
                   <button 
                     type="submit" 
                     disabled={isLoading}
                     className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50"
                   >
                     {isLoading ? "Saving..." : "Save Profile"}
                   </button>
                </div>
              </form>
            </div>
          )}

          {/* === TAB 2: COOPERATIVE (Formerly General) === */}
          {activeTab === 'cooperative' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Cooperative Details</h2>
              <form onSubmit={handleSaveCoop} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cooperative Name</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={coopForm.coopName} onChange={(e) => setCoopForm({...coopForm, coopName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input type="text" className="w-full px-4 py-2 border rounded-xl"
                      value={coopForm.location} onChange={(e) => setCoopForm({...coopForm, location: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                    <select className="w-full px-4 py-2 border rounded-xl bg-white"
                      value={coopForm.language} onChange={(e) => setCoopForm({...coopForm, language: e.target.value})}>
                      <option>English</option>
                      <option>Kinyarwanda</option>
                      <option>French</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 text-right">
                  <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Save Details</button>
                </div>
              </form>
            </div>
          )}

          {/* === TAB 3: NOTIFICATIONS === */}
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
                  <input type="checkbox" checked={prefs.emailAlerts} onChange={() => setPrefs({...prefs, emailAlerts: !prefs.emailAlerts})} className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-full"><Smartphone size={20} /></div>
                    <div>
                      <h3 className="font-bold text-gray-900">SMS Alerts</h3>
                      <p className="text-sm text-gray-500">Get text messages for critical failures.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={prefs.smsAlerts} onChange={() => setPrefs({...prefs, smsAlerts: !prefs.smsAlerts})} className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
                </div>

                <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Bell size={20} /></div>
                    <div>
                      <h3 className="font-bold text-gray-900">Maintenance Reminders</h3>
                      <p className="text-sm text-gray-500">Notify when machines hit service hours.</p>
                    </div>
                  </div>
                  <input type="checkbox" checked={prefs.maintenanceAlerts} onChange={() => setPrefs({...prefs, maintenanceAlerts: !prefs.maintenanceAlerts})} className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500" />
                </div>
              </div>
            </div>
          )}

          {/* === TAB 4: SECURITY & DATA === */}
          {activeTab === 'security' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Security & Data</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-2 border rounded-xl" />
                  </div>
                </div>
                
                <button className="w-full py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all">
                  Update Password
                </button>

                {/* Danger Zone (Moved here from General) */}
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-red-600 font-bold mb-2">Danger Zone</h3>
                  <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                    <div>
                      <p className="font-bold text-gray-900">Factory Reset</p>
                      <p className="text-xs text-red-500">Deletes ALL machines & history.</p>
                    </div>
                    <button type="button" onClick={resetData} className="px-4 py-2 bg-white text-red-600 border border-red-200 font-bold rounded-lg hover:bg-red-600 hover:text-white transition-all flex items-center gap-2">
                      <Trash2 size={16} /> Reset Data
                    </button>
                  </div>
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