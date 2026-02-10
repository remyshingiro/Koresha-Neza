import { addDays, format } from 'date-fns';

/**
 * PREDICTIVE MAINTENANCE ENGINE
 * Calculates the exact date a machine will reach its service limit.
 */
export const predictServiceDate = (machine) => {
  // 1. Extract the data we need
  const { currentHours, serviceInterval, dailyAverage } = machine.usage;
  
  // 2. How many hours are left before it breaks?
  const hoursRemaining = serviceInterval - currentHours;

  // If it's already broken or overdue, return null so we don't predict the past
  if (hoursRemaining <= 0) return null;

  // 3. AI CALCULATION:
  // Calculate how many days until we hit the limit based on daily usage
  const daysUntilService = Math.floor(hoursRemaining / dailyAverage);

  // 4. Calculate the Calendar Date
  const today = new Date();
  const targetDate = addDays(today, daysUntilService);

  return {
    date: format(targetDate, 'MMM do, yyyy'), // e.g., "Feb 14th, 2025"
    daysLeft: daysUntilService,
    status: daysUntilService < 7 ? 'Urgent' : 'Normal' // Flag if it's this week
  };
};