export const machines = [
  {
    id: 1,
    name: "Massey Ferguson 375",
    type: "Tractor",
    status: "Healthy",
    // Using a specific tractor image from Unsplash Source
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=60",
    usage: {
      currentHours: 185,
      serviceInterval: 200,
      dailyAverage: 5
    },
    lastService: "2024-12-01"
  },
  {
    id: 2,
    name: "Coffee Pulper MK-4",
    type: "Processing",
    status: "Needs Repair",
    // Industrial machine image
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=60",
    usage: {
      currentHours: 310,
      serviceInterval: 300,
      dailyAverage: 8
    },
    lastService: "2024-11-15"
  },
  {
    id: 3,
    name: "Rice Thresher Model X",
    type: "Harvesting",
    status: "Healthy",
    // Farm equipment image
    image: "https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=600&auto=format&fit=crop&q=60",
    usage: {
      currentHours: 45,
      serviceInterval: 100,
      dailyAverage: 2
    },
    lastService: "2025-01-05"
  }
];