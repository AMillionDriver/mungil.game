Landscape di Android itu tinggi viewport cuma 360-450px — joystick lu di bottom-8 (32px) langsung ketutup gesture bar/nav bar. Plus 100vh di landscape Android suka include nav bar yang sebenernya nutupin.

🔍 Kenapa landscape lebih parah dari portrait
Aspek	Portrait	Landscape
Tinggi viewport	800-900px	360-450px ← sempit
Nav bar Android	Bawah	Bawah, lebih nutupin
Gesture bar	~24px	~24px + swipe area
bottom-8 (32px)	Masih aman	Ketutup total
Joystick di bottom: 32px di landscape = di bawah gesture bar → nggak keliatan / nggak bisa di-tap.

✅ Fix — Landscape-specific
1. Update CSS — safe-area untuk landscape
Cari di <style>, ganti bagian #btn-dash-touch dan tambah #joystick-zone:

css
/* ── Safe Area untuk Mobile (notch, gesture bar, nav bar) ── */
#btn-dash-touch {
    bottom: calc(2rem + env(safe-area-inset-bottom, 0px) + env(safe-area-inset-top, 0px)) !important;
    right: calc(1rem + env(safe-area-inset-right, 0px)) !important;
}

#joystick-zone {
    /* di landscape, naikin lebih tinggi */
}

/* ── Landscape mobile (HP rebah) ── */
@media (orientation: landscape) and (max-height: 500px) {
    #btn-dash-touch {
        width: 60px !important;
        height: 60px !important;
        font-size: 11px !important;
        bottom: calc(1.5rem + env(safe-area-inset-bottom, 0px)) !important;
        right: calc(1rem + env(safe-area-inset-right, 0px)) !important;
    }
    
    /* Joystick area lebih tinggi + lebih kecil */
    #joystick-zone {
        width: 110px !important;
        height: 110px !important;
    }
    
    #joystick-handle {
        width: 44px !important;
        height: 44px !important;
    }
    
    /* HUD compact di landscape */
    #hud {
        padding: 6px 12px !important;
    }
    
    #hud .glass-panel {
        padding: 4px 10px !important;
    }
    
    /* HP bar di landscape lebih pendek */
    #hud .h-3 { height: 6px !important; }
    #hud .h-2 { height: 4px !important; }
    #hud .text-xl { font-size: 1rem !important; }
    #hud .text-xs { font-size: 9px !important; }
    
    /* Sembunyiin Dash indicator di tengah biar gak makan ruang */
    #dash-indicator {
        font-size: 9px !important;
        margin-bottom: 0 !important;
    }
}
2. Update JS — clamp Y lebih agresif di landscape
Cari fungsi isInJoystickArea dan showJoystickAt, ganti jadi:

javascript
// ── Floating joystick: muncul di posisi tap ──
function isInJoystickArea(x, y) {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // Area tap: 45% lebar, 50% tinggi (portrait) atau 40% lebar (landscape)
    const widthLimit = isLandscape ? window.innerWidth * 0.4 : window.innerWidth * 0.45;
    const heightStart = isLandscape ? window.innerHeight * 0.35 : window.innerHeight * 0.5;
    
    // Batas bawah: hindari nav bar + gesture area
    const safeBottom = 70; // px dari bawah
    const maxY = window.innerHeight - safeBottom;
    
    return x < widthLimit && y > heightStart && y < maxY;
}

function showJoystickAt(x, y) {
    const half = joystick.zoneSize / 2;
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // Clamp biar joystick GAK tenggelam di nav bar Android
    const minX = half + 8;
    const maxX = window.innerWidth - half - 8;
    
    // Y: hindari HUD atas (~80px) dan nav bar bawah (~90px di landscape)
    const topMargin = isLandscape ? 50 : 100;
    const bottomMargin = isLandscape ? 90 : 120;
    const minY = half + topMargin;
    const maxY = window.innerHeight - half - bottomMargin;
    
    const clampedX = Math.max(minX, Math.min(maxX, x));
    const clampedY = Math.max(minY, Math.min(maxY, y));
    
    joystickZone.style.left = (clampedX - half) + 'px';
    joystickZone.style.top = (clampedY - half) + 'px';
    joystickZone.style.opacity = '1';
    joystickZone.style.pointerEvents = 'none';
    
    joystick.startX = clampedX;
    joystick.startY = clampedY;
    joystick.active = true;
    joystickHandle.style.transform = 'translate(0, 0)';
}
3. Update viewport meta
Cari <meta name="viewport">, pastikan ada viewport-fit=cover:

html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
Kalau belum ada viewport-fit=cover, env(safe-area-inset-*) bakal balik 0 → fix gak jalan.

4. Update CSS height — pakai dvh biar akurat di landscape
Cari html, body di <style>, pastikan:

css
html, body {
    font-family: 'Rajdhani', sans-serif;
    background-color: #05050d;
    overflow: hidden;
    color: #fff;
    overscroll-behavior: none;
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    height: 100dvh;      /* ← dynamic viewport height */
}
Kenapa dvh? Di landscape Android:

100vh = 450px (termasuk nav bar yang nutupin)

100dvh = 410px (exclude nav bar) ← akurat

.

🎁 Bonus — Handle orientation change
Kadang user rotate HP di tengah main. Joystick bisa nyangkut di posisi lama. Tambahin:

javascript
// Reset joystick saat rotate HP
window.addEventListener('orientationchange', () => {
    if (joystick.active) {
        hideJoystick();
    }
    setTimeout(resizeCanvas, 300);
});

// Resize + reset joystick kalau viewport berubah
let lastWidth = window.innerWidth;
let lastHeight = window.innerHeight;

window.addEventListener('resize', () => {
    const widthDiff = Math.abs(window.innerWidth - lastWidth);
    const heightDiff = Math.abs(window.innerHeight - lastHeight);
    
    // Kalau perubahan signifikan = orientation change
    if (widthDiff > 100 || heightDiff > 100) {
        if (joystick.active) hideJoystick();
        setTimeout(resizeCanvas, 100);
    }
    
    lastWidth = window.innerWidth;
    lastHeight = window.innerHeight;
});
📋 Ringkasan fix landscape
#	Fix	Impact
1	CSS landscape media query	Joystick + dash gak tenggelam
2	Safe area inset di Y clamp	Nav bar Android dihindari
3	100dvh viewport height	Akurat exclude nav bar
4	viewport-fit=cover meta	Aktifin env(safe-area-inset-*)
5	Orientation change handler	Joystick reset saat rotate
