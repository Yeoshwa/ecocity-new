from django.contrib.auth.models import User
from rest_framework import serializers
from webapp.models import Event, Report, Comment, UserBadge, CommentStep
from .models import UserProfile, ApiLog, Gallery
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class ReportSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='categorie')
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    photo = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = Report
        # On inclut tous les champs du modèle, mais expose 'category' au lieu de 'categorie'
        fields = [
            'id', 'category', 'description', 'latitude', 'longitude', 'photo', 'created_at', 'user', 'statut', 'gravite'
        ]
        read_only_fields = ['id', 'photo', 'created_at', 'user']

    def validate(self, attrs):
        try:
            required_fields = ['categorie', 'description', 'latitude', 'longitude']
            missing = [f for f in required_fields if not attrs.get(f)]
            if missing:
                import logging
                logging.error(f"Champs manquants dans POST /api/reports/: {missing} | attrs={attrs}")
                raise serializers.ValidationError({f: 'Ce champ est obligatoire.' for f in missing})
            if 'statut' not in attrs or not attrs['statut']:
                attrs['statut'] = 'citoyen'
            if 'gravite' not in attrs or not attrs['gravite']:
                attrs['gravite'] = 1
            return super().validate(attrs)
        except Exception as e:
            import logging
            logging.exception(f"Erreur dans ReportSerializer.validate: {e}")
            raise serializers.ValidationError({'non_field_error': str(e)})

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class ApiLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApiLog
        fields = '__all__'

class GallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = Gallery
        fields = '__all__'

class PhoneTokenObtainPairSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        phone = attrs.get('phone')
        password = attrs.get('password')
        errors = {}
        if not phone:
            errors['phone'] = 'Le numéro de téléphone est requis.'
        if not password:
            errors['password'] = 'Le mot de passe est requis.'
        if errors:
            raise serializers.ValidationError(errors)
        try:
            profile = UserProfile.objects.get(phone=phone)
        except UserProfile.DoesNotExist:
            raise serializers.ValidationError({'phone': 'Aucun utilisateur avec ce numéro de téléphone.'})
        user = profile.user
        if not user:
            raise serializers.ValidationError({'username': 'Aucun utilisateur associé à ce profil.'})
        if not user.check_password(password):
            raise serializers.ValidationError({'password': 'Mot de passe incorrect.'})
        if not user.is_active:
            raise serializers.ValidationError({'user': 'Ce compte est désactivé.'})
        # Générer les tokens JWT
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'username': user.username,
            'phone': profile.phone,
            'statut': profile.statut,  # Ajout du statut dans la réponse
        }

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    phone = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    def validate_phone(self, value):
        if UserProfile.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Ce numéro de téléphone est déjà utilisé.")
        return value

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà utilisé.")
        return value

    def create(self, validated_data):
        # Crée le User
        user = User.objects.create_user(username=validated_data['username'], password=validated_data['password'])
        # Crée le UserProfile avec le bon numéro de téléphone
        profile = UserProfile.objects.create(user=user, phone=validated_data['phone'], statut='citoyen')
        # Attribue le badge de plus faible rang par défaut
        from webapp.models import Badge, UserBadge
        badge = Badge.objects.order_by('points_required').first()
        if badge:
            UserBadge.objects.get_or_create(user_profile=profile, badge=badge)
        return user

class UserBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserBadge
        fields = '__all__'

class CommentStepSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = CommentStep
        fields = '__all__'
