import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  ArrowLeft, Tractor, Calendar, Clock, 
  User, CheckCircle, AlertTriangle, 
  Wrench, RotateCcw, ArrowRightLeft, Trash2, Battery,
  X, DollarSign, Clipboard, Download, Fuel, Droplet, Zap, Save, Loader2
} from 'lucide-react';
import { useMachines } from '../context/MachineContext';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { machines, deleteMachine, checkOutMachine, returnMachine, logMaintenance, logFuel, logUsage } = useMachines();
  
  const machine = machines.find(m => m.id === id);

  // --- MODAL & ACTION STATES ---
  const [activeModal, setActiveModal] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FORM STATES ---
  const [forms, setForms] = useState({
    checkout: { assignee: '', department: 'Operations', duration: '1' },
    service: { type: 'Routine Maintenance', cost: '', technician: '', note: '', date: new Date().toISOString().split('T')[0] },
    fuel: { liters: '', cost: '', date: new Date().toISOString().split('T')[0], vendor: 'Coop Station' },
    usage: ''
  });

  if (!machine) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="text-slate-500 font-bold">Locating Asset Data...</p>
    </div>
  );

  // --- CALCULATED VALUES ---
  const isAssigned = machine.assignment?.isAssigned;
  const isMaintenanceDue = machine.usage?.currentHours >= machine.usage?.serviceInterval;
  
  const lifetimeCost = useMemo(() => {
    const serviceTotal = (machine.history || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    const fuelTotal = (machine.fuelLogs || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    return serviceTotal + fuelTotal;
  }, [machine]);

  // --- HANDLERS ---
  const handleAction = async (actionType, payload) => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 500));
    
    switch(actionType) {
      case 'fuel': logFuel(machine.id, payload); break;
      case 'usage': logUsage(machine.id, payload); break;
      case 'checkout': checkOutMachine(machine.id, payload.assignee, parseInt(payload.duration)); break;
      case 'service': logMaintenance(machine.id, payload); break;
      case 'return': returnMachine(machine.id); break;
      case 'delete': await deleteMachine(machine.id); navigate('/assets'); return;
    }
    
    setIsSubmitting(false);
    setActiveModal(null);
  };

  // --- PDF GENERATORS ---
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235); doc.rect(0, 0, 220, 40, 'F'); 
    doc.setTextColor(255, 255, 255); doc.setFontSize(22); doc.text("Koresha-Neza Maintenance Report", 14, 25);
    doc.setTextColor(0, 0, 0); doc.setFontSize(14); doc.text(`Asset: ${machine.name} | Serial: ${machine.specs?.serialNumber}`, 14, 55);
    
    const tableColumn = ["Date", "Type", "Cost", "Notes"];
    const tableRows = (machine.history || []).map(log => [log.date, log.type, `$${log.cost}`, log.note]);
    autoTable(doc, { startY: 70, head: [tableColumn], body: tableRows, theme: 'striped' });
    doc.save(`${machine.name}_Audit_Log.pdf`);
  };

  // REFINED FUEL PDF GENERATOR FOR COMPANY AUDITS
  const generateFuelPDF = () => {
    const doc = new jsPDF();
    const fuelTotal = (machine.fuelLogs || []).reduce((acc, curr) => acc + (Number(curr.cost) || 0), 0);
    const totalLiters = (machine.fuelLogs || []).reduce((acc, curr) => acc + (Number(curr.liters) || 0), 0);

    // Header Background
    doc.setFillColor(16, 185, 129); doc.rect(0, 0, 220, 45, 'F'); 
    
    // Company Branding
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24); doc.text("KORESHA NEZA", 14, 25);
    doc.setFontSize(10); doc.text("AGRICULTURAL ASSET MANAGEMENT SYSTEM", 14, 32);
    doc.text(`REPORT GEN DATE: ${new Date().toLocaleDateString()}`, 140, 25);

    // Asset Summary Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14); doc.text("FUEL CONSUMPTION AUDIT", 14, 60);
    doc.setFontSize(10);
    doc.text(`Asset Name: ${machine.name}`, 14, 70);
    doc.text(`Serial Number: ${machine.specs?.serialNumber || 'N/A'}`, 14, 75);
    doc.text(`Current Engine Hours: ${machine.usage?.currentHours || 0}h`, 14, 80);
    
    // Financial Summary Box
    doc.setFillColor(248, 250, 252); doc.rect(130, 62, 65, 22, 'F');
    doc.text(`Total Liters: ${totalLiters} L`, 135, 70);
    doc.setFontSize(11); doc.setFont(undefined, 'bold');
    doc.text(`Total Cost: $${fuelTotal.toLocaleString()}`, 135, 80);
    doc.setFont(undefined, 'normal');

    const tableColumn = ["Date", "Liters", "Cost per Fill", "Vendor / Station"];
    const tableRows = (machine.fuelLogs || []).map(log => [
        log.date, 
        `${log.liters} L`, 
        `$${log.cost}`, 
        log.vendor || 'N/A'
    ]);
    
    autoTable(doc, { 
        startY: 90, 
        head: [tableColumn], 
        body: tableRows, 
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        foot: [['TOTALS', `${totalLiters} L`, `$${fuelTotal}`, '']],
        footStyles: { fillColor: [240, 253, 244], textColor: [0, 0, 0], fontStyle: 'bold' }
    });

    // Signatures
    const finalY = doc.lastAutoTable.finalY + 30;
    doc.line(14, finalY, 70, finalY); doc.text("Manager Signature", 14, finalY + 5);
    doc.line(130, finalY, 190, finalY); doc.text("Operator Signature", 130, finalY + 5);

    doc.save(`FUEL_REPORT_${machine.name}_${new Date().getTime()}.pdf`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-32">
      
      {/* 1. TOP NAVIGATION */}
      <div className="flex items-center justify-between">
        <Link to="/assets" className="group flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold transition-all">
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-all"><ArrowLeft size={20} /></div>
          Back to Assets
        </Link>
        <button 
          onClick={() => setActiveModal('delete')}
          className="flex items-center gap-2 px-6 py-2.5 text-red-600 bg-white hover:bg-red-50 border border-red-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-sm"
        >
          <Trash2 size={16} /> Decommission Asset
        </button>
      </div>

      {/* 2. MAIN ASSET HERO */}
      <div className="bg-white rounded-[2.5rem] p-4 lg:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Machine Image & Status */}
        <div className="relative h-80 lg:h-full min-h-[350px] bg-slate-100 rounded-[2rem] overflow-hidden shadow-inner border border-slate-100">
            <img src={machine.image || "https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=600"} alt={machine.name} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              <div className={`backdrop-blur-xl px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl border border-white/20 flex items-center gap-2 ${isAssigned ? "bg-blue-600/80 text-white" : "bg-emerald-500/80 text-white"}`}>
                {isAssigned ? <><User size={14} /> Assigned</> : <><CheckCircle size={14} /> Available</>}
              </div>
              {isMaintenanceDue && (
                <div className="bg-red-500/90 backdrop-blur-xl text-white px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl border border-white/20 flex items-center gap-2 animate-pulse">
                  <AlertTriangle size={14} /> Service Overdue
                </div>
              )}
            </div>
        </div>

        {/* Info & Core Actions */}
        <div className="lg:col-span-2 flex flex-col justify-between py-2">
          <div>
            <div className="flex justify-between items-center mb-2">
               <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{machine.type} • S/N: {machine.specs?.serialNumber}</span>
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-8">{machine.name}</h1>
            
            {/* Real-time KPI Stats - FIXED SIZES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all flex flex-col justify-between">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-3">Fuel Status</p>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-xl ${machine.fuel < 20 ? "bg-red-100 text-red-600" : "bg-emerald-100 text-emerald-600"}`}>
                    <Battery size={18} />
                  </div>
                  <span className="text-lg font-black text-slate-800 leading-none">{Math.round(machine.fuel)}%</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-3">Total Hours</p>
                <div className="flex items-center gap-2 text-lg font-black text-slate-800 leading-none">
                  <div className="p-1.5 bg-blue-100 text-blue-600 rounded-xl"><Clock size={18} /></div>
                  {machine.usage?.currentHours || 0}h
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-3">Health</p>
                <div className="flex items-center gap-2 text-lg font-black text-slate-800 leading-none">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${machine.status === 'Healthy' ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"}`}>
                    <Zap size={18} />
                  </div>
                  {machine.status}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col justify-between">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-3">Investment</p>
                <div className="flex items-center gap-1 text-lg font-black text-slate-800 leading-none truncate">
                  <DollarSign size={14} className="text-slate-300" /> 
                  {lifetimeCost.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Functional Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12">
            <button onClick={() => setActiveModal('usage')} className="flex flex-col items-center gap-2 p-4 bg-purple-50 text-purple-700 rounded-3xl hover:bg-purple-100 transition-all font-bold text-xs border border-purple-100 active:scale-95">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><Clock size={24} /></div> Log Work
            </button>

            <button onClick={() => setActiveModal('fuel')} className="flex flex-col items-center gap-2 p-4 bg-emerald-50 text-emerald-700 rounded-3xl hover:bg-emerald-100 transition-all font-bold text-xs border border-emerald-100 active:scale-95">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><Fuel size={24} /></div> Refuel
            </button>
            
            <button onClick={() => setActiveModal('service')} className="flex flex-col items-center gap-2 p-4 bg-amber-50 text-amber-700 rounded-3xl hover:bg-amber-100 transition-all font-bold text-xs border border-amber-100 active:scale-95">
              <div className="p-3 bg-white rounded-2xl shadow-sm"><Wrench size={24} /></div> Service
            </button>
            
            {isAssigned ? (
              <button onClick={() => handleAction('return')} className="flex flex-col items-center gap-2 p-4 bg-slate-900 text-white rounded-3xl hover:bg-black transition-all font-bold text-xs border border-slate-800 active:scale-95 shadow-xl shadow-slate-200">
                <div className="p-3 bg-slate-800 rounded-2xl shadow-sm"><RotateCcw size={24} /></div> Return
              </button>
            ) : (
              <button onClick={() => setActiveModal('checkout')} className="flex flex-col items-center gap-2 p-4 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition-all font-bold text-xs border border-blue-500 active:scale-95 shadow-xl shadow-blue-200">
                <div className="p-3 bg-blue-500 rounded-2xl shadow-sm"><ArrowRightLeft size={24} /></div> Checkout
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. HISTORY TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Service History */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex justify-between items-center mb-8">
             <h3 className="font-black text-xl text-slate-800 flex items-center gap-3"><Clipboard size={22} className="text-blue-500" /> Maintenance Audit</h3>
             <button onClick={generatePDF} className="group flex items-center gap-2 bg-slate-50 hover:bg-blue-600 hover:text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                <Download size={14} /> Download PDF
             </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {machine.history?.length > 0 ? [...machine.history].reverse().map((log, i) => (
               <div key={i} className="flex items-center gap-5 p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="bg-white p-3 rounded-xl text-amber-500 shadow-sm"><Wrench size={18} /></div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-sm tracking-tight">{log.type}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{log.date} • {log.technician || 'Internal'}</p>
                  </div>
                  <div className="font-black text-sm text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-100">${log.cost}</div>
               </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <Clipboard size={48} className="mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No service records found</p>
              </div>
            )}
          </div>
        </div>

        {/* Fuel Logs - ADDED PDF DOWNLOAD BUTTON */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-black text-xl text-slate-800 flex items-center gap-3"><Droplet size={22} className="text-emerald-500" /> Fuel Analytics</h3>
            <button onClick={generateFuelPDF} className="group flex items-center gap-2 bg-slate-50 hover:bg-emerald-600 hover:text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
              <Download size={14} /> Download PDF
            </button>
          </div>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {machine.fuelLogs?.length > 0 ? [...machine.fuelLogs].reverse().map((log, i) => (
               <div key={i} className="flex items-center gap-5 p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="bg-white p-3 rounded-xl text-emerald-500 shadow-sm"><Fuel size={18} /></div>
                  <div className="flex-1">
                    <p className="font-black text-slate-800 text-sm tracking-tight">{log.liters} Liters Injected</p>
                    <p className="text-[10px] text-emerald-600/60 font-bold uppercase mt-0.5">{log.date} • {log.vendor}</p>
                  </div>
                  <div className="font-black text-sm text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-100">${log.cost}</div>
               </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <Fuel size={48} className="mb-4 opacity-20" />
                <p className="text-xs font-bold uppercase tracking-widest">No refueling records</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- REUSABLE MODERN MODALS --- */}
      {activeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setActiveModal(null)} />
          
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 pb-0 flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                {activeModal === 'fuel' && <><Fuel className="text-emerald-500" /> Refuel Asset</>}
                {activeModal === 'usage' && <><Clock className="text-purple-500" /> Daily Log</>}
                {activeModal === 'service' && <><Wrench className="text-amber-500" /> Maintenance</>}
                {activeModal === 'checkout' && <><ArrowRightLeft className="text-blue-500" /> Assignment</>}
                {activeModal === 'delete' && <><AlertTriangle className="text-red-500" /> Confirm Delete</>}
              </h3>
              <button onClick={() => setActiveModal(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"><X size={20} /></button>
            </div>

            <div className="p-8">
              {/* MODAL CONTENT SWITCHER */}
              {activeModal === 'fuel' && (
                <form onSubmit={(e) => { e.preventDefault(); handleAction('fuel', forms.fuel); }} className="space-y-4">
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Volume (Liters)</label>
                     <input required type="number" step="0.1" className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold" value={forms.fuel.liters} onChange={e=>setForms({...forms, fuel: {...forms.fuel, liters: e.target.value}})} />
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Total Cost ($)</label>
                     <input required type="number" className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white outline-none transition-all font-bold" value={forms.fuel.cost} onChange={e=>setForms({...forms, fuel: {...forms.fuel, cost: e.target.value}})} />
                   </div>
                   <button disabled={isSubmitting} className="w-full py-4 bg-emerald-600 text-white font-black rounded-2xl mt-4 hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                     {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Authorize Transaction"}
                   </button>
                </form>
              )}

              {activeModal === 'usage' && (
                <form onSubmit={(e) => { e.preventDefault(); handleAction('usage', forms.usage); }} className="space-y-6">
                   <div className="p-5 bg-purple-50 rounded-3xl text-xs font-medium text-purple-700 flex gap-3 border border-purple-100 leading-relaxed">
                     <Zap size={24} className="shrink-0" />
                     Logging work increases machine age and automatically calculates 15% fuel burn rate per hour of operation.
                   </div>
                   <div className="space-y-1">
                     <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Engine Hours Worked</label>
                     <input required autoFocus type="number" step="0.5" className="w-full px-6 py-5 bg-slate-50 rounded-[1.5rem] border-2 border-transparent focus:border-purple-500 focus:bg-white outline-none transition-all text-2xl font-black text-center" value={forms.usage} onChange={e=>setForms({...forms, usage: e.target.value})} />
                   </div>
                   <button disabled={isSubmitting} className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 shadow-lg shadow-purple-100">
                     {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : "Confirm & Update Fleet"}
                   </button>
                </form>
              )}

              {activeModal === 'checkout' && (
                <form onSubmit={(e) => { e.preventDefault(); handleAction('checkout', forms.checkout); }} className="space-y-4">
                   <input type="text" placeholder="Operator / Driver Name" required className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none transition-all font-bold" value={forms.checkout.assignee} onChange={e => setForms({...forms, checkout: {...forms.checkout, assignee: e.target.value}})} />
                   <select className="w-full px-5 py-3.5 bg-slate-50 rounded-2xl border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold" value={forms.checkout.department} onChange={e => setForms({...forms, checkout: {...forms.checkout, department: e.target.value}})}>
                     <option>Operations</option>
                     <option>Maintenance</option>
                     <option>External Lease</option>
                   </select>
                   <button disabled={isSubmitting} className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl mt-4 hover:bg-blue-700 shadow-lg shadow-blue-100">
                     Deploy Machine
                   </button>
                </form>
              )}

              {activeModal === 'delete' && (
                <div className="space-y-6">
                  <div className="p-6 bg-red-50 rounded-3xl border border-red-100 text-red-600 text-sm font-medium leading-relaxed">
                    <strong>CRITICAL ACTION:</strong> This will permanently erase this asset and all its maintenance history from the Koresha Neza servers. This cannot be undone.
                  </div>
                  <div className="flex gap-4">
                    <button onClick={() => setActiveModal(null)} className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200">Cancel</button>
                    <button onClick={() => handleAction('delete')} className="flex-1 py-4 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 shadow-xl shadow-red-200">Confirm Erase</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetDetail;