from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework.routers import DefaultRouter
from quotes.views import QuoteViewSet

router = DefaultRouter()
router.register(r'quotes', QuoteViewSet, basename='quote')

urlpatterns = [
    path('', RedirectView.as_view(url='api/quotes/', permanent=False)),  # Redirects / to /api/quotes/
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]