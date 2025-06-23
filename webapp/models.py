from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_migrate
from django.apps import apps
from django.dispatch import receiver

@receiver(post_migrate)
def create_default_badge_and_anonymous_user(sender, **kwargs):
    if sender.name == 'webapp':
        Badge = apps.get_model('webapp', 'Badge')
        Badge.objects.get_or_create(
            name="Explorateur",
            defaults={
                "description": "Premier signalement effectué",
                "points_required": 10
            }
        )
        # Création de l'utilisateur anonyme
        from django.contrib.auth.models import User
        User.objects.get_or_create(username="anonyme", defaults={"is_active": False})

# Les modèles UserProfile, Report, Comment sont désormais gérés dans l'app 'api'.

# Événement communautaire (ex: nettoyage, sensibilisation)
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    date = models.DateTimeField()
    location = models.CharField(max_length=255)
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='organized_events')
    participants = models.ManyToManyField(User, related_name='events', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    points_for_badge = models.PositiveIntegerField(null=True, blank=True, help_text="Points à atteindre pour obtenir le badge de l'événement")
    badge_reward = models.ForeignKey('Badge', null=True, blank=True, on_delete=models.SET_NULL, help_text="Badge attribué pour cet événement")
    points_awarded = models.PositiveIntegerField(default=0, help_text="Points gagnés à la participation à cet événement")

    def __str__(self):
        return self.title

    def participate(self, user_profile):
        # Ajoute l'utilisateur comme participant
        self.participants.add(user_profile.user)
        self.save()
        # Ajoute les points de l'événement
        if self.points_awarded:
            user_profile.points += self.points_awarded
            user_profile.save()
        # Vérifie et attribue les badges selon le score cumulé
        from webapp.models import Badge, UserBadge
        badges = Badge.objects.filter(points_required__lte=user_profile.points).order_by('points_required')
        for badge in badges:
            if not UserBadge.objects.filter(user_profile=user_profile, badge=badge).exists():
                UserBadge.objects.create(user_profile=user_profile, badge=badge)
        # Badge spécifique à l'événement (si défini)
        if self.points_for_badge and self.badge_reward:
            if user_profile.points >= self.points_for_badge:
                UserBadge.objects.get_or_create(user_profile=user_profile, badge=self.badge_reward)


# Badge que l'utilisateur peut gagner
class Badge(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    icon = models.ImageField(upload_to='badges/', null=True, blank=True)
    points_required = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name


# Badge gagné par un utilisateur
class UserBadge(models.Model):
    user_profile = models.ForeignKey('api.UserProfile', on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(Badge, on_delete=models.CASCADE)
    earned_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user_profile', 'badge')

    def __str__(self):
        return f'{self.user_profile.user.username} - {self.badge.name}'


# Historique des actions de gamification (points)
class ActionHistory(models.Model):
    ACTION_TYPE_CHOICES = [
        ('report', 'Signalement'),
        ('confirm', 'Confirmation'),
        ('resolve', 'Résolution'),
        ('event', 'Participation événement'),
        ('custom', 'Autre'),
    ]

    user_profile = models.ForeignKey('api.UserProfile', on_delete=models.CASCADE, related_name='actions')
    action_type = models.CharField(max_length=20, choices=ACTION_TYPE_CHOICES)
    description = models.TextField(blank=True, null=True)
    points_awarded = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user_profile.user.username} - {self.action_type} (+{self.points_awarded})'


class Report(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    description = models.TextField()
    categorie = models.CharField(max_length=100)
    STATUT_CHOICES = [
        ('signale', 'Signalé'),
        ('en_cours', 'En Cours'),
        ('nettoye', 'Nettoyé'),
    ]
    statut = models.CharField(max_length=20, choices=STATUT_CHOICES, default='signale')
    gravite = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.categorie} - {self.description[:20]}"


class Comment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    report = models.ForeignKey(Report, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.content[:20]}"


class CommentStep(models.Model):
    STEP_CHOICES = [
        ('avant', 'Avant'),
        ('apres', 'Après'),
    ]
    report = models.ForeignKey(Report, on_delete=models.CASCADE, related_name='steps')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.CharField(max_length=10, choices=STEP_CHOICES)
    comment = models.TextField(blank=True)
    image = models.ImageField(upload_to='comment_steps/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.report.id} - {self.step} - {self.user.username}"


# --- LOGIQUE DE GAMIFICATION AUTOMATIQUE ---
from django.db import transaction

def add_action_and_check_badge(user_profile, action_type, description, points):
    from webapp.models import ActionHistory, Badge, UserBadge
    # Créer une ActionHistory
    ActionHistory.objects.create(
        user_profile=user_profile,
        action_type=action_type,
        description=description,
        points_awarded=points
    )
    # Ajouter les points au profil
    user_profile.points += points
    user_profile.save()
    # Vérifier les badges à attribuer
    badges = Badge.objects.filter(points_required__lte=user_profile.points)
    for badge in badges:
        if not UserBadge.objects.filter(user_profile=user_profile, badge=badge).exists():
            UserBadge.objects.create(user_profile=user_profile, badge=badge)
