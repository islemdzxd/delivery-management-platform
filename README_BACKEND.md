# 🚚 Système de Gestion de Transport et Livraison - Backend

## 📋 Vue d'ensemble

Ce document présente le développement backend du système de gestion de transport et livraison, réalisé avec **Django** et **Django REST Framework**. Le backend fournit une API REST complète et robuste pour gérer l'ensemble des opérations métier de l'application.

---

## 🎯 Responsabilités et Réalisations

### 1. Développement Backend avec Django

#### Architecture du Projet
- **Framework** : Django 6.0
- **API REST** : Django REST Framework 3.16.1
- **Base de données** : SQLite (développement)
- **CORS** : Configuration pour communication frontend/backend

#### Structure de l'Application
```
transport_delivery/
├── core/                    # Application principale
│   ├── models.py           # Modèles de données (13 entités)
│   ├── views.py            # ViewSets et endpoints API
│   ├── serializers.py      # Serializers pour la sérialisation JSON
│   ├── admin.py            # Interface d'administration Django
│   └── migrations/         # Migrations de base de données
├── transport_delivery/     # Configuration Django
│   ├── settings.py         # Configuration du projet
│   └── urls.py             # Routage des URLs
└── requirements.txt        # Dépendances Python
```

---

### 2. Implémentation de la Logique Métier

#### Modèles de Données (13 Entités)

**Entités Principales :**
- **Client** : Gestion des clients avec solde comptable
- **Chauffeur** : Gestion des chauffeurs avec disponibilité
- **Véhicule** : Gestion de la flotte avec capacité
- **Destination** : Destinations avec tarifs de base
- **TypeService** : Types de services (Standard, Express) avec tarifs

**Entités Métier :**
- **Expedition** : Expéditions avec calcul automatique des prix
- **Tournee** : Planification des tournées de livraison
- **TourneeExpedition** : Lien entre tournées et expéditions
- **TrackingHistorique** : Suivi détaillé des expéditions

**Entités Financières :**
- **Facture** : Facturation avec calcul automatique TVA/TTC
- **FactureExpedition** : Lien factures/expéditions
- **Paiement** : Gestion des paiements (Espèces, Chèque, Virement, Carte)

**Entités Support :**
- **Incident** : Gestion des incidents (Retard, Perte, Endommagement)
- **Reclamation** : Gestion des réclamations clients

#### Logique Métier Implémentée

**1. Calcul Automatique des Prix d'Expédition**
```python
# Formule : Montant = Tarif Base + (Poids × Tarif Poids) + (Volume × Tarif Volume)
def save(self, *args, **kwargs):
    base = self.destination.tarif_base
    cout_poids = Decimal(str(self.poids)) * self.service.tarif_poids
    cout_volume = Decimal(str(self.volume)) * self.service.tarif_volume
    self.montant_total = base + cout_poids + cout_volume
```

**2. Génération Automatique de Numéros Uniques**
- Numéros de suivi d'expédition (UUID)
- Numéros de tournée (format T-XXXXXX)
- Numéros de facture (format F-XXXXXXXX)
- Numéros de réclamation (format R-XXXXXXXX)YEYEYEYsdgsdgg

**3. Calcul Automatique TVA/TTC pour les Factures**
```python
montant_tva = montant_ht * (taux_tva / 100)
montant_ttc = montant_ht + montant_tva
```

**4. Gestion des Statuts**
- Expéditions : En transit → Centre de tri → Livraison → Livré/Échec
- Tournées : Planifiée → En cours → Terminée/Annulée
- Factures : Brouillon → Émise → Payée/Annulée
- Incidents : Ouvert → En cours → Résolu → Clos
- Réclamations : Nouvelle → En cours → Résolue/Annulée

---

### 3. Conception et Intégration des API REST

#### Architecture API REST

**Utilisation de Django REST Framework :**
- **ViewSets** : Implémentation CRUD complète pour toutes les entités
- **Serializers** : Sérialisation/désérialisation avec champs calculés
- **Router** : Routage automatique des endpoints
- **Filtrage** : Filtres dynamiques par statut, client, etc.

#### Endpoints API Implémentés

