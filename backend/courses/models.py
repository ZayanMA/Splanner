################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /courses/models.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from django.db import models
from django.contrib.auth import get_user_model


User = get_user_model()

class Course(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="courses")  # course can't exist without user so cascade
    title = models.CharField(max_length=100)  # name of the course e.g "COMP2203"
    location = models.CharField(max_length=100)  # location of the course e.g "Building 16"
    day_of_week = models.CharField(max_length=10)  # e.g., Monday
    start_time = models.TimeField()  # starting time of the course timefield 
    end_time = models.TimeField()  # ending time of the course

    def __str__(self):
        return self.title

