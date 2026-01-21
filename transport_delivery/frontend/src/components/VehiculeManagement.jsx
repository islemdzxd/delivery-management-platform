import React, { useState, useEffect } from 'react';
import { vehiculeAPI } from '../services/api';
import { FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const VehiculeManagement = ({ onBack }) => {
  const [vehicules, setVehicules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicule, setEditingVehicule] = useState(null);
  const [formData, setFormData] = useState({
    matricule: '',
    type_vehicule: '',
    capacite: ''
  });

  useEffect(() => {
    fetchVehicules();
  }, []);

  const fetchVehicules = async () => {
    setLoading(true);
    try {
      const response = await vehiculeAPI.getAll();
      setVehicules(response.data);
    } catch (error) {
      console.error('Error fetching vehicules:', error);
      alert('Erreur lors du chargement des véhicules');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingVehicule) {
        await vehiculeAPI.update(editingVehicule.id, formData);
      } else {
        await vehiculeAPI.create(formData);
      }
      fetchVehicules();
      resetForm();
    } catch (error) {
      console.error('Error saving vehicule:', error);
      alert('Erreur lors de l\'enregistrement du véhicule');
    }
  };

  const handleEdit = (vehicule) => {
    setEditingVehicule(vehicule);
    setFormData(vehicule);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce véhicule ?')) {
      try {
        await vehiculeAPI.delete(id);
        fetchVehicules();
      } catch (error) {
        console.error('Error deleting vehicule:', error);
        alert('Erreur lors de la suppression du véhicule');
      }
    }
  };

  const resetForm = () => {
    setFormData({ matricule: '', type_vehicule: '', capacite: '' });
    setEditingVehicule(null);
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
          <span>Retour aux Tables</span>
        </button>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Gestion des Véhicules</h2>
          <p className="text-gray-600 mt-1">Gérer tous les véhicules avec opérations CRUD complètes</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition shadow-md"
        >
          <FaPlus /> {showForm ? 'Annuler' : 'Nouveau Véhicule'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">
            {editingVehicule ? 'Modifier le Véhicule' : 'Nouveau Véhicule'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Matricule</label>
              <input
                type="text"
                value={formData.matricule}
                onChange={(e) => setFormData({ ...formData, matricule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de Véhicule</label>
              <input
                type="text"
                value={formData.type_vehicule}
                onChange={(e) => setFormData({ ...formData, type_vehicule: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ex: Camion, Fourgon, etc."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (kg ou m³)</label>
              <input
                type="number"
                step="0.01"
                value={formData.capacite}
                onChange={(e) => setFormData({ ...formData, capacite: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
              >
                {editingVehicule ? 'Mettre à jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 mt-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="animate-pulse">Chargement...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Matricule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacité</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {vehicules.map((vehicule) => (
                  <tr key={vehicule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{vehicule.matricule}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicule.type_vehicule}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{vehicule.capacite}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleEdit(vehicule)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(vehicule.id)}
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

export default VehiculeManagement;
