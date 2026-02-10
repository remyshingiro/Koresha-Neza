import React, { useState } from 'react';
import { X, Tractor, Wrench, Hash, Save } from 'lucide-react';

const AddAssetModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Tractor',
    serviceInterval: '200',
    serialNumber: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Create a new machine object with default values for the rest
    const newMachine = {
      name: formData.name,
      type: formData.type,
      status: "Healthy",
      // Pick a random image based on type (placeholder logic)
      image: formData.type === 'Tractor' 
        ? "https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=600&q=80" 
        : "https://images.unsplash.com/photo-1628131378377-625d97d9560a?w=600&q=80",
      usage: {
        currentHours: 0,
        serviceInterval: parseInt(formData.serviceInterval),
        dailyAverage: 0
      },
      specs: {
        modelYear: new Date().getFullYear().toString(),
        serialNumber: formData.serialNumber || 'N/A',
        purchaseDate: new Date().toISOString().split('T')[0],
        engineType: 'Standard Diesel'
      },
      assignment: { isAssigned: false, assignedTo: null, dueDate: null },
      history: []
    };

    onSave(newMachine);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tractor className="text-blue-200" /> Register New Asset
          </h2>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Machine Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Machine Name / Model</label>
            <input 
              required
              type="text" 
              placeholder="e.g., John Deere 5050D"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Tractor">Tractor</option>
                <option value="Harvesting">Harvesting</option>
                <option value="Processing">Processing</option>
                <option value="Truck">Transport Truck</option>
              </select>
            </div>

            {/* Service Interval */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service Every (Hrs)</label>
              <div className="relative">
                <Wrench className="absolute left-3 top-2.5 text-gray-400" size={16} />
                <input 
                  required
                  type="number" 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.serviceInterval}
                  onChange={(e) => setFormData({...formData, serviceInterval: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Serial Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="SN-2024-XXX"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.serialNumber}
                onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
              />
            </div>
          </div>

          {/* Actions */}
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
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
            >
              <Save size={18} />
              Save Asset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssetModal;