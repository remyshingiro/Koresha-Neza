import React from 'react';
import { X, CheckCircle } from 'lucide-react';

const ReturnModal = ({ machine, onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 text-center">
        
        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} />
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">Return {machine.name}?</h2>
        <p className="text-gray-500 text-sm mb-6">
          Confirm that the machine has been returned to the station and inspected for damage.
        </p>

        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200">
            Confirm Return
          </button>
        </div>

      </div>
    </div>
  );
};

export default ReturnModal;