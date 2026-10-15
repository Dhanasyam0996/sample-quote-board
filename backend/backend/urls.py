from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quotes.views import QuoteViewSet

# Register the QuoteViewSet with DRF's router
router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]