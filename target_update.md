🎯 Solusi UX terbaik
Kombinasi 3 hal:

Hide filter & sort saat user ngetik (biar dropdown punya ruang)

Fix stacking context (z-index header + dropdown)

Smooth animation biar transisinya halus

Hasilnya kayak Spotify/Google: ketik → filter hilang, dropdown muncul. Clear → filter balik.

📝 Implementasi
1. CSS — Fix z-index & animasi
Di style.css, ganti/update beberapa blok:

css
/* Header — bikin stacking context */
header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem 1rem;
    text-align: center;
    position: relative;
    z-index: 10;                   /* ← naikin di atas main */
}

/* Search container — buat anchor dropdown */
.search-container {
    max-width: 500px;
    margin: 0 auto;
    position: relative;            /* ← penting! anchor untuk dropdown */
}

/* Dropdown suggestion — fix posisi */
.search-suggestions {
    position: absolute;
    top: calc(100% + 8px);
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
    z-index: 999;                  /* ← tinggi banget */
    max-height: 320px;
    overflow-y: auto;
    padding: 6px;
    animation: slideDown 0.15s ease-out;
}

@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Filter section — animasi hide saat searching */
.filter-section {
    margin-top: 1.5rem;
    padding: 0 1rem;
    max-height: 200px;
    overflow: hidden;
    transition: max-height 0.25s ease, opacity 0.2s ease, margin-top 0.25s ease;
    opacity: 1;
}

/* Saat searching — collapse filter */
body.is-searching .filter-section {
    max-height: 0;
    opacity: 0;
    margin-top: 0;
    pointer-events: none;
}

/* Dark mode override untuk dropdown */
body.dark-mode .search-suggestions {
    background: #2d3748;
    border-color: #4a5568;
}

body.dark-mode .suggestion-item {
    color: #e2e8f0;
}

body.dark-mode .suggestion-item:hover,
body.dark-mode .suggestion-item.active {
    background: #4a5568;
}

body.dark-mode .suggestion-hint {
    border-color: #4a5568;
    color: #a0aec0;
}
2. JS — Tambah class is-searching ke body
Di script.js, update search handler:

javascript
searchInput.addEventListener('input', function() {
    const query = this.value.trim();
    const jskContainer = document.getElementById('jskGamesContainer');
    const loadMoreContainer = document.querySelector('.load-more-container');
    const featuredContainer = document.getElementById('gamesContainer');

    // ═══ Toggle is-searching class untuk hide filter section ═══
    if (query.length > 0) {
        document.body.classList.add('is-searching');
    } else {
        document.body.classList.remove('is-searching');
    }

    // ── Query kosong = reset ──
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
    loadMoreContainer.style.display = 'none';

    jskContainer.innerHTML = '';
    featuredContainer.innerHTML = '';

    if (results.length === 0) {
        featuredContainer.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.6;">😕</div>
                <h3 style="color: var(--text-primary); margin-bottom: 0.5rem;">Nggak nemu game "${query}"</h3>
                <p style="color: #888; font-size: 0.9rem;">Coba: <b>neon</b>, <b>tower</b>, <b>13</b>, <b>puzzle</b></p>
            </div>
        `;
        hideSuggestions();
        return;
    }

    const jskResults = results.filter(r => r.item.type === 'jsk');
    const featuredResults = results.filter(r => r.item.type === 'featured');

    featuredResults.forEach(r => {
        if (r.item.element) {
            featuredContainer.appendChild(r.item.element);
        }
    });

    jskResults.forEach(r => {
        const cardEl = createJskCardElement(r.item);
        jskContainer.appendChild(cardEl);
    });

    currentSuggestions = results.slice(0, 5).map(r => r.item);
    renderSuggestions(currentSuggestions);
});
3. JS — Fix hideSuggestions biar juga reset state
Cari fungsi hideSuggestions(), ganti jadi:

javascript
function hideSuggestions() {
    suggestionsBox.hidden = true;
    suggestionsBox.innerHTML = '';
    activeSuggestionIdx = -1;
    currentSuggestions = [];
    // Hapus is-searching kalau dropdown ketutup
    // (tapi cek dulu, kalau user masih ngetik jangan hapus)
    if (!searchInput.value.trim()) {
        document.body.classList.remove('is-searching');
    }
}
4. Tambah ESC handler — reset semua
Cari di script.js, update handler Escape:

javascript
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
            // Trigger reset view
            searchInput.dispatchEvent(new Event('input'));
        }
    }
});
🎨 Hasil visual
text
┌─────────────────────────────────────────┐
│  Mini Game Hub                    [🌙]  │
│                                          │
│  ┌──────────────────────────────────┐  │
│  │ 13 tac___________________________│  │ ← search
│  │ ┌──────────────────────────────┐│  │
│  │ │ 🎮 13 Tanks            Enter ││  │ ← dropdown
│  │ │ 🎮 13s Tactics               ││  │   (menggantung)
│  │ └──────────────────────────────┘│  │
│  └──────────────────────────────────┘  │
│                                          │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │ ← filter section
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │   (collapsed / hidden)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  [Cards hasil search]                    │
│  [13 Tanks card]  [13s Tactics card]     │
└─────────────────────────────────────────┘
Saat query di-clear:

text
┌─────────────────────────────────────────┐
│  ┌──────────────────────────────────┐  │
│  │ Cari game...                     │  │
│  └──────────────────────────────────┘  │
│                                          │
│  [All] [Action] [Defense] [Puzzle]     │ ← filter
│  [Arcade] [Retro]                        │   balik
│  Sort: [Newest ▼]                        │
└─────────────────────────────────────────┘