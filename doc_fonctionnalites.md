# Implication des profils sociaux & cas d’usage EcoCity

## 1. Citoyens (utilisateurs standards)
- **Signaler un problème** : Les citoyens peuvent créer un signalement (ex : pollution, déchets, dégradation urbaine) via l’application.
- **Commenter & échanger** : Ils peuvent commenter les signalements pour encourager, préciser ou proposer des solutions.
- **Participer à des événements** : Ils peuvent s’inscrire à des événements communautaires (nettoyages, sensibilisation) organisés par la mairie ou des associations.
- **Gagner des points & badges** :  
  - Chaque action (signalement, participation, commentaire) rapporte un certain nombre de points.
  - Les points sont cumulés sur le profil utilisateur.
  - Les badges sont attribués automatiquement dès qu’un seuil de points est atteint : chaque badge nécessite plus de points que le précédent.
  - Certains événements peuvent attribuer un badge spécial si l’utilisateur atteint un score fixé par l’admin.
- **Consulter la carte** : Visualisation des signalements et actions sur une carte interactive.
- **Voir sa progression** : Accès à son profil, ses points, ses badges, et sa position dans le classement.

## 2. Administrateurs (mairie, gestionnaires)
- **Valider & suivre les signalements** : Les admins peuvent consulter, valider, changer le statut ou clôturer les signalements.
- **Organiser des événements** : Création et gestion d’événements publics, définition des points attribués à la participation (`points_awarded`) et des badges spéciaux (`badge_reward`).
- **Attribuer des badges spéciaux** : Création de nouveaux badges, attribution manuelle ou automatique selon les règles définies.
- **Analyser l’activité** : Accès à des statistiques, logs API, et au classement des utilisateurs les plus actifs.

## 3. Entreprises & associations partenaires
- **Proposer des événements** : Possibilité de suggérer ou co-organiser des événements (ex : sponsoring d’un nettoyage).
- **Récompenser l’engagement** : Attribution de badges ou récompenses spécifiques à certains challenges ou actions.
- **Visibilité sur la plateforme** : Présence sur la carte, dans les événements, et dans les communications liées à l’application.

---

## Fonctionnement détaillé du système de points et de badges

- **Attribution des points** :
  - **Signalement** : chaque signalement validé rapporte un nombre fixe de points (ex : 10 points).
  - **Commentaire** : chaque commentaire pertinent rapporte un petit nombre de points (ex : 2 points).
  - **Participation à un événement** : le nombre de points gagnés est défini par l’admin pour chaque événement (`points_awarded`).
  - **Autres actions** : d’autres actions (confirmation, résolution, etc.) peuvent aussi rapporter des points selon la configuration.

- **Cumul des points** :
  - Les points sont cumulés sur le profil utilisateur.
  - Le total de points détermine la progression dans la gamification et l’accès à de nouveaux badges.

- **Attribution automatique des badges** :
  - Chaque badge a un seuil de points à atteindre (`points_required`).
  - Lorsqu’un utilisateur atteint ce seuil, le badge lui est attribué automatiquement.
  - Les badges sont hiérarchisés : chaque nouveau badge nécessite plus de points que le précédent.
  - Un badge spécial peut être attribué lors de la participation à un événement si l’utilisateur atteint le score requis (`points_for_badge` et `badge_reward`).

- **Exemple de progression** :
  - 10 points : badge “Explorateur” (premier signalement)
  - 50 points : badge “Nettoyeur” (plusieurs actions)
  - 100 points : badge “Ambassadeur” (engagement fort)
  - Un événement “Nettoyage du parc” peut attribuer un badge “Héros du Parc” si l’utilisateur atteint 30 points lors de l’événement.

- **Visualisation** :
  - Les utilisateurs peuvent consulter leurs points, leurs badges obtenus, et leur progression vers le prochain badge dans leur espace personnel.

---

## Fonctionnalités clés pour tous les profils
- **Signalement géolocalisé** (photo, description, catégorie)
- **Commentaires uniquement au moment du signaler**
- **Participation à des événements**
- **Système de points & badges (gamification)**
- **Classement et progression**
- **Galerie avant/après**
- **Consultation de la carte des actions**

> L’application vise à impliquer tous les acteurs de la ville dans une démarche collaborative, ludique et transparente pour améliorer l’environnement urbain.
