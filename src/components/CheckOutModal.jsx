import React, { useState } from 'react';
import { X, User, Calendar, Clock } from 'lucide-react';

const CheckOutModal = ({ machine, onClose, onConfirm }) => {
  const [farmerName, setFarmerName] = useState('');
  const [duration, setDuration] = useState('1');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ farmerName, duration });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-blue-600 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white">Check Out Machine</h2>
            <p className="text-blue-100 text-sm mt-1">Assigning: {machine.name}</p>
          </div>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Farmer / Operator</label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-400" size={18} />
              <select 
                required
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a person...</option>
                <option value="Jean Paul">Jean Paul (Member #042)</option>
                <option value="Marie Claire">Marie Claire (Member #015)</option>
                <option value="Eric Ndayisaba">Eric Ndayisaba (Driver)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Duration (Days)</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
              <input 
                type="number" 
                min="1"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckOutModal;