################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /modules/views.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from django.shortcuts import render
from rest_framework import viewsets
from .models import Module
from .serializers import ModuleSerializer
from rest_framework.permissions import IsAuthenticated


class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.all()
    serializer_class = ModuleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Module.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

