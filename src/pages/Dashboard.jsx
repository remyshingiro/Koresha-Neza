import React, { useState } from 'react';
import { 
  Users, Tractor, Clock, AlertTriangle, 
  ArrowRight, Activity, ChevronLeft, ChevronRight, Wrench, Calendar as CalIcon 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useMachines } from '../context/MachineContext';

const Dashboard = () => {
  const { machines, members, loading } = useMachines();
  const [currentDate, setCurrentDate] = useState(new Date());

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // --- CALENDAR LOGIC ---
  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const getEventsForDay = (day) => {
    return machines.filter((m) => {
      const machineDay = (m.name.length * 3) % 28 + 1; 
      return machineDay === day;
    });
  };

  // --- STATS CALCULATIONS ---
  const totalAssets = machines.length;
  const assignedAssets = machines.filter(m => m.assignment?.isAssigned).length;
  const activeStaff = members.length;
  const maintenanceNeeded = machines.filter(m => m.usage?.currentHours > 250).length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
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

      {/* Main Action Area & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Actions & Quick List */}
        <div className="space-y-8">
          {/* Action Card */}
          <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-lg shadow-blue-200">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Tractor size={200} /></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">Manage Fleet</h3>
              <p className="text-blue-100 mb-8 max-w-xs">Assign tractors, log maintenance, and track usage.</p>
              <div className="flex flex-col gap-3">
                <Link to="/assets" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-between group">
                  View Assets <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/team" className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-between">
                  Manage Staff <Users size={18} />
                </Link>
              </div>
            </div>
          </div>

           {/* Upcoming Maintenance List - NOW WITH ROBUST IMAGE FALLBACK 🖼️ */}
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Wrench size={20} className="text-amber-500" /> Maintenance Due Soon
              </h3>
              <div className="space-y-4">
                {machines.slice(0, 3).map((m, i) => (
                  <Link key={i} to={`/assets/${m.id}`} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                     {/* IMAGE DISPLAY LOGIC */}
                     <div className="w-16 h-16 rounded-xl bg-gray-200 border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 relative">
                        <img 
                          src={m.image || "https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=200&h=200&fit=crop"} 
                          alt={m.name} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=200&h=200&fit=crop"; // Fallback if image breaks
                          }}
                        />
                     </div>
                     <div>
                       <p className="font-bold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">{m.name}</p>
                       <p className="text-xs text-gray-500">Service Interval: {m.usage?.serviceInterval} hrs</p>
                       <p className="text-[10px] font-bold text-amber-600 mt-1 uppercase tracking-wide">Due in 2 days</p>
                     </div>
                  </Link>
                ))}
                {machines.length === 0 && (
                  <p className="text-gray-400 text-sm text-center py-4">No assets found.</p>
                )}
              </div>
           </div>
        </div>

        {/* Right Col: THE CALENDAR (Takes up 2/3rds) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          
          {/* Calendar Header */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalIcon className="text-blue-600" /> Service Schedule
            </h3>
            <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronLeft size={20} /></button>
              <span className="font-bold text-gray-700 w-32 text-center select-none">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronRight size={20} /></button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {day}
              </div>
            ))}
            
            {/* Empty cells for previous month */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 md:h-28 border border-gray-50 bg-gray-50/50"></div>
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

              return (
                <div key={day} className={`h-24 md:h-28 border border-gray-100 p-2 relative group hover:bg-blue-50/30 transition-colors ${isToday ? 'bg-blue-50' : ''}`}>
                  <span className={`text-sm font-bold block mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  
                  {/* Event Pills */}
                  <div className="space-y-1 overflow-y-auto max-h-[70px] custom-scrollbar">
                    {events.map((ev, k) => (
                      <div key={k} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded-md font-bold truncate flex items-center gap-1 border border-amber-200">
                        <Wrench size={8} /> {ev.name.split(' ')[0]}
                      </div>
                    ))}
                    {day === 15 && (
                       <div className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-md font-bold truncate flex items-center gap-1 border border-green-200">
                         <Activity size={8} /> Team Meeting
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 text-xs font-bold text-gray-400 mt-4">
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"></div> Maintenance</span>
            <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-400"></div> Events</span>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Dashboard;