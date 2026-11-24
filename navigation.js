document.querySelectorAll('.mobile-menu-panel a').forEach(link => {
  link.addEventListener('click', () => {
    link.closest('details').open = false;
  });
});
