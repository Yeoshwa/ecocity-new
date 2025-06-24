// Card component: render a card with dynamic content
function createCard({title, meta, content, imageUrl}) {
  const card = document.createElement('div');
  card.className = 'card';
  if (imageUrl) {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = title || '';
    img.style.width = '100%';
    img.style.borderRadius = '8px';
    img.style.marginBottom = '1rem';
    card.appendChild(img);
  }
  if (title) {
    const h3 = document.createElement('div');
    h3.className = 'card-title';
    h3.textContent = title;
    card.appendChild(h3);
  }
  if (meta) {
    const metaDiv = document.createElement('div');
    metaDiv.className = 'card-meta';
    metaDiv.textContent = meta;
    card.appendChild(metaDiv);
  }
  if (content) {
    const contentDiv = document.createElement('div');
    contentDiv.className = 'card-content';
    contentDiv.textContent = content;
    card.appendChild(contentDiv);
  }
  return card;
}
// Usage example:
// document.getElementById('container').appendChild(createCard({title:'Titre',meta:'Meta',content:'Contenu'}));
