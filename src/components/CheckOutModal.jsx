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

// Filter only "Active" staff
const activeStaff = members.filter(m => m.status === 'Active' || m.status === 'On Duty');

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4 backdrop-blur-sm animate-in fade-in duration-200">
    <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden border border-slate-100">
        
        {/* Header - Refined Text Size */}
        <div className="bg-blue-600 p-5 flex justify-between items-center">
        <h2 className="text-lg font-black text-white flex items-center gap-2 uppercase tracking-tight">
            <Clock className="text-blue-200" size={18} /> Asset Assignment
        </h2>
        <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
            <X size={20} />
        </button>
        </div>

        {/* Machine Info Summary - Refined Text Size */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex gap-3 items-center">
        <img src={machine.image} alt="" className="w-10 h-10 rounded-xl object-cover shadow-sm" />
        <div>
            <p className="font-black text-slate-800 text-sm leading-tight">{machine.name}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Serial: {machine.specs?.serialNumber || 'N/A'}</p>
        </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
        
        {/* DYNAMIC DROPDOWN */}
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest">Assign To (Operator)</label>
            <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <select 
                required
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none appearance-none text-xs font-bold text-slate-700 transition-all"
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
            <p className="text-[10px] text-red-500 mt-1 font-bold italic ml-1">
                Tip: Go to "Operators & Staff" to add people first.
            </p>
            )}
        </div>

        {/* Duration */}
        <div>
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1 mb-1 block tracking-widest">Duration (Days)</label>
            <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input 
                required
                type="number" 
                min="1" 
                max="30"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-xl outline-none text-xs font-bold text-slate-700 transition-all"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
            />
            </div>
            <p className="text-[10px] text-slate-400 mt-1 ml-1 font-medium">
                Return deadline: <span className="font-black text-blue-600">
                    {new Date(Date.now() + (parseInt(formData.duration) || 0) * 86400000).toLocaleDateString()}
                </span>
            </p>
        </div>

        {/* Actions */}
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
            disabled={!formData.farmerName}
            className="flex-1 py-3 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
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