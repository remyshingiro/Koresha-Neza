import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertTriangle, CheckCircle, User } from 'lucide-react';

const AssetCard = ({ machine }) => {
  const isHealthy = machine.status === 'Healthy';
  
  // Calculate progress for the service bar (cap it at 100%)
  const percentage = Math.min((machine.usage.currentHours / machine.usage.serviceInterval) * 100, 100);

  return (
    // 1. THIS LINK MAKES THE CARD CLICKABLE
    <Link to={`/assets/${machine.id}`} className="block group">
      
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">
        
        {/* Image Area */}
        <div className="h-48 overflow-hidden relative bg-gray-100">
           <img 
             src={machine.image || 'https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=600&q=80'} 
             alt={machine.name} 
             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
           />
           <div className="absolute top-3 right-3">
             <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${
               isHealthy ? 'bg-white/90 text-green-700' : 'bg-red-500 text-white'
             }`}>
               {machine.status}
             </span>
           </div>
        </div>

        {/* Content Area */}
        <div className="p-5 flex-1 flex flex-col">
           <div className="flex justify-between items-start mb-1">
             <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
               {machine.name}
             </h3>
           </div>
           
           <p className="text-gray-500 text-sm mb-4">{machine.type}</p>

           {/* Service Progress Bar */}
           <div className="space-y-2 mt-auto">
             <div className="flex justify-between text-xs font-medium text-gray-500">
               <span>Service Health</span>
               <span className={isHealthy ? 'text-green-600' : 'text-red-500'}>
                 {machine.usage.currentHours}h / {machine.usage.serviceInterval}h
               </span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
               <div 
                 className={`h-full rounded-full ${isHealthy ? 'bg-blue-500' : 'bg-red-500'}`} 
                 style={{ width: `${percentage}%` }}
               ></div>
             </div>
           </div>

           {/* Assignment Status (Footer) */}
           {machine.assignment?.isAssigned ? (
             <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/50 p-2 rounded-lg">
               <User size={14} />
               <span>In Use: {machine.assignment.assignedTo}</span>
             </div>
           ) : (
             <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-2 text-xs font-medium text-gray-400 p-2">
               <CheckCircle size={14} />
               <span>Available for checkout</span>
             </div>
           )}
        </div>
      </div>
    </Link>
  );
};

export default AssetCard;