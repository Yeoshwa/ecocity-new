from django.db.models.signals import post_save, post_delete
from django.contrib.auth.models import User
from django.dispatch import receiver
from .models import UserProfile
from webapp.models import Badge, UserBadge

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        # Ne crée le UserProfile que si le téléphone est fourni (inscription API admin)
        if not UserProfile.objects.filter(user=instance).exists() and hasattr(instance, 'userprofile') == False:
            # Ne rien faire ici, la création se fait dans le serializer Register
            pass

@receiver(post_delete, sender=User)
def delete_user_profile(sender, instance, **kwargs):
    try:
        profile = UserProfile.objects.get(user=instance)
        profile.delete()
    except UserProfile.DoesNotExist:
        pass
