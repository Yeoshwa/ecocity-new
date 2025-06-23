## 📌 Prompt pour ChatGPT Copilot :

**Projet : Intégration d’un front-end HTML/CSS/JS dans un projet Django**

Je te fournis dans ce dossier (modèle front) la structure et les maquettes HTML/CSS/JS pour mon application.
Ta tâche est de :

1. **Convertir et structurer le front-end** pour qu’il soit conforme aux règles Django :

   * Utiliser les balises `{% static '...' %}` pour les liens vers images, CSS, JS.
   * Organiser les fichiers dans les répertoires `/static/` et `/templates/` de Django.
   * Remplacer les liens internes (boutons, formulaires, menus) par les balises `{% url 'nom_route' %}` correspondant aux vues Django.

2. **Relier les composants de design aux données disponibles via l'API** :

   * Connecter dynamiquement les éléments (cartes, listes, notifications, profils…) aux endpoints existants.
   * Exemple :

     ```javascript
     fetch('/api/reports/')
       .then(response => response.json())
       .then(data => {
         // insérer les données dans les éléments HTML correspondants
       });
     ```
   * Pour les composants dont l'API n'est pas encore disponible, laisser un commentaire clair :

     ```javascript
     // TODO: Attente de l'API pour charger les événements de nettoyage
     ```

3. **Formulaires de connexion et d’inscription** :

   * Utiliser l’image `carte.png` (placée dans `/static/images/`) comme fond de ces pages.
   * Structurer les formulaires pour être compatibles avec Django (`{% csrf_token %}` et action vers `{% url 'login' %}` et `{% url 'register' %}`).

4. **Technos :**

   * HTML5 / CSS3 / JavaScript vanilla (pas de frameworks type React ou Vue)
   * Respect des conventions Django
   * Code clair, commenté et structuré

5. **Finalisation :**

   * Si des éléments de design ou endpoints sont absents, placer un commentaire clair dans le code pour signaler l’attente de décision.
   * Prévoir des includes pour `header.html` et `footer.html` dans Django.

**Dossier de départ :**
Le dossier compressé joint (`model du front.zip`) contient toutes les ressources nécessaires.

---

### Exemple de lien à adapter dans le code :

Avant :

```html
<img src="assets/img/logo.png">
```

Après :

```html
<img src="{% static 'img/logo.png' %}">
```

Idem pour CSS et JS.

---

### Exemple d’appel API dans JS :

```javascript
fetch('/api/user/profile/')
  .then(res => res.json())
  .then(data => {
    document.getElementById('username').textContent = data.username;
  })
  .catch(err => console.error(err));
```

---

👉 Remarque : s’assurer que toutes les routes Django soient bien référencées via `{% url 'nom_route' %}` et que les fichiers statiques soient accessibles via `{% load static %}`.
