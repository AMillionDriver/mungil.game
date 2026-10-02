document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('searchInput');
  const jskGamesContainer = document.getElementById('jskGamesContainer');
  const featuredContainer = document.getElementById('gamesContainer');
  const collectionHeading = document.getElementById('collectionHeading') || document.querySelector('main h3');
  const loadMoreContainer = document.querySelector('.load-more-container');
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const loadingSkeleton = document.getElementById('loadingSkeleton');
  const filterChips = document.querySelectorAll('.filter-chip');
  const sortSelect = document.getElementById('sortSelect');
  const loadingOverlay = document.getElementById('loadingOverlay');
  const suggestionsBox = document.getElementById('searchSuggestions');

  // Pagination & Filter/Sort State
  let displayedCount = 24;
  let currentFilter = 'all';
  let currentSort = 'newest';
  let fuse = null;
  let activeSuggestionIdx = -1;
  let currentSuggestions = [];

  // Dark mode toggle
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    document.body.classList.add('dark-mode');
    if (darkModeToggle) darkModeToggle.textContent = '☀️';
  }
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');
      const isDarkMode = document.body.classList.contains('dark-mode');
      darkModeToggle.textContent = isDarkMode ? '☀️' : '🌙';
      localStorage.setItem('darkMode', isDarkMode);
    });
  }

  // Hide loading skeleton after a short delay
  setTimeout(() => {
    if (loadingSkeleton) {
      loadingSkeleton.style.opacity = '0';
      loadingSkeleton.style.transition = 'opacity 0.5s ease';
      setTimeout(() => {
        loadingSkeleton.style.display = 'none';
      }, 500);
    }
  }, 800);

  // ═══════════════════════════════════════════════════
  // MASTER GAME CATALOG
  // ═══════════════════════════════════════════════════
  const FEATURED_GAMES = [
    {
      slug: 'neon-protocol-cyber-rebellion',
      name: 'Neon Protocol: Cyber Rebellion',
      badge: 'NEW',
      badgeClass: 'badge new',
      thumb: 'assets/thumbs/neon-protocol-cyber-rebellion.png',
      tags: ['action', 'cyberpunk', 'adventure', 'arcade', 'retro'],
      description: 'Join the rebellion in this action-packed cyberpunk adventure.',
      href: './game/neon_protocol_cyber_rebellion.html',
      releaseDate: '2026-10-01',
      timestamp: new Date('2026-10-01T12:00:00Z').getTime(),
      popularity: 99,
      isFeatured: true,
    },
    {
      slug: 'neon-cyber-survivor',
      name: 'Neon Cyber Survivor',
      badge: 'NEW',
      badgeClass: 'badge new',
      thumb: 'assets/thumbs/neon-cyber-survivor.png',
      tags: ['action', 'cyberpunk', 'roguelike', 'arcade'],
      description: 'Survive in a cyberpunk world with neon visuals and fast-paced gameplay.',
      href: './game/neon_cyber_survivor.html',
      releaseDate: '2026-09-28',
      timestamp: new Date('2026-09-28T12:00:00Z').getTime(),
      popularity: 98,
      isFeatured: true,
    },
    {
      slug: 'neon-mainframe-defense',
      name: 'Neon Mainframe Defense',
      badge: '🔥 HOT',
      badgeClass: 'badge hot',
      thumb: 'assets/thumbs/neon-mainframe-defense.png',
      tags: ['defense', 'tower', 'strategy', 'arcade', 'retro'],
      description: 'Defend the mainframe from cyber threats in this strategic defense game.',
      href: './game/neon_mainframe_defense.html',
      releaseDate: '2026-08-15',
      timestamp: new Date('2026-08-15T12:00:00Z').getTime(),
      popularity: 95,
      isFeatured: true,
    },
  ];

  function getTagsForJskSlug(slug) {
    const s = slug.toLowerCase();
    const tags = new Set(['browser']);

    // Defense & Strategy
    if (/defense|tower|guard|protect|siege|castle|fort|defend|barrier|wall|shield|rome|tanks|battleship/.test(s)) {
      tags.add('defense');
    }
    // Puzzle & Logic
    if (/puzzle|maze|card|dungeon|2048|moves|solve|escape|room|logic|chess|block|match|organizer|bricks|bubbles|curses|drums|squared|solitaire|century-2048|city-builder|words|letter|sudoku|numbers|6174|10plus3|tetris|storehouse|balance/.test(s)) {
      tags.add('puzzle');
    }
    // Arcade & Skill
    if (/arcade|pinball|invaders|shooter|snake|bird|ball|jump|runner|race|flight|pong|flapping|juggle|pacman|tetris|balloon|asteroids|soccer|speed|kph|operator/.test(s)) {
      tags.add('arcade');
    }
    // Retro & Classic
    if (/retro|pixel|monochrome|classic|8bit|1980|space|century|samurai|damned|ancient|rome|middle-ages|knight|-ad\b|pacman|tetris|snake|opera/.test(s)) {
      tags.add('retro');
    }
    // Action (default if not puzzle/defense, or has combat keywords)
    if (/action|survivor|rebellion|blades|tanks|shooter|fighter|attack|assault|kill|midnight|hero|battle|gun|war|combat|strike|slash|cyber|slasher|hunter|dead|damned|destroy/.test(s) || (!tags.has('puzzle') && !tags.has('defense'))) {
      tags.add('action');
    }

    return Array.from(tags);
  }

  let allGamesCatalog = [...FEATURED_GAMES];

  if (typeof jskGames !== 'undefined') {
    const totalJsk = jskGames.length;
    jskGames.forEach((slug, i) => {
      const s = slug.toLowerCase();
      const tags = getTagsForJskSlug(slug);

      let timestamp;
      let popularity = 60 + ((i * 7) % 32);
      let badge = null;
      let badgeClass = 'badge';

      if (slug === 'Tetris') {
        timestamp = new Date('1984-06-06T00:00:00Z').getTime();
        popularity = 97;
        badge = 'CLASSIC';
        badgeClass = 'badge hot';
      } else if (slug === 'Pacman') {
        timestamp = new Date('1980-05-22T00:00:00Z').getTime();
        popularity = 96;
        badge = 'CLASSIC';
        badgeClass = 'badge hot';
      } else if (slug === 'Snake') {
        timestamp = new Date('1997-10-01T00:00:00Z').getTime();
        popularity = 94;
        badge = 'CLASSIC';
        badgeClass = 'badge';
      } else {
        // Chronological distribution from 2013 to 2024
        const year = 2013 + Math.floor((i / totalJsk) * 11);
        const month = i % 12;
        const day = (i % 28) + 1;
        timestamp = new Date(year, month, day, 12, 0, 0).getTime();

        if (/2048|tower-defense|dungeon|404-bc-pinball|space-organizer/.test(s)) {
          popularity = 86 + (i % 8);
          badge = '🔥 POPULAR';
          badgeClass = 'badge hot';
        }
      }

      const name = (slug === 'Pacman' || slug === 'Snake' || slug === 'Tetris')
        ? slug
        : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

      allGamesCatalog.push({
        slug,
        name,
        badge,
        badgeClass,
        thumb: `assets/thumbs/${slug}.png`,
        tags,
        description: 'JSk13Games browser-based game. Click to play now.',
        href: `./game/Jsk_Games/${slug}/index.html`,
        releaseDate: new Date(timestamp).toISOString().split('T')[0],
        timestamp,
        popularity,
        isFeatured: false,
      });
    });
  }

  // ═══════════════════════════════════════════════════
  // FILTERING & SORTING LOGIC
  // ═══════════════════════════════════════════════════
  function getFilteredAndSortedGames() {
    let list = allGamesCatalog.filter(game => {
      if (currentFilter === 'all') return true;
      return game.tags.includes(currentFilter);
    });

    switch (currentSort) {
      case 'newest':
        // Newest release first (highest timestamp to lowest)
        list.sort((a, b) => b.timestamp - a.timestamp || a.name.localeCompare(b.name));
        break;
      case 'oldest':
        // Oldest release first (lowest timestamp to highest)
        list.sort((a, b) => a.timestamp - b.timestamp || a.name.localeCompare(b.name));
        break;
      case 'popular':
        // Most popular first
        list.sort((a, b) => b.popularity - a.popularity || a.name.localeCompare(b.name));
        break;
      case 'az':
        // Alphabetical A to Z
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'za':
        // Alphabetical Z to A
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        list.sort((a, b) => b.timestamp - a.timestamp);
    }

    return list;
  }

  function createGameCardElement(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-game', game.name || game.slug);

    const tagsHtml = game.tags
      .map(tag => `<span class="tag ${tag}">${tag.charAt(0).toUpperCase() + tag.slice(1)}</span>`)
      .join(' ');

    const badgeHtml = game.badge
      ? `<div class="${game.badgeClass || 'badge'}">${game.badge}</div>`
      : '';

    const attributionHtml = !game.isFeatured
      ? `<p class="attribution">This game was clone from JSk13Games (Play the original on their website)</p>`
      : '';

    card.innerHTML = `
      ${badgeHtml}
      <img
        src="${game.thumb}"
        alt="${game.name}"
        class="game-thumbnail"
        loading="lazy"
        decoding="async"
        onerror="this.onerror=null;this.src='assets/thumbs/fallback.svg';"
      />
      <div class="game-tags">
        ${tagsHtml}
      </div>
      <h2>${game.name}</h2>
      <p>${game.description}</p>
      ${attributionHtml}
      <a href="${game.href}" class="play-button">Play Now</a>
    `;

    game.element = card;
    return card;
  }

  function renderCurrentView() {
    const games = getFilteredAndSortedGames();

    if (!jskGamesContainer) return;
    if (featuredContainer) featuredContainer.innerHTML = '';
    jskGamesContainer.innerHTML = '';

    if (games.length === 0) {
      if (collectionHeading) collectionHeading.style.display = 'none';
      if (featuredContainer) featuredContainer.style.display = 'none';
      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      jskGamesContainer.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
          <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.6;">🎮</div>
          <h3 style="margin-bottom: 0.5rem;">Tidak ada game dalam kategori ini</h3>
          <p style="opacity: 0.8; font-size: 0.9rem;">Coba pilih kategori lain seperti <b>All</b> atau <b>Action</b>.</p>
        </div>
      `;
      return;
    }

    // Default view: Newest + All
    if (currentSort === 'newest' && currentFilter === 'all') {
      if (featuredContainer) {
        featuredContainer.style.display = '';
        const featuredList = games.filter(g => g.isFeatured);
        featuredList.forEach(game => {
          featuredContainer.appendChild(createGameCardElement(game));
        });
      }

      if (collectionHeading) {
        collectionHeading.style.display = '';
        collectionHeading.textContent = `JSk13Games & Classic Collection (${allGamesCatalog.length - 3}+ game tersedia)`;
      }

      const nonFeatured = games.filter(g => !g.isFeatured);
      const toShow = nonFeatured.slice(0, displayedCount);
      toShow.forEach(game => {
        jskGamesContainer.appendChild(createGameCardElement(game));
      });

      if (loadMoreContainer) {
        loadMoreContainer.style.display = displayedCount < nonFeatured.length ? '' : 'none';
      }
    } else {
      // Filtered or Sorted by Oldest / Popular / A-Z / Z-A:
      // Hide featuredContainer so the true sorted order is 100% linear and accurate!
      if (featuredContainer) {
        featuredContainer.style.display = 'none';
      }

      if (collectionHeading) {
        collectionHeading.style.display = '';
        const filterTitle = currentFilter.charAt(0).toUpperCase() + currentFilter.slice(1);
        let sortTitle = 'Terbaru (Newest)';
        if (currentSort === 'oldest') sortTitle = 'Terlama (Oldest First)';
        else if (currentSort === 'popular') sortTitle = 'Terpopuler (Popular)';
        else if (currentSort === 'az') sortTitle = 'A - Z';
        else if (currentSort === 'za') sortTitle = 'Z - A';

        if (currentFilter === 'all') {
          collectionHeading.textContent = `Koleksi Game · Urutan: ${sortTitle} (${games.length} game)`;
        } else {
          collectionHeading.textContent = `Koleksi ${filterTitle} · Urutan: ${sortTitle} (${games.length} game)`;
        }
      }

      const toShow = games.slice(0, displayedCount);
      toShow.forEach(game => {
        jskGamesContainer.appendChild(createGameCardElement(game));
      });

      if (loadMoreContainer) {
        loadMoreContainer.style.display = displayedCount < games.length ? '' : 'none';
      }
    }
  }

  // Initial render
  renderCurrentView();

  // Filter chips click listener
  filterChips.forEach(chip => {
    chip.addEventListener('click', function () {
      filterChips.forEach(c => c.classList.remove('active'));
      this.classList.add('active');
      currentFilter = this.getAttribute('data-filter') || 'all';
      displayedCount = 24;
      renderCurrentView();
    });
  });

  // Sort dropdown change listener
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      currentSort = this.value;
      displayedCount = 24;
      renderCurrentView();
    });
  }

  // Load more button listener
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      displayedCount += 24;
      renderCurrentView();
    });
  }

  // ═══════════════════════════════════════════════════
  // FULL DATASET SEARCH (FUSE.JS)
  // ═══════════════════════════════════════════════════
  function buildFullIndex() {
    fuse = new Fuse(allGamesCatalog, {
      keys: [
        { name: 'name', weight: 0.7 },
        { name: 'tags', weight: 0.2 },
        { name: 'description', weight: 0.1 },
      ],
      threshold: 0.4,
      includeScore: true,
      minMatchCharLength: 1,
      ignoreLocation: true,
      findAllMatches: true,
    });
    console.log(`🔍 Fuse indexed ${allGamesCatalog.length} games`);
  }

  setTimeout(buildFullIndex, 200);

  // Search input handler
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.trim();

      if (query.length > 0) {
        document.body.classList.add('is-searching');
      } else {
        document.body.classList.remove('is-searching');
      }

      if (!query) {
        hideSuggestions();
        renderCurrentView();
        return;
      }

      if (!fuse) buildFullIndex();
      const results = fuse.search(query);

      if (loadMoreContainer) loadMoreContainer.style.display = 'none';
      if (featuredContainer) {
        featuredContainer.innerHTML = '';
        featuredContainer.style.display = 'none';
      }
      if (jskGamesContainer) jskGamesContainer.innerHTML = '';

      if (results.length === 0) {
        if (collectionHeading) collectionHeading.style.display = 'none';
        if (jskGamesContainer) {
          jskGamesContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
              <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.6;">😕</div>
              <h3 style="margin-bottom: 0.5rem;">Nggak nemu game "${query}"</h3>
              <p style="opacity: 0.8; font-size: 0.9rem;">Coba: <b>neon</b>, <b>tower</b>, <b>13</b>, <b>puzzle</b>, <b>tetris</b></p>
            </div>
          `;
        }
        hideSuggestions();
        return;
      }

      if (collectionHeading) {
        collectionHeading.style.display = '';
        collectionHeading.textContent = `Hasil Pencarian "${query}" (${results.length} game ditemukan)`;
      }

      results.forEach(r => {
        const cardEl = createGameCardElement(r.item);
        jskGamesContainer.appendChild(cardEl);
      });

      currentSuggestions = results.slice(0, 5).map(r => r.item);
      renderSuggestions(currentSuggestions);
    });
  }

  function renderSuggestions(items) {
    if (!items.length || !suggestionsBox) {
      hideSuggestions();
      return;
    }
    activeSuggestionIdx = -1;
    suggestionsBox.innerHTML = '';
    items.forEach((item, idx) => {
      const el = document.createElement('div');
      el.className = 'suggestion-item';
      el.dataset.idx = idx;
      el.innerHTML = `
        <span class="suggestion-icon">🎮</span>
        <span>${item.name}</span>
        ${idx === 0 ? '<span class="suggestion-hint">Enter ⏎</span>' : ''}
      `;
      el.addEventListener('click', () => openGame(item));
      el.addEventListener('mouseenter', () => {
        activeSuggestionIdx = idx;
        updateActiveSuggestion();
      });
      suggestionsBox.appendChild(el);
    });
    suggestionsBox.hidden = false;
  }

  function updateActiveSuggestion() {
    if (!suggestionsBox) return;
    suggestionsBox.querySelectorAll('.suggestion-item').forEach((el, idx) => {
      el.classList.toggle('active', idx === activeSuggestionIdx);
    });
  }

  function hideSuggestions() {
    if (!suggestionsBox) return;
    suggestionsBox.hidden = true;
    suggestionsBox.innerHTML = '';
    activeSuggestionIdx = -1;
    currentSuggestions = [];
    if (searchInput && !searchInput.value.trim()) {
      document.body.classList.remove('is-searching');
    }
  }

  function openGame(item) {
    hideSuggestions();
    if (item.element) {
      item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      item.element.style.outline = '3px solid #667eea';
      setTimeout(() => (item.element.style.outline = ''), 2000);
    } else if (item.href) {
      window.location.href = item.href;
    }
  }

  // Keyboard navigation
  if (searchInput) {
    searchInput.addEventListener('keydown', function (e) {
      if (!suggestionsBox || suggestionsBox.hidden) {
        if (e.key === 'Enter') {
          const firstCard = document.querySelector('.game-card:not([style*="none"]) a.play-button');
          if (firstCard) firstCard.click();
        }
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeSuggestionIdx = Math.min(activeSuggestionIdx + 1, currentSuggestions.length - 1);
        updateActiveSuggestion();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeSuggestionIdx = Math.max(activeSuggestionIdx - 1, -1);
        updateActiveSuggestion();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const pick = activeSuggestionIdx >= 0 ? currentSuggestions[activeSuggestionIdx] : currentSuggestions[0];
        if (pick) openGame(pick);
      } else if (e.key === 'Escape') {
        hideSuggestions();
        searchInput.blur();
      }
    });
  }

  // Global Keyboard shortcuts
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== searchInput) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
    if (e.key === 'Escape') {
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        document.body.classList.remove('is-searching');
        hideSuggestions();
        searchInput.blur();
        renderCurrentView();
      }
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search-container')) {
      hideSuggestions();
    }
  });

  // Track play button clicks
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('play-button')) {
      const card = e.target.closest('.game-card');
      const gameName = card?.dataset.game || 'unknown';
      const gameUrl = e.target.getAttribute('href');

      if (window.gtag) {
        window.gtag('event', 'play_game', {
          game_name: gameName,
          game_url: gameUrl,
        });
      }

      if (loadingOverlay) {
        loadingOverlay.classList.add('active');
        setTimeout(() => {
          loadingOverlay.classList.remove('active');
        }, 800);
      }
    }
  });

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('./sw.js')
        .then(registration => {
          console.log('ServiceWorker registered:', registration.scope);
        })
        .catch(error => {
          console.log('ServiceWorker registration failed:', error);
        });
    });
  }
});

// Cookie consent banner
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
if (cookieBanner && !localStorage.getItem('cookieConsent')) {
  setTimeout(() => {
    cookieBanner.hidden = false;
  }, 1000);
}
if (cookieAccept) {
  cookieAccept.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'accepted');
    cookieBanner.hidden = true;
  });
}
