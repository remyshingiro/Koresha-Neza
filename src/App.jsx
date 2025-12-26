import AssetCard from './components/AssetCard';
import { machines } from './data/mockData';

function App() {
  return (
    // changed bg-gray-100 to bg-gray-50 for a cleaner look
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* The Container: Keeps content centered and prevents it from getting too wide */}
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🚜 Koresha-Neza Assets</h1>
          <p className="mt-2 text-gray-600">Manage and track your cooperative's machinery health.</p>
        </div>
        
        {/* Responsive Grid */}
        {/* - grid-cols-1: 1 column on Mobile
           - sm:grid-cols-2: 2 columns on Tablets
           - lg:grid-cols-3: 3 columns on Laptops
           - gap-6: Space between cards
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {machines.map((machine) => (
            <AssetCard key={machine.id} machine={machine} />
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;