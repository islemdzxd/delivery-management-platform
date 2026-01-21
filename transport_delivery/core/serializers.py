from rest_framework import serializers
from .models import (
    Client, Chauffeur, Vehicule, Destination, TypeService, Expedition,
    Tournee, TourneeExpedition, TrackingHistorique, Facture, FactureExpedition,
    Paiement, Incident, Reclamation
)

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class ChauffeurSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chauffeur
        fields = '__all__'

class VehiculeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicule
        fields = '__all__'

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Destination
        fields = '__all__'

class TypeServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TypeService
        fields = '__all__'

class ExpeditionSerializer(serializers.ModelSerializer):
    # Ces champs permettent d'afficher les noms au lieu des ID dans le JSON (lecture seule)
    nom_client = serializers.ReadOnlyField(source='client.nom')
    ville_destination = serializers.ReadOnlyField(source='destination.ville')
    nom_service = serializers.ReadOnlyField(source='service.nom')
    
    class Meta:
        model = Expedition
        fields = '__all__'


# Nouveaux Serializers
class TourneeExpeditionSerializer(serializers.ModelSerializer):
    expedition_detail = ExpeditionSerializer(source='expedition', read_only=True)
    
    class Meta:
        model = TourneeExpedition
        fields = '__all__'


class TourneeSerializer(serializers.ModelSerializer):
    chauffeur_nom = serializers.ReadOnlyField(source='chauffeur.nom')
    vehicule_matricule = serializers.ReadOnlyField(source='vehicule.matricule')
    expeditions = TourneeExpeditionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Tournee
        fields = '__all__'


class TrackingHistoriqueSerializer(serializers.ModelSerializer):
    expedition_numero = serializers.ReadOnlyField(source='expedition.numero_suivi')
    
    class Meta:
        model = TrackingHistorique
        fields = '__all__'


class FactureExpeditionSerializer(serializers.ModelSerializer):
    expedition_detail = ExpeditionSerializer(source='expedition', read_only=True)
    
    class Meta:
        model = FactureExpedition
        fields = '__all__'


class FactureSerializer(serializers.ModelSerializer):
    client_nom = serializers.ReadOnlyField(source='client.nom')
    expeditions = FactureExpeditionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Facture
        fields = '__all__'


class PaiementSerializer(serializers.ModelSerializer):
    facture_numero = serializers.ReadOnlyField(source='facture.numero_facture')
    
    class Meta:
        model = Paiement
        fields = '__all__'


class IncidentSerializer(serializers.ModelSerializer):
    expedition_numero = serializers.ReadOnlyField(source='expedition.numero_suivi')
    tournee_numero = serializers.ReadOnlyField(source='tournee.numero_tournee')
    
    class Meta:
        model = Incident
        fields = '__all__'


class ReclamationSerializer(serializers.ModelSerializer):
    client_nom = serializers.ReadOnlyField(source='client.nom')
    expedition_numero = serializers.ReadOnlyField(source='expedition.numero_suivi')
    facture_numero = serializers.ReadOnlyField(source='facture.numero_facture')
    
    class Meta:
        model = Reclamation
        fields = '__all__'
