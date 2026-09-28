const contributorsPerRow = 4;

const gameCatalog = {
  "depths-of-death": {
    name: "Depths of Death",
    url: "depths-of-death.html"
  }
};
/*
const contributorData = [
  {
    id: "willy",
    name: "Guifré",
    role: "President & Developer",
    active: true,
    startYear: 2026,
    endYear: null,
    games: ["depths-of-death"],
    photo: "fireus.png",
    bio: "He built this team, develops the games, and makes all this work. He is the one who makes the project run and keeps it alive.",
    extra: "Nothing would have been possible without him. He is the absolute master."
  },
  {
    id: "pizzas",
    name: "Pizarro",
    role: "Treasurer & Developer",
    active: true,
    startYear: 2026,
    endYear: null,
    games: ["depths-of-death"],
    photo: "fireus.png",
    bio: "He is great coding and has a lot of experience in videogames.",
    extra: "He just lacks a bit of commitment and engagement. What a pity to waste such skills."
  },
  {
    id: "sapo",
    name: "Sergio",
    role: "Tester",
    active: true,
    startYear: 2026,
    endYear: null,
    games: ["depths-of-death"],
    photo: "fireus.png",
    bio: "The best guy breaking videogames I've ever seen. He is the one who finds all the bugs and glitches in the games.",
    extra: "If you want your code to explode call him, he'll do it without any problem."
  },
  {
    id: "laia",
    name: "Laia",
    role: "Marketing Organizer",
    active: true,
    startYear: 2026,
    endYear: null,
    photo: "fireus.png",
    bio: "Handles marketing, social media, and community engagement to ensure the project reaches its audience effectively.",
    extra: "We have to thank her for organizing such a Discord with so many things that will never be used."
  },
  {
    id: "arnau",
    name: "Arnau",
    role: "Artist & Musician",
    active: true,
    startYear: 2026,
    endYear: null,
    games: ["depths-of-death"],
    photo: "fireus.png",
    bio: "He gives the game the last touch, his music captures you into our universe. He is the one who makes the game feel alive and immersive.",
    extra: "He's not only a great artist, but also a great guy. You can never get bored with him."
  },
  {
    id: "saray",
    name: "Saray",
    role: "Emotional Support",
    active: true,
    startYear: 2026,
    endYear: null,
    photo: "fireus.png",
    bio: "Provides emotional support, encouragement, and motivation to the team, ensuring a positive and productive work environment.",
    extra: "Thank you for doing nothing. :)"
  },
  {
    id: "dani",
    name: "Dani",
    role: "The Clown",
    active: true,
    startYear: 2026,
    endYear: null,
    games: ["depths-of-death"],
    photo: "fireus.png",
    bio: "This guy makes the life funny. He is the one who makes the team laugh and keeps the spirits high.",
    extra: "P.S. If you don't know anyone like him, your life must be very sad."
  }
];
*/
const defaultPhoto = "fireus.png";

function getCurrentGameId() {
  return document.body?.dataset?.gameId || null;
}

function getVisibleContributors() {
  const currentGameId = getCurrentGameId();

  if (!currentGameId) {
    return contributorData;
  }

  return contributorData.filter((person) => {
    if (!Array.isArray(person.games)) {
      return false;
    }

    return person.games.includes(currentGameId);
  });
}

function getPersonGames(person) {
  if (!person || !Array.isArray(person.games) || person.games.length === 0) {
    return [];
  }

  return person.games
    .map((gameId) => {
      const game = gameCatalog[gameId];
      if (!game) return null;

      return {
        id: gameId,
        name: game.name,
        url: game.url || `${gameId}.html`
      };
    })
    .filter(Boolean);
}

function updateUrlParam(personId) {
  const url = new URL(window.location.href);

  if (!personId) {
    url.searchParams.delete('person');
  } else {
    url.searchParams.set('person', personId);
  }

  window.history.replaceState({}, '', url);
}

function formatContributorPeriod(person) {
  if (person.active) {
    return `since ${person.startYear}`;
  }

  if (person.startYear && person.endYear) {
    return `since ${person.startYear} - ${person.endYear}`;
  }

  return `since ${person.startYear || 'unknown'}`;
}

