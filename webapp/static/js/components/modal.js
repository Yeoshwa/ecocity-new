// Modal component: open/close modal with content
function openModal({content, onClose}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  const modal = document.createElement('div');
  modal.className = 'modal';
  if (typeof content === 'string') {
    modal.innerHTML = content;
  } else if (content instanceof Node) {
    modal.appendChild(content);
  }
  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.onclick = () => {
    overlay.remove();
    if (onClose) onClose();
  };
  modal.appendChild(closeBtn);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  overlay.onclick = e => { if (e.target === overlay) closeBtn.onclick(); };
}
// Usage example:
// openModal({content:'<b>Contenu du modal</b>'});
