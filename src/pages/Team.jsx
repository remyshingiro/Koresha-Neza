import React, { useState } from 'react';
import { Mail, Phone, MapPin, Plus, Trash2, UserCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // 1. Import translation hook
import { useMachines } from '../context/MachineContext'; 
import AddMemberModal from '../components/AddMemberModal'; 

const Team = () => {
  const { t } = useTranslation(); // 2. Initialize translation function
  const { members, addMember, removeMember } = useMachines();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = (newMember) => {
    addMember(newMember); 
    setIsModalOpen(false); 
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Page Header - Translated */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">{t('operators')}</h1>
           <p className="text-gray-500 text-sm mt-1">Manage team permissions and contact details.</p>
        </div>
        <div>
          <button 
            onClick={() => setIsModalOpen(true)} 
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            {t('add_member')}
          </button>
        </div>
      </div>

      {/* Empty State - Translated */}
      {members.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <UserCheck size={48} className="mx-auto text-gray-300 mb-4 opacity-50" />
          <p className="text-gray-400 font-medium">No team members found.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-blue-600 font-bold mt-2 hover:underline"
          >
            {t('add_member')}
          </button>
        </div>
      )}

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative">
            
            {/* Delete Button */}
            <button 
              onClick={() => { if(confirm('Remove this member?')) removeMember(member.id) }}
              className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={18} />
            </button>

            {/* Avatar & Status */}
            <div className="flex justify-between items-start mb-4">
              <img 
                src={member.image || `https://ui-avatars.com/api/?name=${member.name}&background=random`} 
                alt={member.name} 
                className="w-16 h-16 rounded-full object-cover border-4 border-gray-50 shadow-sm" 
              />
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                Active
              </span>
            </div>

            {/* Info - Translated Labels */}
            <div>
              <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
              <p className="text-blue-600 font-medium text-sm mb-4">{member.role || 'Operator'}</p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <Mail size={16} className="shrink-0" />
                  <span className="truncate">{member.email || t('email_address')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <Phone size={16} className="shrink-0" />
                  <span>{member.phone || t('phone_number')}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 text-sm">
                  <MapPin size={16} className="shrink-0" />
                  <span>Kigali, Rwanda</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <AddMemberModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
        />
      )}
    </div>
  );
};

export default Team;