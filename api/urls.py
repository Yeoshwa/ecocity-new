from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserProfileViewSet, ReportViewSet, CommentViewSet, EventViewSet,
    map_pins, gamification_points, gamification_badges, leaderboard, ApiLogViewSet, gamification_progress, GalleryViewSet, UserBadgeViewSet, gallery_report_link, CommentStepViewSet, random_avant_apres, all_avant_apres_couples
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions
from .auth_views import PhoneTokenObtainPairView
from .register_view import RegisterView

schema_view = get_schema_view(
   openapi.Info(
      title="EcoCity API",
      default_version='v1',
      description="Documentation de l'API EcoCity pour mobile citoyen",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

router = DefaultRouter()
router.register(r'userprofiles', UserProfileViewSet)
router.register(r'reports', ReportViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'events', EventViewSet)
router.register(r'apilogs', ApiLogViewSet)
router.register(r'gallery', GalleryViewSet)
router.register(r'userbadges', UserBadgeViewSet, basename='userbadge')
router.register(r'commentsteps', CommentStepViewSet, basename='commentstep')

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('map/pins/', map_pins, name='map_pins'),
    path('gamification/points/', gamification_points, name='gamification_points'),
    path('gamification/badges/', gamification_badges, name='gamification_badges'),
    path('user/leaderboard/', leaderboard, name='leaderboard'),
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('gamification/progress/', gamification_progress, name='gamification_progress'),
    path('token/phone/', PhoneTokenObtainPairView.as_view(), name='token_obtain_pair_phone'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('gallery/report/<int:report_id>/', gallery_report_link, name='gallery_report_link'),
    path('commentsteps/random/<int:report_id>/', random_avant_apres, name='random_avant_apres'),
    path('commentsteps/all-couples/', all_avant_apres_couples, name='all_avant_apres_couples'),
]
