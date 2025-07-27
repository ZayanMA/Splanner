################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /splanner/urls.py
################################################
# File history
################################################
# 1.0   ZayanMA    initial commit

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet
from modules.views import ModuleViewSet
from notes.views import NoteViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users.views import RegisterView 


router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'notes', NoteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Auth
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/register/', RegisterView.as_view(), name='auth_register'),
    
]
