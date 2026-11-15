const viewer = document.querySelector('.screenshot-viewer');
const preview = viewer.querySelector('img');

if (typeof viewer.showModal === 'function') {
  document.querySelectorAll('.evidence-grid a').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      preview.alt = link.querySelector('img').alt;
      preview.src = link.href;
      viewer.showModal();
    });
  });
}

viewer.addEventListener('click', (event) => {
  if (event.target === viewer) viewer.close();
});
