document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const gameCards = document.querySelectorAll('.game-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        gameCards.forEach(card => {
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