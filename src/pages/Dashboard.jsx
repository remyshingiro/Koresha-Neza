import React from 'react';
// 1. FIXED IMPORTS: Added 'Tractor' and others
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Tractor } from 'lucide-react';
// 2. CONNECTED TO BRAIN: Using the Context Hook instead of static file
import { useMachines } from '../context/MachineContext';

const Dashboard = () => {
  // 3. GET LIVE DATA
  const { machines } = useMachines();

  // 4. CALCULATE REAL-TIME STATS
  const totalAssets = machines.length;
  const needsRepair = machines.filter(m => m.status === 'Needs Repair').length;
  const inUse = machines.filter(m => m.assignment?.isAssigned).length;
  const healthy = totalAssets - needsRepair;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* HERO SECTION */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
        <h1 className="text-3xl font-bold mb-2">Good Morning, Manager Jean! ☀️</h1>
        <p className="text-blue-100 max-w-xl text-lg opacity-90">
          Your cooperative is operating at <span className="font-bold text-white">85% efficiency</span> today. 
          You have {needsRepair} urgent issues to attend to.
        </p>
        <div className="mt-8 flex gap-4">
           <button className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors shadow-lg">
             View Alerts
           </button>
           <button className="bg-blue-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors border border-blue-600">
             Generate Report
           </button>
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Assets" 
          value={totalAssets} 
          icon={Tractor} 
          color="bg-blue-50 text-blue-600" 
        />
        <StatCard 
          title="In Operation" 
          value={inUse} 
          icon={Clock} 
          color="bg-purple-50 text-purple-600" 
        />
        <StatCard 
          title="Healthy" 
          value={healthy} 
          icon={CheckCircle} 
          color="bg-green-50 text-green-600" 
        />
        <StatCard 
          title="Critical Issues" 
          value={needsRepair} 
          icon={AlertTriangle} 
          color="bg-red-50 text-red-600" 
          isAlert={needsRepair > 0}
        />
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4 text-lg">Live Activity Feed</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
             <div className="w-2 h-2 rounded-full bg-green-500"></div>
             <p className="text-gray-600 text-sm">
               <span className="font-bold text-gray-900">Jean Paul</span> checked out <span className="font-bold">Tractor #1</span>.
             </p>
             <span className="ml-auto text-xs text-gray-400">2 mins ago</span>
          </div>
          <div className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer">
             <div className="w-2 h-2 rounded-full bg-red-500"></div>
             <p className="text-gray-600 text-sm">
               <span className="font-bold text-gray-900">System</span> flagged <span className="font-bold">Coffee Pulper</span> for maintenance.
             </p>
             <span className="ml-auto text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>

    </div>
  );
};

// Internal Component for the Stats Cards
const StatCard = ({ title, value, icon: Icon, color, isAlert }) => (
  <div className={`bg-white p-6 rounded-2xl border transition-all hover:shadow-md ${isAlert ? 'border-red-200 ring-2 ring-red-50' : 'border-gray-100'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon size={24} />
      </div>
      {isAlert && <span className="flex h-3 w-3 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
      </span>}
    </div>
    <p className="text-gray-500 text-sm font-medium">{title}</p>
    <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
  </div>
);

export default Dashboard;