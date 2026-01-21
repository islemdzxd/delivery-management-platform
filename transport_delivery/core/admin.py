from django.contrib import admin
from .models import (
    Client, Chauffeur, Vehicule, Destination, TypeService, Expedition,
    Tournee, TourneeExpedition, TrackingHistorique, Facture, FactureExpedition,
    Paiement, Incident, Reclamation
)

admin.site.register(Client)
admin.site.register(Chauffeur)
admin.site.register(Vehicule)
admin.site.register(Destination)
admin.site.register(TypeService)
admin.site.register(Tournee)
admin.site.register(TourneeExpedition)
admin.site.register(TrackingHistorique)
admin.site.register(Facture)
admin.site.register(FactureExpedition)
admin.site.register(Paiement)
admin.site.register(Incident)
admin.site.register(Reclamation)

@admin.register(Expedition)
class ExpeditionAdmin(admin.ModelAdmin):
    list_display = ('numero_suivi', 'client', 'statut', 'montant_total')
    list_filter = ('statut', 'date_creation')
