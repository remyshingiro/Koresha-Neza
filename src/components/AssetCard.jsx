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
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative">
      <Link to={`/assets/${machine.id}`} className="block">
        
        {/* Top Row: Icon & Status */}
        <div className="flex justify-between items-start mb-4">
          <div className="bg-blue-50 p-3 rounded-xl text-blue-600 group-hover:scale-110 transition-transform">
            <Tractor size={24} />
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${statusColor}`}>
            {statusText}
          </div>
        </div>
        
        {/* Machine Info */}
        <h3 className="text-lg font-bold text-gray-900 mb-1">{machine.name}</h3>
        <p className="text-sm text-gray-500 mb-4">{machine.type}</p>
        
        {/* Assignment / Usage Info */}
        <div className="space-y-3 pt-4 border-t border-gray-100">
          
          {/* Assigned User (If active) */}
          {isAssigned ? (
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 p-2 rounded-lg">
              <User size={16} />
              <span>{machine.assignment.assignedTo}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-400 p-2">
              <CheckCircle size={16} />
              <span>Ready for dispatch</span>
            </div>
          )}

          <div className="flex justify-between items-center text-sm text-gray-600 mt-2">
            {/* Fuel */}
            <div className="flex items-center gap-1.5">
              <Battery size={16} className={machine.fuel < 20 ? "text-red-500" : "text-green-500"} />
              <span>{machine.fuel}%</span>
            </div>

            {/* Service Hours */}
            <div className="flex items-center gap-1.5">
              {isServiceDue ? (
                <span className="flex items-center gap-1 text-red-600 font-bold animate-pulse">
                  <AlertTriangle size={16} /> Due
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock size={16} /> {machine.usage?.currentHours || 0}h
                </span>
              )}
            </div>
          </div>
        </div>

      </Link>
    </div>
  );
};

export default AssetCard;