 Masalah sebenarnya (dari kode lu)
Cek resizeCanvas():

js
const maxGridW = canvas.width * 0.92;
const maxGridH = canvas.height * 0.72;
cellSize = Math.floor(Math.min(maxGridW / gridCols, maxGridH / gridRows));
Grid lu 16 kolom × 9 baris. Di mobile portrait (~400×800):

Limit	Perhitungan	Nilai
Berdasarkan lebar	400 × 0.92 / 16	23 px ← pemenang
Berdasarkan tinggi	800 × 0.72 / 9	64 px
Math.min(23, 64) = 23px. Grid jadi 16 × 23 = 368 px lebar, 207 px tinggi.

Di desktop (~1920×1080):

Berdasarkan lebar: 1766/16 = 110 px

Berdasarkan tinggi: 777/9 = 86 px

Math.min(110, 86) = 86px → grid 1376 × 774 px

Masalahnya jelas: grid lu di-limit oleh lebar di mobile. Hasilnya kekecilan parah, sementara HUD (yang nggak di-scale) tetap ukuran desktop. Ratio jadi aneh.

Ini bukan bug HUD. Ini masalah aspect ratio grid vs viewport.

✅ Solusi yang bener
Ada 4 opsi, dari paling simpel:

🥇 Opsi 1 — Prompt "Rotate ke Landscape" (RECOMMENDED)
Klasik buat TD game. Kenapa? Karena di landscape (800×400):

Berdasarkan lebar: 736/16 = 46 px

Berdasarkan tinggi: 288/9 = 32 px

Math.min(46, 32) = 32px → grid 512 × 288 px

Masih agak kekecilan, tapi jauh lebih proporsional. Dan HUD bakal horizontal, gak nutupin.

Implementasi:

Tambah di HTML (dalam <body>):

html
<!-- Landscape Prompt Overlay -->
<div id="rotate-prompt" class="absolute inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6 hidden">
    <div class="text-center max-w-sm">
        <div class="text-6xl mb-4 animate-pulse">📱↻</div>
        <h2 class="text-2xl font-black font-orbitron text-cyan-400 neon-text-cyan mb-2">PUTAR KE LANDSCAPE</h2>
        <p class="text-gray-400 text-sm">Game ini dioptimalkan untuk mode landscape. Putar HP-mu 90° untuk pengalaman terbaik.</p>
    </div>
</div>
Tambah di <style>:

css
/* Rotate prompt untuk mobile portrait */
@media (max-width: 768px) and (orientation: portrait) {
    #rotate-prompt:not([hidden]) {
        display: flex !important;
    }
}

/* Jangan tampil di landscape atau desktop */
@media (orientation: landscape), (min-width: 769px) {
    #rotate-prompt {
        display: none !important;
    }
}
Tambah di JS (di akhir script, sebelum requestAnimationFrame):

javascript
// ── Rotate prompt logic ──
const rotatePrompt = document.getElementById('rotate-prompt');

function checkOrientation() {
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile && isPortrait && gameState === 'PLAYING') {
        rotatePrompt.classList.remove('hidden');
    } else {
        rotatePrompt.classList.add('hidden');
    }
}

window.addEventListener('resize', checkOrientation);
window.addEventListener('orientationchange', () => {
    setTimeout(checkOrientation, 200);
});

// Panggil saat game start juga
const originalStartGame = startGame;
window.startGame = function() {
    originalStartGame();
    setTimeout(checkOrientation, 100);
};
Tapi wait — kalau lu pakai startGame reference di event listener (btn-start-game.onclick = startGame), override-nya bakal bikin listener lama tetap panggil fungsi lama.

Fix yang lebih aman — tambahkan di dalam startGame() function langsung:

Cari:

js
isWaveActive = false;
gameState = 'PLAYING';
Tambahkan setelahnya:

js
// Cek orientasi saat game mulai
setTimeout(() => {
    const rotatePrompt = document.getElementById('rotate-prompt');
    if (rotatePrompt) {
        const isPortrait = window.innerHeight > window.innerWidth;
        const isMobile = window.innerWidth <= 768;
        if (isMobile && isPortrait) {
            rotatePrompt.classList.remove('hidden');
        }
    }
}, 100);
🥈 Opsi 2 — Dynamic grid dimension (swap cols/rows di portrait)
Ubah grid jadi 9 kolom × 16 baris saat portrait:

js
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Swap grid di mobile portrait biar cocok dengan aspect ratio layar
    const isPortrait = window.innerHeight > window.innerWidth;
    const isMobile = window.innerWidth <= 768;
    
    let cols = 16;
    let rows = 9;
    
    if (isMobile && isPortrait) {
        cols = 9;
        rows = 16;
    }
    
    // Update global
    gridCols = cols;
    gridRows = rows;
    
    const maxGridW = canvas.width * 0.92;
    const maxGridH = canvas.height * 0.72;
    
    cellSize = Math.floor(Math.min(maxGridW / gridCols, maxGridH / gridRows));
    
    offsetX = Math.floor((canvas.width - gridCols * cellSize) / 2);
    offsetY = Math.floor((canvas.height - gridRows * cellSize) / 2) + 20;
    
    // ⚠️ MASALAH: pixelPath dihitung dari gridPath yang cuma valid untuk 16x9
    // Perlu path alternatif untuk portrait
    pixelPath = gridPath.map(pt => ({
        x: offsetX + (pt.x + 0.5) * cellSize,
        y: offsetY + (pt.y + 0.5) * cellSize
    }));
}
Konsekuensi: Grid 9×16 = 144 cell, tapi gridPath cuma pakai koordinat sampai x=15. Kalau grid cuma 9 kolom, path bakal keluar dari grid.

Solusi: Butuh path alternatif untuk portrait:

js
// Path untuk portrait (9 cols × 16 rows)
const gridPathPortrait = [
    {x: 2, y: 0}, {x: 2, y: 4}, {x: 6, y: 4},
    {x: 6, y: 8}, {x: 2, y: 8}, {x: 2, y: 12},
    {x: 7, y: 12}, {x: 7, y: 15}
];
Ribet karena harus redesign path. Skip opsi ini kalau lu nggak mau effort besar.

🥉 Opsi 3 — Zoom-in camera
Bikin grid tetap 16×9 tapi kamera follow player. Jadi grid lebih besar, tapi viewport cuma nampilin sebagian.

Kompleks, butuh rewrite banyak logic. Skip.

🎁 Opsi 4 — HUD Compact (yang tadi gue kasih + rotate prompt)
Gabungan:

Rotate prompt kalau portrait (Opsi 1)

HUD compact CSS untuk landscape mobile

Ini yang paling praktis.

🎯 Rekomendasi Gue
Pakai Opsi 1 — rotate prompt. Alasan:

Nggak ubah gameplay — logic path tetap sama

Nggak ubah kode JS — cuma tambah overlay

Standar industri — hampir semua TD game mobile begitu

10 menit implementasi

Setelah rotate prompt works, baru tambahin HUD compact CSS (yang gue kasih kemarin) biar landscape mobile kelihatan optimal.

📊 Realita mobile game TD
Game	Solusi
Clash of Clans	Portrait, tapi grid dirancang khusus portrait
Bloons TD	Portrait, grid circular
Kingdom Rush	Landscape only
Brawl Stars	Portrait, grid circular
Arknights	Landscape only
Kalau lu nggak mau redesign grid/path, landscape only = pilihan paling masuk akal.