// JS pour login/register AJAX sans rechargement de page
function handleAuthForm(formId, url, errorDivId, onSuccess) {
  const form = document.getElementById(formId);
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const data = new FormData(form);
    fetch(url, {
      method: 'POST',
      headers: { 'X-Requested-With': 'XMLHttpRequest' },
      body: data
    })
    .then(res => res.json())
    .then(json => {
      if (json.success) {
        onSuccess(json);
      } else {
        document.getElementById(errorDivId).textContent = json.error || 'Erreur.';
      }
    })
    .catch(() => {
      document.getElementById(errorDivId).textContent = 'Erreur réseau.';
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  handleAuthForm('loginForm', '/ajax/login/', 'loginError', function(json) {
    window.location.href = json.redirect;
  });
  handleAuthForm('registerForm', '/ajax/register/', 'registerError', function(json) {
    window.location.href = json.redirect;
  });
});
