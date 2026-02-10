import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  ref, 
  onValue, 
  push, 
  update, 
  remove 
} from 'firebase/database';
import { db } from '../firebase'; 

const MachineContext = createContext();

export const MachineProvider = ({ children }) => {
  const [machines, setMachines] = useState([]);
  const [members, setMembers] = useState([]); // <--- New state for Team
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
      
      // Stop loading once we have connected
      setLoading(false);
    });

    return () => {
      unsubscribeMachines();
      unsubscribeMembers();
    };
  }, []);

  // --- MACHINE ACTIONS ---
  const addMachine = (machine) => push(ref(db, 'machines'), machine);
  
  const checkOutMachine = (id, farmerName, duration) => {
    update(ref(db, `machines/${id}`), {
      assignment: {
        isAssigned: true,
        assignedTo: farmerName,
        dueDate: new Date(Date.now() + duration * 86400000).toISOString().split('T')[0]
      }
    });
  };

  const returnMachine = (id) => {
    update(ref(db, `machines/${id}`), {
      assignment: { isAssigned: false, assignedTo: null, dueDate: null }
    });
  };

  const logMaintenance = (id, logData) => {
    const currentMachine = machines.find(m => m.id === id);
    update(ref(db, `machines/${id}`), {
      status: "Healthy",
      usage: { ...currentMachine.usage, currentHours: 0 },
      history: [logData, ...(currentMachine.history || [])]
    });
  };

  // --- TEAM ACTIONS (NEW) ---
  const addMember = (member) => {
    push(ref(db, 'members'), member);
  };
  
  const removeMember = (id) => {
    remove(ref(db, `members/${id}`));
  };

  // --- RESET SYSTEM ---
  const resetData = () => {
    if(confirm("Delete ALL data (Machines & People)?")) {
      remove(ref(db, 'machines'));
      remove(ref(db, 'members'));
    }
  };

  return (
    <MachineContext.Provider value={{ 
      machines, members, loading, 
      addMachine, checkOutMachine, returnMachine, logMaintenance, 
      addMember, removeMember, 
      resetData 
    }}>
      {children}
    </MachineContext.Provider>
  );
};

export const useMachines = () => useContext(MachineContext);