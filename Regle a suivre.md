**liste complète et priorisée** des **fonctionnalités de l'application** de gestion participative des déchets avec **signalements, carte, gamification et événements**.

---

## ✅ **FONCTIONNALITÉS PRIORISÉES (MVP – version minimale viable)**

### 🔴 1. **Signalement de déchet**

* Géolocalisation (auto ou manuelle)
* Ajout de photo
* Description courte
* Catégorie (poubelle pleine / décharge sauvage / dangereux)
* Envoi sans compte (anonyme possible)

### 🟠 2. **Carte interactive publique**

* Affichage des signalements sous forme de pins colorés
* Pop-up avec détails : photo, description, date, auteur
* Filtrage par statut et catégorie

### 🟠 3. **Gestion des statuts de signalements**

* “C’est toujours là” (confirmation)
* “C’est nettoyé” (résolution citoyenne)
* Résolution officielle par autorité

### 🟠 4. **Authentification & rôles**

* Inscription / Connexion
* 3 rôles : Citoyen / Organisation / Admin
* Gestion de profils (avatar, bio, historique)

---

## ⚙️ **FONCTIONNALITÉS SECONDAIRES (à ajouter juste après le MVP)**

### 🟡 5. **Gamification**

* Attribution automatique de points pour chaque action utile
* Badges débloqués selon les paliers atteints
* Historique des actions

### 🟡 6. **Classement (leaderboard)**

* Top utilisateurs par quartier, ville ou national
* Rang affiché dans le dashboard utilisateur

### 🟡 7. **Galerie Avant / Après**

* Affichage d’images avant/après nettoyage
* Inspiration visuelle pour inciter à participer
* Lien avec événements ou signalements

### 🟡 8. **Commentaires**

* Commentaires publics sur chaque signalement
* Interaction citoyenne

---

## 🏛️ **FONCTIONNALITÉS POUR ORGANISATIONS & ADMIN**

### 🔵 9. **Tableau de bord pour organisations**

* Vue carte filtrée sur leur zone
* Liste des signalements reçus
* Boutons “Planifier une collecte”, “Marquer comme traité”
* Statistiques par zone

### 🔵 10. **Création et gestion d’événements citoyens**

* Créer un événement (lieu, date, heure)
* Voir les participants
* Associer à des signalements

### 🔵 11. **Dashboard admin plateforme**

* Vue globale des signalements toutes zones
* Statistiques (signalements, résolutions, utilisateurs)
* Modération des signalements et images
* Gestion des utilisateurs et organisations

---

## 🧩 **FONCTIONNALITÉS TERTIAIRES (plus tard)**

### ⚪ 12. **Notifications**
* Invitations aux événements
---

## 🧩 Résumé par priorité :

| Priorité      | Fonctionnalité clé                     |
| ------------- | -------------------------------------- |
| 🔴 Priorité 1 | Signalement, Carte, Statut, Auth, Rôle |
| 🟠 Priorité 2 | Gamification, Leaderboard, Galerie     |
| 🟡 Priorité 3 | Commentaires, Tableau orga, Événements |
| 🔵 Priorité 4 | Dashboard admin, Modération            |
| ⚪ Priorité 5  | Notifications, Multilingue, Hors-ligne |


---
Parfait ✅
Voici la **liste complète, claire et hiérarchisée** des **fonctionnalités de ton API REST** qui seront utilisées **uniquement par les utilisateurs lambda (citoyens)** dans **ton application mobile Flutter**.

> 🎯 **Objectif** : limiter les appels API à ce qui est **utile pour l’utilisateur citoyen mobile**.
> ⚠️ Les fonctionnalités admin/organisation restent accessibles uniquement depuis le **web**.

---

## ✅ **API REST pour Flutter – Utilisateurs Citoyens (lambda)**

---

### 🔐 1. Authentification (JWT)

| Méthode | Route                    | Description                     |
| ------- | ------------------------ | ------------------------------- |
| `POST`  | `/api/v1/auth/register/` | Créer un compte                 |
| `POST`  | `/api/v1/auth/login/`    | Se connecter et recevoir le JWT |
| `POST`  | `/api/v1/auth/refresh/`  | Rafraîchir le token             |
| `POST`  | `/api/v1/auth/logout/`   | Déconnexion                     |
| `GET`   | `/api/v1/user/me/`       | Voir ses infos personnelles     |
| `PATCH` | `/api/v1/user/profile/`  | Modifier bio, avatar, langue... |

---

### 🗺️ 2. Carte & Signalements

| Méthode | Route                            | Description                                           |
| ------- | -------------------------------- | ----------------------------------------------------- |
| `GET`   | `/api/v1/reports/`               | Liste des signalements (paginée)                      |
| `GET`   | `/api/v1/reports/<id>/`          | Détail d’un signalement                               |
| `POST`  | `/api/v1/reports/`               | Créer un signalement (image, lat/lng, description...) |
| `POST`  | `/api/v1/reports/<id>/confirm/`  | Bouton "C’est toujours là"                            |
| `POST`  | `/api/v1/reports/<id>/resolved/` | Bouton "C’est nettoyé"                                |
| `GET`   | `/api/v1/map/pins/`              | Obtenir les pins rapides (id, lat, lng, status)       |

---

### 🧼 3. Galerie Avant / Après

| Méthode | Route              | Description                                        |
| ------- | ------------------ | -------------------------------------------------- |
| `GET`   | `/api/v1/gallery/` | Voir les cas avant/après inspirants                |
| `POST`  | `/api/v1/gallery/` | Ajouter un cas avant/après (liée à un signalement) |

---

### 🧩 4. Gamification

| Méthode | Route                            | Description                      |
| ------- | -------------------------------- | -------------------------------- |
| `GET`   | `/api/v1/gamification/points/`   | Total de points de l’utilisateur |
| `GET`   | `/api/v1/gamification/badges/`   | Badges gagnés                    |
| `GET`   | `/api/v1/gamification/progress/` | Progrès vers prochain badge      |
| `GET`   | `/api/v1/user/leaderboard/`      | Classement local ou général      |

---

### 💬 5. Commentaires (optionnel)

| Méthode | Route                           | Description                               |
| ------- | ------------------------------- | ----------------------------------------- |
| `POST`  | `/api/v1/comments/`             | Laisser un commentaire sur un signalement |
| `GET`   | `/api/v1/comments/?report=<id>` | Voir les commentaires d’un signalement    |

---

### 📅 6. Événements citoyens (facultatif sur mobile)

| Méthode | Route                              | Description                   |
| ------- | ---------------------------------- | ----------------------------- |
| `GET`   | `/api/v1/events/`                  | Liste des événements citoyens |
| `POST`  | `/api/v1/events/<id>/participate/` | Rejoindre un événement        |

---

## 🧱 Architecture API Flutter <-> Django REST

* Auth → `SharedPreferences` côté Flutter pour stocker les tokens
* Upload photo (multipart) pour report et avatar
* Appels `GET` pour carte, galerie, stats, classement
* Appels `POST` pour signaler, confirmer, commenter, participer

---

Souhaites-tu maintenant :

* Une **structure JSON Swagger** ou Postman ?
* Un **starter DRF (serializers, views, routes)** prêt à l’emploi ?
* Le **code Flutter d’intégration avec JWT et `dio` / `http`** ?


---



#regles
1. Je veux qu'on code en HTML css et js  inspire de tailwind
2. on va subdiver les code en des modules et fonctions ou classe permettant une lecture facile
3. on evoluera fonctionalite apres fonctionalite 