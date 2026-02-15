import React, { useState } from 'react';
import { Search, Plus, Tractor, Filter, LayoutGrid } from 'lucide-react';
import { useMachines } from '../context/MachineContext';
import AssetCard from '../components/AssetCard';
import AddAssetModal from '../components/AddAssetModal';

const AssetList = () => {
  const { machines, loading, addMachine } = useMachines();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FILTER LOGIC (Maintained) ---
  const filteredMachines = machines.filter(machine => {
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.type.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesStatus = true;
    if (filterStatus === 'Available') {
      matchesStatus = !machine.assignment?.isAssigned && machine.status === 'Healthy';
    }
    if (filterStatus === 'In Use') {
      matchesStatus = machine.assignment?.isAssigned === true;
    }
    if (filterStatus === 'Maintenance') {
      matchesStatus = machine.status !== 'Healthy' || (machine.usage?.currentHours >= machine.usage?.serviceInterval);
    }

    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Fleet Data...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Header Section - Refined Typography */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">Asset Control</span>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">My Machinery</h1>
          <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-tighter">Total Assets Managed: {machines.length}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 flex items-center gap-3 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Add New Asset
        </button>
      </div>

      {/* 2. Controls Bar - Refined Style */}
      <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row gap-2">
        
        {/* Search Input */}
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, model, or serial..." 
            className="w-full pl-13 pr-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[1.5rem] outline-none transition-all text-xs font-bold text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs - Refined Typography */}
        <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] overflow-x-auto no-scrollbar whitespace-nowrap">
           {['All', 'Available', 'In Use', 'Maintenance'].map((tab) => (
             <button
               key={tab}
               onClick={() => setFilterStatus(tab)}
               className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                 filterStatus === tab 
                   ? 'bg-white text-blue-600 shadow-md scale-[1.02]' 
                   : 'text-slate-400 hover:text-slate-600'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* 3. Results Grid */}
      {filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredMachines.map(machine => (
            <AssetCard key={machine.id} machine={machine} />
          ))}
        </div>
      ) : (
        /* Empty State - Refined Typography */
        <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="bg-white w-20 h-20 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Tractor size={40} strokeWidth={1} />
          </div>
          <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Zero Assets Found</h3>
          <p className="text-xs font-bold text-slate-400 max-w-xs mx-auto mt-2 uppercase tracking-tighter">
            No machines matching "{searchTerm}" in the "{filterStatus}" category.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
            className="mt-8 text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline px-6 py-3 bg-white rounded-xl shadow-sm border border-slate-100"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* 4. Add Asset Modal (Maintained Prop Structure) */}
      <AddAssetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} 
        onSave={(newAsset) => {
          addMachine(newAsset);
          setIsModalOpen(false);
        }}
      />

    </div>
  );
};

export default AssetList;