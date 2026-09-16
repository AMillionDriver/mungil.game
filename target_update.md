Bug utama — menu nggak ketutup
Cek startGame() lu sekarang:

js
function startGame() {
    SoundEngine.init();
    dataCores = 250;
    coreHp = 100;
    // ... reset banyak hal ...

    isWaveActive = false;
    gameState = 'PLAYING';
}
Yang ilang (ada di versi lama):

js
document.getElementById('menu-screen').classList.add('hidden');
document.getElementById('gameover-screen').classList.add('hidden');
document.getElementById('hud-top').classList.remove('hidden');
document.getElementById('hud-bottom').classList.remove('hidden');
setupTowerShopUI();
Efeknya: gameState jadi 'PLAYING' (logic jalan), tapi:

Menu overlay masih nutupin layar (z-40)

HUD atas/bawah tetap hidden

Tower shop kosong (nggak di-render)

Kelihatannya "game nggak start", padahal start cuma invisible.

✅ Fix — ganti startGame() dengan ini
js
function startGame() {
    SoundEngine.init();
    dataCores = 250;
    coreHp = 100;
    currentWave = 1;
    score = 0;
    totalKills = 0;
    towers = [];
    enemies = [];
    projectiles = [];
    particles = [];
    floatingTexts = [];

    // Reset DDA state
    DDAController.difficultyScale = 1.0;
    DDAController.initialized = true;
    DDAController.waveStartHp = maxCoreHp;
    DDAController.leaksThisWave = 0;
    DDAController.totalLeaks = 0;
    DDAController.totalDamageTaken = 0;
    DDAController.wavesCleared = 0;
    DDAController.perfectWaves = 0;
    DDAController.strugglingWaves = 0;
    DDAController.lastWaveEndTime = Date.now();

    // ── Kembalikan ini (yang kehapus) ──
    document.getElementById('menu-screen').classList.add('hidden');
    document.getElementById('gameover-screen').classList.add('hidden');
    document.getElementById('hud-top').classList.remove('hidden');
    document.getElementById('hud-bottom').classList.remove('hidden');

    setupTowerShopUI();

    isWaveActive = false;
    gameState = 'PLAYING';
}
🐛 Bug #2 — selector salah di triggerGameOver()
js
const sub = document.getElementById('gameover-[#gameover-subtitle]');
Selector itu salah, harusnya:

js
const sub = document.getElementById('gameover-subtitle');
Nggak bikin game gagal start, tapi bikin error di console pas game over. Fix juga sekalian. Dan sub sebenernya nggak dipakai di code bawahnya, jadi bisa lu hapus aja baris ini kalau males.

🐛 Bug #3 — gerakan enemy double-step
Di Enemy.update() lu, blok ini:

js
if (dist < currentSpeed * gameSpeed * 2) {
    this.x = target.x;
    this.y = target.y;
    this.pathIndex++;

    if (this.pathIndex >= pixelPath.length - 1) {
        // Reached Core
        ...
    } else {
        // ← INI BUG: gerak lagi padahal udah di-snap ke target
        this.x += (dx / dist) * currentSpeed * gameSpeed;
        this.y += (dy / dist) * currentSpeed * gameSpeed;
    }
} else {
    this.x += (dx / dist) * currentSpeed * gameSpeed;
    this.y += (dy / dist) * currentSpeed * gameSpeed;
}
Hapus else di dalam branch pertama, jadiin:

js
if (dist < currentSpeed * gameSpeed * 2) {
    this.x = target.x;
    this.y = target.y;
    this.pathIndex++;

    if (this.pathIndex >= pixelPath.length - 1) {
        // Reached Core — LEAK!
        coreHp -= this.damage;
        DDAController.recordLeak(this.damage);
        createParticles(this.x, this.y, '#ff0055', 12);
        SoundEngine.playExplosion();
        spawnFloatingText(this.x, this.y - 30, `BREACH! -${Math.ceil(this.damage)} HP`, '#ff0055', 18);
        this.markedForDeletion = true;
        if (coreHp <= 0) {
            coreHp = 0;
            triggerGameOver();
        }
    }
} else {
    this.x += (dx / dist) * currentSpeed * gameSpeed;
    this.y += (dy / dist) * currentSpeed * gameSpeed;
}