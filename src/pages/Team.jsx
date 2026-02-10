import React from 'react';
import { Mail, Phone, MapPin, Shield, User, Filter, Plus } from 'lucide-react';

const Team = () => {
  // Mock data for the team (Later we can move this to Context)
  const members = [
    {
      id: 1,
      name: 'Manager Jean',
      role: 'Cooperative Manager',
      status: 'Active',
      email: 'jean@kopakama.rw',
      phone: '+250 788 123 456',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&q=80'
    },
    {
      id: 2,
      name: 'Jean Paul',
      role: 'Senior Tractor Operator',
      status: 'On Duty',
      email: 'jp.driver@kopakama.rw',
      phone: '+250 788 000 001',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80'
    },
    {
      id: 3,
      name: 'Marie Claire',
      role: 'Head Mechanic',
      status: 'Active',
      email: 'marie.fix@kopakama.rw',
      phone: '+250 788 000 002',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&q=80'
    },
    {
      id: 4,
      name: 'Eric Ndayisaba',
      role: 'Logistics Assistant',
      status: 'On Leave',
      email: 'eric.n@kopakama.rw',
      phone: '+250 788 000 003',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&q=80'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Operators & Staff</h1>
           <p className="text-gray-500 text-sm mt-1">Manage permissions and contact details.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          <button className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">
            <Plus size={20} />
            Add Member
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
            
            {/* Top Section: Avatar & Status */}
            <div className="flex justify-between items-start mb-4">
              <img 
                src={member.image} 
                alt={member.name} 
                className="w-16 h-16 rounded-full object-cover border-4 border-gray-50 group-hover:border-blue-50 transition-colors"
              />
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                member.status === 'Active' || member.status === 'On Duty' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {member.status}
              </span>
            </div>

            {/* Info Section */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 font-medium text-sm mb-4">{member.role}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <Mail size={16} />
                  <span>{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <Phone size={16} />
                  <span>{member.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <MapPin size={16} />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-3">
               <button className="flex-1 py-2 text-sm font-bold text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                 View Profile
               </button>
               <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                 <Shield size={20} />
               </button>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;