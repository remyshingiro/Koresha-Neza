import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tractor, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu, // New Icon
  X     // New Icon
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu

  const NavItem = ({ to, icon: Icon, label, onClick }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link 
        to={to} 
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
          isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
            : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <Icon size={22} className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      
      {/* 1. MOBILE MENU OVERLAY (Only visible when open) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* 2. SIDEBAR (Desktop: Fixed, Mobile: Slide-over) */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col p-6 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static
      `}>
        
        {/* Logo Area */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-blue-200 shadow-md">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 tracking-tight">Koresha-Neza</h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Manager Pro</p>
            </div>
          </div>
          {/* Close Button (Mobile Only) */}
          <button className="md:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-2">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/assets" icon={Tractor} label="My Machinery" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/team" icon={Users} label="Operators & Staff" onClick={() => setIsMobileMenuOpen(false)} />
          <NavItem to="/settings" icon={Settings} label="Settings" onClick={() => setIsMobileMenuOpen(false)} />
        </nav>

        {/* User Profile */}
        <div className="mt-auto border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
            <img 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60" 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Manager Jean</p>
              <p className="text-xs text-gray-500">Kopakama Co-op</p>
            </div>
            <LogOut size={18} className="text-gray-400 hover:text-red-500" />
          </div>
        </div>
      </aside>

      {/* 3. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-h-screen w-full">
        
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            {/* Hamburger Button (Mobile Only) */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 hidden md:block">
              {location.pathname === '/dashboard' ? 'Overview' : 
               location.pathname.startsWith('/assets') ? 'Asset Management' : 'Portal'}
            </h2>
          </div>
          
          {/* Mobile Logo Name (Visible only on small screens) */}
          <div className="md:hidden font-bold text-blue-600">Koresha-Neza</div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              />
            </div>
            <button className="relative p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        {/* Page Content Injection */}
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
};

export default Layout;