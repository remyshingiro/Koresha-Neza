    import React, { useState } from 'react';
    import { X, Calendar, User, Clock } from 'lucide-react';
    import { useMachines } from '../context/MachineContext'; // 1. Import Context

    const CheckOutModal = ({ machine, onClose, onConfirm }) => {
    // 2. Get Real Members from Database
    const { members } = useMachines(); 
    
    const [formData, setFormData] = useState({
        farmerName: '', // This will store the selected member's ID or Name
        duration: '1'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(formData);
    };

    // Filter only "Active" staff (Optional: you might not want to assign machines to people "On Leave")
    const activeStaff = members.filter(m => m.status === 'Active' || m.status === 'On Duty');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-blue-600 p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="text-blue-200" /> Check Out Machine
            </h2>
            <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
                <X size={24} />
            </button>
            </div>

            {/* Machine Info Summary */}
            <div className="bg-blue-50 px-6 py-4 border-b border-blue-100 flex gap-3 items-center">
            <img src={machine.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
            <div>
                <p className="font-bold text-blue-900">{machine.name}</p>
                <p className="text-xs text-blue-600 font-medium">Serial: {machine.specs?.serialNumber || 'N/A'}</p>
            </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* 3. DYNAMIC DROPDOWN (The Upgrade) */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (Operator)</label>
                <div className="relative">
                <User className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <select 
                    required
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    value={formData.farmerName}
                    onChange={(e) => setFormData({...formData, farmerName: e.target.value})}
                >
                    <option value="">Select a team member...</option>
                    {activeStaff.length === 0 ? (
                    <option disabled>No active staff found</option>
                    ) : (
                    activeStaff.map(member => (
                        <option key={member.id} value={member.name}>
                        {member.name} ({member.role})
                        </option>
                    ))
                    )}
                </select>
                </div>
                {activeStaff.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                    Tip: Go to "Operators & Staff" to add people first.
                </p>
                )}
            </div>

            {/* Duration */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                <div className="relative">
                <Calendar className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    required
                    type="number" 
                    min="1" 
                    max="30"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                Expected return: <span className="font-medium text-gray-600">
                    {new Date(Date.now() + (parseInt(formData.duration) || 0) * 86400000).toLocaleDateString()}
                </span>
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
                <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                >
                Cancel
                </button>
                <button 
                type="submit"
                disabled={!formData.farmerName}
                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Confirm Assignment
                </button>
            </div>
            </form>
        </div>
        </div>
    );
    };

    export default CheckOutModal;