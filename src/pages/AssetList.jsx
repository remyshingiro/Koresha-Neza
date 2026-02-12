import React, { useState } from 'react';
import { Search, Plus, Tractor } from 'lucide-react';
import { useMachines } from '../context/MachineContext';
import AssetCard from '../components/AssetCard';
import AddAssetModal from '../components/AddAssetModal';

const AssetList = () => {
  const { machines, loading, addMachine } = useMachines();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All'); // All, Available, In Use, Maintenance
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FILTER LOGIC ---
  const filteredMachines = machines.filter(machine => {
    // 1. Search Filter
    const matchesSearch = 
      machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      machine.type.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Tab Filter
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

  if (loading) return <div className="p-10 text-center text-gray-500">Loading fleet data...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Machinery</h1>
          <p className="text-gray-500 mt-1">Manage {machines.length} assets in your fleet.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} /> Add New Asset
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
          <input 
            type="text" 
            placeholder="Search by name, model, or serial..." 
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent focus:bg-white border focus:border-blue-500 rounded-xl outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl overflow-hidden">
           {['All', 'Available', 'In Use', 'Maintenance'].map((tab) => (
             <button
               key={tab}
               onClick={() => setFilterStatus(tab)}
               className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                 filterStatus === tab 
                   ? 'bg-white text-gray-900 shadow-sm' 
                   : 'text-gray-500 hover:text-gray-700'
               }`}
             >
               {tab}
             </button>
           ))}
        </div>
      </div>

      {/* Results Grid */}
      {filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMachines.map(machine => (
            <AssetCard key={machine.id} machine={machine} />
          ))}
        </div>
      ) : (
        // Empty State
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
            <Tractor size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No assets found</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2">
            No machines matching "{searchTerm}" in the "{filterStatus}" category.
          </p>
          <button 
            onClick={() => { setSearchTerm(''); setFilterStatus('All'); }}
            className="mt-6 text-blue-600 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Add Asset Modal */}
      {isModalOpen && (
        <AddAssetModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={(newAsset) => {
            addMachine(newAsset);
            setIsModalOpen(false);
          }}
        />
      )}

    </div>
  );
};

export default AssetList;