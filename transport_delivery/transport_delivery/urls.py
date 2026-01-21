"""
URL configuration for transport_delivery project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""



from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    ClientViewSet, ExpeditionViewSet, ChauffeurViewSet,
    VehiculeViewSet, DestinationViewSet, TypeServiceViewSet,
    TourneeViewSet, TrackingHistoriqueViewSet, FactureViewSet,
    PaiementViewSet, IncidentViewSet, ReclamationViewSet, AnalyticsViewSet,
    login_view
)

router = DefaultRouter()
# Bases
router.register(r'clients', ClientViewSet)
router.register(r'expeditions', ExpeditionViewSet)
router.register(r'chauffeurs', ChauffeurViewSet)
router.register(r'vehicules', VehiculeViewSet)
router.register(r'destinations', DestinationViewSet)
router.register(r'types-service', TypeServiceViewSet)

# Nouveaux endpoints
router.register(r'tournees', TourneeViewSet)
router.register(r'tracking', TrackingHistoriqueViewSet)
router.register(r'factures', FactureViewSet)
router.register(r'paiements', PaiementViewSet)
router.register(r'incidents', IncidentViewSet)
router.register(r'reclamations', ReclamationViewSet)
router.register(r'analytics', AnalyticsViewSet, basename='analytics')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', login_view, name='login'),
]
