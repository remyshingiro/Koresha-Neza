import React from 'react';

const AssetCard = ({ machine }) => {
  const isHealthy = machine.status === "Healthy";
  const badgeColor = isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  
  // Calculate progress
  const healthPercentage = Math.min((machine.usage.currentHours / machine.usage.serviceInterval) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative group">
      
      {/* Image Section */}
      <div className="h-48 overflow-hidden bg-gray-200">
        <img 
          src={machine.image} 
          alt={machine.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
            {machine.name}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
            {machine.status}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
           <p className="text-gray-500 text-sm">{machine.type}</p>
           {/* NEW: Show if currently rented out */}
           {machine.assignment?.isAssigned && (
             <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-100">
               In Use: {machine.assignment.assignedTo.split(' ')[0]}
             </span>
           )}
        </div>

        {/* The Health Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-1">
          <div 
            className={`h-2.5 rounded-full ${isHealthy ? 'bg-blue-600' : 'bg-red-500'}`} 
            style={{ width: `${healthPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>{machine.usage.currentHours} hours used</span>
          <span>Target: {machine.usage.serviceInterval}h</span>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;