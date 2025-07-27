################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /module/serializers.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from rest_framework import serializers
from .models import Module

class ModuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Module
        fields = '__all__'