function openContributorModal(personId) {
  const person = contributorData.find((item) => item.id === personId);
  if (!person) return;

  const modal = document.getElementById('person-modal');
  if (!modal) return;

  const games = getPersonGames(person);
  const gamesMarkup = games.length
    ? `
      <div class="person-modal-games">
        <strong>Worked on:</strong>
        <div class="person-modal-games-list">
          ${games.map((game) => `
            <a href="${game.url}" class="person-modal-game-link">${game.name}</a>
          `).join('')}
        </div>
      </div>
    `
    : '';

  modal.querySelector('.person-modal-panel').innerHTML = `
    <button class="person-modal-close" type="button" aria-label="Close profile">×</button>
    <div class="person-modal-content">
      <img src="${person.photo || defaultPhoto}" alt="${person.name}" class="person-modal-photo" onerror="this.onerror=null;this.src='fireus.png';">
      <div class="person-modal-text">
        <div class="person-modal-header">
          <h3>${person.name}</h3>
        </div>
        <p class="person-modal-role">${person.role}</p>
        <span class="person-modal-period">${formatContributorPeriod(person)}</span>
        <p>${person.bio}</p>
        ${gamesMarkup}
        <small>${person.extra || 'Contributor to the Fireus project.'}</small>
      </div>
    </div>
  `;

  modal.classList.add('visible');
  document.body.classList.add('modal-open');
  updateUrlParam(person.id);

  const closeButton = modal.querySelector('.person-modal-close');
  if (closeButton) {
    closeButton.addEventListener('click', closeContributorModal);
  }
}

function closeContributorModal() {
  const modal = document.getElementById('person-modal');
  if (!modal) return;

  modal.classList.remove('visible');
  document.body.classList.remove('modal-open');
  updateUrlParam(null);
}

function renderContributorList() {
  const container = document.getElementById('contributors-grid');
  if (!container) return;

  const visibleContributors = getVisibleContributors();
  container.innerHTML = '';

  visibleContributors.forEach((person) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'person-mini';
    button.dataset.id = person.id;

    button.innerHTML = `
      <img src="${person.photo || defaultPhoto}" alt="${person.name}" class="person-mini-photo" onerror="this.onerror=null;this.src='fireus.png';">
      <div class="person-mini-text">
        <strong>${person.name}</strong>
        <span>${person.role}</span>
        <small class="person-status ${person.active ? 'active' : 'inactive'}">${person.active ? 'Active' : 'Inactive'}</small>
      </div>
    `;

    button.addEventListener('click', () => openContributorModal(person.id));
    container.appendChild(button);
  });
}

function renderCreditsList() {
  const creditsList = document.getElementById('credits-list');
  if (!creditsList) return;

  const visibleContributors = getVisibleContributors();
  creditsList.innerHTML = '';

  visibleContributors.forEach((person) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'credit-item';
    button.dataset.id = person.id;
    button.innerHTML = `
      <span>${person.name}</span>
      <small>${person.role}</small>
    `;
    button.addEventListener('click', () => openContributorModal(person.id));
    creditsList.appendChild(button);
  });
}

function setupContributorModal() {
  const existing = document.getElementById('person-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'person-modal';
  modal.className = 'person-modal';
  modal.innerHTML = `
    <div class="person-modal-backdrop"></div>
    <div class="person-modal-panel" role="dialog" aria-modal="true" aria-labelledby="person-modal-title"></div>
  `;

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('person-modal-backdrop')) {
      closeContributorModal();
    }
  });

  document.body.appendChild(modal);
}

function initializeContributors() {
  document.documentElement.style.setProperty('--contributors-per-row', contributorsPerRow);
  setupContributorModal();
  renderContributorList();
  renderCreditsList();

  const params = new URLSearchParams(window.location.search);
  const requestedId = params.get('person');

  if (requestedId) {
    openContributorModal(requestedId);
  }
}

document.addEventListener('DOMContentLoaded', initializeContributors);
