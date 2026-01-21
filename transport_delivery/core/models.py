from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class Client(models.Model):
    nom = models.CharField(max_length=100)
    adresse = models.TextField()
    telephone = models.CharField(max_length=20)
    solde = models.DecimalField(max_digits=10, decimal_places=2, default=0.0) # [cite: 36]

    def __str__(self):
        return self.nom

class Chauffeur(models.Model):
    nom = models.CharField(max_length=100)
    permis = models.CharField(max_length=50) # [cite: 37]
    disponible = models.BooleanField(default=True)

class Vehicule(models.Model):
    matricule = models.CharField(max_length=20, unique=True) # [cite: 38]
    type_vehicule = models.CharField(max_length=50)
    capacite = models.FloatField(help_text="Capacité en kg ou m3")
    

class Destination(models.Model):
    ville = models.CharField(max_length=100)
    pays = models.CharField(max_length=100)
    tarif_base = models.DecimalField(max_digits=10, decimal_places=2) # [cite: 39]

class TypeService(models.Model):
    nom = models.CharField(max_length=50) # Ex: Standard, Express [cite: 40]
    tarif_poids = models.DecimalField(max_digits=6, decimal_places=2) # Prix par kg
    tarif_volume = models.DecimalField(max_digits=6, decimal_places=2) # Prix par m3

    def __str__(self):
        return self.nom

class Expedition(models.Model):
    STATUT_CHOIX = [
        ('EN_TRANSIT', 'En transit'),
        ('CENTRE_TRI', 'En centre de tri'),
        ('LIVRAISON', 'En cours de livraison'),
        ('LIVRE', 'Livré'),
        ('ECHEC', 'Échec'),
    ] # [cite: 55]

    numero_suivi = models.CharField(max_length=20, unique=True, editable=False) # [cite: 49]
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    destination = models.ForeignKey(Destination, on_delete=models.PROTECT)
    service = models.ForeignKey(TypeService, on_delete=models.PROTECT)
    
    poids = models.FloatField() # [cite: 46]
    volume = models.FloatField()
    description = models.TextField()
    
    montant_total = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_CHOIX, default='EN_TRANSIT')
    date_creation = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        # Génération automatique du prix selon la formule du PDF [cite: 48]
        # Montant = Tarif Base + (Poids * Tarif Poids) + (Volume * Tarif Volume)
        if not self.montant_total:
            from decimal import Decimal
            base = self.destination.tarif_base
            cout_poids = Decimal(str(self.poids)) * self.service.tarif_poids
            cout_volume = Decimal(str(self.volume)) * self.service.tarif_volume
            self.montant_total = base + cout_poids + cout_volume
        
        # Générer un ID unique simple si pas encore présent
        if not self.numero_suivi:
            import uuid
            self.numero_suivi = str(uuid.uuid4())[:8].upper()
            
        super().save(*args, **kwargs)


# Tournée - Regroupement d'expéditions avec chauffeur et véhicule
class Tournee(models.Model):
    STATUT_TOURNEE = [
        ('PLANIFIEE', 'Planifiée'),
        ('EN_COURS', 'En cours'),
        ('TERMINEE', 'Terminée'),
        ('ANNULEE', 'Annulée'),
    ]
    
    numero_tournee = models.CharField(max_length=20, unique=True, editable=False)
    date = models.DateField()
    chauffeur = models.ForeignKey(Chauffeur, on_delete=models.SET_NULL, null=True)
    vehicule = models.ForeignKey(Vehicule, on_delete=models.SET_NULL, null=True)
    statut = models.CharField(max_length=20, choices=STATUT_TOURNEE, default='PLANIFIEE')
    commentaire = models.TextField(blank=True)
    date_creation = models.DateTimeField(auto_now_add=True)
    
    def save(self, *args, **kwargs):
        if not self.numero_tournee:
            import uuid
            self.numero_tournee = f"T-{str(uuid.uuid4())[:6].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.numero_tournee} - {self.date}"


# Lien entre Tournée et Expéditions
class TourneeExpedition(models.Model):
    tournee = models.ForeignKey(Tournee, on_delete=models.CASCADE, related_name='expeditions')
    expedition = models.ForeignKey(Expedition, on_delete=models.CASCADE)
    ordre = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['ordre']


# Tracking détaillé des expéditions
class TrackingHistorique(models.Model):
    expedition = models.ForeignKey(Expedition, on_delete=models.CASCADE, related_name='tracking')
    date_heure = models.DateTimeField(auto_now_add=True)
    lieu = models.CharField(max_length=200)
    statut = models.CharField(max_length=20)
    commentaire = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-date_heure']
    
    def __str__(self):
        return f"{self.expedition.numero_suivi} - {self.lieu} - {self.date_heure}"


