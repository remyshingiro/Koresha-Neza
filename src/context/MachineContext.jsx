import React, { createContext, useState, useContext } from 'react';
import { machines as initialData } from '../data/mockData';

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState(initialData);

  // ACTION: Check Out
  const checkOutMachine = (id, farmerName, duration) => {
    setMachines(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          assignment: {
            isAssigned: true,
            assignedTo: farmerName,
            dueDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0]
          }
        };
      }
      return m;
    }));
  };

  // ACTION: Return
  const returnMachine = (id) => {
    setMachines(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          assignment: { isAssigned: false, assignedTo: null, dueDate: null }
        };
      }
      return m;
    }));
  };

  // ACTION: Add New
  const addMachine = (newMachine) => {
    setMachines(prev => [...prev, { ...newMachine, id: prev.length + 1 }]);
  };

  // NEW ACTION: Log Maintenance (The Fix)
  const logMaintenance = (id, logData) => {
    setMachines(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          status: "Healthy", // 1. Fix the status
          usage: {
            ...m.usage,
            currentHours: 0 // 2. Reset the "Since Last Service" counter
          },
          history: [logData, ...m.history] // 3. Add to history (newest first)
        };
      }
      return m;
    }));
  };

  return (
    <MachineContext.Provider value={{ machines, checkOutMachine, returnMachine, addMachine, logMaintenance }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => useContext(MachineContext);