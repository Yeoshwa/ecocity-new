// JS pour la progressbar EcoCity
// (Permet d’animer la barre dynamiquement)
function setEcoProgressBar(selector, percent) {
  const bar = document.querySelector(selector + ' .eco-progressbar__bar');
  if(bar) bar.style.width = percent + '%';
}
// Exemple d’utilisation : setEcoProgressBar('#progress', 60);
