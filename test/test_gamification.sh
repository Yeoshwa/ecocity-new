#!/bin/bash
# Script de test EcoCity : création et vérification des objets de base
# À exécuter depuis la racine du projet

API_URL="http://127.0.0.1:8000/api"
ADMIN_TOKEN="<VOTRE_TOKEN_ADMIN>" # Remplacer par un token admin valide
USER_TOKEN="<VOTRE_TOKEN_USER>"   # Remplacer par un token utilisateur valide

# 0. Création d'un nouvel utilisateur et récupération du token
USERNAME="testuser$RANDOM"
PHONE="+2439917$RANDOM"
PASSWORD="TestPass123!"
echo "[0] Création d'un nouvel utilisateur ($USERNAME)"
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register/" -H "Content-Type: application/json" -d '{"username": "'$USERNAME'", "phone": "'$PHONE'", "password": "'$PASSWORD'"}')
echo "$REGISTER_RESPONSE"
USER_TOKEN=$(echo $REGISTER_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['token']['access'])")
USER_ID=$(echo $REGISTER_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin)['user']['id'])")
echo "Token utilisateur: $USER_TOKEN"

# 1. Création d'un badge de base (à faire manuellement si pas d'endpoint public)
echo "[1] Création d'un badge de base (à faire manuellement si pas d'endpoint public)"
# curl -X POST "$API_URL/badges/" -H "Authorization: Bearer $ADMIN_TOKEN" -H "Content-Type: application/json" -d '{"name": "Testeur", "description": "Badge test", "points_required": 10}'

# 2. Création d'un commentaire (sera fait après la création d'un report)
# echo "[2] Création d'un commentaire sur un report (id=1)"
# curl -X POST "$API_URL/comments/" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" -d '{"report": 1, "content": "Test commentaire automatique"}'

# 3. Création d'un événement
EVENT_PAYLOAD='{"title": "Test Event", "description": "Événement test", "date": "2025-07-01T09:00:00Z", "location": "Test lieu"}'
echo "[3] Création d'un événement"
curl -X POST "$API_URL/events/" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" -d "$EVENT_PAYLOAD"

# 4. Création d'un report (pour déclencher la logique de gamification)
REPORT_PAYLOAD='{"latitude": 0.0, "longitude": 0.0, "description": "Test report", "categorie": "test", "statut": "nouveau", "gravite": 1, "photo": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD..."}'
echo "[4] Création d'un report"
REPORT_RESPONSE=$(curl -s -X POST "$API_URL/reports/" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" -d "$REPORT_PAYLOAD")
echo "$REPORT_RESPONSE"
REPORT_ID=$(echo $REPORT_RESPONSE | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")

# 2bis. Création d'un commentaire sur le report créé
if [ -n "$REPORT_ID" ]; then
  echo "[2bis] Création d'un commentaire sur le report $REPORT_ID"
  COMMENT_RESPONSE=$(curl -s -X POST "$API_URL/comments/" -H "Authorization: Bearer $USER_TOKEN" -H "Content-Type: application/json" -d '{"report": '$REPORT_ID', "content": "Test commentaire automatique"}')
  echo "$COMMENT_RESPONSE"
else
  echo "[2bis] Impossible de créer un commentaire : report non créé."
fi

# 5. Vérification des badges disponibles

echo "[5] Vérification des badges disponibles (Badge)"
curl -X GET "$API_URL/badges/" -H "Authorization: Bearer $USER_TOKEN"

# 6. Vérification des badges obtenus (UserBadge)
echo "[6] Vérification des badges obtenus (UserBadge)"
curl -X GET "$API_URL/userbadges/" -H "Authorization: Bearer $USER_TOKEN"

echo "[7] Vérification de l'historique d'actions (ActionHistory)"
curl -X GET "$API_URL/gamification/points/" -H "Authorization: Bearer $USER_TOKEN"

echo "[8] Vérification des commentaires"
curl -X GET "$API_URL/comments/" -H "Authorization: Bearer $USER_TOKEN"

echo "[9] Vérification des événements"
curl -X GET "$API_URL/events/" -H "Authorization: Bearer $USER_TOKEN"

echo "[10] Vérification des reports"
curl -X GET "$API_URL/reports/" -H "Authorization: Bearer $USER_TOKEN"

# Instructions complémentaires
echo "\nVérifiez dans l'admin Django si les objets Badge, UserBadge, ActionHistory, Comment, Event sont bien créés après ces tests."
echo "Si UserBadge ou ActionHistory ne sont pas créés automatiquement, il faut ajouter la logique côté backend (signaux ou vues)."