**Endpoints CRUD Standards (13 entités) :**
```
GET    /api/clients/              # Liste des clients
POST   /api/clients/              # Créer un client
GET    /api/clients/{id}/         # Détails d'un client
PUT    /api/clients/{id}/         # Modifier un client
DELETE /api/clients/{id}/         # Supprimer un client

# Même structure pour :
- /api/chauffeurs/
- /api/vehicules/
- /api/destinations/
- /api/types-service/
- /api/expeditions/
- /api/tournees/
- /api/tracking/
- /api/factures/
- /api/paiements/
- /api/incidents/
- /api/reclamations/
```

**Endpoints Spécialisés :**

**1. Authentification**
```
POST /api/login/
Body: { "email": "...", "password": "..." }
Response: { "success": true, "user": {...} }
```

**2. Analytics Dashboard**
```
GET /api/analytics/dashboard/
Response: {
    "expeditions": {
        "total": 150,
        "en_cours": 45,
        "livrees": 100,
        "ce_mois": 30
    },
    "financier": {
        "chiffre_affaires": 50000.00,
        "factures_impayees": 5000.00
    },
    "top_clients": [...],
    "top_destinations": [...],
    "incidents_ouverts": 5,
    "reclamations_nouvelles": 3
}
```

**3. Tendances des Expéditions**
```
GET /api/analytics/expedition_trend/
Response: [
    { "mois": "Jan", "expeditions": 25, "mois_complet": "January 2025" },
    ...
]
```

**4. Distribution par Statut**
```
GET /api/analytics/status_distribution/
Response: [
    { "name": "Livré", "value": 100, "statut": "LIVRE" },
    ...
]
```

#### Fonctionnalités Avancées des Serializers

**Champs Calculés et Relations :**
```python
class ExpeditionSerializer(serializers.ModelSerializer):
    nom_client = serializers.ReadOnlyField(source='client.nom')
    ville_destination = serializers.ReadOnlyField(source='destination.ville')
    nom_service = serializers.ReadOnlyField(source='service.nom')
    # Permet d'afficher les noms au lieu des IDs dans le JSON
```

**Sérialisation Nested :**
- Tournées avec leurs expéditions détaillées
- Factures avec leurs expéditions associées
- Tracking avec numéro d'expédition

#### Filtrage et Requêtes

**Filtres Implémentés :**
- Expéditions : par `statut`, `client`
- Tournées : par `statut`, `chauffeur`, `date`
- Factures : par `statut`, `client`
- Incidents : par `statut`, `type_incident`, `expedition`
- Réclamations : par `statut`, `client`, `type_reclamation`

**Exemple d'utilisation :**
```
GET /api/expeditions/?statut=LIVRE&client=1
```

---

### 4. Connexion Backend avec Frontend

#### Configuration CORS

**Settings Django :**
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

Permet au frontend React (port 3000) de communiquer avec le backend Django (port 8000).

#### Service API Frontend

**Architecture de Communication :**
- **Base URL** : `http://localhost:8000/api`
- **Client HTTP** : Axios avec configuration centralisée
- **Format** : JSON pour toutes les requêtes/réponses

**Exemple d'Intégration :**
```javascript
// Frontend (api.js)
export const expeditionAPI = {
  getAll: (params) => api.get('/expeditions/', { params }),
  create: (data) => api.post('/expeditions/', data),
  update: (id, data) => api.put(`/expeditions/${id}/`, data),
  delete: (id) => api.delete(`/expeditions/${id}/`),
};

// Utilisation dans les composants React
const expeditions = await expeditionAPI.getAll({ statut: 'LIVRE' });
```

**Endpoints Connectés :**
- ✅ 13 entités avec CRUD complet
- ✅ Authentification (login)
- ✅ Analytics (dashboard, tendances, statistiques)
- ✅ Filtrage dynamique côté backend

---

## 🔧 Technologies et Outils

### Stack Technique
- **Python** 3.x
- **Django** 6.0
- **Django REST Framework** 3.16.1
- **django-cors-headers** 4.9.0
- **SQLite** (développement)

