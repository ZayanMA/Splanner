################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /courses/views.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from django.shortcuts import render
from rest_framework import viewsets
from .models import Course
from .serializers import CourseSerializer
from rest_framework.permissions import IsAuthenticated


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = [IsAuthenticated]

