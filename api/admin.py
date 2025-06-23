from django.contrib import admin
from .models import UserProfile, ApiLog, Gallery
from webapp.models import Report, Comment, Event

class UserProfileAdmin(admin.ModelAdmin):
    list_display = [f.name for f in UserProfile._meta.fields]

class ReportAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Report._meta.fields]

class CommentAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Comment._meta.fields]

class EventAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Event._meta.fields]

class ApiLogAdmin(admin.ModelAdmin):
    list_display = [f.name for f in ApiLog._meta.fields]

class GalleryAdmin(admin.ModelAdmin):
    list_display = [f.name for f in Gallery._meta.fields]

admin.site.register(UserProfile, UserProfileAdmin)
admin.site.register(Report, ReportAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(ApiLog, ApiLogAdmin)
admin.site.register(Gallery, GalleryAdmin)
