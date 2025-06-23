#!/bin/bash

# Configuration
API_BASE_URL="http://localhost:8000"  # Remplacez par l'URL de votre API
NUM_USERS=20
ACTIONS_PER_USER=10

# Fonction pour générer un nom d'utilisateur aléatoire
generate_username() {
    echo "user_$(openssl rand -hex 3)"
}

# Fonction pour générer un numéro de téléphone aléatoire
generate_phone() {
    echo "+2439$(openssl rand -hex 8 | tr -cd '0-9' | head -c 8)"
}

# Fonction pour générer un mot de passe aléatoire
generate_password() {
    openssl rand -base64 6 | tr -d '/+=' | head -c 8
}

# Fonction pour générer une latitude/longitude aléatoire autour de Kinshasa
generate_coords() {
    lat=$(awk -v min=-4.5 -v max=-4.2 'BEGIN{srand(); print min+rand()*(max-min)}')
    lon=$(awk -v min=15.2 -v max=15.4 'BEGIN{srand(); print min+rand()*(max-min)}')
    echo "$lat,$lon"
}

# Fonction pour créer un utilisateur et obtenir son token
create_user() {
    local username=$1
    local phone=$2
    local password=$3

    local response=$(curl -s -X POST "$API_BASE_URL/api/auth/register/" \
        -H "Content-Type: application/json" \
        -d "{\"username\": \"$username\", \"phone\": \"$phone\", \"password\": \"$password\"}")

    # Extraction du token et de l'id utilisateur
    local access_token=$(echo "$response" | jq -r '.token.access // empty')
    local user_id=$(echo "$response" | jq -r '.user.id // empty')

    if [ -n "$access_token" ] && [ -n "$user_id" ]; then
        echo "$access_token,$user_id"
    else
        echo "[ERREUR][register] $response" >&2
        echo ","
    fi
}

# Fonction pour se connecter et obtenir un token
login_user() {
    local phone=$1
    local password=$2

    local response=$(curl -s -X POST "$API_BASE_URL/api/token/phone/" \
        -H "Content-Type: application/json" \
        -d "{\"phone\": \"$phone\", \"password\": \"$password\"}")
if echo "$response" | jq -e '.token.access' >/dev/null 2>&1; then
    local access_token=$(echo "$response" | jq -r '.token.access')
    local user_id=$(echo "$response" | jq -r '.user.id')
    echo "$access_token,$user_id"
else
    echo "[ERREUR][register] $response" >&2
    echo ","
fi
    if echo "$response" | jq -e '.access' >/dev/null 2>&1; then
        local access_token=$(echo "$response" | jq -r '.access')
        echo "$access_token"
    else
        echo "[ERREUR][login] $response" >&2
        echo ""
    fi
}

