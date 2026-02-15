import React from 'react';
import { 
  format, startOfWeek, addDays, startOfMonth, endOfMonth, 
  endOfWeek, isSameMonth, isSameDay, addMonths, subMonths, isBefore 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Wrench } from 'lucide-react';

const ServiceCalendar = ({ machines }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Service Schedule</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600"><ChevronLeft size={18}/></button>
          <button onClick={nextMonth} className="p-2 hover:bg-slate-50 border border-slate-100 rounded-xl transition-all text-slate-400 hover:text-blue-600"><ChevronRight size={18}/></button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-slate-50 pb-2">
        {days.map(d => (
          <div className="text-center text-[10px] font-black text-slate-400 uppercase tracking-widest" key={d}>
            {d}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    // Use isBefore or isSameDay to prevent loop logic errors
    while (day <= endDate || isSameDay(day, endDate)) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const formattedDate = format(day, "d");
        
        // STRENGTHENED LOGIC: Prevent crash if ID is short or missing
        const events = machines.filter(m => {
            const machineSeed = m.id ? m.id.toString().slice(-2) : "0";
            const projectedDay = (parseInt(machineSeed, 16) % 28) + 1; 
            return projectedDay === parseInt(formattedDate) && isSameMonth(day, currentMonth);
        });

        days.push(
          <div
            className={`h-24 border-[0.5px] border-slate-50 p-2 relative transition-all cursor-pointer
              ${!isSameMonth(day, monthStart) ? "bg-slate-50/50 text-slate-300" : "bg-white"}
              ${isSameDay(day, selectedDate) ? "ring-2 ring-inset ring-blue-500/20 bg-blue-50/30" : "hover:bg-slate-50"}
            `}
            key={day.toISOString()}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className={`text-xs font-black ${isSameDay(day, new Date()) ? "bg-blue-600 text-white px-1.5 py-0.5 rounded-md shadow-lg shadow-blue-100" : "text-slate-500"}`}>
              {formattedDate}
            </span>
            
            <div className="mt-2 space-y-1 overflow-y-auto max-h-[50px] custom-scrollbar">
              {events.map((ev, k) => (
                <div key={`${ev.id}-${k}`} className="text-[9px] bg-amber-50 text-amber-700 px-1.5 py-1 rounded-lg truncate font-black border border-amber-100 flex items-center gap-1 animate-in fade-in zoom-in-95">
                  <Wrench size={10} className="shrink-0" /> {ev.name}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toISOString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-inner">{rows}</div>;
  };

  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-6 flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 bg-amber-100 border border-amber-200 rounded-full"></div>
                Projected Service
            </div>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                Today
            </div>
        </div>
        <p className="text-[10px] text-slate-300 font-bold italic">Generated by Koresha Neza Intelligence</p>
      </div>
    </div>
  );
};

export default ServiceCalendar;