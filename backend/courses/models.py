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

    def __str__(self):
        return self.title


class Lecture(models.Model):
    class ScheduleType(models.TextChoices):
        ONCE = "once", "One-time"
        WEEKLY = "weekly", "Weekly"
        BIWEEKLY = "biweekly", "Biweekly"

    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name="lectures")
    title = models.CharField(max_length=255)

    schedule_type = models.CharField(
        max_length=10,
        choices=ScheduleType.choices,
        default=ScheduleType.WEEKLY,
    )

    # For recurring lectures: list of days (0 = Monday, 6 = Sunday)
    days_of_week = models.JSONField(
        default=list,
        blank=True,
        help_text="List of integers (0=Mon ... 6=Sun). Used if schedule_type is weekly/biweekly."
    )

    # For one-time lecture
    one_time_date = models.DateField(null=True, blank=True)

    start_time = models.TimeField()
    end_time = models.TimeField()

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    location = models.CharField(max_length=100, blank = True, null = True)  # location of the course e.g "Building 16"

    def clean(self):
        from django.core.exceptions import ValidationError

        if self.schedule_type == self.ScheduleType.ONCE:
            if not self.one_time_date:
                raise ValidationError("One-time lectures must have a date.")
            if self.days_of_week:
                raise ValidationError("One-time lectures should not have days_of_week.")
        else:
            if not self.days_of_week:
                raise ValidationError("Recurring lectures must specify days_of_week.")
            if self.one_time_date:
                raise ValidationError("Recurring lectures should not have one_time_date.")
        if self.start_time >= self.end_time:
            raise ValidationError("Start time must be before end time.")

    def __str__(self):
        return f"{self.title} ({self.course.name})"
