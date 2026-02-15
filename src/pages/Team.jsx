import React, { useState, useMemo } from 'react';
import { 
  Mail, Phone, MapPin, Plus, Trash2, ShieldCheck, 
  ChevronRight, Tractor, Activity, Star, Smartphone, X, Clock, MessageSquare
} from 'lucide-react';
import { useTranslation } from 'react-i18next'; 
import { useMachines } from '../context/MachineContext'; 
import AddMemberModal from '../components/AddMemberModal'; 

const Team = () => {
  const { t } = useTranslation(); 
  const { members, machines, removeMember, addMember } = useMachines();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);

  // --- Live Machinery Linkage ---
  const memberAssignments = useMemo(() => {
    const map = {};
    machines.forEach(m => {
      if (m.assignment?.isAssigned && m.assignment?.assignedTo === m.assignment?.assignedTo) {
        map[m.assignment.assignedTo] = m;
      }
    });
    return map;
  }, [machines]);

  const handleSave = (newMember) => {
    addMember(newMember); 
    setIsModalOpen(false); 
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* 1. Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] block mb-2">Personnel Directory</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{t('operators')}</h1>
          <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-tighter flex items-center gap-2">
            <Activity size={14} className="text-emerald-500" /> Live Workforce Analytics
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> {t('add_member')}
        </button>
      </div>

      {/* 2. Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {members.map((member) => {
          const currentMachine = memberAssignments[member.name];
          
          return (
            <div 
              key={member.id} 
              onClick={() => setSelectedWorker(member)}
              className="bg-white rounded-[2.5rem] p-1 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group relative overflow-hidden cursor-pointer"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="relative">
                    <img src={member.image || `https://ui-avatars.com/api/?name=${member.name}&background=0284c7&color=fff&bold=true`} className="w-20 h-20 rounded-[1.5rem] object-cover border-4 border-slate-50 shadow-sm" alt="" />
                    {currentMachine && <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-600 border-4 border-white rounded-full flex items-center justify-center text-white animate-pulse"><Tractor size={14} /></div>}
                  </div>
                  <div className={`px-3 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest border ${currentMachine ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                    {currentMachine ? "On Mission" : "Available"}
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block mb-1">{member.role}</span>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight leading-none truncate">{member.name}</h3>
                </div>

                <div className={`p-4 rounded-2xl border transition-all mb-6 ${currentMachine ? "bg-slate-900 border-slate-800 text-white" : "bg-slate-50 border-slate-100 text-slate-400"}`}>
                    <p className="text-[8px] font-black uppercase tracking-[0.2em] mb-3 opacity-60">Status</p>
                    {currentMachine ? (
                        <div className="flex items-center gap-3">
                            <Tractor size={18} className="text-blue-400" />
                            <div className="min-w-0">
                                <p className="text-xs font-black truncate uppercase">{currentMachine.name}</p>
                                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter">Deployed</p>
                            </div>
                        </div>
                    ) : <p className="text-[10px] font-bold italic py-1 tracking-tight">Standby Mode</p>}
                </div>

                <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 group-hover:bg-blue-600 group-hover:text-white rounded-xl text-slate-500 transition-all font-black text-[10px] uppercase tracking-widest">
                  View full details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. COMPACT WORKER DETAILS MODAL (Clean Data Only) */}
      {selectedWorker && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setSelectedWorker(null)} />
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
            
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <ShieldCheck size={14} className="text-blue-200" /> Personnel Dossier
              </h3>
              <button onClick={() => setSelectedWorker(null)} className="text-blue-100 hover:text-white transition-colors p-1 hover:bg-blue-500 rounded-lg"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
                {/* Identity Row */}
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={selectedWorker.image} className="w-16 h-16 rounded-2xl border-4 border-slate-50 shadow-sm object-cover" alt="" />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white">
                      <ShieldCheck size={10} />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">{selectedWorker.role}</span>
                    <h2 className="text-xl font-black text-slate-900 truncate tracking-tight uppercase leading-none">{selectedWorker.name}</h2>
                    <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter flex items-center gap-1">
                      <MapPin size={10} /> {selectedWorker.address || 'Location Unspecified'}
                    </p>
                  </div>
                  <button 
                    onClick={() => { if(window.confirm('Permanently delete personnel record?')) { removeMember(selectedWorker.id); setSelectedWorker(null); } }}
                    className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all self-start"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                {/* Contact Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <a href={`tel:${selectedWorker.phone}`} className="flex items-center gap-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50 hover:bg-emerald-100 transition-all group">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-emerald-600 group-hover:scale-110 transition-transform"><Phone size={14} /></div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Voice Call</p>
                            <p className="text-[10px] font-black text-emerald-900 truncate">{selectedWorker.phone || 'N/A'}</p>
                        </div>
                    </a>
                    <a href={`mailto:${selectedWorker.email}`} className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 hover:bg-blue-100 transition-all group">
                        <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600 group-hover:scale-110 transition-transform"><Mail size={14} /></div>
                        <div className="min-w-0">
                            <p className="text-[8px] font-black text-blue-700 uppercase tracking-widest">Message</p>
                            <p className="text-[10px] font-black text-blue-900 truncate">{selectedWorker.email || 'N/A'}</p>
                        </div>
                    </a>
                </div>

                {/* Live Status */}
                <div className="p-4 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Activity size={12} /> Live Operation</h4>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-full border border-slate-100">
                            <div className={`w-1.5 h-1.5 rounded-full ${memberAssignments[selectedWorker.name] ? 'bg-blue-500 animate-pulse' : 'bg-slate-300'}`}></div>
                            <span className="text-[8px] font-black text-slate-500 uppercase">{memberAssignments[selectedWorker.name] ? 'Active' : 'Standby'}</span>
                        </div>
                    </div>
                    {memberAssignments[selectedWorker.name] ? (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600 border border-slate-100"><Tractor size={20} /></div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-slate-800 uppercase truncate">{memberAssignments[selectedWorker.name].name}</p>
                                <p className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter">Deployed since {memberAssignments[selectedWorker.name].assignment?.date}</p>
                            </div>
                        </div>
                    ) : <p className="text-[10px] font-bold text-slate-400 italic py-1">No active machinery assigned to this operator.</p>}
                </div>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <AddMemberModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
    </div>
  );
};

export default Team;