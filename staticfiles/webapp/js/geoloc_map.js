// Script JS pour la géolocalisation et l'affichage dynamique de la carte avec les pins depuis l'API
// Ce script doit être inclus dans la page index.html

document.addEventListener('DOMContentLoaded', function() {
    // Mapping des statuts vers les images de pins (centralisé côté front)
    const STATUS_ICON_MAP = {
        'signale': '/static/webapp/images/pin-red.png',
        'en_cours': '/static/webapp/images/pin-orange.png',
        'nettoye': '/static/webapp/images/pin-green.png',
    };
    const DEFAULT_ICON_URL = '/static/webapp/images/pin-red.png';

    // Détecter automatiquement l'URL de base de l'API selon l'environnement
    var API_BASE_URL = window.API_BASE_URL || (window.location.origin.includes('localhost') ? 'http://localhost:8000' : window.location.origin);

    // Charger les signalements depuis l'API puis afficher la carte et les marqueurs
    fetch(API_BASE_URL + '/api/map/pins/')
        .then(response => response.json())
        .then(data => {
            var pins = Array.isArray(data) ? data : (data.pins || []);
            console.log('Pins récupérés depuis l’API :', pins);
            // Initialiser la carte seulement après avoir les pins
            var mapDiv = document.getElementById('mapid');
            if (!mapDiv) return;
            var defaultLat = -4.325;
            var defaultLon = 15.322;
            var map = L.map('mapid').setView([defaultLat, defaultLon], 12);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
            pins.forEach(function(report) {
                console.log('Traitement du report :', report);
                let iconUrl = report.icon_url || '/static/webapp/images/pin-red.png';
                var popupHtml = `<b>${report.categorie}</b><br>${report.description}<br><b>Statut:</b> ${report.statut}`;
                popupHtml += `<br><a href='/webapp/report/${report.id}/'>Voir le détail & avant/après</a>`;
                try {
                    L.marker([report.latitude, report.longitude], {
                        icon: L.icon({iconUrl: iconUrl, iconSize: [34, 34], iconAnchor: [17, 34], popupAnchor: [0, -30]})
                    }).addTo(map).bindPopup(popupHtml);
                } catch (e) {
                    console.error('Erreur lors de l’ajout du marqueur :', e, report);
                }
            });

            // Vérifier si la div de la carte existe
            // var mapDiv = document.getElementById('mapid');
            // if (!mapDiv) return;

            // Centrer sur Kinshasa par défaut
            // var defaultLat = -4.325;
            // var defaultLon = 15.322;
            // var map = L.map('mapid').setView([defaultLat, defaultLon], 12);

            // Ajouter le fond de carte OpenStreetMap
            // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            //     attribution: '&copy; OpenStreetMap contributors'
            // }).addTo(map);

            // Demander la géolocalisation
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var userLat = position.coords.latitude;
                    var userLon = position.coords.longitude;
                    map.setView([userLat, userLon], 14);
                    // Marqueur utilisateur
                    L.marker([userLat, userLon], {icon: L.icon({iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png', iconSize: [32,32]})}).addTo(map).bindPopup('Vous êtes ici');
                }, function(error) {
                    alert('Géolocalisation refusée ou indisponible. La carte sera centrée sur Kinshasa.');
                });
            }

            // Afficher un pop-up non bloquant pour demander la géolocalisation si elle n'est pas activée
            function showGeolocPopup() {
                if (document.getElementById('geoloc-popup')) return;
                var popup = document.createElement('div');
                popup.id = 'geoloc-popup';
                popup.style.position = 'fixed';
                popup.style.bottom = '30px';
                popup.style.right = '30px';
                popup.style.background = '#fff';
                popup.style.border = '1px solid #ccc';
                popup.style.borderRadius = '10px';
                popup.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
                popup.style.padding = '18px 24px';
                popup.style.zIndex = '2000';
                popup.style.display = 'flex';
                popup.style.flexDirection = 'column';
                popup.style.alignItems = 'center';
                popup.innerHTML = '<span style="font-size:18px;">📍</span><div style="margin:8px 0 12px 0;">Activez la géolocalisation pour centrer la carte sur votre position.</div><button id="btn-geoloc-popup" style="background:#2e7dff;color:#fff;border:none;padding:8px 18px;border-radius:6px;cursor:pointer;font-size:15px;">Activer la géolocalisation</button><button id="btn-close-geoloc-popup" style="margin-top:8px;background:none;border:none;color:#888;cursor:pointer;font-size:13px;">Fermer</button>';
                document.body.appendChild(popup);
                document.getElementById('btn-geoloc-popup').onclick = function() {
                    enableGeoloc();
                    popup.remove();
                };
                document.getElementById('btn-close-geoloc-popup').onclick = function() {
                    popup.remove();
                };
            }

            // Appeler le pop-up au chargement si la géoloc n'est pas déjà faite
            setTimeout(showGeolocPopup, 1200);

            // Supprimer l'overlay bloquant
            var overlay = document.getElementById('geoloc-overlay');
            if (overlay) overlay.remove();

            var userMarker = null;
            function enableGeoloc() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function(position) {
                        var userLat = position.coords.latitude;
                        var userLon = position.coords.longitude;
                        map.setView([userLat, userLon], 14);
                        if (userMarker) map.removeLayer(userMarker);
                        userMarker = L.marker([userLat, userLon], {
                            icon: L.icon({
                                iconUrl: 'https://cdn-icons-png.flaticon.com/512/64/64113.png',
                                iconSize: [32,32]
                            })
                        }).addTo(map).bindPopup('Vous êtes ici');
                    }, function(error) {
                        var msg = 'Géolocalisation refusée ou indisponible.';
                        if (error.code === 1) msg = 'Permission de géolocalisation refusée.';
                        if (error.code === 2) msg = 'Position non disponible.';
                        if (error.code === 3) msg = 'La demande de géolocalisation a expiré.';
                        alert(msg);
                    });
                }
            }

            // Supprimer l'appel automatique à enableGeoloc au chargement
            // enableGeoloc();

            // Ajouter un bouton flottant pour recentrer sur la position utilisateur
            var recenterBtn = L.control({position: 'topright'});
            recenterBtn.onAdd = function(map) {
                var div = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
                div.innerHTML = '<button id="btn-recenter" title="Recentrer sur moi" style="background:#fff;border:none;padding:10px 14px 10px 14px;cursor:pointer;font-size:20px;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.2);">📍</button>';
                div.style.background = 'none';
                div.style.boxShadow = 'none';
                div.style.margin = '10px';
                return div;
            };
            recenterBtn.addTo(map);
            document.getElementById('btn-recenter').onclick = enableGeoloc;

            // Supprimer la suggestion automatique après navigation
        });
});
