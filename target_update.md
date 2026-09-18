Ketemu BUG FATAL-nya. Player gak muncul karena getPlayArea() return tinggi HUD yang salah — HUD pakai inset-0 (full screen), jadi minY = canvas.height → player di-spawn di bawah layar. Suara ada karena logic jalan, tapi entity-nya di luar viewport.

🐛 Bug #1 — Player di bawah layar (CRITICAL)
Root cause:

js
const hudTop = document.getElementById('hud');
const hudHeight = hudTop ? hudTop.getBoundingClientRect().height : 0;
// ← #hud pakai "absolute inset-0" = FULL SCREEN
// ← jadi hudHeight = canvas.height, BUKAN tinggi konten HUD
// → minY = canvas.height → player spawned di y = canvas.height + 16
Fix — ganti getPlayArea():

javascript
// ── Hitung area playable (bukan ketutup HUD) ──
function getPlayArea() {
    const hudEl = document.getElementById('hud');
    
    // Kalau HUD hidden (menu screen), return full canvas
    if (!hudEl || hudEl.classList.contains('hidden')) {
        return {
            minX: 0, maxX: canvas.width,
            minY: 0, maxY: canvas.height,
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
        };
    }
    
    // Ambil tinggi TOP BAR aja (child pertama dari #hud)
    const topBar = hudEl.firstElementChild;
    const topBarHeight = topBar ? topBar.getBoundingClientRect().height : 0;
    
    // Ambil tinggi BOTTOM section (dash indicator)
    const bottomBar = hudEl.children[1];
    const bottomBarHeight = bottomBar ? bottomBar.getBoundingClientRect().height : 0;
    
    const safeTop = topBarHeight + 8;      // +8 padding
    const safeBottom = bottomBarHeight + 8;
    
    return {
        minX: 0,
        maxX: canvas.width,
        minY: safeTop,
        maxY: canvas.height - safeBottom,
        centerX: canvas.width / 2,
        centerY: (safeTop + (canvas.height - safeBottom)) / 2,
    };
}
Juga fix Player.reset() — panggil getPlayArea setelah HUD muncul:

javascript
reset() {
    // Paksa HUD muncul dulu biar tinggi top bar kehitung
    const hud = document.getElementById('hud');
    const wasHidden = hud.classList.contains('hidden');
    if (wasHidden) hud.classList.remove('hidden');
    
    const playArea = getPlayArea();
    
    if (wasHidden) hud.classList.add('hidden');
    
    this.x = playArea.centerX;
    this.y = playArea.centerY;
    // ... sisanya sama
}
Dan di Player.update() — ganti clamp:

javascript
// Keep inside PLAYABLE area (exclude HUD)
const playArea = getPlayArea();
this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
this.y = Math.max(playArea.minY + this.radius, Math.min(canvas.height - this.radius, this.y));
🐛 Bug #2 — HUD landscape spread out (jelek)
Root cause: justify-between + max-w-4xl mx-auto bikin elemen spread jauh di landscape.

Fix — tambah di media query landscape:

css
/* ── HUD TOP BAR: ubah dari justify-between jadi rapet ── */
#hud > div:first-child {
    justify-content: center !important;
    gap: 8px !important;
    max-width: 100% !important;
    flex-wrap: nowrap !important;
}
🐛 Bug #3 — Tombol DASH tenggelam (landscape + Chrome grub bar)
Root cause: env(safe-area-inset-bottom) = 0 di Chrome tab biasa. Chrome bottom bar nutupin tombol.

Fix — hardcode offset lebih tinggi di landscape:

css
/* ── Dash button: hardcoded offset, jangan andalkan safe-area ── */
#btn-dash-touch {
    bottom: 80px !important;
    right: 16px !important;
}

@media (orientation: landscape) and (max-height: 500px) {
    #btn-dash-touch {
        width: 60px !important;
        height: 60px !important;
        font-size: 10px !important;
        bottom: 70px !important;     /* ← hardcoded, aman dari Chrome bottom bar */
        right: 16px !important;
    }
}

@media (max-width: 500px) and (orientation: portrait) {
    #btn-dash-touch {
        bottom: 120px !important;    /* ← portrait: tinggi biar lewat Chrome bottom bar */
        right: 20px !important;
    }
}
🐛 Bug #4 — UI landscape di atas nutupin play area
Fix — batasi lebar HP/XP lebih kecil di landscape:

