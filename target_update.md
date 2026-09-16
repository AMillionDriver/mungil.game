ada 1 design flaw yang perlu lu sadari dulu sebelum implementasi:

⚠️ Masalah ekonomi diamond
Kalau diamond cuma dari boss, dan cuma ada 1 boss, maka:

Chapter 1 & 2: lu mati → 0 diamond → nggak bisa revive sama sekali

Chapter 3: lu mati sebelum boss mati → masih 0 diamond

Artinya sistem revive-nya nggak akan kepakai di run pertama. Harus ada sumber diamond tambahan.

💡 Solusi desain yang gue sarankan
Sumber	Jumlah	Kapan
Starter	5 💎	Pas mulai game
Boss damage milestone	+3 💎	Tiap kali boss HP turun ke 75% / 50% / 25%
Boss kill	+15 💎	Setelah boss mati (bonus for next run)
Revive cost	3, 5, 7, 9...	Naik tiap revive
Jadi di boss fight, lu udah punya 5 + 9 = 14 💎 — cukup buat 2-3 revive. Ini bikin mechanic-nya beneran kerasa.

Kalau lu setuju, ini implementasinya.

📍 SECTION 1 — HTML (tambah 2 elemen)
1a. Diamond counter di HUD
Cari di hud-combat blok ini (Combo counter):

html
<div class="glass-panel px-4 py-3 rounded-2xl text-center min-w-[100px]">
    <div class="text-[10px] font-orbitron text-pink-400 font-bold tracking-wider">COMBO</div>
    <div id="combo-count" class="text-2xl font-black font-orbitron text-pink-500 neon-text-pink">0x</div>
</div>
Tambahkan SEBELUM blok itu:

html
<div class="glass-panel px-4 py-3 rounded-2xl text-center min-w-[100px]">
    <div class="text-[10px] font-orbitron text-cyan-400 font-bold tracking-wider">💎 DIAMOND</div>
    <div id="diamond-count-hud" class="text-2xl font-black font-orbitron text-cyan-300 neon-text-cyan">5</div>
</div>
1b. Revive overlay
Cari <!-- Game Over Screen --> (atau <div id="gameover-screen"). Tambahkan SEBELUM elemen itu:

html
<!-- Revive Overlay -->
<div id="revive-overlay" class="absolute inset-0 z-50 flex items-center justify-center bg-red-950/70 backdrop-blur-md p-4 hidden">
    <div class="glass-panel max-w-md w-full rounded-3xl p-8 border-2 border-red-500/80 text-center flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(255,0,85,0.5)]">
        <div>
            <div class="text-xs font-orbitron text-red-400 tracking-widest font-black">⚠️ CRITICAL SIGNAL LOSS</div>
            <h2 class="text-3xl font-black font-orbitron text-red-500 neon-text-pink mt-2">SISTEM KRITIS</h2>
            <p class="text-gray-300 text-sm mt-2">VEX-09 kehilangan integritas. Revive untuk lanjut bertempur?</p>
        </div>

        <div class="w-full bg-gray-950 rounded-2xl p-4 border border-cyan-500/40">
            <div class="flex justify-between items-center">
                <div class="text-left">
                    <div class="text-[10px] font-orbitron text-cyan-400 tracking-wider">DIAMOND</div>
                    <div id="revive-diamond-count" class="text-2xl font-black font-orbitron text-cyan-300">💎 5</div>
                </div>
                <div class="text-right">
                    <div class="text-[10px] font-orbitron text-pink-400 tracking-wider">BIAYA REVIVE</div>
                    <div id="revive-cost-display" class="text-2xl font-black font-orbitron text-pink-500">💎 3</div>
                </div>
            </div>
        </div>

        <div class="w-full flex flex-col gap-2">
            <button id="btn-revive" class="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-orbitron font-black text-sm tracking-wider hover:brightness-110 active:scale-95 transition shadow-[0_0_25px_rgba(0,243,255,0.6)]">
                ⚡ REVIVE (3 💎)
            </button>
            <button id="btn-give-up" class="w-full py-3 rounded-2xl bg-red-950/80 border border-red-500/50 text-red-400 font-orbitron font-bold text-xs hover:bg-red-900/80 transition">
                MENYERAH
            </button>
        </div>
    </div>