# Facturation
class Facture(models.Model):
    STATUT_FACTURE = [
        ('BROUILLON', 'Brouillon'),
        ('EMISE', 'Émise'),
        ('PAYEE', 'Payée'),
        ('ANNULEE', 'Annulée'),
    ]
    
    numero_facture = models.CharField(max_length=20, unique=True, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='factures')
    date_emission = models.DateField(auto_now_add=True)
    date_echeance = models.DateField()
    
    montant_ht = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    taux_tva = models.DecimalField(max_digits=4, decimal_places=2, default=19.0)
    montant_tva = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    montant_ttc = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    statut = models.CharField(max_length=20, choices=STATUT_FACTURE, default='BROUILLON')
    
    def save(self, *args, **kwargs):
        if not self.numero_facture:
            import uuid
            self.numero_facture = f"F-{str(uuid.uuid4())[:8].upper()}"
        
        # Calculer TVA et TTC
        self.montant_tva = self.montant_ht * (self.taux_tva / Decimal('100'))
        self.montant_ttc = self.montant_ht + self.montant_tva
        
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.numero_facture} - {self.client.nom}"


# Lien entre Facture et Expéditions
class FactureExpedition(models.Model):
    facture = models.ForeignKey(Facture, on_delete=models.CASCADE, related_name='expeditions')
    expedition = models.ForeignKey(Expedition, on_delete=models.CASCADE)


# Paiements
class Paiement(models.Model):
    MODE_PAIEMENT = [
        ('ESPECES', 'Espèces'),
        ('CHEQUE', 'Chèque'),
        ('VIREMENT', 'Virement'),
        ('CARTE', 'Carte bancaire'),
    ]
    
    facture = models.ForeignKey(Facture, on_delete=models.CASCADE, related_name='paiements')
    date_paiement = models.DateField(auto_now_add=True)
    montant = models.DecimalField(max_digits=10, decimal_places=2)
    mode_paiement = models.CharField(max_length=20, choices=MODE_PAIEMENT)
    reference = models.CharField(max_length=100, blank=True)
    commentaire = models.TextField(blank=True)
    
    def __str__(self):
        return f"Paiement {self.montant}€ - {self.facture.numero_facture}"


# Incidents
class Incident(models.Model):
    TYPE_INCIDENT = [
        ('RETARD', 'Retard'),
        ('PERTE', 'Perte'),
        ('ENDOMMAGEMENT', 'Endommagement'),
        ('AUTRE', 'Autre'),
    ]
    
    STATUT_INCIDENT = [
        ('OUVERT', 'Ouvert'),
        ('EN_COURS', 'En cours de traitement'),
        ('RESOLU', 'Résolu'),
        ('CLOS', 'Clos'),
    ]
    
    expedition = models.ForeignKey(Expedition, on_delete=models.CASCADE, related_name='incidents', null=True, blank=True)
    tournee = models.ForeignKey(Tournee, on_delete=models.CASCADE, related_name='incidents', null=True, blank=True)
    type_incident = models.CharField(max_length=20, choices=TYPE_INCIDENT)
    date_incident = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_INCIDENT, default='OUVERT')
    resolution = models.TextField(blank=True)
    date_resolution = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"{self.type_incident} - {self.date_incident}"


# Réclamations
class Reclamation(models.Model):
    TYPE_RECLAMATION = [
        ('RETARD', 'Retard de livraison'),
        ('QUALITE', 'Qualité de service'),
        ('FACTURATION', 'Problème de facturation'),
        ('AUTRE', 'Autre'),
    ]
    
    STATUT_RECLAMATION = [
        ('NOUVELLE', 'Nouvelle'),
        ('EN_COURS', 'En cours de traitement'),
        ('RESOLUE', 'Résolue'),
        ('ANNULEE', 'Annulée'),
    ]
    
    numero_reclamation = models.CharField(max_length=20, unique=True, editable=False)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='reclamations')
    expedition = models.ForeignKey(Expedition, on_delete=models.SET_NULL, null=True, blank=True)
    facture = models.ForeignKey(Facture, on_delete=models.SET_NULL, null=True, blank=True)
    
    type_reclamation = models.CharField(max_length=20, choices=TYPE_RECLAMATION)
    date_reclamation = models.DateTimeField(auto_now_add=True)
    description = models.TextField()
    statut = models.CharField(max_length=20, choices=STATUT_RECLAMATION, default='NOUVELLE')
    reponse = models.TextField(blank=True)
    date_resolution = models.DateTimeField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if not self.numero_reclamation:
            import uuid
            self.numero_reclamation = f"R-{str(uuid.uuid4())[:8].upper()}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.numero_reclamation} - {self.client.nom}"
