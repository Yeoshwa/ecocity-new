from django.urls import path
from . import views
from django.contrib.auth import logout as django_logout
from django.shortcuts import redirect

def logout_view(request):
    django_logout(request)
    return redirect('index')

urlpatterns = [
    path('', views.index, name='index'),
    path('about/', views.about, name='about'),
    path('report/<int:report_id>/', views.report_detail, name='report_detail'),
    path('webapp/report/<int:report_id>/', views.report_detail, name='report_detail_webapp'),
]

# --- URLS DE TEST/DEMO (à supprimer après validation) ---
# TODO: Retirer ces routes de test après la phase de développement
urlpatterns += [
    path('demo-components/', views.demo_components, name='demo_components'),
]

urlpatterns += [
    path('login/', views.login_register, name='login_register'),
    path('ajax/login/', views.ajax_login, name='ajax_login'),
    path('ajax/register/', views.ajax_register, name='ajax_register'),
]

urlpatterns += [
    path('login-classic/', views.phone_login, name='login'),
    path('register/', views.register, name='register'),
]

urlpatterns += [
    path('dashboard-user/', views.dashboard_user, name='dashboard_user'),
    path('dashboard-admin/', views.dashboard_admin, name='dashboard_admin'),
    path('dashboard-org/', views.dashboard_org, name='dashboard_org'),
]

urlpatterns += [
    path('logout/', logout_view, name='logout'),
]