css
@media (orientation: landscape) and (max-height: 500px) {
    #hud .flex-1 {
        max-width: 140px !important;   /* dari 180px → 140px */
    }
    #hud .glass-panel {
        min-width: 50px !important;    /* dari 60px → 50px */
    }
    #hud .glass-panel > div:last-child {
        font-size: 12px !important;    /* dari 13px → 12px */
    }
}
📋 Patch lengkap — copy-paste semua
1️⃣ CSS — ganti blok landscape + mobile query
css
/* ── Safe Area: DEFAULT (portrait) ── */
#btn-dash-touch {
    bottom: 120px !important;
    right: 20px !important;
}

/* ═══════════════════════════════════════════════════════════════
   LANDSCAPE MOBILE — COMPACT MODE
   ═══════════════════════════════════════════════════════════════ */
@media (orientation: landscape) and (max-height: 500px) {
    /* ── HUD padding minimal ── */
    #hud {
        padding: 4px 8px !important;
    }
    
    /* ── TOP BAR: rapet ke tengah, gak spread ── */
    #hud > div:first-child {
        justify-content: center !important;
        gap: 8px !important;
        max-width: 100% !important;
        flex-wrap: nowrap !important;
    }
    
    /* ── HP/XP area: kecilin ── */
    #hud .flex-1 {
        max-width: 130px !important;
        gap: 1px !important;
    }
    
    /* ── Label kecil ── */
    #hud .flex-1 > div:first-child > span:first-child,
    #hud .flex-1 > div:last-child > span:first-child {
        font-size: 7px !important;
        letter-spacing: 0 !important;
    }
    
    /* ── Bar tipis ── */
    #hud .h-3 { height: 6px !important; }
    #hud .h-2 { height: 4px !important; }
    #hud .mt-1 { margin-top: 1px !important; }
    #hud .flex-1 .text-xs { font-size: 8px !important; }
    
    /* ── Kills/Waktu badges ── */
    #hud .glass-panel {
        padding: 2px 6px !important;
        border-radius: 6px !important;
        min-width: 48px !important;
    }
    #hud .glass-panel > div:first-child {
        font-size: 7px !important;
    }
    #hud .glass-panel > div:last-child {
        font-size: 12px !important;
        line-height: 1 !important;
    }
    
    /* ── Sound button ── */
    #btn-sound {
        padding: 4px !important;
    }
    #btn-sound svg {
        width: 14px !important;
        height: 14px !important;
    }
    
    /* ── Sembunyiin dash indicator ── */
    #hud > div:nth-child(2) {
        display: none !important;
    }
    
    /* ── Critical mode compact ── */
    #critical-mode {
        margin-bottom: 2px !important;
        gap: 2px !important;
    }
    #critical-mode > div:first-child { font-size: 7px !important; }
    #critical-mode > div:nth-child(2) { font-size: 9px !important; }
    #critical-mode .w-40 { width: 60px !important; }
    
    /* ── Dash button: 70px dari bawah (aman dari Chrome bottom bar) ── */
    #btn-dash-touch {
        width: 60px !important;
        height: 60px !important;
        font-size: 10px !important;
        bottom: 70px !important;
        right: 16px !important;
        border-width: 2px !important;
    }
    
    /* ── Joystick compact ── */
    #joystick-zone {
        width: 100px !important;
        height: 100px !important;
    }
    #joystick-handle {
        width: 42px !important;
        height: 42px !important;
    }
    
    /* ── Menu / Upgrade / GameOver compact ── */
    #menu-screen, #upgrade-screen, #gameover-screen {
        padding: 8px !important;
    }
    #menu-screen .max-w-md {
        max-width: 500px !important;
        padding: 12px 16px !important;
        gap: 8px !important;
    }
    #menu-screen h1 { font-size: 1.4rem !important; }
    #menu-screen h2 { font-size: 1rem !important; }
    #menu-screen p { font-size: 10px !important; line-height: 1.3 !important; }
    #menu-screen .p-4 { padding: 5px 8px !important; }
    #menu-screen .text-xs { font-size: 8px !important; line-height: 1.2 !important; }
    #menu-screen button {
        padding-top: 8px !important;
        padding-bottom: 8px !important;
        font-size: 13px !important;
    }
    
    #upgrade-screen h2 { font-size: 1.2rem !important; }
    #upgrade-screen p { font-size: 10px !important; }
    #upgrade-screen #upgrade-options {
        gap: 6px !important;
        margin-top: 2px !important;
    }
    #upgrade-screen #upgrade-options > div {
        padding: 6px !important;
        border-radius: 8px !important;
    }
    #upgrade-screen #upgrade-options h3 { font-size: 10px !important; }
    #upgrade-screen #upgrade-options p { font-size: 8px !important; }
    #upgrade-screen #upgrade-options button {
        margin-top: 4px !important;
        padding: 3px !important;
        font-size: 8px !important;
    }
    
    #gameover-screen .max-w-md {
        max-width: 380px !important;
        padding: 12px !important;
        gap: 8px !important;
    }
    #gameover-screen h2 { font-size: 1.2rem !important; }
    #gameover-screen p { font-size: 10px !important; }
    #gameover-screen .p-4 { padding: 6px !important; font-size: 10px !important; }
    #gameover-screen button { padding: 8px !important; font-size: 12px !important; }
}

