################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /notes/models.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit

from django.db import models
from django.contrib.auth import get_user_model
from modules.models import Module


User = get_user_model()

class Note(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")  # a note belongs to a user
    module = models.ForeignKey(Module, on_delete=models.SET_NULL, null=True, blank=True)  # a note can belong to a module
    title = models.CharField(max_length=100)  # a note has a title e.g "Lecture 1 notes"
    content = models.TextField()  # content of the note
    created_at = models.DateTimeField(auto_now_add=True)  # date when note was created

    def __str__(self):
        return self.title
