# Documentation des endpoints testables de l'API EcoCity

---

## Architecture & fichiers du projet

**Fichiers principaux :**
- `manage.py` : commande Django
- `ecocity/` : configuration principale Django (settings, urls, wsgi)
- `api/` : endpoints API, modèles UserProfile, ApiLog, Gallery, signaux, serializers, vues, middleware
- `webapp/` : modèles métier (Event, Badge, UserBadge, ActionHistory, Report, Comment), vues web, statiques, templates
- `media/` : fichiers uploadés (images, galeries, avatars)
- `db.sqlite3` : base de données SQLite
- `test_failed_endpoints.sh`, `test_user.sh`, `test.sh` : scripts de test API
- `requirement.txt` : dépendances Python

## Middleware & processus automatiques

- **Log API (middleware)** :
  - Middleware `log_api_usage` (déclaré dans `api/views.py` et activé dans `settings.py`) : log chaque requête API dans le modèle `ApiLog` (utilisateur, méthode, chemin, body).
- **Création automatique de UserProfile** :
  - Signal `post_save` sur User (dans `api/signals.py`) : crée un UserProfile à chaque création d’utilisateur.
  - Signal `post_delete` : supprime le UserProfile associé si l’utilisateur est supprimé.
- **Attribution automatique de badges** :
  - Lors de certaines actions (signalement, confirmation, participation événement), des points sont attribués et des badges peuvent être gagnés automatiquement (voir modèles `UserBadge`, `ActionHistory`, `Badge` dans `webapp/models.py`).
- **Historique d’actions (ActionHistory)** :
  - Chaque action utilisateur (signalement, confirmation, participation, etc.) est enregistrée dans `ActionHistory` avec le type, la description, les points gagnés et la date.
- **Processus automatiques sur les endpoints** :
  - `/api/reports/` : le champ `user` est injecté automatiquement à partir de l’utilisateur authentifié.
  - `/api/comments/` : le champ `user` est injecté automatiquement à partir de l’utilisateur authentifié.
  - `/api/gallery/` : les images sont stockées automatiquement dans les bons dossiers (`media/gallery/before/`, `media/gallery/after/`).
  - `/api/profile/avatar/` : upload d’avatar, image stockée dans `media/avatars/`.

## Modèles principaux exposés par l’API

- **UserProfile** : Profil utilisateur étendu (téléphone, points, statut). Créé automatiquement à l’inscription.
- **Badge** : Type de badge disponible (nom, description, points requis).
- **UserBadge** : Badge gagné par un utilisateur, attribué automatiquement selon les points/actions.
- **ActionHistory** : Historique des actions de gamification (type, points, date, description).
- **Report** : Signalement (localisation, description, catégorie, statut, gravité, utilisateur, date).
- **Comment** : Commentaire lié à un report, associé à un utilisateur.
- **Event** : Événement communautaire (titre, description, date, lieu, organisateur, participants).
- **Gallery** : Galerie avant/après liée à un report, images uploadées.
- **ApiLog** : Log de chaque requête API (utilisateur, action, body, date).

---

## Authentification & inscription

