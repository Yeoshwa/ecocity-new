# Generated by Django 5.2.3 on 2025-06-23 06:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('webapp', '0003_event_badge_reward_event_points_for_badge'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='points_awarded',
            field=models.PositiveIntegerField(default=0, help_text='Points gagnés à la participation à cet événement'),
        ),
    ]
