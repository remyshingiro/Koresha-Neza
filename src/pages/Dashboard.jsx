import React, { useState } from 'react';
import { 
  Users, Tractor, Clock, AlertTriangle, 
  ArrowRight, Activity, ChevronLeft, ChevronRight, Wrench, Calendar as CalIcon, Droplet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // 1. Import
import { useMachines } from '../context/MachineContext';

const Dashboard = () => {
  const { t } = useTranslation(); // 2. Initialize
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

  // Month translation helper
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const getEventsForDay = (day) => {
    return machines.filter((m) => {
      // Simulation: Assign maintenance events to days based on ID length
      const machineDay = (m.id.length * 3) % 28 + 1; 
      return machineDay === day && (m.usage?.currentHours > 150);
    });
  };

  // --- STATS CALCULATIONS ---
  const totalAssets = machines.length;
  const assignedAssets = machines.filter(m => m.assignment?.isAssigned).length;
  const activeStaff = members.length;
  const maintenanceNeeded = machines.filter(m => m.usage?.currentHours >= m.usage?.serviceInterval || m.status === 'Broken').length;
  const fleetHealthPercent = totalAssets > 0 ? Math.round(((totalAssets - maintenanceNeeded) / totalAssets) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-500 mt-2">Koresha Neza Cooperative Overview</p>
        </div>
        <div className="hidden md:block">
          <p className="text-green-600 font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online
          </p>
        </div>
      </div>

      {/* Stats Cards - Now Translated */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Tractor size={24} /></div>
            <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">Live</span>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{totalAssets}</h3>
          <p className="text-gray-500 text-sm">{t('total_assets')}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Users size={24} /></div>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg">On Duty</span>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{activeStaff}</h3>
          <p className="text-gray-500 text-sm">{t('active_staff')}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Droplet size={24} /></div>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{assignedAssets}</h3>
          <p className="text-gray-500 text-sm">{t('in_use')}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl ${maintenanceNeeded > 0 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
              <Activity size={24} />
            </div>
            <span className="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{fleetHealthPercent}%</span>
          </div>
          <h3 className="text-4xl font-bold text-gray-900">{maintenanceNeeded}</h3>
          <p className="text-gray-500 text-sm">{t('fleet_health')}</p>
        </div>
      </div>

      {/* Main Action Area & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col: Actions & Maintenance List */}
        <div className="space-y-8">
          <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-lg shadow-blue-200">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Tractor size={200} /></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-2">{t('quick_actions')}</h3>
              <p className="text-blue-100 mb-8 max-w-xs">Efficiency tools for Cooperative management.</p>
              <div className="flex flex-col gap-3">
                <Link to="/assets" className="px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-between group">
                  {t('my_machinery')} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/team" className="px-6 py-3 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-colors flex items-center justify-between">
                  {t('operators')} <Users size={18} />
                </Link>
              </div>
            </div>
          </div>

           {/* Maintenance Warning List */}
           <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-500" /> {t('maintenance_due')}
              </h3>
              <div className="space-y-4">
                {machines.filter(m => m.usage?.currentHours >= m.usage?.serviceInterval).slice(0, 3).map((m, i) => (
                  <Link key={i} to={`/assets/${m.id}`} className="flex items-center gap-4 p-3 rounded-xl bg-red-50/50 hover:bg-red-50 transition-all border border-transparent hover:border-red-100 group">
                     <div className="w-12 h-12 rounded-lg bg-white border border-red-100 flex items-center justify-center overflow-hidden shrink-0">
                        <img 
                          src={m.image || "https://images.unsplash.com/photo-1595116701777-626d7ba85655?w=100&fit=crop"} 
                          alt={m.name} 
                          className="w-full h-full object-cover" 
                        />
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="font-bold text-gray-900 text-sm truncate">{m.name}</p>
                       <p className="text-[10px] text-red-600 font-bold uppercase tracking-tight">{m.usage.currentHours} hrs logged</p>
                     </div>
                     <Wrench size={14} className="text-red-400 group-hover:rotate-12 transition-transform" />
                  </Link>
                ))}
                {maintenanceNeeded === 0 && (
                  <div className="text-center py-6">
                    <CheckCircle className="mx-auto text-emerald-500 mb-2" size={24} />
                    <p className="text-gray-400 text-sm font-medium">All systems healthy</p>
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* Right Col: THE CALENDAR (Takes up 2/3rds) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalIcon className="text-blue-600" /> {t('dashboard')} Calendar
            </h3>
            <div className="flex items-center gap-4 bg-gray-50 p-1 rounded-xl border border-gray-100">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronLeft size={20} /></button>
              <span className="font-bold text-gray-700 w-40 text-center select-none">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all"><ChevronRight size={20} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{day}</div>
            ))}
            
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 md:h-28 border border-gray-50 bg-gray-50/30"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const events = getEventsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth();

              return (
                <div key={day} className={`h-24 md:h-28 border border-gray-100 p-2 relative group hover:bg-blue-50/30 transition-colors ${isToday ? 'bg-blue-50/50' : ''}`}>
                  <span className={`text-sm font-bold block mb-1 ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>{day}</span>
                  <div className="space-y-1">
                    {events.map((ev, k) => (
                      <div key={k} className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200 font-bold truncate">
                        ⚠️ {ev.name.split(' ')[0]}
                      </div>
                    ))}
                    {day === 15 && (
                       <div className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200 font-bold truncate">
                         📅 Team Sync
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;