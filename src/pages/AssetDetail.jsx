import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  ArrowLeft, Tractor, Calendar, Clock, 
  User, CheckCircle, AlertTriangle, 
  Wrench, RotateCcw, ArrowRightLeft, Trash2, Battery,
  X, DollarSign, Clipboard, Briefcase, Download, Fuel, Droplet
} from 'lucide-react';
import { useMachines } from '../context/MachineContext';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // DESTRUCTURE NEW FUNCTIONS
  const { machines, deleteMachine, checkOutMachine, returnMachine, logMaintenance, logFuel, logUsage } = useMachines();
  
  const machine = machines.find(m => m.id === id);

  // --- MODAL STATES ---
  const [isCheckoutOpen, setCheckoutOpen] = useState(false);
  const [isServiceOpen, setServiceOpen] = useState(false);
  const [isFuelOpen, setIsFuelOpen] = useState(false); 
  const [isUsageOpen, setIsUsageOpen] = useState(false); // NEW MODAL

  // --- FORMS ---
  const [checkoutForm, setCheckoutForm] = useState({ assignee: '', department: 'Operations', duration: '1' });
  const [serviceForm, setServiceForm] = useState({ type: 'Routine Maintenance', cost: '', technician: '', note: '', date: new Date().toISOString().split('T')[0] });
  const [fuelForm, setFuelForm] = useState({ liters: '', cost: '', date: new Date().toISOString().split('T')[0], vendor: 'Coop Station' });
  const [usageHours, setUsageHours] = useState(''); // NEW STATE

  if (!machine) return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading Asset...</div>;

  const isAssigned = machine.assignment?.isAssigned;
  const isMaintenanceDue = machine.usage?.currentHours >= machine.usage?.serviceInterval;
  
  // --- HANDLERS ---
  const handleFuelSubmit = (e) => {
    e.preventDefault();
    logFuel(machine.id, { ...fuelForm, loggedAt: new Date().toISOString() });
    setIsFuelOpen(false);
    setFuelForm({ liters: '', cost: '', date: new Date().toISOString().split('T')[0], vendor: 'Coop Station' });
  };

  const handleUsageSubmit = (e) => {
    e.preventDefault();
    logUsage(machine.id, usageHours);
    setIsUsageOpen(false);
    setUsageHours('');
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    checkOutMachine(machine.id, checkoutForm.assignee, parseInt(checkoutForm.duration));
    setCheckoutOpen(false);
  };

  const handleServiceSubmit = (e) => {
    e.preventDefault();
    logMaintenance(machine.id, serviceForm);
    setServiceOpen(false);
  };

  const handleReturn = () => {
    if (window.confirm(`Confirm return of ${machine.name}?`)) returnMachine(machine.id);
  };

  const handleDelete = async () => {
    if (window.confirm("ARE YOU SURE?")) {
      await deleteMachine(machine.id);
      navigate('/assets');
    }
  };

  // --- PDF GENERATOR ---
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235); doc.rect(0, 0, 220, 40, 'F'); 
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.text("Koresha-Neza", 14, 25);
    
    doc.setTextColor(0, 0, 0); doc.setFontSize(14); doc.text(`Asset Report: ${machine.name}`, 14, 55);
    
    const tableColumn = ["Date", "Type", "Cost", "Notes"];
    const tableRows = (machine.history || []).map(log => [
        log.date, log.type, log.cost ? `$${log.cost}` : '-', log.note
    ]);
    
    autoTable(doc, { startY: 80, head: [tableColumn], body: tableRows, theme: 'grid' });
    doc.save(`${machine.name}_Report.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* 1. HEADER & NAV */}
      <div className="flex items-center justify-between">
        <Link to="/assets" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 font-bold"><ArrowLeft size={20} /> Back</Link>
        <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold text-sm"><Trash2 size={16} /> Delete</button>
      </div>

      {/* 2. HERO CARD */}
      <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm border border-gray-100 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image */}
        <div className="lg:col-span-1 h-72 bg-gray-100 rounded-2xl overflow-hidden relative group shadow-inner">
           <img src={machine.image || "https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=600&fit=crop"} alt={machine.name} className="w-full h-full object-cover" />
           <div className="absolute top-4 left-4">
             {isAssigned ? (
               <div className="bg-blue-600/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"><User size={12} /> In Use</div>
             ) : (
               <div className="bg-emerald-500/90 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-2"><CheckCircle size={12} /> Ready</div>
             )}
          </div>
        </div>

        {/* Details & Actions */}
        <div className="lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <h1 className="text-4xl font-extrabold text-gray-900">{machine.name}</h1>
              {isMaintenanceDue && <div className="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold flex items-center gap-2"><AlertTriangle size={18} /> Service Due</div>}
            </div>
            
            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Fuel Level</p>
                <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Battery size={20} className={machine.fuel < 20 ? "text-red-500" : "text-emerald-500"} /> {Math.round(machine.fuel)}%
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold mb-1">Hours</p>
                <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                  <Clock size={20} className="text-blue-500" /> {machine.usage?.currentHours || 0}
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <p className="text-xs text-gray-400 uppercase font-bold mb-1">Condition</p>
                 <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                   <div className={`w-3 h-3 rounded-full ${machine.status === 'Healthy' ? "bg-emerald-500" : "bg-amber-500"}`}></div>
                   {machine.status}
                 </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <p className="text-xs text-gray-400 uppercase font-bold mb-1">Lifetime Cost</p>
                 <div className="flex items-center gap-2 text-xl font-bold text-gray-900">
                   <DollarSign size={16} className="text-gray-400" /> 
                   {(
                     (machine.history || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0) +
                     (machine.fuelLogs || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0)
                   ).toLocaleString()}
                 </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-auto">
            
            {/* 1. Log Work Button (Purple) */}
            <button onClick={() => setIsUsageOpen(true)} className="flex-1 px-4 py-4 bg-purple-50 text-purple-700 border-2 border-purple-100 font-bold rounded-xl hover:bg-purple-100 flex items-center justify-center gap-2 transition-colors">
              <Clock size={20} /> Log Work
            </button>

            {/* 2. Refuel Button (Green) */}
            <button onClick={() => setIsFuelOpen(true)} className="flex-1 px-4 py-4 bg-emerald-50 text-emerald-700 border-2 border-emerald-100 font-bold rounded-xl hover:bg-emerald-100 flex items-center justify-center gap-2 transition-colors">
              <Fuel size={20} /> Refuel
            </button>
            
            {/* 3. Service Button (Orange) */}
            <button onClick={() => setServiceOpen(true)} className="flex-1 px-4 py-4 bg-amber-50 text-amber-700 border-2 border-amber-100 font-bold rounded-xl hover:bg-amber-100 flex items-center justify-center gap-2 transition-colors">
              <Wrench size={20} /> Service
            </button>
            
            {/* 4. Checkout/Return (Blue/Black) */}
            {isAssigned ? (
              <button onClick={handleReturn} className="flex-1 bg-gray-900 text-white px-6 py-4 rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2">
                <RotateCcw size={20} /> Return
              </button>
            ) : (
              <button onClick={() => setCheckoutOpen(true)} className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <ArrowRightLeft size={20} /> Checkout
              </button>
            )}

          </div>
        </div>
      </div>

      {/* 3. LOGS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Maintenance History */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2"><Clipboard size={20} className="text-gray-400" /> Service Log</h3>
             <button onClick={generatePDF} className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold hover:bg-blue-100 flex items-center gap-1"><Download size={14} /> PDF</button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {machine.history && machine.history.length > 0 ? machine.history.map((log, i) => (
               <div key={i} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="bg-white p-2 rounded-lg h-fit text-amber-500 shadow-sm"><Wrench size={16} /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{log.type}</p>
                    <p className="text-xs text-gray-500">{log.date} • {log.technician}</p>
                  </div>
                  <div className="ml-auto font-mono text-sm font-bold text-gray-400">${log.cost}</div>
               </div>
            )) : <p className="text-center text-gray-400 py-8">No service history.</p>}
          </div>
        </div>

        {/* Fuel History */}
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-xl text-gray-900 mb-6 flex items-center gap-2"><Droplet size={20} className="text-gray-400" /> Fuel Logs</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {machine.fuelLogs && machine.fuelLogs.length > 0 ? machine.fuelLogs.map((log, i) => (
               <div key={i} className="flex gap-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                  <div className="bg-white p-2 rounded-lg h-fit text-emerald-500 shadow-sm"><Fuel size={16} /></div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{log.liters} Liters</p>
                    <p className="text-xs text-gray-500">{log.date} • {log.vendor}</p>
                  </div>
                  <div className="ml-auto font-mono text-sm font-bold text-emerald-600">${log.cost}</div>
               </div>
            )) : <p className="text-center text-gray-400 py-8">No fuel records.</p>}
          </div>
        </div>
      </div>

      {/* MODALS */}
      
      {/* 1. REFUEL MODAL */}
      {isFuelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Fuel className="text-emerald-600" /> Log Refueling</h3>
              <button onClick={() => setIsFuelOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleFuelSubmit} className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Liters Added</label>
                  <input required type="number" className="w-full px-4 py-2 border rounded-xl" value={fuelForm.liters} onChange={e=>setFuelForm({...fuelForm, liters: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Total Cost ($)</label>
                  <input required type="number" className="w-full px-4 py-2 border rounded-xl" value={fuelForm.cost} onChange={e=>setFuelForm({...fuelForm, cost: e.target.value})} />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Vendor / Location</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-xl" value={fuelForm.vendor} onChange={e=>setFuelForm({...fuelForm, vendor: e.target.value})} />
               </div>
               <button type="submit" className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">Save Fuel Log</button>
            </form>
          </div>
        </div>
      )}

      {/* 2. LOG WORK MODAL */}
      {isUsageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2"><Clock className="text-purple-600" /> Daily Work Log</h3>
              <button onClick={() => setIsUsageOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleUsageSubmit} className="space-y-4">
               <div className="p-4 bg-purple-50 rounded-xl text-sm text-purple-800 mb-4">
                 This increases engine hours and <strong>burns 5% fuel per hour</strong>.
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Hours Worked Today</label>
                  <input required autoFocus type="number" placeholder="e.g. 4" className="w-full px-4 py-3 border rounded-xl font-bold text-lg" value={usageHours} onChange={e=>setUsageHours(e.target.value)} />
               </div>
               <button type="submit" className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700">Save Work Log</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. CHECKOUT MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Check Out Asset</h3>
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                 <input type="text" placeholder="Assignee Name" required className="w-full p-3 border rounded-xl" value={checkoutForm.assignee} onChange={e => setCheckoutForm({...checkoutForm, assignee: e.target.value})} />
                 <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl">Confirm</button>
                 <button type="button" onClick={() => setCheckoutOpen(false)} className="w-full py-3 text-gray-500 font-bold">Cancel</button>
              </form>
           </div>
        </div>
      )}

      {/* 4. SERVICE MODAL */}
      {isServiceOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
           <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
              <h3 className="font-bold text-lg mb-4">Log Maintenance</h3>
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                 <input type="text" placeholder="Service Type" required className="w-full p-3 border rounded-xl" value={serviceForm.type} onChange={e => setServiceForm({...serviceForm, type: e.target.value})} />
                 <input type="number" placeholder="Cost" required className="w-full p-3 border rounded-xl" value={serviceForm.cost} onChange={e => setServiceForm({...serviceForm, cost: e.target.value})} />
                 <button type="submit" className="w-full py-3 bg-amber-500 text-white font-bold rounded-xl">Save Log</button>
                 <button type="button" onClick={() => setServiceOpen(false)} className="w-full py-3 text-gray-500 font-bold">Cancel</button>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default AssetDetail;