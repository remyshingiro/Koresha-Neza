import React, { useState, useEffect } from 'react';
import { X, Tractor, Save, AlertCircle, CheckCircle2, Loader2, Gauge } from 'lucide-react';

const AddMachineModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Tractor',
    initialHours: 0 // Missing critical field: Every machine needs a starting point
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // 1. IMPROVED: Auto-focus the input when modal opens
  const inputRef = React.useRef(null);
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 2. STRENGTHENED: Form Validation
    if (formData.name.trim().length < 3) {
      setError('Machine name must be at least 3 characters.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate a small network delay for a "Strong" feel
    await new Promise(resolve => setTimeout(resolve, 600));

    onSave({
      ...formData,
      id: Date.now(), // Generate unique ID
      status: 'Active',
      fuel: 100, // Default for new machines
      lastService: new Date().toLocaleDateString()
    });

    setIsSubmitting(false);
    setFormData({ name: '', type: 'Tractor', initialHours: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* 3. OPTIMIZED: Modern Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-slate-100 animate-in zoom-in-95 fade-in duration-200">
        
        {/* Header with Visual Status */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
                <Tractor size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Register Asset</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Add to Koresha Neza Fleet</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-400">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 4. FORM: Clean, Spaced, and Error-Ready */}
        <form onSubmit={handleSubmit} className="p-8 pt-4 space-y-6">
          
          {error && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-2 text-red-600 text-xs font-bold animate-shake">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 ml-1">MACHINE NAME / SERIAL NUMBER</label>
            <input 
              ref={inputRef}
              required
              type="text" 
              placeholder="e.g. Massey Ferguson 375"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">CATEGORY</label>
              <select 
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium appearance-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option value="Tractor">🚜 Tractor</option>
                <option value="Harvester">🌾 Harvester</option>
                <option value="Truck">🚚 Truck</option>
                <option value="Generator">⚡ Generator</option>
              </select>
            </div>

            {/* 5. ADDED FEATURE: Current Meter Reading */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">ENGINE HOURS</label>
              <div className="relative">
                <input 
                  type="number" 
                  min="0"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white outline-none transition-all text-sm font-medium pr-10"
                  value={formData.initialHours}
                  onChange={(e) => setFormData({...formData, initialHours: e.target.value})}
                />
                <Gauge className="absolute right-4 top-4 text-slate-300" size={18} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-3">
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> Confirm Registration</>}
            </button>
            <button 
              type="button" 
              onClick={onClose}
              className="w-full py-3 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
            >
              Discard Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMachineModal;