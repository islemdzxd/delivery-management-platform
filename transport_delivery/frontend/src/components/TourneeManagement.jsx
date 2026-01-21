import React, { useState, useEffect } from 'react';
import { tourneeAPI, chauffeurAPI, vehiculeAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const TourneeManagement = ({ onBack }) => {
  const [tournees, setTournees] = useState([]);
  const [chauffeurs, setChauffeurs] = useState([]);
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingTournee, setEditingTournee] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    chauffeur: '',
    vehicule: '',
    statut: 'PLANIFIEE',
    commentaire: ''
  });

  const statusOptions = [
    { value: 'PLANIFIEE', label: 'Planifiée', color: 'blue' },
    { value: 'EN_COURS', label: 'En cours', color: 'yellow' },
    { value: 'TERMINEE', label: 'Terminée', color: 'green' },
    { value: 'ANNULEE', label: 'Annulée', color: 'red' },
  ];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [tourneeRes, chauffeurRes, vehiculeRes] = await Promise.all([
        tourneeAPI.getAll(),
        chauffeurAPI.getAll(),
        vehiculeAPI.getAll()
      ]);
      setTournees(tourneeRes.data);
      setChauffeurs(chauffeurRes.data);
      setVehicules(vehiculeRes.data);
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
      if (editingTournee) {
        await tourneeAPI.update(editingTournee.id, formData);
      } else {
        await tourneeAPI.create(formData);
      }
      fetchAll();
      resetForm();
    } catch (error) {
      console.error('Error saving tournee:', error);
      alert('Erreur lors de l\'enregistrement de la tournée');
    }
  };

  const handleEdit = (tournee) => {
    setEditingTournee(tournee);
    setFormData({
      date: tournee.date,
      chauffeur: tournee.chauffeur || '',
      vehicule: tournee.vehicule || '',
      statut: tournee.statut,
      commentaire: tournee.commentaire || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tournée ?')) {
      try {
        await tourneeAPI.delete(id);
        fetchAll();
      } catch (error) {
        console.error('Error deleting tournee:', error);
        alert('Erreur lors de la suppression de la tournée');
      }
    }
  };

  const resetForm = () => {
    setFormData({ date: '', chauffeur: '', vehicule: '', statut: 'PLANIFIEE', commentaire: '' });
    setEditingTournee(null);
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
          <span>Retour au Dashboard</span>
        </button>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Tournées</h2>
          <p className="text-gray-600 mt-1">Gérer toutes les tournées avec opérations CRUD complètes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <FaPlus /> {showForm ? 'Annuler' : 'Nouvelle Tournée'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h3 className="text-2xl font-semibold mb-6 text-gray-900">
            {editingTournee ? 'Modifier la Tournée' : 'Nouvelle Tournée'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chauffeur</label>
              <select
                value={formData.chauffeur}
                onChange={(e) => setFormData({ ...formData, chauffeur: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un chauffeur</option>
                {chauffeurs.map(c => (
                  <option key={c.id} value={c.id}>{c.nom}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Véhicule</label>
              <select
                value={formData.vehicule}
                onChange={(e) => setFormData({ ...formData, vehicule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner un véhicule</option>
                {vehicules.map(v => (
                  <option key={v.id} value={v.id}>{v.matricule} - {v.type_vehicule}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                value={formData.statut}
                onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
              <textarea
                value={formData.commentaire}
                onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md font-medium">
                {editingTournee ? 'Mettre à jour' : 'Créer'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-medium">
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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">N° Tournée</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chauffeur</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Véhicule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tournees.map((tournee) => (
                  <tr key={tournee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{tournee.numero_tournee}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{new Date(tournee.date).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tournee.chauffeur_nom || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{tournee.vehicule_matricule || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(tournee.statut)}-100 text-${getStatusColor(tournee.statut)}-800`}>
                        {statusOptions.find(s => s.value === tournee.statut)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button onClick={() => handleEdit(tournee)} className="text-blue-600 hover:text-blue-800 mr-3">
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(tournee.id)} className="text-red-600 hover:text-red-800">
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

export default TourneeManagement;
