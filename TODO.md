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
- [ ] **[Priorité 1]** Formulaires d’authentification (login/register)
- [ ] **[Priorité 1]** Formulaire de signalement (avec upload photo, géoloc, description, catégorie)
- [ ] Carte interactive (affichage des pins, popups avec détails)
- [ ] **[Priorité 1]** Dashboard utilisateur (points, badges, progression, signalements récents)
- [ ] **[Priorité 1]** Dashboard organisation/admin (statistiques, gestion, notifications)
- [ ] Galerie avant/après
- [ ] Composant commentaires
- [ ] Composant classement/leaderboard
- [ ] Composant événements

## 3. Pour une première présentation publique
- [ ] Les composants non encore connectés à l’API doivent afficher des données factices (mock) ou placeholders élégants
- [ ] Les interactions principales (signalement, carte, login, dashboard) doivent fonctionner ou simuler un flux utilisateur
- [ ] Les pages doivent être accessibles via la navigation, même si certaines fonctionnalités sont en “coming soon” ou “démo”

---

> Priorité : Brancher chaque composant clé à son endpoint, mocker les autres, assurer une navigation fluide et une UX propre pour la démo.
