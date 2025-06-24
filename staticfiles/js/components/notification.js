// Notification component: show notification of type
function showNotification({message, type = 'info', icon = ''}) {
  const notif = document.createElement('div');
  notif.className = `notification notification-${type}`;
  if (icon) {
    const iconSpan = document.createElement('span');
    iconSpan.className = 'notification-icon';
    iconSpan.textContent = icon;
    notif.appendChild(iconSpan);
  }
  const msg = document.createElement('span');
  msg.textContent = message;
  notif.appendChild(msg);
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3500);
}
// Usage example:
// showNotification({message:'Succès !',type:'success',icon:'✔️'});
