Masalah dengan versi sekarang
Garis lurus — nggak keliatan kayak petir

ctx.shadowBlur per beam — ini biang keroknya. shadowBlur itu operasi paling mahal di canvas. Kalau 20 beam sekaligus, FPS drop drastis

Nggak ada life-cycle animasi — cuma diem terus hilang

Bikin beam baru tiap shot — 3 tower × 3 target = 9 beam per fire cycle, numpuk

Fix: replace LightningBeam class
Ganti class LightningBeam yang sekarang dengan versi ini:

js
class LightningBeam {
    constructor(x1, y1, x2, y2, color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
        this.life = 0.18;        // umur total
        this.maxLife = 0.18;
        this.markedForDeletion = false;

        // Segmen zigzag — cached, di-regenerate berkala (bukan tiap frame)
        this.segments = [];
        this.lastRegen = 0;
        this.regenInterval = 0.055;  // ~18x/detik, kerasa flicker tapi hemat

        // Pre-compute direction & length untuk generate zigzag
        const dx = x2 - x1;
        const dy = y2 - y1;
        this.dx = dx;
        this.dy = dy;
        this.length = Math.hypot(dx, dy) || 1;
        this.nx = -dy / this.length;  // normal vektor (tegak lurus)
        this.ny =  dx / this.length;

        // Random seed untuk tampilan berbeda tiap beam
        this.seed = Math.random();

        this.regenerate();
    }

    regenerate() {
        // Bikin 4 titik tengah (5 segmen) dengan offset acak
        const points = [{ x: this.x1, y: this.y1 }];
        const segmentCount = 5;
        // Panjang zigzag menyesuaikan jarak, tapi dibatasi biar nggak ekstrem
        const maxOffset = Math.min(14, this.length * 0.12);

        for (let i = 1; i < segmentCount; i++) {
            const t = i / segmentCount;
            const baseX = this.x1 + this.dx * t;
            const baseY = this.y1 + this.dy * t;
            const offset = (Math.random() - 0.5) * maxOffset * 2;
            points.push({
                x: baseX + this.nx * offset,
                y: baseY + this.ny * offset
            });
        }
        points.push({ x: this.x2, y: this.y2 });

        this.segments = points;
    }

    update(dt) {
        this.life -= dt;
        if (this.life <= 0) {
            this.markedForDeletion = true;
            return;
        }
        // Regenerate zigzag berkala biar keliatan flicker
        this.lastRegen += dt;
        if (this.lastRegen >= this.regenInterval) {
            this.lastRegen = 0;
            this.regenerate();
        }
    }

    draw() {
        const t = this.life / this.maxLife;

        // Flicker: alpha naik-turun cepat + sedikit randomness
        const flicker = 0.5 + Math.sin(this.life * 60) * 0.3 + Math.random() * 0.2;
        const alpha = Math.max(0, Math.min(1, t * flicker));

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // ── Layer 1: glow lebar (tanpa shadowBlur, pakai stroke tebal transparan) ──
        ctx.strokeStyle = this.color;
        ctx.globalAlpha = alpha * 0.3;
        ctx.lineWidth = 6;
        this._strokePath();

        // ── Layer 2: outer core ──
        ctx.globalAlpha = alpha * 0.7;
        ctx.lineWidth = 2.5;
        this._strokePath();

        // ── Layer 3: white-hot core ──
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        this._strokePath();

        ctx.restore();
    }

    _strokePath() {
        ctx.beginPath();
        ctx.moveTo(this.segments[0].x, this.segments[0].y);
        for (let i = 1; i < this.segments.length; i++) {
            ctx.lineTo(this.segments[i].x, this.segments[i].y);
        }
        ctx.stroke();
    }
}
Perubahan utama
Aspek	Sebelum	Sesudah
Bentuk	Garis lurus	Zigzag 5 segmen
Regenerate	Tiap frame (kalo ada)	Setiap 55ms — flicker tapi hemat
shadowBlur	✅ Dipakai (mahal)	❌ Dibuang, ganti 3 layer stroke
Warna	Satu warna	Ungu → ungu → putih (glow palsu)
Flicker	Statis	Alpha berdenyut + random
Life	0.12s	0.18s — lebih keliatan
Trick hemat: shadowBlur itu ~10x lebih mahal dari stroke biasa. Dengan 3 layer stroke (lebar transparan + sedang + tipis putih), efeknya mirip glow tapi jauh lebih cepat.

Bonus: optimasi tambahan
1. Limit beam aktif
Kalau banyak tesla tower, batasi total beam:

Di dalam gameLoop() setelah projectiles.forEach(p => p.update()), tambahkan:

js
// Batasi total lightning beam aktif (safety)
const MAX_BEAMS = 40;
const beams = projectiles.filter(p => p instanceof LightningBeam);
if (beams.length > MAX_BEAMS) {
    // Hapus yang paling tua (life terkecil)
    beams.sort((a, b) => a.life - b.life);
    for (let i = 0; i < beams.length - MAX_BEAMS; i++) {
        beams[i].markedForDeletion = true;
    }
}

 Chromatic flicker (opsional — lebih realistis)
Kalau mau lightning makin keliatan "listrik asli", di draw() layer 3, ganti warna putih kadang-kadang:

js
ctx.strokeStyle = Math.random() < 0.3 ? '#a855f7' : '#ffffff';
Nanti kadang putih, kadang ungu — kayak arus listrik.

Tuning parameter flicker
Semua di constructor:

Parameter	Efek
life: 0.18	Perpanjang = lebih lama keliatan, lebih berat
regenInterval: 0.055	Kecilin = makin "hidup", makin berat. Naikin = lebih hemat
segmentCount: 5	Naikin = zigzag lebih detail, lebih berat
maxOffset: 14	Naikin = zigzag lebih dramatis
Saran tuning:

Performa diutamakan: regenInterval: 0.08, segmentCount: 4, maxOffset: 10

Visual diutamakan: regenInterval: 0.03, segmentCount: 7, maxOffset: 18

Balanced (default): kayak di atas

