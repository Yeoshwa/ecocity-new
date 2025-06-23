#!/bin/bash
# Script pour ajouter plusieurs signalements de test avec différents statuts

API_URL="http://localhost:8000/api/reports/"

# Tableau de statuts à tester
STATUTS=("signale" "en_cours" "nettoye")

for i in {1..10}
do
  for statut in "${STATUTS[@]}"
  do
    lat=$(awk "BEGIN {print -4.32 + 0.01 * $i}")
    lon=$(awk "BEGIN {print 15.31 + 0.01 * $i}")
    desc="Test $statut $i"
    cat=$(if [ $((i%2)) -eq 0 ]; then echo "poubelle"; else echo "decharge"; fi)
    curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{\"latitude\": $lat, \"longitude\": $lon, \"description\": \"$desc\", \"categorie\": \"$cat\", \"statut\": \"$statut\"}"
    echo "[+] Signalement $desc ($statut) ajouté."
  done
done
