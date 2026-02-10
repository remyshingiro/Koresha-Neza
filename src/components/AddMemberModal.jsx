import React, { useState } from 'react';
import { X, User, Phone, Mail, Shield } from 'lucide-react';

const AddMemberModal = ({ onClose, onSave }) => {
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
      // Create a random avatar URL based on their name
      image: `https://ui-avatars.com/api/?name=${formData.name}&background=random`
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-blue-600 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <User className="text-blue-200" /> Add Team Member
          </h2>
          <button onClick={onClose} className="text-blue-100 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              required 
              type="text" 
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             {/* Role */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
               <select 
                 className="w-full px-4 py-2 border border-gray-300 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.role} 
                 onChange={e => setFormData({...formData, role: e.target.value})}
               >
                 <option>Operator</option>
                 <option>Mechanic</option>
                 <option>Manager</option>
                 <option>Field Officer</option>
               </select>
             </div>
             {/* Phone */}
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
               <input 
                 required 
                 type="text" 
                 placeholder="+250..."
                 className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.phone} 
                 onChange={e => setFormData({...formData, phone: e.target.value})} 
               />
             </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              placeholder="name@kopakama.rw"
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all mt-4"
          >
            Save Member
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;