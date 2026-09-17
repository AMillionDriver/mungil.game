document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const gameCards = document.querySelectorAll('.game-card');
    const jskGamesContainer = document.getElementById('jskGamesContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const loadingSkeleton = document.getElementById('loadingSkeleton');
    const filterChips = document.querySelectorAll('.filter-chip');
    const sortSelect = document.getElementById('sortSelect');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const suggestionsBox = document.getElementById('searchSuggestions');

    // Show first 20 games initially
    let displayedCount = 20;
    let currentFilter = 'all';
    let currentSort = 'newest';
    let fuse = null;
    let activeSuggestionIdx = -1;
    let currentSuggestions = [];

    // Dark mode toggle
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode === 'true') {
        document.body.classList.add('dark-mode');
        darkModeToggle.textContent = '☀️';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function() {
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
    }, 1000);

    // Filter functionality
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            currentFilter = this.getAttribute('data-filter');
            filterCards();
        });
    });

    // Sort functionality
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            currentSort = this.value;
            sortCards();
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === '/' && document.activeElement !== searchInput) {
            e.preventDefault();
            searchInput.focus();
        }
        if (e.key === 'Escape') {
            if (document.activeElement === searchInput) {
                searchInput.value = '';
                document.body.classList.remove('is-searching');
                hideSuggestions();
                searchInput.blur();
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    });

    // Track play button clicks
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('play-button')) {
            const card = e.target.closest('.game-card');
            const gameName = card?.dataset.game || 'unknown';
            const gameUrl = e.target.getAttribute('href');
            
            // Track in Google Analytics
            if (window.gtag) {
                gtag('event', 'play_game', {
                    game_name: gameName,
                    game_url: gameUrl,
                });
            }
            
            // Show loading overlay
            loadingOverlay.classList.add('active');
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
            }, 800);
        }
    });

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then((registration) => {
                    console.log('ServiceWorker registered:', registration.scope);
                })
                .catch((error) => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }

    function filterCards() {
        gameCards.forEach(card => {
            const tags = card.querySelectorAll('.tag');
            const hasFilterTag = Array.from(tags).some(tag => 
                tag.classList.contains(currentFilter) || currentFilter === 'all'
            );
            card.style.display = hasFilterTag ? 'block' : 'none';
        });
    }

    function sortCards() {
        // This is a placeholder - actual sorting would depend on game data
        console.log('Sorting by:', currentSort);
    }

    function renderGameCards(games, startIndex, count) {
        const gamesToRender = games.slice(startIndex, startIndex + count);
        
        gamesToRender.forEach(gameName => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.setAttribute('data-game', gameName);
            card.innerHTML = `
                <img src="assets/thumbs/${gameName}.png" alt="${gameName.replace(/-/g, ' ')}" class="game-thumbnail" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='assets/thumbs/fallback.svg';">
                <div class="game-tags">
                    <span class="tag action">Action</span>
                    <span class="tag browser">Browser</span>
                </div>
                <h2>${gameName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h2>
                <p>JSk13Games browser-based game. Click to play now.</p>
                <p class="attribution">This game was clone from JSk13Games (Play the original on their website)</p>
                <a href="./game/Jsk_Games/${gameName}/index.html" class="play-button">Play Now</a>
            `;
            jskGamesContainer.appendChild(card);
        });
    }

    // Initial render
    if (typeof jskGames !== 'undefined') {
        renderGameCards(jskGames, 0, displayedCount);
    }

    // Load more functionality
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            if (typeof jskGames !== 'undefined') {
                const nextCount = displayedCount + 20;
                renderGameCards(jskGames, displayedCount, 20);
                displayedCount = nextCount;
                
                if (displayedCount >= jskGames.length) {
                    loadMoreBtn.style.display = 'none';
                }
            }
        });
    }

    // Build full index on load
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(buildFullIndex, 500);
    });

    // ═══════════════════════════════════════════════════
    // FULL DATASET SEARCH (featured + all JSK games)
    // ═══════════════════════════════════════════════════
    let fullGameIndex = [];

    function buildFullIndex() {
        fullGameIndex = [];

        // 1. Featured games (from DOM)
        document.querySelectorAll('#gamesContainer .game-card').forEach(card => {
            fullGameIndex.push({
                type: 'featured',
                name: card.querySelector('h2')?.textContent?.trim() || '',
                tags: Array.from(card.querySelectorAll('.tag')).map(t => t.textContent).join(' '),
                description: card.querySelector('p')?.textContent || '',
                href: card.querySelector('a.play-button')?.getAttribute('href') || '#',
                element: card,
            });
        });

        // 2. All JSK games (from array, not DOM)
        if (typeof jskGames !== 'undefined') {
            jskGames.forEach(slug => {
                const name = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                fullGameIndex.push({
                    type: 'jsk',
                    name,
                    slug,
                    tags: 'action browser',
                    description: 'JSk13Games browser-based game',
                    href: `./game/Jsk_Games/${slug}/index.html`,
                    thumb: `assets/thumbs/${slug}.png`,
                    element: null,
                });
            });
        }

        fuse = new Fuse(fullGameIndex, {
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

        console.log(`🔍 Fuse indexed ${fullGameIndex.length} games`);
    }

    // Expose for games.js
    window.buildFullIndex = buildFullIndex;

    // Create JSK card element with lazy loading
    function createJskCardElement(game) {
        const card = document.createElement('div');
        card.className = 'game-card';
        card.setAttribute('data-game', game.slug);

        card.innerHTML = `
            <img src="${game.thumb}" 
                 alt="${game.name}" 
                 class="game-thumbnail" 
                 loading="lazy"
                 decoding="async"
                 onerror="this.onerror=null;this.src='assets/thumbs/fallback.svg';">
            <div class="game-tags">
                <span class="tag action">Action</span>
                <span class="tag browser">Browser</span>
            </div>
            <h2>${game.name}</h2>
            <p>${game.description}. Click to play now.</p>
            <p class="attribution">This game was clone from JSk13Games (Play the original on their website)</p>
            <a href="${game.href}" class="play-button">Play Now</a>
        `;

        game.element = card;
        return card;
    }

    // Search handler - render from FULL dataset
    searchInput.addEventListener('input', function() {
        const query = this.value.trim();
        const jskContainer = document.getElementById('jskGamesContainer');
        const loadMoreContainer = document.querySelector('.load-more-container');
        const featuredContainer = document.getElementById('gamesContainer');

        // Toggle is-searching class to hide filter section
        if (query.length > 0) {
            document.body.classList.add('is-searching');
        } else {
            document.body.classList.remove('is-searching');
        }

        // Empty query = reset to paginated view
        if (!query) {
            hideSuggestions();
            if (typeof jskGames !== 'undefined') {
                jskContainer.innerHTML = '';
                renderGameCards(jskGames, 0, displayedCount);
                loadMoreContainer.style.display = '';
            }
            featuredContainer.style.display = '';
            return;
        }

        if (!fuse) buildFullIndex();

        const results = fuse.search(query);

        // Hide Load More during search
        loadMoreContainer.style.display = 'none';

        // Clear and re-render
        jskContainer.innerHTML = '';
        featuredContainer.innerHTML = '';

        if (results.length === 0) {
            featuredContainer.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                    <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.6;">😕</div>
                    <h3 style="color: #333; margin-bottom: 0.5rem;">Nggak nemu game "${query}"</h3>
                    <p style="color: #888; font-size: 0.9rem;">Coba: <b>neon</b>, <b>tower</b>, <b>13</b>, <b>puzzle</b></p>
                </div>
            `;
            hideSuggestions();
            return;
        }

        const jskResults = results.filter(r => r.item.type === 'jsk');
        const featuredResults = results.filter(r => r.item.type === 'featured');

        // Render featured
        featuredResults.forEach(r => {
            if (r.item.element) {
                featuredContainer.appendChild(r.item.element);
            }
        });

        // Render JSK - render from data with lazy loading
        jskResults.forEach(r => {
            const cardEl = createJskCardElement(r.item);
            jskContainer.appendChild(cardEl);
        });

        // Suggestions
        currentSuggestions = results.slice(0, 5).map(r => r.item);
        renderSuggestions(currentSuggestions);
    });

    function renderSuggestions(items) {
        if (!items.length) {
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
        suggestionsBox.querySelectorAll('.suggestion-item').forEach((el, idx) => {
            el.classList.toggle('active', idx === activeSuggestionIdx);
        });
    }

    function hideSuggestions() {
        suggestionsBox.hidden = true;
        suggestionsBox.innerHTML = '';
        activeSuggestionIdx = -1;
        currentSuggestions = [];
        // Remove is-searching class if input is empty
        if (!searchInput.value.trim()) {
            document.body.classList.remove('is-searching');
        }
    }

    function openGame(item) {
        hideSuggestions();
        item.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        item.element.style.outline = '3px solid #667eea';
        setTimeout(() => item.element.style.outline = '', 2000);
    }

    // Keyboard navigation
    searchInput.addEventListener('keydown', function(e) {
        if (suggestionsBox.hidden) {
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

    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSuggestions();
        }
    });

    // Re-init Fuse after load more
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            setTimeout(() => {
                if (window.initFuse) window.initFuse();
            }, 100);
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