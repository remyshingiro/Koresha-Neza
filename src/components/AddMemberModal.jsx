import React, { useState } from 'react';
import { X, User, Phone, Mail, ShieldPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const AddMemberModal = ({ onClose, onSave }) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    role: 'Operator',
    phone: '',
    email: '',
    status: 'Active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      image: `https://ui-avatars.com/api/?name=${formData.name}&background=0284c7&color=fff&bold=true`
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[150] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Reduced max-width to sm (384px) for a tighter feel */}
      <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
        
        {/* Compact Header */}
        <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
          <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-widest">
            <User size={16} className="text-blue-200" /> {t('add_member')}
          </h2>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          
          {/* Subtle Notice - Smaller padding/text */}
          <div className="p-3 bg-blue-50/50 rounded-xl flex gap-2 border border-blue-100/50">
             <ShieldPlus className="text-blue-600 shrink-0" size={14} />
             <p className="text-[8px] font-black text-blue-700 uppercase leading-tight tracking-tighter">
                Registering new personnel into the Koresha Neza fleet registry.
             </p>
          </div>

          {/* Name - High Density Input */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 block tracking-widest">{t('display_name')}</label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                required 
                type="text" 
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-all text-xs font-bold text-slate-700"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
              {/* Role */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 block tracking-widest">Role</label>
                <select 
                  className="w-full px-3 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none appearance-none text-xs font-bold text-slate-700 transition-all cursor-pointer"
                  value={formData.role} 
                  onChange={e => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Operator">Operator</option>
                  <option value="Mechanic">Mechanic</option>
                  <option value="Manager">Manager</option>
                  <option value="Field Officer">Field Officer</option>
                </select>
              </div>
              {/* Phone */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-1 block tracking-widest">{t('phone_number')}</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input 
                    required 
                    type="text" 
                    placeholder="+250..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none text-xs font-bold text-slate-700"
                    value={formData.phone} 
                    onChange={e => setFormData({...formData, phone: e.target.value})} 
                  />
                </div>
              </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-400 uppercase ml-1 block tracking-widest">{t('email_address')}</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
              <input 
                type="email" 
                placeholder="name@kopakama.rw"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none transition-all text-xs font-bold text-slate-700"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          {/* Actions - Compact spacing */}
          <div className="flex gap-2 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 text-slate-400 text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="flex-[2] py-3 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-[0.98] uppercase text-[9px] tracking-widest"
            >
              {t('save_details')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;