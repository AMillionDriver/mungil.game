# Screenshot Generator

Auto-generate game thumbnails menggunakan Puppeteer.

## Setup

```bash
npm install
```

## Auto Setup (Recommended)

Jalankan script untuk auto-generate list game dari `games.js`:

```bash
npm run setup
```

Script akan membaca `scripts/games.js` dan membuat `screenshot.js` dengan semua game yang ada.

## Run Screenshot

```bash
npm run screenshot
```

## Manual Configuration

Edit `screenshot.js` jika mau custom:
- Tambah/hapus game manual
- Ganti ukuran viewport (default: 800×450)
- Ganti delay (default: 2 detik)

## Output

Screenshot tersimpan di `../assets/thumbs/`:
- Format: `{game-name}.png`

## Tips

- **Auto mode**: `npm run setup` lalu `npm run screenshot`
- **Local**: Script pakai relative path, jalan tanpa server
- **Online**: Edit URL jadi `https://game.mungil.my.id/...`
- **Update**: Jalankan lagi untuk refresh screenshot
