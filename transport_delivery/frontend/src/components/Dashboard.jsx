import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TablesManagement from './TablesManagement';
import ClientManagement from './ClientManagement';
import ExpeditionManagement from './ExpeditionManagement';
import ChauffeurManagement from './ChauffeurManagement';
import VehiculeManagement from './VehiculeManagement';
import DestinationManagement from './DestinationManagement';
import TypeServiceManagement from './TypeServiceManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import TourneeManagement from './TourneeManagement';
import FactureManagement from './FactureManagement';
import IncidentManagement from './IncidentManagement';
import ReclamationManagement from './ReclamationManagement';

const Dashboard = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedTable, setSelectedTable] = useState(null);

  const handleTableSelect = (tableId) => {
    setSelectedTable(tableId);
  };

  const handleBackToTables = () => {
    setSelectedTable(null);
  };

  const renderContent = () => {
    // Handle Tables submenu
    if (activeTab === 'tables') {
      if (selectedTable === 'clients') return <ClientManagement onBack={handleBackToTables} />;
      if (selectedTable === 'drivers') return <ChauffeurManagement onBack={handleBackToTables} />;
      if (selectedTable === 'vehicles') return <VehiculeManagement onBack={handleBackToTables} />;
      if (selectedTable === 'destinations') return <DestinationManagement onBack={handleBackToTables} />;
      if (selectedTable === 'service-types') return <TypeServiceManagement onBack={handleBackToTables} />;
      if (selectedTable === 'pricing') return <ExpeditionManagement onBack={handleBackToTables} />;
      return <TablesManagement onSelectTable={handleTableSelect} />;
    }

    // Handle other main menu items
    switch (activeTab) {
      case 'dashboard':
        return <AnalyticsDashboard />;
      case 'quick-access':
        return <TourneeManagement onBack={() => setActiveTab('dashboard')} />;
      case 'shipments':
        return <ExpeditionManagement onBack={() => setActiveTab('dashboard')} />;
      case 'billing':
        return <FactureManagement onBack={() => setActiveTab('dashboard')} />;
      case 'incidents':
        return <IncidentManagement onBack={() => setActiveTab('dashboard')} />;
      case 'complaints':
        return <ReclamationManagement onBack={() => setActiveTab('dashboard')} />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
      <div className="flex-1 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Dashboard;
