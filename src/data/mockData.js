export const machines = [
  {
    id: 1,
    name: "Massey Ferguson 375",
    type: "Tractor",
    status: "Healthy",
    // Reliable image link
    image: "https://images.unsplash.com/photo-1605218427306-635489f6685c?w=600&auto=format&fit=crop&q=60",
    
    // Data for the AI Predictor
    usage: {
      currentHours: 185,
      serviceInterval: 200, // Service needed at 200 hours
      dailyAverage: 5       // Used approx 5 hours/day
    },

    // Data for the "Info" Tab
    specs: {
      modelYear: "2022",
      serialNumber: "MF-375-RW-099",
      purchaseDate: "2023-01-15",
      engineType: "Perkins 4.41",
      power: "75 HP"
    },

    // Data for the "Check Out" status
    assignment: {
      isAssigned: true,
      assignedTo: "Jean Paul (Farmer)",
      dueDate: "2025-02-15"
    },

    // Data for the "History" Tab
    history: [
      { date: "2024-12-01", action: "Oil Change", mechanic: "Garage Kigali", cost: 15000 },
      { date: "2024-10-15", action: "Tire Replacement", mechanic: "AutoFix", cost: 120000 }
    ]
  },
  {
    id: 2,
    name: "Coffee Pulper MK-4",
    type: "Processing",
    status: "Needs Repair",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60",
    
    usage: {
      currentHours: 310,
      serviceInterval: 300, // OVERDUE! (310 > 300)
      dailyAverage: 8
    },

    specs: {
      modelYear: "2020",
      serialNumber: "CP-MK4-002",
      purchaseDate: "2021-06-10",
      engineType: "Electric Motor 5KW",
      power: "5 KW"
    },

    assignment: {
      isAssigned: false, 
      assignedTo: null,
      dueDate: null
    },

    history: [
      { date: "2024-11-05", action: "Belt Tightening", mechanic: "Marie Claire", cost: 5000 },
      { date: "2024-05-12", action: "Blade Sharpening", mechanic: "Jean Paul", cost: 10000 }
    ]
  },
  {
    id: 3,
    name: "Rice Thresher Model X",
    type: "Harvesting",
    status: "Healthy",
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=60",
    
    usage: {
      currentHours: 45,
      serviceInterval: 100,
      dailyAverage: 2
    },

    specs: {
      modelYear: "2024",
      serialNumber: "RT-X-2024",
      purchaseDate: "2025-01-01",
      engineType: "Diesel 10HP",
      power: "10 HP"
    },

    assignment: {
      isAssigned: false,
      assignedTo: null,
      dueDate: null
    },

    history: []
  }
];