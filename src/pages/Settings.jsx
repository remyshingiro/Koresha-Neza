import React, { useState, useEffect } from 'react';
import { 
  User, Bell, Shield, Building, Mail, 
  Save, Camera, Trash2, Smartphone, Lock, LogOut, Globe, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMachines } from '../context/MachineContext';
import { getAuth, updateProfile, updateEmail } from 'firebase/auth';
import { useTranslation } from 'react-i18next'; 
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, logout } = useAuth();
  const { resetData } = useMachines();
  const auth = getAuth(); 
  const { t, i18n } = useTranslation(); 

  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  const [profileForm, setProfileForm] = useState({
    displayName: '',
    email: '',
    phone: '',
    photoURL: ''
  });

  const [coopForm, setCoopForm] = useState({
    coopName: 'Koresha Neza Cooperative',
    location: 'Musanze, Rwanda',
    language: 'en',
  });

  const [prefs, setPrefs] = useState({
    emailAlerts: true,
    smsAlerts: false,
    maintenanceAlerts: true
  });

  useEffect(() => {
    if (user) {
      setProfileForm({
        displayName: user.displayName || 'Manager',
        email: user.email || '',
        phone: '+250 788 123 456',
        photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.email}&background=0284c7&color=fff&bold=true`
      });
    }
    setCoopForm(prev => ({ ...prev, language: i18n.language }));
  }, [user, i18n.language]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profileForm.displayName,
          photoURL: profileForm.photoURL
        });
        if (profileForm.email !== auth.currentUser.email) {
            await updateEmail(auth.currentUser, profileForm.email);
            toast.success("Identity Updated! Re-authentication required.");
        } else {
            toast.success("Profile saved successfully!");
        }
      }
    } catch (error) {
      toast.error(error.code === 'auth/requires-recent-login' ? "Security: Log in again to update email." : "Update failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setCoopForm({ ...coopForm, language: langCode });
    toast.success(`Language: ${langCode.toUpperCase()}`);
  };

  const TabButton = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => setActiveTab(id)} 
      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${activeTab === id ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className={activeTab === id ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'} />
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
      </div>
      <ChevronRight size={14} className={activeTab === id ? 'opacity-100' : 'opacity-0'} />
    </button>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">System Configuration</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('settings')}</h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">{t('manager_pro')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* 2. Navigation Sidebar */}
        <div className="space-y-2">
          <TabButton id="profile" icon={User} label={t('my_profile')} />
          <TabButton id="cooperative" icon={Building} label={t('cooperative')} />
          <TabButton id="notifications" icon={Bell} label={t('notifications')} />
          <TabButton id="security" icon={Shield} label={t('security')} />
          
          <div className="pt-4 mt-4 border-t border-slate-100">
            <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all group">
              <LogOut size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t('sign_out')}</span>
            </button>
          </div>
        </div>

        {/* 3. Content Area */}
        <div className="md:col-span-3">
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-2">
                <User className="text-blue-600" size={20} /> {t('personal_profile')}
              </h2>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-6 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                  <div className="relative group cursor-pointer" onClick={() => toast("Upload feature coming soon", {icon: '📸'})}>
                    <img src={profileForm.photoURL} alt="Profile" className="w-20 h-20 rounded-[1.5rem] border-4 border-white shadow-sm object-cover" />
                    <div className="absolute inset-0 bg-blue-600/60 rounded-[1.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><Camera className="text-white" size={20} /></div>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">{t('profile_photo')}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">PNG or JPG • Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('display_name')}</label>
                    <input type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-xs" value={profileForm.displayName} onChange={(e) => setProfileForm({...profileForm, displayName: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('phone_number')}</label>
                    <div className="relative">
                        <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input type="text" className="w-full pl-11 pr-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-xs" value={profileForm.phone} onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('email_address')}</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <input type="email" className="w-full pl-11 pr-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none transition-all font-bold text-xs" value={profileForm.email} onChange={(e) => setProfileForm({...profileForm, email: e.target.value})} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 flex justify-end">
                   <button type="submit" disabled={isLoading} className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-3 shadow-xl shadow-blue-100 uppercase text-[10px] tracking-widest transition-all active:scale-95">
                     {isLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><Save size={16}/> {t('save_profile')}</>}
                   </button>
                </div>
              </form>
            </div>
          )}

          {/* COOPERATIVE TAB */}
          {activeTab === 'cooperative' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-2">
                <Building className="text-blue-600" size={20} /> {t('coop_details')}
              </h2>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('coop_name')}</label>
                    <input type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none font-bold text-xs" value={coopForm.coopName} onChange={(e) => setCoopForm({...coopForm, coopName: e.target.value})} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('location')}</label>
                    <input type="text" className="w-full px-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl font-bold text-xs" value={coopForm.location} onChange={(e) => setCoopForm({...coopForm, location: e.target.value})} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('language')}</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                        <select className="w-full pl-11 pr-5 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl outline-none appearance-none font-bold text-xs cursor-pointer" value={coopForm.language} onChange={(e) => changeLanguage(e.target.value)}>
                            <option value="en">English (US)</option>
                            <option value="rw">Kinyarwanda</option>
                            <option value="fr">Français</option>
                        </select>
                    </div>
                  </div>
                </div>
                <div className="pt-4 text-right">
                    <button className="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black shadow-lg uppercase text-[10px] tracking-widest transition-all">{t('save_details')}</button>
                </div>
              </form>
            </div>
          )}

          {/* NOTIFICATIONS TAB */}
          {activeTab === 'notifications' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-2">
                <Bell className="text-blue-600" size={20} /> {t('notif_preferences')}
              </h2>
              <div className="space-y-4">
                {[
                    { id: 'emailAlerts', icon: Mail, color: 'bg-blue-100 text-blue-600', label: t('email_alerts'), desc: t('email_desc') },
                    { id: 'smsAlerts', icon: Smartphone, color: 'bg-emerald-100 text-emerald-600', label: t('sms_alerts'), desc: t('sms_desc') },
                    { id: 'maintenanceAlerts', icon: Bell, color: 'bg-amber-100 text-amber-600', label: t('maint_reminders'), desc: t('maint_desc') }
                ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-md transition-all">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 ${item.color} rounded-2xl shadow-sm`}><item.icon size={20} /></div>
                            <div>
                                <h3 className="text-xs font-black text-slate-800 uppercase tracking-tight">{item.label}</h3>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-tighter">{item.desc}</p>
                            </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" checked={prefs[item.id]} onChange={() => setPrefs({...prefs, [item.id]: !prefs[item.id]})} className="sr-only peer" />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                    </div>
                ))}
              </div>
            </div>
          )}

          {/* SECURITY TAB */}
          {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-8 flex items-center gap-2">
                <Shield className="text-blue-600" size={20} /> {t('security_data')}
              </h2>
              <div className="space-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1 tracking-widest">{t('new_password')}</label>
                  <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} /><input type="password" placeholder="••••••••" className="w-full pl-11 pr-5 py-3 bg-slate-50 border-2 border-transparent focus:border-slate-900 focus:bg-white rounded-2xl font-bold text-xs" /></div>
                </div>
                <button className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-black transition-all uppercase text-[10px] tracking-widest shadow-lg">{t('update_password')}</button>
                
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <h3 className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] mb-4">{t('danger_zone')}</h3>
                  <div className="flex flex-col sm:flex-row items-center justify-between p-6 bg-red-50/50 rounded-[2rem] border border-red-100 gap-4 text-center sm:text-left">
                    <div>
                        <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{t('factory_reset')}</p>
                        <p className="text-[10px] text-red-500 font-bold uppercase mt-1 tracking-tighter">{t('reset_desc')}</p>
                    </div>
                    <button type="button" onClick={() => { if(window.confirm("Erase all data?")) resetData(); }} className="px-6 py-3 bg-white text-red-600 border border-red-200 font-black rounded-xl hover:bg-red-600 hover:text-white transition-all flex items-center gap-2 uppercase text-[9px] tracking-widest">
                        <Trash2 size={14} /> {t('reset_data')}
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