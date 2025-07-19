################################################
# Splanner app file history and version control
################################################
# Current Version: 1.0
# Author: ZayanMA
# Filename: /users/models.py
################################################
# File history
################################################
# 1.0   ZayanMA     Adding models

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Add custom fields here if needed (optional)
    pass