### Bonnes Pratiques Implémentées
- ✅ Architecture MVC/MVT de Django
- ✅ Séparation des responsabilités (models, views, serializers)
- ✅ Migrations de base de données versionnées
- ✅ Interface d'administration Django
- ✅ Gestion des erreurs HTTP appropriées
- ✅ Validation des données via serializers
- ✅ Code modulaire et réutilisable

---

## 📊 Statistiques du Projet

- **13 modèles de données** implémentés
- **13 ViewSets** avec CRUD complet
- **13 Serializers** avec relations et champs calculés
- **15+ endpoints API** REST
- **3 endpoints Analytics** spécialisés
- **1 endpoint d'authentification** personnalisé
- **Logique métier** : Calculs automatiques, génération de numéros, gestion des statuts

---

## 🚀 Installation et Configuration

### Prérequis
- Python 3.8+
- pip (gestionnaire de paquets Python)

### Installation

1. **Créer l'environnement virtuel**
```powershell
cd transport_delivery\transport_delivery
python -m venv venv
venv\Scripts\Activate.ps1
```

2. **Installer les dépendances**
```powershell
pip install -r requirements.txt
```

3. **Configurer la base de données**
```powershell
python manage.py migrate
```

4. **Créer un superutilisateur**
```powershell
python create_admin.py
# Ou manuellement :
python manage.py createsuperuser
```

5. **Lancer le serveur de développement**
```powershell
python manage.py runserver
```

Le backend sera accessible sur `http://localhost:8000`

### Accès à l'Administration Django
- URL : `http://localhost:8000/admin`
- Email : `admin@transport.com`
- Password : `admin123`

---

## 📝 Documentation des API

### Format des Réponses

**Succès :**
```json
{
    "id": 1,
    "nom": "Client Exemple",
    "adresse": "123 Rue Example",
    "telephone": "+33123456789",
    "solde": 0.00
}
```

**Erreur :**
```json
{
    "error": "Message d'erreur descriptif"
}
```

### Codes HTTP Utilisés
- `200 OK` : Requête réussie
- `201 Created` : Ressource créée
- `400 Bad Request` : Données invalides
- `401 Unauthorized` : Authentification requise
- `404 Not Found` : Ressource introuvable
- `500 Internal Server Error` : Erreur serveur

---

## 🎓 Points Forts du Développement

### 1. Architecture Robuste
- Modèles de données bien structurés avec relations appropriées
- Utilisation des ForeignKey, ManyToMany pour l'intégrité référentielle
- Méthodes `save()` personnalisées pour la logique métier

### 2. API REST Complète
- Implémentation standard RESTful
- Serializers enrichis avec données calculées
- Filtrage et recherche intégrés

### 3. Logique Métier Avancée
- Calculs automatiques (prix, TVA, TTC)
- Génération de numéros uniques
- Gestion des statuts avec transitions logiques

### 4. Intégration Frontend
- CORS configuré correctement
- Format JSON standardisé
- Endpoints optimisés pour les besoins du frontend

### 5. Analytics et Reporting
- Endpoints dédiés pour les statistiques
- Agrégations de données complexes
- Tendances et distributions calculées côté serveur

---

## 🔐 Sécurité

- Validation des données via Django REST Framework
- Protection CSRF activée
- Authentification utilisateur implémentée
- Gestion sécurisée des mots de passe (hash Django)

---

## 📈 Améliorations Futures Possibles

- Authentification JWT pour les tokens
- Pagination des résultats API
- Rate limiting pour la protection des endpoints
- Tests unitaires et d'intégration
- Documentation Swagger/OpenAPI
- Migration vers PostgreSQL pour la production
- Cache Redis pour les performances
- Logging structuré

---

## 👨‍💻 Auteur

Développement backend réalisé dans le cadre du projet de gestion de transport et livraison.

**Technologies maîtrisées :**
- Django & Django REST Framework
- Conception de modèles de données complexes
- Développement d'API REST
- Intégration frontend/backend
- Logique métier et calculs automatiques

---

## 📄 Licence

Projet académique - Tous droits réservés



cd C:\Users\lenovo\Downloads\transport_delivery\transport_delivery\transport_delivery\frontend && npm run dev




cd C:\Users\lenovo\Downloads\transport_delivery\transport_delivery\transport_delivery && python manage.py runserver