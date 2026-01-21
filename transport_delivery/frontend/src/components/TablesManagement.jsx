import React, { useState, useEffect } from 'react';
import { FaUsers, FaUserTie, FaCar, FaMapMarkerAlt, FaCog, FaDollarSign } from 'react-icons/fa';
import { clientAPI, chauffeurAPI, vehiculeAPI, destinationAPI, typeServiceAPI, expeditionAPI } from '../services/api';

const TableCard = ({ title, icon: Icon, count, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
      isActive
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 bg-white hover:border-blue-300'
    }`}
  >
    <div className="flex flex-col items-center text-center gap-3">
      <div className={`p-4 rounded-full ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
        <Icon className={`text-3xl ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
      </div>
      <div>
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">{count} enregistrements</p>
      </div>
    </div>
  </button>
);

const TablesManagement = ({ onSelectTable }) => {
  const [counts, setCounts] = useState({
    clients: 0,
    drivers: 0,
    vehicles: 0,
    destinations: 0,
    serviceTypes: 0,
    shipments: 0,
  });
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const [clients, drivers, vehicles, destinations, services, shipments] = await Promise.all([
        clientAPI.getAll(),
        chauffeurAPI.getAll(),
        vehiculeAPI.getAll(),
        destinationAPI.getAll(),
        typeServiceAPI.getAll(),
        expeditionAPI.getAll(),
      ]);

      setCounts({
        clients: clients.data.length,
        drivers: drivers.data.length,
        vehicles: vehicles.data.length,
        destinations: destinations.data.length,
        serviceTypes: services.data.length,
        shipments: shipments.data.length,
      });
    } catch (error) {
      console.error('Error fetching counts:', error);
    }
  };

  const tables = [
    { id: 'clients', title: 'Clients', icon: FaUsers, count: counts.clients },
    { id: 'drivers', title: 'Chauffeurs', icon: FaUserTie, count: counts.drivers },
    { id: 'vehicles', title: 'Véhicules', icon: FaCar, count: counts.vehicles },
    { id: 'destinations', title: 'Destinations', icon: FaMapMarkerAlt, count: counts.destinations },
    { id: 'service-types', title: 'Types de Service', icon: FaCog, count: counts.serviceTypes },
    { id: 'pricing', title: 'Tarification', icon: FaDollarSign, count: counts.shipments },
  ];

  const handleTableClick = (tableId) => {
    setSelectedTable(tableId);
    onSelectTable(tableId);
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Données de Base</h1>
        <p className="text-gray-600 mt-2">Gérer toutes les données de référence avec opérations CRUD complètes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            title={table.title}
            icon={table.icon}
            count={table.count}
            onClick={() => handleTableClick(table.id)}
            isActive={selectedTable === table.id}
          />
        ))}
      </div>
    </div>
  );
};

export default TablesManagement;
