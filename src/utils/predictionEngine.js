import { addDays, format, isBefore, startOfToday } from 'date-fns';

/**
 * PREDICTIVE MAINTENANCE ENGINE
 * Calculates the exact date a machine will reach its service limit.
 */
export const predictServiceDate = (machine) => {
  // 1. Extract data with safety fallbacks
  const currentHours = Number(machine.usage?.currentHours) || 0;
  const serviceInterval = Number(machine.usage?.serviceInterval) || 200;
  
  // Use a default daily average if the user hasn't set one yet
  const dailyAverage = Number(machine.usage?.dailyAverage) || 5; 
  
  // 2. Calculate hours left
  const hoursRemaining = serviceInterval - currentHours;

  // If already overdue
  if (hoursRemaining <= 0) {
    return {
      date: 'OVERDUE',
      daysLeft: 0,
      status: 'Critical'
    };
  }

  // 3. Prediction Calculation
  const daysUntilService = Math.floor(hoursRemaining / dailyAverage);

  // 4. Calendar Mapping
  const targetDate = addDays(new Date(), daysUntilService);

  return {
    date: format(targetDate, 'MMM do, yyyy'),
    daysLeft: daysUntilService,
    status: daysUntilService < 7 ? 'Urgent' : 'Normal',
    rawDate: targetDate
  };
};