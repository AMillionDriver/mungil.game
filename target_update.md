Fix agresif untuk landscape mobile. Masalahnya HUD makan 12-15% layar + font kegedean + elemen tumpuk. Gue kasih patch yang compact habis.

📍 Ganti CSS media query landscape
Cari di <style> blok @media (orientation: landscape) and (max-height: 500px), ganti seluruhnya dengan:

css
/* ═══════════════════════════════════════════════════════════════
   LANDSCAPE MOBILE — COMPACT MODE
   HP rebah: HUD jadi thin bar, font kecil, play area max
   ═══════════════════════════════════════════════════════════════ */
@media (orientation: landscape) and (max-height: 500px) {
    
    /* ── HUD: padding minimum ── */
    #hud {
        padding: 4px 6px !important;
    }
    
    /* ── Top bar: horizontal compact, gap kecil ── */
    #hud > div:first-child {
        gap: 6px !important;
        max-width: 100% !important;
        padding: 0 !important;
    }
    
    /* ── HP + XP area: batasi lebar biar gak makan layar ── */
    #hud .flex-1 {
        max-width: 180px !important;
        gap: 2px !important;
    }
    
    /* ── Sembunyiin label panjang (HP SITEM, LEVEL) ── */
    #hud .flex-1 > div:first-child > span:first-child {
        font-size: 8px !important;
        letter-spacing: 0 !important;
    }
    #hud .flex-1 > div:last-child > span:first-child {
        font-size: 8px !important;
        letter-spacing: 0 !important;
    }
    
    /* ── HP/XP bar lebih tipis ── */
    #hud .h-3 { height: 7px !important; }
    #hud .h-2 { height: 4px !important; }
    #hud .mt-1 { margin-top: 1px !important; }
    
    /* ── Angka HP/XP kecil ── */
    #hud .flex-1 .text-xs {
        font-size: 9px !important;
    }
    
    /* ── Kills & Waktu badges: compact ── */
    #hud .glass-panel {
        padding: 3px 8px !important;
        border-radius: 6px !important;
        min-width: 60px !important;
    }
    #hud .glass-panel > div:first-child {
        font-size: 7px !important;
        letter-spacing: 0.5px !important;
    }
    #hud .glass-panel > div:last-child {
        font-size: 13px !important;
        line-height: 1 !important;
    }
    
    /* ── Sound button kecil ── */
    #btn-sound {
        padding: 4px !important;
    }
    #btn-sound svg {
        width: 14px !important;
        height: 14px !important;
    }
    
    /* ── Sembunyiin Dash indicator (info berulang, hemat space) ── */
    #hud > div:nth-child(2) {
        display: none !important;
    }
    
    /* ── Critical mode: compact ── */
    #critical-mode {
        margin-bottom: 4px !important;
        gap: 2px !important;
    }
    #critical-mode > div:first-child {
        font-size: 8px !important;
    }
    #critical-mode > div:nth-child(2) {
        font-size: 10px !important;
    }
    #critical-mode .w-40 { width: 80px !important; }
    
    /* ── Dash button: kecil + posisi pas ── */
    #btn-dash-touch {
        width: 56px !important;
        height: 56px !important;
        font-size: 10px !important;
        bottom: calc(0.75rem + env(safe-area-inset-bottom, 0px)) !important;
        right: calc(0.75rem + env(safe-area-inset-right, 0px)) !important;
        border-width: 2px !important;
    }
    
    /* ── Joystick lebih kecil di landscape ── */
    #joystick-zone {
        width: 100px !important;
        height: 100px !important;
    }
    #joystick-handle {
        width: 42px !important;
        height: 42px !important;
    }
    
    /* ── Menu screen: compact ── */
    #menu-screen {
        padding: 8px !important;
    }
    #menu-screen .max-w-md {
        max-width: 440px !important;
        padding: 14px 18px !important;
        gap: 10px !important;
    }
    #menu-screen h1 {
        font-size: 1.6rem !important;
        margin-bottom: 0 !important;
    }
    #menu-screen h2 {
        font-size: 1.1rem !important;
    }
    #menu-screen p {
        font-size: 11px !important;
        line-height: 1.4 !important;
    }
    #menu-screen .p-4 {
        padding: 6px 10px !important;
    }
    #menu-screen .text-xs {
        font-size: 9px !important;
        line-height: 1.3 !important;
    }
    #menu-screen button {
        padding-top: 10px !important;
        padding-bottom: 10px !important;
        font-size: 14px !important;
    }
    
    /* ── Upgrade screen: cards horizontal ── */
    #upgrade-screen {
        padding: 8px !important;
    }
    #upgrade-screen h2 {
        font-size: 1.4rem !important;
    }
    #upgrade-screen p {
        font-size: 11px !important;
    }
    #upgrade-screen #upgrade-options {
        gap: 8px !important;
        margin-top: 4px !important;
    }
    #upgrade-screen #upgrade-options > div {
        padding: 8px !important;
        border-radius: 10px !important;
    }
    #upgrade-screen #upgrade-options h3 {
        font-size: 11px !important;
        margin-bottom: 2px !important;
    }
    #upgrade-screen #upgrade-options p {
        font-size: 9px !important;
        line-height: 1.2 !important;
    }
    #upgrade-screen #upgrade-options button {
        margin-top: 6px !important;
        padding: 4px !important;
        font-size: 9px !important;
    }
    
    /* ── Game over screen: compact ── */
    #gameover-screen {
        padding: 8px !important;
    }
    #gameover-screen .max-w-md {
        max-width: 380px !important;
        padding: 14px !important;
        gap: 10px !important;
    }
    #gameover-screen h2 {
        font-size: 1.4rem !important;
    }
    #gameover-screen p {
        font-size: 11px !important;
    }
    #gameover-screen .p-4 {
        padding: 8px !important;
        font-size: 11px !important;
    }
    #gameover-screen button {
        padding: 10px !important;
        font-size: 14px !important;
    }
}
📍 Patch JS — Player spawn & bounds aware HUD
Cari di gameLoop() atau startGame() — masalah tambahan: player bisa gerak ke bawah HUD dan jadi ketutup.

Tambahin fungsi helper di JS (setelah resizeCanvas):

javascript
// ── Hitung area playable (bukan ketutup HUD) ──
function getPlayArea() {
    const hudTop = document.getElementById('hud');
    const hudHeight = hudTop ? hudTop.getBoundingClientRect().height : 0;
    
    return {
        minX: 0,
        maxX: canvas.width,
        minY: hudHeight,              // ← jangan masuk area HUD
        maxY: canvas.height,
        centerX: canvas.width / 2,
        centerY: hudHeight + (canvas.height - hudHeight) / 2,
    };
}
Update Player.update() — cari baris:

javascript
// Keep inside world bounds
this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
Ganti jadi:

javascript
// Keep inside PLAYABLE area (exclude HUD)
const playArea = getPlayArea();
this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
this.y = Math.max(playArea.minY + this.radius, Math.min(canvas.height - this.radius, this.y));
Update Player.reset() — cari:

javascript
reset() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    ...
}
Ganti jadi:

javascript
reset() {
    const playArea = getPlayArea();
    this.x = playArea.centerX;
    this.y = playArea.centerY;
    ...
}
🎯 Hasil yang diharapkan
Sebelum	Sesudah
HUD 90px tinggi	HUD ~38px tinggi
Player bisa ke bawah HUD	Player kekunci di area playable
Dash button kepotong	Dash button full visible
Font standard	Font compact 8-14px
Menu overlay kegedean	Menu 440px max width
Area gameplay naik dari ~85% → ~95% dari layar.