### POST `/api/auth/register/`
- Créer un compte citoyen
- **Requête :**
```json
{
  "username": "Josh",
  "phone": "+243991746157",
  "password": "12345678"
}
```
- **Réponse :**
```json
{
  "message": "Inscription réussie.",
  "user": {
    "id": 12,
    "username": "Josh",
    "points": 0
  },
  "token": {
    "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### POST `/api/token/phone/`
- Authentification JWT par numéro de téléphone
- **Requête :**
```json
{
  "phone": "+243991746157",
  "password": "12345678"
}
```
- **Réponse :**
```json
{
  "access": "...",
  "refresh": "..."
}
```

### POST `/api/token/refresh/`
- Rafraîchir un token JWT
- **Requête :**
```json
{
  "refresh": "..."
}
```
- **Réponse :**
```json
{
  "access": "..."
}
```

### POST `/api/token/verify/`
- Vérifier un token JWT
- **Requête :**
```json
{
  "token": "..."
}
```
- **Réponse :**
```json
{
  "token": "..."
}
```

---

## Utilisateur & profil

### GET `/api/userprofiles/`
- Liste des profils (authentifié)
- **Réponse :**
```json
[
  {
    "id": 12,
    "user": 1,
    "phone": "+243991746157",
    "statut": "citoyen",
    "points": 180
  }
]
```

### GET `/api/userprofiles/{id}/`
- Détail d'un profil (authentifié)
- **Réponse :**
```json
{
  "id": 12,
  "user": 1,
  "phone": "+243991746157",
  "statut": "citoyen",
  "points": 180
}
```

### PATCH `/api/userprofiles/{id}/`
- Modifier son profil (authentifié)
- **Requête :**
```json
{
  "phone": "+243991746158"
}
```
- **Réponse :**
```json
{
  "id": 12,
  "user": 1,
  "phone": "+243991746158",
  "statut": "citoyen",
  "points": 180
}
```

---

## Signalements

### GET `/api/reports/`
- Liste des signalements de l'utilisateur
- **Réponse :**
```json
[
  {
    "id": 45,
    "user": 1,
    "latitude": -4.3277,
    "longitude": 15.3136,
    "photo": "/media/reports/1.jpg",
    "description": "Tas d’ordures au coin de la rue.",
    "categorie": "poubelle",
    "statut": "signale",
    "gravite": 2,
    "created_at": "2025-06-22T14:40:02Z"
  }
]
```

### POST `/api/reports/`
- Créer un signalement
- **Requête :**
```json
{
  "latitude": -4.3277,
  "longitude": 15.3136,
  "description": "Tas d’ordures au coin de la rue.",
  "categorie": "poubelle",
  "photo": "<base64-encoded-image>"
}
```
- **Réponse :**
```json
{
  "id": 45,
  "statut": "signale",
  "created_at": "2025-06-22T14:40:02Z"
}
```

### GET `/api/reports/{id}/`
- Détail d'un signalement
- **Réponse :**
```json
{
  "id": 45,
  "user": 1,
  "latitude": -4.3277,
  "longitude": 15.3136,
  "photo": "/media/reports/1.jpg",
  "description": "Tas d’ordures au coin de la rue.",
  "categorie": "poubelle",
  "statut": "signale",
  "gravite": 2,
  "created_at": "2025-06-22T14:40:02Z"
}
```

### POST `/api/reports/{id}/confirm/`
- Confirmer un signalement
- **Réponse :**
```json
{
  "message": "Confirmation enregistrée. Merci !",
  "status": "en_cours"
}
```

### POST `/api/reports/{id}/resolved/`
- Marquer un signalement comme résolu
- **Réponse :**
```json
{
  "message": "Merci pour votre contribution !",
  "status": "nettoye"
}
```

---

## Commentaires

### GET `/api/comments/`
- Liste des commentaires de l'utilisateur
- **Réponse :**
```json
[
  {
    "id": 1,
    "user": 1,
    "report": 45,
    "content": "Bravo pour l’initiative !",
    "created_at": "2025-06-22T15:00:00Z"
  }
]
```

### POST `/api/comments/`
- Ajouter un commentaire
- **Requête :**
```json
{
  "report": 45,
  "content": "Bravo pour l’initiative !"
}
```
- **Réponse :**
```json
{
  "id": 2,
  "user": 1,
  "report": 45,
  "content": "Bravo pour l’initiative !",
  "created_at": "2025-06-22T15:01:00Z"
}
```

### GET `/api/comments/{id}/`
- Détail d'un commentaire
- **Réponse :**
```json
{
  "id": 2,
  "user": 1,
  "report": 45,
  "content": "Bravo pour l’initiative !",
  "created_at": "2025-06-22T15:01:00Z"
}
```

---

## Événements

### GET `/api/events/`
- Liste des événements
- **Réponse :**
```json
[
  {
    "id": 1,
    "titre": "Nettoyage du parc",
    "description": "Venez nombreux !",
    "date": "2025-07-01T09:00:00Z",
    "lieu": "Parc central",
    "organisateur": 1,
    "participants": [1,2],
    "created_at": "2025-06-20T10:00:00Z"
  }
]
```

### GET `/api/events/{id}/`
- Détail d'un événement
- **Réponse :**
```json
{
  "id": 1,
  "titre": "Nettoyage du parc",
  "description": "Venez nombreux !",
  "date": "2025-07-01T09:00:00Z",
  "lieu": "Parc central",
  "organisateur": 1,
  "participants": [1,2],
  "created_at": "2025-06-20T10:00:00Z"
}
```

### POST `/api/events/{id}/participate/`
- Participer à un événement
- **Réponse :**
```json
{
  "message": "Participation enregistrée."
}
```

### POST `/api/events/{id}/cancel_participation/`
- Annuler sa participation
- **Réponse :**
```json
{
  "message": "Participation annulée."
}
```

---

## Galerie

### GET `/api/gallery/`
- Liste des galeries (avant/après)
- **Réponse :**
```json
[
  {
    "id": 1,
    "report": 45,
    "before_image": "/media/gallery/before/1.jpg",
    "after_image": "/media/gallery/after/1.jpg",
    "created_at": "2025-06-22T16:00:00Z"
  }
]
```

### POST `/api/gallery/`
- Ajouter une galerie (avant/après)
- **Requête :**
```json
{
  "report": 45,
  "before_image": "<base64>",
  "after_image": "<base64>"
}
```
- **Réponse :**
```json
{
  "message": "Ajout réussi. En attente de validation."
}
```

### GET `/api/gallery/{id}/`
- Détail d'une galerie
- **Réponse :**
```json
{
  "id": 1,
  "report": 45,
  "before_image": "/media/gallery/before/1.jpg",
  "after_image": "/media/gallery/after/1.jpg",
  "created_at": "2025-06-22T16:00:00Z"
}
```

---

## Carte & pins

### GET `/api/map/pins/`
- Liste des pins pour la carte
- **Réponse :**
```json
[
  {
    "id": 45,
    "latitude": -4.3277,
    "longitude": 15.3136,
    "statut": "signale",
    "categorie": "poubelle"
  },
  {
    "id": 44,
    "latitude": -4.3280,
    "longitude": 15.3131,
    "statut": "nettoye",
    "categorie": "dangereux"
  }
]
```

---

## Gamification

### GET `/api/gamification/points/`
- Points de l'utilisateur
- **Réponse :**
```json
{ "points": 180 }
```

### GET `/api/gamification/badges/`
- Badges obtenus
- **Réponse :**
```json
[
  { "name": "Explorateur", "earned_at": "2025-06-10T12:30:00Z" },
  { "name": "Nettoyeur", "earned_at": "2025-06-15T18:50:00Z" }
]
```

### GET `/api/gamification/progress/`
- Progression vers le prochain badge
- **Réponse :**
```json
{
  "next_badge": "Nettoyeur",
  "progress": 0.8,
  "to_next": 20,
  "points": 180
}
```

### GET `/api/user/leaderboard/`
- Classement des utilisateurs
- **Réponse :**
```json
[
  { "username": "Josh", "points": 180 },
  { "username": "Anna", "points": 150 }
]
```

---

## Avatar

### POST `/api/profile/avatar/`
- Upload d'un avatar (multipart)
- **Requête (multipart) :**
  - Champ : `avatar` (fichier image)
- **Réponse :**
```json
{
  "message": "Avatar mis à jour.",
  "avatar_url": "/media/avatars/josh.png"
}
```

---

## Logs API (admin)

### GET `/api/apilogs/`
- Liste des logs API (admin)
- **Réponse :**
```json
[
  {
    "id": 1,
    "user": 1,
    "method": "GET",
    "path": "/api/reports/",
    "status_code": 200,
    "timestamp": "2025-06-22T17:00:00Z",
    "ip_address": "127.0.0.1",
    "extra": "{}"
  }
]
```

### GET `/api/apilogs/{id}/`
- Détail d'un log API (admin)
- **Réponse :**
```json
{
  "id": 1,
  "user": 1,
  "method": "GET",
  "path": "/api/reports/",
  "status_code": 200,
  "timestamp": "2025-06-22T17:00:00Z",
  "ip_address": "127.0.0.1",
  "extra": "{}"
}
```

### Interface d’administration Django
- Les logs API sont aussi consultables via l’interface d’administration Django :
  - Rendez-vous sur `/admin/` puis dans la section **ApiLog**.
  - Seuls les administrateurs y ont accès.

---

## Documentation interactive

### GET `/api/swagger/`
- Swagger UI

### GET `/api/redoc/`
- Redoc UI

---

**Remarque :**
- Tous les endpoints nécessitent l’authentification sauf inscription, login, documentation, et certains GET publics.
- Les routes `/api/userprofiles/`, `/api/reports/`, `/api/comments/` sont restreintes à l’utilisateur connecté (il ne voit que ses propres objets).
- Les endpoints d’admin (`apilogs`) sont réservés aux administrateurs.
- Les actions custom sont suffixées (`/confirm/`, `/resolved/`, `/participate/`, etc.).

Pour chaque endpoint, se référer au Swagger (`/api/swagger/`) pour les schémas détaillés.
