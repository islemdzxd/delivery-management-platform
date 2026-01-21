from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from .models import (
    Client, Chauffeur, Vehicule, Destination, TypeService, Expedition,
    Tournee, TourneeExpedition, TrackingHistorique, Facture, FactureExpedition,
    Paiement, Incident, Reclamation
)
from .serializers import (
    ClientSerializer, ChauffeurSerializer, VehiculeSerializer, 
    DestinationSerializer, TypeServiceSerializer, ExpeditionSerializer,
    TourneeSerializer, TrackingHistoriqueSerializer, FactureSerializer,
    PaiementSerializer, IncidentSerializer, ReclamationSerializer
)

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class ChauffeurViewSet(viewsets.ModelViewSet):
    queryset = Chauffeur.objects.all()
    serializer_class = ChauffeurSerializer

class VehiculeViewSet(viewsets.ModelViewSet):
    queryset = Vehicule.objects.all()
    serializer_class = VehiculeSerializer

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all()
    serializer_class = DestinationSerializer

class TypeServiceViewSet(viewsets.ModelViewSet):
    queryset = TypeService.objects.all()
    serializer_class = TypeServiceSerializer

class ExpeditionViewSet(viewsets.ModelViewSet):
    queryset = Expedition.objects.all()
    serializer_class = ExpeditionSerializer
    filterset_fields = ['statut', 'client']


# Nouveaux ViewSets
class TourneeViewSet(viewsets.ModelViewSet):
    queryset = Tournee.objects.all()
    serializer_class = TourneeSerializer
    filterset_fields = ['statut', 'chauffeur', 'date']


class TrackingHistoriqueViewSet(viewsets.ModelViewSet):
    queryset = TrackingHistorique.objects.all()
    serializer_class = TrackingHistoriqueSerializer
    filterset_fields = ['expedition']


class FactureViewSet(viewsets.ModelViewSet):
    queryset = Facture.objects.all()
    serializer_class = FactureSerializer
    filterset_fields = ['statut', 'client']


class PaiementViewSet(viewsets.ModelViewSet):
    queryset = Paiement.objects.all()
    serializer_class = PaiementSerializer
    filterset_fields = ['facture']


class IncidentViewSet(viewsets.ModelViewSet):
    queryset = Incident.objects.all()
    serializer_class = IncidentSerializer
    filterset_fields = ['statut', 'type_incident', 'expedition']


class ReclamationViewSet(viewsets.ModelViewSet):
    queryset = Reclamation.objects.all()
    serializer_class = ReclamationSerializer
    filterset_fields = ['statut', 'client', 'type_reclamation']


# Analytics ViewSet
class AnalyticsViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        """Statistiques globales pour le dashboard"""
        today = timezone.now().date()
        last_30_days = today - timedelta(days=30)
        
        # Statistiques expéditions
        total_expeditions = Expedition.objects.count()
        expeditions_en_cours = Expedition.objects.exclude(statut='LIVRE').count()
        expeditions_livrees = Expedition.objects.filter(statut='LIVRE').count()
        expeditions_ce_mois = Expedition.objects.filter(date_creation__gte=last_30_days).count()
        
        # Statistiques financières
        chiffre_affaires = Expedition.objects.filter(
            statut='LIVRE'
        ).aggregate(total=Sum('montant_total'))['total'] or 0
        
        factures_impayees = Facture.objects.exclude(statut='PAYEE').aggregate(
            total=Sum('montant_ttc')
        )['total'] or 0
        
        # Top clients
        top_clients = Client.objects.annotate(
            nb_expeditions=Count('expedition')
        ).order_by('-nb_expeditions')[:5]
        
        top_clients_data = [{
            'id': c.id,
            'nom': c.nom,
            'nb_expeditions': c.nb_expeditions
        } for c in top_clients]
        
        # Top destinations
        top_destinations = Destination.objects.annotate(
            nb_expeditions=Count('expedition')
        ).order_by('-nb_expeditions')[:5]
        
        top_destinations_data = [{
            'id': d.id,
            'ville': d.ville,
            'pays': d.pays,
            'nb_expeditions': d.nb_expeditions
        } for d in top_destinations]
        
        # Incidents
        incidents_ouverts = Incident.objects.exclude(statut='CLOS').count()
        
        # Réclamations
        reclamations_nouvelles = Reclamation.objects.filter(statut='NOUVELLE').count()
        
        return Response({
            'expeditions': {
                'total': total_expeditions,
                'en_cours': expeditions_en_cours,
                'livrees': expeditions_livrees,
                'ce_mois': expeditions_ce_mois,
            },
            'financier': {
                'chiffre_affaires': float(chiffre_affaires),
                'factures_impayees': float(factures_impayees),
            },
            'top_clients': top_clients_data,
            'top_destinations': top_destinations_data,
            'incidents_ouverts': incidents_ouverts,
            'reclamations_nouvelles': reclamations_nouvelles,
        })

    @action(detail=False, methods=['get'])
    def expedition_trend(self, request):
        """Tendance des expéditions sur les 6 derniers mois"""
        from datetime import datetime
        from dateutil.relativedelta import relativedelta
        
        today = timezone.now().date()
        trend_data = []
        
        for i in range(6, 0, -1):
            month_date = today - relativedelta(months=i)
            month_start = month_date.replace(day=1)
            
            if i > 1:
                next_month = month_date + relativedelta(months=1)
                month_end = next_month.replace(day=1)
            else:
                month_end = today
            
            count = Expedition.objects.filter(
                date_creation__gte=month_start,
                date_creation__lt=month_end
            ).count()
            
            trend_data.append({
                'mois': month_date.strftime('%b'),
                'expeditions': count,
                'mois_complet': month_date.strftime('%B %Y')
            })
        
        return Response(trend_data)
    
    @action(detail=False, methods=['get'])
    def status_distribution(self, request):
        """Distribution des expéditions par statut"""
        from django.db.models import Count
        
        distribution = Expedition.objects.values('statut').annotate(
            count=Count('id')
        ).order_by('-count')
        
        status_labels = {
            'EN_TRANSIT': 'En Transit',
            'CENTRE_TRI': 'Centre de Tri',
            'LIVRAISON': 'En Livraison',
            'LIVRE': 'Livré',
            'ECHEC': 'Échec',
        }
        
        data = [{
            'name': status_labels.get(item['statut'], item['statut']),
            'value': item['count'],
            'statut': item['statut']
        } for item in distribution]
        
        return Response(data)


@api_view(['POST'])
def login_view(request):
    """Login endpoint that accepts email and password"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Email et mot de passe requis'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Find user by email
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'error': 'Email ou mot de passe incorrect'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Check password
    if not user.check_password(password):
        return Response(
            {'error': 'Email ou mot de passe incorrect'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Login successful
    return Response({
        'success': True,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser
        }
    }, status=status.HTTP_200_OK)
