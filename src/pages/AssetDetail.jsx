import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useMachines } from '../context/MachineContext';
import { ArrowLeft, Calendar, CheckCircle, Clock, User, Wrench, ClipboardList } from 'lucide-react';
import { predictServiceDate } from '../utils/aiLogic';
import CheckOutModal from '../components/CheckOutModal';
// 1. IMPORT THE NEW MODAL
import MaintenanceModal from '../components/MaintenanceModal';

const AssetDetail = () => {
  const { id } = useParams();
  // 2. GET THE NEW ACTION
  const { machines, checkOutMachine, returnMachine, logMaintenance } = useMachines();
  
  const machine = machines.find((m) => m.id === parseInt(id));
  
  const [activeTab, setActiveTab] = useState('info');
  const [isCheckOutOpen, setIsCheckOutOpen] = useState(false);
  const [isMaintenanceOpen, setIsMaintenanceOpen] = useState(false); // New State

  if (!machine) return <div className="p-10 text-center text-gray-500">Machine not found!</div>;

  const prediction = predictServiceDate(machine);
  const isHealthy = machine.status === "Healthy";
  const isAssigned = machine.assignment?.isAssigned;

  const handleCheckOutConfirm = (formData) => {
    checkOutMachine(machine.id, formData.farmerName, formData.duration);
    setIsCheckOutOpen(false);
  };

  // 3. HANDLE MAINTENANCE SAVE
  const handleMaintenanceConfirm = (logData) => {
    logMaintenance(machine.id, logData);
    setIsMaintenanceOpen(false);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <Link to="/assets" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
        <ArrowLeft size={20} className="mr-2" />
        Back to Machinery
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        <div className="h-72 w-full relative bg-gray-200">
           <img src={machine.image} alt={machine.name} className="w-full h-full object-cover" />
           <div className="absolute top-6 right-6 flex gap-3">
              <span className={`px-4 py-1.5 rounded-full font-bold shadow-sm backdrop-blur-md ${isHealthy ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                {machine.status}
              </span>
           </div>
        </div>
        
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{machine.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Wrench size={16}/> {machine.type}</span>
                <span className="flex items-center gap-1"><Clock size={16}/> Owned since {machine.specs?.purchaseDate}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 w-full md:w-auto">
               {/* 4. NEW MAINTENANCE BUTTON */}
               <button 
                 onClick={() => setIsMaintenanceOpen(true)}
                 className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-3 rounded-xl font-bold hover:bg-gray-50 transition-colors"
               >
                 <ClipboardList size={18} />
                 Log Maintenance
               </button>

               {isAssigned ? (
                 <div className="flex gap-2">
                    <div className="bg-blue-50 text-blue-700 px-6 py-3 rounded-xl font-bold flex items-center gap-2 border border-blue-100">
                      <User size={20} />
                      In Use
                    </div>
                    <button 
                       onClick={() => returnMachine(machine.id)}
                       className="bg-blue-600 text-white px-5 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-md"
                    >
                       Return
                    </button>
                 </div>
               ) : (
                 <button 
                   onClick={() => setIsCheckOutOpen(true)}
                   className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                 >
                   Check Out
                 </button>
               )}
            </div>
          </div>

          {/* AI Box */}
          {isHealthy && prediction && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 flex items-start gap-4">
               <div className="bg-white p-3 rounded-xl text-blue-600 shadow-sm">
                 <Calendar size={24} />
               </div>
               <div>
                 <h3 className="font-bold text-gray-900">AI Maintenance Forecast</h3>
                 <p className="text-gray-600 text-sm mt-1">
                   Based on current usage, service recommended on <span className="font-bold text-blue-700">{prediction.date}</span>.
                 </p>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-8 px-4">
        <button 
          onClick={() => setActiveTab('info')}
          className={`pb-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Specifications & Usage
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`pb-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
        >
          Maintenance History
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 min-h-[300px]">
        {/* INFO TAB */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="space-y-6">
              <h3 className="text-gray-900 font-bold flex items-center gap-2">
                <Wrench size={18} className="text-gray-400"/> Technical Specs
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400 uppercase font-bold">Serial Number</p><p className="font-medium text-gray-900 mt-1">{machine.specs?.serialNumber}</p></div>
                <div className="p-4 bg-gray-50 rounded-xl"><p className="text-xs text-gray-400 uppercase font-bold">Engine</p><p className="font-medium text-gray-900 mt-1">{machine.specs?.engineType}</p></div>
              </div>
            </div>
            <div className="space-y-6">
               <h3 className="text-gray-900 font-bold flex items-center gap-2">
                <Clock size={18} className="text-gray-400"/> Usage Status
              </h3>
               <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                 <div className="flex justify-between mb-2">
                   <span className="font-medium text-blue-900">Service Interval</span>
                   <span className="font-bold text-blue-700">{machine.usage.currentHours} / {machine.usage.serviceInterval} hrs</span>
                 </div>
                 <div className="w-full bg-blue-200 rounded-full h-3 mb-4">
                    <div className={`h-3 rounded-full ${isHealthy ? 'bg-blue-600' : 'bg-red-500'}`} style={{ width: `${(machine.usage.currentHours / machine.usage.serviceInterval) * 100}%` }}></div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {!machine.history || machine.history.length === 0 ? (
              <p className="text-gray-500 italic text-center py-10">No maintenance history recorded.</p>
            ) : (
              machine.history.map((log, index) => (
                <div key={index} className="flex gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                   <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0"><CheckCircle size={20} /></div>
                   <div className="flex-1">
                     <div className="flex justify-between items-start">
                       <h4 className="font-bold text-gray-900 text-lg">{log.action}</h4>
                       <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{log.date}</span>
                     </div>
                     <p className="text-gray-600 mt-1">Performed by: <span className="font-medium text-gray-900">{log.mechanic}</span></p>
                     <p className="text-sm text-gray-400 mt-1">Cost: {log.cost?.toLocaleString()} RWF</p>
                   </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {isCheckOutOpen && <CheckOutModal machine={machine} onClose={() => setIsCheckOutOpen(false)} onConfirm={handleCheckOutConfirm} />}
      {isMaintenanceOpen && <MaintenanceModal onClose={() => setIsMaintenanceOpen(false)} onSave={handleMaintenanceConfirm} />}

    </div>
  );
};

export default AssetDetail;