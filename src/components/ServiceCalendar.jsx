import React from 'react';
import { 
  format, startOfWeek, addDays, startOfMonth, endOfMonth, 
  endOfWeek, isSameMonth, isSameDay, addMonths, subMonths 
} from 'date-fns';
import { ChevronLeft, ChevronRight, Wrench, Tractor } from 'lucide-react';

const ServiceCalendar = ({ machines }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  // Generate Calendar Grid
  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-lg font-bold text-gray-900">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronLeft size={20}/></button>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-lg"><ChevronRight size={20}/></button>
        </div>
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
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        
        // Find events for this day (Mocking future due dates based on history or creation)
        // In a real app, you would have a 'nextServiceDate' field in DB
        const events = machines.filter(m => {
           // Fake Logic: If machine ID ends in the day number, it's due (For Demo)
           // Replace this with: m.nextServiceDate === format(cloneDay, 'yyyy-MM-dd')
           const randomDay = (parseInt(m.id.slice(-2), 16) % 28) + 1; 
           return randomDay === parseInt(formattedDate) && isSameMonth(day, currentMonth);
        });

        days.push(
          <div
            className={`h-24 border border-gray-100 p-2 relative transition-colors hover:bg-gray-50
              ${!isSameMonth(day, monthStart) ? "bg-gray-50 text-gray-300" : "bg-white"}
              ${isSameDay(day, selectedDate) ? "bg-blue-50" : ""}
            `}
            key={day}
            onClick={() => setSelectedDate(cloneDay)}
          >
            <span className={`text-sm font-bold ${isSameDay(day, new Date()) ? "text-blue-600" : "text-gray-700"}`}>
              {formattedDate}
            </span>
            
            {/* Event Dots */}
            <div className="mt-1 space-y-1 overflow-y-auto max-h-[60px]">
              {events.map((ev, k) => (
                <div key={k} className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-md truncate font-medium flex items-center gap-1">
                  <Wrench size={10} /> {ev.name}
                </div>
              ))}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="rounded-xl overflow-hidden border border-gray-100">{rows}</div>;
  };

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2">
        {days.map(d => (
          <div className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider" key={d}>
            {d}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
         <div className="w-3 h-3 bg-amber-100 rounded-full"></div>
         <span>Projected Service Date</span>
      </div>
    </div>
  );
};

export default ServiceCalendar;