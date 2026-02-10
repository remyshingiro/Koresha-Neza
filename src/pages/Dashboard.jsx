import React from 'react';
import { Users, Tractor, Clock, AlertTriangle, ArrowRight, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMachines } from '../context/MachineContext';

const Dashboard = () => {
  const { machines, members, loading } = useMachines();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate Real Stats
  const totalAssets = machines.length;
  const assignedAssets = machines.filter(m => m.assignment?.isAssigned).length;
  const availableAssets = totalAssets - assignedAssets;
  const activeStaff = members.length;
  const maintenanceNeeded = machines.filter(m => m.usage?.currentHours > 250).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Koresha Neza</h1>
          <p className="text-gray-500 mt-2">Cooperative Overview & Analytics</p>
        </div>
        <div className="hidden md:block">
          <p className="text-green-600 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Tractor size={24} /></div>
            <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">Total</span>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{totalAssets}</h3>
          <p className="text-gray-500 text-sm">Assets</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Clock size={24} /></div>
            <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-lg">Active</span>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{assignedAssets}</h3>
          <p className="text-gray-500 text-sm">In Use</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Users size={24} /></div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{activeStaff}</h3>
          <p className="text-gray-500 text-sm">Staff</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${maintenanceNeeded > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <AlertTriangle size={24} />
            </div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{maintenanceNeeded}</h3>
          <p className="text-gray-500 text-sm">Alerts</p>
        </div>
      </div>

      {/* Main Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center min-h-[250px]">
          <div className="absolute top-0 right-0 p-8 opacity-10"><Tractor size={200} /></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Manage Fleet</h3>
            <p className="text-blue-100 mb-8 max-w-md">Assign tractors to farmers, log maintenance, and track fuel efficiency.</p>
            <div className="flex flex-wrap gap-4">
              <Link to="/assets" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-2">
                View All Assets <ArrowRight size={18} />
              </Link>
              <Link to="/team" className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors flex items-center gap-2">
                Add Staff <Users size={18} />
              </Link>
            </div>
          </div>
        </div>

        {/* Availability Chart */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col items-center justify-center">
          <h3 className="font-bold text-gray-900 mb-6 w-full text-left flex items-center gap-2">
            <Activity size={20} className="text-blue-600" /> Availability
          </h3>
          <div className="relative w-40 h-40">
             <svg className="w-full h-full transform -rotate-90">
               <circle cx="80" cy="80" r="70" stroke="#f3f4f6" strokeWidth="20" fill="transparent" />
               <circle 
                 cx="80" cy="80" r="70" stroke="#2563eb" strokeWidth="20" fill="transparent" 
                 strokeDasharray={440}
                 strokeDashoffset={440 - (440 * (availableAssets / (totalAssets || 1)))} 
                 strokeLinecap="round"
               />
             </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
               <span className="text-3xl font-bold text-gray-900">{availableAssets}</span>
               <span className="text-xs text-gray-500 uppercase font-bold">Free</span>
             </div>
          </div>
          <p className="text-sm text-gray-500 mt-6 text-center">
            <span className="font-bold text-gray-900">{assignedAssets}</span> machines deployed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;