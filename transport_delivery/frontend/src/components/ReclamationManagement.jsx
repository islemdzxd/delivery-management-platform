import React, { useState, useEffect } from 'react';
import { reclamationAPI, clientAPI } from '../services/api';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';

const ReclamationManagement = ({ onBack }) => {
  const [reclamations, setReclamations] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    type_reclamation: 'RETARD',
    description: '',
    statut: 'NOUVELLE'
  });

  const typeOptions = [
    { value: 'RETARD', label: 'Retard de livraison' },
    { value: 'QUALITE', label: 'Qualité de service' },
    { value: 'FACTURATION', label: 'Problème de facturation' },
    { value: 'AUTRE', label: 'Autre' },
  ];

  const statusOptions = [
    { value: 'NOUVELLE', label: 'Nouvelle', color: 'blue' },
    { value: 'EN_COURS', label: 'En cours', color: 'yellow' },
    { value: 'RESOLUE', label: 'Résolue', color: 'green' },
    { value: 'ANNULEE', label: 'Annulée', color: 'red' },
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [reclRes, clientRes] = await Promise.all([
        reclamationAPI.getAll(),
        clientAPI.getAll()
      ]);
      setReclamations(reclRes.data);
      setClients(clientRes.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await reclamationAPI.create(formData);
      fetchAll();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const resetForm = () => {
    setFormData({ client: '', type_reclamation: 'RETARD', description: '', statut: 'NOUVELLE' });
    setShowForm(false);
  };

  return (
    <div className="p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <FaArrowLeft />
          <span>Retour au Dashboard</span>
        </button>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Réclamations</h2>
          <p className="text-gray-600 mt-1">Gérer toutes les réclamations avec opérations CRUD complètes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <FaPlus /> {showForm ? 'Annuler' : 'Nouvelle Réclamation'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">Nouvelle Réclamation</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Sélectionner un client</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type_reclamation}
                onChange={(e) => setFormData({ ...formData, type_reclamation: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {typeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows="3"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Créer</button>
              <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md">Annuler</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="text-center py-8">Chargement...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Réclamation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reclamations.map((recl) => (
                <tr key={recl.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{recl.numero_reclamation}</td>
                  <td className="px-6 py-4">{recl.client_nom}</td>
                  <td className="px-6 py-4">{typeOptions.find(t => t.value === recl.type_reclamation)?.label}</td>
                  <td className="px-6 py-4">{recl.description}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${statusOptions.find(s => s.value === recl.statut)?.color}-100`}>
                      {statusOptions.find(s => s.value === recl.statut)?.label}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ReclamationManagement;
