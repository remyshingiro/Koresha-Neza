import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Import the translation hook
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
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMachines } from '../context/MachineContext';

const Layout = ({ children }) => {
  const { t } = useTranslation(); // Initialize translation function
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const { machines } = useMachines();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // --- NOTIFICATION LOGIC ---
  const alerts = machines.filter(m => 
    (m.usage?.currentHours >= m.usage?.serviceInterval) || 
    m.status === 'Broken'
  );
  const hasUnread = alerts.length > 0;

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/assets', { state: { searchTerm: searchTerm } });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // --- SMART TITLE LOGIC (Translated) ---
  const getPageTitle = (path) => {
    if (path === '/dashboard') return t('dashboard');
    if (path === '/assets') return t('my_machinery');
    if (path === '/team') return t('operators');
    if (path === '/settings') return t('settings');
    
    if (path.startsWith('/assets/')) return 'Asset Details'; 
    
    return 'Koresha Neza';
  };

  const NavItem = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname.startsWith(to);
    return (
      <Link 
        to={to} 
        onClick={() => setIsMobileMenuOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        <Icon size={20} className={isActive ? 'text-white' : 'text-gray-400'} />
        <span className="font-medium">{label}</span>
      </Link>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-200 flex flex-col p-6 transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-blue-200 shadow-md">
              <span className="text-white font-bold text-2xl">K</span>
            </div>
            <div>
              <h1 className="font-bold text-xl text-gray-900 tracking-tight">Koresha-Neza</h1>
              <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{t('manager_pro')}</p>
            </div>
          </div>
          <button className="md:hidden text-gray-400" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto">
          {/* Translated Sidebar Labels */}
          <NavItem to="/dashboard" icon={LayoutDashboard} label={t('dashboard')} />
          <NavItem to="/assets" icon={Tractor} label={t('my_machinery')} />
          <NavItem to="/team" icon={Users} label={t('operators')} />
          <NavItem to="/settings" icon={Settings} label={t('settings')} />
        </nav>

        <div className="mt-auto border-t border-gray-100 pt-6">
          <div className="flex items-center gap-3">
            <Link 
              to="/settings" 
              className="flex-1 flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=random`} 
                alt="User" 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-blue-200 transition-colors"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.displayName || user?.email?.split('@')[0] || 'Manager'}
                </p>
                <p className="text-xs text-gray-500 truncate group-hover:text-blue-600 transition-colors">{t('view_profile')}</p>
              </div>
            </Link>

            <button 
              onClick={handleLogout} 
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
              title={t('logout')}
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 z-30 flex-shrink-0">
          
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            
            <h2 className="text-xl font-bold text-gray-800 hidden md:block">
              {getPageTitle(location.pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={t('search_placeholder')}
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-500 w-64 transition-all focus:w-72 focus:bg-white focus:shadow-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-2.5 rounded-full transition-colors relative ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <Bell size={22} />
                {hasUnread && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 text-sm">{t('notifications')}</h3>
                      {hasUnread && <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{alerts.length} New</span>}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto p-2 space-y-1">
                      {alerts.length > 0 ? (
                        alerts.map(machine => (
                          <div key={machine.id} onClick={() => { navigate(`/assets/${machine.id}`); setIsNotifOpen(false); }} className="flex gap-3 items-start p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group">
                            <div className="bg-red-50 p-2 rounded-lg text-red-500 shrink-0 group-hover:bg-red-100">
                               <AlertTriangle size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{machine.name}</p>
                              <p className="text-xs text-red-600 font-medium">{t('maintenance_due')} ({machine.usage.currentHours}h)</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-400">
                          <CheckCircle size={32} className="mx-auto mb-2 opacity-20" />
                          <p className="text-sm">{t('no_alerts')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;