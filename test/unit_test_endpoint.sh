#!/bin/bash 
set -e  # Arrêter le script en cas d'erreur
#============================================================================================
# Ce script est destiné à exécuter des tests unitaires pour les endpoints de l'application
# Chaque commande est commentée. Décommentez pour exécuter un test à la fois.
#============================================================================================

# 1. SUPPRIMER LA BASE DE DONNÉES ET REFAIRE LES MIGRATIONS
#rm -f ../db.sqlite3
#python ../manage.py migrate
#python ../manage.py makemigrations


# 2. CRÉER UN SUPERUTILISATEUR (pour accéder à l'admin)
#python ../manage.py createsuperuser --username admin --email admin@gmail.com
#python ../manage.py runserver 8000 
# 2. CRÉER UN UTILISATEUR (inscription)
# curl -s -X POST http://localhost:8000/api/auth/register/ \
#    -H "Content-Type: application/json" \
#    -d '{"username": "testuser2", "phone": "+243900000112", "password": "motdepasse100"}'

# echo "[INFO] Utilisateur testuser2 créé (ou déjà existant)."

# # 3. LOGIN (récupérer le token JWT)
# TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
#   -H "Content-Type: application/json" \
#   -d '{"phone": "+243900000112", "password": "motdepasse100"}')
# ACCESS=$(echo $TOKENS | python -c "import sys, json; print(json.load(sys.stdin)['access'])")
# echo "Access token: $ACCESS"

# 4. TESTER CHAQUE ENDPOINT (un à un)

# --- PROFIL UTILISATEUR ---
# 0. Créer un utilisateur de test
# curl -X POST http://localhost:8000/api/auth/register/ \
#   -H "Content-Type: application/json" \
#   -d '{"username": "testuser_api", "phone": "+243900099999", "password": "motdepasseapi"}'

# 1. Connexion et récupération du token
#TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
# -H "Content-Type: application/json" \
#  -d '{"phone": "+243900099999", "password": "motdepasseapi"}')
#ACCESS=$(echo $TOKENS | python -c "import sys, json; print(json.load(sys.stdin)['access'])")
#echo "Access token: $ACCESS"
# Vérification du token
# (Gardez cette vérification commentée pour permettre les tests anonymes)

# --- SIGNALEMENTS ---
# Test en anonyme (sans token)
# echo -e "\n[ANONYME] Création de signalement sans token :"
# RESPONSE_ANON=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X POST http://localhost:8000/api/reports/ -H "Content-Type: application/json" -d '{"latitude": -4.32, "longitude": 15.31, "description": "Tas dordures.", "categorie": "poubelle"}')
# echo "$RESPONSE_ANON"
# echo

# Affichage détaillé si erreur
# if [[ "$RESPONSE_ANON" == *"error"* || "$RESPONSE_ANON" == *"ErrorDetail"* ]]; then
#   echo "[DEBUG] Erreur lors de la création anonyme :"
#   echo "$RESPONSE_ANON" | jq . || echo "$RESPONSE_ANON"
# fi

# echo -e "\n[ANONYME] Liste des signalements sans token :"
# RESPONSE_LIST_ANON=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET http://localhost:8000/api/reports/)
# echo "$RESPONSE_LIST_ANON"
# echo

# Vérification du token avant les tests connectés
# if [ -z "$ACCESS" ]; then
#   echo "[ERREUR] Le token d'accès (ACCESS) est vide. Connectez-vous et récupérez le token avant de lancer les tests protégés."
# else
#   # Test en étant connecté (avec token)
#   echo -e "\n[CONNECTE] Création de signalement avec token :"
#   RESPONSE_CONN=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X POST http://localhost:8000/api/reports/ -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" -d '{"latitude": -4.32, "longitude": 15.31, "description": "Tas dordures.", "categorie": "poubelle"}')
#   echo "$RESPONSE_CONN"
#   echo

#   if [[ "$RESPONSE_CONN" == *"error"* || "$RESPONSE_CONN" == *"ErrorDetail"* ]]; then
#     echo "[DEBUG] Erreur lors de la création connectée :"
#     echo "$RESPONSE_CONN" | jq . || echo "$RESPONSE_CONN"
#   fi

