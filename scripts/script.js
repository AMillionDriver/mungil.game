document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const gameCards = document.querySelectorAll('.game-card');

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();

        gameCards.forEach(card => {
            const gameName = card.getAttribute('data-game').toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();

            if (gameName.includes(searchTerm) || description.includes(searchTerm)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});