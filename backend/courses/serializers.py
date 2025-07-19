################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /courses/serializers.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from rest_framework import serializers
from .models import Course

class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = '__all__'
