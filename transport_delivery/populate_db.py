import os
import django
from datetime import datetime, timedelta
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transport_delivery.settings')
django.setup()

from core.models import (
    Client, Chauffeur, Vehicule, Destination, TypeService, Expedition,
    Tournee, Facture, Incident, Reclamation
)

def populate():
    print("Populating database with sample data...")
    
    # Clear existing data
    print("Clearing existing data...")
    Reclamation.objects.all().delete()
    Incident.objects.all().delete()
    Facture.objects.all().delete()
    Tournee.objects.all().delete()
    Expedition.objects.all().delete()
    TypeService.objects.all().delete()
    Destination.objects.all().delete()
    Vehicule.objects.all().delete()
    Chauffeur.objects.all().delete()
    Client.objects.all().delete()
    
    # Create Clients
    print("Creating clients...")
    clients = [
        Client.objects.create(nom="Entreprise Dupont", adresse="123 Rue de la Paix, Paris", telephone="0123456789", solde=Decimal("1500.00")),
        Client.objects.create(nom="SAS Martin", adresse="45 Avenue des Champs, Lyon", telephone="0234567890", solde=Decimal("2300.50")),
        Client.objects.create(nom="SARL Durand", adresse="78 Boulevard Victor Hugo, Marseille", telephone="0345678901", solde=Decimal("890.75")),
        Client.objects.create(nom="Transport Bernard", adresse="12 Place de la République, Toulouse", telephone="0456789012", solde=Decimal("3200.00")),
        Client.objects.create(nom="Logistique Petit", adresse="90 Rue du Commerce, Nice", telephone="0567890123", solde=Decimal("450.25")),
    ]
    
    # Create Chauffeurs
    print("Creating chauffeurs...")
    chauffeurs = [
        Chauffeur.objects.create(nom="Jean Lefebvre", permis="B123456", disponible=True),
        Chauffeur.objects.create(nom="Marie Dubois", permis="B234567", disponible=True),
        Chauffeur.objects.create(nom="Pierre Moreau", permis="B345678", disponible=False),
        Chauffeur.objects.create(nom="Sophie Laurent", permis="B456789", disponible=True),
    ]
    
    # Create Vehicules
    print("Creating vehicules...")
    vehicules = [
        Vehicule.objects.create(matricule="AA-123-BB", type_vehicule="Camion 12T", capacite=12000),
        Vehicule.objects.create(matricule="CC-456-DD", type_vehicule="Fourgon", capacite=3500),
        Vehicule.objects.create(matricule="EE-789-FF", type_vehicule="Camion 20T", capacite=20000),
        Vehicule.objects.create(matricule="GG-012-HH", type_vehicule="Camionnette", capacite=1500),
    ]
    
    # Create Destinations
    print("Creating destinations...")
    destinations = [
        Destination.objects.create(ville="Paris", pays="France", tarif_base=Decimal("50.00")),
        Destination.objects.create(ville="Lyon", pays="France", tarif_base=Decimal("75.00")),
        Destination.objects.create(ville="Marseille", pays="France", tarif_base=Decimal("85.00")),
        Destination.objects.create(ville="Toulouse", pays="France", tarif_base=Decimal("90.00")),
        Destination.objects.create(ville="Bruxelles", pays="Belgique", tarif_base=Decimal("120.00")),
        Destination.objects.create(ville="Amsterdam", pays="Pays-Bas", tarif_base=Decimal("150.00")),
    ]
    
    # Create TypeService
    print("Creating types de service...")
    services = [
        TypeService.objects.create(nom="Standard", tarif_poids=Decimal("0.50"), tarif_volume=Decimal("10.00")),
        TypeService.objects.create(nom="Express", tarif_poids=Decimal("1.00"), tarif_volume=Decimal("20.00")),
        TypeService.objects.create(nom="Premium", tarif_poids=Decimal("1.50"), tarif_volume=Decimal("30.00")),
    ]
    
    # Create Expeditions
    print("Creating expeditions...")
    expeditions = []
    statuts = ['EN_TRANSIT', 'CENTRE_TRI', 'LIVRAISON', 'LIVRE', 'ECHEC']
    
    for i in range(15):
        exp = Expedition.objects.create(
            client=clients[i % len(clients)],
            destination=destinations[i % len(destinations)],
            service=services[i % len(services)],
            poids=50 + (i * 10),
            volume=2 + (i * 0.5),
            description=f"Colis {i+1} - Matériel informatique",
            statut=statuts[i % len(statuts)]
        )
        expeditions.append(exp)
    
    # Create Tournees
    print("Creating tournees...")
    tournees = []
    for i in range(3):
        tournee = Tournee.objects.create(
            date=datetime.now().date() + timedelta(days=i),
            chauffeur=chauffeurs[i],
            vehicule=vehicules[i],
            statut=['PLANIFIEE', 'EN_COURS', 'TERMINEE'][i % 3],
            commentaire=f"Tournée {i+1}"
        )
        tournees.append(tournee)
    
    # Create Factures
    print("Creating factures...")
    factures = []
    for i in range(5):
        facture = Facture.objects.create(
            client=clients[i],
            date_echeance=datetime.now().date() + timedelta(days=30),
            montant_ht=Decimal("1000.00") + (i * 500),
            taux_tva=Decimal("19.0"),
            statut=['BROUILLON', 'EMISE', 'PAYEE'][i % 3]
        )
        factures.append(facture)
    
    # Create Incidents
    print("Creating incidents...")
    for i in range(3):
        Incident.objects.create(
            expedition=expeditions[i],
            type_incident=['RETARD', 'PERTE', 'ENDOMMAGEMENT'][i],
            description=f"Incident {i+1} - Description détaillée",
            statut=['OUVERT', 'EN_COURS', 'RESOLU'][i % 3]
        )
    
    # Create Reclamations
    print("Creating reclamations...")
    for i in range(3):
        Reclamation.objects.create(
            client=clients[i],
            expedition=expeditions[i],
            type_reclamation=['RETARD', 'QUALITE', 'FACTURATION'][i],
            description=f"Réclamation {i+1} - Le client n'est pas satisfait",
            statut=['NOUVELLE', 'EN_COURS', 'RESOLUE'][i % 3]
        )
    
    print("Database populated successfully!")
    print(f"Created: {Client.objects.count()} clients")
    print(f"Created: {Chauffeur.objects.count()} chauffeurs")
    print(f"Created: {Vehicule.objects.count()} vehicules")
    print(f"Created: {Destination.objects.count()} destinations")
    print(f"Created: {TypeService.objects.count()} types de service")
    print(f"Created: {Expedition.objects.count()} expeditions")
    print(f"Created: {Tournee.objects.count()} tournees")
    print(f"Created: {Facture.objects.count()} factures")
    print(f"Created: {Incident.objects.count()} incidents")
    print(f"Created: {Reclamation.objects.count()} reclamations")

if __name__ == '__main__':
    populate()