# Fonction pour créer un signalement
create_report() {
    local token=$1
    local user_id=$2

    local coords=$(generate_coords)
    local lat=$(echo "$coords" | cut -d',' -f1)
    local lon=$(echo "$coords" | cut -d',' -f2)
    local categories=("poubelle" "dangereux" "encombrant" "autre")
    local category=${categories[$RANDOM % ${#categories[@]}]}
    local descriptions=(
        "Déchets accumulés dans la rue"
        "Objet dangereux abandonné"
        "Encombrants non collectés"
        "Dépôt sauvage de déchets"
    )
    local description=${descriptions[$RANDOM % ${#descriptions[@]}]}

    local response=$(curl -s -X POST "$API_BASE_URL/api/reports/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{
            \"latitude\": $lat,
            \"longitude\": $lon,
            \"description\": \"$description\",
            \"categorie\": \"$category\",
            \"photo\": \"$(openssl rand -base64 100)\"
        }")

    local report_id=$(echo "$response" | jq -r '.id')

    echo "$report_id"
}

# Fonction pour commenter un signalement
comment_report() {
    local token=$1
    local report_id=$2

    local comments=(
        "C'est un problème récurrent ici"
        "Merci de signaler ce problème"
        "Je passe souvent par là, c'est vrai"
        "Il faudrait une solution durable"
    )
    local comment=${comments[$RANDOM % ${#comments[@]}]}

    curl -s -X POST "$API_BASE_URL/api/comments/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{
            \"report\": $report_id,
            \"content\": \"$comment\"
        }" > /dev/null
}

# Fonction pour participer à un événement
participate_event() {
    local token=$1
    local event_id=$2

    curl -s -X POST "$API_BASE_URL/api/events/$event_id/participate/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" > /dev/null
}

# Fonction pour confirmer un signalement
confirm_report() {
    local token=$1
    local report_id=$2

    curl -s -X POST "$API_BASE_URL/api/reports/$report_id/confirm/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" > /dev/null
}

# Fonction pour marquer un signalement comme résolu
resolve_report() {
    local token=$1
    local report_id=$2

    curl -s -X POST "$API_BASE_URL/api/reports/$report_id/resolved/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" > /dev/null
}

# Fonction pour mettre à jour le profil
update_profile() {
    local token=$1
    local user_id=$2

    local new_phone=$(generate_phone)
    
    curl -s -X PATCH "$API_BASE_URL/api/userprofiles/$user_id/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" \
        -d "{\"phone\": \"$new_phone\"}" > /dev/null
}

# Fonction pour obtenir les points de gamification
get_points() {
    local token=$1

    curl -s -X GET "$API_BASE_URL/api/gamification/points/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json"
}

# Fonction pour obtenir le classement
get_leaderboard() {
    local token=$1

    curl -s -X GET "$API_BASE_URL/api/user/leaderboard/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json"
}

# Fonction pour uploader un avatar
upload_avatar() {
    local token=$1
    echo "[Avatar] Upload d'un avatar..."
    curl -s -X POST "$API_BASE_URL/api/profile/avatar/" \
        -H "Authorization: Bearer $token" \
        -F "avatar=@/bin/bash" > /dev/null || echo "(simulé, fichier non trouvé)"
}

# Fonction pour ajouter une galerie avant/après
add_gallery() {
    local token=$1
    local report_id=$2
    echo "[Galerie] Ajout d'une galerie avant/après pour report $report_id..."
    curl -s -X POST "$API_BASE_URL/api/gallery/" \
        -H "Authorization: Bearer $token" \
        -F "report=$report_id" \
        -F "before_image=@/bin/bash" \
        -F "after_image=@/bin/bash" > /dev/null || echo "(simulé, fichier non trouvé)"
}

# Fonction pour tester les endpoints gamification
get_badges() {
    local token=$1
    echo "[Gamification] Récupération des badges..."
    curl -s -X GET "$API_BASE_URL/api/gamification/badges/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json"
}

get_progress() {
    local token=$1
    echo "[Gamification] Progression vers le prochain badge..."
    curl -s -X GET "$API_BASE_URL/api/gamification/progress/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json"
}

# Fonction pour tester la récupération des logs API (admin)
get_logs() {
    local token=$1
    echo "[Admin] Récupération des logs API..."
    curl -s -X GET "$API_BASE_URL/api/apilogs/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" | jq
}

# Fonction pour tester la documentation
check_swagger() {
    echo "[Doc] Vérification de l'accès à /api/swagger/ ..."
    curl -s -o /dev/null -w "%{http_code}\n" "$API_BASE_URL/api/swagger/"
}

# Fonction principale pour simuler les actions d'un utilisateur
simulate_user_actions() {
    local username=$1
    local phone=$2
    local password=$3
    local user_num=$4

    echo "[Début] Simulation des actions pour $username ($phone)"
    echo "Création de l'utilisateur $user_num: $username"
    local user_data=$(create_user "$username" "$phone" "$password")
    local token=$(echo "$user_data" | cut -d',' -f1)
    local user_id=$(echo "$user_data" | cut -d',' -f2)

    # Vérification du token et du user_id
    if [ -z "$token" ] || [ "$token" = "null" ] || [ -z "$user_id" ] || [ "$user_id" = "null" ]; then
        echo "[ERREUR] Échec de l'inscription ou récupération du token pour $username ($phone). Réponse brute : $user_data"
        return 1
    fi

    # Créer quelques événements pour le premier utilisateur
    if [ "$user_num" -eq 1 ]; then
        echo "Création d'événements par l'utilisateur 1..."
        for i in {1..3}; do
            local event_title="Événement de nettoyage $i"
            local event_date=$(date -d "+$((i+1)) days" +"%Y-%m-%dT09:00:00Z")
            local coords=$(generate_coords)
            local lat=$(echo "$coords" | cut -d',' -f1)
            local lon=$(echo "$coords" | cut -d',' -f2)
            
            curl -s -X POST "$API_BASE_URL/api/events/" \
                -H "Authorization: Bearer $token" \
                -H "Content-Type: application/json" \
                -d "{\n                    \"titre\": \"$event_title\",\n                    \"description\": \"Venez nombreux nettoyer le quartier!\",\n                    \"date\": \"$event_date\",\n                    \"lieu\": \"$lat,$lon\"\n                }" > /dev/null
        done
    fi

    # Récupérer la liste des événements
    local events=$(curl -s -X GET "$API_BASE_URL/api/events/" \
        -H "Authorization: Bearer $token" \
        -H "Content-Type: application/json" | jq -r '.[].id')

    # Simuler des actions aléatoires
    for ((action=1; action<=$ACTIONS_PER_USER; action++)); do
        local random_action=$((RANDOM % 10))
        case $random_action in
            0)
                echo "Action $action: Création d'un signalement"
                create_report "$token" "$user_id"
                ;;
            1)
                if [ -n "$events" ]; then
                    local event_id=$(echo "$events" | shuf -n 1)
                    echo "Action $action: Participation à l'événement $event_id"
                    participate_event "$token" "$event_id"
                fi
                ;;
            2)
                # Seulement pour les utilisateurs après le premier (pour commenter ses signalements)
                if [ "$user_num" -gt 1 ]; then
                    local reports=$(curl -s -X GET "$API_BASE_URL/api/reports/" \
                        -H "Authorization: Bearer $(login_user "+243991746157" "12345678")" \
                        -H "Content-Type: application/json" | jq -r '.[].id')
                    if [ -n "$reports" ]; then
                        local report_id=$(echo "$reports" | shuf -n 1)
                        echo "Action $action: Commentaire sur le signalement $report_id"
                        comment_report "$token" "$report_id"
                    fi
                fi
                ;;
            3)
                # Seulement pour les utilisateurs après le premier
                if [ "$user_num" -gt 1 ]; then
                    local reports=$(curl -s -X GET "$API_BASE_URL/api/reports/" \
                        -H "Authorization: Bearer $(login_user "+243991746157" "12345678")" \
                        -H "Content-Type: application/json" | jq -r '.[].id')
                    if [ -n "$reports" ]; then
                        local report_id=$(echo "$reports" | shuf -n 1)
                        echo "Action $action: Confirmation du signalement $report_id"
                        confirm_report "$token" "$report_id"
                    fi
                fi
                ;;
            4)
                # Seulement pour le premier utilisateur (pour résoudre ses propres signalements)
                if [ "$user_num" -eq 1 ]; then
                    local reports=$(curl -s -X GET "$API_BASE_URL/api/reports/" \
                        -H "Authorization: Bearer $token" \
                        -H "Content-Type: application/json" | jq -r '.[].id')
                    if [ -n "$reports" ]; then
                        local report_id=$(echo "$reports" | shuf -n 1)
                        echo "Action $action: Résolution du signalement $report_id"
                        resolve_report "$token" "$report_id"
                    fi
                fi
                ;;
            5)
                echo "Action $action: Mise à jour du profil"
                update_profile "$token" "$user_id"
                ;;
            6)
                echo "Action $action: Consultation des points"
                get_points "$token"
                ;;
            7)
                echo "Action $action: Upload d'un avatar"
                upload_avatar "$token"
                ;;
            8)
                echo "Action $action: Ajout d'une galerie avant/après"
                add_gallery "$token" "$user_id"
                ;;
            9)
                echo "Action $action: Récupération des badges et progression"
                get_badges "$token"
                get_progress "$token"
                ;;
        esac
        sleep 1
    done

    # Afficher le classement à la fin
    echo "Classement final pour $username:"
    get_leaderboard "$token" | jq
}

# Créer un utilisateur admin pour référence
echo "Création de l'utilisateur admin de référence..."
admin_username="admin_user"
admin_phone="+243991746157"
admin_password="12345678"
create_user "$admin_username" "$admin_phone" "$admin_password" > /dev/null

# Simuler les utilisateurs
for ((i=1; i<=$NUM_USERS; i++)); do
    username=$(generate_username)
    phone=$(generate_phone)
    password=$(generate_password)
    
    simulate_user_actions "$username" "$phone" "$password" "$i" &
    
    # Limiter le nombre de processus parallèles pour ne pas surcharger le système
    if (( i % 5 == 0 )); then
        wait
    fi
done

wait
echo "Simulation terminée pour tous les utilisateurs!"

# Après la simulation des utilisateurs, tester les logs et la doc
admin_token=$(login_user "$admin_phone" "$admin_password")
get_logs "$admin_token"
check_swagger