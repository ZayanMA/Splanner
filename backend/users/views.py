################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /users/views.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from rest_framework import generics
from .serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer

