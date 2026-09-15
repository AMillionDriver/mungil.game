document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const gameCards = document.querySelectorAll('.game-card');
    const jskGamesContainer = document.getElementById('jskGamesContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    // Show first 20 games initially
    let displayedCount = 20;

    function renderGameCards(games, startIndex, count) {
        const gamesToRender = games.slice(startIndex, startIndex + count);
        
        gamesToRender.forEach(gameName => {
            const card = document.createElement('div');
            card.className = 'game-card';
            card.setAttribute('data-game', gameName);
            card.innerHTML = `
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