/* ── Portrait mobile ── */
@media (max-width: 500px) and (orientation: portrait) {
    #btn-dash-touch {
        bottom: 120px !important;
        right: 20px !important;
    }
}
2️⃣ JS — ganti getPlayArea()
javascript
// ── Hitung area playable (bukan ketutup HUD) ──
function getPlayArea() {
    const hudEl = document.getElementById('hud');
    
    if (!hudEl || hudEl.classList.contains('hidden')) {
        return {
            minX: 0, maxX: canvas.width,
            minY: 0, maxY: canvas.height,
            centerX: canvas.width / 2,
            centerY: canvas.height / 2,
        };
    }
    
    // Tinggi top bar (bukan #hud yang full screen!)
    const topBar = hudEl.firstElementChild;
    const topBarHeight = topBar ? topBar.getBoundingClientRect().height : 0;
    
    // Tinggi bottom section (dash indicator)
    const bottomBar = hudEl.children[1];
    const bottomBarHeight = bottomBar ? bottomBar.getBoundingClientRect().height : 0;
    
    const safeTop = topBarHeight + 8;
    const safeBottom = bottomBarHeight + 8;
    
    return {
        minX: 0,
        maxX: canvas.width,
        minY: safeTop,
        maxY: canvas.height - safeBottom,
        centerX: canvas.width / 2,
        centerY: (safeTop + (canvas.height - safeBottom)) / 2,
    };
}
3️⃣ JS — ganti Player.reset() supaya panggil playArea dengan HUD visible
javascript
reset() {
    // Paksa HUD muncul sebentar biar tinggi top bar kehitung
    const hud = document.getElementById('hud');
    const wasHidden = hud.classList.contains('hidden');
    if (wasHidden) {
        hud.classList.remove('hidden');
        hud.style.visibility = 'hidden'; // invisible tapi tetap terukur
    }
    
    const playArea = getPlayArea();
    
    if (wasHidden) {
        hud.classList.add('hidden');
        hud.style.visibility = '';
    }
    
    this.x = playArea.centerX;
    this.y = playArea.centerY;
    this.hp = 100;
    this.maxHp = 100;
    this.level = 1;
    this.xp = 0;
    this.nextXp = 50;
    this.fireRate = 250;
    this.bulletDamage = 25;
    this.bulletCount = 1;
    this.orbsCount = 0;
    this.speed = 4;
    this.lastShot = 0;
    this.lastDash = 0;
}
🧪 Test setelah fix
Hard refresh di HP (Ctrl+Shift+R atau clear cache di Chrome)

Portrait:

✅ Player muncul di tengah

✅ Proyektil keliatan

✅ Tombol DASH di atas Chrome bottom bar

Landscape:

✅ HUD rapet (bukan spread out)

✅ Player muncul

✅ Tombol DASH gak tenggelam

Buka via grub Chrome:

✅ Tombol DASH masih keliatan (karena offset 120px)

📌 TL;DR
Bug	Root cause	Fix
Player gak muncul	#hud pakai inset-0 → minY = canvas.height	Pakai firstElementChild bbox
UI landscape spread out	justify-between	justify-center gap-8
Tombol DASH tenggelam	env(safe-area-inset-bottom) = 0 di Chrome tab	Hardcode bottom: 70px / 120px
Suara ada, visual tidak	Player di bawah layar	Fixed sama bug #1