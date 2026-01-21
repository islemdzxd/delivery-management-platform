import React, { useState, useEffect } from 'react';
import { factureAPI, clientAPI } from '../services/api';
import { FaPlus, FaEdit, FaEye, FaArrowLeft } from 'react-icons/fa';

const FactureManagement = ({ onBack }) => {
  const [factures, setFactures] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client: '',
    date_echeance: '',
    montant_ht: '',
    taux_tva: '19.0',
    statut: 'BROUILLON'
  });

  const statusOptions = [
    { value: 'BROUILLON', label: 'Brouillon', color: 'gray' },
    { value: 'EMISE', label: 'Émise', color: 'blue' },
    { value: 'PAYEE', label: 'Payée', color: 'green' },
    { value: 'ANNULEE', label: 'Annulée', color: 'red' },
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [factureRes, clientRes] = await Promise.all([
        factureAPI.getAll(),
        clientAPI.getAll()
      ]);
      setFactures(factureRes.data);
      setClients(clientRes.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await factureAPI.create(formData);
      fetchAll();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const resetForm = () => {
    setFormData({ client: '', date_echeance: '', montant_ht: '', taux_tva: '19.0', statut: 'BROUILLON' });
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
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Factures</h2>
          <p className="text-gray-600 mt-1">Gérer toutes les factures avec opérations CRUD complètes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <FaPlus /> {showForm ? 'Annuler' : 'Nouvelle Facture'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">Nouvelle Facture</h3>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
              <input
                type="date"
                value={formData.date_echeance}
                onChange={(e) => setFormData({ ...formData, date_echeance: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT (€)</label>
              <input
                type="number"
                step="0.01"
                value={formData.montant_ht}
                onChange={(e) => setFormData({ ...formData, montant_ht: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Taux TVA (%)</label>
              <input
                type="number"
                step="0.01"
                value={formData.taux_tva}
                onChange={(e) => setFormData({ ...formData, taux_tva: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                Créer
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400">
                Annuler
              </button>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Facture</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant TTC</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Échéance</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {factures.map((facture) => (
                <tr key={facture.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{facture.numero_facture}</td>
                  <td className="px-6 py-4">{facture.client_nom}</td>
                  <td className="px-6 py-4 font-semibold">{parseFloat(facture.montant_ttc).toFixed(2)} €</td>
                  <td className="px-6 py-4">{new Date(facture.date_echeance).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${statusOptions.find(s => s.value === facture.statut)?.color}-100`}>
                      {statusOptions.find(s => s.value === facture.statut)?.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-blue-600 hover:text-blue-800">
                      <FaEye />
                    </button>
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

export default FactureManagement;
