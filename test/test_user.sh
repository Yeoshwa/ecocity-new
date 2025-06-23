#!/bin/bash

# Register a new user
curl -X POST http://localhost:8000/api/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser-1", "phone": "+243900000100", "password": "motdepasse99"}'
echo -e "\n---\n"

# Login with phone and get tokens
TOKENS=$(curl -s -X POST http://localhost:8000/api/token/phone/ \
  -H "Content-Type: application/json" \
  -d '{"phone": "+243900000100", "password": "motdepasse99"}')
ACCESS=$(echo $TOKENS | python -c "import sys, json; print(json.load(sys.stdin)['access'])")
REFRESH=$(echo $TOKENS | python -c "import sys, json; print(json.load(sys.stdin)['refresh'])")
echo "Access token: $ACCESS"
echo "Refresh token: $REFRESH"
echo -e "\n---\n"

# Test endpoints that require authentication
# Get user profiles (correct plural endpoint)
curl -X GET http://localhost:8000/api/userprofiles/ \
  -H "Authorization: Bearer $ACCESS"
echo -e "\n---\n"

# Test map pins (public)
curl -X GET http://localhost:8000/api/map/pins/
echo -e "\n---\n"

# Test gamification points (public)
curl -X GET http://localhost:8000/api/gamification/points/
echo -e "\n---\n"

# Test leaderboard (public)
curl -X GET http://localhost:8000/api/user/leaderboard/
echo -e "\n---\n"

# Test gallery (public)
curl -X GET http://localhost:8000/api/gallery/
echo -e "\n---\n"

# Test avatar upload (requires authentication, example only)
# curl -X POST http://localhost:8000/api/profile/avatar/ \
#   -H "Authorization: Bearer $ACCESS" \
#   -F "avatar=@/path/to/avatar.jpg"
# echo -e "\n---\n"

# Add more endpoint tests as needed