import React, { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import AssetCard from '../components/AssetCard';
// 1. IMPORT HOOK & MODAL
import { useMachines } from '../context/MachineContext';
import AddAssetModal from '../components/AddAssetModal';

const AssetList = () => {
  // 2. GET LIVE DATA
  const { machines, addMachine } = useMachines();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 3. HANDLE SAVE
  const handleSaveNewMachine = (newMachine) => {
    addMachine(newMachine); // Update the Context
    setIsAddModalOpen(false); // Close Modal
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">My Machinery</h1>
           <p className="text-gray-500 text-sm mt-1">Manage, track, and assign your cooperative's equipment.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            Filter
          </button>
          {/* 4. OPEN MODAL ON CLICK */}
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            <Plus size={20} />
            Add Machine
          </button>
        </div>
      </div>

      {/* The Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {machines.map((machine) => (
          <AssetCard key={machine.id} machine={machine} />
        ))}
      </div>

      {/* Empty State */}
      {machines.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-medium">No machines found.</p>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="text-blue-600 font-bold mt-2 hover:underline"
          >
            Add your first asset
          </button>
        </div>
      )}

      {/* 5. SHOW MODAL IF OPEN */}
      {isAddModalOpen && (
        <AddAssetModal 
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveNewMachine}
        />
      )}
    </div>
  );
};

export default AssetList;