Ketemu bug-nya. Ini bukan soal kodenya salah, tapi soal event bubbling di elemen yang pointer-events: none.

🔍 Akar masalah
Cek struktur HTML:

html
<div id="touch-controls" class="... pointer-events-none ...">
    <div id="joystick-zone" class="... pointer-events-none ...">...</div>
    <button id="btn-dash-touch" class="... pointer-events-auto ...">DASH</button>
</div>
touch-controls punya pointer-events: none — artinya elemen ini tidak menerima event pointer sama sekali.

Tapi di JS, lu attach listener ke situ:

javascript
touchControls.addEventListener('touchstart', ...)  // ← gak pernah kepanggil!
Event handler lu di-attach ke elemen yang tidak pernah nerima touch → handler-nya nggak akan jalan.

Analogi: Lu taruh kotak surat di dalam ruangan yang pintunya ditutup rapat — surat nggak akan pernah masuk.

✅ Fix — Attach ke document, bukan touchControls
Kenapa document? Karena document selalu nerima semua touch, terlepas dari pointer-events di elemen atasnya.

Ganti 3 blok event listener
Cari di JS, ganti dari touchControls.addEventListener jadi document.addEventListener:

javascript
// ── Event: touchstart di area mana aja ──
document.addEventListener('touchstart', (e) => {
    if (gameState !== 'PLAYING') return;
    
    const touch = e.changedTouches[0];
    const touchX = touch.clientX;
    const touchY = touch.clientY;
    
    // Skip kalau user tap di tombol dash
    if (e.target.closest('#btn-dash-touch')) return;
    
    // Skip kalau user tap di UI element lain (menu, dll)
    const uiElements = ['btn-sound', 'btn-start', 'btn-restart'];
    for (const id of uiElements) {
        if (e.target.closest('#' + id)) return;
    }
    
    // Kalau di area joystick + belum ada joystick aktif
    if (isInJoystickArea(touchX, touchY) && !joystick.active) {
        e.preventDefault();
        joystick.pointerId = touch.identifier;
        showJoystickAt(touchX, touchY);
    }
}, { passive: false });


// ── Event: touchmove ──
document.addEventListener('touchmove', (e) => {
    if (!joystick.active) return;
    
    let touch = null;
    for (const t of e.changedTouches) {
        if (t.identifier === joystick.pointerId) {
            touch = t;
            break;
        }
    }
    if (!touch) return;
    
    e.preventDefault();
    
    let dx = touch.clientX - joystick.startX;
    let dy = touch.clientY - joystick.startY;
    let dist = Math.hypot(dx, dy);
    const maxRadius = 50;
    
    if (dist > maxRadius) {
        dx = (dx / dist) * maxRadius;
        dy = (dy / dist) * maxRadius;
        dist = maxRadius;
    }
    
    joystick.dx = dx / maxRadius;
    joystick.dy = dy / maxRadius;
    joystick.dist = dist;
    
    joystickHandle.style.transform = `translate(${dx}px, ${dy}px)`;
}, { passive: false });


// ── Event: touchend ──
const handleJoystickEnd = (e) => {
    if (!joystick.active) return;
    for (const t of e.changedTouches) {
        if (t.identifier === joystick.pointerId) {
            hideJoystick();
            return;
        }
    }
};

document.addEventListener('touchend', handleJoystickEnd);
document.addEventListener('touchcancel', handleJoystickEnd);
Yang berubah:

touchControls.addEventListener → document.addEventListener (3 tempat)

Tambah cek e.target.closest('#btn-dash-touch') — skip kalau touch di tombol dash

Tambah cek UI elements lain (btn-sound, dll) — skip kalau di tombol

🎯 Kenapa fix ini works
Layer	Sebelum	Sesudah
Event source	touchControls (pointer-events: none)	document (selalu aktif)
Event ke-fire?	❌ Gak pernah	✅ Selalu
Cek area	isInJoystickArea	Sama
Skip tombol dash	Manual	closest('#btn-dash-touch')