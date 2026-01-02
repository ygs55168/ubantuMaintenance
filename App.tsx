import React, { useState } from 'react';
import { SecurityModule } from './types';
import { KeyManager } from './components/KeyManager';
import { UserSecurity } from './components/UserSecurity';
import { DatabaseOps } from './components/DatabaseOps';
import { HardwareLock } from './components/HardwareLock';
import { DiskEncryption } from './components/DiskEncryption';
import { Shield, LayoutDashboard, Database, Key, HardDrive, Lock, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [activeModule, setActiveModule] = useState<SecurityModule>(SecurityModule.KEY_MGMT);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const NavItem = ({ module, icon: Icon, label }: { module: SecurityModule, icon: any, label: string }) => (
    <button
      onClick={() => {
        setActiveModule(module);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        activeModule === module 
          ? 'bg-slate-800 text-emerald-400 shadow-lg shadow-black/20' 
          : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium tracking-wide">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-slate-900 border-b border-slate-800 p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-500 font-bold">
          <Shield size={24} /> SentinelKey
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-200">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-20 w-64 h-full bg-slate-900 border-r border-slate-800 flex flex-col
        transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 border-b border-slate-800 hidden md:flex items-center gap-2">
          <Shield className="text-emerald-500" size={28} />
          <div>
            <h1 className="text-slate-100 font-bold text-lg leading-none">SentinelKey</h1>
            <span className="text-slate-500 text-xs">Ubuntu 24.04 Guard</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <NavItem module={SecurityModule.KEY_MGMT} icon={Key} label="Key & License" />
          <NavItem module={SecurityModule.USER_SECURITY} icon={LayoutDashboard} label="User Control" />
          <NavItem module={SecurityModule.DATABASE_OPS} icon={Database} label="Database Ops" />
          <NavItem module={SecurityModule.DISK_ENCRYPTION} icon={HardDrive} label="Disk Encryption" />
          <NavItem module={SecurityModule.HARDWARE_LOCK} icon={Lock} label="Hardware Seal" />
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-950 rounded p-3 text-xs text-slate-500 font-mono">
            <div className="flex justify-between mb-1">
              <span>Kernel:</span> <span className="text-slate-300">6.8.0-31-generic</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span> <span className="text-emerald-500">PROTECTED</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-950 relative">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        
        {activeModule === SecurityModule.KEY_MGMT && <KeyManager />}
        {activeModule === SecurityModule.USER_SECURITY && <UserSecurity />}
        {activeModule === SecurityModule.DATABASE_OPS && <DatabaseOps />}
        {activeModule === SecurityModule.DISK_ENCRYPTION && <DiskEncryption />}
        {activeModule === SecurityModule.HARDWARE_LOCK && <HardwareLock />}
      </main>

      {/* Overlay for mobile */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};

export default App;