</div>
📍 SECTION 2 — JavaScript
2a. State diamond & revive
Cari let currentChapter = 1;. Tambahkan di bawahnya:

js
// ═══════════════════════════════════════════════════════════
// DIAMOND & REVIVE SYSTEM
// ═══════════════════════════════════════════════════════════
let diamonds = 5;
let reviveCount = 0;
let isReviving = false;
const REVIVE_BASE_COST = 3;
const REVIVE_COST_INCREMENT = 2;

function getReviveCost() {
    return REVIVE_BASE_COST + reviveCount * REVIVE_COST_INCREMENT;
}

function addDiamonds(amount) {
    diamonds += amount;
    const el = document.getElementById('diamond-count-hud');
    if (el) el.innerText = diamonds;
}

function updateDiamondHUD() {
    const el = document.getElementById('diamond-count-hud');
    if (el) el.innerText = diamonds;
}

// ═══════════════════════════════════════════════════════════
// FLOATING TEXT SYSTEM
// ═══════════════════════════════════════════════════════════
let floatingTexts = [];

class FloatingText {
    constructor(x, y, text, color = '#00f3ff', size = 22) {
        this.x = x; this.y = y;
        this.text = text; this.color = color; this.size = size;
        this.life = 1.5; this.maxLife = 1.5;
        this.vy = -1.2;
        this.markedForDeletion = false;
    }
    update(dt) {
        this.y += this.vy;
        this.vy *= 0.97;
        this.life -= dt;
        if (this.life <= 0) this.markedForDeletion = true;
    }
    draw() {
        const t = this.life / this.maxLife;
        ctx.save();
        ctx.globalAlpha = Math.min(1, t * 2);
        ctx.font = `bold ${this.size}px Orbitron`;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = this.color;
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

function spawnFloatingText(x, y, text, color, size = 22) {
    floatingTexts.push(new FloatingText(x, y, text, color, size));
}
2b. Update Player class — invulnerability
Cari class Player {. Di dalam constructor(), tambahkan:

js
this.invulnUntil = 0;
Di reset(), tambahkan:

js
this.invulnUntil = 0;
2c. Update Enemy class — boss drop diamond
Cari class Enemy {. Di dalam constructor(), bagian if (type === 'boss') { ... }, tambahkan:

js
this.diamondMilestones = [0.75, 0.50, 0.25];
this.givenMilestones = new Set();
Cari method takeDamage(amount) di dalam Enemy. Ganti jadi:

js
takeDamage(amount) {
    this.hp -= amount;
    createParticles(this.x, this.y, this.color, 5);

    // Boss diamond milestones
    if (this.type === 'boss') {
        const hpPct = this.hp / this.maxHp;
        this.diamondMilestones.forEach(m => {
            if (hpPct <= m && !this.givenMilestones.has(m) && this.hp > 0) {
                this.givenMilestones.add(m);
                addDiamonds(3);
                spawnFloatingText(this.x, this.y - 40, '+3 💎', '#00f3ff', 26);
                SoundEngine.playHackSuccess();
            }
        });
    }

    if (this.hp <= 0 && !this.markedForDeletion) {
        this.markedForDeletion = true;
        killCount++;
        SoundEngine.playExplosion();
        createParticles(this.x, this.y, this.color, 15);

        if (this.type === 'boss') {
            addDiamonds(15);
            spawnFloatingText(this.x, this.y - 20, '+15 💎 BOSS REWARD', '#ffb700', 28);
        }
    }
}
2d. Ganti panggilan triggerGameOver()
Di Enemy.update() dan Bullet.update(), cari:

js
if (player.hp <= 0) triggerGameOver();
Ganti jadi:

js
if (player.hp <= 0) triggerRevive();
2e. Tambahkan triggerRevive(), performRevive(), giveUp()
Tambahkan setelah triggerGameOver() function:

js
function triggerRevive() {
    if (isReviving) return;
    if (gameState !== 'COMBAT') return;
    isReviving = true;

    // Pause combat
    gameState = 'REVIVE';

    const cost = getReviveCost();
    document.getElementById('revive-diamond-count').innerText = `💎 ${diamonds}`;
    document.getElementById('revive-cost-display').innerText = `💎 ${cost}`;

    const reviveBtn = document.getElementById('btn-revive');
    if (diamonds >= cost) {
        reviveBtn.disabled = false;
        reviveBtn.className = "w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-orbitron font-black text-sm tracking-wider hover:brightness-110 active:scale-95 transition shadow-[0_0_25px_rgba(0,243,255,0.6)]";
        reviveBtn.innerText = `⚡ REVIVE (${cost} 💎)`;
    } else {
        reviveBtn.disabled = true;
        reviveBtn.className = "w-full py-4 rounded-2xl bg-gray-800 text-gray-500 font-orbitron font-black text-sm tracking-wider cursor-not-allowed opacity-50";
        reviveBtn.innerText = `💎 DIAMOND KURANG (butuh ${cost})`;
    }

    document.getElementById('revive-overlay').classList.remove('hidden');
    document.getElementById('hud-combat').classList.add('hidden');
    document.getElementById('touch-controls').classList.add('hidden');
}

function performRevive() {
    const cost = getReviveCost();
    if (diamonds < cost) return;

    diamonds -= cost;
    reviveCount++;
    isReviving = false;

    // Restore player
    player.hp = player.maxHp * 0.6;
    player.energy = 100;

    // Shockwave — bunuh musuh sekitar, stun boss
    const shockwaveRadius = 280;
    enemies.forEach(e => {
        const d = Math.hypot(e.x - player.x, e.y - player.y);
        if (d < shockwaveRadius) {
            if (e.type === 'boss') {
                e.takeDamage(80);
            } else {
                e.takeDamage(9999);
            }
        }
    });

    // Clear enemy bullets
    bullets.forEach(b => {
        if (!b.isPlayerBullet) b.markedForDeletion = true;
    });

    // Visual FX
    createParticles(player.x, player.y, '#00f3ff', 50);
    createParticles(player.x, player.y, '#ff0055', 40);
    SoundEngine.playHackSuccess();
    spawnFloatingText(player.x, player.y - 50, '⚡ REVIVED!', '#00f3ff', 32);

    // 2.5s invulnerability
    player.invulnUntil = Date.now() + 2500;

    // Restore UI
    document.getElementById('revive-overlay').classList.add('hidden');
    document.getElementById('hud-combat').classList.remove('hidden');
    if (isTouchDevice) document.getElementById('touch-controls').classList.remove('hidden');

    updateDiamondHUD();
    gameState = 'COMBAT';
}

function giveUp() {
    isReviving = false;
    document.getElementById('revive-overlay').classList.add('hidden');
    triggerGameOver();
}
2f. Update damage code — hormati invulnerability
Di Enemy.update() untuk melee:

js
if (!player.isDashing) {
    player.hp -= 12 * player.defenseMult;
Ganti jadi:

js
if (!player.isDashing && Date.now() > player.invulnUntil) {
    player.hp -= 12 * player.defenseMult;
Di Bullet.update():

js
if (!player.isDashing) {
    player.hp -= 10 * player.defenseMult;
Ganti jadi:

js
if (!player.isDashing && Date.now() > player.invulnUntil) {
    player.hp -= 10 * player.defenseMult;
2g. Update gameLoop untuk floating text
Cari di gameLoop():

js
particles.forEach(p => p.update(dt));
Tambahkan setelahnya:

js
floatingTexts.forEach(ft => ft.update(dt));
Cari:

js
particles = particles.filter(p => !p.markedForDeletion);
Tambahkan setelahnya:

js
floatingTexts = floatingTexts.filter(ft => !ft.markedForDeletion);
Cari di bagian render:

js
particles.forEach(p => p.draw());
Tambahkan setelahnya:

js
floatingTexts.forEach(ft => ft.draw());
2h. Update startGame()
Cari function startGame() {. Tambahkan di dalamnya:

js
diamonds = 5;
reviveCount = 0;
isReviving = false;
floatingTexts = [];
updateDiamondHUD();
2i. Register button handlers
Cari document.getElementById('btn-restart').onclick = startGame;. Tambahkan di bawahnya:

js
document.getElementById('btn-revive').onclick = performRevive;
document.getElementById('btn-give-up').onclick = giveUp;