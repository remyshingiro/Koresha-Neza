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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        
        <div className="bg-green-600 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="text-green-100" /> Log Maintenance
          </h2>
          <button onClick={onClose} className="text-green-100 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Action Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Performed</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Mechanic / Garage</label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                required
                type="text" 
                placeholder="e.g., Garage Kigali"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.mechanic}
                onChange={(e) => setFormData({...formData, mechanic: e.target.value})}
              />
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cost (RWF)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                required
                type="number" 
                placeholder="0"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.cost}
                onChange={(e) => setFormData({...formData, cost: e.target.value})}
              />
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Completed</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="date" 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all"
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