import React from 'react';
import { Link } from 'react-router-dom';
import { Tractor, Battery, AlertTriangle, Clock, User, CheckCircle } from 'lucide-react';

const AssetCard = ({ machine }) => {
  // Determine Status Logic
  const isAssigned = machine.assignment?.isAssigned;
  const isMaintenance = machine.status !== 'Healthy';
  const isServiceDue = machine.usage?.currentHours >= machine.usage?.serviceInterval;
  
  let statusColor = 'bg-emerald-50 text-emerald-600 border-emerald-100';
  let statusText = 'Available';

  if (isMaintenance) {
    statusColor = 'bg-red-50 text-red-600 border-red-100';
    statusText = 'Maintenance';
  } else if (isAssigned) {
    statusColor = 'bg-blue-50 text-blue-600 border-blue-100';
    statusText = 'In Use';
  }

  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden flex flex-col h-full">
      <Link to={`/assets/${machine.id}`} className="flex flex-col h-full">
        
        {/* IMAGE SECTION */}
        <div className="h-44 w-full bg-slate-50 relative overflow-hidden">
          {machine.image ? (
            <img 
              src={machine.image} 
              alt={machine.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              onError={(e) => {
                e.target.onerror = null; 
                e.target.style.display = 'none'; 
                e.target.nextSibling.style.display = 'flex'; 
              }}
            />
          ) : null}
          
          {/* Fallback Icon */}
          <div className={`absolute inset-0 flex items-center justify-center bg-slate-50 text-slate-200 ${machine.image ? 'hidden' : 'flex'}`}>
            <Tractor size={48} strokeWidth={1.5} />
          </div>

          {/* Status Badge - Refined Typography */}
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm border backdrop-blur-md ${statusColor}`}>
            {statusText}
          </div>
        </div>
        
        {/* CONTENT SECTION */}
        <div className="p-5 flex flex-col flex-1">
          <div>
            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest block mb-1">{machine.type}</span>
            <h3 className="text-base font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">{machine.name}</h3>
          </div>
          
          <div className="mt-auto space-y-3 pt-4">
            
            {/* Assignment Status - Refined Typography */}
            {isAssigned ? (
              <div className="flex items-center gap-2 text-[10px] text-blue-600 font-black uppercase tracking-tight bg-blue-50/50 p-2.5 rounded-xl border border-blue-50">
                <User size={14} strokeWidth={2.5} />
                <span className="truncate">{machine.assignment.assignedTo}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight p-2.5">
                <CheckCircle size={14} />
                <span>Ready for dispatch</span>
              </div>
            )}

            {/* KPI Row - Refined Font Sizes */}
            <div className="flex justify-between items-center px-1">
              {/* Fuel */}
              <div className="flex items-center gap-1.5">
                <Battery size={14} className={machine.fuel < 20 ? "text-red-500" : "text-emerald-500"} />
                <span className="text-xs font-black text-slate-700">{Math.round(machine.fuel)}%</span>
              </div>

              {/* Service Hours */}
              <div className="flex items-center gap-1.5">
                {isServiceDue ? (
                  <span className="flex items-center gap-1 text-red-600 text-[10px] font-black uppercase tracking-tighter animate-pulse">
                    <AlertTriangle size={14} /> Service Due
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-black text-slate-700">
                    <Clock size={14} className="text-blue-500" /> {machine.usage?.currentHours || 0}h
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