const tools = document.querySelector('.library-tools');
const query = document.querySelector('#skills-query');
const chips = [...document.querySelectorAll('.library-chips button')];
const status = document.querySelector('#skills-status');
const groups = [...document.querySelectorAll('.library-group')];
const empty = document.createElement('p');
empty.className = 'library-empty';
empty.textContent = 'No skills match. Try another search or topic.';
empty.hidden = true;
groups.at(-1).after(empty);
let activeGroup = '';

function filterSkills() {
  const search = query.value.trim().toLowerCase();
  let total = 0;
  for (const group of groups) {
    let shown = 0;
    const inGroup = !activeGroup || group.dataset.group === activeGroup;
    for (const card of group.querySelectorAll('article')) {
      card.hidden = !inGroup || !card.textContent.toLowerCase().includes(search);
      if (!card.hidden) shown++;
    }
    group.hidden = shown === 0;
    group.querySelector('.library-count').textContent = `${shown} ${shown === 1 ? 'skill' : 'skills'}`;
    total += shown;
  }
  empty.hidden = total > 0;
  status.textContent = total ? `Showing ${total} ${total === 1 ? 'skill' : 'skills'}` : '';
}

chips.forEach(chip => chip.addEventListener('click', () => {
  activeGroup = chip.dataset.group;
  chips.forEach(c => c.setAttribute('aria-pressed', String(c === chip)));
  filterSkills();
}));
query.addEventListener('input', filterSkills);
tools.hidden = false;
filterSkills();
