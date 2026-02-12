import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Battery, AlertTriangle, Clock, User, CheckCircle } from 'lucide-react';

const AssetCard = ({ machine }) => {
  // Determine Status Logic
  const isAssigned = machine.assignment?.isAssigned;
  const isMaintenance = machine.status !== 'Healthy';
  const isServiceDue = machine.usage?.currentHours >= machine.usage?.serviceInterval;
  
  let statusColor = 'bg-green-100 text-green-700';
  let statusText = 'Available';

  if (isMaintenance) {
    statusColor = 'bg-red-100 text-red-700';
    statusText = 'Maintenance';
  } else if (isAssigned) {
    statusColor = 'bg-blue-100 text-blue-700';
    statusText = 'In Use';
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
      <Link to={`/assets/${machine.id}`} className="flex flex-col h-full">
        
        {/* IMAGE SECTION (Top Half) */}
        <div className="h-48 w-full bg-gray-100 relative overflow-hidden">
          {machine.image ? (
            <img 
              src={machine.image} 
              alt={machine.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none'; // Hide broken image
                e.target.nextSibling.style.display = 'flex'; // Show fallback
              }}
            />
          ) : null}
          
          {/* Fallback Icon (Shows if no image or image breaks) */}
          <div className={`absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-300 ${machine.image ? 'hidden' : 'flex'}`}>
            <Tractor size={64} opacity={0.5} />
          </div>

          {/* Status Badge (Overlaid on Image) */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm backdrop-blur-md ${statusColor}`}>
            {statusText}
          </div>
        </div>
        
        {/* CONTENT SECTION (Bottom Half) */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{machine.name}</h3>
          <p className="text-sm text-gray-500 mb-4">{machine.type}</p>
          
          <div className="mt-auto space-y-3 pt-4 border-t border-gray-100">
            
            {/* Assigned User */}
            {isAssigned ? (
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded-lg">
                <User size={16} />
                <span className="truncate">{machine.assignment.assignedTo}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-gray-400 p-2">
                <CheckCircle size={16} />
                <span>Ready for dispatch</span>
              </div>
            )}

            <div className="flex justify-between items-center text-sm text-gray-600">
              {/* Fuel */}
              <div className="flex items-center gap-1.5 font-medium">
                <Battery size={16} className={machine.fuel < 20 ? "text-red-500" : "text-emerald-500"} />
                <span>{machine.fuel}%</span>
              </div>

              {/* Service Hours */}
              <div className="flex items-center gap-1.5">
                {isServiceDue ? (
                  <span className="flex items-center gap-1 text-red-600 font-bold animate-pulse">
                    <AlertTriangle size={16} /> Due
                  </span>
                ) : (
                  <span className="flex items-center gap-1 font-medium">
                    <Clock size={16} className="text-blue-500" /> {machine.usage?.currentHours || 0}h
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

      </Link>
    </div>
  );
};

export default AssetCard;