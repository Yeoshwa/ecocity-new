# Certified API Test Report

## Table des matières

- Endpoints sans authentification requise
- Endpoints nécessitant une authentification
- Champs nullable et non-nullable

---

## Endpoints sans authentification requise

### 1. `POST /api/auth/register/`

**Description** : Inscription d’un nouvel utilisateur (par téléphone).

**Requête**
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "testuser",
  "phone": "+243991746157",
  "password": "testpassword"
}
```

**Réponse (201 Created)**
```json
{
  "id": 1,
  "username": "testuser",
  "phone": "+243991746157"
}
```

---

### 2. `POST /api/token/phone/`

**Description** : Authentification d’un utilisateur par téléphone.

**Requête**
```http
POST /api/token/phone/
Content-Type: application/json

{
  "phone": "+243991746157",
  "password": "testpassword"
}
```

**Réponse (200 OK)**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

---

### 3. `GET /api/reports/`

**Description** : Liste des signalements publics.

**Requête**
```http
GET /api/reports/
```

**Réponse (200 OK)**
```json
[
  {
    "id": 1,
    "category": "Décharge sauvage",
    "description": "Tas de déchets près du marché",
    "latitude": -4.312,
    "longitude": 15.284,
    "photo": null,
    "created_at": "2025-06-24T10:00:00Z"
  }
]
```

---

## Endpoints nécessitant une authentification

### 1. `POST /api/reports/`

**Description** : Création d’un signalement (authentification requise).

**Requête**
```http
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "category": "Décharge sauvage",
  "description": "Tas de déchets près du marché",
  "latitude": -4.312,
  "longitude": 15.284
}
```

**Réponse (201 Created)**
```json
{
  "id": 2,
  "category": "Décharge sauvage",
  "description": "Tas de déchets près du marché",
  "latitude": -4.312,
  "longitude": 15.284,
  "photo": null,
  "created_at": "2025-06-24T10:05:00Z"
}
```

---

### 2. `POST /api/reports/{id}/comment/`

**Description** : Ajouter un commentaire à un signalement (authentification requise).

**Requête**
```http
POST /api/reports/1/comment/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "text": "Merci pour le signalement !"
}
```

**Réponse (201 Created)**
```json
{
  "id": 1,
  "report": 1,
  "text": "Merci pour le signalement !",
  "created_at": "2025-06-24T10:10:00Z"
}
```

---

## Champs nullable et non-nullable

| Champ         | Type     | Nullable | Endpoints concernés                |
|---------------|----------|----------|------------------------------------|
| id            | int      | Non      | Toutes réponses                    |
| category      | string   | Non      | /api/reports/                      |
| description   | string   | Non      | /api/reports/                      |
| latitude      | float    | Non      | /api/reports/                      |
| longitude     | float    | Non      | /api/reports/                      |
| photo         | string   | Oui      | /api/reports/ (null si pas de photo)|
| created_at    | datetime | Non      | /api/reports/, /api/reports/{id}/comment/ |
| text          | string   | Non      | /api/reports/{id}/comment/         |
| access        | string   | Non      | /api/token/phone/                  |
| refresh       | string   | Non      | /api/token/phone/                  |
| username      | string   | Non      | /api/auth/register/                |
| phone         | string   | Non      | /api/auth/register/, /api/token/phone/ |
| password      | string   | Non      | /api/auth/register/, /api/token/phone/   |

---

**Remarques :**
- L’inscription et la connexion se font par numéro de téléphone (phone) et non par email.
- Les endpoints de création (`POST /api/reports/`, `POST /api/reports/{id}/comment/`) exigent un token d’authentification (Bearer access_token).
- Les champs `photo` peuvent être `null` si aucune image n’est fournie.
- Les champs `id`, `category`, `description`, `latitude`, `longitude`, `created_at` sont toujours présents et non-nullables dans les réponses.

---

N’hésite pas à adapter ce template selon les spécificités de ton API !