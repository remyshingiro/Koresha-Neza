import React, { useState, useMemo } from 'react';
import { 
  Users, Tractor, Clock, AlertTriangle, 
  ArrowRight, Activity, ChevronLeft, ChevronRight, Wrench, Calendar as CalIcon, Droplet, CheckCircle, X, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMachines } from '../context/MachineContext';
import { predictServiceDate } from '../utils/predictionEngine'; 

const Dashboard = () => {
  const { t } = useTranslation();
  const { machines, members, loading } = useMachines();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // New state for showing daily agenda
  const [selectedDayEvents, setSelectedDayEvents] = useState(null);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Loading Intelligence...</p>
      </div>
    );
  }

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const changeMonth = (offset) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1));
    setSelectedDayEvents(null); // Clear agenda when switching months
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  
  const getEventsForDay = (day) => {
    const events = [];
    machines.forEach(m => {
      const prediction = predictServiceDate(m);
      if (prediction && prediction.date !== 'OVERDUE') {
        const pDate = new Date(prediction.rawDate);
        if (pDate.getDate() === day && pDate.getMonth() === currentDate.getMonth() && pDate.getFullYear() === currentDate.getFullYear()) {
          events.push({ id: m.id, name: m.name, status: prediction.status, type: 'repair', detail: 'AI Predicted Maintenance Due' });
        }
      }
      const inspectionDay = (m.id.charCodeAt(m.id.length - 1) % 28) + 1;
      if (inspectionDay === day) {
        events.push({ id: m.id, name: m.name, status: 'Normal', type: 'checkup', detail: 'Routine Enterprise Inspection' });
      }
    });
    return events;
  };

  const handleDayClick = (day) => {
    const events = getEventsForDay(day);
    if (events.length > 0) {
      setSelectedDayEvents({ day, events });
    } else {
      setSelectedDayEvents(null);
    }
  };

  // Stats logic remains the same
  const totalAssets = machines.length;
  const assignedAssets = machines.filter(m => m.assignment?.isAssigned).length;
  const activeStaff = members.length;
  const criticalMachines = machines.filter(m => {
      const pred = predictServiceDate(m);
      return pred.status === 'Critical' || pred.status === 'Urgent' || m.status === 'Broken';
  });
  const fleetHealthPercent = totalAssets > 0 ? Math.round(((totalAssets - criticalMachines.length) / totalAssets) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20 px-2 sm:px-0">
      
      {/* Header & Stats Grid (As previously refined) */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest block mb-1">Operational Command</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">{t('dashboard')}</h1>
        </div>
        <div className="inline-flex items-center gap-2 border border-blue-100 px-3 py-1.5 rounded-2xl bg-blue-50/50">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">AI Engine Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {[
          { label: t('total_assets'), val: totalAssets, icon: Tractor, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: t('active_staff'), val: activeStaff, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: t('in_use'), val: assignedAssets, icon: Droplet, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: t('fleet_health'), val: `${fleetHealthPercent}%`, icon: Activity, color: criticalMachines.length > 0 ? 'text-red-600' : 'text-blue-600', bg: criticalMachines.length > 0 ? 'bg-red-50' : 'bg-blue-50' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 sm:p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-lg transition-all">
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
              <stat.icon size={20} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{stat.val}</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-blue-600 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-xl shadow-blue-100">
            <div className="relative z-10">
              <h3 className="text-lg font-black uppercase tracking-tight mb-4">{t('quick_actions')}</h3>
              <div className="space-y-3">
                <Link to="/assets" className="px-5 py-3.5 bg-white text-blue-600 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-blue-50 transition-all flex items-center justify-between shadow-lg">
                  {t('my_machinery')} <ArrowRight size={14} />
                </Link>
                <Link to="/team" className="px-5 py-3.5 bg-blue-700/50 text-white border border-blue-400/30 font-black text-[9px] uppercase tracking-widest rounded-xl hover:bg-blue-700 transition-all flex items-center justify-between">
                  {t('operators')} <Users size={14} />
                </Link>
              </div>
            </div>
          </div>

          {/* Dynamic Day Agenda (Visible when a day is clicked) */}
          {selectedDayEvents ? (
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl animate-in slide-in-from-left-4 duration-300">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest">Day Agenda</h3>
                  <p className="text-xl font-black tracking-tight">{monthNames[currentDate.getMonth()]} {selectedDayEvents.day}</p>
                </div>
                <button onClick={() => setSelectedDayEvents(null)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"><X size={16} /></button>
              </div>
              <div className="space-y-3">
                {selectedDayEvents.events.map((ev, i) => (
                  <Link key={i} to={`/assets/${ev.id}`} className="block p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${ev.type === 'repair' ? 'bg-amber-500/20 text-amber-500' : 'bg-blue-500/20 text-blue-400'}`}>
                        {ev.type === 'repair' ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-black truncate uppercase">{ev.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{ev.detail}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 text-center border-dashed border-2">
              <CalIcon className="mx-auto text-slate-200 mb-3" size={32} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Click a calendar day<br/>to view details</p>
            </div>
          )}
        </div>

        {/* 3. INTERACTIVE CALENDAR */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-100 shadow-sm p-4 sm:p-8 overflow-hidden">
          <div className="flex flex-col xs:flex-row justify-between items-center gap-4 mb-8">
            <h3 className="text-base sm:text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
              <CalIcon className="text-blue-600" size={18} /> AI Forecast
            </h3>
            <div className="flex items-center gap-2 sm:gap-4 bg-slate-50 p-1 rounded-xl border border-slate-100 w-full xs:w-auto justify-between">
              <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-white text-slate-400"><ChevronLeft size={16} /></button>
              <span className="font-black text-slate-700 w-28 sm:w-36 text-center select-none uppercase tracking-widest text-[10px] sm:text-[11px]">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <button onClick={() => changeMonth(1)} className="p-2 hover:bg-white text-slate-400"><ChevronRight size={16} /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-t border-l border-slate-50 rounded-xl overflow-hidden shadow-inner">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-[8px] sm:text-[9px] font-black text-slate-400 uppercase py-3 border-r border-b border-slate-50 bg-slate-50/30">{day}</div>
            ))}
            
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-16 sm:h-24 border-r border-b border-slate-50 bg-slate-50/10"></div>
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const events = getEventsForDay(dayNum);
              const isSelected = selectedDayEvents?.day === dayNum;
              const isToday = new Date().getDate() === dayNum && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

              return (
                <div 
                  key={dayNum} 
                  onClick={() => handleDayClick(dayNum)}
                  className={`h-16 sm:h-24 border-r border-b border-slate-50 p-1 sm:p-2 relative group transition-all cursor-pointer 
                    ${isSelected ? 'bg-blue-600 scale-[0.98] z-10 shadow-inner' : 'hover:bg-blue-50/30'} 
                    ${isToday && !isSelected ? 'bg-blue-50/50' : ''}`}
                >
                  <span className={`text-[10px] sm:text-xs font-black block mb-1 ${isSelected ? 'text-white' : isToday ? 'text-blue-600' : 'text-slate-300'}`}>{dayNum}</span>
                  <div className="flex flex-wrap gap-0.5 sm:gap-1">
                    {events.map((ev, k) => (
                      <div key={k} className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border shadow-sm ${
                        isSelected ? 'bg-white border-transparent' : 
                        ev.type === 'repair' ? 'bg-amber-400 border-amber-500' : 'bg-blue-400 border-blue-500'
                      }`}></div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-50">
             <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
               <div className="w-2 h-2 bg-amber-400 rounded-full"></div> Repair
             </div>
             <div className="flex items-center gap-2 text-[8px] font-black text-slate-400 uppercase tracking-widest">
               <div className="w-2 h-2 bg-blue-400 rounded-full"></div> Checkup
             </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;