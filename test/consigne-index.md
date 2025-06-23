on va mettre une carte intercative sur cette page. Elle va se  sur ces trois bloc : 
```django
{% extends 'webapp/base.html' %}

{% block title %}Carte des Signalements{% endblock %}

{% block header %}
<nav style="background:#e3e3e3;padding:10px 0 10px 20px;">
    <a href="/" style="margin-right:20px;">Accueil</a>
    <a href="/webapp/signaler/" style="margin-right:20px;">Signaler</a>
    <a href="/webapp/classement/" style="margin-right:20px;">Classement</a>
    <a href="/webapp/evenements/">Événements</a>
</nav>
{% endblock %}

{% block content %}
<h2>Carte Interactive des Signalements</h2>
<div>
    {{ map|safe }}
</div>
{% endblock %}

```

```python
    def carte(request):
    reports = Report.objects.all()
    
    if reports:
        folium_map = generate_map(reports)
        map_html = folium_map._repr_html_()
    else:
        map_html = "<p>Aucun signalement disponible.</p>"

    return render(request, 'webapp/carte.html', {'map': map_html})
```
```python 
     def generate_map(reports):
    # Permet de prendre en entrée une liste d'objets Report ou de dictionnaires
    if not reports:
        return None

    # Supporte à la fois objets et dicts
    def get_attr(report, attr):
        if isinstance(report, dict):
            return report.get(attr)
        return getattr(report, attr, None)

    # Centrer la carte sur Kinshasa par défaut
    default_lat, default_lon = -4.325, 15.322
    if reports:
        avg_lat = sum(get_attr(r, 'latitude') for r in reports) / len(reports)
        avg_lon = sum(get_attr(r, 'longitude') for r in reports) / len(reports)
    else:
        avg_lat, avg_lon = default_lat, default_lon
    m = folium.Map(location=[avg_lat, avg_lon], zoom_start=12)

    # Create a marker cluster
    marker_cluster = MarkerCluster().add_to(m)

    # Add markers to the map
    for report in reports:
        lat = get_attr(report, 'latitude')
        lon = get_attr(report, 'longitude')
        desc = get_attr(report, 'description')
        statut = get_attr(report, 'statut')
        photo = get_attr(report, 'photo')
        popup_html = f"<b>{desc}</b> - {statut}"
        if photo:
            # Correction du chemin de l'image pour MEDIA_URL
            if hasattr(photo, 'url'):
                photo_url = photo.url
            else:
                photo_url = f"/media/{photo}"
            popup_html += f'<br><img src="{photo_url}" width="150">'
        folium.Marker(
            location=[lat, lon],
            popup=folium.Popup(popup_html, max_width=250),
            icon=folium.Icon(color='blue' if statut == 'signale' else 'red')
        ).add_to(marker_cluster)

    return m  

```

### 1. Elle va utiliser l'api pour prendre tous les pins :
 marqueur et les ajouter sur la carte.
 
### 2. Elle va faire des pop up qui ajoutent des details sur le signalement et chaque pop peur redirigier sur une page qui detail le signalement et montre l'avant apres.
 -  Tu va creer cette page dans le webapp 
### 3. Et aussi tu va faire un scrip js  a charger sur la page index(qui affiche une map )que tu mettra dans les static de webapp pour ouvrir un pop up qui oblige d'utiliser la geolocalisation pour l'envoyer au map pour centrer la carte dans la ville de geolocalisation.


___

