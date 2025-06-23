from django.contrib import admin
from .models import Badge, UserBadge, ActionHistory, Event

class BadgeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Badge._meta.fields]

class UserBadgeAdmin(admin.ModelAdmin):
    list_display = [field.name for field in UserBadge._meta.fields]

class ActionHistoryAdmin(admin.ModelAdmin):
    list_display = [field.name for field in ActionHistory._meta.fields]

class EventAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Event._meta.fields]

admin.site.register(Badge, BadgeAdmin)
admin.site.register(UserBadge, UserBadgeAdmin)
admin.site.register(ActionHistory, ActionHistoryAdmin)
# admin.site.register(Event, EventAdmin)  # Supprimé car déjà enregistré dans api/admin.py
