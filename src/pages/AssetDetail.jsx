import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, PenTool, User, CheckCircle, Wrench } from 'lucide-react';
import { useMachines } from '../context/MachineContext';
import CheckOutModal from '../components/CheckOutModal';
import ReturnModal from '../components/ReturnModal';
import MaintenanceModal from '../components/MaintenanceModal'; // Your Green Modal

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { machines, loading, checkOutMachine, returnMachine, logMaintenance } = useMachines();
  
  const [isCheckOutOpen, setCheckOutOpen] = useState(false);
  const [isReturnOpen, setReturnOpen] = useState(false);
  const [isMaintenanceOpen, setMaintenanceOpen] = useState(false);

  const machine = machines.find(m => m.id === id);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!machine) return <div className="p-10 text-center">Asset not found.</div>;

  const isAssigned = machine.assignment?.isAssigned;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 font-medium transition-colors">
        <ArrowLeft size={20} /> Back to Assets
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          
          {/* Image */}
          <div className="w-full md:w-1/3 bg-gray-100 relative min-h-[300px]">
            <img 
              src={machine.image || 'https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=800&q=80'} 
              alt={machine.name} 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
               <span className={`px-4 py-2 rounded-xl text-sm font-bold shadow-lg backdrop-blur-md ${
                 machine.status === 'Healthy' ? 'bg-white/90 text-green-700' : 'bg-red-500 text-white'
               }`}>
                 {machine.status}
               </span>
            </div>
          </div>

          {/* Details */}
          <div className="w-full md:w-2/3 p-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{machine.name}</h1>
                  <p className="text-gray-500 font-medium mt-1">{machine.type} • {machine.specs?.serialNumber || 'SN-123'}</p>
                </div>
                {isAssigned && (
                   <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                     <User size={16} /> In use by {machine.assignment.assignedTo}
                   </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">
                    <Clock size={14} /> Usage
                  </div>
                  <p className="text-xl font-bold text-gray-900">{machine.usage?.currentHours || 0} Hours</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">
                    <PenTool size={14} /> Service Due
                  </div>
                  <p className="text-xl font-bold text-gray-900">in {machine.usage?.serviceInterval - machine.usage?.currentHours} Hours</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8 pt-8 border-t border-gray-100">
              {isAssigned ? (
                <button 
                  onClick={() => setReturnOpen(true)}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> Return Machine
                </button>
              ) : (
                <button 
                  onClick={() => setCheckOutOpen(true)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                >
                  <Calendar size={20} /> Check Out Machine
                </button>
              )}
              
              <button 
                onClick={() => setMaintenanceOpen(true)}
                className="px-6 py-3 border-2 border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all flex items-center gap-2"
              >
                <Wrench size={18} /> Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History Log (UPDATED FOR YOUR MODAL) */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Service History</h3>
        <div className="space-y-6">
          {(machine.history || []).length > 0 ? (
            machine.history.map((log, index) => (
              <div key={index} className="flex gap-4 items-start pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                  <CheckCircle size={20} />
                </div>
                <div>
                  {/* Using 'action' from your Green Modal */}
                  <p className="font-bold text-gray-900">{log.action || 'Service Record'}</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Performed by: <span className="font-medium text-gray-700">{log.mechanic || 'Unknown'}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {log.date} • Cost: {parseInt(log.cost || 0).toLocaleString()} RWF
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-400">No service history available yet.</div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {isCheckOutOpen && (
        <CheckOutModal 
          machine={machine} 
          onClose={() => setCheckOutOpen(false)} 
          onConfirm={(data) => {
            checkOutMachine(machine.id, data.farmerName, data.duration);
            setCheckOutOpen(false);
          }}
        />
      )}

      {isReturnOpen && (
         <ReturnModal 
           machine={machine} 
           onClose={() => setReturnOpen(false)} 
           onConfirm={() => {
             returnMachine(machine.id);
             setReturnOpen(false);
           }} 
         />
      )}

      {isMaintenanceOpen && (
        <MaintenanceModal
          onClose={() => setMaintenanceOpen(false)}
          onSave={(logData) => {
            logMaintenance(machine.id, logData);
            setMaintenanceOpen(false);
          }}
        />
      )}

    </div>
  );
};

export default AssetDetail;