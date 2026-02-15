import React, { useState } from 'react';
import { X, Wrench, DollarSign, Calendar, User } from 'lucide-react';

const MaintenanceModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    action: 'General Service',
    mechanic: '',
    cost: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      cost: parseInt(formData.cost) || 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header - Refined Typography */}
        <div className="bg-green-600 p-5 flex justify-between items-center">
          <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
            <Wrench className="text-green-100" size={18} /> Log Maintenance
          </h2>
          <button onClick={onClose} className="text-green-100 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Action Type */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest">Service Performed</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-xl outline-none appearance-none text-xs font-bold text-slate-700 transition-all cursor-pointer"
              value={formData.action}
              onChange={(e) => setFormData({...formData, action: e.target.value})}
            >
              <option>General Service (Oil & Filters)</option>
              <option>Tire Replacement</option>
              <option>Engine Repair</option>
              <option>Blade Sharpening</option>
              <option>Belt Replacement</option>
            </select>
          </div>

          {/* Mechanic Name */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest">Mechanic / Garage</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                required
                type="text" 
                placeholder="e.g., Garage Kigali"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-xl outline-none text-xs font-bold text-slate-700 transition-all"
                value={formData.mechanic}
                onChange={(e) => setFormData({...formData, mechanic: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cost */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest">Cost (RWF)</label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  required
                  type="number" 
                  placeholder="0"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-xl outline-none text-xs font-bold text-slate-700 transition-all"
                  value={formData.cost}
                  onChange={(e) => setFormData({...formData, cost: e.target.value})}
                />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest">Date Completed</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="date" 
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-green-600 focus:bg-white rounded-xl outline-none text-xs font-bold text-slate-700 transition-all"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 text-slate-400 text-xs font-bold hover:bg-slate-50 rounded-xl transition-colors uppercase tracking-widest"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-green-600 text-white text-xs font-black rounded-xl hover:bg-green-700 shadow-lg shadow-green-100 transition-all active:scale-[0.98] uppercase tracking-widest"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceModal;