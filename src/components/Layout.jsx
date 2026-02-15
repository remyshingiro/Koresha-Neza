import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Tractor, Users, Settings, LogOut, 
  Bell, Search, Menu, X, AlertTriangle, CheckCircle, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMachines } from '../context/MachineContext';

const Layout = ({ children }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { machines } = useMachines();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. OPTIMIZED: Memoized Alert Logic to prevent lag
  const alerts = useMemo(() => machines.filter(m => 
    (m.usage?.currentHours >= m.usage?.serviceInterval) || m.status === 'Broken'
  ), [machines]);

  const hasUnread = alerts.length > 0;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate('/assets', { state: { searchTerm: searchTerm.trim() } });
  };

  const handleLogout = async () => {
    if (window.confirm(t('confirm_logout'))) {
      await logout();
      navigate('/login');
    }
  };

  const getPageTitle = (path) => {
    if (path === '/dashboard') return t('dashboard');
    if (path === '/assets') return t('my_machinery');
    if (path === '/team') return t('operators');
    if (path === '/settings') return t('settings');
    if (path.startsWith('/assets/')) return t('asset_details'); 
    return 'Koresha Neza';
  };

  // 2. IMPROVED: Clean NavItem with automatic active state
  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink 
      to={to} 
      onClick={() => setIsMobileMenuOpen(false)}
      className={({ isActive }) => `
        flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
        ${isActive 
          ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}
      `}
    >
      <div className="flex items-center gap-3">
        <Icon size={20} className="group-hover:scale-110 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-wider">{label}</span>
      </div>
      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col p-6 transition-all duration-500 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} 
        md:relative md:translate-x-0
      `}>
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Tractor size={22} className="text-white" />
            </div>
            <div>
              <h1 className="font-black text-lg text-slate-800 tracking-tight leading-none uppercase">Koresha Neza</h1>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-black mt-1">{t('fleet_control')}</p>
            </div>
          </div>
          <button className="md:hidden p-2 hover:bg-slate-50 rounded-full" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
          <NavItem to="/dashboard" icon={LayoutDashboard} label={t('dashboard')} />
          <NavItem to="/assets" icon={Tractor} label={t('inventory')} />
          <NavItem to="/team" icon={Users} label={t('workforce')} />
          <NavItem to="/settings" icon={Settings} label={t('controls')} />
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-50">
          <div className="flex items-center gap-3 p-2 rounded-[1.5rem] bg-slate-50/50 border border-transparent hover:border-slate-100 transition-all">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=0284c7&color=fff&bold=true`} 
              alt="Profile" 
              className="w-10 h-10 rounded-xl object-cover shadow-sm border-2 border-white"
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">
                {user?.displayName || user?.email?.split('@')[0] || 'Manager'}
              </p>
              <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-widest flex items-center gap-1">
                <LogOut size={10} /> {t('sign_out')}
              </button>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 md:px-10 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2.5 text-slate-600 hover:bg-slate-50 rounded-xl" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu size={22} />
            </button>
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] hidden md:block">
              {getPageTitle(location.pathname)}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative hidden lg:block group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder={t('search_placeholder')}
                className="pl-12 pr-4 py-3 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl text-xs font-bold outline-none w-64 transition-all focus:w-80 focus:shadow-2xl shadow-blue-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>

            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`p-3 rounded-2xl transition-all relative ${isNotifOpen ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 scale-95' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                {hasUnread && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-bounce"></span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                  <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-2 z-50 animate-in zoom-in-95 duration-200">
                    <div className="px-5 py-4 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="font-black text-xs uppercase tracking-widest text-slate-800">{t('alerts')}</h3>
                      {hasUnread && <span className="bg-red-50 text-red-600 text-[10px] font-black px-2 py-1 rounded-lg uppercase">{alerts.length} New</span>}
                    </div>
                    
                    <div className="max-h-72 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                      {alerts.length > 0 ? (
                        alerts.map(machine => (
                          <div key={machine.id} onClick={() => { navigate(`/assets/${machine.id}`); setIsNotifOpen(false); }} className="flex gap-4 items-center p-4 hover:bg-slate-50 rounded-2xl cursor-pointer transition-all border border-transparent hover:border-slate-100 group">
                            <div className="bg-red-50 p-2.5 rounded-xl text-red-500 group-hover:scale-110 transition-transform">
                               <AlertTriangle size={18} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-800 truncate uppercase tracking-tight">{machine.name}</p>
                              <p className="text-[10px] text-red-600 font-bold uppercase mt-0.5 tracking-tighter">{t('maintenance_limit_reached')}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-10 flex flex-col items-center gap-3">
                          <div className="p-4 bg-emerald-50 rounded-full text-emerald-500"><CheckCircle size={32} /></div>
                          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{t('fleet_secure')}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-50/50 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;