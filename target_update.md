Diagnosa cepat: Chapter 1 spawn 9 musuh sekaligus dari semua sisi, sementara attack arc lu cuma ~±72°. Player literally ketar-ketir dari 4 arah, gak bisa cover semua. Bukan DDA yang bikin susah — DDA start dari 1.0x.

🐛 Akar masalah
Masalah	Detail
Spawn bersamaan	6 grunt + 3 shooter = 9 musuh muncul di frame yang sama
Spawn dari 4 sisi	Musuh dari belakang gak ke-cover attack arc
Attack arc sempit	±72° = cuma 144° coverage dari 360°
Zero i-frame	Kena 9 musuh sekaligus → 9×12 = 108 damage → langsung mati
Shooter fire rate	1800ms × 3 shooter = peluru tiap 600ms, belum termasuk spam
🔧 Fix — 5 patch, mulai dari paling impactful
Patch 1 — Post-hit invulnerability (WAJIB)
Cari di Enemy.update(), blok melee:

js
if (!player.isDashing && Date.now() > player.invulnUntil) {
    player.hp -= 12 * player.defenseMult * (this.damageMult || 1);
    createParticles(player.x, player.y, '#ff0055', 6);
    currentCombo = 0;
    if (player.hp <= 0) triggerRevive();
}
Ganti jadi:

js
if (!player.isDashing && Date.now() > player.invulnUntil) {
    player.hp -= 12 * player.defenseMult * (this.damageMult || 1);
    player.invulnUntil = Date.now() + 550;   // ← i-frame 550ms
    createParticles(player.x, player.y, '#ff0055', 6);
    currentCombo = 0;
    if (player.hp <= 0) triggerRevive();
}
Di Bullet.update(), cari:

