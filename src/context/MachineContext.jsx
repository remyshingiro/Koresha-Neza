import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ref, onValue, push, update, remove, runTransaction 
} from 'firebase/database';
import { db } from '../firebase'; 
import toast from 'react-hot-toast'; 

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. DATA SYNCHRONIZATION ---
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

  // --- 2. ENTERPRISE ACTIONS ---

  const addMachine = async (machineData) => {
    try {
      const newMachine = {
        name: machineData.name,
        type: machineData.type || 'Tractor',
        status: 'Healthy',
        fuel: 100, 
        usage: { 
          currentHours: 0, 
          serviceInterval: Number(machineData.serviceInterval) || 200,
          dailyAverage: 5 // AI Baseline: Average work hours per day in Rwanda
        },
        assignment: { isAssigned: false },
        history: [],
        fuelLogs: [],
        ...machineData
      };
      await push(ref(db, 'machines'), newMachine);
      toast.success('Asset added to enterprise fleet!');
    } catch (error) {
      toast.error('System failed to add asset.');
    }
  };

  // --- REFUELING (Atomic Reset) ---
  const logFuel = async (id, fuelData) => {
    try {
      await runTransaction(ref(db, `machines/${id}`), (machine) => {
        if (machine) {
          machine.fuel = 100; // Tank Reset
          if (!machine.fuelLogs) machine.fuelLogs = [];
          machine.fuelLogs = [fuelData, ...machine.fuelLogs];
        }
        return machine;
      });
      toast.success(`Refueled to 100%`);
    } catch (error) {
      toast.error('Fuel logging failed.');
    }
  };

  // --- PREDICTIVE USAGE LOGIC (Billion-Dollar Standard) ---
  const logUsage = async (id, hours) => {
    try {
      // runTransaction prevents data loss during high-concurrency usage
      await runTransaction(ref(db, `machines/${id}`), (machine) => {
        if (machine) {
          // 1. Calculate Fuel Burn (Enterprise logic: 5% per hour)
          const currentFuel = (machine.fuel === undefined) ? 100 : Number(machine.fuel);
          const fuelConsumed = Number(hours) * 5;
          let newFuelLevel = Math.max(0, currentFuel - fuelConsumed);

          // 2. Update Lifetime Hours
          const currentHours = (machine.usage?.currentHours) ? Number(machine.usage.currentHours) : 0;
          
          // 3. Apply updates to the database object
          machine.fuel = newFuelLevel;
          if (!machine.usage) machine.usage = { dailyAverage: 5 };
          machine.usage.currentHours = currentHours + Number(hours);
        }
        return machine;
      });
      toast.success(`Logged ${hours} work hours.`);
    } catch (error) {
      console.error(error);
      toast.error('Telemetry update failed.');
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
      toast.success(`Asset deployed to ${farmerName}`);
    } catch (error) {
      toast.error('Deployment failed.');
    }
  };

  const returnMachine = async (id) => {
    try {
      await update(ref(db, `machines/${id}`), {
        assignment: { isAssigned: false, assignedTo: null, dueDate: null }
      });
      toast.success('Asset returned to depot.');
    } catch (error) {
      toast.error('Return protocol failed.');
    }
  };

  const logMaintenance = async (id, logData) => {
    try {
      await runTransaction(ref(db, `machines/${id}`), (machine) => {
        if (machine) {
          machine.status = "Healthy";
          if (!machine.usage) machine.usage = {};
          machine.usage.currentHours = 0; // Reset hour meter after service
          
          if (!machine.history) machine.history = [];
          machine.history = [logData, ...machine.history];
        }
        return machine;
      });
      toast.success('Service complete: Hours reset.');
    } catch (error) {
      toast.error('Maintenance log failed.');
    }
  };

  const deleteMachine = async (id) => {
    try {
      await remove(ref(db, `machines/${id}`));
      toast.success('Asset decommissioned.');
    } catch (error) {
      toast.error('Decommissioning failed.');
    }
  };

  const addMember = async (member) => {
    try {
      await push(ref(db, 'members'), member);
      toast.success('Member added to cooperative.');
    } catch (error) {
      toast.error('Failed to add staff.');
    }
  };
  
  const removeMember = async (id) => {
    try {
      await remove(ref(db, `members/${id}`));
      toast.success('Staff access revoked.');
    } catch (error) {
      toast.error('Revocation failed.');
    }
  };

  const resetData = async () => {
    if(window.confirm("WARNING: You are about to wipe ALL enterprise data. Proceed?")) {
      try {
        await remove(ref(db, 'machines'));
        await remove(ref(db, 'members'));
        toast.success('Factory Reset Complete.');
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