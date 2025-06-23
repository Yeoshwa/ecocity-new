from django.shortcuts import render, get_object_or_404, redirect
from webapp.models import Report, CommentStep
from api.models import Gallery
from django.templatetags.static import static
from django.http import JsonResponse
from django.contrib.auth import authenticate, login
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth import logout

# Create your views here.
def index(request):
    """
    Render the index page.
    """
    return render(request, 'webapp/index.html')

def about(request):
    """
    Render the about page.
    """
    return render(request, 'webapp/about.html')

def report_detail(request, report_id):
    """
    Render the report detail page, showing the details of a report
    and the before/after images and comments.
    """
    report = get_object_or_404(Report, id=report_id)
    # Récupérer la galerie avant/après si elle existe
    gallery = Gallery.objects.filter(report=report).first()
    # Récupérer les étapes avant/après
    avants = CommentStep.objects.filter(report=report, step='avant')
    apres = CommentStep.objects.filter(report=report, step='apres')
    return render(request, 'webapp/report_detail.html', {
        'report': report,
        'gallery': gallery,
        'avants': avants,
        'apres': apres
    })

def demo_components(request):
    """
    Vue temporaire pour la démo des composants front-end.
    """
    card_image_url = static('webapp/images/pin-red.png')
    return render(request, 'webapp/demo_components.html', {
        'card_image_url': card_image_url
    })

# --- AUTH VIEWS (AJAX + page combinée) ---
def login_register(request):
    """
    Page combinée login/register (formulaires AJAX ou POST classique)
    """
    login_error = ''
    register_error = ''
    # Gestion POST classique (non AJAX)
    if request.method == 'POST':
        if 'phone' in request.POST and 'password' in request.POST and 'loginForm' in request.POST:
            # Login classique
            form = AuthenticationForm(request, data=request.POST)
            if form.is_valid():
                user = form.get_user()
                login(request, user)
                if hasattr(user, 'is_admin') and user.is_admin:
                    return redirect('/dashboard-admin/')
                elif hasattr(user, 'is_organisation') and user.is_organisation:
                    return redirect('/dashboard-org/')
                else:
                    return redirect('/dashboard-user/')
            else:
                login_error = 'Identifiants invalides.'
        elif 'username' in request.POST and 'registerForm' in request.POST:
            # Register classique (à adapter selon votre modèle)
            username = request.POST.get('username')
            phone = request.POST.get('phone')
            password1 = request.POST.get('password1')
            password2 = request.POST.get('password2')
            if password1 != password2:
                register_error = 'Les mots de passe ne correspondent pas.'
            else:
                # TODO: Créer l'utilisateur, vérifier unicité, etc.
                # user = User.objects.create_user(...)
                # login(request, user)
                return redirect('/dashboard-user/')
    return render(request, 'registration/login_register.html', {
        'login_error': login_error,
        'register_error': register_error
    })

@csrf_exempt
def ajax_login(request):
    if request.method == 'POST':
        phone = request.POST.get('phone')
        password = request.POST.get('password')
        user = authenticate(request, username=phone, password=password)
        if user is not None:
            login(request, user)
            # Redirection selon le type de compte
            if hasattr(user, 'is_admin') and user.is_admin:
                redirect_url = '/dashboard-admin/'
            elif hasattr(user, 'is_organisation') and user.is_organisation:
                redirect_url = '/dashboard-org/'
            else:
                redirect_url = '/dashboard-user/'
            return JsonResponse({'success': True, 'redirect': redirect_url})
        else:
            return JsonResponse({'success': False, 'error': 'Identifiants invalides.'})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée.'})

@csrf_exempt
def ajax_register(request):
    if request.method == 'POST':
        # À adapter selon votre modèle User
        username = request.POST.get('username')
        phone = request.POST.get('phone')
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')
        if password1 != password2:
            return JsonResponse({'success': False, 'error': 'Les mots de passe ne correspondent pas.'})
        # TODO: Créer l'utilisateur (vérifier unicité, etc.)
        # user = User.objects.create_user(...)
        # login(request, user)
        # Redirection selon le type de compte (ici user simple)
        return JsonResponse({'success': True, 'redirect': '/dashboard-user/'})
    return JsonResponse({'success': False, 'error': 'Méthode non autorisée.'})

def phone_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            # Redirection selon le type de compte
            if hasattr(user, 'is_admin') and user.is_admin:
                return redirect('/dashboard-admin/')
            elif hasattr(user, 'is_organisation') and user.is_organisation:
                return redirect('/dashboard-org/')
            else:
                return redirect('/dashboard-user/')
    else:
        form = AuthenticationForm()
    return render(request, 'registration/phone_login.html', {'form': form})

def register(request):
    if request.method == 'POST':
        # À adapter selon votre formulaire d'inscription
        # form = RegisterForm(request.POST)
        # if form.is_valid():
        #     user = form.save()
        #     login(request, user)
        #     # Redirection selon le type de compte (ici user simple)
        #     return redirect('/dashboard-user/')
        pass  # TODO: brancher votre logique d'inscription ici
    # form = RegisterForm()
    return render(request, 'registration/register.html', {})

def dashboard_user(request):
    return render(request, 'webapp/dashboard_user.html')

def dashboard_admin(request):
    return render(request, 'webapp/dashboard_admin.html')

def dashboard_org(request):
    return render(request, 'webapp/dashboard_org.html')