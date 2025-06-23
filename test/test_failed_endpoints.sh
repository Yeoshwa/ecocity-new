#!/bin/bash

# --- Auth: Register & Login ---
# Register a new user
echo "[REGISTER]"
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser-fail", "phone": "+243900000200", "password": "motdepasse99"}'
echo -e "\n---\n"

# Login with phone and get tokens
echo "[LOGIN]"
TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+243900000200", "password": "motdepasse99"}')
ACCESS=$(echo $TOKENS | python -c "import sys, json; print(json.load(sys.stdin)['access'])")
echo "Access token: $ACCESS"
echo -e "\n---\n"

# --- TESTS QUI N'ONT PAS MARCHÉ ---

# Test création report (avec champs corrects)
echo "[REPORT CREATE]"
REPORT_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST http://localhost:8000/api/reports/ \
  -H "Authorization: Bearer $ACCESS" \
  -H "Content-Type: application/json" \
  -d '{"latitude": -4.3, "longitude": 15.3, "description": "Test report fail", "categorie": "pollution", "statut": "nouveau", "gravite": 1}')
REPORT_BODY=$(echo $REPORT_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
REPORT_STATUS=$(echo $REPORT_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
echo "Status: $REPORT_STATUS"
echo "Response: $REPORT_BODY"
echo -e "\n---\n"

# Récupérer l'ID du report créé (si succès)
REPORT_ID=$(echo $REPORT_BODY | python -c "import sys, json; d=json.load(sys.stdin); print(d.get('id', 1)) if isinstance(d, dict) else print(1)")

# Test création gallery (avec vrai fichier image)
echo "[GALLERY CREATE]"
if [ -f img2.jpg ]; then
  GALLERY_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X POST http://localhost:8000/api/gallery/ \
    -H "Authorization: Bearer $ACCESS" \
    -F "report=$REPORT_ID" \
    -F "before_image=@img2.jpg" \
    -F "after_image=@img2.jpg")
  GALLERY_BODY=$(echo $GALLERY_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
  GALLERY_STATUS=$(echo $GALLERY_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
  echo "Status: $GALLERY_STATUS"
  echo "Response: $GALLERY_BODY"
else
  echo "img2.jpg introuvable, upload gallery ignoré."
fi
echo -e "\n---\n"

# Test accès apilogs (token user normal)
echo "[API LOGS - USER]"
API_USER_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET http://localhost:8000/api/apilogs/ \
  -H "Authorization: Bearer $ACCESS")
API_USER_BODY=$(echo $API_USER_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
API_USER_STATUS=$(echo $API_USER_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
echo "Status: $API_USER_STATUS"
echo "Response: $API_USER_BODY"
echo -e "\n---\n"

# Test accès apilogs (token admin)
echo "[API LOGS - ADMIN]"
ADMIN_TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+243991746157", "password": "12345678"}')
ADMIN_ACCESS=$(echo $ADMIN_TOKENS | python -c "import sys, json; print(json.load(sys.stdin)['access'])")
API_ADMIN_RESPONSE=$(curl -s -w "HTTPSTATUS:%{http_code}" -X GET http://localhost:8000/api/apilogs/ \
  -H "Authorization: Bearer $ADMIN_ACCESS")
API_ADMIN_BODY=$(echo $API_ADMIN_RESPONSE | sed -e 's/HTTPSTATUS:.*//g')
API_ADMIN_STATUS=$(echo $API_ADMIN_RESPONSE | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
echo "Status: $API_ADMIN_STATUS"
echo "Response: $API_ADMIN_BODY"
echo -e "\n---\n"

echo "Tests terminés. Vérifiez les codes retour et les messages d'erreur pour chaque requête."
