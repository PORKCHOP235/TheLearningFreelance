const filters = document.querySelector('.resource-filters');
const query = document.querySelector('#skills-query');
const category = document.querySelector('#skills-category');
const status = document.querySelector('#skills-status');
const cards = [...document.querySelectorAll('[data-category]')];

function filterSkills() {
  const search = query.value.trim().toLowerCase();
  let count = 0;
  for (const card of cards) {
    const matchesCategory = !category.value || card.dataset.category === category.value;
    const matchesSearch = card.textContent.toLowerCase().includes(search);
    card.hidden = !matchesCategory || !matchesSearch;
    if (!card.hidden) count++;
  }
  status.textContent = count ? `${count} ${count === 1 ? 'skill' : 'skills'}` : 'No skills match. Try another search or category.';
}

query.addEventListener('input', filterSkills);
category.addEventListener('change', filterSkills);
filters.hidden = false;
filterSkills();
