import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Tractor, 
  Users, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu, 
  X,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // 1. Get Real User
import { useMachines } from '../context/MachineContext'; // 2. Get Real Alerts

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Auth Hook
  const { machines } = useMachines(); // Data Hook for Notifications

  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // --- DERIVED DATA ---
  
  // 1. Generate Real Notifications
  // Find machines that need service (hours > interval)
  const alerts = machines.filter(m => m.usage.currentHours >= m.usage.serviceInterval);
  const hasUnread = alerts.length > 0;

  // 2. Handle Search
  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to Asset List and pass the search term via URL state
    navigate('/assets', { state: { searchTerm: globalSearch } });
  };

  // 3. Handle Logout
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link 
        to={to} 
        onClick={() => setIsMobileMenuOpen(false)}
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
      
      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col p-6 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 md:static
      `}>
        {/* Logo */}
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
          <button className="md:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-2">
          <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem to="/assets" icon={Tractor} label="My Machinery" />
          <NavItem to="/team" icon={Users} label="Operators & Staff" />
          <NavItem to="/settings" icon={Settings} label="Settings" />
        </nav>

        {/* User Profile (Footer) */}
        <div className="mt-auto border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
            {/* User Avatar (Generated from email) */}
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random`} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">
                {user?.email?.split('@')[0] || 'Manager'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'No Email'}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors" title="Sign Out">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen w-full relative">
        
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-30 px-4 md:px-8 flex justify-between items-center">
          
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-gray-800 hidden md:block capitalize">
              {location.pathname.replace('/', '') || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            
            {/* WORKING SEARCH BAR */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search assets..." 
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
              />
            </form>

            {/* NOTIFICATION BELL (Clickable) */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <Bell size={22} />
                {hasUnread && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              {/* DROPDOWN MENU */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-600">{alerts.length} New</span>
                  </div>
                  
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {alerts.length > 0 ? (
                      alerts.map(machine => (
                        <div key={machine.id} className="flex gap-3 items-start p-3 bg-red-50 rounded-xl border border-red-100">
                          <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-gray-900">{machine.name}</p>
                            <p className="text-xs text-red-600">Service Overdue! ({machine.usage.currentHours}h / {machine.usage.serviceInterval}h)</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-400">
                        <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                        <p className="text-sm">All systems healthy.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
          </div>
        </header>

        {/* CLICKABLE BACKGROUND TO CLOSE DROPDOWNS */}
        {isNotifOpen && (
          <div className="fixed inset-0 z-20" onClick={() => setIsNotifOpen(false)}></div>
        )}

        {/* CONTENT */}
        <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </div>
      </main>

    </div>
  );
};

export default Layout;