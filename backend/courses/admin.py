################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /courses/admin.py
################################################
# File history
################################################
# 1.0   ZayanMA     initial commit


from django.contrib import admin
from .models import Course

# Register your models here.
admin.site.register(Course)