#   echo -e "\n[CONNECTE] Liste des signalements avec token :"
#   RESPONSE_LIST_CONN=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET http://localhost:8000/api/reports/ -H "Authorization: Bearer $ACCESS")
#   echo "$RESPONSE_LIST_CONN"
#   echo
# fi

# --- CARTE (pins) ---

curl -X GET http://localhost:8000/api/map/pins/

# --- GALERIE AVANT/APRÈS ---
# curl -X GET http://localhost:8000/api/gallery/
# curl -X POST http://localhost:8000/api/gallery/ -H "Authorization: Bearer $ACCESS" -F "report=1" -F "before_image=@../img2.jpg" -F "after_image=@../img2.jpg"
# curl -X GET http://localhost:8000/api/gallery/1/

# --- GAMIFICATION ---
# curl -X GET http://localhost:8000/api/gamification/points/ -H "Authorization: Bearer $ACCESS"
# curl -X GET http://localhost:8000/api/gamification/badges/ -H "Authorization: Bearer $ACCESS"
# curl -X GET http://localhost:8000/api/gamification/progress/ -H "Authorization: Bearer $ACCESS"
# curl -X GET http://localhost:8000/api/user/leaderboard/

# --- COMMENTAIRES ---
# curl -X POST http://localhost:8000/api/comments/ -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" -d '{"report": 1, "content": "Bravo pour l’initiative !"}'
# curl -X GET http://localhost:8000/api/comments/?report=1 -H "Authorization: Bearer $ACCESS"
# curl -X GET http://localhost:8000/api/comments/1/ -H "Authorization: Bearer $ACCESS"

# --- ÉVÉNEMENTS ---
# curl -X GET http://localhost:8000/api/events/ -H "Authorization: Bearer $ACCESS"
# curl -X GET http://localhost:8000/api/events/1/ -H "Authorization: Bearer $ACCESS"
# curl -X POST http://localhost:8000/api/events/1/participate/ -H "Authorization: Bearer $ACCESS"

# --- AVATAR ---
# curl -X POST http://localhost:8000/api/profile/avatar/ -H "Authorization: Bearer $ACCESS" -F "avatar=@../img2.jpg"

# --- LOGS API (admin) ---
#curl -X GET http://localhost:8000/api/apilogs/ -H "Authorization: Bearer $ACCESS"

# --- DOC INTERACTIVE ---
#curl -X GET http://localhost:8000/api/swagger/
#curl -X GET http://localhost:8000/api/redoc/

# --- AVANT/APRÈS ---
# Vérifier que le token est bien présent
# if [ -z "$ACCESS" ]; then
#   echo "[ERREUR] Le token d'accès (ACCESS) est vide. Connectez-vous et récupérez le token avant de lancer les tests protégés."
#   exit 1
# fi

# echo "[DEBUG] Token utilisé : $ACCESS"

# 1. Créer un signalement (report) pour le test avant/après
# RESPONSE_REPORT=$(curl -s -X POST http://localhost:8000/api/reports/ -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" -d '{"latitude": -4.32, "longitude": 15.31, "description": "Test avant/après.", "categorie": "nettoyage"}')
# echo "$RESPONSE_REPORT"
# REPORT_ID=$(echo "$RESPONSE_REPORT" | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")
# if [ -z "$REPORT_ID" ]; then
#   echo "[ERREUR] Impossible de créer le report, réponse : $RESPONSE_REPORT"
#   exit 1
# fi
# echo "[INFO] Report créé pour test avant/après, id: $REPORT_ID"

# 2. Poster une galerie avant/après liée à ce report
# RESPONSE_GALLERY=$(curl -s -X POST http://localhost:8000/api/gallery/ -H "Authorization: Bearer $ACCESS" -F "report=$REPORT_ID" -F "before_image=@../img2.jpg" -F "after_image=@../img2.jpg")
# echo "$RESPONSE_GALLERY"
# GALLERY_ID=$(echo "$RESPONSE_GALLERY" | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")
# if [ -z "$GALLERY_ID" ]; then
#   echo "[ERREUR] Impossible de créer la galerie, réponse : $RESPONSE_GALLERY"
#   exit 1
# fi
# echo "[INFO] Galerie avant/après créée, id: $GALLERY_ID"

# 3. Récupérer la galerie avant/après créée
# curl -X GET http://localhost:8000/api/gallery/report/$REPORT_ID/

