import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Client API
export const clientAPI = {
  getAll: () => api.get('/clients/'),
  get: (id) => api.get(`/clients/${id}/`),
  create: (data) => api.post('/clients/', data),
  update: (id, data) => api.put(`/clients/${id}/`, data),
  delete: (id) => api.delete(`/clients/${id}/`),
};

// Chauffeur API
export const chauffeurAPI = {
  getAll: () => api.get('/chauffeurs/'),
  get: (id) => api.get(`/chauffeurs/${id}/`),
  create: (data) => api.post('/chauffeurs/', data),
  update: (id, data) => api.put(`/chauffeurs/${id}/`, data),
  delete: (id) => api.delete(`/chauffeurs/${id}/`),
};

// Vehicule API
export const vehiculeAPI = {
  getAll: () => api.get('/vehicules/'),
  get: (id) => api.get(`/vehicules/${id}/`),
  create: (data) => api.post('/vehicules/', data),
  update: (id, data) => api.put(`/vehicules/${id}/`, data),
  delete: (id) => api.delete(`/vehicules/${id}/`),
};

// Destination API
export const destinationAPI = {
  getAll: () => api.get('/destinations/'),
  get: (id) => api.get(`/destinations/${id}/`),
  create: (data) => api.post('/destinations/', data),
  update: (id, data) => api.put(`/destinations/${id}/`, data),
  delete: (id) => api.delete(`/destinations/${id}/`),
};

// TypeService API
export const typeServiceAPI = {
  getAll: () => api.get('/types-service/'),
  get: (id) => api.get(`/types-service/${id}/`),
  create: (data) => api.post('/types-service/', data),
  update: (id, data) => api.put(`/types-service/${id}/`, data),
  delete: (id) => api.delete(`/types-service/${id}/`),
};

// Expedition API
export const expeditionAPI = {
  getAll: (params) => api.get('/expeditions/', { params }),
  get: (id) => api.get(`/expeditions/${id}/`),
  create: (data) => api.post('/expeditions/', data),
  update: (id, data) => api.put(`/expeditions/${id}/`, data),
  delete: (id) => api.delete(`/expeditions/${id}/`),
};

// Tournée API
export const tourneeAPI = {
  getAll: (params) => api.get('/tournees/', { params }),
  get: (id) => api.get(`/tournees/${id}/`),
  create: (data) => api.post('/tournees/', data),
  update: (id, data) => api.put(`/tournees/${id}/`, data),
  delete: (id) => api.delete(`/tournees/${id}/`),
};

// Tracking API
export const trackingAPI = {
  getAll: (params) => api.get('/tracking/', { params }),
  get: (id) => api.get(`/tracking/${id}/`),
  create: (data) => api.post('/tracking/', data),
  update: (id, data) => api.put(`/tracking/${id}/`, data),
  delete: (id) => api.delete(`/tracking/${id}/`),
};

// Facture API
export const factureAPI = {
  getAll: (params) => api.get('/factures/', { params }),
  get: (id) => api.get(`/factures/${id}/`),
  create: (data) => api.post('/factures/', data),
  update: (id, data) => api.put(`/factures/${id}/`, data),
  delete: (id) => api.delete(`/factures/${id}/`),
};

// Paiement API
export const paiementAPI = {
  getAll: (params) => api.get('/paiements/', { params }),
  get: (id) => api.get(`/paiements/${id}/`),
  create: (data) => api.post('/paiements/', data),
  update: (id, data) => api.put(`/paiements/${id}/`, data),
  delete: (id) => api.delete(`/paiements/${id}/`),
};

// Incident API
export const incidentAPI = {
  getAll: (params) => api.get('/incidents/', { params }),
  get: (id) => api.get(`/incidents/${id}/`),
  create: (data) => api.post('/incidents/', data),
  update: (id, data) => api.put(`/incidents/${id}/`, data),
  delete: (id) => api.delete(`/incidents/${id}/`),
};

// Réclamation API
export const reclamationAPI = {
  getAll: (params) => api.get('/reclamations/', { params }),
  get: (id) => api.get(`/reclamations/${id}/`),
  create: (data) => api.post('/reclamations/', data),
  update: (id, data) => api.put(`/reclamations/${id}/`, data),
  delete: (id) => api.delete(`/reclamations/${id}/`),
};

// Analytics API
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard/'),
  getExpeditionTrend: () => api.get('/analytics/expedition_trend/'),
  getStatusDistribution: () => api.get('/analytics/status_distribution/'),
};

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/login/', { email, password }),
};

export default api;
