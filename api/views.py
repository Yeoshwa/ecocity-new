from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view, action, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import mixins
from webapp.models import Event, Report, Comment, add_action_and_check_badge, UserBadge, CommentStep
from .models import UserProfile, ApiLog, Gallery
from .serializers import UserProfileSerializer, ReportSerializer, CommentSerializer, EventSerializer, ApiLogSerializer, GallerySerializer, UserBadgeSerializer, CommentStepSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
import random

class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def update(self, request, *args, **kwargs):
        # Interdit la modification si l'id ne correspond pas à l'utilisateur connecté (sauf admin)
        instance = self.get_object()
        if request.user.is_superuser:
            return super().update(request, *args, **kwargs)
        if hasattr(request.user, 'userprofile') and instance.id != request.user.userprofile.id:
            return Response({'detail': "Modification interdite : vous ne pouvez modifier que votre propre profil."}, status=403)
        return super().update(request, *args, **kwargs)

class ReportViewSet(viewsets.ModelViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        from django.contrib.auth.models import User
        # Utilisateur anonyme par défaut
        anonymous_user = User.objects.get(username="anonyme")
        if self.request.user and self.request.user.is_authenticated:
            user = self.request.user
        else:
            user = anonymous_user
        # Compléter le champ 'statut' à 'citoyen' si non fourni
        statut = self.request.data.get('statut', None)
        if not statut:
            serializer.validated_data['statut'] = 'citoyen'
        report = serializer.save(user=user)
        # Création automatique d'un CommentStep 'avant'
        CommentStep.objects.create(report=report, user=user, step='avant', comment=report.description)
        # Ajout ActionHistory et badge
        try:
            if user.username != "anonyme":
                user_profile = user.userprofile
                add_action_and_check_badge(user_profile, 'report', f"Signalement: {report.description[:30]}", 10)
                from webapp.models import Badge, UserBadge
                badge = Badge.objects.order_by('points_required').first()
                if badge and not UserBadge.objects.filter(user_profile=user_profile, badge=badge).exists():
                    UserBadge.objects.create(user_profile=user_profile, badge=badge)
                badges = Badge.objects.filter(points_required__lte=user_profile.points).order_by('points_required')
                for b in badges:
                    if not UserBadge.objects.filter(user_profile=user_profile, badge=b).exists():
                        UserBadge.objects.create(user_profile=user_profile, badge=b)
        except Exception as e:
            pass

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def perform_create(self, serializer):
        comment = serializer.save(user=self.request.user)
        # Création automatique d'un CommentStep 'apres'
        from webapp.models import CommentStep
        CommentStep.objects.create(report=comment.report, user=self.request.user, step='apres', comment=comment.content)
        try:
            user_profile = self.request.user.userprofile
            add_action_and_check_badge(user_profile, 'custom', f"Commentaire: {comment.content[:30]}", 2)
        except Exception as e:
            pass

class EventViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def participate(self, request, pk=None):
        event = self.get_object()
        user_profile = request.user.userprofile
        event.participate(user_profile)
        return Response({'message': 'Participation enregistrée.'})

class ApiLogViewSet(viewsets.ModelViewSet):
    queryset = ApiLog.objects.all()
    serializer_class = ApiLogSerializer

class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Gallery.objects.all()
    serializer_class = GallerySerializer

@api_view(['GET'])
def map_pins(request):
    """
    Retourne tous les signalements sous forme de pins pour la carte, avec l'URL de l'icône selon le statut.
    """
    from webapp.models import Report
    # Mapping statut -> image
    statut_to_icon = {
        'signale': '/static/webapp/images/pin-red.png',
        'en_cours': '/static/webapp/images/pin-orange.png',
        'nettoye': '/static/webapp/images/pin-green.png',
    }
    pins = [
        {
            'id': report.id,
            'latitude': report.latitude,
            'longitude': report.longitude,
            'description': report.description,
            'categorie': report.categorie,
            'statut': report.statut,
            'gravite': report.gravite,
            'created_at': report.created_at,
            'icon_url': statut_to_icon.get(report.statut, '/static/webapp/images/pin-red.png'),
        }
        for report in Report.objects.all()
    ]
    return Response({'pins': pins})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gamification_points(request):
    user = request.user
    if not user.is_superuser and user.username != 'admin':
        if hasattr(user, 'userprofile'):
            user_profile = user.userprofile
        else:
            return Response({'detail': 'Accès interdit.'}, status=403)
    else:
        user_profile = user.userprofile if hasattr(user, 'userprofile') else None
    points = user_profile.points if user_profile else 0
    return Response({'points': points})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gamification_badges(request):
    user = request.user
    if not user.is_superuser and user.username != 'admin':
        if hasattr(user, 'userprofile'):
            user_profile = user.userprofile
        else:
            return Response({'detail': 'Accès interdit.'}, status=403)
    else:
        user_profile = user.userprofile if hasattr(user, 'userprofile') else None
    badges = []
    if user_profile:
        badges = [ub.badge.name for ub in UserBadge.objects.filter(user_profile=user_profile)]
    return Response({'badges': badges})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def gamification_progress(request):
    user = request.user
    if not user.is_superuser and user.username != 'admin':
        if hasattr(user, 'userprofile'):
            user_profile = user.userprofile
        else:
            return Response({'detail': 'Accès interdit.'}, status=403)
    else:
        user_profile = user.userprofile if hasattr(user, 'userprofile') else None
    # Progression vers le prochain badge
    progress = 0
    if user_profile:
        from webapp.models import Badge
        next_badge = Badge.objects.filter(points_required__gt=user_profile.points).order_by('points_required').first()
        if next_badge:
            prev_points = Badge.objects.filter(points_required__lte=user_profile.points).order_by('-points_required').first()
            base = prev_points.points_required if prev_points else 0
            progress = int(100 * (user_profile.points - base) / (next_badge.points_required - base))
        else:
            progress = 100  # maxé
    return Response({'progress': progress})

def log_api_usage(get_response):
    """
    Middleware pour logger l'usage de l'API. Ajoutez votre logique ici si besoin.
    """
    def middleware(request):
        # Log seulement les requêtes API (ex: /api/)
        if request.path.startswith('/api/'):
            user = request.user if hasattr(request, 'user') and request.user.is_authenticated else None
            try:
                ApiLog.objects.create(
                    user=user,
                    action=f"{request.method} {request.path}",
                    detail=f"Body: {request.body.decode('utf-8')[:500]}"
                )
            except Exception as e:
                # Optionnel : log en console si erreur
                print(f"[ApiLog] Erreur lors du log: {e}")
        response = get_response(request)
        return response
    return middleware

class UserBadgeViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserBadgeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_profile = self.request.user.userprofile
        return UserBadge.objects.filter(user_profile=user_profile)

    class Meta:
        model = UserBadge
        fields = '__all__'

@api_view(['GET'])
def gallery_report_link(request, report_id):
    """
    Permet de voir la liaison entre un signalement (report) et sa galerie avant/après (reaction).
    Retourne la galerie liée à ce report, ou un message si aucune n'existe.
    """
    from .models import Gallery
    try:
        gallery = Gallery.objects.get(report_id=report_id)
        data = GallerySerializer(gallery).data
        return Response(data)
    except Gallery.DoesNotExist:
        return Response({'detail': 'Aucune galerie avant/après pour ce signalement.'}, status=404)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def leaderboard(request):
    user = request.user
    if not user.is_superuser and user.username != 'admin':
        # Seul l'admin ou superuser peut voir le leaderboard
        return Response({'detail': 'Accès réservé à l’admin.'}, status=403)
    return Response({'leaderboard': []})

class CommentStepViewSet(viewsets.ModelViewSet):
    queryset = CommentStep.objects.all()
    serializer_class = CommentStepSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
def random_avant_apres(request, report_id):
    """
    Retourne un couple (avant, après) aléatoire pour un report donné (ou None si pas de couple).
    """
    steps = CommentStep.objects.filter(report_id=report_id)
    avants = list(steps.filter(step='avant'))
    apres = list(steps.filter(step='apres'))
    if not avants or not apres:
        return Response({'detail': 'Aucun couple avant/après disponible.'}, status=404)
    avant = random.choice(avants)
    apres = random.choice(apres)
    data = {
        'avant': CommentStepSerializer(avant).data,
        'apres': CommentStepSerializer(apres).data
    }
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def all_avant_apres_couples(request):
    """
    Pour l'admin : retourne tous les couples (avant, après) groupés par report.
    """
    from collections import defaultdict
    result = defaultdict(list)
    for report in Report.objects.all():
        avants = list(CommentStep.objects.filter(report=report, step='avant'))
        apres = list(CommentStep.objects.filter(report=report, step='apres'))
        if avants and apres:
            for avant in avants:
                for apres_ in apres:
                    result[report.id].append({
                        'avant': CommentStepSerializer(avant).data,
                        'apres': CommentStepSerializer(apres_).data
                    })
    return Response(result)
