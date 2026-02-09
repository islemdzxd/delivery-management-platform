# Manuel d'utilisation — TransportPro

Guide d'utilisation de l'application de gestion des livraisons TransportPro.

---

## 1. Accès et connexion

- **URL :** http://localhost:3000 (après avoir lancé le backend et le frontend).
- **Identifiants :**
  - **Email :** `admin@transport.com`
  - **Mot de passe :** `admin123`

Saisir l’email et le mot de passe puis cliquer sur **Se connecter**. En cas d’erreur, un message s’affiche sous le formulaire.

---

## 2. Navigation

Le **menu latéral** (à gauche) donne accès à :

| Entrée | Rôle |
|--------|------|
| **Tableau de Bord** | Statistiques et indicateurs |
| **Expéditions** | Création et suivi des expéditions |
| **Tournées** | Gestion des tournées (chauffeur, véhicule, date) |
| **Facturation** | Factures clients |
| **Incidents** | Incidents (retard, perte, endommagement, etc.) |
| **Réclamations** | Réclamations clients |
| **Données de Base** | Clients, chauffeurs, véhicules, destinations, types de service, tarification |

En bas du menu : **Paramètres** et **Déconnexion** (icône).

---

## 3. Tableau de bord

Vue d’ensemble : expéditions (total, en cours, livrées), chiffre d’affaires, factures impayées, incidents ouverts, réclamations nouvelles.

- **Top 5 clients** et **Top 5 destinations** (nombre d’expéditions).
- **Graphiques :** répartition des expéditions par statut, tendance sur 6 mois, aperçu financier.

---

## 4. Données de base

Cliquer sur **Données de Base** pour afficher les cartes (Clients, Chauffeurs, Véhicules, Destinations, Types de service, Tarification). Cliquer sur une carte pour ouvrir la gestion correspondante. **Retour aux Tables** pour revenir à la liste des cartes.

### 4.1 Clients

- **Liste :** Nom, Téléphone, Adresse, Solde (€), Actions.
- **Nouveau client :** bouton **Nouveau Client** → formulaire (Nom, Téléphone, Adresse, Solde) → **Créer** ou **Annuler**.
- **Modifier :** icône crayon sur une ligne → modifier les champs → **Mettre à jour**.
- **Supprimer :** icône poubelle → confirmer.

### 4.2 Chauffeurs

- **Liste :** Nom, N° permis, Disponible (oui/non), Actions.
- **Nouveau chauffeur :** **Nouveau Chauffeur** → Nom, Permis, case **Disponible** → **Créer**.
- **Modifier** (icône crayon) / **Supprimer** (icône poubelle, avec confirmation).

### 4.3 Véhicules

- **Liste :** Matricule, Type, Capacité (kg ou m³), Actions.
- **Nouveau véhicule :** **Nouveau Véhicule** → Matricule, Type, Capacité → **Créer**.
- **Modifier** / **Supprimer** comme pour les chauffeurs.

### 4.4 Destinations

- **Liste :** Ville, Pays, Tarif de base (€), Actions.
- **Nouvelle destination :** **Nouvelle Destination** → Ville, Pays, Tarif base → **Créer**.
- **Modifier** / **Supprimer** comme ci‑dessus.

### 4.5 Types de service

- **Liste :** Nom, Tarif au kg, Tarif au m³, Actions.
- **Nouveau type :** **Nouveau Type** → Nom, Tarif poids, Tarif volume → **Créer**.
- **Modifier** / **Supprimer** idem.

### 4.6 Tarification

Ouvre la **Gestion des Expéditions** (voir section 5). Le montant d’une expédition est calculé automatiquement à partir de la destination et du type de service (tarif base + poids × tarif poids + volume × tarif volume).

---

## 5. Expéditions

- **Filtre :** liste déroulante **Tous les statuts** pour filtrer (En transit, Centre de tri, Livraison, Livré, Échec).
- **Nouvelle expédition :** **Nouvelle Expédition** → Client, Destination, Type de service, Poids (kg), Volume (m³), Description, Statut → **Créer**. Le **N° de suivi** et le **montant** sont générés automatiquement.
- **Modifier :** icône crayon → modifier (dont le statut) → **Mettre à jour**.
- **Supprimer :** icône poubelle → confirmer.

---

## 6. Tournées

- **Liste :** N° tournée, Date, Chauffeur, Véhicule, Statut (Planifiée, En cours, Terminée, Annulée), Actions.
- **Nouvelle tournée :** **Nouvelle Tournée** → Date, Chauffeur, Véhicule, Statut, Commentaire → **Créer**.
- **Modifier** (icône crayon) / **Supprimer** (icône poubelle, avec confirmation).

---

## 7. Facturation

- **Liste :** N° facture, Client, Montant TTC, Échéance, Statut (Brouillon, Émise, Payée, Annulée), Actions (œil pour détail).
- **Nouvelle facture :** **Nouvelle Facture** → Client, Date d’échéance, Montant HT, Taux TVA → **Créer**. La TVA et le TTC sont calculés automatiquement.

---

## 8. Incidents

- **Liste :** Expédition liée, Type (Retard, Perte, Endommagement, Autre), Description, Statut (Ouvert, En cours, Résolu, Clos), Actions.
- **Nouvel incident :** **Nouvel Incident** → Expédition, Type, Description, Statut → **Créer**.
- **Modifier** / **Supprimer** selon les actions disponibles dans le tableau.

---

## 9. Réclamations

- **Liste :** Client, Type (Retard, Qualité, Facturation, Autre), Description, Statut (Nouvelle, En cours, Résolue, Annulée), Actions.
- **Nouvelle réclamation :** **Nouvelle Réclamation** → Client, Type, Description, Statut → **Créer**.
- **Modifier** / **Supprimer** selon les actions affichées.

-----------------

## 10. Déconnexion

Cliquer sur l’icône **Déconnexion** en bas à gauche du menu. La session est fermée et l’écran de connexion s’affiche.

------------------

## Raccourcis utiles

- **Retour :** boutons **Retour aux Tables**, **Retour au Dashboard** en haut à gauche selon l’écran.
- **Annuler un formulaire :** bouton **Annuler** ou **Nouveau / Nouvelle** une seconde fois pour masquer le formulaire.
- **Suppression :** une boîte de dialogue demande toujours une confirmation avant suppression.
