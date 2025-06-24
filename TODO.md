# TODO pour l'intégration Frontend React <-> API EcoCity

## 1. Intégration API côté frontend
- [x] **[Priorité 1]** Authentification (login/register, gestion JWT, refresh, logout)
- [x] Récupération et affichage des signalements sur la carte (GET /api/v1/reports/, /api/v1/map/pins/)
- [x] **[Priorité 1]** Création de signalement (POST /api/v1/reports/), upload photo
- [x] Détail d’un signalement (GET /api/v1/reports/{id}/), actions “c’est toujours là” et “c’est nettoyé”
- [x] Affichage des galeries avant/après (GET /api/v1/gallery/)
- [x] Affichage des classements (GET /api/v1/user/leaderboard/)
- [x] Affichage des badges, points, progression (GET /api/v1/gamification/*)
- [x] Affichage et ajout de commentaires (GET/POST /api/v1/comments/)
- [x] Affichage des événements citoyens (GET /api/v1/events/), participation à un événement

## 2. Composants frontend à relier à l’API
- [x] **[Priorité 1]** Formulaires d’authentification (login/register)
- [x] **[Priorité 1]** Formulaire de signalement (avec upload photo, géoloc, description, catégorie)
- [x] Carte interactive (affichage des pins, popups avec détails)
- [x] **[Priorité 1]** Dashboard utilisateur (points, badges, progression, signalements récents)
- [x] **[Priorité 1]** Dashboard organisation/admin (statistiques, gestion, notifications)
- [ ] Galerie avant/après
- [ ] Composant commentaires
- [ ] Composant classement/leaderboard
- [ ] Composant événements

## 3. Pour une première présentation publique
- [x] Les composants non encore connectés à l’API doivent afficher des données factices (mock) ou placeholders élégants
- [x] Les interactions principales (signalement, carte, login, dashboard) doivent fonctionner ou simuler un flux utilisateur
- [x] Les pages doivent être accessibles via la navigation, même si certaines fonctionnalités sont en “coming soon” ou “démo”

## Étapes à réaliser pour lier login/register frontend à l'API backend
- [x] Remplacer la logique simulée de LoginModal par des appels réels à l’API backend (login/register)
- [x] Gérer le stockage du token JWT après connexion/inscription
- [x] Afficher les erreurs et succès avec un toast
- [x] Pour chaque bouton ou fonctionnalité non reliée à l’API, afficher un popup “Fonctionnalité en cours de développement”

---

> Priorité : Brancher chaque composant clé à son endpoint, mocker les autres, assurer une navigation fluide et une UX propre pour la démo.