# --- AVANT/APRÈS ---
# Connexion avec l'utilisateur testuser2
# TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
#   -H "Content-Type: application/json" \
#   -d '{"phone": "+243900000112", "password": "motdepasse100"}')
# ACCESS=$(echo "$TOKENS" | python -c "import sys, json; print(json.load(sys.stdin).get('access', ''))")
# if [ -z "$ACCESS" ]; then
#   echo "[ERREUR] Impossible de récupérer le token pour testuser2. Réponse : $TOKENS"
#   exit 1
# fi

# echo "[DEBUG] Token utilisé (testuser2) : $ACCESS"

# # 1. Créer un signalement (report) pour le test avant/après
# RESPONSE_REPORT=$(curl -s -X POST http://localhost:8000/api/reports/ -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" -d '{"latitude": -4.32, "longitude": 15.31, "description": "Test avant/après.", "categorie": "nettoyage"}')
# echo "$RESPONSE_REPORT"
# REPORT_ID=$(echo "$RESPONSE_REPORT" | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")
# if [ -z "$REPORT_ID" ]; then
#   echo "[ERREUR] Impossible de créer le report, réponse : $RESPONSE_REPORT"
#   exit 1
# fi
# echo "[INFO] Report créé pour test avant/après, id: $REPORT_ID"

# # 2. Poster une galerie avant/après liée à ce report
# RESPONSE_GALLERY=$(curl -s -X POST http://localhost:8000/api/gallery/ -H "Authorization: Bearer $ACCESS" -F "report=$REPORT_ID" -F "before_image=@../img2.jpg" -F "after_image=@../img2.jpg")
# echo "$RESPONSE_GALLERY"
# GALLERY_ID=$(echo "$RESPONSE_GALLERY" | python -c "import sys, json; print(json.load(sys.stdin).get('id', ''))")
# if [ -z "$GALLERY_ID" ]; then
#   echo "[ERREUR] Impossible de créer la galerie, réponse : $RESPONSE_GALLERY"
#   exit 1
# fi
# echo "[INFO] Galerie avant/après créée, id: $GALLERY_ID"

# # 3. Récupérer la galerie avant/après créée
# curl -X GET http://localhost:8000/api/gallery/report/$REPORT_ID/

# #============================================================================================
# # Pour chaque test :
# # 1. Décommentez la commande souhaitée
# # 2. Exécutez le script
# # 3. Vérifiez la réponse
# # 4. Passez au test suivant
# #============================================================================================

# --- GAMIFICATION ---
# Connexion avec l'utilisateur testuser2
# TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
#   -H "Content-Type: application/json" \
#   -d '{"phone": "+243900000112", "password": "motdepasse100"}')
# ACCESS=$(echo "$TOKENS" | python -c "import sys, json; print(json.load(sys.stdin).get('access', ''))")
# if [ -z "$ACCESS" ]; then
#   echo -e "\033[1;31m[ERREUR] Impossible de récupérer le token pour testuser2. Réponse : $TOKENS\033[0m"
#   exit 1
# fi

# echo -e "\033[1;34m==============================="
# echo "   TESTS GAMIFICATION API   "
# echo -e "===============================\033[0m"
# echo -e "[DEBUG] Token utilisé (testuser2) : $ACCESS\n"

# # Test des endpoints gamification
# for endpoint in points badges progress; do
#   echo -e "\033[1;33m--- Test /api/gamification/$endpoint/ ---\033[0m"
#   RESPONSE=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET http://localhost:8000/api/gamification/$endpoint/ -H "Authorization: Bearer $ACCESS")
#   echo "$RESPONSE"
#   HTTP_CODE=$(echo "$RESPONSE" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
#   if [ "$HTTP_CODE" != "200" ]; then
#     echo -e "\033[1;31m[ERREUR] Endpoint $endpoint : code HTTP $HTTP_CODE\033[0m"
#   else
#     echo -e "\033[1;32m[SUCCESS] Endpoint $endpoint OK\033[0m"
#   fi
#   echo
#   sleep 0.5
# done

