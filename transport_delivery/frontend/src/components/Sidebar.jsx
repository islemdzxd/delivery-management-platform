import React from 'react';
import { FaHome, FaRoute, FaTruck, FaFileInvoice, FaTable, FaExclamationTriangle, FaCommentDots, FaCog, FaSignOutAlt, FaUser, FaChartLine } from 'react-icons/fa';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const username = localStorage.getItem('username') || 'Admin';
  
  const menuItems = [
    { id: 'dashboard', name: 'Tableau de Bord', icon: FaChartLine },
    { id: 'shipments', name: 'Expéditions', icon: FaTruck },
    { id: 'quick-access', name: 'Tournées', icon: FaRoute },
    { id: 'billing', name: 'Facturation', icon: FaFileInvoice },
    { id: 'incidents', name: 'Incidents', icon: FaExclamationTriangle },
    { id: 'complaints', name: 'Réclamations', icon: FaCommentDots },
    { id: 'tables', name: 'Données de Base', icon: FaTable },
  ];

  return (
    <div className="w-64 bg-slate-900 h-screen flex flex-col text-white">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold">TransportPro</h1>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className="text-lg" />
              <span>{item.name}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile & Settings */}
      <div className="border-t border-slate-800">
        <div className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold uppercase">
            {username.substring(0, 2)}
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold">{username}</div>
            <div className="text-xs text-slate-400">Administrateur</div>
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <button className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition">
            <FaCog /> Paramètres
          </button>
          <button 
            onClick={onLogout}
            className="flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm ml-auto transition"
            title="Déconnexion"
          >
            <FaSignOutAlt />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