js
if (!player.isDashing && Date.now() > player.invulnUntil) {
    player.hp -= 10 * player.defenseMult * this.dmgMult;
    currentCombo = 0;
Ganti jadi:

js
if (!player.isDashing && Date.now() > player.invulnUntil) {
    player.hp -= 10 * player.defenseMult * this.dmgMult;
    player.invulnUntil = Date.now() + 550;   // ← i-frame juga
    currentCombo = 0;
Patch 2 — Perluas attack arc
Cari di Player.attack(), blok check enemy:

js
if (Math.abs(normalizeAngle(enemyAngle - this.attackAngle)) < Math.PI / 2.5) {
Ganti jadi:

js
if (Math.abs(normalizeAngle(enemyAngle - this.attackAngle)) < Math.PI / 1.6) {
Math.PI / 2.5 ≈ ±72° → Math.PI / 1.6 ≈ ±112°. Coverage naik dari 144° → 224°.

Cari juga di blok deflect bullet:

js
if (Math.abs(normalizeAngle(bulletAngle - this.attackAngle)) < Math.PI / 2.5) {
Ganti jadi:

js
if (Math.abs(normalizeAngle(bulletAngle - this.attackAngle)) < Math.PI / 1.6) {
Update arc visual di Player.draw():

js
ctx.arc(0, 0, this.attackRange, sweepAngle - 0.4, sweepAngle + 0.4);
Ganti jadi:

js
ctx.arc(0, 0, this.attackRange, sweepAngle - 0.7, sweepAngle + 0.7);
Patch 3 — Gradual spawn system
Cari let enemies = []; (bagian atas), tambahkan di bawahnya:

js
let spawnQueue = [];
let spawnTimer = 0;
let spawnInterval = 1.3;
Cari di startChapterCombat(), blok chapter 1:

js
if (chapter === 1) {
    document.getElementById('chapter-title').innerText = "BAB 1: PELARIAN NETWORK";
    document.getElementById('mission-objective').innerText = "Musnahkan 10 Cyber-Guard Patroli!";
    // Spawn wave 1
    for (let i = 0; i < 6; i++) enemies.push(new Enemy('grunt'));
    for (let i = 0; i < 3; i++) enemies.push(new Enemy('shooter'));
}
Ganti jadi:

js
if (chapter === 1) {
    document.getElementById('chapter-title').innerText = "BAB 1: PELARIAN NETWORK";
    document.getElementById('mission-objective').innerText = "Musnahkan 10 Cyber-Guard Patroli!";
    
    // Queue musuh — spawn bertahap, bukan sekaligus
    spawnQueue = [];
    // 6 grunt + 3 shooter, di-shuffle
    const chapter1Queue = ['grunt','grunt','grunt','grunt','grunt','grunt','shooter','shooter','shooter'];
    chapter1Queue.sort(() => Math.random() - 0.5);
    spawnQueue = chapter1Queue;
    spawnTimer = 0;
    spawnInterval = 1.3;   // 1.3 detik antar spawn
}
Kalau chapter 3 (boss), pastikan queue di-clear:

js
} else if (chapter === 3) {
    document.getElementById('chapter-title').innerText = "BAB 3: PERTEMPURAN BOSS";
    document.getElementById('mission-objective').innerText = "Hancurkan Kairos Mainframe Avatar!";
    document.getElementById('boss-bar-container').classList.remove('hidden');
    spawnQueue = [];   // ← tambah ini
    enemies.push(new Enemy('boss'));
}
Cari di gameLoop(), tepat setelah DDAController.tick(dt, timestamp);:

js
DDAController.tick(dt, timestamp);
updateHUD();
Tambahkan spawn processor sebelum updateHUD():

js
// ── Gradual spawn processor ──
if (spawnQueue.length > 0) {
    spawnTimer += dt;
    if (spawnTimer >= spawnInterval) {
        spawnTimer = 0;
        const type = spawnQueue.shift();
        enemies.push(new Enemy(type));
    }
}
Update progress trigger — cari di gameLoop:

js
if (currentChapter === 1 && enemies.length === 0) {
Ganti jadi (harus tunggu queue juga kosong):

js
if (currentChapter === 1 && enemies.length === 0 && spawnQueue.length === 0) {
Patch 4 — Spawn safety distance
Cari di class Enemy constructor, blok spawn border:

js
if (Math.random() < 0.5) {
    this.x = Math.random() < 0.5 ? -30 : canvas.width + 30;
    this.y = Math.random() * canvas.height;
} else {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() < 0.5 ? -30 : canvas.height + 30;
}
Ganti jadi:

js
// Pilih posisi spawn di border, minimal 280px dari player
let spawned = false;
let attempts = 0;
while (!spawned && attempts < 20) {
    attempts++;
    let sx, sy;
    if (Math.random() < 0.5) {
        sx = Math.random() < 0.5 ? -30 : canvas.width + 30;
        sy = Math.random() * canvas.height;
    } else {
        sx = Math.random() * canvas.width;
        sy = Math.random() < 0.5 ? -30 : canvas.height + 30;
    }
    
    const dist = Math.hypot(sx - player.x, sy - player.y);
    if (dist > 280) {
        this.x = sx;
        this.y = sy;
        spawned = true;
    }
}

// Fallback kalau gagal 20x
if (!spawned) {
    this.x = Math.random() < 0.5 ? -30 : canvas.width + 30;
    this.y = Math.random() * canvas.height;
}
Patch 5 — Nerf musuh Chapter 1
Cari di class Enemy constructor, blok grunt dan shooter:

Grunt:

js
} else { // Melee Grunt
    this.radius = 16;
    this.speed = 2.8 * ddaSpd;
Ganti jadi:

js
} else { // Melee Grunt
    this.radius = 16;
    this.speed = 2.2 * ddaSpd;   // ← 2.8 → 2.2
Shooter:

js
} else if (type === 'shooter') {
    this.radius = 16;
    this.speed = 2.0 * ddaSpd;
    this.maxHp = 50 * ddaHp;
Ganti jadi:

js
} else if (type === 'shooter') {
    this.radius = 16;
    this.speed = 1.6 * ddaSpd;   // ← 2.0 → 1.6
    this.maxHp = 50 * ddaHp;
Fire rate shooter — cari di Enemy.update():

js
if (now - this.lastShot >= 1800) {
Ganti jadi:

js
if (now - this.lastShot >= 2400) {   // ← 1800 → 2400
📊 Hasil yang diharapkan
Aspek	Sebelum	Sesudah
Spawn timing	9 sekaligus	1 setiap 1.3s = ~12s
Attack coverage	144°	224°
Damage burst	108 HP dari 9 hit	Max 12 HP per 550ms
Musuh dekat player	Bisa spawn di samping	Min 280px away
Grunt speed	2.8	2.2
Shooter fire rate	1800ms	2400ms