import React from 'react';

const AssetCard = ({ machine }) => {
  // Simple logic to choose color based on status
  const isHealthy = machine.status === "Healthy";
  const badgeColor = isHealthy ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  
  // Calculate progress bar width (e.g., 185 / 200 = 92%)
  const healthPercentage = Math.min((machine.usage.currentHours / machine.usage.serviceInterval) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Section */}
      <div className="h-48 overflow-hidden">
        <img 
          src={machine.image} 
          alt={machine.name} 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{machine.name}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeColor}`}>
            {machine.status}
          </span>
        </div>

        <p className="text-gray-500 text-sm mb-4">{machine.type}</p>

        {/* The Health Bar (Visualizing the data) */}
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