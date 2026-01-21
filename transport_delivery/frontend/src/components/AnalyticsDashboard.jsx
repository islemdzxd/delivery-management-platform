import React, { useState, useEffect } from 'react';
import { analyticsAPI, expeditionAPI } from '../services/api';
import { FaTruck, FaEuroSign, FaExclamationTriangle, FaUsers, FaMapMarkerAlt } from 'react-icons/fa';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const AnalyticsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expeditions, setExpeditions] = useState([]);
  const [expeditionTrend, setExpeditionTrend] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchExpeditions();
    fetchExpeditionTrend();
    fetchStatusDistribution();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await analyticsAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpeditions = async () => {
    try {
      const response = await expeditionAPI.getAll();
      setExpeditions(response.data);
    } catch (error) {
      console.error('Error fetching expeditions:', error);
    }
  };

  const fetchExpeditionTrend = async () => {
    try {
      const response = await analyticsAPI.getExpeditionTrend();
      setExpeditionTrend(response.data);
    } catch (error) {
      console.error('Error fetching expedition trend:', error);
    }
  };

  const fetchStatusDistribution = async () => {
    try {
      const response = await analyticsAPI.getStatusDistribution();
      setStatusDistribution(response.data);
    } catch (error) {
      console.error('Error fetching status distribution:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Chargement des statistiques...</div>;
  }

  if (!stats) {
    return <div className="text-center py-8">Erreur lors du chargement des statistiques</div>;
  }

  // Prepare chart data
  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Status distribution - use backend data if available, fallback to local calculation
  const statusData = statusDistribution.length > 0 ? statusDistribution : [
    { name: 'En Transit', value: expeditions.filter(e => e.statut === 'EN_TRANSIT').length },
    { name: 'Centre de Tri', value: expeditions.filter(e => e.statut === 'CENTRE_TRI').length },
    { name: 'En Livraison', value: expeditions.filter(e => e.statut === 'LIVRAISON').length },
    { name: 'Livré', value: expeditions.filter(e => e.statut === 'LIVRE').length },
    { name: 'Échec', value: expeditions.filter(e => e.statut === 'ECHEC').length },
  ].filter(item => item.value > 0);

  // Top clients for bar chart
  const clientChartData = stats.top_clients.map(client => ({
    nom: client.nom,
    expeditions: client.nb_expeditions
  }));

  // Top destinations for bar chart
  const destinationChartData = stats.top_destinations.map(dest => ({
    ville: dest.ville,
    expeditions: dest.nb_expeditions
  }));

  // Financial data
  const financialData = [
    { name: 'Chiffre d\'Affaires', montant: stats.financier.chiffre_affaires },
    { name: 'Factures Impayées', montant: stats.financier.factures_impayees },
  ];

  // Use backend trend data if available, otherwise use simulation
  const trendData = expeditionTrend.length > 0 ? expeditionTrend : [
    { mois: 'Juil', expeditions: Math.floor(stats.expeditions.total * 0.7) },
    { mois: 'Août', expeditions: Math.floor(stats.expeditions.total * 0.75) },
    { mois: 'Sept', expeditions: Math.floor(stats.expeditions.total * 0.8) },
    { mois: 'Oct', expeditions: Math.floor(stats.expeditions.total * 0.85) },
    { mois: 'Nov', expeditions: Math.floor(stats.expeditions.total * 0.9) },
    { mois: 'Déc', expeditions: stats.expeditions.total },
  ];

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1 font-medium">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800">{value}</h3>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-4 rounded-full bg-${color}-100`}>
          <Icon className={`text-3xl text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Tableau de Bord Analytique</h2>
        <p className="text-gray-600 mt-1">Vue d'ensemble des statistiques et performances</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={FaTruck}
          title="Total Expéditions"
          value={stats.expeditions.total}
          subtitle={`${stats.expeditions.ce_mois} ce mois`}
          color="blue"
        />
        <StatCard
          icon={FaTruck}
          title="En Cours"
          value={stats.expeditions.en_cours}
          subtitle={`${stats.expeditions.livrees} livrées`}
          color="yellow"
        />
        <StatCard
          icon={FaEuroSign}
          title="Chiffre d'Affaires"
          value={`${stats.financier.chiffre_affaires.toLocaleString('fr-FR')} €`}
          color="green"
        />
        <StatCard
          icon={FaExclamationTriangle}
          title="Factures Impayées"
          value={`${stats.financier.factures_impayees.toLocaleString('fr-FR')} €`}
          color="red"
        />
      </div>

      {/* Alertes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-orange-500 mr-3 text-xl" />
            <div>
              <h4 className="font-semibold text-orange-800 text-lg">Incidents Ouverts</h4>
              <p className="text-orange-700 mt-1">{stats.incidents_ouverts} incident(s) nécessite(nt) votre attention</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-md">
          <div className="flex items-center">
            <FaExclamationTriangle className="text-blue-500 mr-3 text-xl" />
            <div>
              <h4 className="font-semibold text-blue-800 text-lg">Réclamations Nouvelles</h4>
              <p className="text-blue-700 mt-1">{stats.reclamations_nouvelles} réclamation(s) à traiter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Clients */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <FaUsers className="text-2xl text-blue-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Top 5 Clients</h3>
          </div>
          <div className="space-y-3">
            {stats.top_clients.map((client, index) => (
              <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center">
                  <span className="font-bold text-blue-600 mr-3 text-lg">#{index + 1}</span>
                  <span className="font-medium text-gray-800">{client.nom}</span>
                </div>
                <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                  {client.nb_expeditions} exp.
                </span>
              </div>
            ))}
            {stats.top_clients.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun client pour le moment</p>
            )}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <div className="flex items-center mb-6">
            <FaMapMarkerAlt className="text-2xl text-green-600 mr-2" />
            <h3 className="text-xl font-semibold text-gray-900">Top 5 Destinations</h3>
          </div>
          <div className="space-y-3">
            {stats.top_destinations.map((dest, index) => (
              <div key={dest.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center">
                  <span className="font-bold text-green-600 mr-3 text-lg">#{index + 1}</span>
                  <span className="font-medium text-gray-800">{dest.ville}, {dest.pays}</span>
                </div>
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-semibold">
                  {dest.nb_expeditions} exp.
                </span>
              </div>
            ))}
            {stats.top_destinations.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucune destination pour le moment</p>
            )}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Expedition Status Distribution - Pie Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Répartition par Statut</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clients - Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Top Clients (Expéditions)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clientChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nom" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expeditions" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Destinations - Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Top Destinations (Expéditions)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={destinationChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ville" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="expeditions" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Overview - Bar Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
          <h3 className="text-xl font-semibold mb-6 text-gray-900">Aperçu Financier</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={financialData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `${value.toLocaleString('fr-FR')} €`} />
              <Bar dataKey="montant" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Expedition Trend - Line Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-xl font-semibold mb-6 text-gray-900">Tendance des Expéditions (6 derniers mois)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expeditions" stroke="#3B82F6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