# echo -e "\033[1;33m--- Test /api/user/leaderboard/ ---\033[0m"
# RESPONSE=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET http://localhost:8000/api/user/leaderboard/ -H "Authorization: Bearer $ACCESS")
# echo "$RESPONSE"
# HTTP_CODE=$(echo "$RESPONSE" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
# if [ "$HTTP_CODE" != "200" ]; then
#   echo -e "\033[1;31m[ERREUR] Endpoint leaderboard : code HTTP $HTTP_CODE\033[0m"
# else
# #   echo -e "\033[1;32m[SUCCESS] Endpoint leaderboard OK\033[0m"
# # fi

# # --- EVENEMENTS ---
# # Connexion avec l'utilisateur testuser2
# TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
#   -H "Content-Type: application/json" \
#   -d '{"phone": "+243900000112", "password": "motdepasse100"}')
# ACCESS=$(echo "$TOKENS" | python -c "import sys, json; print(json.load(sys.stdin).get('access', ''))")
# if [ -z "$ACCESS" ]; then
#   echo -e "\033[1;31m[ERREUR] Impossible de récupérer le token pour testuser2. Réponse : $TOKENS\033[0m"
#   exit 1
# fi

# echo -e "\033[1;34m==============================="
# echo "   TESTS EVENEMENTS API   "
# echo -e "===============================\033[0m"

# # Vérification du token
# if [ -z "$ACCESS" ]; then
#   echo -e "\033[1;31m[ERREUR] Le token d'accès (ACCESS) est vide. Connectez-vous et récupérez le token avant de lancer les tests événements.\033[0m"
#   exit 1
# fi

# # 1. Liste des événements
# ENDPOINT="events"
# echo -e "\033[1;33m--- Test /api/$ENDPOINT/ (GET) ---\033[0m"
# RESPONSE=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET http://localhost:8000/api/$ENDPOINT/ -H "Authorization: Bearer $ACCESS")
# echo "$RESPONSE"
# HTTP_CODE=$(echo "$RESPONSE" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
# if [ "$HTTP_CODE" != "200" ]; then
#   echo -e "\033[1;31m[ERREUR] Liste des événements : code HTTP $HTTP_CODE\033[0m"
# else
#   echo -e "\033[1;32m[SUCCESS] Liste des événements OK\033[0m"
# fi
# echo

# # 2. Détail du premier événement (si existant)
# EVENT_ID=$(echo "$RESPONSE" | python -c "import sys, json; data=json.loads(sys.stdin.read().split('[HTTP_CODE:')[0]); print(data[0]['id'] if isinstance(data, list) and data else '')")
# if [ -z "$EVENT_ID" ]; then
#   echo -e "\033[1;33m[AUCUN EVENEMENT DISPONIBLE POUR TEST DETAIL/PARTICIPATION]\033[0m"
# else
#   echo -e "\033[1;33m--- Test /api/events/$EVENT_ID/ (GET) ---\033[0m"
#   RESPONSE_DETAIL=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET http://localhost:8000/api/events/$EVENT_ID/ -H "Authorization: Bearer $ACCESS")
#   echo "$RESPONSE_DETAIL"
#   HTTP_CODE=$(echo "$RESPONSE_DETAIL" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
#   if [ "$HTTP_CODE" != "200" ]; then
#     echo -e "\033[1;31m[ERREUR] Détail événement $EVENT_ID : code HTTP $HTTP_CODE\033[0m"
#   else
#     echo -e "\033[1;32m[SUCCESS] Détail événement $EVENT_ID OK\033[0m"
#   fi
#   echo

#   # 3. Participation à l'événement
#   echo -e "\033[1;33m--- Test /api/events/$EVENT_ID/participate/ (POST) ---\033[0m"
#   RESPONSE_PART=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X POST http://localhost:8000/api/events/$EVENT_ID/participate/ -H "Authorization: Bearer $ACCESS")
#   echo "$RESPONSE_PART"
#   HTTP_CODE=$(echo "$RESPONSE_PART" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
#   if [ "$HTTP_CODE" != "200" ]; then
#     echo -e "\033[1;31m[ERREUR] Participation événement $EVENT_ID : code HTTP $HTTP_CODE\033[0m"
#   else
#     echo -e "\033[1;32m[SUCCESS] Participation événement $EVENT_ID OK\033[0m"
#   fi
#   echo
# fi

