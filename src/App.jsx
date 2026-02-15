import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AssetList from './pages/AssetList';
import AssetDetail from './pages/AssetDetail';
import Team from './pages/Team'; 
import Settings from './pages/Settings'; 
import Login from './pages/Login';
import { MachineProvider } from './context/MachineContext'; 
import { AuthProvider, useAuth } from './context/AuthContext'; 

// SECURITY GUARD
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <MachineProvider>
        <BrowserRouter>
          
          <Toaster 
            position="top-right" 
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1F2937', 
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
                fontWeight: 'bold',
              },
              success: {
                iconTheme: {
                  primary: '#10B981', 
                  secondary: 'white',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444', 
                  secondary: 'white',
                },
              },
            }} 
          />

          <Routes>
            
            {/* PUBLIC */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout><Navigate to="/dashboard" replace /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/assets" element={
              <ProtectedRoute>
                <Layout><AssetList /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/assets/:id" element={
              <ProtectedRoute>
                <Layout><AssetDetail /></Layout>
              </ProtectedRoute>
            } />

            <Route path="/team" element={
              <ProtectedRoute>
                <Layout><Team /></Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <Layout><Settings /></Layout>
              </ProtectedRoute>
            } />
            
          </Routes>
        </BrowserRouter>
      </MachineProvider>
    </AuthProvider>
  );
}

export default App;