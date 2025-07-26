################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /tasks/models.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from django.db import models
from django.contrib.auth import get_user_model
from courses.models import Course


User = get_user_model()

class Task(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tasks")  # task belongs to a user
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True, blank=True)  # task can belong to a course
    title = models.CharField(max_length=255)  # name of the task
    due_date = models.DateField()  # due date for the task 2025/07/30
    due_time = models.DateTimeField()
    priority = models.CharField(max_length=10, choices=[('low', 'Low'), ('medium', 'Medium'), ('high', 'High')])  # priority field with choices
    tags = models.JSONField(blank=True, null=True)  # json field for tags for this task e.g "homework, research"
    completed = models.BooleanField(default=False)  # boolean field for status completed true or false

    def __str__(self):
        return self.title