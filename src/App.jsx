import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import AssetDetail from './pages/AssetDetail';
// 1. IMPORT THE TEAM PAGE
import Team from './pages/Team'; 
import { MachineProvider } from './context/MachineContext'; 

function App() {
  return (
    <MachineProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assets" element={<AssetList />} />
            <Route path="/assets/:id" element={<AssetDetail />} />
            
            {/* 2. ADD THE ROUTE HERE */}
            <Route path="/team" element={<Team />} />
            
            <Route path="/settings" element={<div className="p-10">Settings Coming Soon</div>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </MachineProvider>
  );
}

export default App;