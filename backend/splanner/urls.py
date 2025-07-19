################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /splanner/urls.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tasks.views import TaskViewSet
from courses.views import CourseViewSet
from notes.views import NoteViewSet


router = DefaultRouter()
router.register(r'tasks', TaskViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'notes', NoteViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
