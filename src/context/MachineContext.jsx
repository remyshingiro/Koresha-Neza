import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  ref, 
  onValue, 
  push, 
  update, 
  remove,
  set
} from 'firebase/database';
import { db } from '../firebase'; 

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Listen to Machines
    const machinesRef = ref(db, 'machines');
    const unsubscribeMachines = onValue(machinesRef, (snapshot) => {
      const data = snapshot.val();
      const list = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setMachines(list);
    });

    // 2. Listen to Members (Team)
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

  // --- MACHINE ACTIONS ---
  const addMachine = async (machineData) => {
    // Ensure default structure
    const newMachine = {
      name: machineData.name,
      type: machineData.type || 'Tractor',
      status: 'Healthy',
      fuel: 100,
      usage: { currentHours: 0, serviceInterval: 200 },
      assignment: { isAssigned: false },
      ...machineData
    };
    await push(ref(db, 'machines'), newMachine);
  };
  
  const checkOutMachine = async (id, farmerName, duration) => {
    await update(ref(db, `machines/${id}`), {
      assignment: {
        isAssigned: true,
        assignedTo: farmerName,
        dueDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0]
      }
    });
  };

  const returnMachine = async (id) => {
    await update(ref(db, `machines/${id}`), {
      assignment: { isAssigned: false, assignedTo: null, dueDate: null }
    });
  };

  const logMaintenance = async (id, logData) => {
    const currentMachine = machines.find(m => m.id === id);
    if (!currentMachine) return;
    
    await update(ref(db, `machines/${id}`), {
      status: "Healthy",
      "usage/currentHours": 0, // Reset hours after service
      history: [logData, ...(currentMachine.history || [])]
    });
  };

  const deleteMachine = async (id) => {
    await remove(ref(db, `machines/${id}`));
  };

  // --- TEAM ACTIONS ---
  const addMember = async (member) => {
    await push(ref(db, 'members'), member);
  };
  
  const removeMember = async (id) => {
    await remove(ref(db, `members/${id}`));
  };

  // --- RESET SYSTEM ---
  const resetData = async () => {
    if(window.confirm("Delete ALL data (Machines & People)?")) {
      await remove(ref(db, 'machines'));
      await remove(ref(db, 'members'));
    }
  };

  return (
    <MachineContext.Provider value={{ 
      machines, members, loading, 
      addMachine, deleteMachine, checkOutMachine, returnMachine, logMaintenance, 
      addMember, removeMember, 
      resetData 
    }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => useContext(MachineContext);