from webapp.models import Report, Comment
from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, unique=True)
    points = models.IntegerField(default=0)
    statut = models.CharField(max_length=20, default='citoyen', choices=[('citoyen', 'Citoyen'), ('admin', 'Administrateur')])
    # Ajoute d'autres champs si besoin
    def __str__(self):
        return self.user.username

class ApiLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)
    detail = models.TextField(blank=True, null=True)
    def __str__(self):
        return f"{self.user} - {self.action}"

class Gallery(models.Model):
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    before_image = models.ImageField(upload_to='gallery/before/')
    after_image = models.ImageField(upload_to='gallery/after/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Gallery for report {self.report.id}"
