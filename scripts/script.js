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

    // Show first 20 games initially
    let displayedCount = 20;
    let currentFilter = 'all';
    let currentSort = 'newest';

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
        if (e.key === 'Escape' && document.activeElement === searchInput) {
            searchInput.value = '';
            searchInput.dispatchEvent(new Event('input'));
            searchInput.blur();
        }
    });

    // Loading overlay when clicking play buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('play-button')) {
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
                <img src="assets/thumbs/${gameName}.png" alt="${gameName.replace(/-/g, ' ')}" class="game-thumbnail" onerror="this.onerror=null;this.src='assets/thumbs/fallback.svg';this.onerror=null;">
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

    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const allCards = document.querySelectorAll('.game-card');

        allCards.forEach(card => {
            const gameName = card.getAttribute('data-game').toLowerCase();
            const description = Array.from(card.querySelectorAll('p')).map(p => p.textContent.toLowerCase()).join(' ');

            if (gameName.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});