import React, { useState, useEffect } from 'react';
import { expeditionAPI, clientAPI, destinationAPI, typeServiceAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const ExpeditionManagement = ({ onBack }) => {
  const [expeditions, setExpeditions] = useState([]);
  const [clients, setClients] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingExpedition, setEditingExpedition] = useState(null);
  const [filterStatut, setFilterStatut] = useState('');
  const [formData, setFormData] = useState({
    client: '',
    destination: '',
    service: '',
    poids: '',
    volume: '',
    description: '',
    statut: 'EN_TRANSIT'
  });

  const statusOptions = [
    { value: 'EN_TRANSIT', label: 'En transit', color: 'blue' },
    { value: 'CENTRE_TRI', label: 'En centre de tri', color: 'yellow' },
    { value: 'LIVRAISON', label: 'En cours de livraison', color: 'purple' },
    { value: 'LIVRE', label: 'Livré', color: 'green' },
    { value: 'ECHEC', label: 'Échec', color: 'red' },
  ];

  useEffect(() => {
    fetchAll();
  }, [filterStatut]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = filterStatut ? { statut: filterStatut } : {};
      const [expResponse, clientsResponse, destResponse, servResponse] = await Promise.all([
        expeditionAPI.getAll(params),
        clientAPI.getAll(),
        destinationAPI.getAll(),
        typeServiceAPI.getAll()
      ]);
      setExpeditions(expResponse.data);
      setClients(clientsResponse.data);
      setDestinations(destResponse.data);
      setServices(servResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpedition) {
        await expeditionAPI.update(editingExpedition.id, formData);
      } else {
        await expeditionAPI.create(formData);
      }
      fetchAll();
      resetForm();
    } catch (error) {
      console.error('Error saving expedition:', error);
      alert('Erreur lors de l\'enregistrement de l\'expédition');
    }
  };

  const handleEdit = (expedition) => {
    setEditingExpedition(expedition);
    setFormData({
      client: expedition.client,
      destination: expedition.destination,
      service: expedition.service,
      poids: expedition.poids,
      volume: expedition.volume,
      description: expedition.description,
      statut: expedition.statut
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette expédition ?')) {
      try {
        await expeditionAPI.delete(id);
        fetchAll();
      } catch (error) {
        console.error('Error deleting expedition:', error);
        alert('Erreur lors de la suppression de l\'expédition');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      client: '',
      destination: '',
      service: '',
      poids: '',
      volume: '',
      description: '',
      statut: 'EN_TRANSIT'
    });
    setEditingExpedition(null);
    setShowForm(false);
  };

  const getStatusColor = (statut) => {
    const status = statusOptions.find(s => s.value === statut);
    return status ? status.color : 'gray';
  };

  return (
    <div className="p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FaArrowLeft />
          <span>Retour aux Tables</span>
        </button>
      )}

      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Expéditions</h2>
          <p className="text-gray-600 mt-1">Gérer toutes les expéditions avec opérations CRUD complètes</p>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatut}
            onChange={(e) => setFilterStatut(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            <FaPlus /> {showForm ? 'Annuler' : 'Nouvelle Expédition'}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingExpedition ? 'Modifier l\'Expédition' : 'Nouvelle Expédition'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner une destination</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>{dest.ville}, {dest.pays}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de Service</label>
              <select
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionner un service</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>{service.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Poids (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.poids}
                onChange={(e) => setFormData({ ...formData, poids: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Volume (m³)</label>
              <input
                type="number"
                step="0.01"
                value={formData.volume}
                onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                {editingExpedition ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">N° Suivi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Poids/Volume</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {expeditions.map((expedition) => (
                  <tr key={expedition.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{expedition.numero_suivi}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expedition.nom_client}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expedition.ville_destination}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expedition.nom_service}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{expedition.poids}kg / {expedition.volume}m³</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{parseFloat(expedition.montant_total).toFixed(2)} €</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(expedition.statut)}-100 text-${getStatusColor(expedition.statut)}-800`}>
                        {statusOptions.find(s => s.value === expedition.statut)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(expedition)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(expedition.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpeditionManagement;