# # --- COMMENTAIRES ---
# # Connexion avec l'utilisateur testuser2
# TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
#   -H "Content-Type: application/json" \
#   -d '{"phone": "+243900000112", "password": "motdepasse100"}')
# ACCESS=$(echo "$TOKENS" | python -c "import sys, json; print(json.load(sys.stdin).get('access', ''))")
# if [ -z "$ACCESS" ]; then
#   echo -e "\033[1;31m[ERREUR] Impossible de récupérer le token pour testuser2. Réponse : $TOKENS\033[0m"
#   exit 1
# fi

# echo -e "\033[1;34m==============================="
# echo "   TESTS COMMENTAIRES API   "
# echo -e "===============================\033[0m"

# # Vérification du token
# if [ -z "$ACCESS" ]; then
#   echo -e "\033[1;31m[ERREUR] Le token d'accès (ACCESS) est vide. Connectez-vous et récupérez le token avant de lancer les tests commentaires.\033[0m"
#   exit 1
# fi

# # Récupérer un report existant pour lier le commentaire
# REPORT_ID=$(curl -s -X GET http://localhost:8000/api/reports/ -H "Authorization: Bearer $ACCESS" | python -c "import sys, json; data=json.load(sys.stdin); print(data[0]['id'] if isinstance(data, list) and data else '')")
# if [ -z "$REPORT_ID" ]; then
#   echo -e "\033[1;33m[AUCUN SIGNALEMENT DISPONIBLE POUR TEST COMMENTAIRE]\033[0m"
# else
#   # 1. Création d'un commentaire
#   echo -e "\033[1;33m--- Test POST /api/comments/ ---\033[0m"
#   RESPONSE_COMMENT=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X POST http://localhost:8000/api/comments/ -H "Authorization: Bearer $ACCESS" -H "Content-Type: application/json" -d "{\"report\": $REPORT_ID, \"content\": \"Bravo pour l'initiative !\"}")
#   echo "$RESPONSE_COMMENT"
#   HTTP_CODE=$(echo "$RESPONSE_COMMENT" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
#   if [ "$HTTP_CODE" != "201" ]; then
#     echo -e "\033[1;31m[ERREUR] Création commentaire : code HTTP $HTTP_CODE\033[0m"
#   else
#     echo -e "\033[1;32m[SUCCESS] Création commentaire OK\033[0m"
#   fi
#   echo

#   # Extraire l'ID du commentaire créé
#   COMMENT_ID=$(echo "$RESPONSE_COMMENT" | python -c "import sys, json; import re; s=sys.stdin.read().split('[HTTP_CODE:')[0]; print(json.loads(s).get('id', ''))")

#   # 2. Liste des commentaires pour ce report
#   echo -e "\033[1;33m--- Test GET /api/comments/?report=$REPORT_ID ---\033[0m"
#   RESPONSE_LIST=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET "http://localhost:8000/api/comments/?report=$REPORT_ID" -H "Authorization: Bearer $ACCESS")
#   echo "$RESPONSE_LIST"
#   HTTP_CODE=$(echo "$RESPONSE_LIST" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
#   if [ "$HTTP_CODE" != "200" ]; then
#     echo -e "\033[1;31m[ERREUR] Liste commentaires : code HTTP $HTTP_CODE\033[0m"
#   else
#     echo -e "\033[1;32m[SUCCESS] Liste commentaires OK\033[0m"
#   fi
#   echo

#   # 3. Détail du commentaire créé
#   if [ -n "$COMMENT_ID" ]; then
#     echo -e "\033[1;33m--- Test GET /api/comments/$COMMENT_ID/ ---\033[0m"
#     RESPONSE_DETAIL=$(curl -s -w "\n[HTTP_CODE:%{http_code}]" -X GET http://localhost:8000/api/comments/$COMMENT_ID/ -H "Authorization: Bearer $ACCESS")
#     echo "$RESPONSE_DETAIL"
#     HTTP_CODE=$(echo "$RESPONSE_DETAIL" | grep '\[HTTP_CODE:' | sed 's/.*\[HTTP_CODE:\([0-9]*\)\]/\1/')
#     if [ "$HTTP_CODE" != "200" ]; then
#       echo -e "\033[1;31m[ERREUR] Détail commentaire $COMMENT_ID : code HTTP $HTTP_CODE\033[0m"
#     else
#       echo -e "\033[1;32m[SUCCESS] Détail commentaire $COMMENT_ID OK\033[0m"
#     fi
#     echo
#   fi
# fi
