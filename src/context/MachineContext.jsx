import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ref, onValue, push, update, remove 
} from 'firebase/database';
import { db } from '../firebase'; 
import toast from 'react-hot-toast'; 

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. LISTEN TO DATA ---
  useEffect(() => {
    const machinesRef = ref(db, 'machines');
    const unsubscribeMachines = onValue(machinesRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setMachines(list);
    });

    const membersRef = ref(db, 'members');
    const unsubscribeMembers = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setMembers(list);
      setLoading(false);
    });

    return () => {
      unsubscribeMachines();
      unsubscribeMembers();
    };
  }, []);

  // --- 2. ACTIONS ---

  const addMachine = async (machineData) => {
    try {
      const newMachine = {
        name: machineData.name,
        type: machineData.type || 'Tractor',
        status: 'Healthy',
        fuel: 100, // Default full tank
        usage: { currentHours: 0, serviceInterval: 200 },
        assignment: { isAssigned: false },
        history: [],
        fuelLogs: [],
        ...machineData
      };
      await push(ref(db, 'machines'), newMachine);
      toast.success('Asset added successfully!');
    } catch (error) {
      toast.error('Failed to add asset.');
    }
  };

  // --- FUEL LOGIC: REFUELING ---
  const logFuel = async (id, fuelData) => {
    const currentMachine = machines.find(m => m.id === id);
    if(!currentMachine) return;

    try {
      // 1. ALWAYS reset to 100% when refueling
      const newFuelLevel = 100; 

      // 2. Add to history
      const previousLogs = currentMachine.fuelLogs || [];
      const updatedLogs = [fuelData, ...previousLogs];

      await update(ref(db, `machines/${id}`), {
        fuel: newFuelLevel,
        fuelLogs: updatedLogs
      });
      toast.success(`Refueled: Tank is now 100%`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to log fuel.');
    }
  };

  // --- WORK LOGIC: BURNING FUEL (FIXED) ---
  const logUsage = async (id, hours) => {
    const currentMachine = machines.find(m => m.id === id);
    if (!currentMachine) return;

    // 1. FIX: Handle machines that don't have a fuel value yet (Legacy Data)
    // If 'fuel' is missing, assume it started at 100%
    const currentFuel = (currentMachine.fuel !== undefined && currentMachine.fuel !== null) 
                        ? currentMachine.fuel 
                        : 100;

    // 2. Calculate Burn (5% per hour)
    const burnRate = 5; 
    const fuelConsumed = hours * burnRate;
    
    // 3. Calculate New Level
    let newFuelLevel = currentFuel - fuelConsumed;
    if (newFuelLevel < 0) newFuelLevel = 0; // Prevent negatives

    // 4. Update Hours
    const currentHours = currentMachine.usage?.currentHours || 0;
    const newHours = currentHours + Number(hours);

    try {
      await update(ref(db, `machines/${id}`), {
        fuel: newFuelLevel,
        "usage/currentHours": newHours
      });
      
      if(newFuelLevel < 20) {
        toast.error(`Warning: Low Fuel (${newFuelLevel}%)!`, { icon: '⛽' });
      } else {
        toast.success(`Logged ${hours} hrs. Fuel dropped to ${newFuelLevel}%`);
      }

    } catch (error) {
      toast.error('Failed to log usage.');
    }
  };

  const checkOutMachine = async (id, farmerName, duration) => {
    try {
      await update(ref(db, `machines/${id}`), {
        assignment: {
          isAssigned: true,
          assignedTo: farmerName,
          dueDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0]
        }
      });
      toast.success(`${farmerName} assigned!`);
    } catch (error) {
      toast.error('Assignment failed.');
    }
  };

  const returnMachine = async (id) => {
    try {
      await update(ref(db, `machines/${id}`), {
        assignment: { isAssigned: false, assignedTo: null, dueDate: null }
      });
      toast.success('Machine returned.');
    } catch (error) {
      toast.error('Error returning machine.');
    }
  };

  const logMaintenance = async (id, logData) => {
    const currentMachine = machines.find(m => m.id === id);
    if (!currentMachine) return;
    try {
      const updatedHistory = [logData, ...(currentMachine.history || [])];
      await update(ref(db, `machines/${id}`), {
        status: "Healthy",
        "usage/currentHours": 0,
        history: updatedHistory
      });
      toast.success('Maintenance logged & hours reset!');
    } catch (error) {
      toast.error('Failed to log service.');
    }
  };

  const deleteMachine = async (id) => {
    try {
      await remove(ref(db, `machines/${id}`));
      toast.success('Asset deleted.');
    } catch (error) {
      toast.error('Could not delete asset.');
    }
  };

  const addMember = async (member) => {
    try {
      await push(ref(db, 'members'), member);
      toast.success('New member welcomed!');
    } catch (error) {
      toast.error('Failed to add member.');
    }
  };
  
  const removeMember = async (id) => {
    try {
      await remove(ref(db, `members/${id}`));
      toast.success('Member removed.');
    } catch (error) {
      toast.error('Failed to remove member.');
    }
  };

  const resetData = async () => {
    if(window.confirm("Delete ALL data?")) {
      try {
        await remove(ref(db, 'machines'));
        await remove(ref(db, 'members'));
        toast.success('System Factory Reset Complete.');
      } catch (error) {
        toast.error('Reset failed.');
      }
    }
  };

  return (
    <MachineContext.Provider value={{ 
      machines, members, loading, 
      addMachine, deleteMachine, checkOutMachine, returnMachine, 
      logMaintenance, logFuel, logUsage, 
      addMember, removeMember, 
      resetData 
    }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => useContext(MachineContext);