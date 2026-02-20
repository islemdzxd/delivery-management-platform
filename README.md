# TransportPro — Système de Gestion des Livraisons

Application web full‑stack de gestion d’une société de transport : expéditions, tournées, facturation, incidents et réclamations.

---

## Résumé








- **Backend :** Django 6 + Django REST Framework, API REST, SQLite  
- **Frontend :** React 18, Vite, Tailwind CSS  
- **Fonctionnalités :** clients, chauffeurs, véhicules, destinations, types de service, expéditions (suivi, tarification auto), tournées, factures, paiements, incidents, réclamations, tableau de bord analytique, authentification par email

---

## Stack technique

| Couche      | Technologies                          |
|------------|----------------------------------------|
| Backend    | Python, Django 6, DRF, django-cors-headers |
| Frontend   | React, Vite, Tailwind, Axios, Recharts, React Router |
| Base de données | SQLite                              |

---

## Structure du projet

```
(racine du dépôt)
├── README.md
├── MANUEL_UTILISATION.md        # Guide d'utilisation de l'application
├── .gitignore, .gitattributes
└── transport_delivery/
    ├── core/                    # App : modèles, vues, serializers, admin
    ├── transport_delivery/      # Django : settings, urls
    ├── frontend/                # React + Vite + Tailwind
    ├── manage.py, create_admin.py, populate_db.py, requirements.txt
    └── ...
```

► **Guide utilisateur :** [MANUEL_UTILISATION.md](MANUEL_UTILISATION.md)

---







## Prérequis

- **Python 3.10+**
- **Node.js 18+**
- **npm** ou **yarn**

---

## Installation

### 1. Backend

```bash
cd transport_delivery          # dossier où se trouve manage.py
python -m venv venv

# Windows (PowerShell)
venv\Scripts\Activate.ps1

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
python manage.py migrate
python create_admin.py
```

*(Optionnel : `python populate_db.py` pour des données de démo.)*

### 2. Frontend

```bash
cd transport_delivery/frontend
npm install
```

---

## Lancer l’application

**Terminal 1 — Backend :**

```bash
cd transport_delivery
venv\Scripts\Activate.ps1     # Windows | Linux/Mac : source venv/bin/activate
python manage.py runserver
```

→ API : **http://localhost:8000** | Admin Django : **http://localhost:8000/admin/**

**Terminal 2 — Frontend :**

```bash
cd transport_delivery/frontend
npm run dev
```

→ App : **http://localhost:3000**

---

## Comptes de connexion

**Compte principal (frontend et Django Admin) :**

- **Email :** `admin@transport.com`
- **Mot de passe :** `admin123`

Pour le **Django Admin** (http://localhost:8000/admin/) : identifiant `admin`, mot de passe `admin123`.

*(Compte de secours : `test@test.com` / `test123`.)*

---

## API (exemples)

- `GET/POST /api/clients/`
- `GET/POST /api/expeditions/`
- `GET/POST /api/chauffeurs/`, `/api/vehicules/`, `/api/destinations/`, `/api/types-service/`
- `GET/POST /api/tournees/`, `/api/factures/`, `/api/paiements/`
- `GET/POST /api/incidents/`, `/api/reclamations/`
- `POST /api/login/` (email + password)
- `GET /api/analytics/` (statistiques)

---





